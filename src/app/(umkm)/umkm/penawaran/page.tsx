import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { getUserOrganization } from "@/modules/organizations/service";
import { listRfqs } from "@/modules/rfq/repo";
import { QuotationListClient } from "./QuotationListClient";

export const dynamic = "force-dynamic";

export interface SerializedQuotationItem {
  id: string;
  quotationNumber: string;
  rfqNumber: string;
  rfqTitle: string;
  allocationMode: string;
  industryName: string;
  industryCity: string;
  totalOfferedPrice: number;
  unitPrice: number;
  totalQuantity: number;
  leadTimeDays: number;
  status: "SUBMITTED" | "REVISION_REQUESTED" | "ACCEPTED" | "REJECTED";
  submittedAt: string;
  validUntil: string;
  lotSummary?: string | null;
  revisionNote?: string | null;
}

export default async function UmkmQuotationManagementPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/umkm/penawaran");
  }

  try {
    requireRole(session.user.role, ["UMKM"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const organization = await getUserOrganization(session.user.id);
  if (!organization) {
    return (
      <div className="border border-[#E5E7EB] bg-white p-6">
        <p className="text-sm text-[#B91C1C]">
          Data organisasi konveksi tidak ditemukan untuk akun ini.
        </p>
      </div>
    );
  }

  // Mengambil RFQ yang ada di database untuk mengaitkan penawaran nyata/demo
  const rfqs = await listRfqs({});
  const rfq7 = rfqs.find((r) => r.rfqNumber === "RFQ-0007") || rfqs[0];

  // Penawaran terstruktur baseline (sesuai Spec 09 & BR-03)
  const baselineQuotations: SerializedQuotationItem[] = [
    {
      id: "q-001",
      quotationNumber: "Q-2026-0014",
      rfqNumber: rfq7?.rfqNumber || "RFQ-0007",
      rfqTitle:
        rfq7?.title ||
        "Pengadaan 300 Pcs Kemeja Kerja PDL & Celana Chino Lapangan",
      allocationMode: rfq7?.allocationMode || "TUNGGAL",
      industryName: rfq7?.industryOrg?.name || "PT Nusantara Logistik",
      industryCity: rfq7?.industryOrg?.city || "Jakarta Selatan",
      totalOfferedPrice: 32500000,
      unitPrice: 108333,
      totalQuantity: 300,
      leadTimeDays: 21,
      status: "SUBMITTED",
      submittedAt: "2026-11-01T09:00:00.000Z",
      validUntil: "2026-11-15T17:00:00.000Z",
      lotSummary: "Menawar Penuh Seluruh Item (200 pcs PDL + 100 pcs Chino)",
    },
    {
      id: "q-002",
      quotationNumber: "Q-2026-0009",
      rfqNumber: "RFQ-0008",
      rfqTitle: "Kemeja Seragam Panitia Event Nasional (200 pcs)",
      allocationMode: "LOT",
      industryName: "Studio Rimba Kreasi",
      industryCity: "Jakarta Barat",
      totalOfferedPrice: 13500000,
      unitPrice: 135000,
      totalQuantity: 100,
      leadTimeDays: 14,
      status: "REVISION_REQUESTED",
      submittedAt: "2026-10-30T10:30:00.000Z",
      validUntil: "2026-11-06T17:00:00.000Z",
      lotSummary: "Lot A (50 pcs) & Lot B (50 pcs)",
      revisionNote:
        "Mohon sesuaikan toleransi susut kain katun TC menjadi maksimal 2% sesuai Addendum #1.",
    },
    {
      id: "q-003",
      quotationNumber: "Q-2026-0003",
      rfqNumber: "RFQ-0003",
      rfqTitle: "Seragam Polo Karyawan Pergudangan Mitra Logistik (500 pcs)",
      allocationMode: "TUNGGAL",
      industryName: "PT Global Distribusi Logistik",
      industryCity: "Bekasi",
      totalOfferedPrice: 42500000,
      unitPrice: 85000,
      totalQuantity: 500,
      leadTimeDays: 18,
      status: "ACCEPTED",
      submittedAt: "2026-10-20T14:00:00.000Z",
      validUntil: "2026-11-20T17:00:00.000Z",
      lotSummary: "Pemenang Utama · Dana Escrow 100% Didanai Pembeli",
    },
    {
      id: "q-004",
      quotationNumber: "Q-2025-0112",
      rfqNumber: "RFQ-0001",
      rfqTitle: "Kaos Polo Promosi Distributor Retail (1.000 pcs)",
      allocationMode: "TUNGGAL",
      industryName: "PT Sinar Surya Tekstil",
      industryCity: "Tangerang",
      totalOfferedPrice: 65000000,
      unitPrice: 65000,
      totalQuantity: 1000,
      leadTimeDays: 25,
      status: "REJECTED",
      submittedAt: "2026-09-15T08:00:00.000Z",
      validUntil: "2026-10-15T17:00:00.000Z",
      lotSummary:
        "Tender Selesai (Pesaing terpilih dengan lead time lebih singkat)",
    },
  ];

  return (
    <QuotationListClient
      initialQuotations={baselineQuotations}
      organizationName={organization.name}
    />
  );
}
