"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureTabData {
  id: string;
  tabLabel: string;
  badge?: string;
  title: string;
  bullets: string[];
  codeTitle: string;
  codeSnippet: string;
}

export function FeatureTabs() {
  const [activeTabId, setActiveTabId] = useState("rfq");

  const tabs: FeatureTabData[] = [
    {
      id: "rfq",
      tabLabel: "RFQ Terstruktur",
      title: "Spesifikasi Baku Berbasis Standar Industri Tekstil",
      bullets: [
        "Parameter gramasi kain (GSM), jenis benang, dan toleransi susut terdefinisi jelas.",
        "Rincian ukuran (size breakdown S-XL) dan panduan jahitan ganda SNI.",
        "Jadwal pengiriman sampel, masa sanggah addendum, dan penyerahan bertahap.",
      ],
      codeTitle: "spec-rfq-0007.json",
      codeSnippet: `{
  "rfq_id": "RFQ-0007",
  "category": "WORKWEAR_UNIFORM",
  "item": "Kemeja PDL American Drill",
  "quantity": 300,
  "size_breakdown": { "S": 60, "M": 100, "L": 100, "XL": 40 },
  "sample_approval_required": true,
  "aql_tolerance": "2.5_CRITICAL_DEFECT_ZERO",
  "target_delivery_days": 21
}`,
    },
    {
      id: "compare",
      tabLabel: "Penawaran & Perbandingan",
      title: "Evaluasi Matriks Tender Tertutup Secara Berimbang",
      bullets: [
        "Pencegahan perang harga terbuka (BR-02): UMKM tidak dapat saling intip tawaran.",
        "Matriks perbandingan otomatis: harga per pcs, kapasitas harian, dan lead time.",
        "Riwayat performa masa lalu dan verifikasi mesin jahit ditampilkan berdampingan.",
      ],
      codeTitle: "evaluation-matrix.ts",
      codeSnippet: `interface QuotationMatrix {
  umkm_id: "UMKM-024" | "UMKM-019";
  unit_price: 112500; // IDR per pcs
  lead_time_days: 18;
  daily_capacity: 50;
  readiness_score: 91;
  golden_sample_lead_days: 3;
  status: "SHORTLISTED_FOR_REVIEW";
}`,
    },
    {
      id: "split",
      tabLabel: "Split Award per Lot",
      title: "Bagi Volume Produksi ke Beberapa UMKM Sekaligus",
      bullets: [
        "Tender volume besar dapat dipecah menjadi 2-4 lot produksi independen.",
        "Mitigasi risiko keterlambatan pengiriman dengan multi-sourcing lokal.",
        "Pemberdayaan merata bagi konveksi kapasitas menengah ke bawah.",
      ],
      codeTitle: "split-award-plan.config",
      codeSnippet: `LOT_ALLOCATION_SUMMARY:
  TOTAL_QUANTITY: 5000_PCS
  LOT_01: { VENDOR: "CV_SINAR_BDG", QTY: 2000, DEADLINE: "D+14" }
  LOT_02: { VENDOR: "BERKAH_TAILOR", QTY: 1500, DEADLINE: "D+14" }
  LOT_03: { VENDOR: "KARYA_BUSANA",  QTY: 1500, DEADLINE: "D+14" }
  SYNC_QC_STANDARD: "SNI_7564_UNIFIED"`,
    },
    {
      id: "escrow",
      tabLabel: "Escrow & Milestone",
      badge: "Dalam pengembangan",
      title: "Simulasi Pembayaran Bertahap Berbasis Kendali Mutu",
      bullets: [
        "Skema komitmen dana 100% di awal dikunci di rekening penampungan aman.",
        "Termin 1 (30%): Dirilis setelah golden sample disetujui pihak industri.",
        "Termin 2 (70%): Dirilis saat barang diterima dan lolos inspeksi AQL.",
      ],
      codeTitle: "escrow-milestone-flow.md (Rancangan)",
      codeSnippet: `// STATUS: DIRANCANG (DALAM PENGEMBANGAN)
EscrowSchedule {
  total_commitment: 33750000;
  milestones: [
    { term: 1, percent: 30, trigger: "GOLDEN_SAMPLE_ACCEPTED" },
    { term: 2, percent: 70, trigger: "FINAL_QC_AQL_PASSED" }
  ],
  dispute_arbiter: "RANTAI_NAIK_MEDIATOR"
}`,
    },
    {
      id: "readiness",
      tabLabel: "Readiness Score",
      title: "Skor Kesiapan 0-100 Berdasarkan 6 Pilar Transparan",
      bullets: [
        "Penilaian objektif: Legalitas Usaha, Kapasitas Mesin, & Mutu Produksi.",
        "Verifikasi fisik sertifikat ISO/SNI dan riwayat ketepatan waktu order.",
        "Memberikan rekomendasi tender yang proporsional sesuai kekuatan mesin.",
      ],
      codeTitle: "readiness-score-6pillars.ts",
      codeSnippet: `const readinessPillars = {
  legal_standing: 15,    // NIB & Legalitas Usaha
  machine_capacity: 25,  // Jumlah obras, overdeck, jarum 2
  qc_compliance: 20,     // Prosedur inspeksi internal
  operator_skill: 15,    // Sertifikasi juru jahit
  financial_health: 15,  // Kemampuan modal awal bahan
  track_record: 10,      // Riwayat transaksi platform
}; // Total: 100 Poin Kesiapan`,
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <section
      id="fitur-platform"
      aria-label="Fitur Unggulan Platform"
      className="w-full border-b border-[#E5E7EB] bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="border-b border-[#E5E7EB] pb-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            FITUR UNGGULAN
          </span>
          <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#0E1422]">
            Dibangun untuk Pengadaan yang Terukur
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#5B6475]">
            Setiap fitur dirancang untuk mengurangi friksi transaksi antara
            korporasi pembeli dan UMKM jahit lokal.
          </p>
        </div>

        {/* DESKTOP LAYOUT (>= 1024px): Left Tabs List + Right Panel */}
        <div className="hidden lg:grid lg:grid-cols-12 border border-[#E5E7EB]">
          {/* Left Tabs List (4 Cols) */}
          <div className="lg:col-span-4 border-r border-[#E5E7EB] divide-y divide-[#E5E7EB] bg-[#FAFBFC]">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={cn(
                    "w-full text-left p-5 transition-colors relative flex items-center justify-between",
                    isActive
                      ? "bg-white text-[#0E1422] font-semibold border-l-2 border-l-[#2862E0]"
                      : "text-[#5B6475] hover:bg-white hover:text-[#0E1422] border-l-2 border-l-transparent"
                  )}
                >
                  <span className="text-sm">{tab.tabLabel}</span>
                  {tab.badge && (
                    <span className="bg-[#FFFBEB] text-[#B45309] text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] font-medium border border-[#FEF3C7]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Panel (8 Cols) */}
          <div className="lg:col-span-8 p-6 lg:p-8 space-y-6 bg-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase text-[#2862E0]">
                  {currentTab.tabLabel}
                </span>
                {currentTab.badge && (
                  <span className="bg-[#FFFBEB] text-[#B45309] text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] font-medium border border-[#FEF3C7]">
                    {currentTab.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-heading text-xl font-semibold text-[#0E1422]">
                {currentTab.title}
              </h3>
            </div>

            {/* 3 Bullets with Icons */}
            <div className="space-y-3 pt-2">
              {currentTab.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#EFF4FE] text-[#2862E0] mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            {/* Technical Dark Block (Tokyo Night #1A1B26) */}
            <div className="pt-2">
              <div className="rounded-[4px] border border-[#2A3142] bg-[#1A1B26] text-[#A9B1D6]">
                <div className="flex items-center justify-between border-b border-[#2A3142] px-4 py-2 font-mono text-[11px] text-[#C0CAF5]">
                  <span>{currentTab.codeTitle}</span>
                  <span className="text-[10px] text-[#A9B1D6]/60">
                    DATA STRUKTUR TEKNIS
                  </span>
                </div>
                <pre className="p-4 font-mono text-xs overflow-x-auto text-[#A9B1D6] leading-relaxed whitespace-pre">
                  <code>{currentTab.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE ACCORDION (< 1024px): 1 Open Panel, No horizontal scroll */}
        <div className="lg:hidden divide-y divide-[#E5E7EB] border border-[#E5E7EB]">
          {tabs.map((tab) => {
            const isOpen = tab.id === activeTabId;
            return (
              <div key={tab.id} className="bg-white">
                <button
                  type="button"
                  onClick={() => setActiveTabId(isOpen ? "" : tab.id)}
                  aria-expanded={isOpen}
                  className={cn(
                    "w-full text-left p-4 sm:p-5 flex items-center justify-between transition-colors",
                    isOpen
                      ? "bg-[#FAFBFC] text-[#0E1422] font-semibold border-l-2 border-l-[#2862E0]"
                      : "text-[#5B6475] hover:bg-[#FAFBFC] border-l-2 border-l-transparent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold">
                      {tab.tabLabel}
                    </span>
                    {tab.badge && (
                      <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-mono px-1 py-0.2 rounded-[2px] border border-[#FEF3C7]">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform text-[#5B6475]",
                      isOpen && "rotate-180 text-[#2862E0]"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 space-y-4 border-t border-[#E5E7EB] bg-white">
                    <h3 className="font-heading text-sm sm:text-base font-semibold text-[#0E1422]">
                      {tab.title}
                    </h3>

                    {/* Bullets */}
                    <div className="space-y-2.5">
                      {tab.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] bg-[#EFF4FE] text-[#2862E0] mt-0.5">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                          <p className="text-xs text-[#5B6475] leading-relaxed">
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tokyo Night Code Block */}
                    <div className="rounded-[4px] border border-[#2A3142] bg-[#1A1B26] text-[#A9B1D6]">
                      <div className="flex items-center justify-between border-b border-[#2A3142] px-3 py-1.5 font-mono text-[10px] text-[#C0CAF5]">
                        <span>{tab.codeTitle}</span>
                      </div>
                      <pre className="p-3 font-mono text-[11px] overflow-x-auto text-[#A9B1D6] leading-relaxed whitespace-pre">
                        <code>{tab.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
