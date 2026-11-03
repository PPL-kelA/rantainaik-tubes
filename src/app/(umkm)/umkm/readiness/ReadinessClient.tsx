"use client";

import { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  X,
  Layers,
  Award,
} from "lucide-react";
import { recalculateReadinessAction } from "@/modules/readiness/actions";
import Link from "next/link";
import { StatusBadge, Button } from "@/components/ui";
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
  const [recalculating, setRecalculating] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // State untuk accordion tiap komponen
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      legalitas: true,
    }
  );

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  async function handleRecalculate() {
    setRecalculating(true);
    setMsg(null);
    try {
      const res = await recalculateReadinessAction();
      if (res.success && res.data) {
        setData(res.data);
        setMsg(
          "Skor kesiapan industri berhasil dihitung ulang secara real-time."
        );
      } else {
        setMsg(res.error || "Gagal memperbarui skor.");
      }
    } catch {
      setMsg("Terjadi kesalahan jaringan.");
    } finally {
      setRecalculating(false);
    }
  }

  const snapshot = data.snapshot;
  const componentsList = [
    snapshot.components.legalitas,
    snapshot.components.kapasitas,
    snapshot.components.mutu,
    snapshot.components.rekamJejak,
    snapshot.components.administrasi,
    snapshot.components.finansial,
  ];

  const formattedDate = new Date(data.calculatedAt).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] bg-white">
      {/* Toast Alert Feedback */}
      {msg && (
        <div className="flex items-center justify-between p-4 text-xs font-semibold bg-[#EFF4FE] text-[#2862E0] border-b border-[#E5E7EB]">
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} className="hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. Header & Skor Utama & Bilah Segmen Tier (P5)          */}
      {/* ======================================================== */}
      <section className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#5B6475]">
                Industrial Readiness Score
              </span>
            </div>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-[#0E1422]">
              Ringkasan Skor & Kualifikasi Kemitraan
            </h2>
            <p className="text-xs text-[#5B6475] mt-0.5">
              Dihitung terakhir: {formattedDate} WIB
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={recalculating}
            onClick={handleRecalculate}
            className="flex items-center gap-1.5 text-xs rounded-[4px]"
          >
            <RotateCcw
              className={`h-3.5 w-3.5 text-[#2862E0] ${recalculating ? "animate-spin" : ""}`}
            />
            Hitung Ulang Skor
          </Button>
        </div>

        {/* Skor Besar & Badge Tier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAFBFC] p-6 border border-[#E5E7EB] rounded-[4px]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight text-[#0E1422] font-mono tabular-nums">
                {snapshot.totalScore}
              </span>
              <span className="text-xl font-semibold text-[#5B6475]">
                / 100
              </span>
            </div>
            <p className="text-xs text-[#5B6475] mt-1 max-w-md leading-relaxed">
              {snapshot.tierDescription}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5">
            <StatusBadge
              variant="info"
              className="px-3.5 py-1 text-xs font-semibold rounded-[2px]"
            >
              <Award className="h-4 w-4" />
              Tier: {snapshot.tier}
            </StatusBadge>
            <button
              type="button"
              onClick={() => setShowHowItWorksModal(true)}
              className="text-[11px] font-semibold text-[#2862E0] hover:underline flex items-center gap-1 mt-1"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Cara skor dihitung
            </button>
          </div>
        </div>

        {/* Bilah Tersegmen 4 Tier (0-39, 40-59, 60-79, 80-100) - Geometris Tanpa Pill */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[11px] font-semibold text-[#5B6475] font-mono">
            <span>Tahap Awal (0-39)</span>
            <span>Berkembang (40-59)</span>
            <span>Siap Kemitraan (60-79)</span>
            <span>Siap Industri (80-100)</span>
          </div>

          {/* 4-Segmented Progress Bar - Strict Square Corners rounded-[2px] */}
          <div className="grid grid-cols-4 gap-1.5 h-3 w-full rounded-[2px] bg-[#E5E7EB] p-0.5">
            {/* Segment 1: Tahap Awal */}
            <div className="h-full rounded-[1px] bg-white relative overflow-hidden">
              {snapshot.totalScore > 0 && (
                <div
                  className="h-full bg-[#8B93A1]"
                  style={{
                    width: `${Math.min(100, (snapshot.totalScore / 39) * 100)}%`,
                  }}
                />
              )}
            </div>
            {/* Segment 2: Berkembang */}
            <div className="h-full rounded-[1px] bg-white relative overflow-hidden">
              {snapshot.totalScore >= 40 && (
                <div
                  className="h-full bg-[#B45309]"
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
            <div className="h-full rounded-[1px] bg-white relative overflow-hidden">
              {snapshot.totalScore >= 60 && (
                <div
                  className="h-full bg-[#2862E0]"
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
            <div className="h-full rounded-[1px] bg-white relative overflow-hidden">
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

          <div className="flex justify-between text-[10px] text-[#8B93A1] font-mono px-0.5">
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
      <section className="space-y-0">
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-semibold text-[#0E1422] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#2862E0]" />3 Langkah Tercepat
              Naik Tier
            </h3>
            <p className="text-xs text-[#5B6475] mt-0.5">
              Rekomendasi tindakan cerdas berdasarkan rasio tambahan poin
              tertinggi dan kemudahan pengerjaan.
            </p>
          </div>
          <StatusBadge variant="info">Gap Analysis</StatusBadge>
        </div>

        {data.recommendations.length === 0 ? (
          <div className="p-6 bg-[#FAFBFC] text-center">
            <CheckCircle2 className="h-6 w-6 text-[#15803D] mx-auto mb-1" />
            <p className="text-xs font-semibold text-[#15803D]">
              Profil dan Kapabilitas Anda Sudah Sangat Lengkap!
            </p>
            <p className="text-[11px] text-[#5B6475] mt-0.5">
              Seluruh kriteria utama telah dipenuhi dengan baik. Pertahankan
              ketepatan waktu pengiriman order.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {data.recommendations.map((step, idx) => (
              <div
                key={step.id}
                className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFBFC] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-[2px] bg-[#2862E0] text-white font-bold font-mono text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-[#0E1422]">
                      {step.text}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge variant="success">
                        +{step.points} Poin
                      </StatusBadge>
                      <span className="text-[11px] text-[#5B6475]">
                        Tingkat kesulitan:{" "}
                        <strong className="text-[#0E1422]">
                          {step.difficulty.toLowerCase()}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <Button variant="default" size="sm" asChild>
                  <Link
                    href="/umkm/profil"
                    className="flex items-center justify-center gap-1 text-xs font-semibold rounded-[4px] shrink-0"
                  >
                    Kerjakan
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. Bagian "Rincian Skor" (6 Baris Accordion A-F)         */}
      {/* ======================================================== */}
      <section className="space-y-0">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="font-heading text-base font-semibold text-[#0E1422] flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#2862E0]" />
            Rincian Skor Per Komponen Penilaian
          </h3>
          <p className="text-xs text-[#5B6475] mt-0.5">
            Buka tiap komponen untuk melihat transparansi penilaian per item,
            status dokumen, dan bobot pilar.
          </p>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {componentsList.map((comp) => {
            const compKey = comp.name.toLowerCase().split(" ")[0];
            const isOpen = Boolean(openAccordions[compKey]);
            const percent = Math.min(
              100,
              Math.round((comp.score / comp.maxScore) * 100)
            );

            return (
              <div key={comp.code} className="bg-white">
                {/* Accordion Header Row - px-6 py-5 */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(compKey)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#FAFBFC] transition-colors"
                >
                  <div className="space-y-1.5 flex-1 pr-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0E1422] flex items-center gap-2">
                        <span className="h-5 w-5 rounded-[2px] bg-[#EFF4FE] text-[#2862E0] font-mono text-[11px] font-bold flex items-center justify-center">
                          {comp.code}
                        </span>
                        {comp.name}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#0E1422] tabular-nums">
                        {comp.score} / {comp.maxScore}
                      </span>
                    </div>

                    {/* Thin progress bar - rounded-[2px] */}
                    <div className="h-1.5 w-full bg-[#E5E7EB] rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-[#2862E0] rounded-[2px] transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {comp.note && (
                      <p className="text-[10px] text-[#B45309] font-medium italic">
                        * {comp.note}
                      </p>
                    )}
                  </div>

                  <div className="text-[#8B93A1]">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="border-t border-[#E5E7EB] bg-[#FAFBFC] px-6 py-4 space-y-3">
                    {comp.code === "D" && (
                      <div className="rounded-[2px] bg-[#EFF4FE] p-3 text-[11px] text-[#0E1422] border-l-2 border-[#2862E0] mb-2">
                        ℹ️ <strong>Catatan Rekam Jejak:</strong> Akun UMKM baru
                        memakai nilai awal 50%. Mundur sepihak setelah penawaran
                        diterima dan sengketa yang merugikan UMKM akan
                        mengurangi poin.
                      </div>
                    )}

                    <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-[4px] bg-white">
                      {comp.items.map((item) => (
                        <div
                          key={item.key}
                          className="px-4 py-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-semibold text-[#0E1422]">
                              {item.label}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {item.status === "VERIFIED" && (
                                <StatusBadge status="VERIFIED">
                                  <ShieldCheck className="h-3 w-3" />
                                  Terverifikasi (Penuh)
                                </StatusBadge>
                              )}
                              {item.status === "DECLARED" && (
                                <StatusBadge status="PENDING">
                                  <Clock className="h-3 w-3" />
                                  Dinyatakan sendiri (Bernilai 50%)
                                </StatusBadge>
                              )}
                              {item.status === "EXPIRED" && (
                                <StatusBadge status="EXPIRED">
                                  <AlertCircle className="h-3 w-3" />
                                  Dokumen Kedaluwarsa
                                </StatusBadge>
                              )}
                              {item.status === "UNMET" && (
                                <span className="text-[10px] text-[#8B93A1] font-mono">
                                  Belum dilengkapi
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-semibold text-xs text-[#0E1422] tabular-nums">
                              {item.score} / {item.maxScore}
                            </span>
                            <span className="text-[10px] text-[#5B6475] block font-mono">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-[4px] bg-white p-6 shadow-[0_4px_16px_rgba(14,20,34,0.08)] border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2 text-[#0E1422]">
                <HelpCircle className="h-5 w-5 text-[#2862E0]" />
                <h3 className="text-sm font-semibold">
                  Cara Industrial Readiness Score Dihitung
                </h3>
              </div>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="text-[#5B6475] hover:text-[#0E1422]"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-[#5B6475] space-y-3 leading-relaxed">
              <p>
                <strong className="text-[#0E1422]">
                  Industrial Readiness Score
                </strong>{" "}
                adalah indeks kesiapan operasional konveksi (0-100) yang
                transparan, rule-based, dan tanpa bias subyektif.
              </p>
              <div className="space-y-1.5 pl-3 border-l-2 border-[#2862E0] bg-[#FAFBFC] p-3 rounded-[2px]">
                <p>
                  <strong className="text-[#0E1422]">
                    1. Verifikasi Dokumen:
                  </strong>{" "}
                  Berkas yang telah disetujui admin bernilai penuh (100%).
                </p>
                <p>
                  <strong className="text-[#0E1422]">
                    2. Data Dinyatakan Sendiri:
                  </strong>{" "}
                  Informasi tanpa bukti dokumen resmi bernilai 50% dari poin
                  maksimal.
                </p>
                <p>
                  <strong className="text-[#0E1422]">
                    3. Dokumen Kedaluwarsa:
                  </strong>{" "}
                  Tidak dihitung (0 poin) untuk menjaga kepatuhan hukum
                  industri.
                </p>
                <p>
                  <strong className="text-[#0E1422]">
                    4. Akun Baru Tanpa Riwayat:
                  </strong>{" "}
                  Diberikan nilai netral 50% pada komponen Rekam Jejak agar
                  memiliki kesempatan adil bersaing di tender RFQ awal.
                </p>
              </div>
              <p className="text-[11px] text-[#5B6475]">
                Tingkatkan skor Anda dengan melengkapi NIB, SOP QC, hasil uji
                lab kain, dan dokumentasi mesin di profil usaha.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="default"
                onClick={() => setShowHowItWorksModal(false)}
                className="rounded-[4px]"
              >
                Saya Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
