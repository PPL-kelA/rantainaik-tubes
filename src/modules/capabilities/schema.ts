import { z } from "zod";

export const CapabilitySchema = z
  .object({
    categoryId: z.string().min(1, "Kategori produk wajib dipilih"),
    services: z
      .array(z.string())
      .min(1, "Pilih minimal satu layanan produksi yang dikerjakan"),
    materials: z
      .array(z.string())
      .min(1, "Pilih minimal satu jenis bahan baku yang biasa dikerjakan"),
    decorations: z.array(z.string()).default([]),
    monthlyCapacity: z.coerce
      .number()
      .int()
      .min(0, "Kapasitas bulanan tidak boleh bernilai negatif"),
    minOrderQty: z.coerce
      .number()
      .int()
      .min(0, "MOQ tidak boleh bernilai negatif"),
    leadTimeDays: z.coerce
      .number()
      .int()
      .min(1, "Lead time minimal 1 hari kerja"),
    serviceArea: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  })
  .refine(
    (data) =>
      data.monthlyCapacity === 0 || data.minOrderQty <= data.monthlyCapacity,
    {
      message: "MOQ tidak boleh melampaui kapasitas bulanan konveksi",
      path: ["minOrderQty"],
    }
  );

export const MachineAssetSchema = z.object({
  machineType: z.string().min(1, "Jenis mesin wajib diisi"),
  brand: z.string().optional().nullable(),
  quantity: z.coerce.number().int().min(1, "Jumlah mesin minimal 1 unit"),
  condition: z.string().default("BAIK"),
});

export const PortfolioItemSchema = z.object({
  title: z.string().min(2, "Nama produk portofolio wajib diisi"),
  description: z.string().optional().nullable(),
  productType: z
    .string()
    .min(1, "Jenis produk wajib diisi (e.g. Kemeja, Polo)"),
  clientType: z.string().optional().nullable(),
  largestOrderQty: z.coerce.number().int().min(1).optional().nullable(),
  imageUrl: z.string().min(1, "Foto produk wajib disertakan"),
});

export const OrgCertificationSchema = z.object({
  certificationId: z.string().min(1, "Jenis sertifikasi wajib dipilih"),
  certificateNumber: z.string().optional().nullable(),
  documentUrl: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
});

export const UpdateProfileDetailsSchema = z.object({
  description: z.string().optional().nullable(),
  yearEstablished: z.coerce
    .number()
    .int()
    .min(1900)
    .max(2100)
    .optional()
    .nullable(),
  operatorCount: z.coerce.number().int().min(0).optional().nullable(),
  shiftCount: z.coerce.number().int().min(1).max(4).optional().nullable(),
});
