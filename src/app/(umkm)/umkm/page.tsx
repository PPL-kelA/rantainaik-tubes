export default function UmkmDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
              Portal UMKM Konveksi
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Dashboard Mitra UMKM
            </h1>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#4B5563]">
            Peran: UMKM
          </span>
        </div>
        <p className="mt-4 text-sm text-[#4B5563]">
          Area kerja UMKM untuk melihat rekomendasi RFQ, mengelola penawaran,
          memantau sampel, dan mengecek rilis dana escrow.
        </p>
      </div>
    </div>
  );
}
