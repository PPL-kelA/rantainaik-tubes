import { z } from "zod";

export const DocumentTypeEnum = z.enum([
  "NIB",
  "NPWP",
  "IZIN_USAHA",
  "FOTO_BENGKEL",
  "AKTA",
  "KONTAK_PIC",
]);

export const DocumentStatusEnum = z.enum(["PENDING", "VERIFIED", "REJECTED"]);

export const ReviewDocumentSchema = z
  .object({
    documentId: z.string().min(1, "ID dokumen wajib diisi"),
    status: z.enum(["VERIFIED", "REJECTED"]),
    rejectionReason: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.status === "REJECTED") {
        return (
          !!data.rejectionReason && data.rejectionReason.trim().length >= 5
        );
      }
      return true;
    },
    {
      message:
        "Alasan penolakan wajib diisi minimal 5 karakter jika dokumen ditolak.",
      path: ["rejectionReason"],
    }
  );

export type ReviewDocumentInput = z.infer<typeof ReviewDocumentSchema>;
