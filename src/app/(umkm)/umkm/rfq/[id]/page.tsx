import { auth } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
        <div className="p-6 sm:p-8 space-y-4">
          <nav className="flex items-center gap-2 text-xs text-[#5B6475]">
            <Link
              href="/umkm"
              className="flex items-center gap-1 hover:text-[#0E1422] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard UMKM
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0E1422]">Detail RFQ</span>
          </nav>
          <h1 className="font-heading text-xl font-semibold tracking-tight text-[#0E1422]">
            Akses Terbatas
          </h1>
        </div>
        <div className="p-8 text-center space-y-3">
          <p className="text-sm text-[#5B6475]">
            RFQ ini bersifat UNDANGAN dan hanya dapat diakses oleh UMKM yang
            terdaftar dalam undangan.
          </p>
          <div className="pt-2">
            <Link
              href="/umkm"
              className="inline-flex items-center justify-center rounded-[4px] bg-[#2862E0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2858B8] transition-colors"
            >
              Kembali ke Beranda UMKM
            </Link>
          </div>
        </div>
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
