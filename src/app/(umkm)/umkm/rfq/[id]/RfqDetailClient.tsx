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
  FileText,
  AlertTriangle,
  Building2,
  Send,
  MessageSquare,
  Lock,
  ExternalLink,
} from "lucide-react";
import { askQuestionAction } from "@/modules/rfq/actions";

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

interface RfqDetailClientProps {
  rfq: SerializedRfq;
  currentUserId: string;
  userRole: string;
  userOrgId: string;
}

export function RfqDetailClient({ rfq, userRole }: RfqDetailClientProps) {
  const [activeTab, setActiveTab] = useState<
    "spesifikasi" | "tanya_jawab" | "addendum"
  >("spesifikasi");
  const [newQuestion, setNewQuestion] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [questionSuccess, setQuestionSuccess] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  // Hitung total item & kuantitas
  const totalQty = rfq.items.reduce(
    (sum: number, it: SerializedRfqItem) => sum + (it.totalQuantity || 0),
    0
  );

  const formatDeadline = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmittingQuestion(true);
    setQuestionError(null);
    setQuestionSuccess(false);

    const res = await askQuestionAction({
      rfqId: rfq.id,
      question: newQuestion,
    });

    setSubmittingQuestion(false);
    if (res.success) {
      setQuestionSuccess(true);
      setNewQuestion("");
    } else {
      setQuestionError(res.error || "Gagal mengajukan pertanyaan");
    }
  };

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* 1. Breadcrumb & Header Compartment */}
      <div className="p-6 sm:p-8 space-y-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5B6475]">
          <Link
            href="/umkm"
            className="flex items-center gap-1 hover:text-[#0E1422] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard UMKM
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#0E1422]">Detail RFQ</span>
          <span>/</span>
          <span className="font-mono text-[#2862E0]">{rfq.rfqNumber}</span>
        </nav>

        {/* Title & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                {rfq.rfqNumber}
              </span>
              <span
                className={`font-mono text-[11px] font-medium px-2 py-0.5 rounded-[2px] ${
                  rfq.status === "OPEN"
                    ? "bg-[#DCFCE7] text-[#15803D]"
                    : "bg-[#F1F3F5] text-[#4B5563]"
                }`}
              >
                {rfq.status === "OPEN"
                  ? "Dibuka untuk Penawaran"
                  : `Status: ${rfq.status}`}
              </span>
              <span className="font-mono text-[11px] bg-[#F1F3F5] text-[#374151] px-2 py-0.5 rounded-[2px]">
                Kategori {rfq.categoryType}
              </span>
              <span className="font-mono text-[11px] bg-[#F1F3F5] text-[#374151] px-2 py-0.5 rounded-[2px]">
                Mode {rfq.allocationMode}
              </span>
            </div>

            <h1 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-[#0E1422]">
              {rfq.title}
            </h1>

            <p className="text-xs text-[#5B6475]">
              Diposting oleh{" "}
              <strong className="text-[#0E1422]">
                {rfq.industryOrg?.name || "Perusahaan Mitra Industri"}
              </strong>{" "}
              · Lokasi pengiriman:{" "}
              <strong className="text-[#0E1422]">{rfq.deliveryLocation}</strong>
            </p>
          </div>

          <div className="flex md:flex-col items-start md:items-end gap-1 bg-[#FAFBFC] p-3 rounded-[4px] border border-[#E5E7EB]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#5B6475]">
              Tenggat Penawaran:
            </span>
            <span className="font-mono text-sm font-semibold text-[#DC2626] flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDeadline(rfq.quotationDeadline)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Strip 4-Kolom Fakta Kunci (Instrument Grid) */}
      <div className="grid grid-cols-2 divide-y divide-[#E5E7EB] sm:grid-cols-4 sm:divide-y-0 sm:divide-x bg-white">
        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-[#2862E0]" /> Total Pesanan
          </span>
          <p className="mt-1 font-heading text-xl font-semibold tabular-nums text-[#0E1422]">
            {totalQty} pcs ({rfq.items.length} item)
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            Total pesanan pakaian
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#2862E0]" /> Target Kirim
          </span>
          <p className="mt-1 font-heading text-xl font-semibold tabular-nums text-[#0E1422]">
            {formatDeadline(rfq.targetDeliveryDate)}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            Jadwal pengiriman akhir
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#2862E0]" /> Sampel
            Pra-Produksi
          </span>
          <p className="mt-1 font-heading text-xl font-semibold text-[#0E1422]">
            {rfq.needSample ? "Wajib Disetujui" : "Tidak Perlu"}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            {rfq.needSample
              ? `${rfq.sampleCount || 1} pcs (${rfq.sampleCostBearer || "Biaya pembeli"})`
              : "Produksi langsung"}
          </span>
        </div>

        <div className="p-5 bg-white transition-colors hover:bg-[#FAFBFC]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#2862E0]" /> Batas Q&A
          </span>
          <p className="mt-1 font-heading text-xl font-semibold tabular-nums text-[#0E1422]">
            {rfq.qaDeadline
              ? formatDeadline(rfq.qaDeadline)
              : "Sebelum Tenggat"}
          </p>
          <span className="font-mono text-[11px] text-[#5B6475]">
            Pertanyaan tertutup
          </span>
        </div>
      </div>

      {/* 3. Underline Navigation Tabs (Strictly No Pill) */}
      <div className="px-6 sm:px-8 border-b border-[#E5E7EB] bg-white flex items-center gap-8 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab("spesifikasi")}
          className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "spesifikasi"
              ? "border-[#2862E0] text-[#0E1422] font-semibold"
              : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
          }`}
        >
          <FileText className="h-4 w-4" />
          Spesifikasi & Rincian Item
        </button>

        <button
          onClick={() => setActiveTab("tanya_jawab")}
          className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "tanya_jawab"
              ? "border-[#2862E0] text-[#0E1422] font-semibold"
              : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Tanya Jawab Publik
          <span className="bg-[#EFF4FE] text-[#2862E0] font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] font-semibold">
            {rfq.questions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("addendum")}
          className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "addendum"
              ? "border-[#2862E0] text-[#0E1422] font-semibold"
              : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          Addendum Resmi
          <span className="bg-[#EFF4FE] text-[#2862E0] font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] font-semibold">
            {rfq.addendums.length}
          </span>
        </button>
      </div>

      {/* 4. Konten Utama 2 Kolom (Konten 8 Kolom & Panel Samping 4 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB] bg-white">
        {/* Kolom Kiri (8/12) */}
        <div className="lg:col-span-8 p-6 sm:p-8 space-y-6 bg-white">
          {/* TAB 1: SPESIFIKASI */}
          {activeTab === "spesifikasi" && (
            <div className="space-y-6">
              {/* Ringkasan Konteks */}
              {rfq.contextDescription && (
                <div className="p-5 rounded-[4px] border border-[#E5E7EB] bg-[#FAFBFC] space-y-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
                    KONTEKS & KEBUTUHAN PENGADAAN
                  </span>
                  <p className="text-xs sm:text-sm text-[#0E1422] leading-relaxed">
                    {rfq.contextDescription}
                  </p>
                </div>
              )}

              {/* Rincian Item RFQ */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                  <h2 className="font-heading text-base font-semibold text-[#0E1422]">
                    Daftar Item & Rincian Ukuran (R-02)
                  </h2>
                  <span className="font-mono text-xs text-[#5B6475]">
                    {rfq.items.length} Item Terdaftar
                  </span>
                </div>

                <div className="space-y-4">
                  {rfq.items.map((item: SerializedRfqItem, idx: number) => (
                    <div
                      key={item.id}
                      className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-mono text-xs font-semibold text-[#2862E0]">
                            Item #{idx + 1}
                          </span>
                          <h3 className="font-heading text-base font-semibold text-[#0E1422]">
                            {item.name}
                          </h3>
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#0E1422] bg-[#F1F3F5] px-2.5 py-1 rounded-[2px]">
                          Total: {item.totalQuantity} pcs
                        </span>
                      </div>

                      {/* Rincian Spesifikasi Item */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAFBFC] p-4 rounded-[4px] border border-[#E5E7EB]">
                        <div>
                          <span className="text-[#5B6475] block">
                            Jenis Kain & Bahan:
                          </span>
                          <span className="font-semibold text-[#0E1422]">
                            {item.fabricType}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5B6475] block">Warna:</span>
                          <span className="font-semibold text-[#0E1422]">
                            {item.color}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5B6475] block">
                            Penyediaan Bahan:
                          </span>
                          <span className="font-semibold text-[#0E1422]">
                            {item.materialProvidedByBuyer
                              ? "Disediakan Pembeli (CMT)"
                              : "Disediakan UMKM (Full Package)"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5B6475] block">
                            Dekorasi / Aksesoris:
                          </span>
                          <span className="font-semibold text-[#0E1422]">
                            {item.decorationType || "Tidak Ada"}
                            {item.decorationPlacement
                              ? ` (${item.decorationPlacement})`
                              : ""}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5B6475] block">
                            Standar Mutu & Toleransi:
                          </span>
                          <span className="font-semibold text-[#0E1422]">
                            {item.dimensionTolerance || "±1 cm"} ·{" "}
                            {item.aqlStandard || "AQL 2.5"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#5B6475] block">
                            Uji Lab Kain:
                          </span>
                          <span className="font-semibold text-[#0E1422]">
                            {item.needLabTest
                              ? "Wajib Disertakan"
                              : "Tidak Diminta"}
                          </span>
                        </div>
                        {item.constructionNotes && (
                          <div className="sm:col-span-2 pt-2 border-t border-[#E5E7EB]">
                            <span className="text-[#5B6475] block">
                              Catatan Konstruksi & Pola:
                            </span>
                            <p className="text-[#0E1422] italic mt-0.5">
                              {item.constructionNotes}
                            </p>
                          </div>
                        )}
                        {item.labelPackingNotes && (
                          <div className="sm:col-span-2 pt-2 border-t border-[#E5E7EB]">
                            <span className="text-[#5B6475] block">
                              Label & Ketentuan Kemasan:
                            </span>
                            <p className="text-[#0E1422] mt-0.5">
                              {item.labelPackingNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Tabel Rincian Ukuran (R-02) */}
                      <div className="space-y-1.5">
                        <span className="font-mono text-xs font-semibold text-[#0E1422]">
                          Rincian Ukuran (Size Breakdown):
                        </span>
                        <div className="overflow-x-auto rounded-[2px] border border-[#E5E7EB] bg-white">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-[#FAFBFC] text-[#5B6475] font-semibold border-b border-[#E5E7EB]">
                              <tr>
                                {item.sizes.map((s: SerializedRfqItemSize) => (
                                  <th
                                    key={s.id}
                                    className="py-2 px-3 text-center font-mono"
                                  >
                                    {s.size}
                                  </th>
                                ))}
                                <th className="py-2 px-3 text-center font-bold text-[#0E1422] bg-[#EFF4FE] font-mono">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {item.sizes.map((s: SerializedRfqItemSize) => (
                                  <td
                                    key={s.id}
                                    className="py-2 px-3 text-center font-medium font-mono text-[#0E1422]"
                                  >
                                    {s.quantity} pcs
                                  </td>
                                ))}
                                <td className="py-2 px-3 text-center font-bold text-[#2862E0] bg-[#EFF4FE] font-mono">
                                  {item.totalQuantity} pcs
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Lampiran Desain & Tech Pack */}
                      {item.referencePhotoUrl && (
                        <div className="flex items-center gap-2 pt-1">
                          <FileText className="h-4 w-4 text-[#2862E0]" />
                          <a
                            href={item.referencePhotoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-[#2862E0] hover:underline flex items-center gap-1"
                          >
                            Lihat Gambar Desain / Tech Pack Referensi
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Persyaratan Kemitraan (NIB, Uji Lab, dll) */}
              <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 space-y-3">
                <h2 className="font-heading text-base font-semibold text-[#0E1422]">
                  Persyaratan Kemitraan RFQ
                </h2>
                <div className="space-y-2">
                  {rfq.requirements && rfq.requirements.length > 0 ? (
                    rfq.requirements.map((req: SerializedRfqRequirement) => (
                      <div
                        key={req.id}
                        className="flex items-start gap-3 p-3 rounded-[4px] border border-[#E5E7EB] bg-[#FAFBFC] text-xs"
                      >
                        <CheckCircle2
                          className={`h-4 w-4 mt-0.5 ${
                            req.isMandatory
                              ? "text-[#15803D]"
                              : "text-[#2862E0]"
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#0E1422]">
                              {req.description}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-[2px] ${
                                req.isMandatory
                                  ? "bg-[#FEE2E2] text-[#B91C1C]"
                                  : "bg-[#EFF4FE] text-[#2862E0]"
                              }`}
                            >
                              {req.isMandatory ? "Wajib" : "Nilai Tambah"}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-[#5B6475]">
                            Kategori: {req.type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#5B6475]">
                      Tidak ada syarat khusus tambahan di luar kelengkapan
                      legalitas standar.
                    </p>
                  )}
                </div>
              </div>

              {/* Ketentuan Pembayaran Escrow (Spec 7.12) */}
              <div className="rounded-[4px] border border-[#2862E0]/20 bg-[#EFF4FE] p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#2862E0]">
                  <ShieldCheck className="h-5 w-5" />
                  <h2 className="font-heading text-sm font-semibold text-[#0E1422]">
                    Jaminan Pembayaran & Escrow RantaiNaik
                  </h2>
                </div>
                <p className="text-xs text-[#5B6475] leading-relaxed">
                  Pembeli wajib mendanai penuh (100%) ke escrow platform sebelum
                  produksi dimulai. Dana dirilis bertahap:{" "}
                  <strong className="text-[#0E1422]">
                    30% saat bahan baku tiba di workshop
                  </strong>{" "}
                  dan{" "}
                  <strong className="text-[#0E1422]">
                    70% setelah QC akhir lolos
                  </strong>
                  . Komisi platform 5% dipotong secara otomatis dari dana yang
                  dirilis.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TANYA JAWAB (Q&A) */}
          {activeTab === "tanya_jawab" && (
            <div className="space-y-6">
              <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3">
                  <h2 className="font-heading text-base font-semibold text-[#0E1422]">
                    Tanya Jawab Publik (Q&A)
                  </h2>
                  <p className="text-xs text-[#5B6475] mt-0.5">
                    Semua pertanyaan dijawab secara transparan dan identitas
                    penanya dirahasiakan (Anonim) antar sesama UMKM (BR-02,
                    Q-04).
                  </p>
                </div>

                {/* Form Ajukan Pertanyaan */}
                {userRole === "UMKM" && (
                  <form
                    onSubmit={handleAskQuestion}
                    className="p-4 rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] space-y-3"
                  >
                    <label className="block text-xs font-semibold text-[#0E1422]">
                      Ajukan Pertanyaan Baru Seputar Spesifikasi / Bahan:
                    </label>
                    <textarea
                      rows={3}
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Contoh: Apakah toleransi warna kain katun boleh sedikit berbeda dari swatch fisik?"
                      className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2.5 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                    />
                    {questionError && (
                      <p className="text-xs font-semibold text-[#DC2626]">
                        {questionError}
                      </p>
                    )}
                    {questionSuccess && (
                      <p className="text-xs font-semibold text-[#15803D]">
                        Pertanyaan Anda berhasil diajukan dan sedang menunggu
                        tanggapan pembeli.
                      </p>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingQuestion || !newQuestion.trim()}
                        className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2862E0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2858B8] disabled:opacity-50 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {submittingQuestion
                          ? "Mengirim..."
                          : "Kirim Pertanyaan"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Daftar Q&A */}
                <div className="divide-y divide-[#E5E7EB]">
                  {rfq.questions.length > 0 ? (
                    rfq.questions.map((q: SerializedRfqQuestion) => (
                      <div key={q.id} className="py-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[#5B6475]">
                          <span className="font-semibold text-[#0E1422]">
                            Penanya Anonim (Mitra UMKM)
                          </span>
                          <span className="font-mono">
                            {new Date(q.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <p className="text-[#0E1422] font-medium leading-relaxed">
                          {q.question}
                        </p>

                        {q.answer ? (
                          <div className="mt-2 rounded-[2px] bg-[#EFF4FE] p-3 border-l-2 border-[#2862E0] text-[#0E1422] space-y-1">
                            <span className="font-semibold text-[11px] block text-[#2862E0]">
                              Jawaban Pembeli ({rfq.industryOrg?.name}):
                            </span>
                            <p className="text-xs text-[#5B6475]">{q.answer}</p>
                          </div>
                        ) : (
                          <span className="inline-block text-[11px] font-mono text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-[2px]">
                            Menunggu tanggapan pembeli
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-[#5B6475]">
                      Belum ada pertanyaan yang diajukan untuk RFQ ini.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADDENDUM */}
          {activeTab === "addendum" && (
            <div className="space-y-6">
              <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3">
                  <h2 className="font-heading text-base font-semibold text-[#0E1422]">
                    Riwayat Addendum Resmi (R-04)
                  </h2>
                  <p className="text-xs text-[#5B6475] mt-0.5">
                    Perubahan material spesifikasi setelah RFQ terbit hanya sah
                    melalui addendum bernomor resmi.
                  </p>
                </div>

                <div className="space-y-3">
                  {rfq.addendums.length > 0 ? (
                    rfq.addendums.map((add: SerializedRfqAddendum) => (
                      <div
                        key={add.id}
                        className="rounded-[4px] border border-[#E5E7EB] bg-[#FAFBFC] p-4 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                            Addendum #{add.addendumNumber}
                          </span>
                          <span className="font-mono text-[#5B6475]">
                            Diterbitkan:{" "}
                            {new Date(add.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#0E1422]">
                          {add.summary}
                        </p>
                        {Boolean(add.changes) && (
                          <pre className="p-2.5 rounded-[2px] bg-white border border-[#E5E7EB] text-[11px] font-mono text-[#374151] overflow-x-auto">
                            {JSON.stringify(add.changes, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="py-6 text-center text-xs text-[#5B6475]">
                      Belum ada addendum yang diterbitkan untuk RFQ ini.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan (4/12 Sticky) */}
        <div className="lg:col-span-4 p-6 sm:p-8 space-y-6 bg-[#FAFBFC]">
          {/* CTA Penawaran */}
          <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 space-y-4 text-center">
            <div className="space-y-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#5B6475]">
                Status Pengadaan:
              </span>
              <p className="font-heading text-lg font-semibold text-[#0E1422]">
                {rfq.status === "OPEN" ? "Menerima Penawaran" : rfq.status}
              </p>
            </div>

            <button
              disabled
              className="w-full rounded-[4px] bg-[#2862E0] py-2.5 text-xs font-semibold text-white opacity-80 cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              Kirim Penawaran (Tahap 10)
            </button>
            <p className="text-[11px] text-[#5B6475] leading-relaxed">
              Fitur penawaran terstruktur akan aktif di Tahap 10. Saat ini Anda
              dapat meninjau spesifikasi dan mengajukan pertanyaan.
            </p>
          </div>

          {/* Rekam Jejak Pembeli Industri (P7) */}
          <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 space-y-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] block">
              REKAM JEJAK PEMBELI
            </span>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#EFF4FE] text-[#2862E0]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0E1422]">
                    {rfq.industryOrg?.name || "PT Nusantara Logistik"}
                  </h4>
                  <span className="text-[#5B6475]">
                    {rfq.industryOrg?.city || "Jakarta Selatan"}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#E5E7EB] border-t border-[#E5E7EB] pt-2">
                <div className="py-2 flex justify-between">
                  <span className="text-[#5B6475]">Status Verifikasi:</span>
                  <span className="font-medium text-[#15803D] flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#5B6475]">Didanai Penuh:</span>
                  <span className="font-semibold font-mono text-[#0E1422]">
                    100% Escrow
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#5B6475]">Tenggat Terbit:</span>
                  <span className="font-medium font-mono text-[#0E1422]">
                    {formatDeadline(rfq.quotationDeadline)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Kotak Aktivitas RFQ (P7 Upwork Style) */}
          <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 space-y-3 text-xs">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475] block">
              AKTIVITAS RFQ INI
            </span>
            <div className="space-y-2 text-[#5B6475]">
              <div className="flex justify-between">
                <span>Pertanyaan Masuk:</span>
                <span className="font-mono font-semibold text-[#0E1422]">
                  {rfq.questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Addendum Resmi:</span>
                <span className="font-mono font-semibold text-[#0E1422]">
                  {rfq.addendums.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mode Alokasi:</span>
                <span className="font-semibold text-[#0E1422]">
                  {rfq.allocationMode} (Satu Pemenang)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
