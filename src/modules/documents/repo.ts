import { db } from "@/lib/db";
import { DocumentStatus, DocumentType } from "@prisma/client";

export interface CreateDocumentData {
  organizationId: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  validUntil?: Date | null;
}

export async function createDocument(data: CreateDocumentData) {
  return db.document.create({
    data: {
      organizationId: data.organizationId,
      type: data.type,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize,
      status: "PENDING",
      validUntil: data.validUntil ?? null,
    },
  });
}

export async function getDocumentById(id: string) {
  return db.document.findUnique({
    where: { id },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
}

export async function listDocumentsByOrgId(organizationId: string) {
  return db.document.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateDocumentStatus(
  id: string,
  status: DocumentStatus,
  rejectionReason?: string | null
) {
  return db.document.update({
    where: { id },
    data: {
      status,
      rejectionReason: status === "REJECTED" ? rejectionReason : null,
    },
  });
}

export async function listVerificationQueue() {
  return db.organization.findMany({
    where: {
      verificationStatus: { in: ["PENDING", "REJECTED"] },
    },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
      },
      members: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrgAndUsersStatus(
  orgId: string,
  verificationStatus: "VERIFIED" | "REJECTED" | "SUSPENDED" | "PENDING"
) {
  return db.$transaction(async (tx) => {
    const org = await tx.organization.update({
      where: { id: orgId },
      data: { verificationStatus },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    const userAccountStatus =
      verificationStatus === "VERIFIED"
        ? "VERIFIED"
        : verificationStatus === "SUSPENDED"
          ? "SUSPENDED"
          : "PENDING";

    const userIds = org.members.map((m) => m.userId);
    if (userIds.length > 0) {
      await tx.user.updateMany({
        where: { id: { in: userIds } },
        data: { status: userAccountStatus },
      });
    }

    return org;
  });
}
