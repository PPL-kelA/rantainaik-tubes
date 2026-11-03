import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { getUserOrganization } from "@/modules/organizations/service";
import { OrganizationProfileForm } from "@/components/domain/OrganizationProfileForm";
import { DocumentUploadSection } from "@/components/domain/DocumentUploadSection";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  User,
  AlertTriangle,
} from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/ui";

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
      <div className="w-full border border-[#E5E7EB] bg-white p-6">
        <p className="text-sm text-[#EF4444]">
          Data organisasi tidak ditemukan untuk akun ini.
        </p>
      </div>
    );
  }

  const isVerified = organization.verificationStatus === "VERIFIED";

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* Header Kompartemen Resmi */}
      <div className="p-6 sm:p-8">
        <nav className="flex items-center gap-2 text-xs text-[#5B6475] mb-4">
          <Link
            href="/industri"
            className="flex items-center gap-1 hover:text-[#0E1422] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard Pengadaan
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0E1422]">
            Profil & Legalitas
          </span>
        </nav>

        <PageHeader
          className="border-b-0 pb-0"
          category="Identitas Korporasi & Kepatuhan Legalitas"
          title={organization.name}
          description="Kelola informasi entitas bisnis, kontak PIC pengadaan, alamat gudang penerima barang, dan dokumen legalitas resmi untuk transaksi pengadaan tekstil."
          actions={
            <div className="flex items-center gap-2">
              <StatusBadge status={organization.verificationStatus} />
            </div>
          }
        />
      </div>

      {/* Layout 2 Kolom Kompartemen Menyatu (divide-x) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
        {/* Kolom Kiri (4 cols): Ringkasan Kepatuhan & Gudang */}
        <div className="lg:col-span-4 bg-[#FAFBFC] p-6 sm:p-7 space-y-6">
          {/* Card Verifikasi Status */}
          <div className="bg-white p-4 border border-[#E5E7EB] rounded-[4px] space-y-3">
            <div className="flex items-center gap-2">
              {isVerified ? (
                <ShieldCheck className="h-5 w-5 text-[#15803D]" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-[#B45309]" />
              )}
              <h3 className="font-heading text-sm font-semibold text-[#0E1422]">
                {isVerified
                  ? "Entitas Bisnis Terverifikasi"
                  : "Menunggu Verifikasi Admin"}
              </h3>
            </div>
            <p className="text-xs text-[#5B6475] leading-relaxed">
              {isVerified
                ? "Perusahaan Anda telah memenuhi syarat kepatuhan BR-01. Anda memiliki otorisasi penuh untuk memposting RFQ dan mendanai rekening escrow."
                : "Akun industri Anda berstatus PENDING. Admin platform RantaiNaik akan memverifikasi keabsahan NIB dan data legalitas perusahaan Anda."}
            </p>
          </div>

          {/* Info PIC Pengadaan */}
          <div className="bg-white p-4 border border-[#E5E7EB] rounded-[4px] space-y-2.5 text-xs">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#8B93A1] block">
              PIC Pengadaan & Otorisasi
            </span>
            <div className="flex items-center gap-2 text-[#0E1422] font-medium">
              <User className="h-4 w-4 text-[#2862E0]" />
              <span>{organization.picName || session.user.name || "-"}</span>
            </div>
            <p className="text-[#5B6475]">
              Nomor Kontak: {organization.picPhone || "Belum diatur"}
            </p>
            <p className="text-[#5B6475]">Email: {session.user.email}</p>
          </div>

          {/* Alamat Gudang Penerimaan */}
          <div className="bg-white p-4 border border-[#E5E7EB] rounded-[4px] space-y-2.5 text-xs">
            <span className="font-mono text-[10px] uppercase font-semibold text-[#8B93A1] block">
              Gudang Penerimaan Barang Tekstil
            </span>
            <div className="flex items-start gap-2 text-[#0E1422]">
              <MapPin className="h-4 w-4 text-[#2862E0] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">
                  {organization.address || "Belum ada alamat gudang spesifik"}
                </p>
                <p className="text-[#5B6475] mt-0.5">
                  {organization.city}, {organization.province}
                </p>
              </div>
            </div>
          </div>

          {/* Jaminan Keamanan Data */}
          <div className="p-3.5 bg-[#EFF4FE] text-xs text-[#1E40AF] leading-relaxed rounded-[4px]">
            Seluruh data dan berkas legalitas korporasi disimpan dengan enkripsi
            aman serta hanya digunakan untuk keperluan verifikasi kepatuhan
            transaksi pengadaan platform RantaiNaik.
          </div>
        </div>

        {/* Kolom Kanan (8 cols): Formulir Data Organisasi & Dokumen Upload */}
        <div className="lg:col-span-8 bg-white divide-y divide-[#E5E7EB]">
          <div className="p-6 sm:p-8">
            <OrganizationProfileForm organization={organization} />
          </div>

          <div className="p-6 sm:p-8">
            <DocumentUploadSection
              organizationId={organization.id}
              orgType={organization.type}
              documents={organization.documents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
