import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { getUserOrganization } from "@/modules/organizations/service";
import { getReadinessDashboardData } from "@/modules/readiness/service";
import { ReadinessClient } from "./ReadinessClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function UmkmReadinessPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/umkm/readiness");
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

  const readinessData = await getReadinessDashboardData(organization.id);

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* 1. Page Header Compartment */}
      <div className="p-6">
        <PageHeader
          className="border-b-0 pb-0"
          category="Portal Mitra UMKM Konveksi"
          title="Skor Kesiapan Industri"
          description="Indeks kesiapan industri 0-100 berbasis 6 pilar kualifikasi (legalitas, fasilitas mesin, SOP QC, sertifikasi, keuangan, dan rekam jejak pengadaan)."
          actions={
            <Button variant="secondary" size="sm" asChild>
              <Link
                href="/umkm"
                className="flex items-center gap-1.5 text-xs font-semibold rounded-[4px]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali ke Dashboard UMKM
              </Link>
            </Button>
          }
        />
      </div>

      {/* Main Readiness Interactive Interface */}
      <div>
        <ReadinessClient initialData={readinessData} />
      </div>
    </div>
  );
}
