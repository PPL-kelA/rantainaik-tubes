"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === "unauthorized"
      ? "Anda tidak memiliki izin untuk mengakses halaman tersebut."
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!res?.error) {
        if (callbackUrl && callbackUrl !== "/") {
          router.push(callbackUrl);
        } else {
          try {
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();
            const role = sessionData?.user?.role;
            if (role === "ADMIN") router.push("/admin");
            else if (role === "UMKM") router.push("/umkm");
            else if (role === "INDUSTRY") router.push("/industri");
            else router.push("/");
          } catch {
            router.push("/");
          }
        }
        router.refresh();
      } else {
        setErrorMessage(
          "Email atau kata sandi tidak cocok, atau akun sedang terkunci."
        );
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan saat mencoba masuk.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage("");
  };

  return (
    <div className="py-6">
      <div className="mx-auto grid max-w-[960px] grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upwork/Fiverr style Context & Trust Banner */}
        <div className="md:col-span-5 space-y-6 pt-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1D4ED8] border border-[#BFDBFE]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Platform Pengadaan B2B Broker
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Satu Akses Pengadaan Tekstil Aman & Terukur
            </h1>
            <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
              Masuk untuk mengelola kebutuhan pengadaan, mengirim penawaran
              terstruktur, dan memantau rilis pembayaran escrow.
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Keamanan & Standar Platform
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#15803D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#111827]">
                    Escrow Berbasis Milestone
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Dana pembeli ditahan aman dan hanya dirilis setelah QC
                    lolos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#15803D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#111827]">
                    Pemasok Terverifikasi
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Kapabilitas mesin dan riwayat kerja diverifikasi oleh admin.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#15803D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#111827]">
                    Penawaran Tertutup & Adil
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Kerahasiaan penawaran antar-UMKM terjamin (BR-02).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="rounded-xl border border-[#D1D5DB] bg-[#F3F4F6] p-4 text-xs">
            <p className="font-semibold text-[#111827] mb-2 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#1D4ED8]" />
              Akun Uji Coba Cepat (Local Seed)
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  fillQuickDemo("industri@nusantara.id", "Password123")
                }
                className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 font-medium text-[#111827] hover:border-[#1D4ED8] transition-colors"
              >
                Industri
              </button>
              <button
                type="button"
                onClick={() =>
                  fillQuickDemo("umkm@karyamandiri.id", "Password123")
                }
                className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 font-medium text-[#111827] hover:border-[#1D4ED8] transition-colors"
              >
                UMKM (Verified)
              </button>
              <button
                type="button"
                onClick={() =>
                  fillQuickDemo("umkm.pending@sinar.id", "Password123")
                }
                className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 font-medium text-[#111827] hover:border-[#1D4ED8] transition-colors"
              >
                UMKM (Pending)
              </button>
              <button
                type="button"
                onClick={() =>
                  fillQuickDemo("admin@rantainaik.id", "Password123")
                }
                className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 font-medium text-[#111827] hover:border-[#1D4ED8] transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Login Form */}
        <div className="md:col-span-7">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-7 shadow-sm">
            <div className="border-b border-[#E5E7EB] pb-5">
              <h2 className="text-xl font-bold text-[#111827]">
                Masuk ke Akun
              </h2>
              <p className="mt-1 text-xs text-[#6B7280]">
                Silakan masukkan email dan kata sandi terdaftar Anda.
              </p>
            </div>

            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs text-[#B91C1C]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Alamat Email Usaha / Pribadi
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@perusahaan.com"
                  className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#111827]">
                    Kata Sandi
                  </label>
                  <Link
                    href="/reset-password"
                    className="text-xs font-medium text-[#1D4ED8] hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#1E40AF] disabled:opacity-60 transition-colors"
              >
                {loading ? "Memverifikasi..." : "Masuk Sekarang"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-6 border-t border-[#E5E7EB] pt-5 text-center">
              <p className="text-xs text-[#6B7280]">
                Belum memiliki akun RantaiNaik?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#1D4ED8] hover:underline"
                >
                  Daftar sebagai UMKM atau Industri
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-[#6B7280]">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
