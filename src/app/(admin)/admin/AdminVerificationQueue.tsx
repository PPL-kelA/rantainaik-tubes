"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
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
import { StatusBadge } from "@/components/ui";

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

export interface OrgQueueItem {
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
        setQueue((prev) =>
          prev.map((org) => {
            const hasDoc = org.documents.some((d) => d.id === docId);
            if (!hasDoc) return org;

            const updatedDocs = org.documents.map((d) =>
              d.id === docId ? { ...d, status: "VERIFIED" as const } : d
            );

            const allVerified =
              updatedDocs.length > 0 &&
              updatedDocs.every((d) => d.status === "VERIFIED");

            return {
              ...org,
              verificationStatus: allVerified
                ? "VERIFIED"
                : org.verificationStatus,
              documents: updatedDocs,
            };
          })
        );

        if (selectedOrg) {
          setSelectedOrg((prev) =>
            prev
              ? {
                  ...prev,
                  documents: prev.documents.map((d) =>
                    d.id === docId ? { ...d, status: "VERIFIED" as const } : d
                  ),
                }
              : null
          );
        }

        setMessage({
          type: "success",
          text: "Dokumen berhasil disetujui (VERIFIED).",
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
        text: "Alasan penolakan wajib diisi sesuai regulasi.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await reviewDocumentAction({
        documentId: docId,
        status: "REJECTED",
        rejectionReason,
      });

      if (res.success) {
        setQueue((prev) =>
          prev.map((org) => {
            const hasDoc = org.documents.some((d) => d.id === docId);
            if (!hasDoc) return org;

            return {
              ...org,
              documents: org.documents.map((d) =>
                d.id === docId
                  ? { ...d, status: "REJECTED" as const, rejectionReason }
                  : d
              ),
            };
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
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* 3 Summary Badges (P23 spec) - Format Seamless Grid 1px */}
      <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] sm:grid-cols-3 sm:divide-y-0 sm:divide-x bg-white">
        <div className="p-5 flex items-center justify-between hover:bg-[#FAFBFC] transition-colors">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B45309]">
              Menunggu Verifikasi
            </span>
            <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
              {pendingCount}
            </p>
            <span className="font-mono text-[11px] text-[#5B6475]">
              Organisasi butuh kurasi dokumen
            </span>
          </div>
          <Clock className="h-6 w-6 text-[#B45309]/60 shrink-0" />
        </div>

        <div className="p-5 flex items-center justify-between hover:bg-[#FAFBFC] transition-colors">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#15803D]">
              Terverifikasi (VERIFIED)
            </span>
            <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
              {verifiedCount}
            </p>
            <span className="font-mono text-[11px] text-[#5B6475]">
              Memenuhi syarat aturan BR-01
            </span>
          </div>
          <CheckCircle2 className="h-6 w-6 text-[#15803D]/60 shrink-0" />
        </div>

        <div className="p-5 flex items-center justify-between hover:bg-[#FAFBFC] transition-colors">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#B91C1C]">
              Ditangguhkan / Ditolak
            </span>
            <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-[#0E1422]">
              {suspendedCount}
            </p>
            <span className="font-mono text-[11px] text-[#5B6475]">
              Akses transaksi dibatasi sementara
            </span>
          </div>
          <ShieldAlert className="h-6 w-6 text-[#B91C1C]/60 shrink-0" />
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 p-4 text-xs font-medium ${
            message.type === "success"
              ? "bg-[#F0FDF4] text-[#15803D] border-b border-[#DCFCE7]"
              : "bg-[#FEF2F2] text-[#B91C1C] border-b border-[#FEE2E2]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D]" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#B91C1C]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Table Per P23 */}
      <div className="bg-white overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-heading font-semibold text-[#0E1422]">
              Antrean Verifikasi Dokumen & Organisasi
            </h2>
            <p className="text-xs text-[#5B6475] mt-0.5">
              Tinjau dokumen legalitas OSS, NIB, NPWP, dan fasilitas workshop
              untuk menerbitkan status VERIFIED.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5B6475]">
            <thead className="bg-[#FAFBFC] text-[11px] font-mono font-semibold uppercase tracking-[0.06em] text-[#5B6475] border-b border-[#E5E7EB]">
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
                    className="px-6 py-8 text-center text-xs text-[#5B6475]"
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
                      className="hover:bg-[#FAFBFC] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-heading font-semibold text-[#0E1422] text-sm">
                          {org.name}
                        </div>
                        <div className="text-[11px] text-[#5B6475] mt-0.5 flex items-center gap-2">
                          <span className="font-semibold text-[#2862E0]">
                            {org.type}
                          </span>
                          <span>·</span>
                          <span>
                            PIC: {org.picName} ({org.picPhone || "-"})
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs text-[#0E1422] font-medium">
                          {org.city}, {org.province}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-[#8B93A1]" />
                          <span className="font-mono font-semibold text-[#0E1422]">
                            {verifiedDocs} / {totalDocs} Disetujui
                          </span>
                        </div>
                        <span className="text-[10px] text-[#5B6475]">
                          {totalDocs === 0
                            ? "Belum unggah berkas"
                            : `${totalDocs} berkas diajukan`}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={org.verificationStatus} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrg(org);
                              setActiveDoc(org.documents[0] || null);
                            }}
                            className="inline-flex items-center gap-1 rounded-[4px] bg-[#EFF4FE] px-3 py-1.5 text-xs font-semibold text-[#2862E0] hover:bg-[#EFF4FE]/80 border border-[#2862E0]/20 transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Tinjau Dokumen ({org.documents.length})
                          </button>

                          <button
                            type="button"
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
                            className={`p-1.5 rounded-[4px] border transition-colors ${
                              org.verificationStatus === "SUSPENDED"
                                ? "bg-[#F0FDF4] border-[#DCFCE7] text-[#15803D] hover:bg-[#DCFCE7]"
                                : "bg-[#FEF2F2] border-[#FEE2E2] text-[#B91C1C] hover:bg-[#FEE2E2]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-[4px] bg-white shadow-2xl overflow-hidden border border-[#E5E7EB]">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4 bg-[#FAFBFC]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6475]">
                  Panel Kurasi Admin (P23)
                </span>
                <h2 className="text-lg font-heading font-semibold text-[#0E1422] flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#2862E0]" />
                  {selectedOrg.name} ({selectedOrg.type})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrg(null);
                  setActiveDoc(null);
                  setRejectingDocId(null);
                }}
                className="rounded-[4px] p-1.5 text-[#5B6475] hover:bg-[#E5E7EB] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body 2 Kolom (Kiri: Pratinjau / Info Dokumen; Kanan: Daftar Dokumen & Tindakan) */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
              {/* Kolom Kiri: Dokumen Detail & Viewer */}
              <div className="md:col-span-7 p-6 bg-[#FAFBFC] flex flex-col justify-between">
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6475] mb-2">
                    Pratinjau Dokumen Aktif
                  </h3>

                  {activeDoc ? (
                    <div className="rounded-[4px] border border-[#E5E7EB] bg-white p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                        <span className="rounded-[2px] bg-[#EFF4FE] px-2 py-0.5 text-xs font-mono font-semibold text-[#2862E0]">
                          {activeDoc.type}
                        </span>
                        <StatusBadge status={activeDoc.status} />
                      </div>

                      <div className="text-xs text-[#5B6475] space-y-1">
                        <p>
                          <strong className="text-[#0E1422]">
                            Nama Berkas:
                          </strong>{" "}
                          {activeDoc.fileName}
                        </p>
                        <p>
                          <strong className="text-[#0E1422]">Ukuran:</strong>{" "}
                          {(activeDoc.fileSize / 1024).toFixed(1)} KB
                        </p>
                        {activeDoc.validUntil && (
                          <p>
                            <strong className="text-[#0E1422]">
                              Berlaku Hingga:
                            </strong>{" "}
                            {new Date(activeDoc.validUntil).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        )}
                      </div>

                      {activeDoc.rejectionReason && (
                        <div className="rounded-[2px] border border-[#FEE2E2] bg-[#FEF2F2] p-2.5 text-xs text-[#B91C1C]">
                          <strong>Catatan Penolakan:</strong>{" "}
                          {activeDoc.rejectionReason}
                        </div>
                      )}

                      <div className="pt-2">
                        <a
                          href={`/api/documents/${activeDoc.id}/file`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2862E0] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#2858B8] transition-colors"
                        >
                          Buka / Unduh Berkas Penuh{" "}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[4px] border border-dashed border-[#8B93A1] p-8 text-center text-xs text-[#5B6475]">
                      Pilih berkas dari daftar di sisi kanan untuk melihat
                      rincian dokumen.
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-[4px] bg-[#EFF4FE] p-3 text-[11px] text-[#1E40AF] border border-[#2862E0]/20">
                  💡 <strong>Aturan Bisnis 7.1:</strong> UMKM memerlukan 4
                  dokumen (NIB, NPWP, Izin Usaha, Foto Bengkel) terverifikasi
                  untuk menjadi VERIFIED. Industri memerlukan NIB/Akta, NPWP,
                  dan Kontak PIC.
                </div>
              </div>

              {/* Kolom Kanan: Daftar Dokumen & Tombol Setujui/Tolak */}
              <div className="md:col-span-5 p-6 space-y-4 bg-white">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
                  Daftar Berkas Organisasi ({selectedOrg.documents.length})
                </h3>

                {selectedOrg.documents.length === 0 ? (
                  <p className="text-xs text-[#5B6475]">
                    Organisasi belum mengunggah dokumen apa pun.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedOrg.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`rounded-[4px] border p-3.5 transition-all ${
                          activeDoc?.id === doc.id
                            ? "border-[#2862E0] bg-[#EFF4FE]/20"
                            : "border-[#E5E7EB] hover:bg-[#FAFBFC]"
                        }`}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => setActiveDoc(doc)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-semibold text-xs text-[#0E1422]">
                              {doc.type}
                            </span>
                            <StatusBadge status={doc.status} />
                          </div>
                          <p className="text-[11px] text-[#5B6475] truncate mt-0.5">
                            {doc.fileName}
                          </p>
                        </div>

                        {/* Action Buttons Setujui / Tolak */}
                        <div className="mt-3 flex items-center gap-2 border-t border-[#E5E7EB] pt-2.5">
                          <button
                            type="button"
                            onClick={() => handleApproveDoc(doc.id)}
                            disabled={loading || doc.status === "VERIFIED"}
                            className="inline-flex items-center gap-1 rounded-[4px] bg-[#15803D] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#166534] disabled:opacity-40 transition-colors"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Setujui
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectingDocId(doc.id);
                              setActiveDoc(doc);
                            }}
                            disabled={loading}
                            className="inline-flex items-center gap-1 rounded-[4px] bg-[#B91C1C] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#991B1B] disabled:opacity-40 transition-colors"
                          >
                            <XCircle className="h-3 w-3" />
                            Tolak
                          </button>
                        </div>

                        {/* Form Tolak Wajib Alasan (P23) */}
                        {rejectingDocId === doc.id && (
                          <div className="mt-3 rounded-[4px] border border-[#FEE2E2] bg-[#FEF2F2] p-3 space-y-2">
                            <label className="block text-[11px] font-semibold text-[#B91C1C]">
                              Alasan Penolakan (Wajib Diisi):
                            </label>
                            <textarea
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                              placeholder="Tulis alasan mengapa dokumen ini belum dapat diterima..."
                              rows={2}
                              className="w-full rounded-[4px] border border-[#8B93A1] bg-white p-2 text-xs text-[#0E1422] focus:outline-none focus:ring-1 focus:ring-[#B91C1C]"
                            />

                            {/* Chips Alasan Cepat (P23 Layar 1) */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-[#5B6475]">
                                Pilihan Alasan Cepat:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {QUICK_REJECTION_REASONS.map((chip) => (
                                  <button
                                    key={chip}
                                    type="button"
                                    onClick={() => setRejectionReason(chip)}
                                    className="rounded-[2px] bg-white border border-[#8B93A1] px-1.5 py-0.5 text-[10px] text-[#0E1422] hover:border-[#B91C1C] hover:text-[#B91C1C]"
                                  >
                                    {chip}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1 border-t border-[#FEE2E2]">
                              <button
                                type="button"
                                onClick={() => setRejectingDocId(null)}
                                className="rounded-[4px] px-2 py-1 text-[11px] font-medium text-[#5B6475] hover:bg-[#E5E7EB]"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectDoc(doc.id)}
                                disabled={loading || !rejectionReason.trim()}
                                className="inline-flex items-center gap-1 rounded-[4px] bg-[#B91C1C] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#991B1B] disabled:opacity-40"
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
