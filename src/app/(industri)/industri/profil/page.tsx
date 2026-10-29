import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { getUserOrganization } from "@/modules/organizations/service";
import { OrganizationProfileForm } from "@/components/domain/OrganizationProfileForm";
import { DocumentUploadSection } from "@/components/domain/DocumentUploadSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function IndustriProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/industri/profil");
  }

  try {
    requireRole(session.user.role, ["INDUSTRY"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const organization = await getUserOrganization(session.user.id);
  if (!organization) {
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#EF4444]">
          Data organisasi tidak ditemukan untuk akun ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/industri"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Dashboard Pengadaan
        </Link>
      </div>

      <OrganizationProfileForm organization={organization} />

      <DocumentUploadSection
        organizationId={organization.id}
        orgType={organization.type}
        documents={organization.documents}
      />
    </div>
  );
}
