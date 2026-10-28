import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import {
  ShieldCheck,
  Clock,
  FilePlus2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function IndustriDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/industri");
  }

  try {
    requireRole(session.user.role, ["INDUSTRY"]);
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
                Akun Perusahaan Menunggu Verifikasi (Status: PENDING)
              </h2>
              <p className="mt-1 text-xs text-[#B45309] leading-relaxed">
                Sesuai aturan bisnis <strong>BR-01</strong>, hanya akun industri
                dengan status <strong>VERIFIED</strong> yang diizinkan untuk
                memposting RFQ atau mendanai escrow. Akun Anda dapat
                diverifikasi langsung oleh Admin platform pada portal
                administrasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Industri Portal Header */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
                Portal Pengadaan Industri & Korporasi
              </span>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D] border border-[#DCFCE7]">
                  <ShieldCheck className="h-3 w-3" />
                  Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-[11px] font-semibold text-[#B45309] border border-[#FDE68A]">
                  <Clock className="h-3 w-3" />
                  Menunggu Verifikasi Admin
                </span>
              )}
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#111827]">
              {session.user.organizationName || "Mitra Industri Pengadaan"}
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Email Akun: {session.user.email} · Divisi Pengadaan & Logistik
              Tekstil
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={!isVerified}
              className="flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FilePlus2 className="h-4 w-4" />
              {isVerified ? "Posting RFQ Baru" : "Posting Terkunci (BR-01)"}
            </button>
          </div>
        </div>

        {/* Stat Strip 4-Kolom (P0 Anatomi Upwork) */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              RFQ Aktif Diposting
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "2" : "0"}
            </p>
            <span className="text-[11px] text-[#6B7280]">
              {isVerified
                ? "1 mode Lot, 1 Tunggal"
                : "Fitur posting terkunci (BR-01)"}
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              Penawaran Masuk
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "7" : "0"}
            </p>
            <span className="text-[11px] text-[#1D4ED8] font-medium">
              4 lolos kesesuaian bahan
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              Order Berjalan
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "1" : "0"}
            </p>
            <span className="text-[11px] text-[#15803D] font-medium">
              Milestone: Pemotongan bahan
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">Dana Escrow Diamankan</span>
              <Layers className="h-4 w-4 text-[#1D4ED8]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "Rp33.750.000" : "Rp0"}
            </p>
            <span className="text-[11px] text-[#6B7280]">
              100% didanai di awal
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: RFQ Pengadaan & Status Dana Escrow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: RFQ yang Sedang Berjalan */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  Daftar RFQ Aktif Perusahaan
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Kelola spesifikasi, pantau penawaran UMKM yang masuk, dan
                  alokasikan lot produksi.
                </p>
              </div>
              <span className="text-xs text-[#1D4ED8] font-semibold">
                2 RFQ Terbit
              </span>
            </div>

            <div className="mt-4 divide-y divide-[#E5E7EB]">
              {/* RFQ 1 */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    RFQ-0007 · Mode Tunggal
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D]">
                    3 Penawaran Masuk
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#111827]">
                  Seragam Karyawan Kantor 2027
                </h3>
                <p className="text-xs text-[#4B5563]">
                  300 pcs kemeja lengan panjang dan rompi lapangan · Katun TC
                  140 gsm · Target kirim 15 Jan 2027
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#6B7280]">
                    Anggaran Indikatif: Rp30.000.000 - Rp35.000.000
                  </span>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:underline">
                    Lihat Matriks Perbandingan Penawaran
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* RFQ 2 */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    RFQ-0008 · Mode Split Award (4 Lot)
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                    Evaluasi Lot Aktif
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#111827]">
                  Kemeja Seragam Panitia Event Nasional
                </h3>
                <p className="text-xs text-[#4B5563]">
                  200 pcs dibagi 4 lot @ 50 pcs (Lot A, B, C, D) · Standar mutu:
                  Golden Sample & Toleransi Dimensi ±1 cm
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#6B7280]">
                    4 Vendor UMKM bersaing memperebutkan lot
                  </span>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:underline">
                    Papan Alokasi Lot Pemenang
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Perlindungan Escrow */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Ringkasan Rekening Escrow
            </h3>
            <p className="text-2xl font-bold text-[#111827]">Rp33.750.000</p>
            <p className="text-xs text-[#6B7280]">
              Total dana diamankan untuk Order RFQ-0007 (CV Karya Mandiri
              Konveksi).
            </p>

            <div className="space-y-2 pt-2 text-xs border-t border-[#E5E7EB]">
              <div className="flex justify-between">
                <span className="text-[#4B5563]">
                  Tahap 1 (Bahan Tiba 30%):
                </span>
                <span className="font-semibold text-[#111827]">
                  Rp10.125.000
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">Tahap 2 (Lolos QC 70%):</span>
                <span className="font-semibold text-[#111827]">
                  Rp23.625.000
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-[#EFF6FF] p-3 text-[11px] text-[#1E40AF]">
              Dana Anda dilindungi penuh. Jika terjadi ketidaksesuaian
              spesifikasi atau gagal QC, dana dapat direfund atau ditahan
              melalui mediasi sengketa admin.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
