"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  RotateCcw,
  X,
  Layers,
  Award,
} from "lucide-react";
import Link from "next/link";
import { recalculateReadinessAction } from "@/modules/readiness/actions";
import { ReadinessResult, RecommendedStep } from "@/modules/readiness/rules";

interface ReadinessClientProps {
  initialData: {
    snapshot: ReadinessResult;
    recommendations: RecommendedStep[];
    calculatedAt: string;
  };
}

export function ReadinessClient({ initialData }: ReadinessClientProps) {
  const [data, setData] = useState(initialData);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      legalitas: true, // open first by default
    }
  );
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    setMsg(null);
    const res = await recalculateReadinessAction();
    setRecalculating(false);
    if (res.success && res.data) {
      setData(res.data);
      setMsg("Skor kesiapan berhasil dihitung ulang secara real-time.");
    } else {
      setMsg(res.error || "Gagal menghitung ulang skor.");
    }
  };

  const snapshot = data.snapshot;
  const componentsList = [
    snapshot.components.legalitas,
    snapshot.components.kapasitas,
    snapshot.components.mutu,
    snapshot.components.rekamJejak,
    snapshot.components.administrasi,
    snapshot.components.finansial,
  ];

  // Helper date formatted
  const formattedDate = new Date(data.calculatedAt).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Alert */}
      {msg && (
        <div className="flex items-center justify-between rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] p-3 text-xs text-[#1D4ED8] font-semibold">
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} className="hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. Header & Skor Utama & Bilah Segmen Tier (P5)          */}
      {/* ======================================================== */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
                Industrial Readiness Score (Spec 7.7)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Skor Kesiapan Industri
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Dihitung terakhir: {formattedDate} WIB
            </p>
          </div>

          <button
            type="button"
            disabled={recalculating}
            onClick={handleRecalculate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            <RotateCcw
              className={`h-3.5 w-3.5 text-[#1D4ED8] ${recalculating ? "animate-spin" : ""}`}
            />
            Hitung Ulang Skor
          </button>
        </div>

        {/* Skor Besar & Pil Tier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-[#111827] font-mono">
                {snapshot.totalScore}
              </span>
              <span className="text-xl font-bold text-[#6B7280]">/ 100</span>
            </div>
            <p className="text-xs text-[#4B5563] mt-1 max-w-md leading-relaxed">
              {snapshot.tierDescription}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1D4ED8] px-3.5 py-1 text-xs font-bold text-white shadow-xs">
              <Award className="h-4 w-4" />
              Tier: {snapshot.tier}
            </span>
            <button
              type="button"
              onClick={() => setShowHowItWorksModal(true)}
              className="text-[11px] font-semibold text-[#1D4ED8] hover:underline flex items-center gap-1 mt-1"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Cara skor dihitung
            </button>
          </div>
        </div>

        {/* Bilah Tersegmen 4 Tier (0-39, 40-59, 60-79, 80-100) */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[11px] font-semibold text-[#6B7280]">
            <span>Tahap Awal (0-39)</span>
            <span>Berkembang (40-59)</span>
            <span>Siap Kemitraan (60-79)</span>
            <span>Siap Industri (80-100)</span>
          </div>

          {/* 4-Segmented Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 h-3 w-full rounded-full bg-[#F3F4F6] p-0.5">
            {/* Segment 1: Tahap Awal */}
            <div className="h-full rounded-l-full bg-[#E5E7EB] relative overflow-hidden">
              {snapshot.totalScore > 0 && (
                <div
                  className="h-full bg-[#94A3B8]"
                  style={{
                    width: `${Math.min(100, (snapshot.totalScore / 39) * 100)}%`,
                  }}
                />
              )}
            </div>
            {/* Segment 2: Berkembang */}
            <div className="h-full bg-[#E5E7EB] relative overflow-hidden">
              {snapshot.totalScore >= 40 && (
                <div
                  className="h-full bg-[#F59E0B]"
                  style={{
                    width: `${Math.min(
                      100,
                      ((snapshot.totalScore - 40) / 19) * 100
                    )}%`,
                  }}
                />
              )}
            </div>
            {/* Segment 3: Siap Kemitraan */}
            <div className="h-full bg-[#E5E7EB] relative overflow-hidden">
              {snapshot.totalScore >= 60 && (
                <div
                  className="h-full bg-[#1D4ED8]"
                  style={{
                    width: `${Math.min(
                      100,
                      ((snapshot.totalScore - 60) / 19) * 100
                    )}%`,
                  }}
                />
              )}
            </div>
            {/* Segment 4: Siap Industri */}
            <div className="h-full rounded-r-full bg-[#E5E7EB] relative overflow-hidden">
              {snapshot.totalScore >= 80 && (
                <div
                  className="h-full bg-[#15803D]"
                  style={{
                    width: `${Math.min(
                      100,
                      ((snapshot.totalScore - 80) / 20) * 100
                    )}%`,
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-[#9CA3AF] font-mono px-0.5">
            <span>0</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. Bagian "3 Langkah Tercepat Naik Tier" (Spec 7.8, P5) */}
      {/* ======================================================== */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#E5E7EB] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#1D4ED8]" />3 Langkah Tercepat
              Naik Tier
            </h2>
            <p className="text-[11px] text-[#6B7280]">
              Rekomendasi tindakan cerdas berdasarkan rasio tambahan poin
              tertinggi dan kemudahan pengerjaan.
            </p>
          </div>
          <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[10px] font-bold text-[#1D4ED8] border border-[#DBEAFE]">
            Gap Analysis
          </span>
        </div>

        {data.recommendations.length === 0 ? (
          <div className="rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] p-4 text-center">
            <CheckCircle2 className="h-6 w-6 text-[#15803D] mx-auto mb-1" />
            <p className="text-xs font-bold text-[#15803D]">
              Profil dan Kapabilitas Anda Sudah Sangat Lengkap!
            </p>
            <p className="text-[11px] text-[#166534] mt-0.5">
              Seluruh kriteria utama telah dipenuhi dengan baik. Pertahankan
              ketepatan waktu pengiriman order.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recommendations.map((step, idx) => (
              <div
                key={step.id}
                className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#1D4ED8] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-full bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-[#111827]">
                      {step.text}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.2 rounded border border-[#BBF7D0]">
                        +{step.points} Poin
                      </span>
                      <span className="text-[10px] text-[#4B5563]">
                        Tingkat kesulitan:{" "}
                        <strong>{step.difficulty.toLowerCase()}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/umkm/profil"
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors shrink-0"
                >
                  Kerjakan
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. Bagian "Rincian Skor" (6 Baris Accordion A-F)         */}
      {/* ======================================================== */}
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#E5E7EB] pb-3">
          <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#1D4ED8]" />
            Rincian Skor Per Komponen Penilaian
          </h2>
          <p className="text-[11px] text-[#6B7280]">
            Buka tiap komponen untuk melihat transparansi penilaian per item,
            status dokumen, dan bobot pilar.
          </p>
        </div>

        <div className="space-y-3">
          {componentsList.map((comp) => {
            const compKey = comp.name.toLowerCase().split(" ")[0];
            const isOpen = Boolean(openAccordions[compKey]);
            const percent = Math.min(
              100,
              Math.round((comp.score / comp.maxScore) * 100)
            );

            return (
              <div
                key={comp.code}
                className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden transition-all"
              >
                {/* Accordion Header Row */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(compKey)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] flex items-center gap-2">
                        <span className="h-5 w-5 rounded bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-bold flex items-center justify-center">
                          {comp.code}
                        </span>
                        {comp.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#111827]">
                        {comp.score} / {comp.maxScore}
                      </span>
                    </div>

                    {/* Thin progress bar */}
                    <div className="h-1.5 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                      <div
                        className="h-full bg-[#1D4ED8] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {comp.note && (
                      <p className="text-[10px] text-[#B45309] font-medium italic">
                        * {comp.note}
                      </p>
                    )}
                  </div>

                  <div className="text-[#9CA3AF] pl-2">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-2.5">
                    {comp.code === "D" && (
                      <div className="rounded bg-[#EFF6FF] p-2.5 text-[11px] text-[#1E40AF] border border-[#DBEAFE] mb-3">
                        ℹ️ <strong>Catatan Rekam Jejak:</strong> Akun UMKM baru
                        memakai nilai awal 50%. Mundur sepihak setelah penawaran
                        diterima dan sengketa yang merugikan UMKM akan
                        mengurangi poin.
                      </div>
                    )}

                    <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-lg bg-white">
                      {comp.items.map((item) => (
                        <div
                          key={item.key}
                          className="p-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-semibold text-[#111827]">
                              {item.label}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.status === "VERIFIED" && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#15803D]">
                                  <ShieldCheck className="h-3 w-3" />{" "}
                                  Terverifikasi (Penuh)
                                </span>
                              )}
                              {item.status === "DECLARED" && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#B45309]">
                                  <Clock className="h-3 w-3" /> Dinyatakan
                                  sendiri (Bernilai 50%)
                                </span>
                              )}
                              {item.status === "EXPIRED" && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#B91C1C]">
                                  <AlertCircle className="h-3 w-3" /> Dokumen
                                  Kedaluwarsa
                                </span>
                              )}
                              {item.status === "UNMET" && (
                                <span className="text-[10px] text-[#9CA3AF]">
                                  Belum dilengkapi
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-bold text-xs text-[#111827]">
                              {item.score} / {item.maxScore}
                            </span>
                            <span className="text-[10px] text-[#6B7280] block">
                              poin
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. Modal Panduan "Cara Skor Dihitung" (P5)               */}
      {/* ======================================================== */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2 text-[#111827]">
                <HelpCircle className="h-5 w-5 text-[#1D4ED8]" />
                <h3 className="text-sm font-bold">
                  Cara Industrial Readiness Score Dihitung
                </h3>
              </div>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-[#4B5563] space-y-3 leading-relaxed">
              <p>
                <strong>Industrial Readiness Score</strong> adalah indeks
                kesiapan operasional konveksi (0-100) yang transparan,
                rule-based, dan tanpa bias subyektif.
              </p>
              <div className="space-y-1.5 pl-2 border-l-2 border-[#1D4ED8]">
                <p>
                  <strong>1. Verifikasi Dokumen:</strong> Berkas yang telah
                  disetujui admin bernilai penuh (100%).
                </p>
                <p>
                  <strong>2. Data Dinyatakan Sendiri:</strong> Informasi tanpa
                  bukti dokumen resmi bernilai 50% dari poin maksimal.
                </p>
                <p>
                  <strong>3. Dokumen Kedaluwarsa:</strong> Tidak dihitung (0
                  poin) untuk menjaga kepatuhan hukum industri.
                </p>
                <p>
                  <strong>4. Akun Baru Tanpa Riwayat:</strong> Diberikan nilai
                  netral 50% pada komponen Rekam Jejak agar memiliki kesempatan
                  adil bersaing di tender RFQ awal.
                </p>
              </div>
              <p className="text-[11px] text-[#6B7280]">
                Tingkatkan skor Anda dengan melengkapi NIB, SOP QC, hasil uji
                lab kain, dan dokumentasi mesin di profil usaha.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowHowItWorksModal(false)}
                className="rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
