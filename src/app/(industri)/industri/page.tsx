import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  FilePlus2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Building2,
  Plus,
} from "lucide-react";
import { listRfqs } from "@/modules/rfq/repo";

export const dynamic = "force-dynamic";

export default async function IndustriDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/industri");
  }

  try {
    requireRole(session.user.role, ["INDUSTRY"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const isVerified = session.user.status === "VERIFIED";
  const orgId = session.user.organizationId || "";

  // Ambil RFQ dari database
  const rfqs = orgId ? await listRfqs({ industryOrgId: orgId }) : [];

  const activeRfqs = rfqs.filter(
    (r) => r.status === "OPEN" || r.status === "EVALUATING"
  );
  const draftRfqs = rfqs.filter((r) => r.status === "DRAFT");
  const finishedRfqs = rfqs.filter(
    (r) =>
      r.status === "AWARDED" ||
      r.status === "AWARDED_PARTIAL" ||
      r.status === "CLOSED" ||
      r.status === "CANCELLED" ||
      r.status === "EXPIRED"
  );

  const sp = searchParams ? await searchParams : {};
  const currentTab = sp.tab || "aktif";

  let displayedRfqs = activeRfqs;
  if (currentTab === "draft") displayedRfqs = draftRfqs;
  if (currentTab === "selesai") displayedRfqs = finishedRfqs;

  return (
    <div className="space-y-6">
      {/* PENDING Warning Banner (BR-01 Guard Info) */}
      {!isVerified && (
        <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="rounded-lg bg-[#FEF3C7] p-2 text-[#B45309]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#92400E]">
                Akun Perusahaan Menunggu Verifikasi (Status: PENDING)
              </h2>
              <p className="mt-1 text-xs text-[#B45309] leading-relaxed">
                Sesuai aturan bisnis <strong>BR-01</strong>, hanya akun industri
                dengan status <strong>VERIFIED</strong> yang diizinkan untuk
                memposting RFQ atau mendanai escrow. Akun Anda dapat
                diverifikasi langsung oleh Admin platform pada portal
                administrasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Industri Portal Header (P12) */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
                Portal Pengadaan Industri & Korporasi
              </span>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D] border border-[#DCFCE7]">
                  <ShieldCheck className="h-3 w-3" />
                  Terverifikasi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-[11px] font-semibold text-[#B45309] border border-[#FDE68A]">
                  <Clock className="h-3 w-3" />
                  Menunggu Verifikasi Admin
                </span>
              )}
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#111827]">
              {session.user.organizationName || "Mitra Industri Pengadaan"}
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Email Akun: {session.user.email} · Divisi Pengadaan & Logistik
              Tekstil
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/industri/profil"
              className="flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              <Building2 className="h-4 w-4 text-[#1D4ED8]" />
              Profil & Legalitas
            </Link>
            {isVerified ? (
              <Link
                href="/industri/rfq/baru"
                className="flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1E40AF] transition-colors"
              >
                <FilePlus2 className="h-4 w-4" />
                Buat RFQ Baru
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-xs opacity-50 cursor-not-allowed"
              >
                <FilePlus2 className="h-4 w-4" />
                Posting Terkunci (BR-01)
              </button>
            )}
          </div>
        </div>

        {/* Stat Strip 4-Kolom (P12) */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              RFQ Aktif Diposting
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {activeRfqs.length}
            </p>
            <span className="text-[11px] text-[#6B7280]">
              {draftRfqs.length} draft tersimpan
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              Total Item Dipesan
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {activeRfqs.reduce((s, r) => s + r.items.length, 0)}
            </p>
            <span className="text-[11px] text-[#1D4ED8] font-medium">
              Dari seluruh RFQ aktif
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <span className="text-xs font-medium text-[#6B7280]">
              Order Berjalan
            </span>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "1" : "0"}
            </p>
            <span className="text-[11px] text-[#15803D] font-medium">
              Milestone: Pemotongan bahan
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">Dana Escrow Diamankan</span>
              <Layers className="h-4 w-4 text-[#1D4ED8]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {isVerified ? "Rp33.750.000" : "Rp0"}
            </p>
            <span className="text-[11px] text-[#6B7280]">
              100% didanai di awal
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2 Kolom: RFQ Pengadaan & Status Dana Escrow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: RFQ Saya (P12) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  Daftar RFQ Saya (P12)
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Kelola spesifikasi, pantau penawaran UMKM yang masuk, dan
                  terbitkan addendum.
                </p>
              </div>

              {/* Tab Garis Bawah (Aktif, Draft, Selesai) */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <Link
                  href="/industri?tab=aktif"
                  className={`pb-1 border-b-2 transition-colors ${
                    currentTab === "aktif"
                      ? "border-[#1D4ED8] text-[#1D4ED8]"
                      : "border-transparent text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Aktif ({activeRfqs.length})
                </Link>
                <Link
                  href="/industri?tab=draft"
                  className={`pb-1 border-b-2 transition-colors ${
                    currentTab === "draft"
                      ? "border-[#1D4ED8] text-[#1D4ED8]"
                      : "border-transparent text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Draft ({draftRfqs.length})
                </Link>
                <Link
                  href="/industri?tab=selesai"
                  className={`pb-1 border-b-2 transition-colors ${
                    currentTab === "selesai"
                      ? "border-[#1D4ED8] text-[#1D4ED8]"
                      : "border-transparent text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Selesai ({finishedRfqs.length})
                </Link>
              </div>
            </div>

            <div className="mt-4 divide-y divide-[#E5E7EB]">
              {displayedRfqs.length > 0 ? (
                displayedRfqs.map((rfq) => {
                  const totalPcs = rfq.items.reduce(
                    (sum, it) => sum + it.totalQuantity,
                    0
                  );
                  return (
                    <div key={rfq.id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#6B7280]">
                          {rfq.rfqNumber} · Mode {rfq.allocationMode}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            rfq.status === "OPEN"
                              ? "bg-[#F0FDF4] text-[#15803D]"
                              : rfq.status === "DRAFT"
                                ? "bg-[#F3F4F6] text-[#4B5563]"
                                : "bg-[#EFF6FF] text-[#1D4ED8]"
                          }`}
                        >
                          Status: {rfq.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#111827] hover:text-[#1D4ED8] transition-colors">
                        <Link href={`/umkm/rfq/${rfq.id}`}>{rfq.title}</Link>
                      </h3>

                      <p className="text-xs text-[#4B5563]">
                        {totalPcs} pcs ({rfq.items.length} item) · Kategori:{" "}
                        {rfq.categoryType} · Lokasi: {rfq.deliveryLocation}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-[#6B7280]">
                          Tenggat:{" "}
                          {new Date(rfq.quotationDeadline).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/umkm/rfq/${rfq.id}`}
                            className="flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline"
                          >
                            Buka Detail RFQ
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-[#6B7280] space-y-2">
                  <p>Tidak ada RFQ pada kategori tab ini.</p>
                  {isVerified && (
                    <Link
                      href="/industri/rfq/baru"
                      className="inline-flex items-center gap-1 font-semibold text-[#1D4ED8] hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Buat RFQ Baru Sekarang
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Perlindungan Escrow */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Ringkasan Rekening Escrow
            </h3>
            <p className="text-2xl font-bold text-[#111827]">Rp33.750.000</p>
            <p className="text-xs text-[#6B7280]">
              Total dana diamankan untuk Order RFQ-0007 (CV Karya Mandiri
              Konveksi).
            </p>

            <div className="space-y-2 pt-2 text-xs border-t border-[#E5E7EB]">
              <div className="flex justify-between">
                <span className="text-[#4B5563]">
                  Tahap 1 (Bahan Tiba 30%):
                </span>
                <span className="font-semibold text-[#111827]">
                  Rp10.125.000
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563]">Tahap 2 (Lolos QC 70%):</span>
                <span className="font-semibold text-[#111827]">
                  Rp23.625.000
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-[#EFF6FF] p-3 text-[11px] text-[#1E40AF]">
              Dana Anda dilindungi penuh. Jika terjadi ketidaksesuaian
              spesifikasi atau gagal QC, dana dapat direfund atau ditahan
              melalui mediasi sengketa admin.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
