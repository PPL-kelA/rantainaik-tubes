"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Package,
  Layers,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Edit3,
  Plus,
  Eye,
  FilePlus2,
  Briefcase,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button, StatusBadge } from "@/components/ui";

export interface SerializedRfqItemSize {
  id: string;
  size: string;
  quantity: number;
}

export interface SerializedRfqItem {
  id: string;
  name: string;
  fabricType: string;
  gsmMin?: number | null;
  gsmMax?: number | null;
  color: string;
  materialProvidedByBuyer: boolean;
  referencePhotoUrl?: string | null;
  constructionNotes?: string | null;
  decorationType?: string | null;
  decorationPlacement?: string | null;
  labelPackingNotes?: string | null;
  dimensionTolerance?: string | null;
  aqlStandard?: string | null;
  needLabTest?: boolean;
  totalQuantity: number;
  sizes: SerializedRfqItemSize[];
}

export interface SerializedRfqRequirement {
  id: string;
  type: string;
  description: string;
  isMandatory: boolean;
}

export interface SerializedRfqQuestion {
  id: string;
  question: string;
  answer?: string | null;
  createdAt: string;
}

export interface SerializedRfqAddendum {
  id: string;
  addendumNumber: number;
  summary: string;
  changes?: unknown;
  createdAt: string;
}

export interface SerializedQuotationSummary {
  id: string;
  umkmName: string;
  umkmCity: string;
  readinessTier: string;
  readinessScore: number;
  unitPrice: number;
  totalPrice: number;
  leadTimeDays: number;
  offeredQuantity: number;
  submittedAt: string;
  status: string;
}

export interface SerializedRfq {
  id: string;
  rfqNumber: string;
  title: string;
  status: string;
  categoryType: string;
  visibility: string;
  contextDescription?: string | null;
  allocationMode: string;
  deliveryLocation: string;
  quotationDeadline: string;
  targetDeliveryDate: string;
  qaDeadline?: string | null;
  needSample: boolean;
  sampleCount?: number | null;
  sampleCostBearer?: string | null;
  industryOrg?: {
    id: string;
    name: string;
    city: string;
  } | null;
  items: SerializedRfqItem[];
  requirements: SerializedRfqRequirement[];
  questions: SerializedRfqQuestion[];
  addendums: SerializedRfqAddendum[];
}

interface IndustriRfqDetailClientProps {
  rfq: SerializedRfq;
  companyName: string;
}

export function IndustriRfqDetailClient({ rfq }: IndustriRfqDetailClientProps) {
  const [activeTab, setActiveTab] = useState<
    "spesifikasi" | "tanya-jawab" | "addendum" | "penawaran"
  >("spesifikasi");

  // State untuk Addendum Modal
  const [showAddendumModal, setShowAddendumModal] = useState(false);
  const [addendumSummary, setAddendumSummary] = useState("");
  const [addendumSuccess, setAddendumSuccess] = useState(false);

  // State untuk Jawaban Tanya Jawab
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(
    null
  );
  const [answerText, setAnswerText] = useState("");
  const [questions, setQuestions] = useState(rfq.questions);

  // Mock baseline penawaran masuk untuk tender ini
  const quotations: SerializedQuotationSummary[] = [
    {
      id: "QUO-001",
      umkmName: "CV Karya Mandiri Konveksi",
      umkmCity: "Bandung, Jawa Barat",
      readinessTier: "Tier A (Kesiapan Korporat)",
      readinessScore: 84,
      unitPrice: 168750,
      totalPrice: 33750000,
      leadTimeDays: 28,
      offeredQuantity: 200,
      submittedAt: "2026-11-01T08:30:00.000Z",
      status: "SUBMITTED",
    },
    {
      id: "QUO-002",
      umkmName: "PT Sinar Tekstil Jaya",
      umkmCity: "Surakarta, Jawa Tengah",
      readinessTier: "Tier B (Kesiapan Menengah)",
      readinessScore: 72,
      unitPrice: 175000,
      totalPrice: 35000000,
      leadTimeDays: 25,
      offeredQuantity: 200,
      submittedAt: "2026-11-02T10:15:00.000Z",
      status: "REVISION_REQUESTED",
    },
  ];

  const totalQuantity = rfq.items.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );

  const handlePublishAddendum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addendumSummary.trim()) return;

    // Simulasikan penambahan addendum
    rfq.addendums.unshift({
      id: `add-${Date.now()}`,
      addendumNumber: rfq.addendums.length + 1,
      summary: addendumSummary,
      createdAt: new Date().toISOString(),
    });

    setAddendumSuccess(true);
    setTimeout(() => {
      setAddendumSuccess(false);
      setShowAddendumModal(false);
      setAddendumSummary("");
      setActiveTab("addendum");
    }, 1200);
  };

  const handleAnswerQuestion = (questionId: string) => {
    if (!answerText.trim()) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answer: answerText.trim() } : q
      )
    );
    setAnsweringQuestionId(null);
    setAnswerText("");
  };

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* Banner Mode Pratinjau Industri & Kontrol Tender */}
      <div className="bg-[#EFF4FE] border-b border-[#2862E0]/20 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 shrink-0 text-[#2862E0] mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] bg-[#2862E0] text-white px-2 py-0.5 rounded-[2px]">
                  Mode Pratinjau Pengadaan
                </span>
                <span className="text-xs font-semibold text-[#0E1422]">
                  Perspektif UMKM & Pusat Kontrol Tender
                </span>
              </div>
              <p className="mt-1 text-xs text-[#5B6475] leading-relaxed">
                Tampilan di bawah adalah format spesifikasi resmi yang dilihat
                oleh UMKM konveksi saat meninjau tender ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {rfq.status === "DRAFT" ? (
              <Button variant="default" size="sm" asChild>
                <Link
                  href={`/industri/rfq/baru?edit=${rfq.id}`}
                  className="flex items-center gap-1.5 text-xs font-semibold rounded-[4px]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Form RFQ
                </Link>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowAddendumModal(true)}
                className="flex items-center gap-1.5 text-xs font-semibold rounded-[4px]"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                Terbitkan Addendum (R-04)
              </Button>
            )}

            <Button variant="secondary" size="sm" asChild>
              <Link
                href={`/umkm/rfq/${rfq.id}`}
                target="_blank"
                className="flex items-center gap-1.5 text-xs rounded-[4px]"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#2862E0]" />
                Lihat Sebagai UMKM
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Header Kompartemen Spesifikasi RFQ */}
      <div className="p-6 sm:p-8 space-y-4">
        <nav className="flex items-center gap-2 text-xs text-[#5B6475]">
          <Link
            href="/industri/rfq"
            className="flex items-center gap-1 hover:text-[#0E1422] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Katalog RFQ Saya
          </Link>
          <span>/</span>
          <span className="font-mono text-[#2862E0]">{rfq.rfqNumber}</span>
          <span>/</span>
          <span className="font-semibold text-[#0E1422]">
            Detail Spesifikasi
          </span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2.5 py-1 rounded-[2px]">
              {rfq.rfqNumber}
            </span>
            <span className="font-mono text-xs text-[#5B6475] bg-[#FAFBFC] border border-[#E5E7EB] px-2.5 py-1 rounded-[2px]">
              Mode {rfq.allocationMode}
            </span>
            <span className="text-xs text-[#5B6475]">
              Visibilitas:{" "}
              <strong className="text-[#0E1422]">{rfq.visibility}</strong>
            </span>
          </div>

          <StatusBadge status={rfq.status} />
        </div>

        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-[#0E1422]">
            {rfq.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#5B6475] leading-relaxed max-w-4xl">
            {rfq.contextDescription ||
              "Tender pengadaan tekstil industri resmi melalui sistem platform terverifikasi RantaiNaik."}
          </p>
        </div>
      </div>

      {/* Strip 4-Kolom Fakta Kunci (Seamless Grid) */}
      <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <div className="flex items-center gap-1.5 text-[#5B6475]">
            <Package className="h-4 w-4 text-[#8B93A1]" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em]">
              Total Pesanan
            </span>
          </div>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
            {totalQuantity.toLocaleString("id-ID")} pcs
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            {rfq.items.length} rincian produk jahit
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <div className="flex items-center gap-1.5 text-[#5B6475]">
            <Calendar className="h-4 w-4 text-[#8B93A1]" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em]">
              Target Kirim
            </span>
          </div>
          <p className="mt-1 font-heading text-lg font-semibold text-[#0E1422]">
            {new Date(rfq.targetDeliveryDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <span className="text-xs text-[#5B6475] truncate block">
            Gudang: {rfq.deliveryLocation}
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <div className="flex items-center gap-1.5 text-[#5B6475]">
            <Layers className="h-4 w-4 text-[#8B93A1]" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em]">
              Sampel Pra-Produksi
            </span>
          </div>
          <p className="mt-1 font-heading text-lg font-semibold text-[#0E1422]">
            {rfq.needSample
              ? `${rfq.sampleCount || 1} Pcs Wajib`
              : "Tidak Diperlukan"}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            {rfq.needSample
              ? `Biaya: ${rfq.sampleCostBearer || "BUYER"}`
              : "Langsung produksi massal"}
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <div className="flex items-center gap-1.5 text-[#5B6475]">
            <Clock className="h-4 w-4 text-[#8B93A1]" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em]">
              Batas Penawaran
            </span>
          </div>
          <p className="mt-1 font-heading text-lg font-semibold text-[#0E1422]">
            {new Date(rfq.quotationDeadline).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <span className="font-mono text-[11px] font-medium text-[#B45309]">
            Tenggat Waktu UMKM
          </span>
        </div>
      </div>

      {/* Navigasi Underline Tabs (Strictly No Pill) */}
      <div className="px-6 bg-white border-b border-[#E5E7EB] overflow-x-auto">
        <div className="flex items-center gap-6" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab("spesifikasi")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeTab === "spesifikasi"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Spesifikasi Teknis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("penawaran")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeTab === "penawaran"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Penawaran Masuk ({quotations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tanya-jawab")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeTab === "tanya-jawab"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Tanya Jawab Publik ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("addendum")}
            className={`py-3.5 text-xs transition-colors border-b-2 font-medium whitespace-nowrap ${
              activeTab === "addendum"
                ? "border-[#2862E0] text-[#0E1422] font-semibold"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#8B93A1]"
            }`}
          >
            Addendum Resmi ({rfq.addendums.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Spesifikasi Teknis */}
      {activeTab === "spesifikasi" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
          {/* Kolom Kiri: Rincian Item Pakaian */}
          <div className="lg:col-span-8 bg-white divide-y divide-[#E5E7EB]">
            {rfq.items.map((item, idx) => (
              <div key={item.id} className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold bg-[#FAFBFC] border border-[#E5E7EB] text-[#5B6475] px-2 py-0.5 rounded-[2px]">
                      Item #{idx + 1}
                    </span>
                    <h2 className="font-heading text-lg font-semibold text-[#0E1422]">
                      {item.name}
                    </h2>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#2862E0]">
                    {item.totalQuantity.toLocaleString("id-ID")} pcs
                  </span>
                </div>

                {/* Grid Spesifikasi Bahan & Toleransi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAFBFC] border border-[#E5E7EB] rounded-[4px] space-y-1">
                    <span className="text-[#8B93A1] font-mono uppercase text-[10px] tracking-wider block">
                      Spesifikasi Kain
                    </span>
                    <p className="font-medium text-[#0E1422]">
                      {item.fabricType} ({item.gsmMin || 135} -{" "}
                      {item.gsmMax || 145} GSM)
                    </p>
                    <p className="text-[11px] text-[#5B6475]">
                      Warna: {item.color} · Bahan:{" "}
                      {item.materialProvidedByBuyer
                        ? "Disediakan Industri (Makloon)"
                        : "Disediakan UMKM (Full Package)"}
                    </p>
                  </div>

                  <div className="p-3 bg-[#FAFBFC] border border-[#E5E7EB] rounded-[4px] space-y-1">
                    <span className="text-[#8B93A1] font-mono uppercase text-[10px] tracking-wider block">
                      Standar Kualitas & Toleransi
                    </span>
                    <p className="font-medium text-[#0E1422]">
                      {item.aqlStandard || "AQL 2.5 Major / 4.0 Minor"}
                    </p>
                    <p className="text-[11px] text-[#5B6475]">
                      Toleransi Ukuran: {item.dimensionTolerance || "±1 cm"} ·
                      Uji Lab: {item.needLabTest ? "Wajib" : "Tidak"}
                    </p>
                  </div>
                </div>

                {/* Tabel Rincian Ukuran (R-02 Invarian) */}
                <div className="space-y-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
                    Rincian Alokasi Ukuran (Total: {item.totalQuantity} pcs)
                  </span>
                  <div className="border border-[#E5E7EB] rounded-[4px] overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAFBFC] border-b border-[#E5E7EB] text-[#5B6475] font-mono text-[11px]">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Ukuran</th>
                          <th className="py-2.5 px-4 font-semibold text-right">
                            Jumlah (Pcs)
                          </th>
                          <th className="py-2.5 px-4 font-semibold text-right">
                            Proporsi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {item.sizes.map((s) => (
                          <tr key={s.id} className="hover:bg-[#FAFBFC]/60">
                            <td className="py-2.5 px-4 font-medium text-[#0E1422]">
                              Size {s.size}
                            </td>
                            <td className="py-2.5 px-4 font-mono font-semibold text-[#0E1422] text-right">
                              {s.quantity}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-[#5B6475] text-right">
                              {(
                                (s.quantity / item.totalQuantity) *
                                100
                              ).toFixed(1)}
                              %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Catatan Konstruksi & Dekorasi */}
                {(item.constructionNotes || item.decorationType) && (
                  <div className="p-4 bg-[#FAFBFC] border border-[#E5E7EB] rounded-[4px] text-xs space-y-1.5">
                    {item.constructionNotes && (
                      <p className="text-[#0E1422]">
                        <strong className="text-[#5B6475]">
                          Konstruksi Jahitan:
                        </strong>{" "}
                        {item.constructionNotes}
                      </p>
                    )}
                    {item.decorationType && (
                      <p className="text-[#0E1422]">
                        <strong className="text-[#5B6475]">Dekorasi:</strong>{" "}
                        {item.decorationType} (Posisi:{" "}
                        {item.decorationPlacement || "Sesuai Tech Pack"})
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Kolom Kanan: Persyaratan & Jaminan Escrow */}
          <div className="lg:col-span-4 bg-[#FAFBFC] p-6 sm:p-7 space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] block">
                Persyaratan Kualifikasi UMKM
              </span>
              <div className="space-y-2">
                {rfq.requirements.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-white border border-[#E5E7EB] rounded-[4px] flex items-start gap-2.5 text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#2862E0] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0E1422]">
                        {req.description}
                      </p>
                      <span className="font-mono text-[10px] text-[#5B6475]">
                        {req.isMandatory ? "Wajib Dipenuhi" : "Nilai Tambah"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Garansi Escrow */}
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-[4px] space-y-3">
              <div className="flex items-center gap-2 text-[#0E1422]">
                <ShieldCheck className="h-5 w-5 text-[#15803D]" />
                <h4 className="font-heading text-sm font-semibold">
                  Jaminan 100% Escrow RantaiNaik
                </h4>
              </div>
              <p className="text-xs text-[#5B6475] leading-relaxed">
                Dana pembayaran tender ini diamankan di rekening escrow simulasi
                RantaiNaik sebelum produksi dimulai. Pencairan dilakukan
                bertahap setelah konfirmasi bahan (30%) dan kelulusan QC (70%).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Penawaran Masuk (Khusus Industri) */}
      {activeTab === "penawaran" && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-base sm:text-lg font-semibold text-[#0E1422]">
                Penawaran Masuk dari Mitra UMKM ({quotations.length})
              </h2>
              <p className="text-xs text-[#5B6475] mt-0.5">
                Evaluasi penawaran harga, lead time pengiriman, dan skor
                kesiapan industri peserta lelang.
              </p>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link
                href="/industri/penawaran"
                className="flex items-center gap-1.5 text-xs rounded-[4px]"
              >
                <Briefcase className="h-3.5 w-3.5 text-[#2862E0]" />
                Papan Komparasi Semua Penawaran
              </Link>
            </Button>
          </div>

          <div className="border border-[#E5E7EB] rounded-[4px] overflow-hidden divide-y divide-[#E5E7EB]">
            {quotations.map((quo) => (
              <div
                key={quo.id}
                className="px-6 py-5 bg-white transition-colors hover:bg-[#FAFBFC] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                      {quo.id}
                    </span>
                    <span className="font-medium text-sm text-[#0E1422]">
                      {quo.umkmName}
                    </span>
                    <span className="text-xs text-[#8B93A1]">·</span>
                    <span className="text-xs text-[#5B6475]">
                      {quo.umkmCity}
                    </span>
                  </div>
                  <StatusBadge status={quo.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAFBFC] p-3 border border-[#E5E7EB] rounded-[4px]">
                  <div>
                    <span className="text-[#8B93A1] text-[10px] uppercase font-mono block">
                      Readiness Tier
                    </span>
                    <span className="font-medium text-[#0E1422]">
                      {quo.readinessTier} (Skor: {quo.readinessScore})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8B93A1] text-[10px] uppercase font-mono block">
                      Harga Penawaran
                    </span>
                    <span className="font-mono font-semibold text-[#0E1422]">
                      Rp{quo.totalPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-[#5B6475] block">
                      (Rp{quo.unitPrice.toLocaleString("id-ID")}/pcs)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8B93A1] text-[10px] uppercase font-mono block">
                      Lead Time
                    </span>
                    <span className="font-medium text-[#0E1422]">
                      {quo.leadTimeDays} Hari Kerja
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8B93A1] text-[10px] uppercase font-mono block">
                      Kuantitas Komitmen
                    </span>
                    <span className="font-mono font-semibold text-[#0E1422]">
                      {quo.offeredQuantity} Pcs (Penuh)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                  <span className="text-[#5B6475]">
                    Diajukan:{" "}
                    {new Date(quo.submittedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" asChild>
                      <Link
                        href={`/industri/penawaran?id=${quo.id}`}
                        className="text-xs rounded-[4px]"
                      >
                        Evaluasi & Negosiasi (BR-03)
                      </Link>
                    </Button>
                    <Button variant="default" size="sm" asChild>
                      <Link
                        href={`/industri/order?awardRfq=${rfq.id}&quotationId=${quo.id}`}
                        className="text-xs font-semibold rounded-[4px]"
                      >
                        Pilih Pemenang Tender
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tanya Jawab Publik */}
      {activeTab === "tanya-jawab" && (
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-heading text-base sm:text-lg font-semibold text-[#0E1422]">
              Tanya Jawab Publik & Klarifikasi (Q-04)
            </h2>
            <p className="text-xs text-[#5B6475] mt-0.5">
              Pertanyaan dari UMKM anonim untuk menjaga objektivitas. Jawaban
              yang Anda berikan akan tampil secara terbuka untuk seluruh calon
              penawar.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-5 border border-[#E5E7EB] rounded-[4px] bg-white space-y-3"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 text-[#2862E0] shrink-0 mt-0.5" />
                  <div className="space-y-1 w-full">
                    <p className="text-xs sm:text-sm font-medium text-[#0E1422]">
                      {q.question}
                    </p>
                    <span className="font-mono text-[11px] text-[#8B93A1]">
                      Ditanyakan:{" "}
                      {new Date(q.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {q.answer ? (
                  <div className="ml-7 p-3 bg-[#FAFBFC] border-l-2 border-[#2862E0] text-xs space-y-1">
                    <span className="font-semibold text-[#0E1422]">
                      Jawaban Resmi Industri:
                    </span>
                    <p className="text-[#5B6475] leading-relaxed">{q.answer}</p>
                  </div>
                ) : (
                  <div className="ml-7 pt-2">
                    {answeringQuestionId === q.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Tuliskan jawaban klarifikasi resmi untuk UMKM penawar..."
                          className="w-full rounded-[4px] border border-[#8B93A1] p-3 text-xs text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0] outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAnswerQuestion(q.id)}
                            className="text-xs font-semibold rounded-[4px]"
                          >
                            Kirim Jawaban Publik
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAnsweringQuestionId(null);
                              setAnswerText("");
                            }}
                            className="text-xs"
                          >
                            Batal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setAnsweringQuestionId(q.id);
                          setAnswerText("");
                        }}
                        className="text-xs rounded-[4px]"
                      >
                        Jawab Pertanyaan Ini
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Addendum Resmi */}
      {activeTab === "addendum" && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-base sm:text-lg font-semibold text-[#0E1422]">
                Riwayat Addendum Resmi (R-04)
              </h2>
              <p className="text-xs text-[#5B6475] mt-0.5">
                Perubahan spesifikasi setelah RFQ berstatus OPEN hanya sah
                melalui dokumen Addendum bernomor resmi.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowAddendumModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold rounded-[4px]"
            >
              <Plus className="h-3.5 w-3.5" />
              Buat Addendum Baru
            </Button>
          </div>

          <div className="space-y-4">
            {rfq.addendums.length > 0 ? (
              rfq.addendums.map((add) => (
                <div
                  key={add.id}
                  className="p-5 border border-[#E5E7EB] rounded-[4px] bg-white space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                      Addendum #{add.addendumNumber}
                    </span>
                    <span className="font-mono text-[11px] text-[#8B93A1]">
                      Diterbitkan:{" "}
                      {new Date(add.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#0E1422] leading-relaxed">
                    {add.summary}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#5B6475]">
                Belum ada addendum yang diterbitkan untuk tender ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Terbitkan Addendum Resmi (R-04) */}
      {showAddendumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white border border-[#E5E7EB] rounded-[4px] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="font-heading text-base font-semibold text-[#0E1422]">
                  Terbitkan Addendum Resmi (R-04)
                </h3>
                <p className="text-xs text-[#5B6475]">
                  Addendum #{rfq.addendums.length + 1} untuk RFQ {rfq.rfqNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddendumModal(false)}
                className="text-[#8B93A1] hover:text-[#0E1422] text-sm"
              >
                ✕
              </button>
            </div>

            {addendumSuccess ? (
              <div className="p-4 bg-[#F0FDF4] border border-[#DCFCE7] text-[#15803D] text-xs rounded-[4px] flex items-center gap-2">
                <Check className="h-4 w-4" />
                Addendum resmi berhasil diterbitkan dan dinotifikasikan ke
                penawar!
              </div>
            ) : (
              <form onSubmit={handlePublishAddendum} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#0E1422]">
                    Ringkasan Perubahan Spesifikasi / Tenggat:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={addendumSummary}
                    onChange={(e) => setAddendumSummary(e.target.value)}
                    placeholder="Contoh: Perpanjangan batas akhir pengajuan penawaran hingga 15 November 2026 dan penyesuaian gramasi kain menjadi 140 GSM toleransi ±5%."
                    className="w-full rounded-[4px] border border-[#8B93A1] p-3 text-xs text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0] outline-none"
                  />
                </div>

                <div className="p-3 bg-[#FFFBEB] text-[#B45309] text-[11px] leading-relaxed rounded-[4px] border border-[#FEF3C7]">
                  <strong>Perhatian:</strong> Sesuai aturan bisnis, addendum
                  yang diterbitkan akan dicatat di log audit publik dan seluruh
                  UMKM yang telah mengajukan tawaran berhak memperbarui
                  penawarannya.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddendumModal(false)}
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
                    Terbitkan Addendum Sekarang
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
