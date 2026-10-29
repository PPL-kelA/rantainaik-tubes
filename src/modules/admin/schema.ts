import { z } from "zod";
import {
  validateReadinessWeights,
  validateMatchingWeights,
  validatePlatformParams,
} from "./rules";

export const ReadinessWeightsSchema = z
  .object({
    legalitas: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    fasilitas: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    mutu: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    rekamJejak: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    administrasi: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    finansial: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
  })
  .refine(
    (weights) => {
      const validation = validateReadinessWeights(weights);
      return validation.valid;
    },
    {
      message: "Total seluruh bobot Readiness harus berjumlah tepat 100",
      path: ["legalitas"],
    }
  );

export const MatchingWeightsSchema = z
  .object({
    kategori: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    kapasitas: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    bahanDekorasi: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    leadTime: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    lokasi: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    readiness: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
    reputasi: z.coerce.number().min(0, "Bobot tidak boleh negatif"),
  })
  .refine(
    (weights) => {
      const validation = validateMatchingWeights(weights);
      return validation.valid;
    },
    {
      message: "Total seluruh bobot Matching harus berjumlah tepat 100",
      path: ["kategori"],
    }
  );

export const PlatformParamsSchema = z
  .object({
    commissionPercent: z.coerce
      .number()
      .min(0)
      .max(100, "Komisi maksimal 100%"),
    minLots: z.coerce.number().min(1, "Minimal 1 lot"),
    maxLots: z.coerce.number().min(1, "Minimal 1 lot"),
    minLotQty: z.coerce.number().min(1, "Minimal 1 pcs"),
    fundingDeadlineHours: z.coerce.number().min(1, "Minimal 1 jam"),
    autoConfirmMaterialHours: z.coerce.number().min(1, "Minimal 1 jam"),
    autoConfirmQcDays: z.coerce.number().min(1, "Minimal 1 hari kerja"),
    umkmInactivityGraceHours: z.coerce.number().min(1, "Minimal 1 jam"),
    disputeClaimWindowDays: z.coerce.number().min(1, "Minimal 1 hari kerja"),
    cancellationFeePercent: z.coerce
      .number()
      .min(0)
      .max(100, "Biaya pembatalan maksimal 100%"),
  })
  .refine(
    (params) => {
      const validation = validatePlatformParams(params);
      return validation.valid;
    },
    {
      message: "Batas lot maksimum tidak boleh lebih kecil dari lot minimum",
      path: ["maxLots"],
    }
  );

export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
});

export const CreateServiceSchema = z.object({
  name: z.string().min(2, "Nama layanan minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  description: z.string().optional().nullable(),
});

export const CreateCertificationSchema = z.object({
  name: z.string().min(2, "Nama sertifikasi minimal 2 karakter"),
  issuer: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const CreateRecommendationRuleSchema = z.object({
  component: z.string().min(2, "Komponen wajib diisi"),
  condition: z.string().min(2, "Kondisi wajib diisi"),
  text: z.string().min(3, "Teks rekomendasi minimal 3 karakter"),
  points: z.coerce.number().min(1, "Poin minimal 1"),
  difficulty: z.enum(["MUDAH", "SEDANG", "SULIT"]),
  link: z.string().optional().nullable(),
});
