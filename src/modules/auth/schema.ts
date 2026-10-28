import { z } from "zod";

export const RoleEnum = z.enum(["INDUSTRY", "UMKM", "ADMIN"]);
export type Role = z.infer<typeof RoleEnum>;

export const AccountStatusEnum = z.enum(["PENDING", "VERIFIED", "SUSPENDED"]);
export type AccountStatus = z.infer<typeof AccountStatusEnum>;

export const RegisterSchema = z.object({
  role: z.enum(["INDUSTRY", "UMKM"], {
    message: "Pilih peran: UMKM Konveksi atau Industri/Pembeli",
  }),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .regex(/[A-Za-z]/, "Kata sandi harus mengandung huruf")
    .regex(/[0-9]/, "Kata sandi harus mengandung angka"),
  picName: z.string().min(3, "Nama penanggung jawab minimal 3 karakter"),
  picPhone: z.string().min(9, "Nomor telepon/WhatsApp minimal 9 digit"),
  organizationName: z
    .string()
    .min(3, "Nama usaha/perusahaan minimal 3 karakter"),
  city: z.string().min(2, "Kota wajib diisi"),
  province: z.string().min(2, "Provinsi wajib diisi"),
  address: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message:
      "Anda wajib menyetujui syarat & ketentuan serta klausul sengketa platform",
  }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export type RequestPasswordResetInput = z.infer<
  typeof RequestPasswordResetSchema
>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token reset tidak valid"),
  newPassword: z
    .string()
    .min(8, "Kata sandi baru minimal 8 karakter")
    .regex(/[A-Za-z]/, "Kata sandi harus mengandung huruf")
    .regex(/[0-9]/, "Kata sandi harus mengandung angka"),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
