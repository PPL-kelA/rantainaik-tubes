export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
              Platform Pengadaan Tekstil B2B
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Selamat Datang di RantaiNaik
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1D4ED8] border border-[#BFDBFE]">
            <span className="h-2 w-2 rounded-full bg-[#1D4ED8]" />
            Fase 1 Aktif
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">
          Menghubungkan kebutuhan pengadaan tekstil industri (seragam,
          merchandise, maklon) dengan UMKM konveksi siap pakai dengan
          perlindungan pembayaran escrow berbasis milestone.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-[#E5E7EB] p-4 bg-[#F9FAFB]">
            <h3 className="text-sm font-semibold text-[#111827]">
              Untuk Industri
            </h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              Posting RFQ terstruktur, bagi alokasi lot pesanan besar, dan
              pantau produksi.
            </p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4 bg-[#F9FAFB]">
            <h3 className="text-sm font-semibold text-[#111827]">
              Untuk UMKM Konveksi
            </h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              Temukan order yang cocok, kirim penawaran transparan, dan dapatkan
              kepastian bayar.
            </p>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] p-4 bg-[#F9FAFB]">
            <h3 className="text-sm font-semibold text-[#111827]">
              Escrow Terlindungi
            </h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              Pendanaan 100% di awal, dirilis per milestone & lolos kendali mutu
              (QC).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
