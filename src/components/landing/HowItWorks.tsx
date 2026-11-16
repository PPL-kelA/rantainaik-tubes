export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Posting RFQ",
      description:
        "Industri mempublikasikan spesifikasi pakaian jadi, volume potong, spesifikasi kain GSM, toleransi cacat AQL, dan jadwal kebutuhan sampel.",
    },
    {
      number: "02",
      title: "Terima Penawaran",
      description:
        "UMKM terverifikasi mengajukan harga tertutup (sealed bid), komitmen lead time hari kerja, dan melampirkan profil kesiapan mesin jahit.",
    },
    {
      number: "03",
      title: "Pilih & Danai",
      description:
        "Tentukan pemenang tender tunggal atau split award per lot. Dana dialokasikan ke rekening komitmen penampungan escrow yang terlindungi.",
      badge: "Escrow dalam pengembangan",
    },
    {
      number: "04",
      title: "Produksi & QC",
      description:
        "Konveksi memproduksi batch pesanan setelah approval golden sample. Dana dirilis otomatis saat inspeksi mutu kain akhir dinyatakan lolos.",
    },
  ];

  return (
    <section
      id="cara-kerja"
      aria-label="Alur Cara Kerja Pengadaan"
      className="w-full border-b border-[#E5E7EB] bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="border-b border-[#E5E7EB] pb-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            STANDAR OPERASIONAL
          </span>
          <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#0E1422]">
            Alur Pengadaan Tekstil dalam 4 Langkah
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5B6475]">
            Mekanisme terstandarisasi untuk menjamin kejelasan spesifikasi dan
            kepastian pembayaran.
          </p>
        </div>

        {/* 4-Step Grid (Desktop 4 Cols, Tablet 2x2, Mobile 1 Col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#E5E7EB]">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between p-6 sm:p-7 border-r border-b border-[#E5E7EB] bg-white hover:bg-[#FAFBFC] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#2862E0]">
                    {step.number}
                  </span>
                  {step.badge && (
                    <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] font-medium border border-[#FEF3C7]">
                      {step.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-heading text-base sm:text-lg font-semibold text-[#0E1422]">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E7EB]/60 font-mono text-[11px] text-[#8B93A1]">
                Langkah {step.number} dari 04
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
