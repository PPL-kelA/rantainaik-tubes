"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { PageHeader, SearchBar, StatusBadge, Button } from "@/components/ui";
import { SerializedQuotationItem } from "./page";

interface QuotationListClientProps {
  initialQuotations: SerializedQuotationItem[];
  organizationName: string;
}

export function QuotationListClient({
  initialQuotations,
  organizationName,
}: QuotationListClientProps) {
  const [activeTab, setActiveTab] = useState<
    "ALL" | "SUBMITTED" | "REVISION_REQUESTED" | "ACCEPTED" | "REJECTED"
  >("ALL");
  const [allocationFilter, setAllocationFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Metrik Instumen Ringkasan
  const metrics = useMemo(() => {
    const total = initialQuotations.length;
    const submitted = initialQuotations.filter(
      (q) => q.status === "SUBMITTED"
    ).length;
    const revision = initialQuotations.filter(
      (q) => q.status === "REVISION_REQUESTED"
    ).length;
    const accepted = initialQuotations.filter(
      (q) => q.status === "ACCEPTED"
    ).length;
    const totalAcceptedValue = initialQuotations
      .filter((q) => q.status === "ACCEPTED")
      .reduce((sum, q) => sum + q.totalOfferedPrice, 0);

    return {
      total,
      submitted,
      revision,
      accepted,
      totalAcceptedValue,
    };
  }, [initialQuotations]);

  // Filter Penawaran
  const filteredQuotations = useMemo(() => {
    return initialQuotations.filter((q) => {
      // 1. Tab Status Filter
      if (activeTab !== "ALL" && q.status !== activeTab) {
        return false;
      }

      // 2. Allocation Mode Filter
      if (allocationFilter !== "ALL" && q.allocationMode !== allocationFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchQNum = q.quotationNumber.toLowerCase().includes(query);
        const matchRfqNum = q.rfqNumber.toLowerCase().includes(query);
        const matchTitle = q.rfqTitle.toLowerCase().includes(query);
        const matchIndustry = q.industryName.toLowerCase().includes(query);
        if (!matchQNum && !matchRfqNum && !matchTitle && !matchIndustry) {
          return false;
        }
      }

      return true;
    });
  }, [initialQuotations, activeTab, allocationFilter, searchQuery]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* 1. Header Kompartemen */}
      <div className="p-6">
        <PageHeader
          className="border-b-0 pb-0"
          category="Manajemen Tender & Komitmen"
          title="Penawaran Saya"
          description={`Kelola status tender yang telah Anda ajukan atas nama ${organizationName}. Pantau proses evaluasi pembeli dan kelola tanggapan revisi resmi.`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" asChild>
                <Link
                  href="/umkm/rfq"
                  className="flex items-center gap-1.5 text-xs font-semibold rounded-[4px]"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  Cari Tender Baru
                </Link>
              </Button>
            </div>
          }
        />

        {/* In-Page Search Bar */}
        <div className="mt-5">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Cari berdasarkan nomor penawaran (Q-xxxx), nomor RFQ (RFQ-0007), atau mitra industri..."
          />
        </div>
      </div>

      {/* 2. Stat Strip 4-Kolom Instrumen Kompartemen (Seamless Grid) */}
      <div className="grid grid-cols-2 divide-y divide-[#E5E7EB] bg-white sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-[#2862E0]" /> Total Penawaran
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {metrics.total}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            Penawaran diajukan
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#B45309]" /> Sedang Evaluasi
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {metrics.submitted}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            Menunggu review pembeli
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-[#DC2626]" /> Butuh Revisi
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {metrics.revision}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            Permintaan klarifikasi (BR-03)
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" /> Menang /
            Diterima
          </span>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {metrics.accepted}
          </p>
          <span className="font-mono text-[11px] text-[#15803D] font-medium">
            {formatRupiah(metrics.totalAcceptedValue)}
          </span>
        </div>
      </div>

      {/* 3. Underline Tabs Navigasi Status (Strictly No Pill) */}
      <div className="px-6 border-b border-[#E5E7EB] bg-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs sm:text-sm font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "ALL"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Semua Penawaran
            <span className="bg-[#EFF4FE] text-[#2862E0] font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] font-semibold">
              {metrics.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SUBMITTED")}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "SUBMITTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Sedang Dievaluasi
            <span className="bg-[#EFF4FE] text-[#2862E0] font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] font-semibold">
              {metrics.submitted}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("REVISION_REQUESTED")}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "REVISION_REQUESTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Butuh Revisi
            {metrics.revision > 0 && (
              <span className="bg-[#FEE2E2] text-[#DC2626] font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] font-bold">
                {metrics.revision}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ACCEPTED")}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "ACCEPTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Diterima / Menang
            <span className="bg-[#DCFCE7] text-[#15803D] font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] font-semibold">
              {metrics.accepted}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("REJECTED")}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "REJECTED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Tidak Terpilih
          </button>
        </div>

        {/* Filter Mode Alokasi */}
        <div className="flex items-center gap-2 py-2">
          <span className="font-mono text-[11px] text-[#5B6475] shrink-0">
            Mode Alokasi:
          </span>
          <select
            value={allocationFilter}
            onChange={(e) => setAllocationFilter(e.target.value)}
            className="rounded-[4px] border border-[#8B93A1] bg-white px-2 py-1 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none"
          >
            <option value="ALL">Semua Mode</option>
            <option value="TUNGGAL">Pemenang Tunggal</option>
            <option value="LOT">Split Award (Per Lot)</option>
          </select>
        </div>
      </div>

      {/* 4. Daftar Penawaran - Baris px-6 py-5 */}
      {filteredQuotations.length > 0 ? (
        <div className="divide-y divide-[#E5E7EB]">
          {filteredQuotations.map((quotation) => (
            <div
              key={quotation.id}
              className="px-6 py-5 space-y-3.5 transition-colors hover:bg-[#FAFBFC]"
            >
              {/* Header Baris: ID Penawaran & Status Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                    {quotation.quotationNumber}
                  </span>
                  <span className="text-xs text-[#5B6475]">untuk tender</span>
                  <Link
                    href={`/umkm/rfq/${quotation.rfqNumber}`}
                    className="font-mono text-xs font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors"
                  >
                    {quotation.rfqNumber}
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#5B6475]">
                    Diajukan: {formatDate(quotation.submittedAt)}
                  </span>
                  {quotation.status === "SUBMITTED" && (
                    <StatusBadge status="PENDING">
                      Sedang Dievaluasi
                    </StatusBadge>
                  )}
                  {quotation.status === "REVISION_REQUESTED" && (
                    <StatusBadge status="WARNING">
                      Permintaan Revisi
                    </StatusBadge>
                  )}
                  {quotation.status === "ACCEPTED" && (
                    <StatusBadge status="SUCCESS">
                      Penawaran Diterima
                    </StatusBadge>
                  )}
                  {quotation.status === "REJECTED" && (
                    <StatusBadge status="REJECTED">Tidak Terpilih</StatusBadge>
                  )}
                </div>
              </div>

              {/* Judul Tender & Rincian Lot */}
              <div>
                <h3 className="font-heading text-base font-semibold text-[#0E1422]">
                  {quotation.rfqTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#5B6475]">
                  <span className="flex items-center gap-1 font-medium text-[#0E1422]">
                    <Building2 className="h-3.5 w-3.5 text-[#5B6475]" />
                    {quotation.industryName} ({quotation.industryCity})
                  </span>
                  <span>·</span>
                  <span className="font-mono bg-[#F1F3F5] text-[#374151] px-2 py-0.5 rounded-[2px] text-[11px]">
                    Mode {quotation.allocationMode}
                  </span>
                  {quotation.lotSummary && (
                    <>
                      <span>·</span>
                      <span className="text-[#0E1422] italic font-medium">
                        {quotation.lotSummary}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Alert Klarifikasi/Revisi (bila status REVISION_REQUESTED) */}
              {quotation.status === "REVISION_REQUESTED" &&
                quotation.revisionNote && (
                  <div className="rounded-[4px] border border-[#DC2626]/30 bg-[#FEF2F2] p-4 text-xs space-y-1.5">
                    <span className="font-semibold text-[#B91C1C] flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" />
                      Catatan Klarifikasi dari Pembeli (Maksimal 1 Putaran
                      Revisi BR-03):
                    </span>
                    <p className="text-[#7F1D1D] leading-relaxed">
                      {quotation.revisionNote}
                    </p>
                  </div>
                )}

              {/* Strip Fakta Komitmen Finansial & Lead Time */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFBFC] p-3.5 rounded-[4px] border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[#5B6475] block">
                    Total Nilai Penawaran:
                  </span>
                  <span className="font-mono font-bold text-sm text-[#0E1422]">
                    {formatRupiah(quotation.totalOfferedPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-[#5B6475] block">
                    Harga Satuan Rata-rata:
                  </span>
                  <span className="font-mono font-semibold text-[#0E1422]">
                    {formatRupiah(quotation.unitPrice)} / pcs
                  </span>
                </div>
                <div>
                  <span className="text-[#5B6475] block">
                    Total Kuantitas Ditawarkan:
                  </span>
                  <span className="font-mono font-semibold text-[#0E1422]">
                    {quotation.totalQuantity.toLocaleString("id-ID")} pcs
                  </span>
                </div>
                <div>
                  <span className="text-[#5B6475] block">
                    Komitmen Lead Time:
                  </span>
                  <span className="font-mono font-semibold text-[#0E1422]">
                    {quotation.leadTimeDays} hari kerja
                  </span>
                </div>
              </div>

              {/* Footer Baris: Tombol Aksi */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="font-mono text-[11px] text-[#5B6475]">
                  Masa berlaku penawaran sampai:{" "}
                  {formatDate(quotation.validUntil)}
                </span>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link
                      href={`/umkm/rfq/${quotation.rfqNumber}`}
                      className="rounded-[4px] text-xs font-semibold"
                    >
                      Buka Rincian RFQ
                    </Link>
                  </Button>

                  {quotation.status === "REVISION_REQUESTED" && (
                    <Button variant="default" size="sm" asChild>
                      <Link
                        href={`/umkm/rfq/${quotation.rfqNumber}`}
                        className="rounded-[4px] text-xs font-semibold bg-[#2862E0]"
                      >
                        Kirim Revisi Penawaran
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* State Kosong */
        <div className="p-12 text-center space-y-3">
          <Briefcase className="h-8 w-8 text-[#8B93A1] mx-auto" />
          <h3 className="font-heading text-base font-semibold text-[#0E1422]">
            Tidak Ada Penawaran pada Kategori Ini
          </h3>
          <p className="text-xs text-[#5B6475] max-w-sm mx-auto leading-relaxed">
            Belum ada penawaran tender yang cocok dengan tab status atau kata
            kunci pencarian yang Anda pilih.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setActiveTab("ALL");
                setAllocationFilter("ALL");
                setSearchQuery("");
              }}
              className="rounded-[4px] text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset Filter Status
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
