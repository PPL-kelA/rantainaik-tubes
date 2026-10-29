import { db } from "@/lib/db";
import {
  Prisma,
  RfqStatus,
  RfqVisibility,
  RfqCategoryType,
  RfqAllocationMode,
} from "@prisma/client";

export async function findRfqById(id: string) {
  return db.rfq.findUnique({
    where: { id },
    include: {
      industryOrg: {
        select: {
          id: true,
          name: true,
          city: true,
          province: true,
          logoUrl: true,
          verificationStatus: true,
          yearEstablished: true,
        },
      },
      items: {
        include: {
          sizes: {
            orderBy: { id: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      requirements: {
        orderBy: { id: "asc" },
      },
      questions: {
        include: {
          askerOrg: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      addendums: {
        orderBy: { addendumNumber: "asc" },
      },
      invitations: true,
    },
  });
}

export async function findRfqByNumber(rfqNumber: string) {
  return db.rfq.findUnique({
    where: { rfqNumber },
    include: {
      industryOrg: {
        select: {
          id: true,
          name: true,
          city: true,
          province: true,
          logoUrl: true,
          verificationStatus: true,
          yearEstablished: true,
        },
      },
      items: {
        include: {
          sizes: {
            orderBy: { id: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      requirements: {
        orderBy: { id: "asc" },
      },
      questions: {
        include: {
          askerOrg: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      addendums: {
        orderBy: { addendumNumber: "asc" },
      },
      invitations: true,
    },
  });
}

export async function listRfqs(filters: {
  industryOrgId?: string;
  statuses?: RfqStatus[];
  visibility?: RfqVisibility;
}) {
  const where: Prisma.RfqWhereInput = {};

  if (filters.industryOrgId) {
    where.industryOrgId = filters.industryOrgId;
  }
  if (filters.statuses && filters.statuses.length > 0) {
    where.status = { in: filters.statuses };
  }
  if (filters.visibility) {
    where.visibility = filters.visibility;
  }

  return db.rfq.findMany({
    where,
    include: {
      industryOrg: {
        select: {
          id: true,
          name: true,
          city: true,
          verificationStatus: true,
        },
      },
      items: {
        include: { sizes: true },
      },
      _count: {
        select: {
          questions: true,
          addendums: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNextRfqNumber(): Promise<string> {
  const count = await db.rfq.count();
  const nextNum = (count + 1).toString().padStart(4, "0");
  const candidate = `RFQ-${nextNum}`;

  // Pastikan unik
  const existing = await db.rfq.findUnique({
    where: { rfqNumber: candidate },
  });
  if (!existing) return candidate;

  // Bila tabrakan, tambahkan timestamp acak
  return `RFQ-${nextNum}-${Date.now().toString().slice(-4)}`;
}

export async function createRfqWithItems(data: {
  rfqNumber: string;
  industryOrgId: string;
  title: string;
  categoryType: RfqCategoryType;
  visibility: RfqVisibility;
  contextDescription?: string | null;
  allocationMode?: RfqAllocationMode;
  maxLotsPerUmkm?: number;
  materialConsistencyRule?: string | null;
  referenceStandard?: Prisma.InputJsonValue;
  pricePolicy?: string | null;
  needSample: boolean;
  sampleCostBearer?: string | null;
  sampleCount?: number | null;
  sampleDeadlineDays?: number | null;
  qaDeadline?: Date | null;
  quotationDeadline: Date;
  targetDeliveryDate: Date;
  deliveryLocation: string;
  staggeredDelivery: boolean;
  releaseTerms?: Prisma.InputJsonValue;
  latePenaltyClause?: string | null;
  indicativeBudget?: bigint | null;
  hideBudget: boolean;
  evaluationWeights?: Prisma.InputJsonValue;
  status: RfqStatus;
  items: Array<{
    name: string;
    categoryId?: string | null;
    fabricType: string;
    gsmMin?: number | null;
    gsmMax?: number | null;
    color: string;
    materialProvidedByBuyer: boolean;
    techPackUrl?: string | null;
    referencePhotoUrl?: string | null;
    constructionNotes?: string | null;
    decorationType?: string | null;
    decorationPlacement?: string | null;
    decorationFileUrl?: string | null;
    labelPackingNotes?: string | null;
    quantityTolerancePercent?: number | null;
    dimensionTolerance?: string | null;
    aqlStandard?: string | null;
    needLabTest: boolean;
    totalQuantity: number;
    sizes: Array<{ size: string; quantity: number }>;
  }>;
  requirements?: Array<{
    type: string;
    description: string;
    isMandatory: boolean;
  }>;
  invitedOrgIds?: string[];
}) {
  return db.rfq.create({
    data: {
      rfqNumber: data.rfqNumber,
      industryOrgId: data.industryOrgId,
      title: data.title,
      categoryType: data.categoryType,
      visibility: data.visibility,
      contextDescription: data.contextDescription,
      allocationMode: data.allocationMode || "TUNGGAL",
      maxLotsPerUmkm: data.maxLotsPerUmkm || 1,
      materialConsistencyRule: data.materialConsistencyRule,
      referenceStandard: data.referenceStandard ?? Prisma.DbNull,
      pricePolicy: data.pricePolicy,
      needSample: data.needSample,
      sampleCostBearer: data.sampleCostBearer,
      sampleCount: data.sampleCount,
      sampleDeadlineDays: data.sampleDeadlineDays,
      qaDeadline: data.qaDeadline,
      quotationDeadline: data.quotationDeadline,
      targetDeliveryDate: data.targetDeliveryDate,
      deliveryLocation: data.deliveryLocation,
      staggeredDelivery: data.staggeredDelivery,
      releaseTerms: data.releaseTerms ?? Prisma.DbNull,
      latePenaltyClause: data.latePenaltyClause,
      indicativeBudget: data.indicativeBudget,
      hideBudget: data.hideBudget,
      evaluationWeights: data.evaluationWeights ?? Prisma.DbNull,
      status: data.status,
      items: {
        create: data.items.map((item) => ({
          name: item.name,
          categoryId: item.categoryId,
          fabricType: item.fabricType,
          gsmMin: item.gsmMin,
          gsmMax: item.gsmMax,
          color: item.color,
          materialProvidedByBuyer: item.materialProvidedByBuyer,
          techPackUrl: item.techPackUrl,
          referencePhotoUrl: item.referencePhotoUrl,
          constructionNotes: item.constructionNotes,
          decorationType: item.decorationType,
          decorationPlacement: item.decorationPlacement,
          decorationFileUrl: item.decorationFileUrl,
          labelPackingNotes: item.labelPackingNotes,
          quantityTolerancePercent: item.quantityTolerancePercent,
          dimensionTolerance: item.dimensionTolerance,
          aqlStandard: item.aqlStandard,
          needLabTest: item.needLabTest,
          totalQuantity: item.totalQuantity,
          sizes: {
            create: item.sizes.map((s) => ({
              size: s.size,
              quantity: s.quantity,
            })),
          },
        })),
      },
      requirements: data.requirements
        ? {
            create: data.requirements.map((req) => ({
              type: req.type,
              description: req.description,
              isMandatory: req.isMandatory,
            })),
          }
        : undefined,
      invitations:
        data.invitedOrgIds && data.invitedOrgIds.length > 0
          ? {
              create: data.invitedOrgIds.map((orgId) => ({
                umkmOrgId: orgId,
              })),
            }
          : undefined,
    },
    include: {
      items: { include: { sizes: true } },
      requirements: true,
      invitations: true,
    },
  });
}

export async function updateRfqStatus(
  id: string,
  status: RfqStatus,
  cancelReason?: string | null
) {
  return db.rfq.update({
    where: { id },
    data: {
      status,
      cancelReason: cancelReason || undefined,
    },
  });
}

export async function createQuestion(
  rfqId: string,
  askerOrgId: string,
  question: string
) {
  return db.rfqQuestion.create({
    data: {
      rfqId,
      askerOrgId,
      question,
    },
  });
}

export async function answerQuestion(questionId: string, answer: string) {
  return db.rfqQuestion.update({
    where: { id: questionId },
    data: {
      answer,
      answeredAt: new Date(),
    },
  });
}

export async function getAddendumCount(rfqId: string): Promise<number> {
  return db.rfqAddendum.count({
    where: { rfqId },
  });
}

export async function createAddendum(
  rfqId: string,
  addendumNumber: number,
  summary: string,
  changes?: Prisma.InputJsonValue
) {
  return db.rfqAddendum.create({
    data: {
      rfqId,
      addendumNumber,
      summary,
      changes: changes ?? Prisma.DbNull,
    },
  });
}

export async function findExpiredOpenRfqs(now: Date = new Date()) {
  return db.rfq.findMany({
    where: {
      status: "OPEN",
      quotationDeadline: {
        lt: now,
      },
    },
  });
}
