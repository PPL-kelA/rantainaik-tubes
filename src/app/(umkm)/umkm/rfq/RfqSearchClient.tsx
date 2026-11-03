"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  MapPin,
  ArrowRight,
  Filter,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { PageHeader, SearchBar, StatusBadge, Button } from "@/components/ui";

export interface SerializedSearchRfq {
  id: string;
  rfqNumber: string;
  title: string;
  categoryType: string;
  allocationMode: string;
  needSample: boolean;
  quotationDeadline: string;
  targetDeliveryDate: string;
  deliveryLocation: string;
  contextDescription?: string | null;
  industryOrg?: {
    name: string;
    city: string;
    verificationStatus: string;
  } | null;
  totalQuantity: number;
  items: Array<{
    id: string;
    name: string;
    fabricType: string;
    materialProvidedByBuyer: boolean;
    totalQuantity: number;
  }>;
}

interface RfqSearchClientProps {
  rfqs: SerializedSearchRfq[];
  categories: Array<{ id: string; name: string; slug: string }>;
  userCapabilityCategories: string[];
}

export function RfqSearchClient({
  rfqs,
  categories,
  userCapabilityCategories,
}: RfqSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [allocationMode, setAllocationMode] = useState<string>("ALL");
  const [materialProvision, setMaterialProvision] = useState<string>("ALL");
  const [sampleRequirement, setSampleRequirement] = useState<string>("ALL");
  const [quantityRange, setQuantityRange] = useState<string>("ALL");
  const [onlyMatchedCapabilities, setOnlyMatchedCapabilities] = useState(false);
  const [sortBy, setSortBy] = useState<"deadline" | "quantity" | "newest">(
    "deadline"
  );

  // Hitung jumlah filter aktif (di luar search query)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "ALL") count++;
    if (allocationMode !== "ALL") count++;
    if (materialProvision !== "ALL") count++;
    if (sampleRequirement !== "ALL") count++;
    if (quantityRange !== "ALL") count++;
    if (onlyMatchedCapabilities) count++;
    return count;
  }, [
    selectedCategory,
    allocationMode,
    materialProvision,
    sampleRequirement,
    quantityRange,
    onlyMatchedCapabilities,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setAllocationMode("ALL");
    setMaterialProvision("ALL");
    setSampleRequirement("ALL");
    setQuantityRange("ALL");
    setOnlyMatchedCapabilities(false);
    setSortBy("deadline");
  };

  // Helper estimasi skor kecocokan berdasarkan kategori dan kapabilitas UMKM
  const getMatchScore = (rfq: SerializedSearchRfq): number => {
    let score = 75; // Baseline
    const rfqCat = rfq.categoryType.toLowerCase();
    const hasCategoryMatch = userCapabilityCategories.some(
      (c) => c.includes(rfqCat) || rfqCat.includes(c)
    );
    if (hasCategoryMatch) score += 18;
    if (rfq.totalQuantity <= 1000) score += 5;
    return Math.min(98, score);
  };

  // Filter & Sort Rfqs
  const filteredRfqs = useMemo(() => {
    return rfqs
      .filter((rfq) => {
        // 1. Text Query Filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = rfq.title.toLowerCase().includes(query);
          const matchNumber = rfq.rfqNumber.toLowerCase().includes(query);
          const matchLocation = rfq.deliveryLocation
            .toLowerCase()
            .includes(query);
          const matchBuyer = rfq.industryOrg?.name
            .toLowerCase()
            .includes(query);
          const matchItems = rfq.items.some(
            (it) =>
              it.name.toLowerCase().includes(query) ||
              it.fabricType.toLowerCase().includes(query)
          );
          if (
            !matchTitle &&
            !matchNumber &&
            !matchLocation &&
            !matchBuyer &&
            !matchItems
          ) {
            return false;
          }
        }

        // 2. Category Filter
        if (selectedCategory !== "ALL") {
          if (rfq.categoryType !== selectedCategory) return false;
        }

        // 3. Allocation Mode Filter
        if (allocationMode !== "ALL") {
          if (rfq.allocationMode !== allocationMode) return false;
        }

        // 4. Material Provision (CMT vs Full Package)
        if (materialProvision !== "ALL") {
          const isBuyerMaterial = materialProvision === "BUYER";
          const matchMat = rfq.items.some(
            (it) => it.materialProvidedByBuyer === isBuyerMaterial
          );
          if (!matchMat) return false;
        }

        // 5. Sample Requirement
        if (sampleRequirement !== "ALL") {
          const needSample = sampleRequirement === "REQUIRED";
          if (rfq.needSample !== needSample) return false;
        }

        // 6. Quantity Range
        if (quantityRange !== "ALL") {
          if (quantityRange === "SMALL" && rfq.totalQuantity >= 500)
            return false;
          if (
            quantityRange === "MEDIUM" &&
            (rfq.totalQuantity < 500 || rfq.totalQuantity > 2000)
          ) {
            return false;
          }
          if (quantityRange === "LARGE" && rfq.totalQuantity <= 2000)
            return false;
        }

        // 7. Only Matched Capabilities
        if (onlyMatchedCapabilities) {
          const rfqCat = rfq.categoryType.toLowerCase();
          const matches = userCapabilityCategories.some(
            (c) => c.includes(rfqCat) || rfqCat.includes(c)
          );
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "deadline") {
          return (
            new Date(a.quotationDeadline).getTime() -
            new Date(b.quotationDeadline).getTime()
          );
        }
        if (sortBy === "quantity") {
          return b.totalQuantity - a.totalQuantity;
        }
        return b.rfqNumber.localeCompare(a.rfqNumber);
      });
  }, [
    rfqs,
    searchQuery,
    selectedCategory,
    allocationMode,
    materialProvision,
    sampleRequirement,
    quantityRange,
    onlyMatchedCapabilities,
    sortBy,
    userCapabilityCategories,
  ]);

  const formatDeadline = (dateStr: string) => {
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
          category="Katalog Tender & Peluang Kemitraan"
          title="Pencarian Tender RFQ Tekstil"
          description="Eksplorasi tender pakaian dan seragam yang sesuai dengan spesialisasi mesin, kuantitas MOQ, dan radius lokasi pengiriman konveksi Anda."
          actions={
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#5B6475]">
                Tender Terbuka:{" "}
                <strong className="text-[#0E1422]">{rfqs.length} RFQ</strong>
              </span>
              <StatusBadge status="OPEN">Menerima Penawaran</StatusBadge>
            </div>
          }
        />

        {/* In-Page Search Bar */}
        <div className="mt-5">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Cari RFQ terbuka, jenis bahan (katun, TC), nomor tender (RFQ-0007), atau nama industri..."
          />
        </div>
      </div>

      {/* 2. Kompartemen Utama 2-Kolom (Filter Samping + Feed Tender) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
        {/* Kolom Filter Samping (4/12) */}
        <aside className="lg:col-span-4 p-6 space-y-6 bg-[#FAFBFC]">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#2862E0]" />
              <h2 className="font-heading text-sm font-semibold text-[#0E1422]">
                Filter Pencarian
              </h2>
              {activeFilterCount > 0 && (
                <span className="rounded-[2px] bg-[#2862E0] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2862E0] hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Toggle Kecocokan Kapabilitas */}
          <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-4 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyMatchedCapabilities}
                onChange={(e) => setOnlyMatchedCapabilities(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-[4px] border-[#8B93A1] text-[#2862E0] focus:ring-[#2862E0]"
              />
              <div>
                <span className="text-xs font-semibold text-[#0E1422] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#2862E0]" />
                  Cocokkan Profil Saya
                </span>
                <p className="text-[11px] text-[#5B6475] mt-0.5 leading-normal">
                  Hanya tampilkan RFQ yang kategorinya telah terdaftar di profil
                  kapabilitas konveksi Anda.
                </p>
              </div>
            </label>
          </div>

          {/* Filter 1: Kategori Produk */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Kategori Produk
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2.5 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
            >
              <option value="ALL">Semua Kategori Produk</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="Kemeja">Kemeja Kerja</option>
              <option value="Kaos">Kaos & Polo</option>
              <option value="Seragam">Seragam Industri</option>
            </select>
          </div>

          {/* Filter 2: Mode Alokasi */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Mode Alokasi Pemenang
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setAllocationMode(
                    allocationMode === "TUNGGAL" ? "ALL" : "TUNGGAL"
                  )
                }
                className={`rounded-[4px] border p-2 text-center text-xs font-semibold transition-colors ${
                  allocationMode === "TUNGGAL"
                    ? "border-[#2862E0] bg-[#EFF4FE] text-[#2862E0]"
                    : "border-[#8B93A1] bg-white text-[#5B6475] hover:text-[#0E1422]"
                }`}
              >
                Pemenang Tunggal
              </button>
              <button
                type="button"
                onClick={() =>
                  setAllocationMode(allocationMode === "LOT" ? "ALL" : "LOT")
                }
                className={`rounded-[4px] border p-2 text-center text-xs font-semibold transition-colors ${
                  allocationMode === "LOT"
                    ? "border-[#2862E0] bg-[#EFF4FE] text-[#2862E0]"
                    : "border-[#8B93A1] bg-white text-[#5B6475] hover:text-[#0E1422]"
                }`}
              >
                Split Award (Per Lot)
              </button>
            </div>
          </div>

          {/* Filter 3: Penyediaan Bahan */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Penyediaan Bahan Baku
            </label>
            <select
              value={materialProvision}
              onChange={(e) => setMaterialProvision(e.target.value)}
              className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2.5 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
            >
              <option value="ALL">Semua Ketentuan Bahan</option>
              <option value="BUYER">CMT (Bahan Disediakan Pembeli)</option>
              <option value="UMKM">Full Package (Bahan Disediakan UMKM)</option>
            </select>
          </div>

          {/* Filter 4: Kebutuhan Sampel */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Sampel Pra-Produksi
            </label>
            <select
              value={sampleRequirement}
              onChange={(e) => setSampleRequirement(e.target.value)}
              className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2.5 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
            >
              <option value="ALL">Semua Ketentuan Sampel</option>
              <option value="REQUIRED">Wajib Sampel Pra-Produksi</option>
              <option value="NOT_REQUIRED">
                Tanpa Sampel (Produksi Langsung)
              </option>
            </select>
          </div>

          {/* Filter 5: Kisaran Kuantitas Total */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Kuantitas Total Pesanan
            </label>
            <select
              value={quantityRange}
              onChange={(e) => setQuantityRange(e.target.value)}
              className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2.5 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
            >
              <option value="ALL">Semua Ukuran Pesanan</option>
              <option value="SMALL">Kecil (&lt; 500 pcs)</option>
              <option value="MEDIUM">Menengah (500 - 2.000 pcs)</option>
              <option value="LARGE">Besar (&gt; 2.000 pcs)</option>
            </select>
          </div>
        </aside>

        {/* Kolom Feed Hasil RFQ (8/12) */}
        <div className="lg:col-span-8 bg-white">
          {/* Bar Kontrol & Pengurutan */}
          <div className="px-6 py-4 border-b border-[#E5E7EB] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-[#5B6475]">
              Menampilkan{" "}
              <strong className="text-[#0E1422] font-semibold">
                {filteredRfqs.length} tender terbuka
              </strong>
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5B6475] shrink-0 font-mono text-[11px]">
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "deadline" | "quantity" | "newest"
                  )
                }
                className="rounded-[4px] border border-[#8B93A1] bg-white px-2.5 py-1 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none"
              >
                <option value="deadline">Tenggat Terdekat</option>
                <option value="quantity">Kuantitas Terbanyak</option>
                <option value="newest">Tender Terbaru</option>
              </select>
            </div>
          </div>

          {/* Daftar Feed RFQ - Baris px-6 py-5 */}
          {filteredRfqs.length > 0 ? (
            <div className="divide-y divide-[#E5E7EB]">
              {filteredRfqs.map((rfq) => {
                const matchScore = getMatchScore(rfq);

                return (
                  <div
                    key={rfq.id}
                    className="px-6 py-5 space-y-3.5 transition-colors hover:bg-[#FAFBFC]"
                  >
                    {/* Header Baris: ID, Match Score, Status Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                          {rfq.rfqNumber}
                        </span>
                        <span className="font-mono text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded-[2px] flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Kecocokan {matchScore}%
                        </span>
                      </div>
                      <StatusBadge status="OPEN">Dibuka</StatusBadge>
                    </div>

                    {/* Judul & Konteks RFQ */}
                    <div>
                      <h3 className="font-heading text-base font-semibold text-[#0E1422]">
                        <Link
                          href={`/umkm/rfq/${rfq.rfqNumber}`}
                          className="hover:text-[#2862E0] transition-colors"
                        >
                          {rfq.title}
                        </Link>
                      </h3>
                      {rfq.contextDescription && (
                        <p className="mt-1 text-xs text-[#5B6475] line-clamp-2 leading-relaxed">
                          {rfq.contextDescription}
                        </p>
                      )}
                    </div>

                    {/* Chip Tags: Persegi rounded-[2px], Tanpa Pil */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                        Kategori {rfq.categoryType}
                      </span>
                      <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                        Mode {rfq.allocationMode}
                      </span>
                      <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                        {rfq.needSample ? "Wajib Sampel" : "Tanpa Sampel"}
                      </span>
                      {rfq.items[0]?.fabricType && (
                        <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                          {rfq.items[0].fabricType}
                        </span>
                      )}
                    </div>

                    {/* Footer Baris: Qty, Deadline, Pembeli & Tombol Aksi */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#E5E7EB]/60">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#5B6475]">
                        <span className="flex items-center gap-1 font-mono">
                          <Package className="h-3.5 w-3.5 text-[#2862E0]" />
                          <strong className="text-[#0E1422] font-semibold">
                            {rfq.totalQuantity.toLocaleString("id-ID")} pcs
                          </strong>{" "}
                          ({rfq.items.length} item)
                        </span>

                        <span className="flex items-center gap-1 font-mono text-[#DC2626]">
                          <Clock className="h-3.5 w-3.5" />
                          Tenggat: {formatDeadline(rfq.quotationDeadline)}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#5B6475]" />
                          {rfq.industryOrg?.name || "Mitra Industri"} (
                          {rfq.deliveryLocation})
                        </span>
                      </div>

                      <Button variant="default" size="sm" asChild>
                        <Link
                          href={`/umkm/rfq/${rfq.rfqNumber}`}
                          className="flex items-center gap-1 font-semibold rounded-[4px] shrink-0"
                        >
                          Buka Spesifikasi & Tawar
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* State Kosong */
            <div className="p-12 text-center space-y-3">
              <Package className="h-8 w-8 text-[#8B93A1] mx-auto" />
              <h3 className="font-heading text-base font-semibold text-[#0E1422]">
                Tidak Ada Tender yang Sesuai
              </h3>
              <p className="text-xs text-[#5B6475] max-w-sm mx-auto leading-relaxed">
                Tidak ada tender pengadaan terbuka yang cocok dengan kriteria
                pencarian atau kombinasi filter aktif Anda.
              </p>
              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResetFilters}
                  className="rounded-[4px] text-xs font-semibold"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Reset Seluruh Filter
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
