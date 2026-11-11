import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function Resources() {
  const articles = [
    {
      title: "Panduan Menulis RFQ Tekstil",
      description:
        "Standar penulisan spesifikasi gramasi kain, toleransi ukuran potong, dan petunjuk teknis golden sample.",
      href: "#", // TODO: Halaman dokumentasi teknis RFQ
      badge: null,
    },
    {
      title: "Cara Kerja Escrow & Milestone",
      description:
        "Memahami alur komitmen dana pesanan di awal dan skema pelepasan bertahap berbasis approval kendali mutu.",
      href: "#", // TODO: Halaman rancangan escrow
      badge: "Dalam pengembangan",
    },
    {
      title: "Mengenal 6 Pilar Readiness Score",
      description:
        "Ketahui komponen penilaian kesiapan mesin jahit, legalitas usaha, dan rekam jejak untuk memenangkan tender.",
      href: "#", // TODO: Halaman panduan readiness score
      badge: null,
    },
    {
      title: "Tanya Jawab Seputar Pengadaan",
      description:
        "Pertanyaan umum seputar verifikasi organisasi, toleransi cacat kain AQL 2.5, dan arbitrase mediasi sengketa.",
      href: "#", // TODO: Halaman FAQ platform
      badge: null,
    },
  ];

  return (
    <section
      id="sumber-belajar"
      aria-label="Pusat Sumber Belajar dan Panduan"
      className="w-full border-b border-[#E5E7EB] bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="border-b border-[#E5E7EB] pb-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            SUMBER BELAJAR
          </span>
          <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#0E1422]">
            Panduan & Wawasan Pengadaan Tekstil B2B
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5B6475]">
            Materi edukasi dan dokumentasi teknis untuk memperlancar proses
            pengadaan Anda.
          </p>
        </div>

        {/* 4 Cells Grid (Desktop 4 cols, Tablet 2 cols, Mobile 1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#E5E7EB]">
          {articles.map((art) => (
            <div
              key={art.title}
              className="flex flex-col justify-between p-6 sm:p-7 border-r border-b border-[#E5E7EB] bg-white hover:bg-[#FAFBFC] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#EFF4FE] text-[#2862E0]">
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>
                  {art.badge && (
                    <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] font-medium border border-[#FEF3C7]">
                      {art.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-base font-semibold text-[#0E1422] leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-[#5B6475] leading-relaxed">
                  {art.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E7EB]/60">
                <Link
                  href={art.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2862E0] hover:text-[#2858B8] focus:outline-none focus:ring-2 focus:ring-[#2862E0] rounded-[2px]"
                >
                  <span>Baca panduan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
