import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { listUsersForAdmin } from "@/modules/auth/service";
import { listVerificationQueue } from "@/modules/documents/repo";
import { AdminVerificationUnifiedClient } from "./AdminVerificationUnifiedClient";

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/verifikasi");
  }

  try {
    requireRole(session.user.role, ["ADMIN"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const [rawUsers, rawQueue] = await Promise.all([
    listUsersForAdmin(),
    listVerificationQueue(),
  ]);

  const serializedUsers = rawUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  const serializedQueue = rawQueue.map((org) => ({
    id: org.id,
    name: org.name,
    type: org.type,
    city: org.city,
    province: org.province,
    picName: org.picName,
    picPhone: org.picPhone,
    verificationStatus: org.verificationStatus,
    createdAt: org.createdAt.toISOString(),
    documents: org.documents.map((d) => ({
      id: d.id,
      type: d.type,
      fileName: d.fileName,
      fileSize: d.fileSize,
      status: d.status,
      rejectionReason: d.rejectionReason,
      validUntil: d.validUntil ? d.validUntil.toISOString() : null,
      createdAt: d.createdAt.toISOString(),
    })),
    members: org.members.map((m) => ({
      userId: m.userId,
      user: {
        id: m.user.id,
        email: m.user.email,
        status: m.user.status,
      },
    })),
  }));

  return (
    <AdminVerificationUnifiedClient
      queue={serializedQueue}
      users={serializedUsers}
    />
  );
}
