"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Edit3,
  Scissors,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
  Star,
  Check,
  X,
  Loader2,
  CreditCard,
} from "lucide-react";
import {
  saveCapabilityAction,
  removeCapabilityAction,
  addMachineAssetAction,
  removeMachineAssetAction,
  addPortfolioItemAction,
  removePortfolioItemAction,
  addOrgCertificationAction,
  removeOrgCertificationAction,
  updateOrgFacilityDetailsAction,
} from "@/modules/capabilities/actions";
import { StatusBadge } from "@/components/ui";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  children?: Array<{ id: string; name: string; slug: string }>;
}

interface ServiceOption {
  id: string;
  name: string;
  slug: string;
}

interface CertificationOption {
  id: string;
  name: string;
  issuer: string | null;
}

interface UmkmProfileClientProps {
  initialProfile: {
    organization: {
      id: string;
      name: string;
      city: string;
      province: string;
      address: string | null;
      description: string | null;
      picName: string;
      picPhone: string | null;
      yearEstablished: number | null;
      operatorCount: number | null;
      shiftCount: number | null;
      verificationStatus: string;
      createdAt: string;
    };
    capabilities: Array<{
      id: string;
      categoryId: string;
      category: {
        id: string;
        name: string;
        parent?: { id: string; name: string } | null;
      };
      services: string[];
      materials: string[];
      decorations: string[];
      monthlyCapacity: number;
      minOrderQty: number;
      leadTimeDays: number;
      serviceArea: string | null;
      notes: string | null;
    }>;
    machines: Array<{
      id: string;
      machineType: string;
      brand: string | null;
      quantity: number;
      condition: string | null;
    }>;
    portfolio: Array<{
      id: string;
      title: string;
      description: string | null;
      productType: string;
      clientType: string | null;
      largestOrderQty: number | null;
      imageUrl: string;
    }>;
    certifications: Array<{
      id: string;
      certificationId: string;
      certification: { id: string; name: string; issuer: string | null };
      certificateNumber: string | null;
      validUntil: string | null;
      expiryStatus: "VALID" | "EXPIRING_SOON" | "EXPIRED";
      daysRemaining: number | null;
    }>;
    documents: Array<{
      id: string;
      type: string;
      status: string;
      validUntil: string | null;
    }>;
    stats: {
      totalCapacity: number;
      totalMachines: number;
      totalPortfolio: number;
      operatorCount: number;
      shiftCount: number;
    };
    completeness: {
      percentage: number;
      missingItems: string[];
    };
  };
  categories: CategoryOption[];
  productionServices: ServiceOption[];
  masterCertifications: CertificationOption[];
}

export function UmkmProfileClient({
  initialProfile,
  categories,
  productionServices,
  masterCertifications,
}: UmkmProfileClientProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal / Slide-over states
  const [showCapabilityPanel, setShowCapabilityPanel] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);

  // Form state: Tambah Kapabilitas
  const [capCategoryId, setCapCategoryId] = useState("");
  const [capServices, setCapServices] = useState<string[]>([]);
  const [capMaterials, setCapMaterials] = useState<string[]>([]);
  const [capDecorations, setCapDecorations] = useState<string[]>([]);
  const [capCapacity, setCapCapacity] = useState<number>(3000);
  const [capMoq, setCapMoq] = useState<number>(50);
  const [capLeadTime, setCapLeadTime] = useState<number>(14);
  const [capServiceArea, setCapServiceArea] = useState("Seluruh Indonesia");
  const [capNotes, setCapNotes] = useState("");

  // Form state: Tambah Mesin
  const [machineType, setMachineType] = useState(
    "Mesin Jahit Lurus (High Speed)"
  );
  const [machineBrand, setMachineBrand] = useState("Juki / Brother");
  const [machineQty, setMachineQty] = useState<number>(5);

  // Form state: Tambah Portofolio
  const [portTitle, setPortTitle] = useState("");
  const [portProductType, setPortProductType] = useState("Kemeja Kerja");
  const [portClientType, setPortClientType] = useState("Korporasi / BUMN");
  const [portLargestQty, setPortLargestQty] = useState<number>(1000);
  const [portImageUrl, setPortImageUrl] = useState("");

  // Form state: Tambah Sertifikasi
  const [certId, setCertId] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [certValidUntil, setCertValidUntil] = useState("");

  // Form state: Edit Fasilitas Usaha
  const [facDescription, setFacDescription] = useState(
    profile.organization.description || ""
  );
  const [facYear, setFacYear] = useState(
    profile.organization.yearEstablished || 2018
  );
  const [facOperators, setFacOperators] = useState(
    profile.organization.operatorCount || 15
  );
  const [facShifts, setFacShifts] = useState(
    profile.organization.shiftCount || 1
  );

  // Validation state for capability
  const isMoqInvalid = capCapacity > 0 && capMoq > capCapacity;

  // Handlers
  const handleSaveCapability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMoqInvalid) return;
    if (!capCategoryId) {
      setFeedback({ type: "error", message: "Pilih kategori produk tekstil." });
      return;
    }
    if (capServices.length === 0) {
      setFeedback({
        type: "error",
        message: "Pilih minimal satu layanan produksi.",
      });
      return;
    }
    if (capMaterials.length === 0) {
      setFeedback({
        type: "error",
        message: "Pilih minimal satu jenis bahan yang dikerjakan.",
      });
      return;
    }

    setLoading(true);
    const res = await saveCapabilityAction({
      categoryId: capCategoryId,
      services: capServices,
      materials: capMaterials,
      decorations: capDecorations,
      monthlyCapacity: Number(capCapacity),
      minOrderQty: Number(capMoq),
      leadTimeDays: Number(capLeadTime),
      serviceArea: capServiceArea,
      notes: capNotes,
    });
    setLoading(false);

    if (res.success) {
      setFeedback({
        type: "success",
        message: res.message || "Kapabilitas berhasil disimpan.",
      });
      setShowCapabilityPanel(false);
      // Reset form
      setCapServices([]);
      setCapMaterials([]);
      setCapDecorations([]);
      // Refresh local state
      window.location.reload();
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Gagal menyimpan kapabilitas.",
      });
    }
  };

  const handleDeleteCapability = async (id: string) => {
    if (!confirm("Hapus kapabilitas produk ini?")) return;
    setLoading(true);
    const res = await removeCapabilityAction(id);
    setLoading(false);
    if (res.success) {
      setProfile((prev) => ({
        ...prev,
        capabilities: prev.capabilities.filter((c) => c.id !== id),
      }));
      setFeedback({
        type: "success",
        message: "Kapabilitas berhasil dihapus.",
      });
    } else {
      setFeedback({ type: "error", message: res.error || "Gagal menghapus." });
    }
  };

  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await addMachineAssetAction({
      machineType,
      brand: machineBrand,
      quantity: Number(machineQty),
    });
    setLoading(false);
    if (res.success) {
      setFeedback({ type: "success", message: "Mesin berhasil ditambahkan." });
      setShowMachineModal(false);
      window.location.reload();
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Gagal menambah mesin.",
      });
    }
  };

  const handleDeleteMachine = async (id: string) => {
    if (!confirm("Hapus aset mesin ini?")) return;
    setLoading(true);
    const res = await removeMachineAssetAction(id);
    setLoading(false);
    if (res.success) {
      setProfile((prev) => ({
        ...prev,
        machines: prev.machines.filter((m) => m.id !== id),
      }));
      setFeedback({ type: "success", message: "Aset mesin dihapus." });
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portImageUrl) {
      setFeedback({ type: "error", message: "Masukkan URL foto portofolio." });
      return;
    }
    setLoading(true);
    const res = await addPortfolioItemAction({
      title: portTitle,
      productType: portProductType,
      clientType: portClientType,
      largestOrderQty: portLargestQty ? Number(portLargestQty) : undefined,
      imageUrl: portImageUrl,
    });
    setLoading(false);
    if (res.success) {
      setFeedback({
        type: "success",
        message: "Portofolio berhasil ditambahkan.",
      });
      setShowPortfolioModal(false);
      setPortTitle("");
      setPortImageUrl("");
      window.location.reload();
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Gagal menambah portofolio.",
      });
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Hapus item portofolio ini?")) return;
    setLoading(true);
    const res = await removePortfolioItemAction(id);
    setLoading(false);
    if (res.success) {
      setProfile((prev) => ({
        ...prev,
        portfolio: prev.portfolio.filter((p) => p.id !== id),
      }));
      setFeedback({ type: "success", message: "Item portofolio dihapus." });
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId) {
      setFeedback({ type: "error", message: "Pilih jenis sertifikasi/uji." });
      return;
    }
    setLoading(true);
    const res = await addOrgCertificationAction({
      certificationId: certId,
      certificateNumber: certNumber,
      validUntil: certValidUntil || null,
    });
    setLoading(false);
    if (res.success) {
      setFeedback({
        type: "success",
        message: "Sertifikasi berhasil dicatat.",
      });
      setShowCertModal(false);
      window.location.reload();
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Gagal mencatat sertifikasi.",
      });
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm("Hapus sertifikasi ini?")) return;
    setLoading(true);
    const res = await removeOrgCertificationAction(id);
    setLoading(false);
    if (res.success) {
      setProfile((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c.id !== id),
      }));
      setFeedback({ type: "success", message: "Sertifikasi dihapus." });
    }
  };

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateOrgFacilityDetailsAction({
      description: facDescription,
      yearEstablished: Number(facYear),
      operatorCount: Number(facOperators),
      shiftCount: Number(facShifts),
    });
    setLoading(false);
    if (res.success) {
      setFeedback({
        type: "success",
        message: "Info usaha berhasil diperbarui.",
      });
      setShowFacilityModal(false);
      window.location.reload();
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Gagal menyimpan info.",
      });
    }
  };

  // Helper toggle array checkboxes
  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Predefined lists per spec 7.2
  const commonMaterials = [
    "Katun Kombed (24s, 30s)",
    "Katun Carded",
    "Kain Drill (American, Japan, Nagata)",
    "TC (Tetoron Cotton)",
    "Polyester / Dryfit",
    "Rayon Twill",
    "Denim / Chambray",
    "Fleece & Baby Terry",
    "Parasut / Taslan",
  ];

  const commonDecorations = [
    "Bordir Komputer Presisi",
    "Sablon Manual (Plastisol/Rubber)",
    "Sablon Digital / DTF",
    "Sublimasi Fullprint",
    "Woven Label & Patch",
  ];

  const org = profile.organization;
  const isVerified = org.verificationStatus === "VERIFIED";

  return (
    <div className="w-full">
      {/* Toast Alert Feedback */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-4 text-xs font-semibold border-b ${
            feedback.type === "success"
              ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
              : "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="hover:opacity-75"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Two-Column Layout (Figma P4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB] bg-white">
        {/* ======================================================== */}
        {/* KOLOM KIRI: Kartu Profil Lengket 320px (lg:col-span-4)   */}
        {/* ======================================================== */}
        <aside className="lg:col-span-4 p-6 bg-[#FAFBFC] space-y-6 lg:sticky lg:top-0 self-start">
          <div className="space-y-5">
            {/* Header Profil */}
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-[4px] bg-[#EFF4FE] border border-[#2862E0]/20 flex items-center justify-center text-[#2862E0] font-bold text-2xl">
                {org.name.slice(0, 2).toUpperCase()}
              </div>
              <h2 className="mt-3 text-base font-semibold text-[#0E1422]">
                {org.name}
              </h2>
              <p className="text-xs text-[#5B6475]">
                {org.city}, {org.province}
              </p>

              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap justify-center">
                {isVerified ? (
                  <StatusBadge status="VERIFIED">
                    <ShieldCheck className="h-3 w-3" />
                    Terverifikasi
                  </StatusBadge>
                ) : (
                  <StatusBadge status="PENDING">
                    <Clock className="h-3 w-3" />
                    Menunggu Verifikasi
                  </StatusBadge>
                )}
                <StatusBadge variant="info">Tier: Siap Kemitraan</StatusBadge>
              </div>

              {/* Rating Mini */}
              <div className="mt-2.5 flex items-center gap-1 text-xs text-[#0E1422]">
                <div className="flex items-center text-[#B45309]">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-bold ml-1 font-mono">4.8</span>
                </div>
                <span className="text-[#5B6475]">(18 ulasan pengadaan)</span>
              </div>

              <button
                type="button"
                onClick={() => setShowFacilityModal(true)}
                className="mt-3.5 inline-flex items-center gap-1.5 rounded-[4px] border border-[#8B93A1] bg-white px-3 py-1.5 text-xs font-semibold text-[#0E1422] hover:bg-[#FAFBFC] transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5 text-[#2862E0]" />
                Edit Info Usaha
              </button>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* Label-Nilai dengan Ikon */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#5B6475]">
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#8B93A1]" />
                  Tahun Berdiri
                </span>
                <span className="font-semibold text-[#0E1422] font-mono">
                  {org.yearEstablished || "2018"}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#5B6475]">
                <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#8B93A1]" />
                  Tepat Waktu
                </span>
                <span className="font-semibold text-[#15803D] font-mono">
                  96%
                </span>
              </div>

              <div className="flex items-center justify-between text-[#5B6475]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#8B93A1]" />
                  Order Selesai
                </span>
                <span className="font-semibold text-[#0E1422] font-mono">
                  24 Proyek
                </span>
              </div>

              <div className="flex items-center justify-between text-[#5B6475]">
                <span className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-[#8B93A1]" />
                  Total Kapasitas
                </span>
                <span className="font-semibold text-[#2862E0] font-mono">
                  {profile.stats.totalCapacity > 0
                    ? `${profile.stats.totalCapacity.toLocaleString("id-ID")} pcs/bln`
                    : "Belum diisi"}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#5B6475]">
                <span className="flex items-center gap-2">
                  <Scissors className="h-3.5 w-3.5 text-[#8B93A1]" />
                  Tenaga Kerja
                </span>
                <span className="font-semibold text-[#0E1422] font-mono">
                  {profile.stats.operatorCount} Penjahit (
                  {profile.stats.shiftCount} Shift)
                </span>
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* Kelengkapan Profil (Pure Function profileCompleteness) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0E1422]">
                  Kelengkapan Profil
                </span>
                <span className="text-xs font-mono font-bold text-[#2862E0]">
                  {profile.completeness.percentage}%
                </span>
              </div>

              <div className="h-2 w-full bg-[#E5E7EB] rounded-[2px] overflow-hidden">
                <div
                  className="h-full bg-[#2862E0] transition-all duration-500 rounded-[2px]"
                  style={{ width: `${profile.completeness.percentage}%` }}
                />
              </div>

              {profile.completeness.missingItems.length > 0 && (
                <div className="mt-2.5 rounded-[2px] border border-[#FEF3C7] bg-[#FFFBEB] p-2.5 space-y-1">
                  <span className="text-[10px] font-bold text-[#92400E] uppercase tracking-wider block font-mono">
                    Belum Dilengkapi:
                  </span>
                  <ul className="text-[11px] text-[#B45309] space-y-0.5 list-disc list-inside">
                    {profile.completeness.missingItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* Dokumen & Sertifikasi (Penanda Kedaluwarsa) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0E1422]">
                  Dokumen & Akreditasi
                </span>
                <button
                  onClick={() => setShowCertModal(true)}
                  className="text-[11px] font-semibold text-[#2862E0] hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Tambah
                </button>
              </div>

              <div className="space-y-2">
                {profile.certifications.length === 0 ? (
                  <p className="text-[11px] text-[#5B6475]">
                    Belum ada sertifikasi / hasil uji lab kain.
                  </p>
                ) : (
                  profile.certifications.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-[2px] border border-[#E5E7EB] p-2.5 bg-white text-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[#0E1422]">
                          {c.certification.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {c.expiryStatus === "VALID" && (
                            <StatusBadge status="VALID">
                              <CheckCircle2 className="h-3 w-3" /> Berlaku
                            </StatusBadge>
                          )}
                          {c.expiryStatus === "EXPIRING_SOON" && (
                            <StatusBadge status="EXPIRING_SOON">
                              <AlertTriangle className="h-3 w-3" /> Kedaluwarsa{" "}
                              {c.daysRemaining} hari
                            </StatusBadge>
                          )}
                          {c.expiryStatus === "EXPIRED" && (
                            <StatusBadge status="EXPIRED">
                              <XCircle className="h-3 w-3" /> Telah Kedaluwarsa
                            </StatusBadge>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCert(c.id)}
                        className="text-[#8B93A1] hover:text-[#B91C1C] p-1"
                        aria-label="Hapus sertifikat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <hr className="border-[#E5E7EB]" />

            {/* Rekening Pencairan (Placeholder P4) */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#0E1422]">
                Rekening Pencairan Escrow
              </span>
              <div className="flex items-center justify-between rounded-[2px] border border-[#E5E7EB] bg-white p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#2862E0]" />
                  <div>
                    <p className="font-semibold text-[#0E1422]">Bank BCA</p>
                    <p className="text-[11px] font-mono text-[#5B6475]">
                      •••• 4821
                    </p>
                  </div>
                </div>
                <StatusBadge status="VERIFIED">Terverifikasi</StatusBadge>
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* KOLOM KANAN: Konten Kompartemen (lg:col-span-8)          */}
        {/* ======================================================== */}
        <main className="lg:col-span-8 divide-y divide-[#E5E7EB] bg-white">
          {/* Kompartemen 1: Tentang Usaha */}
          <section className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-semibold text-[#0E1422] flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#2862E0]" />
                Tentang Usaha Konveksi
              </h3>
              <button
                onClick={() => setShowFacilityModal(true)}
                className="text-xs font-semibold text-[#2862E0] hover:underline inline-flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            </div>

            <p className="text-xs text-[#5B6475] leading-relaxed">
              {org.description ||
                "Belum ada deskripsi usaha. Tambahkan profil konveksi Anda, jenis spesialisasi jahitan, serta komitmen mutu untuk meyakinkan pembeli industri korporasi."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Alamat Bengkel
                </span>
                <span className="text-xs font-semibold text-[#0E1422]">
                  {org.address || `${org.city}, ${org.province}`}
                </span>
              </div>
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  PIC Penanggung Jawab
                </span>
                <span className="text-xs font-semibold text-[#0E1422]">
                  {org.picName} ({org.picPhone || "-"})
                </span>
              </div>
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Jumlah Operator
                </span>
                <span className="text-xs font-semibold text-[#0E1422] font-mono">
                  {profile.stats.operatorCount} Penjahit
                </span>
              </div>
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-2.5 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Shift Operasional
                </span>
                <span className="text-xs font-semibold text-[#0E1422] font-mono">
                  {profile.stats.shiftCount} Shift Kerja
                </span>
              </div>
            </div>
          </section>

          {/* Kompartemen 2: Kapabilitas Produk Tekstil (Spec 7.2) */}
          <section className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#0E1422] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#2862E0]" />
                  Kapabilitas Produk Tekstil
                </h3>
                <p className="text-[11px] text-[#5B6475]">
                  Kapasitas bulanan, MOQ, lead time, serta bahan dan dekorasi
                  yang dikuasai.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCapabilityPanel(true)}
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2862E0] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2858B8] transition-colors shadow-none"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Kapabilitas
              </button>
            </div>

            {profile.capabilities.length === 0 ? (
              <div className="rounded-[4px] border border-dashed border-[#8B93A1] p-6 text-center space-y-2">
                <Scissors className="h-8 w-8 text-[#8B93A1] mx-auto" />
                <p className="text-xs font-semibold text-[#0E1422]">
                  Belum ada kapabilitas produk yang ditambahkan
                </p>
                <p className="text-[11px] text-[#5B6475]">
                  Tambahkan kapabilitas agar UMKM Anda dapat terhubung dan cocok
                  dengan RFQ industri korporasi.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCapabilityPanel(true)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2862E0] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah Kapabilitas Pertama
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-[2px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFBFC] border-b border-[#E5E7EB] font-mono text-[10px] font-semibold text-[#5B6475] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Kategori Produk</th>
                      <th className="p-3">Kapasitas / Bln</th>
                      <th className="p-3">MOQ</th>
                      <th className="p-3">Lead Time</th>
                      <th className="p-3">Bahan Baku & Dekorasi</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#0E1422]">
                    {profile.capabilities.map((cap) => (
                      <tr
                        key={cap.id}
                        className="hover:bg-[#FAFBFC] transition-colors"
                      >
                        <td className="p-3">
                          <p className="font-semibold text-[#0E1422]">
                            {cap.category.name}
                          </p>
                          {cap.category.parent && (
                            <span className="text-[10px] text-[#5B6475]">
                              Induk: {cap.category.parent.name}
                            </span>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cap.services.map((srv, sIdx) => (
                              <span
                                key={sIdx}
                                className="rounded-[2px] bg-[#EFF4FE] px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#2862E0]"
                              >
                                {srv}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-[#0E1422] font-mono tabular-nums">
                          {cap.monthlyCapacity.toLocaleString("id-ID")} pcs
                        </td>
                        <td className="p-3 font-semibold text-[#5B6475] font-mono tabular-nums">
                          {cap.minOrderQty.toLocaleString("id-ID")} pcs
                        </td>
                        <td className="p-3 font-semibold text-[#5B6475] font-mono tabular-nums">
                          {cap.leadTimeDays} hari kerja
                        </td>
                        <td className="p-3 max-w-[220px]">
                          <p className="text-[11px] text-[#5B6475] truncate">
                            <strong className="text-[#0E1422]">Bahan:</strong>{" "}
                            {cap.materials.join(", ")}
                          </p>
                          {cap.decorations.length > 0 && (
                            <p className="text-[10px] text-[#5B6475] truncate mt-0.5">
                              <strong className="text-[#0E1422]">
                                Dekorasi:
                              </strong>{" "}
                              {cap.decorations.join(", ")}
                            </p>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteCapability(cap.id)}
                            className="text-[#8B93A1] hover:text-[#B91C1C] p-1"
                            title="Hapus Kapabilitas"
                            aria-label="Hapus kapabilitas"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Kompartemen 3: Mesin & Tenaga Kerja */}
          <section className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#0E1422] flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-[#2862E0]" />
                  Mesin dan Tenaga Kerja
                </h3>
                <p className="text-[11px] text-[#5B6475]">
                  Inventaris peralatan jahit dan kapasitas fisik workshop
                  produksi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMachineModal(true)}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#8B93A1] bg-white px-3 py-1.5 text-xs font-semibold text-[#0E1422] hover:bg-[#FAFBFC] transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-[#2862E0]" />
                Tambah Mesin
              </button>
            </div>

            {/* Strip Stat 3 Kolom */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-3 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Total Mesin
                </span>
                <span className="text-xl font-semibold text-[#0E1422] font-mono tabular-nums">
                  {profile.stats.totalMachines} Unit
                </span>
              </div>
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-3 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Penjahit & Operator
                </span>
                <span className="text-xl font-semibold text-[#15803D] font-mono tabular-nums">
                  {profile.stats.operatorCount} Orang
                </span>
              </div>
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-3 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Shift Harian
                </span>
                <span className="text-xl font-semibold text-[#2862E0] font-mono tabular-nums">
                  {profile.stats.shiftCount} Shift
                </span>
              </div>
            </div>

            {/* Rincian Mesin */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#0E1422] block">
                Daftar Jenis Mesin Terpasang:
              </span>
              {profile.machines.length === 0 ? (
                <p className="text-xs text-[#5B6475]">
                  Belum ada data mesin konveksi yang dicatat.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {profile.machines.map((mac) => (
                    <div
                      key={mac.id}
                      className="rounded-[4px] border border-[#E5E7EB] bg-white p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#0E1422]">
                          {mac.machineType}
                        </p>
                        <p className="text-[11px] text-[#5B6475]">
                          Merk: {mac.brand || "-"} · Kondisi:{" "}
                          {mac.condition || "BAIK"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge variant="info">
                          {mac.quantity} unit
                        </StatusBadge>
                        <button
                          type="button"
                          onClick={() => handleDeleteMachine(mac.id)}
                          className="text-[#8B93A1] hover:text-[#B91C1C]"
                          aria-label="Hapus mesin"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Kompartemen 4: Portofolio Produk Jadi (Spec 7.2) */}
          <section className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#0E1422] flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#2862E0]" />
                  Portofolio dan Contoh Produk
                </h3>
                <p className="text-[11px] text-[#5B6475]">
                  Hasil jahitan nyata, variasi model, dan rekam jejak pesanan
                  klien korporasi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPortfolioModal(true)}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#8B93A1] bg-white px-3 py-1.5 text-xs font-semibold text-[#0E1422] hover:bg-[#FAFBFC] transition-colors"
              >
                <Plus className="h-3.5 w-3.5 text-[#2862E0]" />
                Tambah Portofolio
              </button>
            </div>

            {profile.portfolio.length === 0 ? (
              <div className="rounded-[4px] border border-dashed border-[#8B93A1] p-6 text-center space-y-2">
                <ImageIcon className="h-8 w-8 text-[#8B93A1] mx-auto" />
                <p className="text-xs font-semibold text-[#0E1422]">
                  Belum ada foto portofolio produk
                </p>
                <p className="text-[11px] text-[#5B6475]">
                  Unggah hasil produksi terbaik Anda untuk meningkatkan
                  kepercayaan industri pembeli.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.portfolio.map((port) => (
                  <div
                    key={port.id}
                    className="rounded-[4px] border border-[#E5E7EB] bg-white overflow-hidden group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-36 w-full bg-[#FAFBFC] relative overflow-hidden flex items-center justify-center">
                        {port.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={port.imageUrl}
                            alt={port.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-[#8B93A1]" />
                        )}
                        <span className="absolute top-2 left-2 rounded-[2px] bg-[#0E1422]/85 px-2 py-0.5 text-[9px] font-mono font-semibold text-white">
                          {port.productType}
                        </span>
                      </div>

                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-semibold text-[#0E1422] line-clamp-1">
                          {port.title}
                        </h4>
                        {port.clientType && (
                          <p className="text-[10px] text-[#5B6475]">
                            Klien: {port.clientType}
                          </p>
                        )}
                        {port.largestOrderQty && (
                          <p className="text-[10px] text-[#15803D] font-mono font-medium">
                            Order Terbesar:{" "}
                            {port.largestOrderQty.toLocaleString("id-ID")} pcs
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 pt-0 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeletePortfolio(port.id)}
                        className="text-[11px] text-[#B91C1C] hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Kompartemen 5: Ulasan & Reputasi */}
          <section className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#0E1422] flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#B45309]" />
                  Ulasan dan Evaluasi Pembeli Industri
                </h3>
                <p className="text-[11px] text-[#5B6475]">
                  Rating transparan hasil inspeksi QC dan penyelesaian order di
                  platform.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-3 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Kualitas Jahitan & Ukuran
                </span>
                <span className="text-base font-semibold text-[#0E1422] font-mono">
                  4.9 / 5.0
                </span>
              </div>
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-3 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Ketepatan Lead Time
                </span>
                <span className="text-base font-semibold text-[#0E1422] font-mono">
                  4.8 / 5.0
                </span>
              </div>
              <div className="rounded-[4px] bg-[#FAFBFC] border border-[#E5E7EB] p-3 text-center">
                <span className="text-[10px] text-[#5B6475] font-mono uppercase tracking-wider block">
                  Responsivitas & Komunikasi
                </span>
                <span className="text-base font-semibold text-[#0E1422] font-mono">
                  4.7 / 5.0
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ======================================================== */}
      {/* SLIDE-OVER PANEL: Tambah Kapabilitas Produk (P4)         */}
      {/* ======================================================== */}
      {showCapabilityPanel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="w-full max-w-lg bg-white h-full shadow-[0_4px_16px_rgba(14,20,34,0.08)] flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4 bg-[#FAFBFC]">
                <div>
                  <h3 className="text-sm font-semibold text-[#0E1422] flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#2862E0]" />
                    Tambah Kapabilitas Produk
                  </h3>
                  <p className="text-[11px] text-[#5B6475]">
                    Tentukan kapasitas dan spesifikasi produksi per kategori
                    tekstil.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCapabilityPanel(false)}
                  className="rounded-[4px] p-1 text-[#5B6475] hover:bg-[#E5E7EB]"
                  aria-label="Tutup panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                id="cap-form"
                onSubmit={handleSaveCapability}
                className="p-5 space-y-4 text-xs"
              >
                {/* Kategori Produk */}
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Kategori Produk Tekstil *
                  </label>
                  <select
                    value={capCategoryId}
                    onChange={(e) => setCapCategoryId(e.target.value)}
                    className="w-full rounded-[4px] border border-[#8B93A1] p-2 text-xs bg-white text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                    required
                  >
                    <option value="">-- Pilih Kategori Tekstil --</option>
                    {categories.map((parent) => (
                      <optgroup key={parent.id} label={`📁 ${parent.name}`}>
                        {(parent.children || []).map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Layanan Produksi Multi-Pilih */}
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Layanan Produksi yang Dikerjakan *
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto border border-[#E5E7EB] rounded-[4px] p-2 bg-[#FAFBFC]">
                    {productionServices.map((srv) => {
                      const selected = capServices.includes(srv.name);
                      return (
                        <label
                          key={srv.id}
                          className="flex items-center gap-2 text-[11px] cursor-pointer hover:text-[#2862E0]"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleSelection(
                                capServices,
                                setCapServices,
                                srv.name
                              )
                            }
                            className="rounded-[2px] border-[#8B93A1] text-[#2862E0] focus:ring-0"
                          />
                          <span>{srv.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Bahan Baku */}
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Jenis Bahan yang Biasa Dikerjakan *
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto border border-[#E5E7EB] rounded-[4px] p-2 bg-[#FAFBFC]">
                    {commonMaterials.map((mat) => {
                      const selected = capMaterials.includes(mat);
                      return (
                        <label
                          key={mat}
                          className="flex items-center gap-2 text-[11px] cursor-pointer hover:text-[#2862E0]"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleSelection(
                                capMaterials,
                                setCapMaterials,
                                mat
                              )
                            }
                            className="rounded-[2px] border-[#8B93A1] text-[#2862E0] focus:ring-0"
                          />
                          <span>{mat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Dekorasi */}
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Dekorasi yang Dikuasai
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto border border-[#E5E7EB] rounded-[4px] p-2 bg-[#FAFBFC]">
                    {commonDecorations.map((dec) => {
                      const selected = capDecorations.includes(dec);
                      return (
                        <label
                          key={dec}
                          className="flex items-center gap-2 text-[11px] cursor-pointer hover:text-[#2862E0]"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleSelection(
                                capDecorations,
                                setCapDecorations,
                                dec
                              )
                            }
                            className="rounded-[2px] border-[#8B93A1] text-[#2862E0] focus:ring-0"
                          />
                          <span>{dec}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Kapasitas & MOQ */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0E1422] mb-1">
                      Kapasitas Bulanan (pcs) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="monthlyCapacity"
                      value={capCapacity}
                      onChange={(e) => setCapCapacity(Number(e.target.value))}
                      className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0E1422] mb-1">
                      MOQ per Style / Lot (pcs) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="minOrderQty"
                      value={capMoq}
                      onChange={(e) => setCapMoq(Number(e.target.value))}
                      className={`w-full rounded-[4px] border p-2 text-xs bg-white text-[#0E1422] focus:outline-none focus:ring-1 ${
                        isMoqInvalid
                          ? "border-[#B91C1C] bg-[#FEF2F2] focus:border-[#B91C1C] focus:ring-[#B91C1C]"
                          : "border-[#8B93A1] focus:border-[#2862E0] focus:ring-[#2862E0]"
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Error validasi real-time jika MOQ > Kapasitas */}
                {isMoqInvalid && (
                  <p className="text-[11px] text-[#B91C1C] font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    MOQ ({capMoq} pcs) tidak boleh melampaui kapasitas bulanan (
                    {capCapacity} pcs).
                  </p>
                )}

                {/* Lead Time & Area */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#0E1422] mb-1">
                      Lead Time Standar (Hari) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="leadTimeDays"
                      value={capLeadTime}
                      onChange={(e) => setCapLeadTime(Number(e.target.value))}
                      className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0E1422] mb-1">
                      Area Layanan Pengiriman
                    </label>
                    <input
                      type="text"
                      value={capServiceArea}
                      onChange={(e) => setCapServiceArea(e.target.value)}
                      className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0]"
                      placeholder="e.g. Seluruh Indonesia"
                    />
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={capNotes}
                    onChange={(e) => setCapNotes(e.target.value)}
                    className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:ring-1 focus:ring-[#2862E0]"
                    placeholder="e.g. Siap menerima tech pack CAD, toleransi dimensi +-1 cm"
                  />
                </div>
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-[#E5E7EB] p-4 bg-[#FAFBFC] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCapabilityPanel(false)}
                className="rounded-[4px] border border-[#8B93A1] bg-white px-4 py-2 text-xs font-semibold text-[#0E1422] hover:bg-[#FAFBFC]"
              >
                Batal
              </button>
              <button
                type="submit"
                form="cap-form"
                disabled={loading || isMoqInvalid}
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2862E0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2858B8] disabled:opacity-50 transition-colors shadow-none"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Simpan Kapabilitas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Tambah Mesin                                      */}
      {/* ======================================================== */}
      {showMachineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-[4px] shadow-[0_4px_16px_rgba(14,20,34,0.08)] border border-[#E5E7EB] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-semibold text-[#0E1422]">
                Tambah Aset Mesin Konveksi
              </h3>
              <button
                onClick={() => setShowMachineModal(false)}
                className="text-[#5B6475] hover:text-[#0E1422]"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddMachine} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0E1422] mb-1">
                  Jenis Mesin *
                </label>
                <input
                  type="text"
                  required
                  value={machineType}
                  onChange={(e) => setMachineType(e.target.value)}
                  placeholder="e.g. Mesin Jahit Lurus, Mesin Obras 4 Benang, Mesin Bordir"
                  className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Merk / Tipe
                  </label>
                  <input
                    type="text"
                    value={machineBrand}
                    onChange={(e) => setMachineBrand(e.target.value)}
                    placeholder="e.g. Juki, Brother, Jack"
                    className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Jumlah Unit *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={machineQty}
                    onChange={(e) => setMachineQty(Number(e.target.value))}
                    className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMachineModal(false)}
                  className="rounded-[4px] border border-[#8B93A1] bg-white px-3.5 py-1.5 font-semibold text-[#0E1422] hover:bg-[#FAFBFC]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-[4px] bg-[#2862E0] px-4 py-1.5 font-semibold text-white hover:bg-[#2858B8] shadow-none"
                >
                  Simpan Mesin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Tambah Portofolio                                 */}
      {/* ======================================================== */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-[4px] shadow-[0_4px_16px_rgba(14,20,34,0.08)] border border-[#E5E7EB] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-semibold text-[#0E1422]">
                Tambah Portofolio Produk Jadi
              </h3>
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="text-[#5B6475] hover:text-[#0E1422]"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddPortfolio} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0E1422] mb-1">
                  Nama Proyek / Produk *
                </label>
                <input
                  type="text"
                  required
                  value={portTitle}
                  onChange={(e) => setPortTitle(e.target.value)}
                  placeholder="e.g. Kemeja Drill Seragam PT Pertamina"
                  className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Jenis Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={portProductType}
                    onChange={(e) => setPortProductType(e.target.value)}
                    placeholder="e.g. Kemeja, Polo, Jaket"
                    className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Tipe Klien
                  </label>
                  <input
                    type="text"
                    value={portClientType}
                    onChange={(e) => setPortClientType(e.target.value)}
                    placeholder="e.g. BUMN, Brand Lokal"
                    className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0E1422] mb-1">
                  Jumlah Order Terbesar (pcs)
                </label>
                <input
                  type="number"
                  min="1"
                  value={portLargestQty}
                  onChange={(e) => setPortLargestQty(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0E1422] mb-1">
                  URL Foto Produk *
                </label>
                <input
                  type="text"
                  required
                  value={portImageUrl}
                  onChange={(e) => setPortImageUrl(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/... atau /demo-kemeja.jpg"
                  className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                />
                <span className="text-[10px] text-[#5B6475]">
                  Gunakan URL gambar produk atau sampel jahitan konveksi.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPortfolioModal(false)}
                  className="rounded-[4px] border border-[#8B93A1] bg-white px-3.5 py-1.5 font-semibold text-[#0E1422] hover:bg-[#FAFBFC]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-[4px] bg-[#2862E0] px-4 py-1.5 font-semibold text-white hover:bg-[#2858B8] shadow-none"
                >
                  Simpan Portofolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Tambah Sertifikasi                                */}
      {/* ======================================================== */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-[4px] shadow-[0_4px_16px_rgba(14,20,34,0.08)] border border-[#E5E7EB] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-semibold text-[#0E1422]">
                Catat Sertifikasi / Uji Lab Kain
              </h3>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-[#5B6475] hover:text-[#0E1422]"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddCert} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0E1422] mb-1">
                  Jenis Sertifikasi / Uji Lab *
                </label>
                <select
                  required
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                >
                  <option value="">-- Pilih Sertifikasi --</option>
                  {masterCertifications.map((mc) => (
                    <option key={mc.id} value={mc.id}>
                      {mc.name} {mc.issuer ? `(${mc.issuer})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0E1422] mb-1">
                  Nomor Sertifikat / Laporan Uji
                </label>
                <input
                  type="text"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  placeholder="e.g. SNI-TEX-2026-09"
                  className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0E1422] mb-1">
                  Berlaku Hingga (Masa Berlaku)
                </label>
                <input
                  type="date"
                  value={certValidUntil}
                  onChange={(e) => setCertValidUntil(e.target.value)}
                  className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                />
                <span className="text-[10px] text-[#5B6475]">
                  Sistem akan otomatis memberi tanda bila sisa masa berlaku $\le
                  30$ hari.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="rounded-[4px] border border-[#8B93A1] bg-white px-3.5 py-1.5 font-semibold text-[#0E1422] hover:bg-[#FAFBFC]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-[4px] bg-[#2862E0] px-4 py-1.5 font-semibold text-white hover:bg-[#2858B8] shadow-none"
                >
                  Simpan Sertifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: Edit Info Fasilitas & Usaha                       */}
      {/* ======================================================== */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-[4px] shadow-[0_4px_16px_rgba(14,20,34,0.08)] border border-[#E5E7EB] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-sm font-semibold text-[#0E1422]">
                Edit Informasi Fasilitas & Usaha
              </h3>
              <button
                onClick={() => setShowFacilityModal(false)}
                className="text-[#5B6475] hover:text-[#0E1422]"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFacility} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0E1422] mb-1">
                  Deskripsi Usaha Konveksi
                </label>
                <textarea
                  rows={3}
                  value={facDescription}
                  onChange={(e) => setFacDescription(e.target.value)}
                  placeholder="Ceritakan sejarah, spesialisasi produk, kapasitas, dan komitmen mutu konveksi Anda..."
                  className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Tahun Berdiri
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={facYear}
                    onChange={(e) => setFacYear(Number(e.target.value))}
                    className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Jml Penjahit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={facOperators}
                    onChange={(e) => setFacOperators(Number(e.target.value))}
                    className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0E1422] mb-1">
                    Shift Harian
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={facShifts}
                    onChange={(e) => setFacShifts(Number(e.target.value))}
                    className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFacilityModal(false)}
                  className="rounded-[4px] border border-[#8B93A1] bg-white px-3.5 py-1.5 font-semibold text-[#0E1422] hover:bg-[#FAFBFC]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-[4px] bg-[#2862E0] px-4 py-1.5 font-semibold text-white hover:bg-[#2858B8] shadow-none"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
