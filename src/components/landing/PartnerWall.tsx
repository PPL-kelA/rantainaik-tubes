export function PartnerWall() {
  const partners = [
    { name: "PT Nusantara Tekstil Prima", category: "Pabrik Garmen" },
    { name: "CV Sinar Konveksi Bandung", category: "Spesialis Maklon CMT" },
    { name: "PT Garment Indah Makmur", category: "Industri Pakaian Kerja" },
    { name: "Berkah Jaya Tailor & CMT", category: "Konveksi Seragam" },
    { name: "PT Mandiri Seragam Solusindo", category: "Korporasi Pengadaan" },
    { name: "Karya Busana Lestari", category: "Merchandise & Promosi" },
  ];

  return (
    <section
      id="partner-wall"
      aria-label="Pelaku Industri dan UMKM Mitra"
      className="w-full border-b border-[#E5E7EB] bg-white py-12 sm:py-16"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              PELAKU YANG KAMI LAYANI
            </span>
            <h2 className="mt-1 font-heading text-lg sm:text-xl font-semibold text-[#0E1422]">
              Ekosistem Terintegrasi Pembeli Industri & UMKM Jahit
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6475] bg-[#FAFBFC] px-1.5 py-0.5 rounded-[2px] border border-[#E5E7EB] self-start sm:self-auto">
            Data contoh
          </span>
        </div>

        {/* 6-Column Grid (3 on tablet, 2 on mobile) with unified borders */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-l border-[#E5E7EB]">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col justify-between p-4 sm:p-5 border-r border-b border-[#E5E7EB] bg-white hover:bg-[#FAFBFC] transition-colors"
            >
              <span className="font-mono text-[10px] uppercase text-[#8B93A1]">
                {partner.category}
              </span>
              <p className="mt-3 text-xs sm:text-sm font-semibold text-[#0E1422] leading-snug">
                {partner.name}
              </p>
              <div className="mt-4 pt-2 border-t border-[#E5E7EB]/60 flex items-center justify-between text-[10px] font-mono text-[#5B6475]">
                <span>Terverifikasi</span>
                <span className="text-[#15803D]">● Aktif</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
