"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Building2,
  ShieldCheck,
  RotateCcw,
  Check,
  Layers,
} from "lucide-react";
import { Button, PageHeader, SearchBar, StatusBadge } from "@/components/ui";

export interface QuotationEvaluationItem {
  id: string;
  quotationNumber: string;
  rfqId: string;
  rfqNumber: string;
  rfqTitle: string;
  allocationMode: string;
  umkmOrg: {
    id: string;
    name: string;
    city: string;
    province: string;
    readinessScore: number;
    readinessTier: string;
    isVerified: boolean;
  };
  unitPrice: number;
  totalPrice: number;
  offeredQuantity: number;
  leadTimeDays: number;
  rfqTargetLeadTime: number;
  capacityCommitmentPercent: number;
  status: "SUBMITTED" | "REVISION_REQUESTED" | "ACCEPTED" | "REJECTED";
  revisionNote?: string | null;
  sampleOffered: boolean;
  submittedAt: string;
}

interface QuotationEvaluationClientProps {
  quotations: QuotationEvaluationItem[];
  companyName: string;
}

type TabStatus =
  "ALL" | "SUBMITTED" | "REVISION_REQUESTED" | "ACCEPTED" | "REJECTED";

export function QuotationEvaluationClient({
  quotations: initialQuotations,
}: QuotationEvaluationClientProps) {
  const [quotations, setQuotations] =
    useState<QuotationEvaluationItem[]>(initialQuotations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TabStatus>("ALL");
  const [selectedRfqFilter, setSelectedRfqFilter] = useState<string>("ALL");

  // State modal minta revisi (BR-03)
  const [revisionModalItem, setRevisionModalItem] =
    useState<QuotationEvaluationItem | null>(null);
  const [revisionNoteInput, setRevisionNoteInput] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Daftar unik RFQ untuk filter dropdown
  const uniqueRfqs = Array.from(
    new Set(quotations.map((q) => q.rfqNumber))
  ).map((rfqNumber) => {
    const item = quotations.find((q) => q.rfqNumber === rfqNumber);
    return { rfqNumber, rfqTitle: item?.rfqTitle || "" };
  });

  // Filter logic
  const filtered = quotations.filter((item) => {
    // Search query
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.quotationNumber.toLowerCase().includes(q) ||
      item.rfqNumber.toLowerCase().includes(q) ||
      item.rfqTitle.toLowerCase().includes(q) ||
      item.umkmOrg.name.toLowerCase().includes(q) ||
      item.umkmOrg.city.toLowerCase().includes(q);

    if (!matchSearch) return false;

    // Status filter
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false;

    // RFQ dropdown filter
    if (selectedRfqFilter !== "ALL" && item.rfqNumber !== selectedRfqFilter)
      return false;

    return true;
  });

  const countByStatus = {
    ALL: quotations.length,
    SUBMITTED: quotations.filter((q) => q.status === "SUBMITTED").length,
    REVISION_REQUESTED: quotations.filter(
      (q) => q.status === "REVISION_REQUESTED"
    ).length,
    ACCEPTED: quotations.filter((q) => q.status === "ACCEPTED").length,
    REJECTED: quotations.filter((q) => q.status === "REJECTED").length,
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalItem || !revisionNoteInput.trim()) return;

    setQuotations((prev) =>
      prev.map((q) =>
        q.id === revisionModalItem.id
          ? {
              ...q,
              status: "REVISION_REQUESTED",
              revisionNote: revisionNoteInput.trim(),
            }
          : q
      )
    );

    setActionNotice(
      `Permintaan klarifikasi/revisi resmi (BR-03) berhasil dikirimkan ke ${revisionModalItem.umkmOrg.name}.`
    );
    setRevisionModalItem(null);
    setRevisionNoteInput("");
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleAcceptQuotation = (item: QuotationEvaluationItem) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "ACCEPTED" } : q))
    );
    setActionNotice(
      `Penawaran dari ${item.umkmOrg.name} berhasil diterima sebagai pemenang lelang tender ${item.rfqNumber}!`
    );
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleRejectQuotation = (item: QuotationEvaluationItem) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "REJECTED" } : q))
    );
    setActionNotice(
      `Penawaran ${item.quotationNumber} telah ditandai ditolak.`
    );
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* Toast Notifikasi Aksi */}
      {actionNotice && (
        <div className="bg-[#EFF4FE] border-b border-[#2862E0]/20 p-4 text-xs font-medium text-[#1E40AF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#2862E0]" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
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
          category="Evaluasi Tender & Rekomendasi Seleksi"
          title="Evaluasi Penawaran Masuk (Quotations)"
          description={`Bandingkan proposal harga, komitmen lead time, dan rekam jejak kesiapan UMKM konveksi untuk tender yang Anda terbitkan.`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link
                  href="/industri/rfq"
                  className="flex items-center gap-1.5 text-xs rounded-[4px]"
                >
                  <Layers className="h-4 w-4 text-[#2862E0]" />
                  Katalog RFQ Saya
                </Link>
              </Button>
            </div>
          }
        />

        {/* In-Page SearchBar */}
        <div className="mt-5 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <SearchBar
            placeholder="Cari nomor penawaran, nomor RFQ (mis. RFQ-0007), nama UMKM konveksi, atau kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          <div className="shrink-0">
            <select
              value={selectedRfqFilter}
              onChange={(e) => setSelectedRfqFilter(e.target.value)}
              className="h-10 px-3 text-xs bg-white border border-[#8B93A1] rounded-[4px] text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0] outline-none"
            >
              <option value="ALL">Semua Tender RFQ</option>
              {uniqueRfqs.map((rfq) => (
                <option key={rfq.rfqNumber} value={rfq.rfqNumber}>
                  {rfq.rfqNumber} - {rfq.rfqTitle.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stat Strip 4-Kolom Instrumen Evaluasi */}
      <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Total Penawaran Masuk
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {countByStatus.ALL}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            Dari seluruh tender aktif
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Perlu Dievaluasi
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {countByStatus.SUBMITTED}
          </p>
          <span className="font-mono text-[11px] font-medium text-[#2862E0]">
            Proposal baru diterima
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Dalam Klarifikasi (BR-03)
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {countByStatus.REVISION_REQUESTED}
          </p>
          <span className="font-mono text-[11px] font-medium text-[#B45309]">
            Menunggu respons UMKM
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            Penawaran Diterima
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {countByStatus.ACCEPTED}
          </p>
          <span className="font-mono text-[11px] font-medium text-[#15803D]">
            Siap diterbitkan Order & Escrow
          </span>
        </div>
      </div>

      {/* Underline Tabs: Filter Status Evaluasi */}
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
            Semua Penawaran ({countByStatus.ALL})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("SUBMITTED")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "SUBMITTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Perlu Dievaluasi ({countByStatus.SUBMITTED})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("REVISION_REQUESTED")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "REVISION_REQUESTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Dalam Klarifikasi ({countByStatus.REVISION_REQUESTED})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("ACCEPTED")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "ACCEPTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Diterima ({countByStatus.ACCEPTED})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("REJECTED")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              statusFilter === "REJECTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Ditolak ({countByStatus.REJECTED})
          </button>
        </div>
      </div>

      {/* Feed Komparasi Penawaran: Padding Baris px-6 py-5 */}
      <div className="divide-y divide-[#E5E7EB]">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const isLeadTimeOverTarget =
              item.leadTimeDays > item.rfqTargetLeadTime;

            return (
              <div
                key={item.id}
                className="px-6 py-5 space-y-4 transition-colors hover:bg-[#FAFBFC]"
              >
                {/* Header Baris Komparasi */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                      {item.quotationNumber}
                    </span>
                    <span className="text-xs text-[#8B93A1]">untuk</span>
                    <Link
                      href={`/industri/rfq/${item.rfqId}`}
                      className="font-mono text-xs font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors"
                    >
                      {item.rfqNumber}
                    </Link>
                    <span className="text-xs text-[#5B6475] truncate max-w-xs sm:max-w-md">
                      · {item.rfqTitle}
                    </span>
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                {/* Profil UMKM Penawar & Komparasi Kesiapan */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Kolom Profil UMKM (4 cols) */}
                  <div className="md:col-span-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#2862E0] shrink-0" />
                      <h4 className="font-heading text-sm font-semibold text-[#0E1422]">
                        {item.umkmOrg.name}
                      </h4>
                      {item.umkmOrg.isVerified && (
                        <ShieldCheck className="h-4 w-4 text-[#15803D]" />
                      )}
                    </div>
                    <p className="text-xs text-[#5B6475]">
                      {item.umkmOrg.city}, {item.umkmOrg.province}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold bg-[#EFF4FE] text-[#1E40AF] px-2 py-0.5 rounded-[2px]">
                        Readiness: {item.umkmOrg.readinessScore}/100
                      </span>
                      <span className="text-[11px] text-[#5B6475]">
                        {item.umkmOrg.readinessTier}
                      </span>
                    </div>
                  </div>

                  {/* Kolom Angka Finansial & Lead Time (5 cols) */}
                  <div className="md:col-span-5 grid grid-cols-2 gap-3 bg-[#FAFBFC] p-3 border border-[#E5E7EB] rounded-[4px] text-xs">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#8B93A1] block">
                        Total Penawaran
                      </span>
                      <p className="font-heading text-base font-semibold tabular-nums text-[#0E1422]">
                        Rp{item.totalPrice.toLocaleString("id-ID")}
                      </p>
                      <span className="font-mono text-[11px] text-[#5B6475]">
                        Rp{item.unitPrice.toLocaleString("id-ID")}/pcs ·{" "}
                        {item.offeredQuantity} pcs
                      </span>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#8B93A1] block">
                        Lead Time Kerja
                      </span>
                      <p className="font-heading text-base font-semibold tabular-nums text-[#0E1422]">
                        {item.leadTimeDays} Hari
                      </p>
                      <span
                        className={`font-mono text-[11px] ${
                          isLeadTimeOverTarget
                            ? "text-[#B45309] font-medium"
                            : "text-[#15803D]"
                        }`}
                      >
                        Target: {item.rfqTargetLeadTime} Hari{" "}
                        {isLeadTimeOverTarget && "(Peringatan Q-06)"}
                      </span>
                    </div>
                  </div>

                  {/* Kolom Tombol Aksi Evaluasi (3 cols) */}
                  <div className="md:col-span-3 flex flex-col gap-2 justify-end">
                    {item.status === "SUBMITTED" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptQuotation(item)}
                          className="w-full text-xs font-semibold rounded-[4px]"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Terima & Terbitkan PO
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setRevisionModalItem(item)}
                          className="w-full text-xs rounded-[4px]"
                        >
                          <RotateCcw className="h-3.5 w-3.5 mr-1 text-[#2862E0]" />
                          Minta Revisi 1x (BR-03)
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleRejectQuotation(item)}
                          className="w-full text-center text-[11px] text-[#8B93A1] hover:text-[#B91C1C] transition-colors py-1"
                        >
                          Tolak Penawaran
                        </button>
                      </>
                    )}

                    {item.status === "REVISION_REQUESTED" && (
                      <div className="p-2 bg-[#FFFBEB] text-[#B45309] text-[11px] rounded-[4px] border border-[#FEF3C7] text-center">
                        Menunggu tanggapan revisi dari {item.umkmOrg.name}.
                      </div>
                    )}

                    {item.status === "ACCEPTED" && (
                      <Button variant="secondary" size="sm" asChild>
                        <Link
                          href={`/industri/order?rfqId=${item.rfqId}`}
                          className="w-full text-xs font-semibold text-[#15803D] rounded-[4px]"
                        >
                          Buka di Order & Escrow →
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Catatan Klarifikasi Revisi Aktif */}
                {item.revisionNote && (
                  <div className="p-3 bg-[#FFFBEB] border-l-2 border-[#B45309] text-xs text-[#92400E] rounded-[2px]">
                    <span className="font-semibold block">
                      Catatan Klarifikasi / Revisi Terkirim (BR-03):
                    </span>
                    <p className="mt-0.5">{item.revisionNote}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-xs sm:text-sm text-[#5B6475] space-y-2">
            <p className="text-[#0E1422] font-medium">
              Tidak ada penawaran pada kriteria filter ini.
            </p>
            <p className="text-xs text-[#8B93A1]">
              Coba sesuaikan tab status atau bersihkan pencarian Anda.
            </p>
          </div>
        )}
      </div>

      {/* Modal Minta Klarifikasi / Revisi (Aturan BR-03: 1 Putaran Revisi) */}
      {revisionModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white border border-[#E5E7EB] rounded-[4px] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="font-heading text-base font-semibold text-[#0E1422]">
                  Minta Klarifikasi / Revisi Penawaran (BR-03)
                </h3>
                <p className="text-xs text-[#5B6475]">
                  {revisionModalItem.umkmOrg.name} · Penawaran{" "}
                  {revisionModalItem.quotationNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRevisionModalItem(null)}
                className="text-[#8B93A1] hover:text-[#0E1422] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestRevision} className="space-y-4">
              <div className="p-3 bg-[#EFF4FE] text-[#1E40AF] text-xs rounded-[4px] leading-relaxed">
                <strong>Aturan Bisnis BR-03:</strong> Satu putaran revisi per
                penawaran. Permintaan revisi dapat diajukan untuk klarifikasi
                harga, pengurangan lead time, atau konfirmasi ketersediaan
                bahan.
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#0E1422]">
                  Poin Klarifikasi / Catatan untuk UMKM:
                </label>
                <textarea
                  required
                  rows={4}
                  value={revisionNoteInput}
                  onChange={(e) => setRevisionNoteInput(e.target.value)}
                  placeholder="Contoh: Mohon tinjau kembali kemungkinan pemadatan lead time dari 28 hari menjadi 24 hari, serta konfirmasi apakah sudah termasuk packing polybag satuan."
                  className="w-full rounded-[4px] border border-[#8B93A1] p-3 text-xs text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRevisionModalItem(null)}
                  className="text-xs rounded-[4px]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="text-xs font-semibold rounded-[4px]"
                >
                  Kirim Permintaan Revisi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
