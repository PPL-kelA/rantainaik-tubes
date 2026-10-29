import { db } from "@/lib/db";
import * as repo from "./repo";
import {
  computeReadiness,
  recommendNextSteps,
  ReadinessInput,
  ReadinessResult,
  RecommendedStep,
} from "./rules";
import { loadScoringConfig } from "@/modules/admin/service";
import { audit } from "@/modules/audit/service";
import { Prisma } from "@prisma/client";

/**
 * Gathers all raw organization operational data and prepares pure ReadinessInput.
 */
async function buildReadinessInput(organizationId: string): Promise<{
  input: ReadinessInput;
  gaps: string[];
}> {
  const [org, documents, capabilities, machines, portfolio, certifications] =
    await Promise.all([
      db.organization.findUnique({
        where: { id: organizationId },
      }),
      db.document.findMany({
        where: { organizationId },
      }),
      db.capability.findMany({
        where: { organizationId },
      }),
      db.machineAsset.findMany({
        where: { organizationId },
      }),
      db.portfolioItem.findMany({
        where: { organizationId },
      }),
      db.orgCertification.findMany({
        where: { organizationId },
        include: { certification: true },
      }),
    ]);

  if (!org) {
    throw new Error("Organisasi tidak ditemukan");
  }

  const now = new Date();
  const gaps: string[] = [];

  // Helper check document status and validity
  const getDocStatus = (type: string) => {
    const doc = documents.find((d) => d.type === type);
    if (!doc) return { verified: false, declared: false, expired: false };
    const isExpired = doc.validUntil ? new Date(doc.validUntil) < now : false;
    return {
      verified: doc.status === "VERIFIED" && !isExpired,
      declared: doc.status !== "REJECTED" && !isExpired,
      expired: isExpired,
    };
  };

  const nib = getDocStatus("NIB");
  const npwp = getDocStatus("NPWP");
  const izin = getDocStatus("IZIN_USAHA");
  const workshopDoc = getDocStatus("FOTO_BENGKEL");

  if (!nib.verified) {
    gaps.push("nib == false", "nib_verified == false", "nib == null");
  }
  if (!npwp.verified) {
    gaps.push("npwp == false", "npwp_verified == false");
  }
  if (!izin.verified) {
    gaps.push("izin == false", "izin_usaha == false");
  }

  // A. Legalitas
  const legalitas = {
    nibVerified: nib.verified,
    nibDeclared: nib.declared,
    nibExpired: nib.expired,
    npwpVerified: npwp.verified,
    npwpDeclared: npwp.declared,
    npwpExpired: npwp.expired,
    izinUsahaVerified: izin.verified,
    izinUsahaDeclared: izin.declared,
    izinUsahaExpired: izin.expired,
    alamatFotoVerified: Boolean(org.address && workshopDoc.verified),
    alamatFotoDeclared: Boolean(org.address || workshopDoc.declared),
  };

  // B. Kapasitas
  const hasMonthlyCapacity = capabilities.some((c) => c.monthlyCapacity > 0);
  const hasMachines = machines.length > 0;
  const hasOperatorInfo = Boolean(org.operatorCount && org.operatorCount > 0);
  const hasWorkshopPhoto = Boolean(workshopDoc.declared);
  const hasLargestOrderRecord = portfolio.some(
    (p) => p.largestOrderQty && p.largestOrderQty > 0
  );

  if (!hasMachines) {
    gaps.push("mesin == false", "machine_list_count == 0");
  }
  if (!hasMonthlyCapacity) {
    gaps.push("kapasitas == false");
  }

  const kapasitas = {
    hasMonthlyCapacity,
    hasMachines,
    hasOperatorInfo,
    hasWorkshopPhoto,
    hasLargestOrderRecord,
  };

  // C. Mutu
  const hasSopQc = documents.some(
    (d) =>
      d.fileName?.toLowerCase().includes("sop") ||
      d.fileName?.toLowerCase().includes("qc")
  );
  const activeCerts = certifications.filter(
    (c) => !c.validUntil || new Date(c.validUntil) >= now
  );
  const hasCertOrLabTest = activeCerts.length > 0;
  const hasPortfolioSamples = portfolio.length > 0;
  const canPatternOrTechPack = capabilities.some((c) =>
    c.services.some(
      (s) =>
        s.toLowerCase().includes("pola") ||
        s.toLowerCase().includes("grading") ||
        s.toLowerCase().includes("sampling") ||
        s.toLowerCase().includes("full package")
    )
  );

  if (!hasSopQc) {
    gaps.push("sop_qc == false", "qc_inline_sop == null");
  }
  if (!hasCertOrLabTest) {
    gaps.push("uji_lab == false", "fabric_lab_test == null");
  }
  if (!hasPortfolioSamples) {
    gaps.push("portofolio == false");
  }
  gaps.push("avg_response_time > 24");

  const mutu = {
    hasSopQc,
    hasCertOrLabTest,
    hasPortfolioSamples,
    canPatternOrTechPack,
  };

  // D. Rekam Jejak (default no history for initial phase)
  const rekamJejak = {
    hasHistory: false, // Initial Phase: default 50%
  };

  // E. Administrasi
  const hasDigitalRecord = Boolean(
    org.description && org.description.length > 20
  );
  if (!hasDigitalRecord) gaps.push("catat_produksi == false");

  const administrasi = {
    hasDigitalRecord,
    fastResponseTime: true,
    fullCatalog: portfolio.length >= 3,
  };

  // F. Finansial
  const finansial = {
    hasWorkingCapital: true,
    hasSimpleFinancialReport: false,
    hasMaterialSupplierAccess: capabilities.some((c) => c.materials.length > 2),
  };

  return {
    input: {
      legalitas,
      kapasitas,
      mutu,
      rekamJejak,
      administrasi,
      finansial,
    },
    gaps,
  };
}

/**
 * Calculates Readiness Score using pure logic, loads config dynamically from DB,
 * and saves a persistent snapshot.
 */
export async function calculateAndSaveReadiness(
  organizationId: string
): Promise<{
  snapshot: ReadinessResult;
  recommendations: RecommendedStep[];
  calculatedAt: string;
}> {
  const [scoringConfig, { input, gaps }, rules] = await Promise.all([
    loadScoringConfig(),
    buildReadinessInput(organizationId),
    repo.listRecommendationRules(),
  ]);

  // Pure calculation
  const result = computeReadiness(input, scoringConfig.readiness);

  // Recommendations
  const recommendations = recommendNextSteps(gaps, rules);

  // Save persistent snapshot
  const saved = await repo.createReadinessSnapshot(
    organizationId,
    result.totalScore,
    result.tierKey,
    result as unknown as Prisma.InputJsonValue
  );

  await audit({
    entity: "READINESS_SNAPSHOT",
    entityId: saved.id,
    action: "CALCULATE_READINESS_SCORE",
    actorId: null,
    details: {
      totalScore: result.totalScore,
      tier: result.tier,
    } as Prisma.JsonObject,
  });

  return {
    snapshot: result,
    recommendations,
    calculatedAt: saved.calculatedAt.toISOString(),
  };
}

/**
 * Fetches the latest readiness score for an organization.
 * If no snapshot exists yet, automatically calculates and persists one.
 */
export async function getReadinessDashboardData(
  organizationId: string
): Promise<{
  snapshot: ReadinessResult;
  recommendations: RecommendedStep[];
  calculatedAt: string;
}> {
  const latest = await repo.getLatestReadinessSnapshot(organizationId);
  const rules = await repo.listRecommendationRules();

  if (latest && latest.componentScores) {
    const rawResult = latest.componentScores as unknown as ReadinessResult;
    // Re-check gaps for fresh recommendations
    const { gaps } = await buildReadinessInput(organizationId);
    const recommendations = recommendNextSteps(gaps, rules);

    return {
      snapshot: rawResult,
      recommendations,
      calculatedAt: latest.calculatedAt.toISOString(),
    };
  }

  // First time calculation
  return calculateAndSaveReadiness(organizationId);
}
