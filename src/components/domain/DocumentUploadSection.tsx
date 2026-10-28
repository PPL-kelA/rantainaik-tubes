"use client";

import { useState } from "react";
import { uploadDocumentAction } from "@/modules/documents/actions";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  ShieldAlert,
} from "lucide-react";

export interface DocumentItem {
  id: string;
  type: string;
  fileName: string;
  fileSize: number;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  rejectionReason: string | null;
  validUntil: string | Date | null;
  createdAt: string | Date;
}

interface DocumentUploadSectionProps {
  organizationId: string;
  orgType: "UMKM" | "INDUSTRY" | string;
  documents: DocumentItem[];
}

const REQUIRED_DOCS_UMKM = [
  {
    type: "NIB",
    label: "Nomor Induk Berusaha (NIB)",
    desc: "Dokumen legalitas NIB dari sistem OSS.",
  },
  {
    type: "NPWP",
    label: "NPWP Badan / Usaha",
    desc: "Kartu atau SKT NPWP aktif.",
  },
  {
    type: "IZIN_USAHA",
    label: "Izin Usaha / Keterangan Domisili",
    desc: "Surat izin operasional atau domisili usaha konveksi.",
  },
  {
    type: "FOTO_BENGKEL",
    label: "Foto Workshop / Fasilitas Produksi",
    desc: "Foto nyata mesin jahit dan area kerja operasional.",
  },
];

const REQUIRED_DOCS_INDUSTRY = [
  {
    type: "NIB",
    label: "NIB atau Akta Perusahaan",
    desc: "NIB OSS atau Akta Pendirian Perusahaan.",
  },
  {
    type: "NPWP",
    label: "NPWP Perusahaan",
    desc: "NPWP Perusahaan / Korporasi pembeli.",
  },
  {
    type: "KONTAK_PIC",
    label: "Surat Tugas / Identitas PIC",
    desc: "Identitas resmi atau surat penunjukan narahubung pengadaan.",
  },
];

export function DocumentUploadSection({
  organizationId,
  orgType,
  documents,
}: DocumentUploadSectionProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [validUntil, setValidUntil] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const requiredList =
    orgType === "UMKM" ? REQUIRED_DOCS_UMKM : REQUIRED_DOCS_INDUSTRY;

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !selectedType) {
      setMessage({
        type: "error",
        text: "Pilih jenis dokumen dan berkas terlebih dahulu.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("organizationId", organizationId);
    formData.append("type", selectedType);
    formData.append("file", file);
    if (validUntil) {
      formData.append("validUntil", validUntil);
    }

    try {
      const res = await uploadDocumentAction(formData);
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "Dokumen berhasil diunggah.",
        });
        setFile(null);
        setSelectedType("");
        setValidUntil("");
        // reset file input
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({
          type: "error",
          text: res.error || "Gagal mengunggah dokumen.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan koneksi saat mengunggah berkas.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="border-b border-[#E5E7EB] pb-4">
        <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#1D4ED8]" />
          Dokumen Legalitas & Verifikasi Akun
        </h2>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Sesuai spesifikasi kurasi <strong>7.1</strong>, akun akan otomatis
          naik menjadi <strong className="text-[#15803D]">VERIFIED</strong>{" "}
          setelah seluruh dokumen wajib di bawah ini disetujui Admin.
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
            <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Checklist Dokumen Wajib */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requiredList.map((req) => {
          // Find latest document uploaded for this type
          const matchingDoc = documents.find(
            (d) =>
              d.type === req.type || (req.type === "NIB" && d.type === "AKTA")
          );

          return (
            <div
              key={req.type}
              className={`rounded-lg border p-4 transition-all ${
                matchingDoc?.status === "VERIFIED"
                  ? "border-[#BBF7D0] bg-[#F0FDF4]/50"
                  : matchingDoc?.status === "REJECTED"
                    ? "border-[#FECACA] bg-[#FEF2F2]/50"
                    : matchingDoc?.status === "PENDING"
                      ? "border-[#FDE68A] bg-[#FFFBEB]/50"
                      : "border-[#E5E7EB] bg-[#F9FAFB]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-[#111827]">
                    {req.label}
                  </h3>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    {req.desc}
                  </p>
                </div>

                {matchingDoc?.status === "VERIFIED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#15803D]">
                    <CheckCircle2 className="h-3 w-3" />
                    Terverifikasi
                  </span>
                ) : matchingDoc?.status === "PENDING" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-bold text-[#B45309]">
                    <Clock className="h-3 w-3" />
                    Menunggu Admin
                  </span>
                ) : matchingDoc?.status === "REJECTED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[10px] font-bold text-[#B91C1C]">
                    <XCircle className="h-3 w-3" />
                    Ditolak
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E5E7EB] px-2 py-0.5 text-[10px] font-semibold text-[#4B5563]">
                    Belum Diunggah
                  </span>
                )}
              </div>

              {/* Detail file yang terunggah */}
              {matchingDoc && (
                <div className="mt-3 flex items-center justify-between border-t border-[#E5E7EB] pt-2 text-[11px]">
                  <span className="text-[#4B5563] truncate max-w-[180px]">
                    📄 {matchingDoc.fileName}
                  </span>
                  <a
                    href={`/api/documents/${matchingDoc.id}/file`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#1D4ED8] hover:underline"
                  >
                    Buka Berkas <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Alasan Penolakan Jika Ada */}
              {matchingDoc?.status === "REJECTED" && (
                <div className="mt-2.5 rounded border border-[#FCA5A5] bg-[#FEF2F2] p-2 text-[11px] text-[#991B1B]">
                  <div className="flex items-center gap-1 font-bold">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Alasan Penolakan:
                  </div>
                  <p className="mt-0.5">
                    {matchingDoc.rejectionReason ||
                      "Dokumen belum memenuhi kriteria keabsahan."}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Form Unggah Dokumen Baru / Unggah Ulang */}
      <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#374151] mb-3">
          Unggah atau Perbarui Berkas Dokumen
        </h3>

        <form
          onSubmit={handleUpload}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] mb-1">
              Jenis Dokumen
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              required
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-1.5 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
            >
              <option value="">-- Pilih Jenis Dokumen --</option>
              {orgType === "UMKM" ? (
                <>
                  <option value="NIB">NIB (Nomor Induk Berusaha)</option>
                  <option value="NPWP">NPWP Usaha / Badan</option>
                  <option value="IZIN_USAHA">Izin Usaha / Domisili</option>
                  <option value="FOTO_BENGKEL">
                    Foto Bengkel / Fasilitas Produksi
                  </option>
                </>
              ) : (
                <>
                  <option value="NIB">NIB (Nomor Induk Berusaha)</option>
                  <option value="AKTA">Akta Pendirian Perusahaan</option>
                  <option value="NPWP">NPWP Perusahaan</option>
                  <option value="KONTAK_PIC">
                    Surat Tugas / Identitas PIC
                  </option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] mb-1">
              Pilih Berkas (PDF, JPG, PNG, WebP ≤ 5MB)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-2 py-1 text-xs text-[#111827] file:mr-2 file:rounded file:border-0 file:bg-[#EFF6FF] file:px-2 file:py-1 file:text-[11px] file:font-semibold file:text-[#1D4ED8]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#4B5563] mb-1">
              Masa Berlaku (Opsional)
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-1.5 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !file || !selectedType}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Unggah
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
