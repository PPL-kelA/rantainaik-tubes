import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  FileCheck,
} from "lucide-react";

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
    <div className="space-y-6">
      {/* PENDING Warning Banner (BR-01 Guard Info) */}
      {!isVerified && (
        <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="rounded-lg bg-[#FEF3C7] p-2 text-[#B45309]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#92400E]">
                Akun Anda Sedang Dalam Tahap Verifikasi (Status: PENDING)
              </h2>
              <p className="mt-1 text-xs text-[#B45309] leading-relaxed">
                Sesuai aturan bisnis <strong>BR-01</strong>, hanya akun UMKM
                dengan status <strong>VERIFIED</strong> yang diizinkan untuk
                mengirim penawaran harga pada RFQ yang terbuka. Lengkapi berkas
                legalitas Anda agar segera ditinjau dan disetujui Admin.
              </p>
              <div className="mt-3">
                <Link
                  href="/umkm/profil"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#B45309] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#92400E] transition-colors"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  Lengkapi Dokumen Legalitas Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main UMKM Portal Header */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
                Portal Mitra UMKM Konveksi
              </span>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D] border border-[#DCFCE7]">
                  <ShieldCheck className="h-3 w-3" />
                  Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-[11px] font-semibold text-[#B45309] border border-[#FDE68A]">
                  <Clock className="h-3 w-3" />
                  Menunggu Verifikasi
                </span>
              )}
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#111827]">
              {session.user.organizationName || "Mitra UMKM Konveksi"}
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Email Akun: {session.user.email} · Spesialisasi: Seragam Kerja,
              Kemeja & Polo Maklon
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/umkm/profil"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              <FileCheck className="h-3.5 w-3.5 text-[#1D4ED8]" />
              Profil & Dokumen
            </Link>
            <span className="rounded-lg bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] border border-[#BFDBFE]">
              Readiness Tier: Siap Kemitraan (68/100)
            </span>
          </div>
        </div>

        {/* Stat Strip 4-Kolom (P0 Anatomi Upwork) */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              Penawaran Aktif
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "3" : "0"}
            </p>
            <span className="text-[11px] text-[#6B7280]">
              {isVerified
                ? "1 perlu respons sampel"
                : "Fitur penawaran terkunci (BR-01)"}
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              Order Berjalan
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "2" : "0"}
            </p>
            <span className="text-[11px] text-[#15803D] font-medium">
              Dalam produksi & QC
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              Dana di Escrow
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "Rp23.625.000" : "Rp0"}
            </p>
            <span className="text-[11px] text-[#1D4ED8] font-medium">
              Dijamin sistem platform
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">Kapasitas Terpakai</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#111827]">62%</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#E5E7EB]">
              <div
                className="h-1.5 rounded-full bg-[#1D4ED8]"
                style={{ width: "62%" }}
              />
            </div>
            <span className="text-[11px] text-[#6B7280] mt-1 block">
              1.860 dari 3.000 pcs/bulan
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: Kolom Utama (Daftar RFQ) & Kolom Samping (Readiness Score & Kapasitas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: RFQ Rekomendasi Terkini */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  RFQ Tekstil yang Cocok Untuk Anda
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Permintaan penawaran dari industri terverifikasi sesuai
                  spesifikasi dan kapasitas konveksi Anda.
                </p>
              </div>
              <span className="text-xs text-[#1D4ED8] font-semibold">
                2 RFQ Tersedia
              </span>
            </div>

            <div className="mt-4 divide-y divide-[#E5E7EB]">
              {/* Card RFQ 1 */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#6B7280]">
                    Diposting 2 jam lalu · Seragam Kerja · Alokasi Tunggal
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                    Kecocokan 86%
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#1D4ED8] hover:underline cursor-pointer">
                  RFQ-0007: Seragam Karyawan Kantor 2027 (Kemeja & Rompi)
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Total 300 pcs · 2 item · Katun TC 140 gsm & Drill 240 gsm ·
                  Bordir & Sablon · Anggaran Rp30.000.000 - Rp35.000.000
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#4B5563]">
                    Kemeja Kerja
                  </span>
                  <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#4B5563]">
                    Katun TC
                  </span>
                  <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#4B5563]">
                    Bordir Dada
                  </span>
                  <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#4B5563]">
                    Full Package
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <span>PT Nusantara Logistik</span>
                    <span>·</span>
                    <span className="text-[#15803D] font-medium">
                      ★ 4.9 (Didanai 100%)
                    </span>
                  </div>
                  <button
                    disabled={!isVerified}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isVerified
                      ? "Kirim Penawaran"
                      : "Terkunci (Butuh VERIFIED)"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card RFQ 2 */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#6B7280]">
                    Diposting 1 hari lalu · Merchandise Promosi · Mode LOT (4
                    Lot x 50 pcs)
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                    Kecocokan 81% (Lot B & D)
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#1D4ED8] hover:underline cursor-pointer">
                  RFQ-0008: Kemeja Seragam Panitia Event Nasional
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Total 200 pcs dibagi 4 lot @ 50 pcs · Maksimal 1 lot per UMKM
                  · Toleransi ±1 cm · AQL 2.5
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#4B5563]">
                    Split Award Lot
                  </span>
                  <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#4B5563]">
                    Standar Golden Sample
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <span>Studio Rimba</span>
                    <span>·</span>
                    <span className="text-[#15803D] font-medium">
                      ★ 5.0 (Jakarta)
                    </span>
                  </div>
                  <button
                    disabled={!isVerified}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isVerified
                      ? "Tawar Lot Tertentu"
                      : "Terkunci (Butuh VERIFIED)"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Readiness Score & Verifikasi */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Industrial Readiness Score
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#111827]">68</span>
              <span className="text-xs text-[#6B7280]">/ 100</span>
              <span className="ml-auto inline-block rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                Siap Kemitraan
              </span>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between text-[#4B5563]">
                <span>Legalitas & Profil Usaha</span>
                <span className="font-semibold text-[#111827]">17 / 20</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Fasilitas & Mesin Jahit</span>
                <span className="font-semibold text-[#111827]">15 / 20</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>SOP Mutu & Kontrol QC</span>
                <span className="font-semibold text-[#111827]">12 / 20</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>Rekam Jejak Transaksi</span>
                <span className="font-semibold text-[#111827]">10 / 20</span>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-3">
              <p className="text-[11px] text-[#6B7280] leading-normal">
                Tindakan tercepat naik tier: Unggah SOP QC jahit untuk
                mendapatkan tambahan +5 poin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
