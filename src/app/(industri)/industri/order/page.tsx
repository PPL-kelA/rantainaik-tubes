import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { listRfqs } from "@/modules/rfq/repo";
import { OrderEscrowClient, OrderEscrowItem } from "./OrderEscrowClient";

export const dynamic = "force-dynamic";

export default async function IndustriOrderEscrowPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/industri/order");
  }

  try {
    requireRole(session.user.role, ["INDUSTRY"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const orgId = session.user.organizationId || "";
  const rfqs = orgId ? await listRfqs({ industryOrgId: orgId }) : [];

  // Baseline data order produksi dan escrow simulasi
  const mockOrders: OrderEscrowItem[] = [
    {
      id: "ORD-001",
      orderNumber: "PO-2026-0001",
      rfqId: rfqs[0]?.id || "rfq-1",
      rfqNumber: rfqs[0]?.rfqNumber || "RFQ-0007",
      rfqTitle:
        rfqs[0]?.title || "Seragam Kemeja Kerja PDH Lengan Panjang 200 Pcs",
      umkmOrg: {
        id: "umkm-1",
        name: "CV Karya Mandiri Konveksi",
        city: "Bandung",
        isVerified: true,
      },
      totalAmount: 33750000,
      stage1Amount: 10125000, // 30%
      stage2Amount: 23625000, // 70%
      platformCommission: 1687500, // 5%
      escrowStatus: "FUNDED",
      orderStatus: "IN_PRODUCTION",
      milestones: {
        stage1Name: "Bahan Baku Tiba & Dikonfirmasi",
        stage1Done: true,
        stage1Date: "2026-11-02T09:00:00.000Z",
        stage2Name: "Lolos QC & Pengiriman Selesai",
        stage2Done: false,
        stage2Date: null,
      },
      quantityPcs: 200,
      targetDeliveryDate: "2026-11-30T17:00:00.000Z",
      createdAt: "2026-11-01T10:00:00.000Z",
    },
    {
      id: "ORD-002",
      orderNumber: "PO-2026-0002",
      rfqId: rfqs[0]?.id || "rfq-1",
      rfqNumber: "RFQ-0006",
      rfqTitle: "Polo Shirt Merchandise Gathering Korporat 500 Pcs",
      umkmOrg: {
        id: "umkm-2",
        name: "PT Sinar Tekstil Berkah",
        city: "Surakarta",
        isVerified: true,
      },
      totalAmount: 42500000,
      stage1Amount: 12750000,
      stage2Amount: 29750000,
      platformCommission: 2125000,
      escrowStatus: "FUNDED",
      orderStatus: "IN_QC",
      milestones: {
        stage1Name: "Bahan Baku Tiba & Dikonfirmasi",
        stage1Done: true,
        stage1Date: "2026-10-20T11:00:00.000Z",
        stage2Name: "Lolos QC & Pengiriman Selesai",
        stage2Done: false,
        stage2Date: null,
      },
      quantityPcs: 500,
      targetDeliveryDate: "2026-11-05T17:00:00.000Z",
      createdAt: "2026-10-15T09:00:00.000Z",
    },
  ];

  return (
    <OrderEscrowClient
      orders={mockOrders}
      companyName={session.user.organizationName || "Perusahaan Industri"}
    />
  );
}
