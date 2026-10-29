"use client";

import { useState } from "react";
import {
  Sliders,
  Settings2,
  FileCheck2,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Loader2,
  Plus,
  Trash2,
  Building,
} from "lucide-react";
import {
  updateReadinessWeightsAction,
  updateMatchingWeightsAction,
  updatePlatformParametersAction,
  resetReadinessWeightsAction,
  resetMatchingWeightsAction,
  resetPlatformParametersAction,
  createCategoryAction,
  createProductionServiceAction,
  createCertificationAction,
  createRecommendationRuleAction,
  deleteRecommendationRuleAction,
} from "@/modules/admin/actions";
import {
  ReadinessWeights,
  MatchingWeights,
  PlatformParams,
} from "@/modules/admin/rules";

interface AdminConfigPanelProps {
  initialScoring: {
    readiness: ReadinessWeights;
    matching: MatchingWeights;
  };
  initialPlatform: {
    params: PlatformParams;
    compensationMatrix: Array<{
      stage: string;
      label: string;
      buyerRefundRule: string;
      umkmCompensationRule: string;
    }>;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    children: Array<{ id: string; name: string; slug: string }>;
  }>;
  services: Array<{ id: string; name: string; slug: string }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string | null;
    description: string | null;
  }>;
  rules: Array<{
    id: string;
    component: string;
    condition: string;
    text: string;
    points: number;
    difficulty: string;
  }>;
}

export function AdminConfigPanel({
  initialScoring,
  initialPlatform,
  categories,
  services,
  certifications,
  rules,
}: AdminConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<
    | "readiness"
    | "matching"
    | "platform"
    | "recommendations"
    | "categories"
    | "certifications"
  >("readiness");

  // Local state for Readiness weights
  const [readiness, setReadiness] = useState<ReadinessWeights>(
    initialScoring.readiness
  );
  const readinessTotal =
    Number(readiness.legalitas || 0) +
    Number(readiness.fasilitas || 0) +
    Number(readiness.mutu || 0) +
    Number(readiness.rekamJejak || 0) +
    Number(readiness.administrasi || 0) +
    Number(readiness.finansial || 0);

  // Local state for Matching weights
  const [matching, setMatching] = useState<MatchingWeights>(
    initialScoring.matching
  );
  const matchingTotal =
    Number(matching.kategori || 0) +
    Number(matching.kapasitas || 0) +
    Number(matching.bahanDekorasi || 0) +
    Number(matching.leadTime || 0) +
    Number(matching.lokasi || 0) +
    Number(matching.readiness || 0) +
    Number(matching.reputasi || 0);

  // Local state for Platform Params
  const [platform, setPlatform] = useState<PlatformParams>(
    initialPlatform.params
  );

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form states for adding items
  const [newCatName, setNewCatName] = useState("");
  const [newCatParent, setNewCatParent] = useState("");
  const [newServiceName, setNewServiceName] = useState("");
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newRuleComponent, setNewRuleComponent] = useState("MUTU");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [newRuleText, setNewRuleText] = useState("");
  const [newRulePoints, setNewRulePoints] = useState(5);
  const [newRuleDifficulty, setNewRuleDifficulty] = useState<
    "MUDAH" | "SEDANG" | "SULIT"
  >("MUDAH");

  const handleSaveReadiness = () => {
    if (readinessTotal !== 100) return;
    setConfirmModal({
      open: true,
      title: "Simpan Perubahan Bobot Readiness Score?",
      description:
        "Perubahan bobot akan segera memengaruhi kalkulasi tier dan penilaian seluruh mitra UMKM di platform. Tindakan ini dicatat di Audit Log.",
      onConfirm: async () => {
        setLoading(true);
        const res = await updateReadinessWeightsAction(readiness);
        setLoading(false);
        if (res.success) {
          setMessage({
            type: "success",
            text: res.message || "Bobot Readiness berhasil disimpan.",
          });
        } else {
          setMessage({
            type: "error",
            text: res.error || "Gagal menyimpan bobot.",
          });
        }
      },
    });
  };

  const handleResetReadiness = () => {
    setConfirmModal({
      open: true,
      title: "Pulihkan Bobot Readiness ke Default Spec?",
      description:
        "Bobot akan dikembalikan ke konfigurasi standar: Legalitas 20, Fasilitas 20, Mutu 20, Rekam Jejak 20, Administrasi 10, Finansial 10.",
      onConfirm: async () => {
        setLoading(true);
        const res = await resetReadinessWeightsAction();
        setLoading(false);
        if (res.success) {
          setReadiness({
            legalitas: 20,
            fasilitas: 20,
            mutu: 20,
            rekamJejak: 20,
            administrasi: 10,
            finansial: 10,
          });
          setMessage({
            type: "success",
            text: "Bobot Readiness berhasil dipulihkan.",
          });
        } else {
          setMessage({ type: "error", text: res.error || "Gagal memulihkan." });
        }
      },
    });
  };

  const handleSaveMatching = () => {
    if (matchingTotal !== 100) return;
    setConfirmModal({
      open: true,
      title: "Simpan Perubahan Bobot Matching Rule-Based?",
      description:
        "Perubahan bobot akan diterapkan pada pemeringkatan kandidat UMKM di setiap RFQ industri. Tindakan ini dicatat di Audit Log.",
      onConfirm: async () => {
        setLoading(true);
        const res = await updateMatchingWeightsAction(matching);
        setLoading(false);
        if (res.success) {
          setMessage({
            type: "success",
            text: res.message || "Bobot Matching berhasil disimpan.",
          });
        } else {
          setMessage({
            type: "error",
            text: res.error || "Gagal menyimpan bobot.",
          });
        }
      },
    });
  };

  const handleResetMatching = () => {
    setConfirmModal({
      open: true,
      title: "Pulihkan Bobot Matching ke Default Spec?",
      description:
        "Bobot akan dikembalikan ke nilai standar spec 7.6: Kategori 25, Kapasitas 20, Bahan 15, Lead Time 10, Lokasi 10, Readiness 10, Reputasi 10.",
      onConfirm: async () => {
        setLoading(true);
        const res = await resetMatchingWeightsAction();
        setLoading(false);
        if (res.success) {
          setMatching({
            kategori: 25,
            kapasitas: 20,
            bahanDekorasi: 15,
            leadTime: 10,
            lokasi: 10,
            readiness: 10,
            reputasi: 10,
          });
          setMessage({
            type: "success",
            text: "Bobot Matching berhasil dipulihkan.",
          });
        } else {
          setMessage({ type: "error", text: res.error || "Gagal memulihkan." });
        }
      },
    });
  };

  const handleSavePlatform = () => {
    setConfirmModal({
      open: true,
      title: "Simpan Pembaruan Parameter Platform?",
      description:
        "Parameter seperti komisi broker escrow, jendela waktu pendanaan, dan biaya pembatalan akan segera aktif. Tindakan ini dicatat di Audit Log.",
      onConfirm: async () => {
        setLoading(true);
        const res = await updatePlatformParametersAction(platform);
        setLoading(false);
        if (res.success) {
          setMessage({
            type: "success",
            text: res.message || "Parameter platform berhasil diperbarui.",
          });
        } else {
          setMessage({
            type: "error",
            text: res.error || "Gagal memperbarui parameter.",
          });
        }
      },
    });
  };

  const handleResetPlatform = () => {
    setConfirmModal({
      open: true,
      title: "Pulihkan Parameter Platform ke Default Spec?",
      description:
        "Komisi 5%, batas lot 2-4, qty minimum 20 pcs, batas pendanaan 72 jam, auto-confirm bahan 48 jam, QC 5 hari kerja, biaya pembatalan 2%.",
      onConfirm: async () => {
        setLoading(true);
        const res = await resetPlatformParametersAction();
        setLoading(false);
        if (res.success) {
          setPlatform({
            commissionPercent: 5,
            minLots: 2,
            maxLots: 4,
            minLotQty: 20,
            fundingDeadlineHours: 72,
            autoConfirmMaterialHours: 48,
            autoConfirmQcDays: 5,
            umkmInactivityGraceHours: 72,
            disputeClaimWindowDays: 5,
            cancellationFeePercent: 2,
          });
          setMessage({
            type: "success",
            text: "Parameter platform berhasil dipulihkan.",
          });
        } else {
          setMessage({ type: "error", text: res.error || "Gagal memulihkan." });
        }
      },
    });
  };

  return (
    <div className="space-y-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="border-b border-[#E5E7EB] pb-4">
        <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-[#1D4ED8]" />
          Konfigurasi Platform & Master Data (P23.2)
        </h2>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Seluruh parameter operasional dibaca langsung dari database tanpa
          hard-coding. Setiap modifikasi diaudit secara append-only.
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-lg p-3.5 text-xs font-medium ${
            message.type === "success"
              ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
              : "bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#DC2626]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Underline Tabs (P23.2 Spec) */}
      <div className="flex border-b border-[#E5E7EB] text-xs font-semibold overflow-x-auto gap-6">
        <button
          onClick={() => setActiveTab("readiness")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "readiness"
              ? "border-[#1D4ED8] text-[#1D4ED8]"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <Sliders className="h-4 w-4" />
          Bobot Readiness
        </button>

        <button
          onClick={() => setActiveTab("matching")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "matching"
              ? "border-[#1D4ED8] text-[#1D4ED8]"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Bobot Matching
        </button>

        <button
          onClick={() => setActiveTab("platform")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "platform"
              ? "border-[#1D4ED8] text-[#1D4ED8]"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <Settings2 className="h-4 w-4" />
          Parameter Platform
        </button>

        <button
          onClick={() => setActiveTab("recommendations")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "recommendations"
              ? "border-[#1D4ED8] text-[#1D4ED8]"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          Aturan Rekomendasi
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "categories"
              ? "border-[#1D4ED8] text-[#1D4ED8]"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <Layers className="h-4 w-4" />
          Kategori & Layanan
        </button>

        <button
          onClick={() => setActiveTab("certifications")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "certifications"
              ? "border-[#1D4ED8] text-[#1D4ED8]"
              : "border-transparent text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Uji & Sertifikasi
        </button>
      </div>

      {/* Tab 1: Bobot Readiness */}
      {activeTab === "readiness" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-[#F9FAFB] p-3.5 rounded-lg border border-[#E5E7EB]">
            <div>
              <span className="text-xs font-bold text-[#111827]">
                Validasi Total Bobot Readiness
              </span>
              <p className="text-[11px] text-[#6B7280]">
                Total seluruh 6 pilar penilaian harus berjumlah tepat 100.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-sm font-bold px-3 py-1 rounded-full border ${
                  readinessTotal === 100
                    ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                    : "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]"
                }`}
              >
                Total: {readinessTotal} / 100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                A. Legalitas dan Profil
              </label>
              <input
                type="number"
                name="legalitas"
                min="0"
                max="100"
                value={readiness.legalitas}
                onChange={(e) =>
                  setReadiness({
                    ...readiness,
                    legalitas: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 20 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                B. Kapasitas & Fasilitas
              </label>
              <input
                type="number"
                name="fasilitas"
                min="0"
                max="100"
                value={readiness.fasilitas}
                onChange={(e) =>
                  setReadiness({
                    ...readiness,
                    fasilitas: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 20 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                C. Mutu & Kompetensi
              </label>
              <input
                type="number"
                name="mutu"
                min="0"
                max="100"
                value={readiness.mutu}
                onChange={(e) =>
                  setReadiness({ ...readiness, mutu: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 20 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                D. Rekam Jejak Transaksi
              </label>
              <input
                type="number"
                name="rekamJejak"
                min="0"
                max="100"
                value={readiness.rekamJejak}
                onChange={(e) =>
                  setReadiness({
                    ...readiness,
                    rekamJejak: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 20 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                E. Administrasi & Digital
              </label>
              <input
                type="number"
                name="administrasi"
                min="0"
                max="100"
                value={readiness.administrasi}
                onChange={(e) =>
                  setReadiness({
                    ...readiness,
                    administrasi: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 10 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                F. Finansial & Bahan
              </label>
              <input
                type="number"
                name="finansial"
                min="0"
                max="100"
                value={readiness.finansial}
                onChange={(e) =>
                  setReadiness({
                    ...readiness,
                    finansial: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 10 poin
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4">
            <button
              type="button"
              onClick={handleResetReadiness}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Pulihkan Default
            </button>

            <button
              type="button"
              onClick={handleSaveReadiness}
              disabled={loading || readinessTotal !== 100}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Bobot Readiness
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Bobot Matching */}
      {activeTab === "matching" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-[#F9FAFB] p-3.5 rounded-lg border border-[#E5E7EB]">
            <div>
              <span className="text-xs font-bold text-[#111827]">
                Validasi Total Bobot Matching
              </span>
              <p className="text-[11px] text-[#6B7280]">
                Total 7 komponen pencocokan RFQ harus berjumlah tepat 100.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-sm font-bold px-3 py-1 rounded-full border ${
                  matchingTotal === 100
                    ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                    : "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]"
                }`}
              >
                Total: {matchingTotal} / 100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Kategori & Subkategori
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={matching.kategori}
                onChange={(e) =>
                  setMatching({ ...matching, kategori: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 25 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Kapasitas Tersedia
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={matching.kapasitas}
                onChange={(e) =>
                  setMatching({
                    ...matching,
                    kapasitas: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 20 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Kemampuan Bahan & Dekorasi
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={matching.bahanDekorasi}
                onChange={(e) =>
                  setMatching({
                    ...matching,
                    bahanDekorasi: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 15 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Kesesuaian Lead Time
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={matching.leadTime}
                onChange={(e) =>
                  setMatching({ ...matching, leadTime: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 10 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Kedekatan Lokasi Pabrik
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={matching.lokasi}
                onChange={(e) =>
                  setMatching({ ...matching, lokasi: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 10 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Readiness Score UMKM
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={matching.readiness}
                onChange={(e) =>
                  setMatching({
                    ...matching,
                    readiness: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 10 poin
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Reputasi & Rating
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={matching.reputasi}
                onChange={(e) =>
                  setMatching({ ...matching, reputasi: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 10 poin
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4">
            <button
              type="button"
              onClick={handleResetMatching}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Pulihkan Default
            </button>

            <button
              type="button"
              onClick={handleSaveMatching}
              disabled={loading || matchingTotal !== 100}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Bobot Matching
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Parameter Platform */}
      {activeTab === "platform" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Komisi Platform (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={platform.commissionPercent}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    commissionPercent: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Dipotong saat rilis escrow (Default: 5%)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Batas Jumlah Lot (Min - Maks)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  value={platform.minLots}
                  onChange={(e) =>
                    setPlatform({
                      ...platform,
                      minLots: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
                  placeholder="Min"
                />
                <span className="text-xs text-[#6B7280]">-</span>
                <input
                  type="number"
                  min="1"
                  value={platform.maxLots}
                  onChange={(e) =>
                    setPlatform({
                      ...platform,
                      maxLots: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
                  placeholder="Maks"
                />
              </div>
              <span className="text-[10px] text-[#6B7280]">
                Default: 2 s.d. 4 lot
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Qty Minimum per Lot (pcs)
              </label>
              <input
                type="number"
                min="1"
                value={platform.minLotQty}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    minLotQty: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Batas aman produksi UMKM (Default: 20 pcs)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Batas Waktu Pendanaan Escrow (Jam)
              </label>
              <input
                type="number"
                min="1"
                value={platform.fundingDeadlineHours}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    fundingDeadlineHours: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Default: 72 jam (3 x 24 jam)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Konfirmasi Otomatis Bahan Tiba (Jam)
              </label>
              <input
                type="number"
                min="1"
                value={platform.autoConfirmMaterialHours}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    autoConfirmMaterialHours: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Pemicu rilis termin 1 (Default: 48 jam)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Konfirmasi Otomatis QC (Hari Kerja)
              </label>
              <input
                type="number"
                min="1"
                value={platform.autoConfirmQcDays}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    autoConfirmQcDays: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Pemicu rilis termin 2 (Default: 5 hari)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Tenggang UMKM Tidak Aktif (Jam)
              </label>
              <input
                type="number"
                min="1"
                value={platform.umkmInactivityGraceHours}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    umkmInactivityGraceHours: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Batas sengketa UMKM mangkir (Default: 72 jam)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Jendela Klaim Sengketa (Hari Kerja)
              </label>
              <input
                type="number"
                min="1"
                value={platform.disputeClaimWindowDays}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    disputeClaimWindowDays: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Setelah barang diterima (Default: 5 hari)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Biaya Administrasi Pembatalan (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={platform.cancellationFeePercent}
                onChange={(e) =>
                  setPlatform({
                    ...platform,
                    cancellationFeePercent: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <span className="text-[10px] text-[#6B7280]">
                Pembatalan sepihak sebelum bahan (Default: 2%)
              </span>
            </div>
          </div>

          {/* Matriks Kompensasi Pembatalan (Spec 7.12.4) */}
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Tabel Matriks Kompensasi Pembatalan (Spec 7.12.4)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E5E7EB]/50 text-[10px] font-semibold text-[#4B5563]">
                  <tr>
                    <th className="p-2.5">Tahap Pembatalan</th>
                    <th className="p-2.5">Perlakuan Refund Pembeli</th>
                    <th className="p-2.5">Hak Kompensasi UMKM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-[#374151]">
                  {initialPlatform.compensationMatrix.map((m, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="p-2.5 font-semibold text-[#111827]">
                        {m.label}
                      </td>
                      <td className="p-2.5">{m.buyerRefundRule}</td>
                      <td className="p-2.5">{m.umkmCompensationRule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4">
            <button
              type="button"
              onClick={handleResetPlatform}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Pulihkan Default
            </button>

            <button
              type="button"
              onClick={handleSavePlatform}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Parameter Platform
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Aturan Rekomendasi */}
      {activeTab === "recommendations" && (
        <div className="space-y-5">
          <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
            <table className="w-full text-left text-xs text-[#4B5563]">
              <thead className="bg-[#F9FAFB] text-[10px] font-semibold uppercase text-[#6B7280] border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-3">Komponen</th>
                  <th className="p-3">Kondisi Logika</th>
                  <th className="p-3">Teks Rekomendasi (3 Langkah Tercepat)</th>
                  <th className="p-3">Poin</th>
                  <th className="p-3">Tingkat Kesulitan</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F9FAFB]">
                    <td className="p-3 font-semibold text-[#111827]">
                      {r.component}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#6B7280]">
                      {r.condition}
                    </td>
                    <td className="p-3 text-[#111827]">{r.text}</td>
                    <td className="p-3 font-bold text-[#15803D]">
                      +{r.points}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.difficulty === "MUDAH"
                            ? "bg-[#DCFCE7] text-[#15803D]"
                            : r.difficulty === "SEDANG"
                              ? "bg-[#FEF3C7] text-[#B45309]"
                              : "bg-[#FEE2E2] text-[#B91C1C]"
                        }`}
                      >
                        {r.difficulty}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => {
                          if (confirm("Hapus aturan rekomendasi ini?")) {
                            setLoading(true);
                            await deleteRecommendationRuleAction(r.id);
                            setLoading(false);
                          }
                        }}
                        className="text-[#DC2626] hover:text-[#B91C1C] p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form Tambah Aturan Baru */}
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#111827]">
              Tambah Aturan Rekomendasi Baru
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                  Pilar Komponen
                </label>
                <select
                  value={newRuleComponent}
                  onChange={(e) => setNewRuleComponent(e.target.value)}
                  className="w-full rounded border border-[#D1D5DB] bg-white p-2"
                >
                  <option value="LEGALITAS">LEGALITAS</option>
                  <option value="FASILITAS">FASILITAS</option>
                  <option value="MUTU">MUTU</option>
                  <option value="REKAM_JEJAK">REKAM_JEJAK</option>
                  <option value="ADMINISTRASI">ADMINISTRASI</option>
                  <option value="FINANSIAL">FINANSIAL</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                  Kondisi (Expression)
                </label>
                <input
                  type="text"
                  placeholder="e.g. nib_verified == false"
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  className="w-full rounded border border-[#D1D5DB] bg-white p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                  Tambahan Poin
                </label>
                <input
                  type="number"
                  min="1"
                  value={newRulePoints}
                  onChange={(e) => setNewRulePoints(Number(e.target.value))}
                  className="w-full rounded border border-[#D1D5DB] bg-white p-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                  Tingkat Kesulitan
                </label>
                <select
                  value={newRuleDifficulty}
                  onChange={(e) =>
                    setNewRuleDifficulty(
                      e.target.value as "MUDAH" | "SEDANG" | "SULIT"
                    )
                  }
                  className="w-full rounded border border-[#D1D5DB] bg-white p-2"
                >
                  <option value="MUDAH">MUDAH</option>
                  <option value="SEDANG">SEDANG</option>
                  <option value="SULIT">SULIT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#374151] mb-1">
                Teks Panduan Rekomendasi
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Lengkapi NIB OSS (+8)"
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  className="w-full rounded border border-[#D1D5DB] bg-white p-2 text-xs"
                />
                <button
                  type="button"
                  disabled={loading || !newRuleText || !newRuleCondition}
                  onClick={async () => {
                    setLoading(true);
                    await createRecommendationRuleAction({
                      component: newRuleComponent,
                      condition: newRuleCondition,
                      text: newRuleText,
                      points: newRulePoints,
                      difficulty: newRuleDifficulty,
                    });
                    setNewRuleText("");
                    setNewRuleCondition("");
                    setLoading(false);
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Kategori dan Layanan */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kategori 2 Tingkat */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[#1D4ED8]" />
                Taksonomi Kategori Tekstil 2-Tingkat
              </h3>

              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {categories.map((parent) => (
                  <div
                    key={parent.id}
                    className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3"
                  >
                    <div className="font-bold text-xs text-[#111827] flex items-center justify-between">
                      <span>📁 {parent.name}</span>
                      <span className="text-[10px] font-mono text-[#6B7280]">
                        /{parent.slug}
                      </span>
                    </div>

                    <div className="mt-2 pl-4 border-l-2 border-[#D1D5DB] space-y-1">
                      {parent.children.map((sub) => (
                        <div
                          key={sub.id}
                          className="text-[11px] text-[#4B5563] flex items-center justify-between"
                        >
                          <span>↳ {sub.name}</span>
                          <span className="font-mono text-[9px] text-[#9CA3AF]">
                            /{sub.slug}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Tambah Kategori */}
              <div className="rounded border border-[#E5E7EB] p-3 bg-white space-y-2">
                <span className="text-[11px] font-bold text-[#374151]">
                  Tambah Kategori / Subkategori
                </span>
                <input
                  type="text"
                  placeholder="Nama kategori baru"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full rounded border border-[#D1D5DB] p-1.5 text-xs"
                />
                <select
                  value={newCatParent}
                  onChange={(e) => setNewCatParent(e.target.value)}
                  className="w-full rounded border border-[#D1D5DB] p-1.5 text-xs bg-white"
                >
                  <option value="">-- Kategori Utama (Induk) --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      Subkategori dari: {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={loading || !newCatName}
                  onClick={async () => {
                    setLoading(true);
                    const slug = newCatName
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "-");
                    await createCategoryAction({
                      name: newCatName,
                      slug,
                      parentId: newCatParent || undefined,
                    });
                    setNewCatName("");
                    setNewCatParent("");
                    setLoading(false);
                  }}
                  className="w-full rounded bg-[#1D4ED8] p-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50"
                >
                  + Simpan Kategori
                </button>
              </div>
            </div>

            {/* Layanan Produksi */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="h-4 w-4 text-[#1D4ED8]" />
                Layanan Produksi Konveksi (Multi-Pilih)
              </h3>

              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-1">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="rounded border border-[#E5E7EB] bg-white p-2.5 text-xs flex items-center justify-between"
                  >
                    <span className="font-semibold text-[#111827]">
                      {s.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#6B7280]">
                      /{s.slug}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Tambah Layanan */}
              <div className="rounded border border-[#E5E7EB] p-3 bg-white space-y-2">
                <span className="text-[11px] font-bold text-[#374151]">
                  Tambah Layanan Produksi Baru
                </span>
                <input
                  type="text"
                  placeholder="Nama layanan (e.g. Sublimasi Jersey)"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full rounded border border-[#D1D5DB] p-1.5 text-xs"
                />
                <button
                  type="button"
                  disabled={loading || !newServiceName}
                  onClick={async () => {
                    setLoading(true);
                    const slug = newServiceName
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "-");
                    await createProductionServiceAction({
                      name: newServiceName,
                      slug,
                    });
                    setNewServiceName("");
                    setLoading(false);
                  }}
                  className="w-full rounded bg-[#1D4ED8] p-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50"
                >
                  + Simpan Layanan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Uji dan Sertifikasi */}
      {activeTab === "certifications" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-1.5"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-xs text-[#111827]">{c.name}</h4>
                  <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#1D4ED8]">
                    Master
                  </span>
                </div>
                <p className="text-[11px] text-[#4B5563]">
                  Penerbit: <strong>{c.issuer || "Lembaga Resmi"}</strong>
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  {c.description || "-"}
                </p>
              </div>
            ))}
          </div>

          {/* Form Tambah Sertifikasi Baru */}
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#111827]">
              Tambah Standar Uji / Sertifikasi Tekstil Baru
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Nama sertifikasi (e.g. SNI ISO 14001 Lingkungan)"
                value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                className="rounded border border-[#D1D5DB] bg-white p-2"
              />
              <input
                type="text"
                placeholder="Lembaga penerbit (e.g. BSN / Balai Besar Tekstil)"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                className="rounded border border-[#D1D5DB] bg-white p-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                disabled={loading || !newCertName}
                onClick={async () => {
                  setLoading(true);
                  await createCertificationAction({
                    name: newCertName,
                    issuer: newCertIssuer || undefined,
                  });
                  setNewCertName("");
                  setNewCertIssuer("");
                  setLoading(false);
                }}
                className="inline-flex items-center gap-1.5 rounded bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Simpan Sertifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center gap-2.5 text-[#111827]">
              <AlertTriangle className="h-5 w-5 text-[#D97706]" />
              <h3 className="text-sm font-bold">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setConfirmModal(null)}
                className="rounded-lg border border-[#D1D5DB] px-3.5 py-1.5 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  await confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Konfirmasi Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
