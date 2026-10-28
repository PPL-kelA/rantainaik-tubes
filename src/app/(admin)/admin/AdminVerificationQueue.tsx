"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertTriangle,
  Building2,
  X,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  reviewDocumentAction,
  suspendOrganizationAction,
  activateOrganizationAction,
} from "@/modules/documents/actions";

interface DocumentItem {
  id: string;
  type: string;
  fileName: string;
  fileSize: number;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  rejectionReason: string | null;
  validUntil: string | null;
  createdAt: string;
}

interface OrgQueueItem {
  id: string;
  name: string;
  type: string;
  city: string;
  province: string;
  picName: string;
  picPhone: string | null;
  verificationStatus: string;
  createdAt: string;
  documents: DocumentItem[];
  members: Array<{
    userId: string;
    user: {
      id: string;
      email: string;
      status: string;
    };
  }>;
}

const QUICK_REJECTION_REASONS = [
  "Dokumen buram atau tidak dapat dibaca jelas",
  "Masa berlaku dokumen telah kedaluwarsa",
  "Nama usaha / entitas tidak sesuai dengan NIB",
  "Bukan dokumen resmi yang disyaratkan",
  "Foto fasilitas workshop bukan milik konveksi",
];

export function AdminVerificationQueue({
  initialQueue,
}: {
  initialQueue: OrgQueueItem[];
}) {
  const [queue, setQueue] = useState<OrgQueueItem[]>(initialQueue);
  const [selectedOrg, setSelectedOrg] = useState<OrgQueueItem | null>(null);
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Stats calculation
  const pendingCount = queue.filter(
    (o) => o.verificationStatus === "PENDING"
  ).length;
  const verifiedCount = queue.filter(
    (o) => o.verificationStatus === "VERIFIED"
  ).length;
  const suspendedCount = queue.filter(
    (o) =>
      o.verificationStatus === "SUSPENDED" ||
      o.verificationStatus === "REJECTED"
  ).length;

  const handleApproveDoc = async (docId: string) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await reviewDocumentAction({
        documentId: docId,
        status: "VERIFIED",
      });

      if (res.success) {
        // Update document status in state
        setQueue((prev) =>
          prev.map((org) => {
            if (org.id === selectedOrg?.id) {
              const updatedDocs = org.documents.map((d) =>
                d.id === docId
                  ? { ...d, status: "VERIFIED" as const, rejectionReason: null }
                  : d
              );
              return {
                ...org,
                verificationStatus: res.organizationVerified
                  ? "VERIFIED"
                  : org.verificationStatus,
                documents: updatedDocs,
              };
            }
            return org;
          })
        );

        if (selectedOrg) {
          setSelectedOrg((prev) =>
            prev
              ? {
                  ...prev,
                  verificationStatus: res.organizationVerified
                    ? "VERIFIED"
                    : prev.verificationStatus,
                  documents: prev.documents.map((d) =>
                    d.id === docId
                      ? {
                          ...d,
                          status: "VERIFIED" as const,
                          rejectionReason: null,
                        }
                      : d
                  ),
                }
              : null
          );
        }

        setMessage({
          type: "success",
          text: res.organizationVerified
            ? "Dokumen disetujui. Seluruh dokumen minimum terpenuhi, akun organisasi otomatis naik ke VERIFIED!"
            : "Dokumen berhasil disetujui.",
        });
      } else {
        setMessage({
          type: "error",
          text: res.error || "Gagal menyetujui dokumen.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem." });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectDoc = async (docId: string) => {
    if (!rejectionReason.trim()) {
      setMessage({
        type: "error",
        text: "Alasan penolakan wajib diisi minimal 5 karakter.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await reviewDocumentAction({
        documentId: docId,
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      });

      if (res.success) {
        setQueue((prev) =>
          prev.map((org) => {
            if (org.id === selectedOrg?.id) {
              const updatedDocs = org.documents.map((d) =>
                d.id === docId
                  ? { ...d, status: "REJECTED" as const, rejectionReason }
                  : d
              );
              return { ...org, documents: updatedDocs };
            }
            return org;
          })
        );

        if (selectedOrg) {
          setSelectedOrg((prev) =>
            prev
              ? {
                  ...prev,
                  documents: prev.documents.map((d) =>
                    d.id === docId
                      ? { ...d, status: "REJECTED" as const, rejectionReason }
                      : d
                  ),
                }
              : null
          );
        }

        setMessage({
          type: "success",
          text: "Dokumen ditolak dan notifikasi perbaikan dikirimkan.",
        });
        setRejectingDocId(null);
        setRejectionReason("");
      } else {
        setMessage({
          type: "error",
          text: res.error || "Gagal menolak dokumen.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem." });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (orgId: string, currentStatus: string) => {
    setLoading(true);
    setMessage(null);

    try {
      if (currentStatus === "SUSPENDED") {
        const res = await activateOrganizationAction(orgId);
        if (res.success) {
          setQueue((prev) =>
            prev.map((o) =>
              o.id === orgId ? { ...o, verificationStatus: "VERIFIED" } : o
            )
          );
          setMessage({
            type: "success",
            text: "Organisasi berhasil diaktifkan kembali.",
          });
        } else {
          setMessage({
            type: "error",
            text: res.error || "Gagal mengaktifkan.",
          });
        }
      } else {
        const res = await suspendOrganizationAction(
          orgId,
          "Ditangguhkan melalui panel kurasi"
        );
        if (res.success) {
          setQueue((prev) =>
            prev.map((o) =>
              o.id === orgId ? { ...o, verificationStatus: "SUSPENDED" } : o
            )
          );
          setMessage({
            type: "success",
            text: "Organisasi berhasil ditangguhkan.",
          });
        } else {
          setMessage({
            type: "error",
            text: res.error || "Gagal menangguhkan.",
          });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 Summary Badges (P23 spec) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#92400E]">
              Menunggu Verifikasi
            </span>
            <p className="mt-1 text-2xl font-bold text-[#78350F]">
              {pendingCount}
            </p>
            <span className="text-[11px] text-[#B45309]">
              Organisasi butuh kurasi dokumen
            </span>
          </div>
          <Clock className="h-8 w-8 text-[#D97706]/40" />
        </div>

        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#166534]">
              Terverifikasi (VERIFIED)
            </span>
            <p className="mt-1 text-2xl font-bold text-[#14532D]">
              {verifiedCount}
            </p>
            <span className="text-[11px] text-[#15803D]">
              Memenuhi syarat BR-01
            </span>
          </div>
          <CheckCircle2 className="h-8 w-8 text-[#16A34A]/40" />
        </div>

        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#991B1B]">
              Ditangguhkan / Ditolak
            </span>
            <p className="mt-1 text-2xl font-bold text-[#7F1D1D]">
              {suspendedCount}
            </p>
            <span className="text-[11px] text-[#DC2626]">
              Akses dibatasi sementara
            </span>
          </div>
          <ShieldAlert className="h-8 w-8 text-[#DC2626]/40" />
        </div>
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

      {/* Main Table Per P23 */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Antrean Verifikasi Dokumen & Organisasi
            </h2>
            <p className="text-xs text-[#6B7280]">
              Tinjau dokumen legalitas OSS, NIB, NPWP, dan fasilitas workshop
              untuk menerbitkan status VERIFIED.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4B5563]">
            <thead className="bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3.5">Organisasi & Tipe</th>
                <th className="px-4 py-3.5">Kota & Provinsi</th>
                <th className="px-4 py-3.5">Dokumen Diunggah</th>
                <th className="px-4 py-3.5">Status Akun</th>
                <th className="px-6 py-3.5 text-right">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {queue.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-xs text-[#6B7280]"
                  >
                    Tidak ada organisasi dalam antrean verifikasi.
                  </td>
                </tr>
              ) : (
                queue.map((org) => {
                  const verifiedDocs = org.documents.filter(
                    (d) => d.status === "VERIFIED"
                  ).length;
                  const totalDocs = org.documents.length;

                  return (
                    <tr
                      key={org.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#111827] text-sm">
                          {org.name}
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5 flex items-center gap-2">
                          <span className="font-semibold text-[#1D4ED8]">
                            {org.type}
                          </span>
                          <span>·</span>
                          <span>
                            PIC: {org.picName} ({org.picPhone || "-"})
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs text-[#374151] font-medium">
                          {org.city}, {org.province}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-[#6B7280]" />
                          <span className="font-semibold text-[#111827]">
                            {verifiedDocs} / {totalDocs} Disetujui
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B7280]">
                          {totalDocs === 0
                            ? "Belum unggah berkas"
                            : `${totalDocs} berkas diajukan`}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {org.verificationStatus === "VERIFIED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-bold text-[#15803D]">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            VERIFIED
                          </span>
                        ) : org.verificationStatus === "SUSPENDED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[11px] font-bold text-[#B91C1C]">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            SUSPENDED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-bold text-[#B45309]">
                            <Clock className="h-3.5 w-3.5" />
                            PENDING
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setActiveDoc(org.documents[0] || null);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#1D4ED8] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Tinjau Dokumen ({org.documents.length})
                          </button>

                          <button
                            onClick={() =>
                              handleToggleSuspend(
                                org.id,
                                org.verificationStatus
                              )
                            }
                            disabled={loading}
                            title={
                              org.verificationStatus === "SUSPENDED"
                                ? "Aktifkan Akun"
                                : "Tangguhkan Akun"
                            }
                            className={`p-1.5 rounded-lg border transition-colors ${
                              org.verificationStatus === "SUSPENDED"
                                ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D] hover:bg-[#DCFCE7]"
                                : "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] hover:bg-[#FEE2E2]"
                            }`}
                          >
                            {org.verificationStatus === "SUSPENDED" ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel / Modal Tinjau Dokumen (P23 Layar 1) */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E5E7EB]">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4 bg-[#F9FAFB]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#6B7280]">
                  Panel Kurasi Admin (P23)
                </span>
                <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#1D4ED8]" />
                  {selectedOrg.name} ({selectedOrg.type})
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedOrg(null);
                  setActiveDoc(null);
                  setRejectingDocId(null);
                }}
                className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#E5E7EB] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body 2 Kolom (Kiri: Pratinjau / Info Dokumen; Kanan: Daftar Dokumen & Tindakan) */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
              {/* Kolom Kiri: Dokumen Detail & Viewer */}
              <div className="md:col-span-7 border-r border-[#E5E7EB] p-6 bg-[#FAFAFA] flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#374151] mb-2">
                    Pratinjau Dokumen Aktif
                  </h3>

                  {activeDoc ? (
                    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                        <span className="rounded bg-[#EFF6FF] px-2 py-0.5 text-xs font-bold text-[#1D4ED8]">
                          {activeDoc.type}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            activeDoc.status === "VERIFIED"
                              ? "bg-[#DCFCE7] text-[#15803D]"
                              : activeDoc.status === "REJECTED"
                                ? "bg-[#FEE2E2] text-[#B91C1C]"
                                : "bg-[#FEF3C7] text-[#B45309]"
                          }`}
                        >
                          Status: {activeDoc.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#4B5563] space-y-1">
                        <p>
                          <strong>Nama Berkas:</strong> {activeDoc.fileName}
                        </p>
                        <p>
                          <strong>Ukuran:</strong>{" "}
                          {(activeDoc.fileSize / 1024).toFixed(1)} KB
                        </p>
                        {activeDoc.validUntil && (
                          <p>
                            <strong>Berlaku Hingga:</strong>{" "}
                            {new Date(activeDoc.validUntil).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        )}
                      </div>

                      {activeDoc.rejectionReason && (
                        <div className="rounded border border-[#FCA5A5] bg-[#FEF2F2] p-2.5 text-xs text-[#991B1B]">
                          <strong>Catatan Penolakan:</strong>{" "}
                          {activeDoc.rejectionReason}
                        </div>
                      )}

                      <div className="pt-2">
                        <a
                          href={`/api/documents/${activeDoc.id}/file`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors"
                        >
                          Buka / Unduh Berkas Penuh{" "}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#D1D5DB] p-8 text-center text-xs text-[#6B7280]">
                      Pilih berkas dari daftar di sisi kanan untuk melihat
                      rincian dokumen.
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-lg bg-[#EFF6FF] p-3 text-[11px] text-[#1E40AF] border border-[#BFDBFE]">
                  💡 <strong>Aturan Bisnis 7.1:</strong> UMKM memerlukan 4
                  dokumen (NIB, NPWP, Izin Usaha, Foto Bengkel) terverifikasi
                  untuk menjadi VERIFIED. Industri memerlukan NIB/Akta, NPWP,
                  dan Kontak PIC.
                </div>
              </div>

              {/* Kolom Kanan: Daftar Dokumen & Tombol Setujui/Tolak */}
              <div className="md:col-span-5 p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                  Daftar Berkas Organisasi ({selectedOrg.documents.length})
                </h3>

                {selectedOrg.documents.length === 0 ? (
                  <p className="text-xs text-[#6B7280]">
                    Organisasi belum mengunggah dokumen apa pun.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedOrg.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`rounded-lg border p-3.5 transition-all ${
                          activeDoc?.id === doc.id
                            ? "border-[#1D4ED8] bg-[#EFF6FF]/20"
                            : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
                        }`}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => setActiveDoc(doc)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#111827]">
                              {doc.type}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                doc.status === "VERIFIED"
                                  ? "bg-[#DCFCE7] text-[#15803D]"
                                  : doc.status === "REJECTED"
                                    ? "bg-[#FEE2E2] text-[#B91C1C]"
                                    : "bg-[#FEF3C7] text-[#B45309]"
                              }`}
                            >
                              {doc.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                            {doc.fileName}
                          </p>
                        </div>

                        {/* Action Buttons Setujui / Tolak */}
                        <div className="mt-3 flex items-center gap-2 border-t border-[#E5E7EB] pt-2.5">
                          <button
                            onClick={() => handleApproveDoc(doc.id)}
                            disabled={loading || doc.status === "VERIFIED"}
                            className="inline-flex items-center gap-1 rounded bg-[#16A34A] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#15803D] disabled:opacity-40 transition-colors"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Setujui
                          </button>

                          <button
                            onClick={() => {
                              setRejectingDocId(doc.id);
                              setActiveDoc(doc);
                            }}
                            disabled={loading}
                            className="inline-flex items-center gap-1 rounded bg-[#DC2626] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#B91C1C] disabled:opacity-40 transition-colors"
                          >
                            <XCircle className="h-3 w-3" />
                            Tolak
                          </button>
                        </div>

                        {/* Form Tolak Wajib Alasan (P23) */}
                        {rejectingDocId === doc.id && (
                          <div className="mt-3 rounded border border-[#FECACA] bg-[#FEF2F2] p-3 space-y-2">
                            <label className="block text-[11px] font-bold text-[#991B1B]">
                              Alasan Penolakan (Wajib Diisi):
                            </label>
                            <textarea
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                              placeholder="Tulis alasan mengapa dokumen ini belum dapat diterima..."
                              rows={2}
                              className="w-full rounded border border-[#FCA5A5] bg-white p-2 text-xs text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#DC2626]"
                            />

                            {/* Chips Alasan Cepat (P23 Layar 1) */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-[#6B7280]">
                                Pilihan Alasan Cepat:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {QUICK_REJECTION_REASONS.map((chip) => (
                                  <button
                                    key={chip}
                                    type="button"
                                    onClick={() => setRejectionReason(chip)}
                                    className="rounded bg-white border border-[#D1D5DB] px-1.5 py-0.5 text-[9px] text-[#4B5563] hover:border-[#DC2626] hover:text-[#DC2626]"
                                  >
                                    {chip}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setRejectingDocId(null)}
                                className="rounded px-2 py-1 text-[11px] font-medium text-[#4B5563] hover:bg-[#E5E7EB]"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectDoc(doc.id)}
                                disabled={loading || !rejectionReason.trim()}
                                className="inline-flex items-center gap-1 rounded bg-[#DC2626] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#B91C1C] disabled:opacity-40"
                              >
                                {loading && (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                )}
                                Konfirmasi Penolakan
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
