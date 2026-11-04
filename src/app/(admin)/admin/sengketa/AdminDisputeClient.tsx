"use client";

import React, { useState } from "react";
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  X,
} from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/ui";
import { SearchBar } from "@/components/ui/search-bar";

interface DisputeItem {
  id: string;
  disputeCode: string;
  poNumber: string;
  rfqTitle: string;
  industryName: string;
  umkmName: string;
  totalAmount: number;
  escrowHeldAmount: number;
  reason: string;
  aqlFaultCategory: string;
  status: "WAITING_ADMIN" | "IN_REVIEW" | "RESOLVED_REFUND" | "RESOLVED_REWORK";
  createdAt: string;
  claimWindowDaysLeft: number;
  evidenceFiles: string[];
}

const INITIAL_DISPUTES: DisputeItem[] = [
  {
    id: "disp-001",
    disputeCode: "DSP-2026-0041",
    poNumber: "PO-2026-1082",
    rfqTitle: "Pengadaan Kemeja Seragam PDH 500 Pcs",
    industryName: "PT Graha Surya Tekstil",
    umkmName: "CV Harapan Busana Jaya",
    totalAmount: 45000000,
    escrowHeldAmount: 31500000, // Termin 2 (70%)
    reason:
      "Ditemukan 42 pcs (8.4%) jahitan kerah melintir dan perbedaan shade warna kain lot B melebihi toleransi standar AQL 2.5.",
    aqlFaultCategory:
      "Cacat Mayor (Major Defect) - Toleransi AQL 2.5 Dilampaui",
    status: "WAITING_ADMIN",
    createdAt: "2026-11-02T10:15:00Z",
    claimWindowDaysLeft: 2,
    evidenceFiles: [
      "Laporan_Inspeksi_QC_Lab.pdf",
      "Foto_Perbandingan_Shade_Kain.jpg",
    ],
  },
  {
    id: "disp-002",
    disputeCode: "DSP-2026-0038",
    poNumber: "PO-2026-1055",
    rfqTitle: "Produksi Polo Shirt Katun Combed 24s 1.200 Pcs",
    industryName: "PT Indo Busana Mandiri",
    umkmName: "Konveksi Mitra Rajut",
    totalAmount: 78000000,
    escrowHeldAmount: 54600000,
    reason:
      "Keterlambatan pengiriman melewati grace period 72 jam disertai kendala shrinkage susut kain setelah cuci awal.",
    aqlFaultCategory: "Lead Time & Spesifikasi Susut Kain",
    status: "IN_REVIEW",
    createdAt: "2026-10-28T14:30:00Z",
    claimWindowDaysLeft: 0,
    evidenceFiles: ["Uji_Laboratorium_Penyusutan.pdf"],
  },
  {
    id: "disp-003",
    disputeCode: "DSP-2026-0031",
    poNumber: "PO-2026-0994",
    rfqTitle: "Maklon Rompi Lapangan Ripstop 300 Pcs",
    industryName: "PT Nusantara Karya Prima",
    umkmName: "Konveksi Sinar Jaya",
    totalAmount: 27000000,
    escrowHeldAmount: 18900000,
    reason:
      "Terdapat 15 pcs rompi mengalami kancing lepas saat unboxing di gudang logistik.",
    aqlFaultCategory: "Cacat Minor (Minor Defect)",
    status: "RESOLVED_REWORK",
    createdAt: "2026-10-18T09:00:00Z",
    claimWindowDaysLeft: 0,
    evidenceFiles: ["Berita_Acara_Rework_Selesai.pdf"],
  },
];

export function AdminDisputeClient() {
  const [disputes, setDisputes] = useState<DisputeItem[]>(INITIAL_DISPUTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(
    null
  );
  const [resolutionNote, setResolutionNote] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<
    string | null
  >(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredDisputes = disputes.filter((item) => {
    const matchesSearch =
      item.disputeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rfqTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.industryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.umkmName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "WAITING"
          ? item.status === "WAITING_ADMIN"
          : statusFilter === "IN_REVIEW"
            ? item.status === "IN_REVIEW"
            : item.status === "RESOLVED_REFUND" ||
              item.status === "RESOLVED_REWORK";

    return matchesSearch && matchesStatus;
  });

  const waitingCount = disputes.filter(
    (d) => d.status === "WAITING_ADMIN"
  ).length;
  const inReviewCount = disputes.filter((d) => d.status === "IN_REVIEW").length;
  const resolvedCount = disputes.filter(
    (d) => d.status === "RESOLVED_REFUND" || d.status === "RESOLVED_REWORK"
  ).length;

  const handleResolve = (
    disputeId: string,
    action: "REFUND" | "REWORK" | "RELEASE"
  ) => {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          const nextStatus =
            action === "REFUND" ? "RESOLVED_REFUND" : "RESOLVED_REWORK";
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );

    const message =
      action === "REFUND"
        ? "Klaim ganti rugi / pengembalian dana disetujui. Saldo escrow dikembalikan ke rekening Industri."
        : action === "REWORK"
          ? "Instruksi perbaikan (Rework) diterbitkan. UMKM diberikan waktu 3 hari untuk penggantian barang."
          : "Dana escrow diteruskan dan dirilis penuh ke rekening UMKM.";

    setActionSuccessMessage(message);
    setSelectedDispute(null);
    setResolutionNote("");
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  return (
    <div className="bg-white">
      {/* 1. Header */}
      <PageHeader
        title="Mediasi Sengketa & Penjaminan Mutu QC"
        description="Pusat arbitrase perselisihan hasil uji mutu QC tekstil, toleransi cacat AQL, dan penentuan pelepasan dana escrow antara Industri dan UMKM sesuai Spec 16 & BR-14."
        actions={
          <div className="flex items-center gap-1.5">
            <StatusBadge status="ARBITRASE QC" variant="default" />
            <span className="font-mono text-xs text-[#5B6475]">
              Window Klaim 5 Hari
            </span>
          </div>
        }
      />

      {/* 2. In-Page Search Bar */}
      <div className="border-b border-[#E5E7EB] px-6 py-4 bg-white">
        <SearchBar
          placeholder="Cari kode sengketa (DSP-xxx), nomor PO, judul RFQ, nama industri, atau nama konveksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          aria-label="Cari sengketa QC"
        />
      </div>

      {/* 3. 4-Column Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#E5E7EB] bg-white">
        <div className="p-6 border-r border-b md:border-b-0 border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Total Kasus Masuk</span>
            <FileText className="h-4 w-4" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {disputes.length}
          </p>
          <span className="text-[11px] font-mono text-[#5B6475]">
            Seluruh riwayat perselisihan
          </span>
        </div>

        <div className="p-6 border-r border-b md:border-b-0 border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Menunggu Mediasi Admin</span>
            <AlertTriangle className="h-4 w-4 text-[#B45309]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {waitingCount}
          </p>
          <span className="text-[11px] font-mono text-[#B45309] font-medium">
            Membutuhkan keputusan segera
          </span>
        </div>

        <div className="p-6 border-r border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">
              Dalam Pemeriksaan Lab QC
            </span>
            <Clock className="h-4 w-4 text-[#2862E0]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {inReviewCount}
          </p>
          <span className="text-[11px] font-mono text-[#2862E0]">
            Verifikasi fisik sampel cacat
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Selesai Damai / Rework</span>
            <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {resolvedCount}
          </p>
          <span className="text-[11px] font-mono text-[#15803D]">
            Escrow terselesaikan
          </span>
        </div>
      </div>

      {/* 4. Alert Feedback Notification */}
      {actionSuccessMessage && (
        <div className="border-b border-[#E5E7EB] bg-[#F0FDF4] px-6 py-3 text-xs text-[#15803D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D]" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessMessage(null)}
            className="text-[#15803D] hover:opacity-75"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 5. Underline Tabs Filter */}
      <div className="border-b border-[#E5E7EB] bg-white px-6">
        <div className="flex gap-8 -mb-px">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              statusFilter === "ALL"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Semua Kasus ({disputes.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("WAITING")}
            className={`flex items-center gap-1.5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              statusFilter === "WAITING"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            <span>Menunggu Tindakan</span>
            {waitingCount > 0 && (
              <span className="rounded-[2px] bg-[#FEF3C7] px-1.5 py-0.2 font-mono text-[10px] text-[#B45309]">
                {waitingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("IN_REVIEW")}
            className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              statusFilter === "IN_REVIEW"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Pemeriksaan Bahan ({inReviewCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("RESOLVED")}
            className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              statusFilter === "RESOLVED"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Terselesaikan ({resolvedCount})
          </button>
        </div>
      </div>

      {/* 6. Dispute Rows Feed */}
      <div className="divide-y divide-[#E5E7EB]">
        {filteredDisputes.length === 0 ? (
          <div className="p-12 text-center">
            <Scale className="mx-auto h-8 w-8 text-[#8B93A1]" />
            <h3 className="mt-2 text-sm font-semibold text-[#0E1422]">
              Tidak Ada Kasus Sengketa
            </h3>
            <p className="mt-1 text-xs text-[#5B6475]">
              Semua proses produksi dan pemeriksaan QC berjalan normal tanpa
              klaim aktif.
            </p>
          </div>
        ) : (
          filteredDisputes.map((item) => (
            <div
              key={item.id}
              className="px-6 py-5 hover:bg-[#FAFBFC] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0E1422]">
                      {item.disputeCode}
                    </span>
                    <span className="text-[#8B93A1]">•</span>
                    <span className="font-mono text-xs text-[#5B6475]">
                      {item.poNumber}
                    </span>
                    <span className="text-[#8B93A1]">•</span>
                    <span className="text-xs font-semibold text-[#0E1422]">
                      {item.rfqTitle}
                    </span>
                    <span className="text-[#8B93A1]">•</span>
                    <StatusBadge
                      status={
                        item.status === "WAITING_ADMIN"
                          ? "MENUNGGU MEDIASI"
                          : item.status === "IN_REVIEW"
                            ? "PEMERIKSAAN LAB"
                            : item.status === "RESOLVED_REFUND"
                              ? "REFUND DISETUJUI"
                              : "REWORK SELESAI"
                      }
                      variant={
                        item.status === "WAITING_ADMIN"
                          ? "warning"
                          : item.status === "IN_REVIEW"
                            ? "default"
                            : "success"
                      }
                    />
                  </div>

                  {/* Parties Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#5B6475]">
                        Pelapor (Industri):
                      </span>
                      <span className="font-semibold text-[#0E1422]">
                        {item.industryName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#5B6475]">Terlapor (UMKM):</span>
                      <span className="font-semibold text-[#0E1422]">
                        {item.umkmName}
                      </span>
                    </div>
                  </div>

                  {/* Fault Reason & AQL Category */}
                  <div className="rounded-[4px] border border-[#E5E7EB] bg-[#FAFBFC] p-3 text-xs">
                    <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#B45309]">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>{item.aqlFaultCategory}</span>
                    </div>
                    <p className="mt-1 text-[#0E1422] leading-relaxed">
                      {item.reason}
                    </p>
                    {item.evidenceFiles.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E7EB]">
                        <span className="text-[10px] font-mono text-[#5B6475]">
                          Lampiran Berkas:
                        </span>
                        {item.evidenceFiles.map((file, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-[2px] bg-white border border-[#8B93A1] px-1.5 py-0.5 text-[10px] font-mono text-[#2862E0]"
                          >
                            <FileText className="h-3 w-3" />
                            {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Escrow Amounts & Actions */}
                <div className="shrink-0 flex flex-col items-start md:items-end justify-between self-stretch gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6475]">
                      Dana Tertahan di Escrow
                    </span>
                    <p className="font-mono text-base font-bold text-[#B91C1C]">
                      {formatRupiah(item.escrowHeldAmount)}
                    </p>
                    <span className="text-[10px] font-mono text-[#5B6475]">
                      dari total {formatRupiah(item.totalAmount)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDispute(item)}
                      className="rounded-[4px] bg-[#2862E0] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors focus:outline-none"
                    >
                      Buka Mediasi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 7. Action Modal: Mediasi Keputusan Admin */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-[4px] border border-[#E5E7EB] bg-white p-6 shadow-none">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6475]">
                  Panel Arbitrase Admin
                </span>
                <h3 className="text-base font-bold text-[#0E1422]">
                  Keputusan Sengketa {selectedDispute.disputeCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="text-[#5B6475] hover:text-[#0E1422]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 rounded-[4px] border border-[#E5E7EB] bg-[#FAFBFC] p-3">
                <div>
                  <span className="text-[#5B6475]">Industri Pelapor:</span>
                  <p className="font-semibold text-[#0E1422]">
                    {selectedDispute.industryName}
                  </p>
                </div>
                <div>
                  <span className="text-[#5B6475]">UMKM Terlapor:</span>
                  <p className="font-semibold text-[#0E1422]">
                    {selectedDispute.umkmName}
                  </p>
                </div>
                <div>
                  <span className="text-[#5B6475]">Nomor PO:</span>
                  <p className="font-mono font-medium text-[#0E1422]">
                    {selectedDispute.poNumber}
                  </p>
                </div>
                <div>
                  <span className="text-[#5B6475]">Saldo Escrow Tertahan:</span>
                  <p className="font-mono font-bold text-[#B91C1C]">
                    {formatRupiah(selectedDispute.escrowHeldAmount)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0E1422]">
                  Catatan Pertimbangan Hukum / Berita Acara Mediasi:
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Tuliskan dasar pertimbangan hasil uji QC atau kesepakatan damai kedua belah pihak..."
                  rows={3}
                  className="mt-1.5 w-full rounded-[4px] border border-[#8B93A1] p-2.5 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none"
                />
              </div>

              <div className="border-t border-[#E5E7EB] pt-4 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6475]">
                  Pilih Aksi Keputusan Resmi Admin:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleResolve(selectedDispute.id, "REWORK")}
                    className="rounded-[4px] border border-[#B45309] bg-[#FEF3C7] px-3 py-2 text-xs font-semibold text-[#B45309] hover:bg-[#FDE68A] transition-colors"
                  >
                    Instruksi Rework
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResolve(selectedDispute.id, "REFUND")}
                    className="rounded-[4px] border border-[#B91C1C] bg-[#FEF2F2] px-3 py-2 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                  >
                    Klaim Refund (Ganti Rugi)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResolve(selectedDispute.id, "RELEASE")}
                    className="rounded-[4px] bg-[#15803D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#166534] transition-colors"
                  >
                    Rilis Dana ke UMKM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
