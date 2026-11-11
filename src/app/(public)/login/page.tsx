"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Terminal,
} from "lucide-react";
import {
  Button,
  Input,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelDescription,
  PanelContent,
  Badge,
} from "@/components/ui";

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
    <div className="w-full max-w-[1020px] mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context, Trust Signals & Dev Demo */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <Badge
              variant="outline"
              className="mb-3 gap-1.5 px-2.5 py-0.5 text-[11px] rounded-[2px] border-[#8B93A1]"
            >
              <ShieldCheck className="h-3 w-3 text-[#2862E0]" />
              Platform Pengadaan B2B Broker
            </Badge>

            <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#0E1422] leading-tight">
              Satu akses pengadaan tekstil aman & terukur
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-[#5B6475] leading-relaxed">
              Masuk untuk mengelola kebutuhan pengadaan industri, mengirim
              penawaran terstruktur UMKM, dan memantau rilis pembayaran escrow.
            </p>
          </div>

          {/* Trust Signal Panel: Compartmentalized */}
          <Panel className="p-4 sm:p-5 space-y-3.5">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Keamanan & Standar Platform
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                <div>
                  <p className="text-xs font-semibold text-[#0E1422]">
                    Escrow Berbasis Milestone
                  </p>
                  <p className="text-xs text-[#5B6475] leading-normal">
                    Dana pembeli ditahan aman dan dirilis transparan setelah QC
                    lolos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                <div>
                  <p className="text-xs font-semibold text-[#0E1422]">
                    Pemasok Terverifikasi
                  </p>
                  <p className="text-xs text-[#5B6475] leading-normal">
                    Kapabilitas mesin dan riwayat kerja diverifikasi oleh admin.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                <div>
                  <p className="text-xs font-semibold text-[#0E1422]">
                    Penawaran Tertutup & Adil
                  </p>
                  <p className="text-xs text-[#5B6475] leading-normal">
                    Kerahasiaan penawaran antar-UMKM terjamin (BR-02).
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          {/* Quick Demo Credentials Panel */}
          <div className="border border-[#E5E7EB] bg-[#FAFBFC] p-4 text-xs">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0E1422] flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-[#2862E0]" />
                Akun Demo Cepat
              </p>
              <span className="font-mono text-[10px] text-[#5B6475]">
                mock-auth
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  fillQuickDemo("industri@nusantara.id", "Password123")
                }
              >
                Industri
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  fillQuickDemo("umkm@karyamandiri.id", "Password123")
                }
              >
                UMKM (Verified)
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  fillQuickDemo("umkm.pending@sinar.id", "Password123")
                }
              >
                UMKM (Pending)
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  fillQuickDemo("admin@rantainaik.id", "Password123")
                }
              >
                Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Compartment Panel with Form */}
        <div className="md:col-span-7">
          <Panel className="p-6 sm:p-8">
            <PanelHeader className="pb-4 border-b border-[#E5E7EB]">
              <PanelTitle className="text-xl sm:text-2xl font-heading font-semibold text-[#0E1422]">
                Masuk ke Akun
              </PanelTitle>
              <PanelDescription className="text-xs sm:text-sm text-[#5B6475]">
                Silakan masukkan email dan kata sandi terdaftar Anda.
              </PanelDescription>
            </PanelHeader>

            {errorMessage && (
              <div className="mt-4 flex items-center gap-2.5 rounded-[4px] border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs text-[#B91C1C]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <PanelContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1.5">
                    Alamat Email Usaha / Pribadi
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@perusahaan.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#0E1422]">
                      Kata Sandi
                    </label>
                    <Link
                      href="/reset-password"
                      className="text-xs font-medium text-[#2862E0] hover:text-[#2858B8] hover:underline"
                    >
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={loading}
                    className="w-full h-10 text-sm font-semibold rounded-[4px]"
                  >
                    {loading ? "Memverifikasi..." : "Masuk Sekarang"}
                    {!loading && <ArrowRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              </form>

              <div className="mt-6 border-t border-[#E5E7EB] pt-4 text-center">
                <p className="text-xs text-[#5B6475]">
                  Belum memiliki akun RantaiNaik?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-[#2862E0] hover:text-[#2858B8] hover:underline"
                  >
                    Daftar sebagai UMKM atau Industri
                  </Link>
                </p>
              </div>
            </PanelContent>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-[#5B6475]">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
