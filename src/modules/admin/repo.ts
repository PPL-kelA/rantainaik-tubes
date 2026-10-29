import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  DEFAULT_READINESS_WEIGHTS,
  DEFAULT_MATCHING_WEIGHTS,
  DEFAULT_PLATFORM_CONFIG,
  DEFAULT_COMPENSATION_MATRIX,
  ReadinessWeights,
  MatchingWeights,
  PlatformParams,
} from "./rules";

export async function getScoringConfig() {
  const config = await db.scoringConfig.findUnique({
    where: { id: "default" },
  });

  if (!config) {
    return db.scoringConfig.create({
      data: {
        id: "default",
        readinessLegalitas: DEFAULT_READINESS_WEIGHTS.legalitas,
        readinessKapasitas: DEFAULT_READINESS_WEIGHTS.fasilitas,
        readinessMutu: DEFAULT_READINESS_WEIGHTS.mutu,
        readinessRekamJejak: DEFAULT_READINESS_WEIGHTS.rekamJejak,
        readinessAdmin: DEFAULT_READINESS_WEIGHTS.administrasi,
        readinessFinansial: DEFAULT_READINESS_WEIGHTS.finansial,

        matchingKategori: DEFAULT_MATCHING_WEIGHTS.kategori,
        matchingKapasitas: DEFAULT_MATCHING_WEIGHTS.kapasitas,
        matchingBahan: DEFAULT_MATCHING_WEIGHTS.bahanDekorasi,
        matchingLeadTime: DEFAULT_MATCHING_WEIGHTS.leadTime,
        matchingLokasi: DEFAULT_MATCHING_WEIGHTS.lokasi,
        matchingReadiness: DEFAULT_MATCHING_WEIGHTS.readiness,
        matchingReputasi: DEFAULT_MATCHING_WEIGHTS.reputasi,
      },
    });
  }

  return config;
}

export async function updateReadinessWeights(weights: ReadinessWeights) {
  return db.scoringConfig.upsert({
    where: { id: "default" },
    update: {
      readinessLegalitas: weights.legalitas,
      readinessKapasitas: weights.fasilitas,
      readinessMutu: weights.mutu,
      readinessRekamJejak: weights.rekamJejak,
      readinessAdmin: weights.administrasi,
      readinessFinansial: weights.finansial,
    },
    create: {
      id: "default",
      readinessLegalitas: weights.legalitas,
      readinessKapasitas: weights.fasilitas,
      readinessMutu: weights.mutu,
      readinessRekamJejak: weights.rekamJejak,
      readinessAdmin: weights.administrasi,
      readinessFinansial: weights.finansial,
    },
  });
}

export async function updateMatchingWeights(weights: MatchingWeights) {
  return db.scoringConfig.upsert({
    where: { id: "default" },
    update: {
      matchingKategori: weights.kategori,
      matchingKapasitas: weights.kapasitas,
      matchingBahan: weights.bahanDekorasi,
      matchingLeadTime: weights.leadTime,
      matchingLokasi: weights.lokasi,
      matchingReadiness: weights.readiness,
      matchingReputasi: weights.reputasi,
    },
    create: {
      id: "default",
      matchingKategori: weights.kategori,
      matchingKapasitas: weights.kapasitas,
      matchingBahan: weights.bahanDekorasi,
      matchingLeadTime: weights.leadTime,
      matchingLokasi: weights.lokasi,
      matchingReadiness: weights.readiness,
      matchingReputasi: weights.reputasi,
    },
  });
}

export async function getPlatformConfig() {
  const config = await db.platformConfig.findUnique({
    where: { id: "default" },
  });

  if (!config) {
    return db.platformConfig.create({
      data: {
        id: "default",
        commissionPercent: DEFAULT_PLATFORM_CONFIG.commissionPercent,
        minLots: DEFAULT_PLATFORM_CONFIG.minLots,
        maxLots: DEFAULT_PLATFORM_CONFIG.maxLots,
        minLotQty: DEFAULT_PLATFORM_CONFIG.minLotQty,
        fundingDeadlineHours: DEFAULT_PLATFORM_CONFIG.fundingDeadlineHours,
        autoConfirmMaterialHours:
          DEFAULT_PLATFORM_CONFIG.autoConfirmMaterialHours,
        autoConfirmQcDays: DEFAULT_PLATFORM_CONFIG.autoConfirmQcDays,
        umkmInactivityGraceHours:
          DEFAULT_PLATFORM_CONFIG.umkmInactivityGraceHours,
        disputeClaimWindowDays: DEFAULT_PLATFORM_CONFIG.disputeClaimWindowDays,
        cancellationFeePercent: DEFAULT_PLATFORM_CONFIG.cancellationFeePercent,
        compensationMatrix:
          DEFAULT_COMPENSATION_MATRIX as Prisma.InputJsonValue,
      },
    });
  }

  return config;
}

export async function updatePlatformConfig(params: PlatformParams) {
  return db.platformConfig.upsert({
    where: { id: "default" },
    update: {
      commissionPercent: params.commissionPercent,
      minLots: params.minLots,
      maxLots: params.maxLots,
      minLotQty: params.minLotQty,
      fundingDeadlineHours: params.fundingDeadlineHours,
      autoConfirmMaterialHours: params.autoConfirmMaterialHours,
      autoConfirmQcDays: params.autoConfirmQcDays,
      umkmInactivityGraceHours: params.umkmInactivityGraceHours,
      disputeClaimWindowDays: params.disputeClaimWindowDays,
      cancellationFeePercent: params.cancellationFeePercent,
    },
    create: {
      id: "default",
      commissionPercent: params.commissionPercent,
      minLots: params.minLots,
      maxLots: params.maxLots,
      minLotQty: params.minLotQty,
      fundingDeadlineHours: params.fundingDeadlineHours,
      autoConfirmMaterialHours: params.autoConfirmMaterialHours,
      autoConfirmQcDays: params.autoConfirmQcDays,
      umkmInactivityGraceHours: params.umkmInactivityGraceHours,
      disputeClaimWindowDays: params.disputeClaimWindowDays,
      cancellationFeePercent: params.cancellationFeePercent,
      compensationMatrix: DEFAULT_COMPENSATION_MATRIX as Prisma.InputJsonValue,
    },
  });
}

export async function listCategoriesHierarchy() {
  return db.productCategory.findMany({
    where: { parentId: null },
    include: {
      children: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
}) {
  return db.productCategory.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      parentId: data.parentId ?? null,
    },
  });
}

export async function listProductionServices() {
  return db.productionService.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createProductionService(data: {
  name: string;
  slug: string;
  description?: string | null;
}) {
  return db.productionService.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
    },
  });
}

export async function listCertifications() {
  return db.certification.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createCertification(data: {
  name: string;
  issuer?: string | null;
  description?: string | null;
}) {
  return db.certification.create({
    data: {
      name: data.name,
      issuer: data.issuer ?? null,
      description: data.description ?? null,
    },
  });
}

export async function listRecommendationRules() {
  return db.recommendationRule.findMany({
    orderBy: [{ component: "asc" }, { points: "desc" }],
  });
}

export async function createRecommendationRule(data: {
  component: string;
  condition: string;
  text: string;
  points: number;
  difficulty: string;
  link?: string | null;
}) {
  return db.recommendationRule.create({
    data: {
      component: data.component,
      condition: data.condition,
      text: data.text,
      points: data.points,
      difficulty: data.difficulty,
      link: data.link ?? null,
    },
  });
}

export async function deleteRecommendationRule(id: string) {
  return db.recommendationRule.delete({
    where: { id },
  });
}
