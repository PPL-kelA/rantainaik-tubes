"use client";

import { useState } from "react";
import { Check, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import { verifyUserAction, suspendUserAction } from "@/modules/auth/actions";
import { StatusBadge } from "@/components/ui";

export interface UserItem {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  organization: {
    name: string;
    city: string;
    province: string;
    picName: string;
    picPhone: string | null;
  } | null;
}

export function AdminVerificationTable({
  initialUsers,
}: {
  initialUsers: UserItem[];
}) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleVerify = async (userId: string) => {
    setProcessingId(userId);
    setMessage(null);
    try {
      const res = await verifyUserAction(userId);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: "VERIFIED" } : u))
        );
        setMessage({
          text: res.message || "Akun berhasil di-ACC / diverifikasi.",
          type: "success",
        });
      } else {
        setMessage({
          text: res.error || "Gagal memverifikasi akun.",
          type: "error",
        });
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan jaringan.", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleSuspend = async (userId: string) => {
    setProcessingId(userId);
    setMessage(null);
    try {
      const res = await suspendUserAction(userId);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: "SUSPENDED" } : u))
        );
        setMessage({
          text: res.message || "Akun berhasil ditangguhkan.",
          type: "success",
        });
      } else {
        setMessage({
          text: res.error || "Gagal menangguhkan akun.",
          type: "error",
        });
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan jaringan.", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingUsers = users.filter((u) => u.status === "PENDING");
  const otherUsers = users.filter((u) => u.status !== "PENDING");

  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {message && (
        <div
          className={`flex items-center gap-2 p-4 text-xs font-medium ${
            message.type === "success"
              ? "border-b border-[#DCFCE7] bg-[#F0FDF4] text-[#15803D]"
              : "border-b border-[#FEE2E2] bg-[#FEF2F2] text-[#B91C1C]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D]" />
          ) : (
            <ShieldAlert className="h-4 w-4 shrink-0 text-[#B91C1C]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Bagian 1: Antrean Akun Menunggu Verifikasi (ACC) */}
      <div className="bg-white">
        <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-heading font-semibold text-[#0E1422]">
                Antrean Verifikasi Akun Baru
              </h2>
              <span className="rounded-[2px] bg-[#FFFBEB] px-2 py-0.5 text-xs font-mono font-semibold text-[#B45309]">
                {pendingUsers.length} Menunggu
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#5B6475]">
              Akun berstatus PENDING perlu diverifikasi oleh admin sebelum dapat
              memposting RFQ atau menawar (BR-01).
            </p>
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#5B6475]">
            Tidak ada akun baru dalam antrean verifikasi saat ini.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB] overflow-x-auto">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-[#FAFBFC] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-sm text-[#0E1422]">
                      {user.organization?.name || "Nama Usaha Belum Diisi"}
                    </span>
                    <span className="rounded-[2px] bg-[#EFF4FE] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#2862E0]">
                      {user.role}
                    </span>
                    <StatusBadge status="PENDING" />
                  </div>

                  <p className="text-xs text-[#5B6475]">
                    PIC:{" "}
                    <span className="font-medium text-[#0E1422]">
                      {user.organization?.picName}
                    </span>{" "}
                    · Email:{" "}
                    <span className="text-[#2862E0]">{user.email}</span> · Telp:{" "}
                    {user.organization?.picPhone || "-"}
                  </p>
                  <p className="font-mono text-[11px] text-[#8B93A1]">
                    Lokasi: {user.organization?.city},{" "}
                    {user.organization?.province} · Terdaftar:{" "}
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleVerify(user.id)}
                    disabled={processingId === user.id}
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#15803D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#166534] disabled:opacity-50 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    ACC Verifikasi Akun
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuspend(user.id)}
                    disabled={processingId === user.id}
                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#8B93A1] bg-white px-3 py-2 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Tolak / Tangguhkan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bagian 2: Daftar Akun Lainnya (Verified / Suspended) */}
      <div className="bg-white">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-base font-heading font-semibold text-[#0E1422]">
            Daftar Pengguna Aktif & Ditangguhkan
          </h2>
          <p className="mt-0.5 text-xs text-[#5B6475]">
            Seluruh akun terdaftar di platform RantaiNaik.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5B6475]">
            <thead className="bg-[#FAFBFC] text-[11px] font-mono font-semibold uppercase tracking-[0.06em] text-[#5B6475] border-b border-[#E5E7EB]">
              <tr>
                <th className="px-6 py-3.5">Organisasi / Usaha</th>
                <th className="px-4 py-3.5">Email Pengguna</th>
                <th className="px-4 py-3.5">Peran</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {otherUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#FAFBFC] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-[#0E1422]">
                    {user.organization?.name || "-"}
                  </td>
                  <td className="px-4 py-4 text-[#5B6475]">{user.email}</td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-[11px] font-semibold text-[#2862E0]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.status === "VERIFIED" ? (
                      <button
                        type="button"
                        onClick={() => handleSuspend(user.id)}
                        disabled={processingId === user.id}
                        className="rounded-[4px] border border-[#8B93A1] px-2.5 py-1 text-xs text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-50"
                      >
                        Tangguhkan
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleVerify(user.id)}
                        disabled={processingId === user.id}
                        className="rounded-[4px] bg-[#15803D] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#166534] disabled:opacity-50"
                      >
                        Aktifkan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
