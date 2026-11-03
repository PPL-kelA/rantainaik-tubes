import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { listRfqs } from "@/modules/rfq/repo";
import { db } from "@/lib/db";
import { UmkmScoutingClient, UmkmScoutingItem } from "./UmkmScoutingClient";

export const dynamic = "force-dynamic";

interface UmkmCapability {
  monthlyCapacity: number;
  minOrderQty: number;
  category?: { name: string } | null;
}

interface UmkmMachine {
  machineType: string;
  quantity: number;
}

interface UmkmOrgRecord {
  id: string;
  name: string;
  city: string;
  province: string;
  description: string | null;
  yearEstablished: number | null;
  operatorCount: number | null;
  verificationStatus: string;
  capabilities: UmkmCapability[];
  machineAssets: UmkmMachine[];
  readinessSnapshots: { totalScore: number }[];
}

export default async function IndustriMitraScoutingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/industri/mitra");
  }

  try {
    requireRole(session.user.role, ["INDUSTRY"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const orgId = session.user.organizationId || "";
  const rfqs = orgId ? await listRfqs({ industryOrgId: orgId }) : [];

  // Ambil UMKM dari database
  const umkmOrgsRaw = await db.organization.findMany({
    where: {
      type: "UMKM",
    },
    include: {
      capabilities: {
        include: {
          category: true,
        },
      },
      machineAssets: true,
      readinessSnapshots: {
        orderBy: { calculatedAt: "desc" },
        take: 1,
      },
    },
    take: 20,
  });

  const umkmOrgs = umkmOrgsRaw as unknown as UmkmOrgRecord[];

  const scoutingItems: UmkmScoutingItem[] = umkmOrgs.map(
    (org: UmkmOrgRecord) => {
      const latestSnapshot = org.readinessSnapshots[0];
      const score = latestSnapshot?.totalScore || 75;
      let tier: "TIER_A" | "TIER_B" | "TIER_C" | "TIER_D" = "TIER_B";
      let tierLabel = "Tier B (Kesiapan Menengah)";

      if (score >= 80) {
        tier = "TIER_A";
        tierLabel = "Tier A (Kesiapan Korporat)";
      } else if (score >= 65) {
        tier = "TIER_B";
        tierLabel = "Tier B (Kesiapan Menengah)";
      } else if (score >= 50) {
        tier = "TIER_C";
        tierLabel = "Tier C (Kesiapan Terbimbing)";
      } else {
        tier = "TIER_D";
        tierLabel = "Tier D (Tahap Awal)";
      }

      const categories = Array.from(
        new Set(
          org.capabilities
            .map((c: UmkmCapability) => c.category?.name)
            .filter((name: string | undefined): name is string => Boolean(name))
        )
      );

      const machines = Array.from(
        new Set(
          org.machineAssets.map(
            (m: UmkmMachine) => `${m.machineType} (${m.quantity} unit)`
          )
        )
      );

      const maxCapacity = org.capabilities.reduce(
        (max: number, c: UmkmCapability) => Math.max(max, c.monthlyCapacity),
        2500
      );

      const minMoq = org.capabilities.reduce(
        (min: number, c: UmkmCapability) =>
          min === 0 ? c.minOrderQty : Math.min(min, c.minOrderQty),
        50
      );

      return {
        id: org.id,
        name: org.name,
        city: org.city,
        province: org.province,
        description:
          org.description ||
          "Konveksi jahit berpengalaman memproduksi pakaian formal, seragam perusahaan, dan merchandise berbahan katun berkualitas.",
        yearEstablished: org.yearEstablished || 2018,
        operatorCount: org.operatorCount || 15,
        readinessScore: score,
        readinessTier: tier,
        readinessTierLabel: tierLabel,
        isVerified: org.verificationStatus === "VERIFIED",
        categories:
          categories.length > 0
            ? categories
            : ["Kemeja & Seragam Kerja", "Kaos & Polo Shirt"],
        machines:
          machines.length > 0
            ? machines
            : [
                "Jahit Jarum 1 (8 unit)",
                "Obras 4 Benang (3 unit)",
                "Overdeck (2 unit)",
              ],
        monthlyCapacityPcs: maxCapacity > 0 ? maxCapacity : 3000,
        minMoqPcs: minMoq > 0 ? minMoq : 50,
      };
    }
  );

  const availableRfqs = rfqs.map((r) => ({
    id: r.id,
    rfqNumber: r.rfqNumber,
    title: r.title,
  }));

  return (
    <UmkmScoutingClient
      umkmList={scoutingItems}
      availableRfqs={availableRfqs}
    />
  );
}
