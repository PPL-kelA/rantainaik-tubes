export default function IndustriDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
              Portal Pembeli Industri
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Dashboard Pengadaan Industri
            </h1>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#4B5563]">
            Peran: Industri
          </span>
        </div>
        <p className="mt-4 text-sm text-[#4B5563]">
          Area kerja industri untuk membuat RFQ baru, membandingkan penawaran
          UMKM, mengelola alokasi lot, dan mendanai escrow.
        </p>
      </div>
    </div>
  );
}
