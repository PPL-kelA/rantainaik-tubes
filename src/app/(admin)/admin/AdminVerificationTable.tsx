"use client";

import { useState } from "react";
import { Check, X, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { verifyUserAction, suspendUserAction } from "@/modules/auth/actions";

interface UserItem {
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
    <div className="space-y-6">
      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-xs ${
            message.type === "success"
              ? "border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]"
              : "border border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <ShieldAlert className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Bagian 1: Antrean Akun Menunggu Verifikasi (ACC) */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#111827]">
                Antrean Verifikasi Akun Baru
              </h2>
              <span className="rounded-full bg-[#FFFBEB] px-2.5 py-0.5 text-xs font-semibold text-[#B45309] border border-[#FDE68A]">
                {pendingUsers.length} Menunggu
              </span>
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              Akun berstatus PENDING perlu diverifikasi oleh admin sebelum dapat
              memposting RFQ atau menawar (BR-01).
            </p>
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6B7280]">
            Tidak ada akun baru dalam antrean verifikasi saat ini.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-[#E5E7EB] overflow-x-auto">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#111827]">
                      {user.organization?.name || "Nama Usaha Belum Diisi"}
                    </span>
                    <span className="rounded bg-[#EFF6FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1D4ED8]">
                      {user.role}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-medium text-[#B45309]">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  </div>

                  <p className="text-xs text-[#4B5563]">
                    PIC:{" "}
                    <span className="font-medium text-[#111827]">
                      {user.organization?.picName}
                    </span>{" "}
                    · Email:{" "}
                    <span className="text-[#1D4ED8]">{user.email}</span> · Telp:{" "}
                    {user.organization?.picPhone || "-"}
                  </p>

                  <p className="text-[11px] text-[#6B7280]">
                    Lokasi: {user.organization?.city},{" "}
                    {user.organization?.province} · Terdaftar:{" "}
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Tombol Aksi Verifikasi (ACC) & Tolak */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={processingId === user.id}
                    onClick={() => handleVerify(user.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#15803D] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#166534] disabled:opacity-50 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {processingId === user.id
                      ? "Memproses..."
                      : "Verifikasi (ACC)"}
                  </button>

                  <button
                    type="button"
                    disabled={processingId === user.id}
                    onClick={() => handleSuspend(user.id)}
                    className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-50 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bagian 2: Daftar Semua Pengguna Platform */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="border-b border-[#E5E7EB] pb-3 mb-4">
          <h2 className="text-base font-bold text-[#111827]">
            Daftar Pengguna Aktif & Terverifikasi
          </h2>
          <p className="text-xs text-[#6B7280]">
            Seluruh entitas akun UMKM, Industri, dan Admin yang terdaftar di
            platform.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="pb-2.5 font-semibold">Usaha / Pengguna</th>
                <th className="pb-2.5 font-semibold">Email</th>
                <th className="pb-2.5 font-semibold">Peran</th>
                <th className="pb-2.5 font-semibold">Lokasi</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {otherUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F9FAFB]">
                  <td className="py-3 font-medium text-[#111827]">
                    {user.organization?.name || user.email}
                  </td>
                  <td className="py-3 text-[#4B5563]">{user.email}</td>
                  <td className="py-3">
                    <span className="rounded bg-[#F3F4F6] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#374151]">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-[#6B7280]">
                    {user.organization
                      ? `${user.organization.city}, ${user.organization.province}`
                      : "-"}
                  </td>
                  <td className="py-3">
                    {user.status === "VERIFIED" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-medium text-[#15803D]">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF2F2] px-2 py-0.5 text-[11px] font-medium text-[#B91C1C]">
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {user.role !== "ADMIN" && (
                      <button
                        type="button"
                        onClick={() =>
                          user.status === "VERIFIED"
                            ? handleSuspend(user.id)
                            : handleVerify(user.id)
                        }
                        className="text-xs text-[#1D4ED8] hover:underline"
                      >
                        {user.status === "VERIFIED" ? "Tangguhkan" : "Aktifkan"}
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
