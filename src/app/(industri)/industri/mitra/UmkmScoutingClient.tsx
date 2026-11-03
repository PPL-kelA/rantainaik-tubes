"use client";

import { useState } from "react";
import { MapPin, Users, RotateCcw, Send, Check, Package } from "lucide-react";
import { Button, PageHeader, SearchBar, StatusBadge } from "@/components/ui";

export interface UmkmScoutingItem {
  id: string;
  name: string;
  city: string;
  province: string;
  description: string;
  yearEstablished: number;
  operatorCount: number;
  readinessScore: number;
  readinessTier: "TIER_A" | "TIER_B" | "TIER_C" | "TIER_D";
  readinessTierLabel: string;
  isVerified: boolean;
  categories: string[];
  machines: string[];
  monthlyCapacityPcs: number;
  minMoqPcs: number;
}

interface UmkmScoutingClientProps {
  umkmList: UmkmScoutingItem[];
  availableRfqs: { id: string; rfqNumber: string; title: string }[];
}

export function UmkmScoutingClient({
  umkmList,
  availableRfqs,
}: UmkmScoutingClientProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [selectedCapacity, setSelectedCapacity] = useState<string>("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [hasSpecialMachine, setHasSpecialMachine] = useState(false);

  // Invite Modal State
  const [invitingUmkm, setInvitingUmkm] = useState<UmkmScoutingItem | null>(
    null
  );
  const [selectedRfqId, setSelectedRfqId] = useState<string>(
    availableRfqs[0]?.id || ""
  );
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Filter Logic
  const filteredUmkm = umkmList.filter((umkm) => {
    // Search Term
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      umkm.name.toLowerCase().includes(q) ||
      umkm.city.toLowerCase().includes(q) ||
      umkm.province.toLowerCase().includes(q) ||
      umkm.categories.some((c) => c.toLowerCase().includes(q)) ||
      umkm.machines.some((m) => m.toLowerCase().includes(q));

    if (!matchSearch) return false;

    // Filter Kategori
    if (
      selectedCategory !== "ALL" &&
      !umkm.categories.includes(selectedCategory)
    ) {
      return false;
    }

    // Filter Tier
    if (selectedTier !== "ALL" && umkm.readinessTier !== selectedTier) {
      return false;
    }

    // Filter Kapasitas
    if (selectedCapacity === "1000" && umkm.monthlyCapacityPcs < 1000)
      return false;
    if (selectedCapacity === "3000" && umkm.monthlyCapacityPcs < 3000)
      return false;
    if (selectedCapacity === "5000" && umkm.monthlyCapacityPcs < 5000)
      return false;

    // Filter Verifikasi Legalitas
    if (onlyVerified && !umkm.isVerified) return false;

    // Filter Mesin Khusus (Bordir / Overdeck)
    if (
      hasSpecialMachine &&
      !umkm.machines.some(
        (m) =>
          m.toLowerCase().includes("bordir") ||
          m.toLowerCase().includes("overdeck")
      )
    ) {
      return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setSelectedTier("ALL");
    setSelectedCapacity("ALL");
    setOnlyVerified(false);
    setHasSpecialMachine(false);
  };

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitingUmkm || !selectedRfqId) return;

    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setInvitingUmkm(null);
    }, 1500);
  };

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* Page Header Kompartemen */}
      <div className="p-6 sm:p-8">
        <PageHeader
          className="border-b-0 pb-0"
          category="Direktori & Scouting Mitra Konveksi"
          title="Cari Mitra UMKM Konveksi"
          description="Eksplorasi dan kurasi konveksi tekstil terverifikasi berdasarkan spesialisasi jahitan, kapasitas mesin, dan Industrial Readiness Score."
          actions={
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#5B6475] bg-[#FAFBFC] border border-[#E5E7EB] px-3 py-1.5 rounded-[4px]">
                {filteredUmkm.length} Konveksi Ditemukan
              </span>
            </div>
          }
        />

        {/* Kompartemen Search & Filter Terintegrasi (In-Search Compartment Filter) */}
        <div className="mt-5 border border-[#E5E7EB] rounded-[4px] bg-[#FAFBFC] divide-y divide-[#E5E7EB] overflow-hidden">
          {/* Baris Input SearchBar */}
          <div className="p-3 bg-white">
            <SearchBar
              placeholder="Cari nama konveksi, kota/daerah, jenis pakaian (seragam, kaos, polo), atau tipe mesin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-0 focus:ring-0 shadow-none px-0"
            />
          </div>

          {/* Baris Kontrol Filter di Bawah Search Input */}
          <div className="p-4 bg-[#FAFBFC] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Dropdown Kategori */}
              <div>
                <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] block mb-1">
                  Kategori Spesialisasi
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-9 w-full px-3 text-xs bg-white border border-[#8B93A1] rounded-[4px] text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0] outline-none"
                >
                  <option value="ALL">Semua Kategori Produk</option>
                  <option value="Kemeja & Seragam Kerja">
                    Kemeja & Seragam Kerja
                  </option>
                  <option value="Kaos & Polo Shirt">Kaos & Polo Shirt</option>
                  <option value="Jaket, Hoodie & Outerwear">
                    Jaket, Hoodie & Outerwear
                  </option>
                  <option value="Celana Formal & Chino">
                    Celana Formal & Chino
                  </option>
                  <option value="Rompi & Workwear K3">
                    Rompi & Workwear K3
                  </option>
                </select>
              </div>

              {/* Dropdown Readiness Tier */}
              <div>
                <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] block mb-1">
                  Readiness Score Tier
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="h-9 w-full px-3 text-xs bg-white border border-[#8B93A1] rounded-[4px] text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0] outline-none"
                >
                  <option value="ALL">Semua Tier Kesiapan</option>
                  <option value="TIER_A">Tier A (Skor ≥ 80 · Korporat)</option>
                  <option value="TIER_B">
                    Tier B (Skor 65 - 79 · Menengah)
                  </option>
                  <option value="TIER_C">
                    Tier C (Skor 50 - 64 · Terbimbing)
                  </option>
                  <option value="TIER_D">Tier D (Skor &lt; 50 · Awal)</option>
                </select>
              </div>

              {/* Dropdown Kapasitas */}
              <div>
                <label className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] block mb-1">
                  Kapasitas Bulanan Minimum
                </label>
                <select
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                  className="h-9 w-full px-3 text-xs bg-white border border-[#8B93A1] rounded-[4px] text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0] outline-none"
                >
                  <option value="ALL">Semua Kapasitas</option>
                  <option value="1000">&gt; 1.000 Pcs / Bulan</option>
                  <option value="3000">&gt; 3.000 Pcs / Bulan</option>
                  <option value="5000">&gt; 5.000 Pcs / Bulan</option>
                </select>
              </div>
            </div>

            {/* Checkbox Filter Cepat & Reset Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E7EB]">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#0E1422]">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="h-4 w-4 rounded-[2px] border-[#8B93A1] text-[#2862E0] focus:ring-[#2862E0]"
                  />
                  <span>Hanya UMKM Terverifikasi (NIB Resmi)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#0E1422]">
                  <input
                    type="checkbox"
                    checked={hasSpecialMachine}
                    onChange={(e) => setHasSpecialMachine(e.target.checked)}
                    className="h-4 w-4 rounded-[2px] border-[#8B93A1] text-[#2862E0] focus:ring-[#2862E0]"
                  />
                  <span>Memiliki Mesin Khusus (Bordir/Overdeck)</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-[#5B6475] hover:text-[#2862E0] transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Semua Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Direktori UMKM Konveksi: Padding Baris px-6 py-5 */}
      <div className="divide-y divide-[#E5E7EB]">
        {filteredUmkm.length > 0 ? (
          filteredUmkm.map((umkm) => (
            <div
              key={umkm.id}
              className="px-6 py-5 space-y-3.5 transition-colors hover:bg-[#FAFBFC]"
            >
              {/* Header Baris Profil */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-[4px] bg-[#EFF4FE] border border-[#2862E0]/20 flex items-center justify-center text-[#2862E0] font-heading font-semibold text-xs shrink-0">
                    {umkm.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-base font-semibold text-[#0E1422]">
                        {umkm.name}
                      </h3>
                      {umkm.isVerified && <StatusBadge status="VERIFIED" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5B6475]">
                      <MapPin className="h-3.5 w-3.5 text-[#8B93A1]" />
                      <span>
                        {umkm.city}, {umkm.province}
                      </span>
                      <span>·</span>
                      <span>Berdiri sejak {umkm.yearEstablished}</span>
                    </div>
                  </div>
                </div>

                {/* Badge Readiness Tier Berlatar Warna Solid Lembut */}
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-[2px] ${
                      umkm.readinessTier === "TIER_A"
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : umkm.readinessTier === "TIER_B"
                          ? "bg-[#EFF4FE] text-[#1E40AF]"
                          : "bg-[#FEF3C7] text-[#B45309]"
                    }`}
                  >
                    Readiness: {umkm.readinessScore}/100 ·{" "}
                    {umkm.readinessTierLabel}
                  </span>
                </div>
              </div>

              {/* Deskripsi Singkat */}
              <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                {umkm.description}
              </p>

              {/* Tag Spesialisasi & Mesin */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-mono text-[10px] uppercase font-semibold text-[#8B93A1] mr-1">
                    Spesialisasi:
                  </span>
                  {umkm.categories.map((cat) => (
                    <span
                      key={cat}
                      className="bg-white border border-[#E5E7EB] text-[#0E1422] px-2 py-0.5 rounded-[2px] text-xs font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-mono text-[10px] uppercase font-semibold text-[#8B93A1] mr-1">
                    Aset Mesin:
                  </span>
                  {umkm.machines.map((m) => (
                    <span
                      key={m}
                      className="bg-[#FAFBFC] border border-[#E5E7EB] text-[#5B6475] px-2 py-0.5 rounded-[2px] text-[11px] font-mono"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Baris Metrik & Tombol Aksi */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E7EB]/70">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#5B6475]">
                  <div className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-[#8B93A1]" />
                    <span>
                      Kapasitas:{" "}
                      <strong className="font-mono text-[#0E1422]">
                        {umkm.monthlyCapacityPcs.toLocaleString("id-ID")}{" "}
                        pcs/bln
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#8B93A1]" />
                    <span>
                      Tenaga Kerja:{" "}
                      <strong className="text-[#0E1422]">
                        {umkm.operatorCount} operator
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>
                      MOQ:{" "}
                      <strong className="font-mono text-[#0E1422]">
                        {umkm.minMoqPcs} pcs
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setInvitingUmkm(umkm)}
                    className="text-xs font-semibold rounded-[4px]"
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Undang ke RFQ Saya
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-xs sm:text-sm text-[#5B6475] space-y-2">
            <p className="text-[#0E1422] font-medium">
              Tidak ada UMKM yang cocok dengan filter pencarian ini.
            </p>
            <p className="text-xs text-[#8B93A1]">
              Coba kurangi batasan filter atau bersihkan kata kunci pencarian
              Anda.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs rounded-[4px]"
              >
                Reset Semua Filter
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Undang UMKM ke Tender RFQ (RfqInvitation) */}
      {invitingUmkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-[4px] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="font-heading text-base font-semibold text-[#0E1422]">
                  Undang Konveksi ke Tender RFQ
                </h3>
                <p className="text-xs text-[#5B6475]">{invitingUmkm.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setInvitingUmkm(null)}
                className="text-[#8B93A1] hover:text-[#0E1422] text-sm"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="p-4 bg-[#F0FDF4] border border-[#DCFCE7] text-[#15803D] text-xs rounded-[4px] flex items-center gap-2">
                <Check className="h-4 w-4" />
                Undangan tender berhasil dikirimkan ke {invitingUmkm.name}!
              </div>
            ) : (
              <form onSubmit={handleSendInvitation} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#0E1422]">
                    Pilih Tender RFQ yang Ingin Ditawarkan:
                  </label>
                  <select
                    value={selectedRfqId}
                    onChange={(e) => setSelectedRfqId(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#8B93A1] rounded-[4px] text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0] outline-none"
                  >
                    {availableRfqs.map((rfq) => (
                      <option key={rfq.id} value={rfq.id}>
                        {rfq.rfqNumber} - {rfq.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-[#EFF4FE] text-[#1E40AF] text-[11px] leading-relaxed rounded-[4px]">
                  Konveksi yang diundang akan menerima notifikasi resmi dan
                  diberikan akses langsung untuk melihat spesifikasi serta
                  mengajukan penawaran harga.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setInvitingUmkm(null)}
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
                    Kirim Undangan Sekarang
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
