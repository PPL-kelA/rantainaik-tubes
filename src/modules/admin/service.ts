import * as repo from "./repo";
import { Prisma } from "@prisma/client";
import {
  ReadinessWeights,
  MatchingWeights,
  PlatformParams,
  DEFAULT_READINESS_WEIGHTS,
  DEFAULT_MATCHING_WEIGHTS,
  DEFAULT_PLATFORM_CONFIG,
  DEFAULT_COMPENSATION_MATRIX,
} from "./rules";
import {
  ReadinessWeightsSchema,
  MatchingWeightsSchema,
  PlatformParamsSchema,
  CreateCategorySchema,
  CreateServiceSchema,
  CreateCertificationSchema,
  CreateRecommendationRuleSchema,
} from "./schema";
import { audit } from "@/modules/audit/service";

/**
 * Loads platform configuration from database with schema fallback.
 * Strictly avoids hardcoding numbers across business logic.
 */
export async function loadPlatformConfig(): Promise<{
  params: PlatformParams;
  compensationMatrix: Array<{
    stage: string;
    label: string;
    buyerRefundRule: string;
    umkmCompensationRule: string;
  }>;
}> {
  try {
    const raw = await repo.getPlatformConfig();
    return {
      params: {
        commissionPercent: raw.commissionPercent,
        minLots: raw.minLots,
        maxLots: raw.maxLots,
        minLotQty: raw.minLotQty,
        fundingDeadlineHours: raw.fundingDeadlineHours,
        autoConfirmMaterialHours: raw.autoConfirmMaterialHours,
        autoConfirmQcDays: raw.autoConfirmQcDays,
        umkmInactivityGraceHours: raw.umkmInactivityGraceHours,
        disputeClaimWindowDays: raw.disputeClaimWindowDays,
        cancellationFeePercent: raw.cancellationFeePercent,
      },
      compensationMatrix:
        (raw.compensationMatrix as unknown as Array<{
          stage: string;
          label: string;
          buyerRefundRule: string;
          umkmCompensationRule: string;
        }>) || DEFAULT_COMPENSATION_MATRIX,
    };
  } catch {
    return {
      params: DEFAULT_PLATFORM_CONFIG,
      compensationMatrix: DEFAULT_COMPENSATION_MATRIX,
    };
  }
}

/**
 * Loads scoring configuration (Readiness and Matching weights) from database.
 */
export async function loadScoringConfig(): Promise<{
  readiness: ReadinessWeights;
  matching: MatchingWeights;
}> {
  try {
    const raw = await repo.getScoringConfig();
    return {
      readiness: {
        legalitas: raw.readinessLegalitas,
        fasilitas: raw.readinessKapasitas,
        mutu: raw.readinessMutu,
        rekamJejak: raw.readinessRekamJejak,
        administrasi: raw.readinessAdmin,
        finansial: raw.readinessFinansial,
      },
      matching: {
        kategori: raw.matchingKategori,
        kapasitas: raw.matchingKapasitas,
        bahanDekorasi: raw.matchingBahan,
        leadTime: raw.matchingLeadTime,
        lokasi: raw.matchingLokasi,
        readiness: raw.matchingReadiness,
        reputasi: raw.matchingReputasi,
      },
    };
  } catch {
    return {
      readiness: DEFAULT_READINESS_WEIGHTS,
      matching: DEFAULT_MATCHING_WEIGHTS,
    };
  }
}

export async function updateReadinessWeights(
  adminId: string,
  weights: ReadinessWeights
) {
  const validated = ReadinessWeightsSchema.parse(weights);
  const updated = await repo.updateReadinessWeights(validated);

  await audit({
    entity: "SCORING_CONFIG",
    entityId: "default",
    action: "UPDATE_READINESS_WEIGHTS",
    actorId: adminId,
    details: validated as unknown as Prisma.JsonObject,
  });

  return updated;
}

export async function updateMatchingWeights(
  adminId: string,
  weights: MatchingWeights
) {
  const validated = MatchingWeightsSchema.parse(weights);
  const updated = await repo.updateMatchingWeights(validated);

  await audit({
    entity: "SCORING_CONFIG",
    entityId: "default",
    action: "UPDATE_MATCHING_WEIGHTS",
    actorId: adminId,
    details: validated as unknown as Prisma.JsonObject,
  });

  return updated;
}

export async function updatePlatformParameters(
  adminId: string,
  params: PlatformParams
) {
  const validated = PlatformParamsSchema.parse(params);
  const updated = await repo.updatePlatformConfig(validated);

  await audit({
    entity: "PLATFORM_CONFIG",
    entityId: "default",
    action: "UPDATE_PLATFORM_CONFIG",
    actorId: adminId,
    details: validated as unknown as Prisma.JsonObject,
  });

  return updated;
}

export async function resetReadinessWeightsToDefault(adminId: string) {
  return updateReadinessWeights(adminId, DEFAULT_READINESS_WEIGHTS);
}

export async function resetMatchingWeightsToDefault(adminId: string) {
  return updateMatchingWeights(adminId, DEFAULT_MATCHING_WEIGHTS);
}

export async function resetPlatformParametersToDefault(adminId: string) {
  return updatePlatformParameters(adminId, DEFAULT_PLATFORM_CONFIG);
}

// Master data handlers
export async function createCategory(
  adminId: string,
  data: {
    name: string;
    slug: string;
    description?: string | null;
    parentId?: string | null;
  }
) {
  const validated = CreateCategorySchema.parse(data);
  const category = await repo.createCategory(validated);

  await audit({
    entity: "PRODUCT_CATEGORY",
    entityId: category.id,
    action: "CREATE_CATEGORY",
    actorId: adminId,
    details: {
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
    },
  });

  return category;
}

export async function createProductionService(
  adminId: string,
  data: { name: string; slug: string; description?: string | null }
) {
  const validated = CreateServiceSchema.parse(data);
  const service = await repo.createProductionService(validated);

  await audit({
    entity: "PRODUCTION_SERVICE",
    entityId: service.id,
    action: "CREATE_PRODUCTION_SERVICE",
    actorId: adminId,
    details: { name: service.name, slug: service.slug },
  });

  return service;
}

export async function createCertification(
  adminId: string,
  data: { name: string; issuer?: string | null; description?: string | null }
) {
  const validated = CreateCertificationSchema.parse(data);
  const cert = await repo.createCertification(validated);

  await audit({
    entity: "CERTIFICATION",
    entityId: cert.id,
    action: "CREATE_CERTIFICATION",
    actorId: adminId,
    details: { name: cert.name, issuer: cert.issuer },
  });

  return cert;
}

export async function createRecommendationRule(
  adminId: string,
  data: {
    component: string;
    condition: string;
    text: string;
    points: number;
    difficulty: "MUDAH" | "SEDANG" | "SULIT";
    link?: string | null;
  }
) {
  const validated = CreateRecommendationRuleSchema.parse(data);
  const rule = await repo.createRecommendationRule(validated);

  await audit({
    entity: "RECOMMENDATION_RULE",
    entityId: rule.id,
    action: "CREATE_RECOMMENDATION_RULE",
    actorId: adminId,
    details: {
      text: rule.text,
      points: rule.points,
      difficulty: rule.difficulty,
    },
  });

  return rule;
}

export async function listCategoriesHierarchy() {
  return repo.listCategoriesHierarchy();
}

export async function listProductionServices() {
  return repo.listProductionServices();
}

export async function listCertifications() {
  return repo.listCertifications();
}

export async function listRecommendationRules() {
  return repo.listRecommendationRules();
}

export async function deleteRecommendationRule(adminId: string, id: string) {
  const deleted = await repo.deleteRecommendationRule(id);

  await audit({
    entity: "RECOMMENDATION_RULE",
    entityId: id,
    action: "DELETE_RECOMMENDATION_RULE",
    actorId: adminId,
    details: { deleted: true },
  });

  return deleted;
}
