export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
              Portal Administrasi Platform
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Dashboard Administrator
            </h1>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#B91C1C] border border-[#FECACA]">
            Peran: Admin
          </span>
        </div>
        <p className="mt-4 text-sm text-[#4B5563]">
          Area kerja admin untuk verifikasi profil NIB UMKM, mediasi sengketa,
          audit ledger escrow, dan konfigurasi platform.
        </p>
      </div>
    </div>
  );
}
