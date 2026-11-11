import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function UseCases() {
  const cases = [
    {
      category: "SERAGAM",
      title: "Pengadaan 1.200 Stel Kemeja Kerja Lapangan PT Andalan Logistik",
      metric1: "14 Hari",
      metric1Label: "Waktu seleksi tender selesai",
      metric2: "100%",
      metric2Label: "Lolos uji golden sample",
      summary:
        "Spesifikasi bahan American Drill dengan toleransi jahitan ganda SNI. Tender diikuti 6 UMKM konveksi Jawa Barat dengan 1 pemenang terpilih.",
      linkText: "Lihat alur seragam",
      href: "/login",
    },
    {
      category: "MERCHANDISE",
      title: "Produksi 5.000 Kaos Katun Combed Event Korporasi Nasional",
      metric1: "3 Mitra",
      metric1Label: "Split award 3 lot jahit lokal",
      metric2: "Rp0",
      metric2Label: "Risiko sengketa pembayaran",
      summary:
        "Volume dibagi menjadi 3 lot untuk memastikan tenggat 10 hari terpenuhi tanpa overload kapasitas pada satu vendor konveksi tunggal.",
      linkText: "Lihat alur split lot",
      href: "/login",
    },
    {
      category: "MAKLON",
      title: "Kapasitas CMT 10.000 Pcs Celana Chino Musim Liburan",
      metric1: "86",
      metric1Label: "Rata-rata Readiness Score",
      metric2: "2 Tahap",
      metric2Label: "Milestone QC potong & jahit",
      summary:
        "Pabrik garmen mengalihkan lonjakan beban potong dan jahit ke 4 konveksi binaan yang memiliki mesin obras 4-benang terverifikasi.",
      linkText: "Lihat alur maklon",
      href: "/login",
    },
  ];

  return (
    <section
      aria-label="Contoh Alur Pengadaan"
      className="w-full border-b border-[#E5E7EB] bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              CONTOH ALUR PENGADAAN
            </span>
            <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#0E1422]">
              Pola Pengadaan yang Sering Dijalankan
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6475] bg-[#FAFBFC] px-1.5 py-0.5 rounded-[2px] border border-[#E5E7EB] self-start sm:self-auto">
            Data contoh
          </span>
        </div>

        {/* 3-Column Story Cards Grid with Uniform Height */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-l border-[#E5E7EB]">
          {cases.map((c) => (
            <div
              key={c.category}
              className="flex flex-col justify-between p-5 sm:p-6 lg:p-7 border-r border-b border-[#E5E7EB] bg-white hover:bg-[#FAFBFC] transition-colors"
            >
              {/* Top part: Category & Title */}
              <div>
                <span className="font-mono text-xs font-semibold tracking-wider text-[#2862E0]">
                  [{c.category}]
                </span>

                <h3 className="mt-3 font-heading text-base sm:text-lg font-semibold text-[#0E1422] leading-snug min-h-[3rem]">
                  {c.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                  {c.summary}
                </p>
              </div>

              {/* Middle part: 2 Big Metric Numbers */}
              <div className="mt-6 pt-6 border-t border-[#E5E7EB] grid grid-cols-2 gap-4">
                <div>
                  <div className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-[#0E1422] tabular-nums">
                    {c.metric1}
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-[#5B6475]">
                    {c.metric1Label}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-[#2862E0] tabular-nums">
                    {c.metric2}
                  </div>
                  <div className="mt-1 text-[11px] sm:text-xs text-[#5B6475]">
                    {c.metric2Label}
                  </div>
                </div>
              </div>

              {/* Bottom part: Link */}
              <div className="mt-6 pt-4 border-t border-[#E5E7EB]/60">
                <Link
                  href={c.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2862E0] hover:text-[#2858B8] focus:outline-none focus:ring-2 focus:ring-[#2862E0] rounded-[2px]"
                >
                  <span>{c.linkText}</span>
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
