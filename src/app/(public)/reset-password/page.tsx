"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  KeyRound,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  requestPasswordResetAction,
  resetPasswordAction,
} from "@/modules/auth/actions";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await requestPasswordResetAction(email);
      if (res.success) {
        setSuccessMessage(
          res.message ||
            "Tautan pembaruan kata sandi telah dikirimkan ke email Anda."
        );
      } else {
        setErrorMessage(res.error || "Gagal memproses permintaan.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPasswordAction({
        token: token || "",
        newPassword,
      });

      if (res.success) {
        setSuccessMessage(res.message || "Kata sandi berhasil diperbarui.");
      } else {
        setErrorMessage(res.error || "Gagal memperbarui kata sandi.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-[480px]">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#111827]">
                {token ? "Atur Ulang Kata Sandi" : "Lupa Kata Sandi"}
              </h1>
              <p className="text-xs text-[#6B7280]">
                {token
                  ? "Masukkan kata sandi baru untuk akun Anda."
                  : "Masukkan email terdaftar untuk menerima tautan reset."}
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs text-[#B91C1C]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-xs text-[#15803D]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {!token ? (
            /* Mode Request Reset Link */
            <form onSubmit={handleRequestReset} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Alamat Email Terdaftar
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="h-10 w-full rounded-lg border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF] disabled:opacity-60 transition-colors"
              >
                {loading ? "Mengirim Tautan..." : "Kirim Tautan Atur Ulang"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          ) : (
            /* Mode Update Password with Token */
            <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter, ada huruf & angka"
                  className="h-10 w-full rounded-lg border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="h-10 w-full rounded-lg border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF] disabled:opacity-60 transition-colors"
              >
                {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-[#E5E7EB] pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-[#6B7280]">
          Memuat halaman reset kata sandi...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
