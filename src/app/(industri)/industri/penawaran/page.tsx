import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { listRfqs } from "@/modules/rfq/repo";
import {
  QuotationEvaluationClient,
  QuotationEvaluationItem,
} from "./QuotationEvaluationClient";

export const dynamic = "force-dynamic";

export default async function IndustriPenawaranPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/industri/penawaran");
  }

  try {
    requireRole(session.user.role, ["INDUSTRY"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const orgId = session.user.organizationId || "";
  const rfqs = orgId ? await listRfqs({ industryOrgId: orgId }) : [];

  // Baseline data penawaran yang masuk ke tender industri
  const mockQuotations: QuotationEvaluationItem[] = [
    {
      id: "QUO-001",
      quotationNumber: "QUO-2026-0001",
      rfqId: rfqs[0]?.id || "rfq-1",
      rfqNumber: rfqs[0]?.rfqNumber || "RFQ-0007",
      rfqTitle:
        rfqs[0]?.title || "Seragam Kemeja Kerja PDH Lengan Panjang 200 Pcs",
      allocationMode: rfqs[0]?.allocationMode || "TUNGGAL",
      umkmOrg: {
        id: "umkm-1",
        name: "CV Karya Mandiri Konveksi",
        city: "Bandung",
        province: "Jawa Barat",
        readinessScore: 84,
        readinessTier: "Tier A (Kesiapan Korporat)",
        isVerified: true,
      },
      unitPrice: 168750,
      totalPrice: 33750000,
      offeredQuantity: 200,
      leadTimeDays: 28,
      rfqTargetLeadTime: 30,
      capacityCommitmentPercent: 40,
      status: "SUBMITTED",
      sampleOffered: true,
      submittedAt: "2026-11-01T08:30:00.000Z",
    },
    {
      id: "QUO-002",
      quotationNumber: "QUO-2026-0002",
      rfqId: rfqs[0]?.id || "rfq-1",
      rfqNumber: rfqs[0]?.rfqNumber || "RFQ-0007",
      rfqTitle:
        rfqs[0]?.title || "Seragam Kemeja Kerja PDH Lengan Panjang 200 Pcs",
      allocationMode: rfqs[0]?.allocationMode || "TUNGGAL",
      umkmOrg: {
        id: "umkm-2",
        name: "PT Sinar Tekstil Berkah",
        city: "Surakarta",
        province: "Jawa Tengah",
        readinessScore: 74,
        readinessTier: "Tier B (Kesiapan Menengah)",
        isVerified: true,
      },
      unitPrice: 175000,
      totalPrice: 35000000,
      offeredQuantity: 200,
      leadTimeDays: 35,
      rfqTargetLeadTime: 30,
      capacityCommitmentPercent: 55,
      status: "REVISION_REQUESTED",
      revisionNote:
        "Mohon konfirmasi kesanggupan mempercepat lead time agar tidak melampaui 30 hari kerja.",
      sampleOffered: true,
      submittedAt: "2026-11-02T10:15:00.000Z",
    },
    {
      id: "QUO-003",
      quotationNumber: "QUO-2026-0003",
      rfqId: rfqs[0]?.id || "rfq-1",
      rfqNumber: rfqs[0]?.rfqNumber || "RFQ-0007",
      rfqTitle:
        rfqs[0]?.title || "Seragam Kemeja Kerja PDH Lengan Panjang 200 Pcs",
      allocationMode: rfqs[0]?.allocationMode || "TUNGGAL",
      umkmOrg: {
        id: "umkm-3",
        name: "Konveksi Maju Lestari",
        city: "Pekalongan",
        province: "Jawa Tengah",
        readinessScore: 61,
        readinessTier: "Tier C (Kesiapan Terbimbing)",
        isVerified: false,
      },
      unitPrice: 155000,
      totalPrice: 31000000,
      offeredQuantity: 200,
      leadTimeDays: 40,
      rfqTargetLeadTime: 30,
      capacityCommitmentPercent: 75,
      status: "REJECTED",
      sampleOffered: false,
      submittedAt: "2026-10-29T14:20:00.000Z",
    },
  ];

  return (
    <QuotationEvaluationClient
      quotations={mockQuotations}
      companyName={session.user.organizationName || "Perusahaan Industri"}
    />
  );
}
