import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FilePlus2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Building2,
  Plus,
  Lock,
} from "lucide-react";
import { listRfqs } from "@/modules/rfq/repo";
import { Button, PageHeader, SearchBar, StatusBadge } from "@/components/ui";

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
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* PENDING Warning Banner (BR-01 Guard Info) */}
      {!isVerified && (
        <div className="bg-[#FFFBEB] p-4 sm:p-5 text-[#92400E]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[#B45309] mt-0.5" />
            <div>
              <h2 className="font-heading text-sm font-semibold text-[#92400E]">
                Akun perusahaan menunggu verifikasi (Status: PENDING)
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

      {/* Main Page Header Compartment (P12) */}
      <div className="p-6 sm:p-8">
        <PageHeader
          className="border-b-0 pb-0"
          category="Portal Pengadaan Industri & Korporasi"
          title={session.user.organizationName || "Mitra Industri Pengadaan"}
          description={`Akun pengadaan tekstil: ${session.user.email} · Divisi Pengadaan & Logistik Tekstil`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link
                  href="/industri/profil"
                  className="flex items-center gap-2 text-xs"
                >
                  <Building2 className="h-4 w-4 text-[#2862E0]" />
                  Profil & Legalitas
                </Link>
              </Button>
              {isVerified ? (
                <Button variant="default" size="sm" asChild>
                  <Link
                    href="/industri/rfq/baru"
                    className="flex items-center gap-2 font-semibold text-xs"
                  >
                    <FilePlus2 className="h-4 w-4" />
                    Buat RFQ Baru
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="neutral"
                  size="sm"
                  disabled
                  className="opacity-50 cursor-not-allowed text-xs"
                >
                  <Lock className="h-4 w-4" />
                  Posting Terkunci (BR-01)
                </Button>
              )}
            </div>
          }
        />

        {/* In-Page Search Bar under Header */}
        <div className="mt-5 w-full">
          <SearchBar
            placeholder="Cari RFQ saya, nomor tender, atau kategori pesanan..."
            className="w-full"
          />
        </div>
      </div>

      {/* Stat Strip 4-Kolom Instrumen Kompartemen (Seamless Grid) */}
      <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            RFQ Aktif Diposting
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {activeRfqs.length}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            {draftRfqs.length} draft tersimpan
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Total Item Dipesan
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {activeRfqs.reduce((s, r) => s + r.items.length, 0)}
          </p>
          <span className="font-mono text-[11px] font-medium text-[#2862E0]">
            Dari seluruh RFQ aktif
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Order Berjalan
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {isVerified ? "1" : "0"}
          </p>
          <span className="font-mono text-[11px] font-medium text-[#15803D]">
            Milestone: Pemotongan bahan
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em]">
              Dana Escrow Diamankan
            </span>
            <Layers className="h-4 w-4 text-[#2862E0]" />
          </div>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {isVerified ? "Rp33.750.000" : "Rp0"}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            100% didanai di awal
          </span>
        </div>
      </div>

      {/* Grid 2 Kolom Kompartemen Bergaris Bersama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
        {/* Kolom Kiri: RFQ Saya (P12) */}
        <div className="lg:col-span-8 bg-white">
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-heading font-semibold text-[#0E1422]">
                  Daftar RFQ Saya (P12)
                </h2>
                <p className="text-xs text-[#5B6475] mt-0.5">
                  Kelola spesifikasi, pantau penawaran UMKM yang masuk, dan
                  terbitkan addendum.
                </p>
              </div>

              {/* Underline Tabs: Strictly No Pill */}
              <div
                className="flex items-center gap-4 border-b border-[#E5E7EB] sm:border-b-0 self-start sm:self-auto"
                role="tablist"
              >
                <Link
                  href="/industri?tab=aktif"
                  className={`pb-2 text-xs transition-colors border-b-2 font-medium ${
                    currentTab === "aktif"
                      ? "border-[#2862E0] text-[#0E1422] font-semibold"
                      : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
                  }`}
                >
                  Aktif ({activeRfqs.length})
                </Link>
                <Link
                  href="/industri?tab=draft"
                  className={`pb-2 text-xs transition-colors border-b-2 font-medium ${
                    currentTab === "draft"
                      ? "border-[#2862E0] text-[#0E1422] font-semibold"
                      : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
                  }`}
                >
                  Draft ({draftRfqs.length})
                </Link>
                <Link
                  href="/industri?tab=selesai"
                  className={`pb-2 text-xs transition-colors border-b-2 font-medium ${
                    currentTab === "selesai"
                      ? "border-[#2862E0] text-[#0E1422] font-semibold"
                      : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
                  }`}
                >
                  Selesai ({finishedRfqs.length})
                </Link>
              </div>
            </div>
          </div>

          {/* List RFQ dengan baris padding simetris 24px kiri-kanan dan 20px atas-bawah */}
          <div className="divide-y divide-[#E5E7EB]">
            {displayedRfqs.length > 0 ? (
              displayedRfqs.map((rfq) => {
                const totalPcs = rfq.items.reduce(
                  (sum, it) => sum + it.totalQuantity,
                  0
                );
                return (
                  <div
                    key={rfq.id}
                    className="px-6 py-5 space-y-3.5 transition-colors hover:bg-[#FAFBFC]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                          {rfq.rfqNumber}
                        </span>
                        <span className="font-mono text-xs text-[#5B6475]">
                          Mode {rfq.allocationMode}
                        </span>
                      </div>

                      <StatusBadge status={rfq.status} />
                    </div>

                    <h3 className="font-heading text-base font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors">
                      <Link href={`/industri/rfq/${rfq.id}`}>{rfq.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                      <span className="font-mono font-medium text-[#0E1422]">
                        {totalPcs}
                      </span>{" "}
                      pcs ({rfq.items.length} item) · Kategori:{" "}
                      <span className="font-medium text-[#0E1422]">
                        {rfq.categoryType}
                      </span>{" "}
                      · Lokasi:{" "}
                      <span className="font-medium text-[#0E1422]">
                        {rfq.deliveryLocation}
                      </span>
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#5B6475]">
                      <span>
                        Tenggat penawaran:{" "}
                        <span className="font-medium text-[#0E1422]">
                          {new Date(rfq.quotationDeadline).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" }
                          )}
                        </span>
                      </span>

                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/industri/rfq/${rfq.id}`}
                          className="flex items-center gap-1 font-semibold text-[#2862E0] hover:text-[#2858B8]"
                        >
                          Buka Detail RFQ
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs sm:text-sm text-[#5B6475] space-y-3">
                <p>Tidak ada RFQ pada kategori tab ini.</p>
                {isVerified && (
                  <Button variant="secondary" size="sm" asChild>
                    <Link
                      href="/industri/rfq/baru"
                      className="inline-flex items-center gap-1.5 rounded-[4px]"
                    >
                      <Plus className="h-3.5 w-3.5 text-[#2862E0]" />
                      Buat RFQ Baru Sekarang
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Rekening Escrow Kompartemen */}
        <div className="lg:col-span-4 bg-[#FAFBFC] p-6 sm:p-7 space-y-4">
          <div className="space-y-1 border-b border-[#E5E7EB] pb-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Ringkasan Rekening Escrow
            </span>
            <p className="mt-1 font-heading text-2xl sm:text-3xl font-semibold tabular-nums text-[#0E1422]">
              Rp33.750.000
            </p>
            <p className="mt-1 text-xs text-[#5B6475] leading-relaxed">
              Total dana diamankan untuk Order{" "}
              <span className="font-mono text-xs font-semibold text-[#2862E0]">
                RFQ-0007
              </span>{" "}
              (CV Karya Mandiri Konveksi).
            </p>
          </div>

          <div className="space-y-2.5 pt-1 text-xs bg-white p-4 border border-[#E5E7EB] rounded-[4px]">
            <div className="flex justify-between border-b border-[#E5E7EB] pb-2 text-[#5B6475]">
              <span>Tahap 1 (Bahan Tiba 30%):</span>
              <span className="font-mono font-semibold tabular-nums text-[#0E1422]">
                Rp10.125.000
              </span>
            </div>
            <div className="flex justify-between text-[#5B6475]">
              <span>Tahap 2 (Lolos QC 70%):</span>
              <span className="font-mono font-semibold tabular-nums text-[#0E1422]">
                Rp23.625.000
              </span>
            </div>
          </div>

          <div className="bg-[#EFF4FE] p-3.5 text-xs text-[#1E40AF] leading-relaxed rounded-[4px]">
            Dana Anda dilindungi penuh di bawah simulasi escrow RantaiNaik. Dana
            hanya dirilis setelah QC lolos atau diselesaikan lewat mediasi
            sengketa admin.
          </div>
        </div>
      </div>
    </div>
  );
}
