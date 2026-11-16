import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export function CTABand() {
  return (
    <section
      aria-label="Panggilan Aksi Pengadaan"
      className="w-full border-b border-[#E5E7EB] bg-[#FAFBFC] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-8 sm:p-10 lg:p-12 border border-[#E5E7EB] bg-white rounded-[4px]">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#2862E0]">
              MULAI SEKARANG
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#0E1422]">
              Siap Mewujudkan Pengadaan Tekstil yang Terukur?
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
              Bergabunglah dengan ratusan pelaku industri dan konveksi di
              seluruh Indonesia untuk proses tender yang lebih adil, transparan,
              dan aman.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
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
              className="h-11 px-6 text-xs sm:text-sm font-semibold rounded-[4px] border-[#8B93A1] w-full sm:w-auto"
            >
              <Link href="/register?role=umkm">Daftar sebagai UMKM</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
