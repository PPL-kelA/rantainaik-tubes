import Link from "next/link";
import { Check, ShieldCheck, ArrowRight, Clock, Award } from "lucide-react";
import { Button, StatusBadge } from "@/components/ui";

export function Hero() {
  return (
    <section
      aria-label="Hero Pengenalan RantaiNaik"
      className="relative w-full border-b border-[#2A3142] bg-[#0E1422] text-white overflow-hidden"
    >
      {/* Subtle solid grid pattern background (No gradient, no blur) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#A9B1D6]">
                PLATFORM PENGADAAN TEKSTIL B2B
              </span>
              <span className="bg-[#2862E0] text-white text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] font-semibold">
                FASE 1 AKTIF
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.1] text-white">
              Temukan konveksi yang siap memproduksi pesanan Anda
            </h1>

            <p className="max-w-[560px] text-sm sm:text-base text-[#A9B1D6] leading-relaxed">
              Platform broker pengadaan tekstil industri yang menghubungkan
              kebutuhan seragam, merchandise, dan maklon jahit dengan UMKM
              konveksi terverifikasi lewat penawaran tertutup yang terukur dan
              simulasi escrow aman.
            </p>

            {/* Action Buttons: Full width & stacked on mobile (<640px), inline on sm+ */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="default"
                size="default"
                asChild
                className="h-11 px-6 text-xs sm:text-sm font-semibold rounded-[4px] w-full sm:w-auto"
              >
                <Link href="/register?role=industri">
                  Buat RFQ
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="default"
                asChild
                className="h-11 px-6 text-xs sm:text-sm font-semibold rounded-[4px] bg-white text-[#0E1422] hover:bg-[#FAFBFC] border-white w-full sm:w-auto"
              >
                <Link href="/register?role=umkm">Daftar sebagai UMKM</Link>
              </Button>
            </div>

            {/* 3 Checkmark Indicators */}
            <div className="pt-4 border-t border-[#2A3142] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#A9B1D6]">
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-[2px] bg-[#2862E0] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span>Pemasok terverifikasi</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-[2px] bg-[#2862E0] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span>Penawaran mudah dibandingkan</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-[2px] bg-[#2862E0] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
                <span>
                  Pendanaan escrow{" "}
                  <span className="font-mono text-[10px] text-[#FEF3C7] bg-[#78350F]/60 px-1 py-0.5 rounded-[2px]">
                    Dalam pengembangan
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Static Product Preview (White Compartment) */}
          <div className="lg:col-span-5">
            <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 sm:p-6 text-[#0E1422] shadow-[0_4px_16px_rgba(14,20,34,0.08)]">
              {/* Header Box */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                    RFQ-0007
                  </span>
                  <StatusBadge status="ACTIVE">Dibuka</StatusBadge>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6475] bg-[#FAFBFC] px-1.5 py-0.5 rounded-[2px] border border-[#E5E7EB]">
                  Data contoh
                </span>
              </div>

              {/* RFQ Subject */}
              <div className="mt-4 space-y-1">
                <h2 className="font-heading text-base sm:text-lg font-semibold text-[#0E1422]">
                  Seragam Karyawan Kantor 2027
                </h2>
                <p className="text-xs text-[#5B6475]">
                  Total: <strong className="text-[#0E1422]">300 pcs</strong> ·
                  Bahan: American Drill · Toleransi AQL 2.5
                </p>
              </div>

              {/* Metrics Strip */}
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-3 text-xs">
                <div>
                  <span className="text-[#5B6475] block text-[11px]">
                    Penawaran Masuk
                  </span>
                  <span className="font-mono text-base font-semibold text-[#0E1422] tabular-nums">
                    3 Penawaran
                  </span>
                </div>
                <div>
                  <span className="text-[#5B6475] block text-[11px]">
                    Estimasi Anggaran
                  </span>
                  <span className="font-mono text-base font-semibold text-[#2862E0] tabular-nums">
                    Rp33.750.000
                  </span>
                </div>
              </div>

              {/* Order Status Strip */}
              <div className="mt-4 space-y-2 border-t border-[#E5E7EB] pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#5B6475]">
                    <Award className="h-3.5 w-3.5 text-[#15803D]" />
                    Tahap Order:
                  </span>
                  <span className="font-medium text-[#0E1422]">
                    Sampel Disetujui (Batch 1)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#5B6475]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#2862E0]" />
                    Status Rekening Escrow:
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="font-medium text-[#0E1422]">
                      Dirancang
                    </span>
                    <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-mono px-1 py-0.2 rounded-[2px] font-medium border border-[#FEF3C7]">
                      Dalam pengembangan
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#5B6475]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Tenggat Produksi:
                  </span>
                  <span className="font-mono text-[#0E1422]">
                    20 November 2026
                  </span>
                </div>
              </div>

              {/* Micro link footer */}
              <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                <span className="text-[#5B6475]">
                  Simulasi alur penawaran tertutup
                </span>
                <Link
                  href="/login"
                  className="font-medium text-[#2862E0] hover:text-[#2858B8] inline-flex items-center gap-1"
                >
                  Detail tender <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
