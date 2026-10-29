"use server";

import { auth } from "@/lib/auth";
import {
  uploadDocument,
  reviewDocument,
  suspendOrganization,
  activateOrganization,
} from "./service";
import { ReviewDocumentSchema } from "./schema";
import { DocumentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { calculateAndSaveReadiness } from "@/modules/readiness/service";

export async function uploadDocumentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Silakan masuk terlebih dahulu." };
  }

  const organizationId =
    (formData.get("organizationId") as string) || session.user.organizationId;
  const docType = formData.get("type") as DocumentType;
  const file = formData.get("file") as File;
  const validUntilRaw = formData.get("validUntil") as string;

  if (!organizationId) {
    return { success: false, error: "Organisasi tidak valid." };
  }
  if (!docType) {
    return { success: false, error: "Jenis dokumen wajib dipilih." };
  }
  if (!file || !(file instanceof File) || file.size === 0) {
    return {
      success: false,
      error: "Silakan pilih berkas yang akan diunggah.",
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validUntil = validUntilRaw ? new Date(validUntilRaw) : null;

    await uploadDocument(session.user.id, session.user.role, organizationId, {
      buffer,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
      type: docType,
      validUntil,
    });

    revalidatePath("/umkm/profil");
    revalidatePath("/industri/profil");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Dokumen berhasil diunggah dan menunggu verifikasi admin.",
    };
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Gagal mengunggah dokumen.";
    return { success: false, error: errorMsg };
  }
}

export async function reviewDocumentAction(input: {
  documentId: string;
  status: "VERIFIED" | "REJECTED";
  rejectionReason?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Hanya Admin yang dapat meninjau dokumen.",
    };
  }

  try {
    const validated = ReviewDocumentSchema.parse(input);
    const result = await reviewDocument(session.user.id, validated);

    try {
      if (result.document?.organizationId) {
        await calculateAndSaveReadiness(result.document.organizationId);
      }
    } catch {
      // Non-fatal hook error
    }

    revalidatePath("/admin");
    revalidatePath("/admin/verifikasi");
    revalidatePath("/umkm/profil");
    revalidatePath("/industri/profil");

    return {
      success: true,
      message: `Dokumen berhasil di-${validated.status === "VERIFIED" ? "setujui" : "tolak"}.`,
      organizationVerified: result.organizationVerified,
    };
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Gagal memproses peninjauan dokumen.";
    return { success: false, error: errorMsg };
  }
}

export async function suspendOrganizationAction(
  organizationId: string,
  reason?: string
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Hanya Admin yang memiliki wewenang menangguhkan organisasi.",
    };
  }

  try {
    await suspendOrganization(session.user.id, organizationId, reason);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Organisasi dan akun terkait berhasil ditangguhkan.",
    };
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Gagal menangguhkan organisasi.";
    return { success: false, error: errorMsg };
  }
}

export async function activateOrganizationAction(organizationId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Hanya Admin yang memiliki wewenang mengaktifkan organisasi.",
    };
  }

  try {
    await activateOrganization(session.user.id, organizationId);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Organisasi dan akun terkait berhasil diaktifkan kembali.",
    };
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Gagal mengaktifkan organisasi.";
    return { success: false, error: errorMsg };
  }
}
