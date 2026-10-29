import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { findRfqById, findRfqByNumber } from "@/modules/rfq/repo";
import { canAccessRfq, RfqVisibility } from "@/modules/rfq/rules";
import { RfqDetailClient } from "./RfqDetailClient";

interface RfqDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UmkmRfqDetailPage({
  params,
}: RfqDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  let rfq = await findRfqById(id);

  // Coba cari by rfqNumber bila ID adalah kode seperti "RFQ-0007"
  if (!rfq && id.startsWith("RFQ-")) {
    rfq = await findRfqByNumber(id);
  }

  if (!rfq) {
    notFound();
  }

  const userOrgId = session.user.organizationId || "";
  const invitedIds = rfq.invitations.map((i) => i.umkmOrgId);

  // Validasi visibilitas R-06
  if (!canAccessRfq(rfq.visibility as RfqVisibility, userOrgId, invitedIds)) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-4 text-center">
        <h1 className="text-xl font-bold text-[#111827]">Akses Terbatas</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          RFQ ini bersifat UNDANGAN dan hanya dapat diakses oleh UMKM yang
          terdaftar dalam undangan.
        </p>
      </div>
    );
  }

  // Serialisasi data untuk Client Component (BigInt -> Number)
  const serializedRfq = {
    ...rfq,
    indicativeBudget: rfq.indicativeBudget
      ? Number(rfq.indicativeBudget)
      : null,
    qaDeadline: rfq.qaDeadline?.toISOString() || null,
    quotationDeadline: rfq.quotationDeadline.toISOString(),
    targetDeliveryDate: rfq.targetDeliveryDate.toISOString(),
    createdAt: rfq.createdAt.toISOString(),
    updatedAt: rfq.updatedAt.toISOString(),
    questions: rfq.questions.map((q) => ({
      ...q,
      answeredAt: q.answeredAt?.toISOString() || null,
      createdAt: q.createdAt.toISOString(),
    })),
    addendums: rfq.addendums.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  };

  return (
    <RfqDetailClient
      rfq={serializedRfq}
      currentUserId={session.user.id}
      userRole={session.user.role}
      userOrgId={userOrgId}
    />
  );
}
