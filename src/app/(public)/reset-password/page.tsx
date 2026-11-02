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
import { Button, Input, Panel } from "@/components/ui";

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
    <div className="w-full max-w-[480px] py-8">
      <Panel className="p-6 sm:p-7">
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#EFF4FE] text-[#2862E0] border border-[#BFDBFE]">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-[#0E1422]">
              {token ? "Atur Ulang Kata Sandi" : "Lupa Kata Sandi"}
            </h1>
            <p className="text-xs text-[#5B6475]">
              {token
                ? "Masukkan kata sandi baru untuk akun Anda."
                : "Masukkan email terdaftar untuk menerima tautan reset."}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-[4px] border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs text-[#B91C1C]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-[4px] border border-[#BBF7D0] bg-[#F0FDF4] p-3 text-xs text-[#15803D]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {!token ? (
          <form onSubmit={handleRequestReset} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                Alamat Email Terdaftar
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
              />
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="w-full h-10 text-xs font-semibold rounded-[4px]"
            >
              {loading ? "Mengirim Permintaan..." : "Kirim Tautan Atur Ulang"}
              {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                Kata Sandi Baru
              </label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
              />
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="w-full h-10 text-xs font-semibold rounded-[4px]"
            >
              {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
            </Button>
          </form>
        )}

        <div className="mt-6 border-t border-[#E5E7EB] pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B6475] hover:text-[#0E1422]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </Panel>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-[#5B6475]">
          Memuat formulir atur ulang kata sandi...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
