import { z } from "zod";

export const rfqItemSizeSchema = z.object({
  size: z.string().min(1, "Ukuran wajib diisi"),
  quantity: z.number().int().min(0, "Kuantitas tidak boleh negatif"),
});

export const rfqItemSchema = z.object({
  name: z.string().min(2, "Nama item minimal 2 karakter"),
  categoryId: z.string().optional().nullable(),
  fabricType: z.string().min(2, "Jenis bahan kain wajib diisi"),
  gsmMin: z.number().int().positive().optional().nullable(),
  gsmMax: z.number().int().positive().optional().nullable(),
  color: z.string().min(1, "Warna wajib diisi"),
  materialProvidedByBuyer: z.boolean().default(false),
  techPackUrl: z.string().url().optional().nullable().or(z.literal("")),
  referencePhotoUrl: z.string().url().optional().nullable().or(z.literal("")),
  constructionNotes: z.string().optional().nullable(),
  decorationType: z.string().default("TIDAK_ADA"),
  decorationPlacement: z.string().optional().nullable(),
  decorationFileUrl: z.string().url().optional().nullable().or(z.literal("")),
  labelPackingNotes: z.string().optional().nullable(),
  quantityTolerancePercent: z.number().min(0).max(10).default(3.0),
  dimensionTolerance: z.string().default("±1 cm"),
  aqlStandard: z.string().default("AQL 2.5"),
  needLabTest: z.boolean().default(false),
  totalQuantity: z
    .number()
    .int()
    .positive("Total kuantitas item harus lebih besar dari 0"),
  sizes: z
    .array(rfqItemSizeSchema)
    .min(1, "Minimal harus ada satu rincian ukuran"),
});

export const rfqRequirementSchema = z.object({
  type: z.enum(["LEGALITAS", "MUTU", "PENGALAMAN", "READINESS"]),
  description: z.string().min(3, "Deskripsi syarat minimal 3 karakter"),
  isMandatory: z.boolean().default(true),
});

export const createOrUpdateRfqSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Judul RFQ minimal 5 karakter"),
  categoryType: z.enum(["SERAGAM", "MERCHANDISE", "MAKLON"]).default("SERAGAM"),
  visibility: z.enum(["TERBUKA", "UNDANGAN"]).default("TERBUKA"),
  contextDescription: z.string().optional().nullable(),
  allocationMode: z.enum(["TUNGGAL", "LOT"]).default("TUNGGAL"),
  maxLotsPerUmkm: z.number().int().min(1).default(1),
  materialConsistencyRule: z.string().optional().nullable(),
  needSample: z.boolean().default(false),
  sampleCostBearer: z.string().optional().nullable(),
  sampleCount: z.number().int().min(1).optional().nullable(),
  sampleDeadlineDays: z.number().int().min(1).optional().nullable(),
  qaDeadline: z.string().optional().nullable(),
  quotationDeadline: z.string().min(1, "Tenggat penawaran wajib diisi"),
  targetDeliveryDate: z
    .string()
    .min(1, "Target tanggal pengiriman wajib diisi"),
  deliveryLocation: z.string().min(3, "Lokasi pengiriman wajib diisi"),
  staggeredDelivery: z.boolean().default(false),
  releaseTerms: z.any().optional(),
  latePenaltyClause: z.string().optional().nullable(),
  indicativeBudget: z.number().int().nonnegative().optional().nullable(),
  hideBudget: z.boolean().default(false),
  evaluationWeights: z
    .object({
      price: z.number().default(35),
      compliance: z.number().default(25),
      timeline: z.number().default(20),
      reputation: z.number().default(20),
    })
    .default({ price: 35, compliance: 25, timeline: 20, reputation: 20 }),
  items: z.array(rfqItemSchema).min(1, "Minimal harus ada 1 item dalam RFQ"),
  requirements: z.array(rfqRequirementSchema).default([]),
  invitedOrgIds: z.array(z.string()).default([]),
});

export const createQuestionSchema = z.object({
  rfqId: z.string().min(1, "ID RFQ wajib diisi"),
  question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
});

export const answerQuestionSchema = z.object({
  questionId: z.string().min(1, "ID Pertanyaan wajib diisi"),
  answer: z.string().min(3, "Jawaban minimal 3 karakter"),
});

export const createAddendumSchema = z.object({
  rfqId: z.string().min(1, "ID RFQ wajib diisi"),
  summary: z.string().min(5, "Ringkasan addendum minimal 5 karakter"),
  changes: z.any().optional(),
});

export const cancelRfqSchema = z.object({
  rfqId: z.string().min(1, "ID RFQ wajib diisi"),
  cancelReason: z.string().min(5, "Alasan pembatalan minimal 5 karakter"),
});
