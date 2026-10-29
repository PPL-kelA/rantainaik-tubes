import { audit } from "@/modules/audit/service";
import * as repo from "./repo";
import {
  validateRfq,
  transitionRfqStatus,
  canAccessRfq,
  RfqValidationInput,
  RfqStatus,
  RfqCategoryType,
  RfqVisibility,
} from "./rules";
import { z } from "zod";
import {
  createOrUpdateRfqSchema,
  createQuestionSchema,
  answerQuestionSchema,
  createAddendumSchema,
  cancelRfqSchema,
} from "./schema";

export async function createDraftRfq(
  data: z.infer<typeof createOrUpdateRfqSchema>,
  industryOrgId: string,
  actorId?: string | null
) {
  const rfqNumber = await repo.getNextRfqNumber();

  const rfq = await repo.createRfqWithItems({
    rfqNumber,
    industryOrgId,
    title: data.title,
    categoryType: data.categoryType,
    visibility: data.visibility,
    contextDescription: data.contextDescription,
    allocationMode: data.allocationMode,
    maxLotsPerUmkm: data.maxLotsPerUmkm,
    materialConsistencyRule: data.materialConsistencyRule,
    needSample: data.needSample,
    sampleCostBearer: data.sampleCostBearer,
    sampleCount: data.sampleCount,
    sampleDeadlineDays: data.sampleDeadlineDays,
    qaDeadline: data.qaDeadline ? new Date(data.qaDeadline) : null,
    quotationDeadline: new Date(data.quotationDeadline),
    targetDeliveryDate: new Date(data.targetDeliveryDate),
    deliveryLocation: data.deliveryLocation,
    staggeredDelivery: data.staggeredDelivery,
    releaseTerms: data.releaseTerms,
    latePenaltyClause: data.latePenaltyClause,
    indicativeBudget: data.indicativeBudget
      ? BigInt(data.indicativeBudget)
      : null,
    hideBudget: data.hideBudget,
    evaluationWeights: data.evaluationWeights,
    status: "DRAFT",
    items: data.items.map((item) => ({
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
      sizes: item.sizes,
    })),
    requirements: data.requirements,
    invitedOrgIds: data.invitedOrgIds,
  });

  await audit({
    entity: "RFQ",
    entityId: rfq.id,
    action: "CREATE_RFQ_DRAFT",
    actorId: actorId || null,
    details: {
      rfqNumber: rfq.rfqNumber,
      title: rfq.title,
      itemCount: rfq.items.length,
    },
  });

  return rfq;
}

export async function publishRfq(
  rfqId: string,
  industryOrgId: string,
  actorId?: string | null
) {
  const rfq = await repo.findRfqById(rfqId);
  if (!rfq) {
    throw new Error("RFQ tidak ditemukan");
  }

  if (rfq.industryOrgId !== industryOrgId) {
    throw new Error("Anda tidak memiliki hak akses untuk menerbitkan RFQ ini");
  }

  // Format validasi pure function
  const validationInput: RfqValidationInput = {
    title: rfq.title,
    categoryType: rfq.categoryType as RfqCategoryType,
    visibility: rfq.visibility as RfqVisibility,
    quotationDeadline: rfq.quotationDeadline,
    qaDeadline: rfq.qaDeadline,
    targetDeliveryDate: rfq.targetDeliveryDate,
    indicativeBudget: rfq.indicativeBudget
      ? Number(rfq.indicativeBudget)
      : null,
    items: rfq.items.map((it) => ({
      name: it.name,
      fabricType: it.fabricType,
      gsmMin: it.gsmMin,
      gsmMax: it.gsmMax,
      color: it.color,
      materialProvidedByBuyer: it.materialProvidedByBuyer,
      techPackUrl: it.techPackUrl,
      referencePhotoUrl: it.referencePhotoUrl,
      constructionNotes: it.constructionNotes,
      decorationType: it.decorationType,
      decorationPlacement: it.decorationPlacement,
      labelPackingNotes: it.labelPackingNotes,
      quantityTolerancePercent: it.quantityTolerancePercent,
      dimensionTolerance: it.dimensionTolerance,
      aqlStandard: it.aqlStandard,
      needLabTest: it.needLabTest,
      totalQuantity: it.totalQuantity,
      sizes: it.sizes.map((s) => ({ size: s.size, quantity: s.quantity })),
    })),
  };

  const valResult = validateRfq(validationInput);
  if (!valResult.isValid) {
    throw new Error(
      `Validasi penerbitan RFQ gagal: ${valResult.errors.join("; ")}`
    );
  }

  const transition = transitionRfqStatus(rfq.status as RfqStatus, "OPEN");
  if (!transition.success) {
    throw new Error(
      transition.error || "Gagal mengubah status RFQ menjadi OPEN"
    );
  }

  const updated = await repo.updateRfqStatus(rfqId, "OPEN");

  await audit({
    entity: "RFQ",
    entityId: rfq.id,
    action: "PUBLISH_RFQ",
    actorId: actorId || null,
    details: {
      rfqNumber: rfq.rfqNumber,
      title: rfq.title,
      status: "OPEN",
    },
  });

  return updated;
}

export async function cancelRfq(
  data: z.infer<typeof cancelRfqSchema>,
  industryOrgId: string,
  actorId?: string | null
) {
  const rfq = await repo.findRfqById(data.rfqId);
  if (!rfq) {
    throw new Error("RFQ tidak ditemukan");
  }

  if (rfq.industryOrgId !== industryOrgId) {
    throw new Error("Anda tidak berhak membatalkan RFQ ini");
  }

  const transition = transitionRfqStatus(rfq.status as RfqStatus, "CANCELLED", {
    cancelReason: data.cancelReason,
  });

  if (!transition.success) {
    throw new Error(transition.error || "Gagal membatalkan RFQ");
  }

  const updated = await repo.updateRfqStatus(
    data.rfqId,
    "CANCELLED",
    data.cancelReason
  );

  await audit({
    entity: "RFQ",
    entityId: rfq.id,
    action: "CANCEL_RFQ",
    actorId: actorId || null,
    details: {
      rfqNumber: rfq.rfqNumber,
      cancelReason: data.cancelReason,
    },
  });

  return updated;
}

export async function askQuestion(
  data: z.infer<typeof createQuestionSchema>,
  umkmOrgId: string,
  actorId?: string | null
) {
  const rfq = await repo.findRfqById(data.rfqId);
  if (!rfq) {
    throw new Error("RFQ tidak ditemukan");
  }

  if (rfq.status !== "OPEN") {
    throw new Error("Pertanyaan hanya dapat diajukan saat RFQ berstatus OPEN");
  }

  if (rfq.qaDeadline && new Date() > new Date(rfq.qaDeadline)) {
    throw new Error("Tenggat tanya jawab untuk RFQ ini telah berakhir");
  }

  // Visibilitas R-06
  const invitedIds = rfq.invitations.map((inv) => inv.umkmOrgId);
  if (!canAccessRfq(rfq.visibility as RfqVisibility, umkmOrgId, invitedIds)) {
    throw new Error("Anda tidak memiliki akses ke RFQ undangan ini");
  }

  const question = await repo.createQuestion(
    data.rfqId,
    umkmOrgId,
    data.question
  );

  await audit({
    entity: "RFQ_QUESTION",
    entityId: question.id,
    action: "ASK_QUESTION",
    actorId: actorId || null,
    details: {
      rfqId: rfq.id,
      rfqNumber: rfq.rfqNumber,
    },
  });

  return question;
}

export async function answerQuestion(
  data: z.infer<typeof answerQuestionSchema>,
  _industryOrgId: string,
  actorId?: string | null
) {
  const updated = await repo.answerQuestion(data.questionId, data.answer);

  await audit({
    entity: "RFQ_QUESTION",
    entityId: data.questionId,
    action: "ANSWER_QUESTION",
    actorId: actorId || null,
    details: {
      answered: true,
    },
  });

  return updated;
}

export async function createAddendum(
  data: z.infer<typeof createAddendumSchema>,
  industryOrgId: string,
  actorId?: string | null
) {
  const rfq = await repo.findRfqById(data.rfqId);
  if (!rfq) {
    throw new Error("RFQ tidak ditemukan");
  }

  if (rfq.industryOrgId !== industryOrgId) {
    throw new Error("Anda tidak berhak membuat addendum untuk RFQ ini");
  }

  if (rfq.status !== "OPEN") {
    throw new Error(
      "Addendum hanya dapat diterbitkan pada RFQ yang sedang OPEN (R-04)"
    );
  }

  const currentCount = await repo.getAddendumCount(data.rfqId);
  const nextNumber = currentCount + 1;

  const addendum = await repo.createAddendum(
    data.rfqId,
    nextNumber,
    data.summary,
    data.changes
  );

  await audit({
    entity: "RFQ_ADDENDUM",
    entityId: addendum.id,
    action: "CREATE_ADDENDUM",
    actorId: actorId || null,
    details: {
      rfqNumber: rfq.rfqNumber,
      addendumNumber: nextNumber,
      summary: data.summary,
    },
  });

  // Hook notifikasi dan penanda penawaran perlu konfirmasi (Tahap 10)
  return addendum;
}

/**
 * Scheduled job stub: memeriksa RFQ OPEN yang telah melewati quotationDeadline
 * dan mengubahnya menjadi EXPIRED bila tidak ada penawaran.
 */
export async function checkAndExpireRfqsJob(now: Date = new Date()) {
  const expiredCandidates = await repo.findExpiredOpenRfqs(now);
  const expiredIds: string[] = [];

  for (const rfq of expiredCandidates) {
    // Di Fase 1 Tahap 7, belum ada penawaran (bids = 0), jadi langsung expired
    await repo.updateRfqStatus(rfq.id, "EXPIRED");
    expiredIds.push(rfq.id);

    await audit({
      entity: "RFQ",
      entityId: rfq.id,
      action: "AUTO_EXPIRE_RFQ",
      actorId: null,
      details: {
        rfqNumber: rfq.rfqNumber,
        expiredAt: now.toISOString(),
      },
    });
  }

  return {
    processedCount: expiredCandidates.length,
    expiredIds,
  };
}
