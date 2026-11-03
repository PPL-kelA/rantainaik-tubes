"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FilePlus2,
  ArrowRight,
  Layers,
  Calendar,
  MapPin,
  Package,
  Clock,
  Edit3,
} from "lucide-react";
import { Button, PageHeader, SearchBar, StatusBadge } from "@/components/ui";

interface RfqItemData {
  id: string;
  name: string;
  fabricType: string;
  totalQuantity: number;
}

export interface RfqCatalogItem {
  id: string;
  rfqNumber: string;
  title: string;
  status: string;
  categoryType: string;
  allocationMode: string;
  deliveryLocation: string;
  quotationDeadline: string;
  targetDeliveryDate: string;
  items: RfqItemData[];
  createdAt: string;
}

interface RfqCatalogClientProps {
  rfqs: RfqCatalogItem[];
  isVerified: boolean;
  companyName: string;
}

type StatusGroupFilter =
  "ALL" | "OPEN" | "EVALUATING" | "DRAFT" | "SAMPLING" | "FINISHED";

export function RfqCatalogClient({
  rfqs,
  isVerified,
  companyName,
}: RfqCatalogClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroup, setActiveGroup] = useState<StatusGroupFilter>("ALL");

  // Filter logic
  const filteredRfqs = rfqs.filter((r) => {
    // Search matching
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.rfqNumber.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.categoryType.toLowerCase().includes(q) ||
      r.deliveryLocation.toLowerCase().includes(q);

    if (!matchSearch) return false;

    // Grouping status matching
    if (activeGroup === "ALL") return true;
    if (activeGroup === "OPEN") return r.status === "OPEN";
    if (activeGroup === "EVALUATING") return r.status === "EVALUATING";
    if (activeGroup === "DRAFT") return r.status === "DRAFT";
    if (activeGroup === "SAMPLING") return r.status === "SAMPLING";
    if (activeGroup === "FINISHED") {
      return (
        r.status === "AWARDED" ||
        r.status === "AWARDED_PARTIAL" ||
        r.status === "CLOSED" ||
        r.status === "CANCELLED" ||
        r.status === "EXPIRED"
      );
    }
    return true;
  });

  const countByGroup = {
    ALL: rfqs.length,
    OPEN: rfqs.filter((r) => r.status === "OPEN").length,
    EVALUATING: rfqs.filter((r) => r.status === "EVALUATING").length,
    DRAFT: rfqs.filter((r) => r.status === "DRAFT").length,
    SAMPLING: rfqs.filter((r) => r.status === "SAMPLING").length,
    FINISHED: rfqs.filter(
      (r) =>
        r.status === "AWARDED" ||
        r.status === "AWARDED_PARTIAL" ||
        r.status === "CLOSED" ||
        r.status === "CANCELLED" ||
        r.status === "EXPIRED"
    ).length,
  };

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* Header Kompartemen Resmi */}
      <div className="p-6 sm:p-8">
        <PageHeader
          className="border-b-0 pb-0"
          category="Katalog Pengadaan & Tender"
          title="Katalog RFQ Saya"
          description={`Daftar seluruh spesifikasi tender tekstil dari ${companyName}. Pantau status lelang, evaluasi penawaran UMKM, dan terbitkan addendum resmi.`}
          actions={
            isVerified ? (
              <Button variant="default" size="sm" asChild>
                <Link
                  href="/industri/rfq/baru"
                  className="flex items-center gap-2 font-semibold text-xs rounded-[4px]"
                >
                  <FilePlus2 className="h-4 w-4" />
                  Buat RFQ Baru
                </Link>
              </Button>
            ) : null
          }
        />

        {/* In-page SearchBar */}
        <div className="mt-5 w-full">
          <SearchBar
            placeholder="Cari nomor RFQ (misal: RFQ-0007), judul seragam, atau kategori pengadaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Underline Tabs: Grouping Berdasarkan Status */}
      <div className="px-6 bg-white border-b border-[#E5E7EB] overflow-x-auto">
        <div className="flex items-center gap-6" role="tablist">
          <button
            type="button"
            onClick={() => setActiveGroup("ALL")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeGroup === "ALL"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Semua RFQ ({countByGroup.ALL})
          </button>
          <button
            type="button"
            onClick={() => setActiveGroup("OPEN")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeGroup === "OPEN"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Aktif / Buka Tender ({countByGroup.OPEN})
          </button>
          <button
            type="button"
            onClick={() => setActiveGroup("EVALUATING")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeGroup === "EVALUATING"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Tahap Evaluasi ({countByGroup.EVALUATING})
          </button>
          <button
            type="button"
            onClick={() => setActiveGroup("DRAFT")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeGroup === "DRAFT"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Draft ({countByGroup.DRAFT})
          </button>
          <button
            type="button"
            onClick={() => setActiveGroup("SAMPLING")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeGroup === "SAMPLING"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Sampling Prototipe ({countByGroup.SAMPLING})
          </button>
          <button
            type="button"
            onClick={() => setActiveGroup("FINISHED")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeGroup === "FINISHED"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Selesai / Teraward ({countByGroup.FINISHED})
          </button>
        </div>
      </div>

      {/* Feed Katalog RFQ */}
      <div className="divide-y divide-[#E5E7EB]">
        {filteredRfqs.length > 0 ? (
          filteredRfqs.map((rfq) => {
            const totalQty = rfq.items.reduce(
              (sum, item) => sum + item.totalQuantity,
              0
            );

            return (
              <div
                key={rfq.id}
                className="px-6 py-5 space-y-3.5 transition-colors hover:bg-[#FAFBFC]"
              >
                {/* Baris Meta Atas */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                      {rfq.rfqNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#5B6475] bg-[#FAFBFC] border border-[#E5E7EB] px-2 py-0.5 rounded-[2px]">
                      <Layers className="h-3 w-3 text-[#5B6475]" />
                      Mode {rfq.allocationMode}
                    </span>
                    <span className="text-xs text-[#8B93A1]">·</span>
                    <span className="text-xs text-[#5B6475]">
                      Kategori:{" "}
                      <strong className="text-[#0E1422]">
                        {rfq.categoryType}
                      </strong>
                    </span>
                  </div>

                  <StatusBadge status={rfq.status} />
                </div>

                {/* Judul & Spesifikasi Utama */}
                <div>
                  <h3 className="font-heading text-base font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors">
                    <Link href={`/industri/rfq/${rfq.id}`}>{rfq.title}</Link>
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#5B6475]">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-[#8B93A1]" />
                      <span>
                        Total:{" "}
                        <strong className="font-mono text-[#0E1422]">
                          {totalQty.toLocaleString("id-ID")} pcs
                        </strong>{" "}
                        ({rfq.items.length} rincian item)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#8B93A1]" />
                      <span>
                        Gudang:{" "}
                        <strong className="text-[#0E1422]">
                          {rfq.deliveryLocation}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#8B93A1]" />
                      <span>
                        Tenggat Penawaran:{" "}
                        <strong className="text-[#0E1422]">
                          {new Date(rfq.quotationDeadline).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Baris Tombol Aksi */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#E5E7EB]/60">
                  <div className="flex items-center gap-2 text-xs text-[#5B6475]">
                    <Calendar className="h-3.5 w-3.5 text-[#8B93A1]" />
                    <span>
                      Dibuat pada:{" "}
                      {new Date(rfq.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {rfq.status === "DRAFT" && (
                      <Button variant="secondary" size="sm" asChild>
                        <Link
                          href={`/industri/rfq/${rfq.id}?edit=true`}
                          className="flex items-center gap-1.5 text-xs rounded-[4px]"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-[#2862E0]" />
                          Edit Draft
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/industri/rfq/${rfq.id}`}
                        className="flex items-center gap-1.5 font-semibold text-xs text-[#2862E0] hover:text-[#2858B8]"
                      >
                        Buka Detail & Kontrol
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-xs sm:text-sm text-[#5B6475] space-y-3">
            <p className="text-[#0E1422] font-medium">
              Tidak ada RFQ yang ditemukan dalam kategori status ini.
            </p>
            <p className="text-xs text-[#8B93A1]">
              Coba sesuaikan kata kunci pencarian atau buat tender pengadaan
              baru.
            </p>
            {isVerified && (
              <div className="pt-2">
                <Button variant="default" size="sm" asChild>
                  <Link
                    href="/industri/rfq/baru"
                    className="inline-flex items-center gap-2 rounded-[4px] text-xs font-semibold"
                  >
                    <FilePlus2 className="h-4 w-4" />
                    Buat RFQ Baru
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
