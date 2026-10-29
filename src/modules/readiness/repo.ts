import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getLatestReadinessSnapshot(organizationId: string) {
  return db.readinessSnapshot.findFirst({
    where: { organizationId },
    orderBy: { calculatedAt: "desc" },
  });
}

export async function createReadinessSnapshot(
  organizationId: string,
  totalScore: number,
  tier: string,
  componentScores: Prisma.InputJsonValue
) {
  return db.readinessSnapshot.create({
    data: {
      organizationId,
      totalScore,
      tier,
      componentScores,
    },
  });
}

export async function listRecommendationRules() {
  return db.recommendationRule.findMany({
    orderBy: { points: "desc" },
  });
}
