import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { listRfqs } from "@/modules/rfq/repo";
import { RfqCatalogClient, RfqCatalogItem } from "./RfqCatalogClient";

export const dynamic = "force-dynamic";

export default async function IndustriRfqCatalogPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/industri/rfq");
  }

  try {
    requireRole(session.user.role, ["INDUSTRY"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const isVerified = session.user.status === "VERIFIED";
  const orgId = session.user.organizationId || "";

  // Ambil RFQ dari database
  const rfqsData = orgId ? await listRfqs({ industryOrgId: orgId }) : [];

  const catalogItems: RfqCatalogItem[] = rfqsData.map((rfq) => ({
    id: rfq.id,
    rfqNumber: rfq.rfqNumber,
    title: rfq.title,
    status: rfq.status,
    categoryType: rfq.categoryType,
    allocationMode: rfq.allocationMode,
    deliveryLocation: rfq.deliveryLocation,
    quotationDeadline: rfq.quotationDeadline.toISOString(),
    targetDeliveryDate: rfq.targetDeliveryDate.toISOString(),
    items: rfq.items.map((item) => ({
      id: item.id,
      name: item.name,
      fabricType: item.fabricType,
      totalQuantity: item.totalQuantity,
    })),
    createdAt: rfq.createdAt.toISOString(),
  }));

  return (
    <RfqCatalogClient
      rfqs={catalogItems}
      isVerified={isVerified}
      companyName={session.user.organizationName || "Perusahaan Industri"}
    />
  );
}
