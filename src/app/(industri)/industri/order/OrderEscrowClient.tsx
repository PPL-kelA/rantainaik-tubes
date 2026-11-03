"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  DollarSign,
  Check,
  PackageCheck,
} from "lucide-react";
import { Button, PageHeader, SearchBar, StatusBadge } from "@/components/ui";

export interface OrderEscrowItem {
  id: string;
  orderNumber: string;
  rfqId: string;
  rfqNumber: string;
  rfqTitle: string;
  umkmOrg: {
    id: string;
    name: string;
    city: string;
    isVerified: boolean;
  };
  totalAmount: number;
  stage1Amount: number; // 30%
  stage2Amount: number; // 70%
  platformCommission: number; // 5%
  escrowStatus:
    "AWAITING_FUNDING" | "FUNDED" | "PARTIALLY_RELEASED" | "RELEASED";
  orderStatus:
    "AWAITING_FUNDING" | "IN_PRODUCTION" | "IN_QC" | "COMPLETED" | "DISPUTED";
  milestones: {
    stage1Name: string;
    stage1Done: boolean;
    stage1Date?: string | null;
    stage2Name: string;
    stage2Done: boolean;
    stage2Date?: string | null;
  };
  quantityPcs: number;
  targetDeliveryDate: string;
  createdAt: string;
}

interface OrderEscrowClientProps {
  orders: OrderEscrowItem[];
  companyName: string;
}

type TabFilter =
  | "ALL"
  | "AWAITING_FUNDING"
  | "IN_PRODUCTION"
  | "IN_QC"
  | "COMPLETED"
  | "DISPUTED";

export function OrderEscrowClient({
  orders: initialOrders,
}: OrderEscrowClientProps) {
  const [orders, setOrders] = useState<OrderEscrowItem[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TabFilter>("ALL");

  // State Modal Aksi Rilis Dana / QC
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(
    null
  );

  // Filter logic
  const filtered = orders.filter((o) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.rfqNumber.toLowerCase().includes(q) ||
      o.rfqTitle.toLowerCase().includes(q) ||
      o.umkmOrg.name.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (statusFilter !== "ALL" && o.orderStatus !== statusFilter) return false;

    return true;
  });

  const totalEscrowFunded = orders
    .filter(
      (o) =>
        o.escrowStatus === "FUNDED" || o.escrowStatus === "PARTIALLY_RELEASED"
    )
    .reduce((s, o) => s + o.totalAmount, 0);

  const countByStatus = {
    ALL: orders.length,
    AWAITING_FUNDING: orders.filter((o) => o.orderStatus === "AWAITING_FUNDING")
      .length,
    IN_PRODUCTION: orders.filter((o) => o.orderStatus === "IN_PRODUCTION")
      .length,
    IN_QC: orders.filter((o) => o.orderStatus === "IN_QC").length,
    COMPLETED: orders.filter((o) => o.orderStatus === "COMPLETED").length,
    DISPUTED: orders.filter((o) => o.orderStatus === "DISPUTED").length,
  };

  const handleFundEscrow = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              escrowStatus: "FUNDED",
              orderStatus: "IN_PRODUCTION",
            }
          : o
      )
    );
    setActionSuccessNotice(
      "Simulasi pendanaan escrow 100% berhasil diamankan. UMKM telah dinotifikasikan untuk memulai produksi!"
    );
    setTimeout(() => setActionSuccessNotice(null), 3500);
  };

  const handleConfirmQcAndRelease = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              escrowStatus: "RELEASED",
              orderStatus: "COMPLETED",
              milestones: {
                ...o.milestones,
                stage2Done: true,
                stage2Date: new Date().toISOString(),
              },
            }
          : o
      )
    );
    setActionSuccessNotice(
      "Pemeriksaan QC telah disetujui (Lolos). Dana sisa 70% telah dirilis ke rekening UMKM dikurangi 5% komisi platform."
    );
    setTimeout(() => setActionSuccessNotice(null), 3500);
  };

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* Toast Alert */}
      {actionSuccessNotice && (
        <div className="bg-[#F0FDF4] border-b border-[#DCFCE7] p-4 text-xs font-medium text-[#15803D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessNotice(null)}
            className="text-[#5B6475] hover:text-[#0E1422]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main PageHeader Kompartemen */}
      <div className="p-6 sm:p-8">
        <PageHeader
          className="border-b-0 pb-0"
          category="Keuangan & Pelaksanaan Kontrak"
          title="Manajemen Order & Rekening Escrow"
          description="Pantau status produksi konveksi, pencairan bertahap 2-milestone, dan keamanan dana lelang pada rekening simulasi escrow RantaiNaik."
          actions={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link
                  href="/industri/rfq"
                  className="flex items-center gap-1.5 text-xs rounded-[4px]"
                >
                  <FileText className="h-4 w-4 text-[#2862E0]" />
                  Katalog RFQ
                </Link>
              </Button>
            </div>
          }
        />

        {/* In-Page SearchBar */}
        <div className="mt-5 w-full">
          <SearchBar
            placeholder="Cari nomor Purchase Order (PO-XXXX), nomor RFQ, atau nama konveksi mitra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Stat Strip 4-Kolom Instrumen Escrow */}
      <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Total Escrow Diamankan
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            Rp{totalEscrowFunded.toLocaleString("id-ID")}
          </p>
          <span className="font-mono text-[11px] text-[#15803D]">
            100% didanai di awal (BR-09)
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Order Sedang Produksi
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {countByStatus.IN_PRODUCTION}
          </p>
          <span className="font-mono text-[11px] text-[#2862E0]">
            Pengerjaan di workshop UMKM
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Menunggu Verifikasi QC
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {countByStatus.IN_QC}
          </p>
          <span className="font-mono text-[11px] text-[#B45309]">
            Window klaim cacat 5 hari
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Order Selesai
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {countByStatus.COMPLETED}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            Dana dirilis penuh ke UMKM
          </span>
        </div>
      </div>

      {/* Underline Tabs: Filter Status Order */}
      <div className="px-6 bg-white border-b border-[#E5E7EB] overflow-x-auto">
        <div className="flex items-center gap-6" role="tablist">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "ALL"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Semua Order ({countByStatus.ALL})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("IN_PRODUCTION")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "IN_PRODUCTION"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Sedang Produksi ({countByStatus.IN_PRODUCTION})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("IN_QC")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "IN_QC"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Pemeriksaan QC ({countByStatus.IN_QC})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("AWAITING_FUNDING")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "AWAITING_FUNDING"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Perlu Didanai ({countByStatus.AWAITING_FUNDING})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("COMPLETED")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "COMPLETED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Selesai ({countByStatus.COMPLETED})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("DISPUTED")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "DISPUTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Dalam Sengketa ({countByStatus.DISPUTED})
          </button>
        </div>
      </div>

      {/* Feed Order: Padding Baris px-6 py-5 */}
      <div className="divide-y divide-[#E5E7EB]">
        {filtered.length > 0 ? (
          filtered.map((order) => (
            <div
              key={order.id}
              className="px-6 py-5 space-y-4 transition-colors hover:bg-[#FAFBFC]"
            >
              {/* Header Baris Order */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-[#8B93A1]">RFQ:</span>
                  <Link
                    href={`/industri/rfq/${order.rfqId}`}
                    className="font-mono text-xs font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors"
                  >
                    {order.rfqNumber}
                  </Link>
                  <span className="text-xs text-[#5B6475] truncate max-w-sm">
                    · {order.rfqTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[2px] ${
                      order.escrowStatus === "FUNDED"
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : order.escrowStatus === "RELEASED"
                          ? "bg-[#EFF4FE] text-[#1E40AF]"
                          : "bg-[#FEF3C7] text-[#B45309]"
                    }`}
                  >
                    Escrow: {order.escrowStatus}
                  </span>
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>

              {/* Grid Informasi Mitra & Milestone 2-Tahap */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Kolom Mitra (4 cols) */}
                <div className="md:col-span-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#2862E0] shrink-0" />
                    <span className="font-heading text-sm font-semibold text-[#0E1422]">
                      {order.umkmOrg.name}
                    </span>
                    {order.umkmOrg.isVerified && (
                      <ShieldCheck className="h-4 w-4 text-[#15803D]" />
                    )}
                  </div>
                  <p className="text-xs text-[#5B6475]">
                    Lokasi Workshop: {order.umkmOrg.city}
                  </p>
                  <div className="pt-1 text-xs text-[#5B6475]">
                    Target Kirim:{" "}
                    <strong className="text-[#0E1422]">
                      {new Date(order.targetDeliveryDate).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </strong>{" "}
                    ({order.quantityPcs.toLocaleString("id-ID")} pcs)
                  </div>
                </div>

                {/* Kolom Milestone 2-Tahap (5 cols) */}
                <div className="md:col-span-5 bg-[#FAFBFC] p-3.5 border border-[#E5E7EB] rounded-[4px] space-y-2.5">
                  <span className="font-mono text-[10px] uppercase font-semibold text-[#8B93A1] block">
                    Tahapan Pencairan Dana Escrow (BR-15 & BR-17)
                  </span>

                  {/* Milestone 1: 30% */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {order.milestones.stage1Done ? (
                        <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                      ) : (
                        <Clock className="h-4 w-4 text-[#8B93A1]" />
                      )}
                      <span
                        className={
                          order.milestones.stage1Done
                            ? "text-[#0E1422] font-medium"
                            : "text-[#5B6475]"
                        }
                      >
                        Tahap 1 (30%): Konfirmasi Bahan Tiba
                      </span>
                    </div>
                    <span className="font-mono font-semibold tabular-nums text-[#0E1422]">
                      Rp{order.stage1Amount.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Milestone 2: 70% */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E5E7EB]/60">
                    <div className="flex items-center gap-1.5">
                      {order.milestones.stage2Done ? (
                        <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                      ) : (
                        <Clock className="h-4 w-4 text-[#8B93A1]" />
                      )}
                      <span
                        className={
                          order.milestones.stage2Done
                            ? "text-[#0E1422] font-medium"
                            : "text-[#5B6475]"
                        }
                      >
                        Tahap 2 (70%): Lolos Pemeriksaan QC
                      </span>
                    </div>
                    <span className="font-mono font-semibold tabular-nums text-[#0E1422]">
                      Rp{order.stage2Amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Kolom Nominal Total & Tombol Aksi (3 cols) */}
                <div className="md:col-span-3 flex flex-col justify-between gap-2.5">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#8B93A1] block">
                      Total Nilai Kontrak
                    </span>
                    <p className="font-heading text-lg font-semibold tabular-nums text-[#0E1422]">
                      Rp{order.totalAmount.toLocaleString("id-ID")}
                    </p>
                    <span className="font-mono text-[10px] text-[#5B6475] block">
                      Termasuk komisi platform 5% (Rp
                      {order.platformCommission.toLocaleString("id-ID")})
                    </span>
                  </div>

                  {/* Tombol Aksi Sesuai Status */}
                  {order.orderStatus === "AWAITING_FUNDING" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleFundEscrow(order.id)}
                      className="w-full text-xs font-semibold rounded-[4px]"
                    >
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      Danai 100% Escrow
                    </Button>
                  )}

                  {order.orderStatus === "IN_QC" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleConfirmQcAndRelease(order.id)}
                      className="w-full text-xs font-semibold rounded-[4px]"
                    >
                      <PackageCheck className="h-3.5 w-3.5 mr-1" />
                      Konfirmasi QC & Rilis 70%
                    </Button>
                  )}

                  {order.orderStatus === "IN_PRODUCTION" && (
                    <div className="p-2 bg-[#EFF4FE] text-[#1E40AF] text-[11px] rounded-[4px] text-center font-medium">
                      UMKM sedang produksi massal.
                    </div>
                  )}

                  {order.orderStatus === "COMPLETED" && (
                    <div className="p-2 bg-[#F0FDF4] text-[#15803D] text-[11px] rounded-[4px] text-center font-medium">
                      Order telah selesai penuh.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-xs sm:text-sm text-[#5B6475] space-y-2">
            <p className="text-[#0E1422] font-medium">
              Tidak ada order yang cocok dengan filter status ini.
            </p>
            <p className="text-xs text-[#8B93A1]">
              Sesuaikan pilihan tab status di atas untuk melihat pesanan
              lainnya.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
