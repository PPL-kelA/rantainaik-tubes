import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, AlertTriangle, ArrowRight, FileCheck } from "lucide-react";
import { StatusBadge, Button, PageHeader, SearchBar } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function UmkmDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/umkm");
  }

  try {
    requireRole(session.user.role, ["UMKM"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const isVerified = session.user.status === "VERIFIED";

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* PENDING Warning Banner (BR-01 Guard Info) */}
      {!isVerified && (
        <div className="bg-[#FFFBEB] p-4 sm:p-5 text-[#92400E]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[#B45309] mt-0.5" />
            <div>
              <h2 className="font-heading text-sm font-semibold text-[#92400E]">
                Akun Anda Sedang Dalam Tahap Verifikasi (Status: PENDING)
              </h2>
              <p className="mt-1 text-xs text-[#B45309] leading-relaxed">
                Sesuai aturan bisnis <strong>BR-01</strong>, hanya akun UMKM
                dengan status <strong>VERIFIED</strong> yang diizinkan untuk
                mengirim penawaran harga pada RFQ yang terbuka. Lengkapi berkas
                legalitas Anda agar segera ditinjau dan disetujui Admin.
              </p>
              <div className="mt-3">
                <Button variant="default" size="sm" asChild>
                  <Link
                    href="/umkm/profil"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-[4px]"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    Lengkapi Dokumen Legalitas Sekarang
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main UMKM Portal Header (P0 Kompartemen) */}
      <div className="p-6">
        <PageHeader
          className="border-b-0 pb-0"
          category="Portal Mitra UMKM Konveksi"
          title={session.user.organizationName || "Mitra UMKM Konveksi"}
          description={`Akun penawaran: ${session.user.email} · Spesialisasi: Seragam Kerja, Kemeja & Polo Maklon`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {isVerified ? (
                <StatusBadge status="VERIFIED">Terverifikasi</StatusBadge>
              ) : (
                <StatusBadge status="PENDING">Menunggu Verifikasi</StatusBadge>
              )}
              <Button variant="secondary" size="sm" asChild>
                <Link
                  href="/umkm/profil"
                  className="flex items-center gap-1.5 text-xs"
                >
                  <FileCheck className="h-3.5 w-3.5 text-[#2862E0]" />
                  Profil & Dokumen
                </Link>
              </Button>
              <StatusBadge
                variant="info"
                className="px-2.5 py-1 font-mono text-xs rounded-[2px]"
              >
                Readiness: 68/100 (Tier B)
              </StatusBadge>
            </div>
          }
        />

        {/* In-Page Search Bar under Header */}
        <div className="mt-5">
          <SearchBar placeholder="Cari RFQ terbuka, tender seragam kantor, atau kebutuhan maklon tekstil..." />
        </div>
      </div>

      {/* Stat Strip 4-Kolom Instrumen Kompartemen (Seamless Grid) */}
      <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Penawaran Aktif
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {isVerified ? "3" : "0"}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            {isVerified
              ? "1 perlu respons sampel"
              : "Fitur penawaran terkunci (BR-01)"}
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Order Berjalan
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {isVerified ? "2" : "0"}
          </p>
          <span className="font-mono text-[11px] font-medium text-[#15803D]">
            Dalam produksi & QC
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Dana di Escrow
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {isVerified ? "Rp23.625.000" : "Rp0"}
          </p>
          <span className="font-mono text-[11px] font-medium text-[#2862E0]">
            Dijamin sistem platform
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em]">
              Kapasitas Terpakai
            </span>
            <TrendingUp className="h-4 w-4 text-[#2862E0]" />
          </div>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            62%
          </p>
          <div className="mt-2 h-1.5 w-full bg-[#E5E7EB] rounded-[2px] overflow-hidden">
            <div
              className="h-full bg-[#2862E0] rounded-[2px]"
              style={{ width: "62%" }}
            />
          </div>
          <span className="font-mono text-[10px] text-[#5B6475] mt-1 block">
            1.860 dari 3.000 pcs/bulan
          </span>
        </div>
      </div>

      {/* Grid 2 Kolom: Kolom Utama (Daftar RFQ) & Kolom Samping (Readiness Score & Kapasitas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
        {/* Kolom Kiri: RFQ Rekomendasi Terkini (Upwork Job Feed Style) */}
        <div className="lg:col-span-8 bg-white">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h2 className="font-heading text-base font-semibold text-[#0E1422]">
                RFQ Tekstil yang Cocok Untuk Anda
              </h2>
              <p className="text-xs text-[#5B6475] mt-0.5">
                Permintaan penawaran dari industri terverifikasi sesuai
                spesifikasi dan kapasitas konveksi Anda.
              </p>
            </div>
            <StatusBadge
              variant="info"
              className="font-mono text-[11px] rounded-[2px]"
            >
              2 RFQ Tersedia
            </StatusBadge>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {/* Card RFQ 1 - px-6 py-5 */}
            <div className="px-6 py-5 space-y-3.5 transition-colors hover:bg-[#FAFBFC]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-[#5B6475]">
                  Diposting 2 jam lalu · Seragam Kerja · Alokasi Tunggal
                </span>
                <StatusBadge
                  variant="success"
                  dot
                  className="font-mono text-[11px] rounded-[2px]"
                >
                  Kecocokan 86%
                </StatusBadge>
              </div>

              <h3 className="font-heading text-base font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors">
                <Link href="/umkm/rfq/RFQ-0007">
                  RFQ-0007: Seragam Karyawan Kantor 2027 (Kemeja & Rompi)
                </Link>
              </h3>

              <p className="text-xs text-[#5B6475] leading-relaxed">
                Total 300 pcs · 2 item · Katun TC 140 gsm & Drill 240 gsm ·
                Bordir & Sablon · Anggaran{" "}
                <span className="font-mono font-medium text-[#0E1422]">
                  Rp30.000.000 - Rp35.000.000
                </span>
              </p>

              {/* Tags: Strictly Square rounded-[2px], No Pill, No Stroke */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                  Kemeja Kerja
                </span>
                <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                  Katun TC
                </span>
                <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                  Bordir Dada
                </span>
                <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                  Full Package
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-[#5B6475]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#0E1422]">
                    PT Nusantara Logistik
                  </span>
                  <span>·</span>
                  <span className="text-[#15803D] font-medium">
                    ★ 4.9 (Didanai 100%)
                  </span>
                </div>
                <Button variant="default" size="sm" asChild>
                  <Link
                    href="/umkm/rfq/RFQ-0007"
                    className="flex items-center gap-1 font-semibold rounded-[4px]"
                  >
                    Buka Spesifikasi & Q&A
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card RFQ 2 - px-6 py-5 */}
            <div className="px-6 py-5 space-y-3.5 transition-colors hover:bg-[#FAFBFC]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-[#5B6475]">
                  Diposting 1 hari lalu · Merchandise Promosi · Mode LOT (4 Lot
                  x 50 pcs)
                </span>
                <StatusBadge
                  variant="info"
                  className="font-mono text-[11px] rounded-[2px]"
                >
                  Kecocokan 81% (Lot B & D)
                </StatusBadge>
              </div>

              <h3 className="font-heading text-base font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors">
                RFQ-0008: Kemeja Seragam Panitia Event Nasional
              </h3>

              <p className="text-xs text-[#5B6475] leading-relaxed">
                Total 200 pcs dibagi 4 lot @ 50 pcs · Maksimal 1 lot per UMKM ·
                Toleransi ±1 cm · AQL 2.5
              </p>

              {/* Tags: Strictly Square rounded-[2px], No Pill, No Stroke */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                  Split Award Lot
                </span>
                <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                  Standar Golden Sample
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-[#5B6475]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#0E1422]">
                    Studio Rimba
                  </span>
                  <span>·</span>
                  <span className="text-[#15803D] font-medium">
                    ★ 5.0 (Jakarta)
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!isVerified}
                  className="flex items-center gap-1 rounded-[4px]"
                >
                  {isVerified
                    ? "Tawar Lot Tertentu"
                    : "Terkunci (Butuh VERIFIED)"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Readiness Score & Verifikasi */}
        <div className="lg:col-span-4 bg-[#FAFBFC] p-6 space-y-4">
          <div className="space-y-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Industrial Readiness Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-3xl font-semibold tabular-nums text-[#0E1422]">
                68
              </span>
              <span className="font-mono text-xs text-[#5B6475]">/ 100</span>
              <StatusBadge
                variant="info"
                className="ml-auto rounded-[2px] font-mono text-[11px]"
              >
                Siap Kemitraan
              </StatusBadge>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 text-xs bg-white p-4 border border-[#E5E7EB] rounded-[4px]">
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2 text-[#5B6475]">
              <span>Legalitas & Profil Usaha</span>
              <span className="font-mono font-semibold text-[#0E1422]">
                17 / 20
              </span>
            </div>
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2 text-[#5B6475]">
              <span>Fasilitas & Mesin Jahit</span>
              <span className="font-mono font-semibold text-[#0E1422]">
                15 / 20
              </span>
            </div>
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2 text-[#5B6475]">
              <span>SOP Mutu & Kontrol QC</span>
              <span className="font-mono font-semibold text-[#0E1422]">
                12 / 20
              </span>
            </div>
            <div className="flex justify-between text-[#5B6475]">
              <span>Rekam Jejak Transaksi</span>
              <span className="font-mono font-semibold text-[#0E1422]">
                10 / 20
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <p className="text-[11px] text-[#5B6475] leading-normal">
              Tindakan tercepat naik tier: Unggah SOP QC jahit untuk mendapatkan
              tambahan +5 poin.
            </p>
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="w-full text-xs rounded-[4px]"
            >
              <Link
                href="/umkm/readiness"
                className="flex items-center justify-center gap-1.5 font-semibold"
              >
                Lihat Analisis Gap & Cara Naik Tier
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
