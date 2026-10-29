import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { getUserOrganization } from "@/modules/organizations/service";
import { getReadinessDashboardData } from "@/modules/readiness/service";
import { ReadinessClient } from "./ReadinessClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#EF4444]">
          Data organisasi konveksi tidak ditemukan untuk akun ini.
        </p>
      </div>
    );
  }

  const readinessData = await getReadinessDashboardData(organization.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Dashboard UMKM
        </Link>
      </div>

      <ReadinessClient initialData={readinessData} />
    </div>
  );
}
