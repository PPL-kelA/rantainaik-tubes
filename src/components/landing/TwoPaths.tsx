import Link from "next/link";
import { Check, ArrowRight, Building2, Scissors } from "lucide-react";
import { Button } from "@/components/ui";

export function TwoPaths() {
  const industriBullets = [
    "Wizard RFQ 10 langkah dengan rincian material & toleransi ukuran terukur.",
    "Sistem penawaran tertutup untuk mencegah kolusi dan perang harga semu.",
    "Opsi pembagian tender ke beberapa lot UMKM sekaligus (split award).",
    "Perlindungan komitmen dana via escrow berbasis milestone (dalam pengembangan).",
  ];

  const umkmBullets = [
    "Akses langsung ke katalog tender korporasi tanpa perantara makelar.",
    "Evaluasi kesiapan transparan dengan Readiness Score 6 pilar terstandarisasi.",
    "Mekanisme persetujuan golden sample sebelum memotong bahan produksi massal.",
    "Jaminan dana pesanan telah diamankan di rekening penampung (dalam pengembangan).",
  ];

  return (
    <section
      aria-label="Pilihan Peran Pengguna"
      className="w-full border-b border-[#E5E7EB] bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="border-b border-[#E5E7EB] pb-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            DUA JALUR KOLABORASI
          </span>
          <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#0E1422]">
            Disesuaikan untuk Kebutuhan Industri dan UMKM
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5B6475]">
            Pilih portal sesuai peran usaha Anda untuk mengakses fungsionalitas
            spesifik.
          </p>
        </div>

        {/* 2 Side-by-Side Compartments joined with 1px border */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-l border-[#E5E7EB]">
          {/* Compartment 1: Untuk Industri */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 border-r border-b border-[#E5E7EB] bg-white hover:bg-[#FAFBFC] transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#2862E0]">
                  PENGADAAN INDUSTRI
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#EFF4FE] text-[#2862E0]">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#0E1422]">
                Kendalikan Spesifikasi, Harga, dan Kualitas Produksi
              </h3>

              <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                Tinggalkan komunikasi via chat yang tercecer. RantaiNaik
                menyediakan instrumen penawaran terstruktur, scoring kesiapan
                mitra, dan arbitrase mutu sengketa kain SNI.
              </p>

              <div className="space-y-3 pt-3">
                {industriBullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#EFF4FE] text-[#2862E0] mt-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-[#E5E7EB]">
              <Button
                variant="default"
                size="default"
                asChild
                className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-semibold rounded-[4px]"
              >
                <Link href="/register?role=industri">
                  Mulai Buat RFQ
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Compartment 2: Untuk UMKM */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 border-r border-b border-[#E5E7EB] bg-white hover:bg-[#FAFBFC] transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#2862E0]">
                  PEMBERDAYAAN UMKM
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#EFF4FE] text-[#2862E0]">
                  <Scissors className="h-4 w-4" />
                </div>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#0E1422]">
                Dapatkan Akses Proyek Berkelanjutan dengan Kepastian Bayar
              </h3>

              <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                Fokuskan energi Anda pada kualitas potongan dan jahitan. Kami
                memastikan order terverifikasi dengan dana pesanan yang
                diamankan sebelum mesin pertama Anda dijalankan.
              </p>

              <div className="space-y-3 pt-3">
                {umkmBullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#EFF4FE] text-[#2862E0] mt-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-[#E5E7EB]">
              <Button
                variant="secondary"
                size="default"
                asChild
                className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-semibold rounded-[4px] border-[#8B93A1]"
              >
                <Link href="/register?role=umkm">
                  Daftar sebagai Konveksi
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
