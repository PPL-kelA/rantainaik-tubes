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
    <div className="min-h-screen bg-[#F6F7F9] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6B7280]">
          <Link
            href="/umkm"
            className="flex items-center gap-1 hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard UMKM
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827]">Detail RFQ</span>
          <span>/</span>
          <span className="font-mono text-[#1D4ED8]">{rfq.rfqNumber}</span>
        </nav>

        {/* Header RFQ P7 */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#DBEAFE]">
                  {rfq.rfqNumber}
                </span>
                <span className="inline-flex items-center rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#15803D] border border-[#A7F3D0]">
                  {rfq.status === "OPEN"
                    ? "Dibuka untuk Penawaran"
                    : rfq.status}
                </span>
                <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-xs text-[#4B5563]">
                  {rfq.categoryType}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
                {rfq.title}
              </h1>
              <p className="text-xs text-[#6B7280]">
                Diposting oleh{" "}
                <span className="font-semibold text-[#374151]">
                  {rfq.industryOrg?.name || "Perusahaan Industri"}
                </span>{" "}
                · Lokasi pengiriman: {rfq.deliveryLocation}
              </p>
            </div>

            <div className="flex md:flex-col items-end gap-1.5 bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280]">
                Tenggat Penawaran:
              </span>
              <span className="text-sm font-bold text-[#DC2626] flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDeadline(rfq.quotationDeadline)}
              </span>
            </div>
          </div>

          {/* Strip 4 Fakta Kunci (P7) */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg bg-[#F9FAFB] p-4 border border-[#E5E7EB] text-xs">
            <div className="space-y-1">
              <span className="text-[#6B7280] flex items-center gap-1">
                <Package className="h-3.5 w-3.5 text-[#1D4ED8]" /> Total Pesanan
              </span>
              <p className="font-bold text-[#111827] text-sm">
                {totalQty} pcs{" "}
                <span className="text-[11px] font-normal text-[#6B7280]">
                  ({rfq.items.length} item)
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#6B7280] flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#1D4ED8]" /> Target Kirim
              </span>
              <p className="font-bold text-[#111827] text-sm">
                {formatDeadline(rfq.targetDeliveryDate)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#6B7280] flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-[#1D4ED8]" /> Sampel
              </span>
              <p className="font-bold text-[#111827] text-sm">
                {rfq.needSample
                  ? `Ya (${rfq.sampleCount || 1} pcs/item, ${rfq.sampleCostBearer || "Dikreditkan"})`
                  : "Tidak Perlu Sampel"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[#6B7280] flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#1D4ED8]" /> Batas Q&A
              </span>
              <p className="font-bold text-[#111827] text-sm">
                {rfq.qaDeadline
                  ? formatDeadline(rfq.qaDeadline)
                  : "Sebelum tenggat"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Garis Bawah (P7) */}
        <div className="border-b border-[#E5E7EB] bg-white rounded-t-xl px-6 pt-3 flex items-center gap-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("spesifikasi")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "spesifikasi"
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <FileText className="h-4 w-4" />
            Spesifikasi & Rincian
          </button>

          <button
            onClick={() => setActiveTab("tanya_jawab")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "tanya_jawab"
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Tanya Jawab
            <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-bold text-[#1D4ED8]">
              {rfq.questions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("addendum")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "addendum"
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Addendum Resmi
            <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-bold text-[#1D4ED8]">
              {rfq.addendums.length}
            </span>
          </button>
        </div>

        {/* Konten Utama 2 Kolom (Konten 2/3 & Panel Kanan 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri (2/3) */}
          <div className="lg:col-span-8 space-y-6">
            {/* TAB 1: SPESIFIKASI */}
            {activeTab === "spesifikasi" && (
              <div className="space-y-6">
                {/* Ringkasan Konteks */}
                {rfq.contextDescription && (
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Konteks & Kebutuhan Pengadaan
                    </h2>
                    <p className="text-sm text-[#374151] leading-relaxed">
                      {rfq.contextDescription}
                    </p>
                  </div>
                )}

                {/* Rincian Item RFQ */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                    <h2 className="text-base font-bold text-[#111827]">
                      Daftar Item & Rincian Ukuran (R-02)
                    </h2>
                    <span className="text-xs text-[#6B7280]">
                      {rfq.items.length} Item Tekstil
                    </span>
                  </div>

                  <div className="space-y-6">
                    {rfq.items.map((item: SerializedRfqItem, idx: number) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-[#1D4ED8]">
                              Item #{idx + 1}
                            </span>
                            <h3 className="text-base font-bold text-[#111827]">
                              {item.name}
                            </h3>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#111827] border border-[#E5E7EB]">
                            Total: {item.totalQuantity} pcs
                          </span>
                        </div>

                        {/* Rincian Spesifikasi Item */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-md border border-[#E5E7EB]">
                          <div>
                            <span className="text-[#6B7280] block">
                              Jenis Kain & Bahan:
                            </span>
                            <span className="font-semibold text-[#111827]">
                              {item.fabricType}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#6B7280] block">Warna:</span>
                            <span className="font-semibold text-[#111827]">
                              {item.color}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#6B7280] block">
                              Penyediaan Bahan:
                            </span>
                            <span className="font-semibold text-[#111827]">
                              {item.materialProvidedByBuyer
                                ? "Disediakan Pembeli (CMT)"
                                : "Disediakan UMKM (Full Package)"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#6B7280] block">
                              Dekorasi:
                            </span>
                            <span className="font-semibold text-[#111827]">
                              {item.decorationType || "Tidak Ada"}
                              {item.decorationPlacement
                                ? ` (${item.decorationPlacement})`
                                : ""}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#6B7280] block">
                              Standar Mutu & Toleransi:
                            </span>
                            <span className="font-semibold text-[#111827]">
                              {item.dimensionTolerance || "±1 cm"} ·{" "}
                              {item.aqlStandard || "AQL 2.5"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#6B7280] block">
                              Uji Lab Kain:
                            </span>
                            <span className="font-semibold text-[#111827]">
                              {item.needLabTest
                                ? "Wajib Disertakan"
                                : "Tidak Diminta"}
                            </span>
                          </div>
                          {item.constructionNotes && (
                            <div className="sm:col-span-2 pt-1 border-t border-[#F3F4F6]">
                              <span className="text-[#6B7280] block">
                                Catatan Konstruksi:
                              </span>
                              <p className="text-[#374151] italic mt-0.5">
                                {item.constructionNotes}
                              </p>
                            </div>
                          )}
                          {item.labelPackingNotes && (
                            <div className="sm:col-span-2 pt-1 border-t border-[#F3F4F6]">
                              <span className="text-[#6B7280] block">
                                Label & Packing:
                              </span>
                              <p className="text-[#374151] mt-0.5">
                                {item.labelPackingNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Tabel Rincian Ukuran (R-02) */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-[#374151]">
                            Rincian Ukuran (Size Breakdown):
                          </span>
                          <div className="overflow-x-auto rounded-md border border-[#E5E7EB] bg-white">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-[#F3F4F6] text-[#4B5563] font-semibold border-b border-[#E5E7EB]">
                                <tr>
                                  {item.sizes.map(
                                    (s: SerializedRfqItemSize) => (
                                      <th
                                        key={s.id}
                                        className="py-2 px-3 text-center"
                                      >
                                        {s.size}
                                      </th>
                                    )
                                  )}
                                  <th className="py-2 px-3 text-center font-bold text-[#111827] bg-[#E5E7EB]">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  {item.sizes.map(
                                    (s: SerializedRfqItemSize) => (
                                      <td
                                        key={s.id}
                                        className="py-2 px-3 text-center font-medium"
                                      >
                                        {s.quantity} pcs
                                      </td>
                                    )
                                  )}
                                  <td className="py-2 px-3 text-center font-bold text-[#1D4ED8] bg-[#F9FAFB]">
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
                            <FileText className="h-4 w-4 text-[#1D4ED8]" />
                            <a
                              href={item.referencePhotoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-[#1D4ED8] hover:underline flex items-center gap-1"
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
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-[#111827]">
                    Persyaratan Kemitraan RFQ
                  </h2>
                  <div className="space-y-2.5">
                    {rfq.requirements && rfq.requirements.length > 0 ? (
                      rfq.requirements.map((req: SerializedRfqRequirement) => (
                        <div
                          key={req.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] text-xs"
                        >
                          <CheckCircle2
                            className={`h-4 w-4 mt-0.5 ${
                              req.isMandatory
                                ? "text-[#15803D]"
                                : "text-[#1D4ED8]"
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#111827]">
                                {req.description}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  req.isMandatory
                                    ? "bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]"
                                    : "bg-[#EFF6FF] text-[#1D4ED8]"
                                }`}
                              >
                                {req.isMandatory ? "Wajib" : "Nilai Tambah"}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#6B7280]">
                              Kategori: {req.type}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#6B7280]">
                        Tidak ada syarat khusus tambahan di luar kelengkapan
                        legalitas standar.
                      </p>
                    )}
                  </div>
                </div>

                {/* Ketentuan Pembayaran Escrow (Spec 7.12) */}
                <div className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-6 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-[#1E40AF]">
                    <ShieldCheck className="h-5 w-5" />
                    <h2 className="text-sm font-bold">
                      Jaminan Pembayaran & Escrow RantaiNaik
                    </h2>
                  </div>
                  <p className="text-xs text-[#1E3A8A] leading-relaxed">
                    Pembeli wajib mendanai penuh (100%) ke escrow platform
                    sebelum produksi dimulai. Dana dirilis bertahap:{" "}
                    <strong>30% saat bahan baku tiba di workshop</strong> dan{" "}
                    <strong>70% setelah QC akhir lolos</strong>. Komisi platform
                    5% dipotong secara otomatis dari dana yang dirilis.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: TANYA JAWAB (Q&A) */}
            {activeTab === "tanya_jawab" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#111827]">
                        Tanya Jawab Publik (Q&A)
                      </h2>
                      <p className="text-xs text-[#6B7280]">
                        Semua pertanyaan dijawab secara transparan dan identitas
                        penanya dirahasiakan (Anonim) antar sesama UMKM (BR-02,
                        Q-04).
                      </p>
                    </div>
                  </div>

                  {/* Form Ajukan Pertanyaan */}
                  {userRole === "UMKM" && (
                    <form
                      onSubmit={handleAskQuestion}
                      className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-3"
                    >
                      <label className="block text-xs font-semibold text-[#374151]">
                        Ajukan Pertanyaan Baru Seputar Spesifikasi / Bahan:
                      </label>
                      <textarea
                        rows={3}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Contoh: Apakah toleransi warna kain katun boleh sedikit berbeda dari swatch fisik?"
                        className="w-full rounded-md border border-[#D1D5DB] p-2.5 text-xs focus:border-[#1D4ED8] focus:outline-hidden"
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
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
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
                          <div className="flex items-center justify-between text-[#6B7280]">
                            <span className="font-semibold text-[#4B5563]">
                              Penanya Anonim (Mitra UMKM)
                            </span>
                            <span>
                              {new Date(q.createdAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                          <p className="text-[#111827] font-medium leading-relaxed">
                            {q.question}
                          </p>

                          {q.answer ? (
                            <div className="mt-2 rounded-md bg-[#EFF6FF] p-3 border-l-4 border-[#1D4ED8] text-[#1E40AF] space-y-1">
                              <span className="font-bold text-[11px] block">
                                Jawaban Pembeli ({rfq.industryOrg?.name}):
                              </span>
                              <p className="text-xs">{q.answer}</p>
                            </div>
                          ) : (
                            <span className="inline-block text-[11px] text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 rounded-md">
                              Menunggu jawaban industri
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="py-6 text-center text-xs text-[#6B7280]">
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
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4">
                  <div className="border-b border-[#E5E7EB] pb-3">
                    <h2 className="text-base font-bold text-[#111827]">
                      Riwayat Addendum Resmi (R-04)
                    </h2>
                    <p className="text-xs text-[#6B7280]">
                      Perubahan material spesifikasi setelah RFQ terbit hanya
                      sah melalui addendum bernomor resmi.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {rfq.addendums.length > 0 ? (
                      rfq.addendums.map((add: SerializedRfqAddendum) => (
                        <div
                          key={add.id}
                          className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#DBEAFE]">
                              Addendum #{add.addendumNumber}
                            </span>
                            <span className="text-[#6B7280]">
                              Diterbitkan:{" "}
                              {new Date(add.createdAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-[#111827]">
                            {add.summary}
                          </p>
                          {Boolean(add.changes) && (
                            <pre className="p-2.5 rounded bg-white border border-[#E5E7EB] text-[11px] font-mono text-[#374151] overflow-x-auto">
                              {JSON.stringify(add.changes, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="py-6 text-center text-xs text-[#6B7280]">
                        Belum ada addendum yang diterbitkan untuk RFQ ini.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan (1/3 Sticky) */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            {/* CTA Penawaran */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs space-y-4 text-center">
              <div className="space-y-1">
                <span className="text-xs text-[#6B7280]">
                  Status Pengadaan:
                </span>
                <p className="text-lg font-bold text-[#111827]">
                  {rfq.status === "OPEN" ? "Menerima Penawaran" : rfq.status}
                </p>
              </div>

              <button
                disabled
                className="w-full rounded-lg bg-[#1D4ED8] py-2.5 text-xs font-semibold text-white shadow-xs opacity-80 cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                Kirim Penawaran (Tahap 10)
              </button>
              <p className="text-[11px] text-[#6B7280]">
                Fitur penawaran terstruktur akan aktif di Tahap 10. Saat ini
                Anda dapat meninjau spesifikasi dan mengajukan pertanyaan.
              </p>
            </div>

            {/* Rekam Jejak Pembeli Industri (P7) */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Rekam Jejak Pembeli
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827]">
                      {rfq.industryOrg?.name || "PT Nusantara Logistik"}
                    </h4>
                    <span className="text-[#6B7280]">
                      {rfq.industryOrg?.city || "Jakarta Selatan"}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-[#F3F4F6] border-t border-[#F3F4F6] pt-2">
                  <div className="py-2 flex justify-between">
                    <span className="text-[#6B7280]">Status Verifikasi:</span>
                    <span className="font-semibold text-[#15803D] flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#6B7280]">Didanai Penuh:</span>
                    <span className="font-semibold text-[#111827]">
                      100% Escrow
                    </span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-[#6B7280]">Tenggat Terbit:</span>
                    <span className="font-semibold text-[#111827]">
                      {formatDeadline(rfq.quotationDeadline)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kotak Aktivitas RFQ (P7 Upwork Style) */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs space-y-3 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Aktivitas RFQ Ini
              </h3>
              <div className="space-y-2 text-[#4B5563]">
                <div className="flex justify-between">
                  <span>Pertanyaan Masuk:</span>
                  <span className="font-semibold text-[#111827]">
                    {rfq.questions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Addendum Resmi:</span>
                  <span className="font-semibold text-[#111827]">
                    {rfq.addendums.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mode Alokasi:</span>
                  <span className="font-semibold text-[#111827]">
                    {rfq.allocationMode} (Satu Pemenang)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
