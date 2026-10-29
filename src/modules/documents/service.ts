import * as repo from "./repo";
import { ReviewDocumentSchema, ReviewDocumentInput } from "./schema";
import { isMinimumDocsMet } from "./rules";
import { storageProvider } from "@/lib/storage";
import { audit } from "@/modules/audit/service";
import { sendVerificationNotification } from "@/lib/email";
import { DocumentType } from "@prisma/client";

export async function uploadDocument(
  userId: string,
  userRole: string,
  organizationId: string,
  file: {
    buffer: Buffer;
    fileName: string;
    fileSize: number;
    mimeType: string;
    type: DocumentType;
    validUntil?: Date | null;
  }
) {
  // Validate file
  const validation = storageProvider.validateFile(file.fileSize, file.mimeType);
  if (!validation.valid) {
    throw new Error(validation.error || "Berkas tidak valid");
  }

  // Upload file via StorageProvider
  const fileUrl = await storageProvider.uploadFile(
    file.buffer,
    file.fileName,
    file.mimeType
  );

  // Persist record
  const document = await repo.createDocument({
    organizationId,
    type: file.type,
    fileUrl,
    fileName: file.fileName,
    fileSize: file.fileSize,
    validUntil: file.validUntil ?? null,
  });

  await audit({
    entity: "DOCUMENT",
    entityId: document.id,
    action: "UPLOAD_DOCUMENT",
    actorId: userId,
    details: {
      type: file.type,
      fileName: file.fileName,
      fileSize: file.fileSize,
    },
  });

  return document;
}

export async function reviewDocument(
  adminUserId: string,
  input: ReviewDocumentInput
) {
  const validated = ReviewDocumentSchema.parse(input);

  const existingDoc = await repo.getDocumentById(validated.documentId);
  if (!existingDoc) {
    throw new Error("Dokumen tidak ditemukan.");
  }

  // Update document status
  const updatedDoc = await repo.updateDocumentStatus(
    validated.documentId,
    validated.status,
    validated.rejectionReason
  );

  await audit({
    entity: "DOCUMENT",
    entityId: updatedDoc.id,
    action: "REVIEW_DOCUMENT",
    actorId: adminUserId,
    details: {
      type: updatedDoc.type,
      status: updatedDoc.status,
      rejectionReason: updatedDoc.rejectionReason,
    },
  });

  const org = existingDoc.organization;
  const primaryEmail = org.members[0]?.user?.email;

  // Retrieve all latest documents for this organization
  const allDocs = await repo.listDocumentsByOrgId(org.id);

  // Check if minimum verification requirements are now satisfied
  const minimumMet = isMinimumDocsMet(org.type, allDocs);

  let orgBecameVerified = false;

  if (minimumMet && org.verificationStatus !== "VERIFIED") {
    await repo.updateOrgAndUsersStatus(org.id, "VERIFIED");
    orgBecameVerified = true;

    await audit({
      entity: "ORGANIZATION",
      entityId: org.id,
      action: "VERIFY_ORGANIZATION",
      actorId: adminUserId,
      details: {
        previousStatus: org.verificationStatus,
        newStatus: "VERIFIED",
        trigger: "MINIMUM_DOCUMENTS_MET",
      },
    });

    if (primaryEmail) {
      await sendVerificationNotification(primaryEmail, org.name, true);
    }
  } else if (validated.status === "REJECTED" && primaryEmail) {
    await sendVerificationNotification(primaryEmail, org.name, false, {
      docType: updatedDoc.type,
      reason: validated.rejectionReason ?? undefined,
    });
  }

  return {
    document: updatedDoc,
    organizationVerified:
      orgBecameVerified || org.verificationStatus === "VERIFIED",
  };
}

export async function suspendOrganization(
  adminUserId: string,
  organizationId: string,
  reason?: string
) {
  // TODO: Pembatalan RFQ otomatis saat akun ditangguhkan (FR-08 / spec Fase 1 di luar lingkup ini)
  const updatedOrg = await repo.updateOrgAndUsersStatus(
    organizationId,
    "SUSPENDED"
  );

  await audit({
    entity: "ORGANIZATION",
    entityId: organizationId,
    action: "SUSPEND_ORGANIZATION",
    actorId: adminUserId,
    details: { reason: reason || "Ditangguhkan oleh Administrator" },
  });

  return updatedOrg;
}

export async function activateOrganization(
  adminUserId: string,
  organizationId: string
) {
  const updatedOrg = await repo.updateOrgAndUsersStatus(
    organizationId,
    "VERIFIED"
  );

  await audit({
    entity: "ORGANIZATION",
    entityId: organizationId,
    action: "ACTIVATE_ORGANIZATION",
    actorId: adminUserId,
    details: { reason: "Diaktifkan kembali oleh Administrator" },
  });

  return updatedOrg;
}
