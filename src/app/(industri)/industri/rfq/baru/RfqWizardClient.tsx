"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { createDraftRfqAction, publishRfqAction } from "@/modules/rfq/actions";
import { RfqCategoryType } from "@/modules/rfq/rules";

export interface WizardItemSize {
  size: string;
  quantity: number;
}

export interface WizardItem {
  name: string;
  fabricType: string;
  gsmMin?: number | null;
  gsmMax?: number | null;
  color: string;
  materialProvidedByBuyer: boolean;
  referencePhotoUrl?: string;
  techPackUrl?: string;
  constructionNotes?: string;
  decorationType: string;
  decorationPlacement?: string;
  labelPackingNotes?: string;
  quantityTolerancePercent: number;
  dimensionTolerance: string;
  aqlStandard: string;
  needLabTest: boolean;
  totalQuantity: number;
  sizes: WizardItemSize[];
}

interface WizardProps {
  userOrgId: string;
  userName: string;
}

export function RfqWizardClient({ userName }: Partial<WizardProps>) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  // Form State
  const [categoryType, setCategoryType] = useState<RfqCategoryType>("SERAGAM");
  const [title, setTitle] = useState("");
  const [contextDescription, setContextDescription] = useState("");
  const [visibility, setVisibility] = useState<"TERBUKA" | "UNDANGAN">(
    "TERBUKA"
  );

  // Step 3: Items
  const [items, setItems] = useState<WizardItem[]>([
    {
      name: "Kemeja Kerja Kantor Lengan Panjang",
      fabricType: "Katun TC 140 gsm",
      gsmMin: 135,
      gsmMax: 145,
      color: "Biru Navy",
      materialProvidedByBuyer: false,
      referencePhotoUrl:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
      techPackUrl: "",
      constructionNotes: "Kerah tegak formal, saku bobok kiri.",
      decorationType: "BORDIR",
      decorationPlacement: "Dada Kiri",
      labelPackingNotes: "Packing per nama karyawan dengan hangtag.",
      quantityTolerancePercent: 3.0,
      dimensionTolerance: "±1 cm",
      aqlStandard: "AQL 2.5",
      needLabTest: true,
      totalQuantity: 200,
      sizes: [
        { size: "S", quantity: 20 },
        { size: "M", quantity: 70 },
        { size: "L", quantity: 70 },
        { size: "XL", quantity: 30 },
        { size: "XXL", quantity: 10 },
      ],
    },
  ]);

  // Step 4: Alokasi
  const [allocationMode, setAllocationMode] = useState<"TUNGGAL" | "LOT">(
    "TUNGGAL"
  );

  // Step 5: Syarat
  const [needNib, setNeedNib] = useState(true);
  const [needLabTestReq, setNeedLabTestReq] = useState(true);
  const [needCorporateExp, setNeedCorporateExp] = useState(false);

  // Step 6: Sampel
  const [needSample, setNeedSample] = useState(true);
  const [sampleCostBearer, setSampleCostBearer] = useState("DIKREDITKAN");
  const [sampleCount, setSampleCount] = useState(1);
  const [sampleDeadlineDays, setSampleDeadlineDays] = useState(7);

  // Step 7: Jadwal & Lokasi (Lazy initializer untuk memenuhi react-hooks/purity)
  const [qaDeadline, setQaDeadline] = useState(() => {
    return new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  });
  const [quotationDeadline, setQuotationDeadline] = useState(() => {
    return new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  });
  const [targetDeliveryDate, setTargetDeliveryDate] = useState(() => {
    return new Date(Date.now() + 75 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  });
  const [deliveryLocation, setDeliveryLocation] = useState(
    "Gudang Pusat Logistik, Daan Mogot, Tangerang"
  );

  // Step 8: Komersial & Pembayaran
  const [indicativeBudget, setIndicativeBudget] = useState("35000000");
  const hideBudget = false;

  // Step 9: Bobot Evaluasi
  const [evalWeights, setEvalWeights] = useState({
    price: 35,
    compliance: 25,
    timeline: 20,
    reputation: 20,
  });

  // UI state
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successDraftNumber, setSuccessDraftNumber] = useState<string | null>(
    null
  );

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: "Rompi Operasional Staff",
        fabricType: "Drill 240 gsm",
        gsmMin: 230,
        gsmMax: 250,
        color: "Abu-abu",
        materialProvidedByBuyer: false,
        referencePhotoUrl:
          "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600",
        techPackUrl: "",
        constructionNotes: "Lapisan furing parasut, resleting vislon.",
        decorationType: "SABLON",
        decorationPlacement: "Punggung",
        labelPackingNotes: "Packing polybag per lusin.",
        quantityTolerancePercent: 3.0,
        dimensionTolerance: "±1.5 cm",
        aqlStandard: "AQL 2.5",
        needLabTest: false,
        totalQuantity: 100,
        sizes: [
          { size: "M", quantity: 40 },
          { size: "L", quantity: 40 },
          { size: "XL", quantity: 20 },
        ],
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleUpdateItemSize = (
    itemIdx: number,
    sizeIdx: number,
    val: number
  ) => {
    const updated = [...items];
    updated[itemIdx].sizes[sizeIdx].quantity = Math.max(0, val);
    // Auto kalkulasi total
    const sum = updated[itemIdx].sizes.reduce(
      (s: number, cur: WizardItemSize) => s + cur.quantity,
      0
    );
    updated[itemIdx].totalQuantity = sum;
    setItems(updated);
  };

  const buildPayload = () => {
    const requirements = [];
    if (needNib) {
      requirements.push({
        type: "LEGALITAS" as const,
        description: "Nomor Induk Berusaha (NIB) terverifikasi OSS",
        isMandatory: true,
      });
    }
    if (needLabTestReq) {
      requirements.push({
        type: "MUTU" as const,
        description: "Hasil uji lab kain (luntur warna & susut)",
        isMandatory: true,
      });
    }
    if (needCorporateExp) {
      requirements.push({
        type: "PENGALAMAN" as const,
        description: "Pengalaman pengerjaan seragam korporasi minimal 1 proyek",
        isMandatory: false,
      });
    }

    return {
      title: title || "Pengadaan Tekstil Tanpa Judul",
      categoryType,
      visibility,
      contextDescription,
      allocationMode,
      needSample,
      sampleCostBearer,
      sampleCount,
      sampleDeadlineDays,
      qaDeadline: qaDeadline ? `${qaDeadline}T23:59:59Z` : null,
      quotationDeadline: `${quotationDeadline}T23:59:59Z`,
      targetDeliveryDate: `${targetDeliveryDate}T23:59:59Z`,
      deliveryLocation,
      indicativeBudget: indicativeBudget ? Number(indicativeBudget) : null,
      hideBudget,
      evaluationWeights: evalWeights,
      items,
      requirements,
      invitedOrgIds: [],
    };
  };

  const handleSaveDraft = async () => {
    setErrorMsg(null);
    setSavingDraft(true);
    const payload = buildPayload();
    const res = await createDraftRfqAction(payload);
    setSavingDraft(false);

    if (res.success) {
      setSuccessDraftNumber(res.rfqNumber || null);
    } else {
      setErrorMsg(res.error || "Gagal menyimpan draft RFQ");
    }
  };

  const handlePublish = async () => {
    setErrorMsg(null);
    setPublishing(true);

    // 1. Simpan draft terlebih dahulu untuk mendapatkan ID
    const payload = buildPayload();
    const draftRes = await createDraftRfqAction(payload);

    if (!draftRes.success || !draftRes.rfqId) {
      setPublishing(false);
      setErrorMsg(
        draftRes.error || "Gagal menyimpan data RFQ sebelum penerbitan"
      );
      return;
    }

    // 2. Terbitkan
    const pubRes = await publishRfqAction(draftRes.rfqId);
    setPublishing(false);

    if (pubRes.success) {
      router.push(`/industri?success=published&rfq=${pubRes.rfqNumber}`);
    } else {
      setErrorMsg(pubRes.error || "Gagal menerbitkan RFQ");
    }
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (currentStep === 1 && !title) {
      // Auto set default title jika kosong
      setTitle(`Pengadaan ${categoryType} 2027`);
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    "Jenis Kebutuhan",
    "Informasi Dasar",
    "Item & Spesifikasi",
    "Alokasi Pemenang",
    "Persyaratan",
    "Ketentuan Sampel",
    "Jadwal & Pengiriman",
    "Komersial & Escrow",
    "Bobot Evaluasi",
    "Tinjau & Terbitkan",
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-8 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
        {/* Breadcrumb & Header */}
        <div className="space-y-1">
          <Link
            href="/industri"
            className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Dashboard Industri
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-[#111827]">
              Buat RFQ Baru {userName ? `· ${userName}` : ""}
            </h1>
            <span className="text-xs font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#DBEAFE]">
              Langkah {currentStep} dari {totalSteps}:{" "}
              {stepTitles[currentStep - 1]}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
          <div
            className="h-full bg-[#1D4ED8] transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Notifikasi Error / Sukses */}
        {errorMsg && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-4 text-xs text-[#B91C1C] flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Periksa Kembali Data Anda:</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {successDraftNumber && (
          <div className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] p-4 text-xs text-[#15803D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Draft <strong>{successDraftNumber}</strong> berhasil disimpan!
              </span>
            </div>
            <Link
              href="/industri"
              className="font-bold underline hover:text-[#14532D]"
            >
              Lihat di Daftar Draft
            </Link>
          </div>
        )}

        {/* Step Container */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-6">
          {/* LANGKAH 1: JENIS KEBUTUHAN */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Pilih Jenis Kebutuhan Tekstil
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Sistem akan menyesuaikan template field spesifikasi yang
                  relevan.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    type: "SERAGAM" as const,
                    title: "Seragam dan Pakaian Kerja",
                    desc: "Kemeja kantor, polo, wearpack, rompi. Dilengkapi rincian ukuran per karyawan & packing khusus.",
                  },
                  {
                    type: "MERCHANDISE" as const,
                    title: "Merchandise dan Promosi",
                    desc: "Kaos event, totebag, jaket komunitas. Fokus pada kuantitas fleksibel, sablon/DTF, dan tenggat acara.",
                  },
                  {
                    type: "MAKLON" as const,
                    title: "Maklon untuk Brand Fashion",
                    desc: "Produksi CMT atau full package berulang dengan tech pack, pola/grading, dan standar kualitas ketat.",
                  },
                ].map((opt) => (
                  <div
                    key={opt.type}
                    onClick={() => setCategoryType(opt.type)}
                    className={`cursor-pointer rounded-lg border p-4 text-xs transition-colors ${
                      categoryType === opt.type
                        ? "border-[#1D4ED8] bg-[#EFF6FF] text-[#1E40AF]"
                        : "border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#111827]">
                        {opt.title}
                      </span>
                      {categoryType === opt.type && (
                        <CheckCircle2 className="h-4 w-4 text-[#1D4ED8]" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#6B7280]">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LANGKAH 2: INFORMASI DASAR */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Informasi Dasar Pengadaan
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Tentukan judul proyek dan visibilitas akses untuk UMKM.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Judul RFQ <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Pengadaan Seragam Karyawan Kantor 2027"
                    className="w-full rounded-md border border-[#D1D5DB] p-2.5 text-xs focus:border-[#1D4ED8] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Konteks / Deskripsi Singkat Kebutuhan:
                  </label>
                  <textarea
                    rows={3}
                    value={contextDescription}
                    onChange={(e) => setContextDescription(e.target.value)}
                    placeholder="Jelaskan kebutuhan pengadaan Anda, divisi pengguna, atau latar belakang pesanan..."
                    className="w-full rounded-md border border-[#D1D5DB] p-2.5 text-xs focus:border-[#1D4ED8] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Visibilitas RFQ (R-06):
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      onClick={() => setVisibility("TERBUKA")}
                      className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between ${
                        visibility === "TERBUKA"
                          ? "border-[#1D4ED8] bg-[#EFF6FF]"
                          : "border-[#E5E7EB]"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-[#111827] block">
                          TERBUKA
                        </span>
                        <span className="text-[11px] text-[#6B7280]">
                          Terlihat oleh seluruh UMKM terverifikasi
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setVisibility("UNDANGAN")}
                      className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between ${
                        visibility === "UNDANGAN"
                          ? "border-[#1D4ED8] bg-[#EFF6FF]"
                          : "border-[#E5E7EB]"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-[#111827] block">
                          UNDANGAN
                        </span>
                        <span className="text-[11px] text-[#6B7280]">
                          Hanya UMKM terpilih yang dapat mengakses
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 3: ITEM & SPESIFIKASI */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#111827]">
                    Daftar Item & Rincian Ukuran (R-01, R-02)
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    Total kuantitas item otomatis dihitung dari rincian ukuran
                    (Size Breakdown).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#1D4ED8] hover:bg-[#DBEAFE]"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah Item
                </button>
              </div>

              {items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                    <span className="font-bold text-[#1D4ED8]">
                      Item #{itemIdx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(itemIdx)}
                        className="text-[#DC2626] hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus Item
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-[#374151] block mb-1">
                        Nama Item:
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const upd = [...items];
                          upd[itemIdx].name = e.target.value;
                          setItems(upd);
                        }}
                        className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#374151] block mb-1">
                        Jenis Bahan / Kain (R-01):
                      </label>
                      <input
                        type="text"
                        value={item.fabricType}
                        onChange={(e) => {
                          const upd = [...items];
                          upd[itemIdx].fabricType = e.target.value;
                          setItems(upd);
                        }}
                        className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#374151] block mb-1">
                        Warna:
                      </label>
                      <input
                        type="text"
                        value={item.color}
                        onChange={(e) => {
                          const upd = [...items];
                          upd[itemIdx].color = e.target.value;
                          setItems(upd);
                        }}
                        className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#374151] block mb-1">
                        Dekorasi Logo:
                      </label>
                      <select
                        value={item.decorationType}
                        onChange={(e) => {
                          const upd = [...items];
                          upd[itemIdx].decorationType = e.target.value;
                          setItems(upd);
                        }}
                        className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                      >
                        <option value="TIDAK_ADA">Tidak Ada</option>
                        <option value="BORDIR">Bordir Komputer</option>
                        <option value="SABLON">Sablon Manual</option>
                        <option value="DTF">Sablon DTF</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-[#374151] block mb-1">
                        Penempatan Logo:
                      </label>
                      <input
                        type="text"
                        value={item.decorationPlacement || ""}
                        onChange={(e) => {
                          const upd = [...items];
                          upd[itemIdx].decorationPlacement = e.target.value;
                          setItems(upd);
                        }}
                        placeholder="Contoh: Dada Kiri / Punggung"
                        className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-[#374151] block mb-1">
                        URL Gambar Referensi / Tech Pack (R-01):
                      </label>
                      <input
                        type="url"
                        value={item.referencePhotoUrl || ""}
                        onChange={(e) => {
                          const upd = [...items];
                          upd[itemIdx].referencePhotoUrl = e.target.value;
                          setItems(upd);
                        }}
                        placeholder="https://..."
                        className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Rincian Ukuran S-XXL */}
                  <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#374151]">
                        Rincian Ukuran & Jumlah (R-02):
                      </span>
                      <span className="font-bold text-[#1D4ED8] bg-white px-2 py-0.5 rounded-md border border-[#E5E7EB]">
                        Total Item: {item.totalQuantity} pcs
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {item.sizes.map((s: WizardItemSize, sizeIdx: number) => (
                        <div key={s.size} className="text-center">
                          <label className="font-bold text-[11px] text-[#4B5563] block">
                            {s.size}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={s.quantity}
                            onChange={(e) =>
                              handleUpdateItemSize(
                                itemIdx,
                                sizeIdx,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full rounded-md border border-[#D1D5DB] p-1.5 text-xs text-center bg-white font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LANGKAH 4: ALOKASI & STANDAR ACUAN */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Mode Alokasi Pemenang RFQ
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Tentukan apakah pesanan dialokasikan ke satu mitra konveksi
                  tunggal atau dibagi per lot.
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setAllocationMode("TUNGGAL")}
                  className={`cursor-pointer rounded-lg border p-4 text-xs ${
                    allocationMode === "TUNGGAL"
                      ? "border-[#1D4ED8] bg-[#EFF6FF] text-[#1E40AF]"
                      : "border-[#E5E7EB]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#111827]">
                      Satu Pemenang (Tunggal)
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-[#1D4ED8]" />
                  </div>
                  <p className="mt-1 text-xs text-[#6B7280]">
                    Seluruh kuantitas (
                    {items.reduce((s, it) => s + it.totalQuantity, 0)} pcs)
                    dikerjakan oleh satu UMKM pemenang terbaik.
                  </p>
                </div>

                <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#9CA3AF]">
                      Bagi per Lot (Split Award: 2-4 Lot)
                    </span>
                    <span className="rounded-full bg-[#E5E7EB] px-2 py-0.5 text-[10px] font-bold text-[#6B7280]">
                      Tersedia di Tahap 8
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Membagi pesanan skala besar ke beberapa UMKM secara paralel
                    dengan standar konsistensi bahan acuan bersama.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 5: PERSYARATAN */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Persyaratan Kemitraan Konveksi
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Pilih kriteria kualifikasi yang harus dipenuhi oleh calon
                  penawar.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needNib}
                    onChange={(e) => setNeedNib(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-[#1D4ED8]"
                  />
                  <div>
                    <span className="font-bold text-[#111827] block">
                      Nomor Induk Berusaha (NIB) Resmi (Wajib)
                    </span>
                    <span className="text-[#6B7280]">
                      UMKM wajib memiliki izin legalitas usaha OSS yang
                      terverifikasi platform.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needLabTestReq}
                    onChange={(e) => setNeedLabTestReq(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-[#1D4ED8]"
                  />
                  <div>
                    <span className="font-bold text-[#111827] block">
                      Hasil Uji Lab Kain (Wajib)
                    </span>
                    <span className="text-[#6B7280]">
                      Meminta bukti pengujian susut kain dan ketahanan luntur
                      warna sebelum produksi massal.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needCorporateExp}
                    onChange={(e) => setNeedCorporateExp(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded text-[#1D4ED8]"
                  />
                  <div>
                    <span className="font-bold text-[#111827] block">
                      Pengalaman Seragam Korporasi (Nilai Tambah)
                    </span>
                    <span className="text-[#6B7280]">
                      Memberikan prioritas pada UMKM yang memiliki rekam jejak
                      portofolio seragam kerja kantor.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* LANGKAH 6: SAMPEL */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Ketentuan Pembuatan Sampel (Golden Sample)
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Atur apakah penawar wajib mengirimkan sampel fisik sebelum
                  produksi dimulai.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#111827]">
                    <input
                      type="radio"
                      name="sampleToggle"
                      checked={needSample}
                      onChange={() => setNeedSample(true)}
                    />
                    Perlu Pembuatan Sampel (Dianjurkan)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#111827]">
                    <input
                      type="radio"
                      name="sampleToggle"
                      checked={!needSample}
                      onChange={() => setNeedSample(false)}
                    />
                    Tanpa Sampel (Langsung Produksi)
                  </label>
                </div>

                {needSample && (
                  <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
                    <div>
                      <label className="font-semibold text-[#374151] block mb-1">
                        Penanggung Biaya Sampel:
                      </label>
                      <select
                        value={sampleCostBearer}
                        onChange={(e) => setSampleCostBearer(e.target.value)}
                        className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                      >
                        <option value="DIKREDITKAN">
                          Dikreditkan ke total nilai order bila menang
                          (Dianjurkan)
                        </option>
                        <option value="PEMBELI">Ditanggung Pembeli</option>
                        <option value="UMKM">Ditanggung UMKM</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-[#374151] block mb-1">
                          Jumlah Sampel per Item:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={sampleCount}
                          onChange={(e) =>
                            setSampleCount(parseInt(e.target.value) || 1)
                          }
                          className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#374151] block mb-1">
                          Batas Waktu Sampel (Hari):
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={sampleDeadlineDays}
                          onChange={(e) =>
                            setSampleDeadlineDays(parseInt(e.target.value) || 7)
                          }
                          className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LANGKAH 7: JADWAL & PENGIRIMAN */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Jadwal Pengadaan & Lokasi Pengiriman (R-03)
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Tenggat penawaran minimal 3 hari sejak terbit. Tenggat Q&A
                  harus sebelum penawaran.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Tenggat Tanya Jawab (Q&A):
                  </label>
                  <input
                    type="date"
                    value={qaDeadline}
                    onChange={(e) => setQaDeadline(e.target.value)}
                    className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Tenggat Penawaran (Quotation Deadline) (R-03):
                  </label>
                  <input
                    type="date"
                    value={quotationDeadline}
                    onChange={(e) => setQuotationDeadline(e.target.value)}
                    className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Target Tanggal Pengiriman Selesai:
                  </label>
                  <input
                    type="date"
                    value={targetDeliveryDate}
                    onChange={(e) => setTargetDeliveryDate(e.target.value)}
                    className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Alamat / Kota Lokasi Pengiriman:
                  </label>
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="Contoh: Gudang Daan Mogot, Tangerang"
                    className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 8: KOMERSIAL & PEMBAYARAN */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Ketentuan Komersial & Pembayaran Escrow
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Semua transaksi didanai penuh ke escrow platform untuk
                  keamanan kedua pihak.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] space-y-2 text-[#1E40AF]">
                  <span className="font-bold text-xs block">
                    Termin Rilis Escrow Standar:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>
                      <strong>30%</strong> saat bahan baku kain tiba dan
                      diverifikasi di workshop UMKM.
                    </li>
                    <li>
                      <strong>70%</strong> setelah seluruh pesanan lolos QC
                      akhir dan diterima di lokasi.
                    </li>
                  </ul>
                  <span className="text-[11px] text-[#1E3A8A] block pt-1">
                    * Komisi platform 5% dipotong otomatis dari tiap dana yang
                    dirilis ke UMKM.
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Estimasi Anggaran Indikatif (Rp) (R-07):
                  </label>
                  <input
                    type="number"
                    value={indicativeBudget}
                    onChange={(e) => setIndicativeBudget(e.target.value)}
                    placeholder="Contoh: 35000000"
                    className="w-full rounded-md border border-[#D1D5DB] p-2.5 text-xs bg-white font-mono"
                  />
                  <span className="text-[11px] text-[#6B7280] block mt-1">
                    Bersifat informasi panduan bagi UMKM dan bukan batas
                    mengikat (R-07).
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 9: BOBOT EVALUASI */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Bobot Evaluasi Penawaran Masuk
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Atur persentase bobot penilaian kriteria. Total harus 100%.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Harga Penawaran (%):
                  </label>
                  <input
                    type="number"
                    value={evalWeights.price}
                    onChange={(e) =>
                      setEvalWeights({
                        ...evalWeights,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white text-center font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Kesesuaian Bahan & Sampel (%):
                  </label>
                  <input
                    type="number"
                    value={evalWeights.compliance}
                    onChange={(e) =>
                      setEvalWeights({
                        ...evalWeights,
                        compliance: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white text-center font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Kecepatan & Jadwal Kirim (%):
                  </label>
                  <input
                    type="number"
                    value={evalWeights.timeline}
                    onChange={(e) =>
                      setEvalWeights({
                        ...evalWeights,
                        timeline: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white text-center font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Reputasi & Readiness Score (%):
                  </label>
                  <input
                    type="number"
                    value={evalWeights.reputation}
                    onChange={(e) =>
                      setEvalWeights({
                        ...evalWeights,
                        reputation: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-md border border-[#D1D5DB] p-2 text-xs bg-white text-center font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#4B5563]">
                  Total Bobot:
                </span>
                <span
                  className={`font-bold font-mono text-sm ${
                    evalWeights.price +
                      evalWeights.compliance +
                      evalWeights.timeline +
                      evalWeights.reputation ===
                    100
                      ? "text-[#15803D]"
                      : "text-[#DC2626]"
                  }`}
                >
                  {evalWeights.price +
                    evalWeights.compliance +
                    evalWeights.timeline +
                    evalWeights.reputation}
                  % / 100%
                </span>
              </div>
            </div>
          )}

          {/* LANGKAH 10: TINJAU & TERBITKAN */}
          {currentStep === 10 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-[#111827]">
                  Tinjau Ringkasan RFQ Sebelum Diterbitkan
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Setelah diterbitkan (OPEN), perubahan spesifikasi hanya dapat
                  dilakukan melalui Addendum resmi (R-04).
                </p>
              </div>

              <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs space-y-3">
                <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="text-[#6B7280]">Judul RFQ:</span>
                  <span className="font-bold text-[#111827]">{title}</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="text-[#6B7280]">Kategori & Mode:</span>
                  <span className="font-bold text-[#111827]">
                    {categoryType} · {allocationMode} (Satu Pemenang)
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="text-[#6B7280]">Total Kuantitas:</span>
                  <span className="font-bold text-[#1D4ED8]">
                    {items.reduce((s, it) => s + it.totalQuantity, 0)} pcs (
                    {items.length} item)
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="text-[#6B7280]">Tenggat Penawaran:</span>
                  <span className="font-bold text-[#111827]">
                    {new Date(quotationDeadline).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Estimasi Anggaran:</span>
                  <span className="font-bold text-[#111827]">
                    {indicativeBudget
                      ? `Rp${parseInt(indicativeBudget).toLocaleString("id-ID")}`
                      : "Tidak ditentukan"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-[#B45309]" />
                <div>
                  <span className="font-bold block">
                    Estimasi Kandidat yang Cocok:
                  </span>
                  <span className="text-[11px]">
                    Sistem mendeteksi sekitar{" "}
                    <strong>12 UMKM terverifikasi</strong> di Jawa Barat &
                    sekitarnya yang memenuhi spesifikasi dan kapasitas RFQ ini.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Wizard */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] p-4 shadow-md">
          <div className="mx-auto max-w-3xl flex items-center justify-between">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={savingDraft || publishing}
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-50 transition-colors"
              >
                <Save className="h-3.5 w-3.5 text-[#1D4ED8]" />
                {savingDraft ? "Menyimpan..." : "Simpan Draft"}
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1E40AF] transition-colors"
                >
                  Lanjut
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={publishing}
                  onClick={handlePublish}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#166534] disabled:opacity-50 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {publishing ? "Menerbitkan..." : "Terbitkan RFQ Sekarang"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
