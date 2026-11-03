import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { getUserOrganization } from "@/modules/organizations/service";
import { getUmkmFullProfile } from "@/modules/capabilities/service";
import { listRfqs } from "@/modules/rfq/repo";
import { listCategoriesHierarchy } from "@/modules/admin/service";
import { RfqSearchClient } from "./RfqSearchClient";

export const dynamic = "force-dynamic";

export default async function UmkmRfqSearchPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/umkm/rfq");
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

  // Ambil profil UMKM untuk pencocokan kapabilitas dan daftar RFQ publik terbuka
  const [fullProfile, rawRfqs, categories] = await Promise.all([
    getUmkmFullProfile(organization.id),
    listRfqs({
      statuses: ["OPEN"],
      visibility: "TERBUKA",
    }),
    listCategoriesHierarchy(),
  ]);

  // Serialisasi data RFQ untuk Client Component
  const serializedRfqs = rawRfqs.map((rfq) => ({
    id: rfq.id,
    rfqNumber: rfq.rfqNumber,
    title: rfq.title,
    categoryType: rfq.categoryType,
    allocationMode: rfq.allocationMode,
    needSample: rfq.needSample,
    quotationDeadline: rfq.quotationDeadline.toISOString(),
    targetDeliveryDate: rfq.targetDeliveryDate.toISOString(),
    deliveryLocation: rfq.deliveryLocation,
    contextDescription: rfq.contextDescription,
    industryOrg: rfq.industryOrg
      ? {
          name: rfq.industryOrg.name,
          city: rfq.industryOrg.city,
          verificationStatus: rfq.industryOrg.verificationStatus,
        }
      : null,
    totalQuantity: rfq.items.reduce(
      (sum, item) => sum + (item.totalQuantity || 0),
      0
    ),
    items: rfq.items.map((it) => ({
      id: it.id,
      name: it.name,
      fabricType: it.fabricType,
      materialProvidedByBuyer: it.materialProvidedByBuyer,
      totalQuantity: it.totalQuantity,
      sizes: it.sizes.map((s) => ({
        id: s.id,
        size: s.size,
        quantity: s.quantity,
      })),
    })),
  }));

  const userCapabilityCategories = fullProfile.capabilities.map(
    (c) => c.category?.name?.toLowerCase() || ""
  );

  return (
    <RfqSearchClient
      rfqs={serializedRfqs}
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      }))}
      userCapabilityCategories={userCapabilityCategories}
    />
  );
}
