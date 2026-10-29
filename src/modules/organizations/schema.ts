import { z } from "zod";

export const UpdateOrganizationProfileSchema = z.object({
  name: z.string().min(2, "Nama organisasi minimal 2 karakter"),
  city: z.string().min(2, "Kota wajib diisi"),
  province: z.string().min(2, "Provinsi wajib diisi"),
  address: z.string().optional().nullable(),
  picName: z.string().min(2, "Nama PIC minimal 2 karakter"),
  picPhone: z
    .string()
    .min(8, "Nomor telepon PIC minimal 8 digit")
    .optional()
    .nullable(),
});

export type UpdateOrganizationProfileInput = z.infer<
  typeof UpdateOrganizationProfileSchema
>;
