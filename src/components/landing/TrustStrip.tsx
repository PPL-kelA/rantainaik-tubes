export function TrustStrip() {
  const stats = [
    {
      value: "380+",
      label: "UMKM Terverifikasi",
      detail: "Kapasitas & legalitas tervalidasi",
    },
    {
      value: "1.240+",
      label: "RFQ Terbuka",
      detail: "Permintaan pengadaan industri aktif",
    },
    {
      value: "4.8",
      label: "Rata-rata Penawaran",
      detail: "Pilihan tender yang kompetitif",
    },
    {
      value: "98.6%",
      label: "Order Selesai Tepat Waktu",
      detail: "Akurasi jadwal dan standar mutu",
    },
  ];

  return (
    <section
      aria-label="Statistik Metrik Transaksi"
      className="w-full border-b border-[#E5E7EB] bg-white"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Grid 4 columns desktop, 2x2 mobile, joined with single hairline border */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] border-x border-[#E5E7EB]">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`p-5 sm:p-6 lg:p-7 flex flex-col justify-between ${
                index % 2 === 1 ? "border-l border-[#E5E7EB] sm:border-l-0" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6475] bg-[#FAFBFC] px-1.5 py-0.5 rounded-[2px] border border-[#E5E7EB]">
                  Data contoh
                </span>
                <span className="font-mono text-[11px] text-[#8B93A1]">
                  0{index + 1}
                </span>
              </div>

              <div className="mt-4">
                <div className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-[#0E1422] tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-[#0E1422]">
                  {stat.label}
                </div>
                <p className="mt-0.5 text-[11px] sm:text-xs text-[#5B6475]">
                  {stat.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
