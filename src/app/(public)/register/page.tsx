"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Building2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { registerAction } from "@/modules/auth/actions";
import { Button, Input, Panel, Badge } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"UMKM" | "INDUSTRY">("UMKM");

  // Step 2 Form States
  const [picName, setPicName] = useState("");
  const [email, setEmail] = useState("");
  const [picPhone, setPicPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState<
    "PT" | "CV" | "PERORANGAN"
  >("CV");
  const [city, setCity] = useState("Bandung");
  const [province, setProvince] = useState("Jawa Barat");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerAction({
        email,
        password,
        role,
        picName,
        picPhone,
        organizationName,
        organizationType,
        city,
        province,
      });

      if (res.success) {
        router.push(
          `/verifikasi-pending?email=${encodeURIComponent(
            email
          )}&role=${role}&org=${encodeURIComponent(organizationName)}`
        );
      } else {
        setErrorMessage(
          res.error || "Gagal melakukan pendaftaran. Silakan periksa data Anda."
        );
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[960px] py-6 sm:py-8">
      <div>
        {/* Step Indicator Header (Strictly no pill) */}
        <div className="mb-6 flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              Pendaftaran Akun Baru
            </span>
            <h1 className="font-heading text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-[#0E1422]">
              {step === 1
                ? "Langkah 1: Pilih Peran Anda"
                : "Langkah 2: Lengkapi Data Akun & Usaha"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-[4px] font-mono text-xs font-semibold ${
                step === 1
                  ? "bg-[#2862E0] text-white"
                  : "bg-[#EFF4FE] text-[#2862E0] border border-[#BFDBFE]"
              }`}
            >
              1
            </span>
            <div className="h-0.5 w-6 bg-[#E5E7EB]" />
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-[4px] font-mono text-xs font-semibold ${
                step === 2
                  ? "bg-[#2862E0] text-white"
                  : "bg-[#FAFBFC] text-[#5B6475] border border-[#E5E7EB]"
              }`}
            >
              2
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-[4px] border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs text-[#B91C1C]">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Select Role */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card UMKM */}
            <div
              onClick={() => setRole("UMKM")}
              className={`cursor-pointer rounded-[4px] border p-6 transition-all ${
                role === "UMKM"
                  ? "border-[#2862E0] bg-[#EFF4FE]/30 ring-1 ring-[#2862E0]"
                  : "border-[#E5E7EB] bg-white hover:border-[#8B93A1]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-[#EFF4FE] text-[#2862E0] border border-[#BFDBFE]">
                  <Scissors className="h-5 w-5" />
                </div>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-[4px] border transition-colors ${
                    role === "UMKM"
                      ? "border-[#2862E0] bg-[#2862E0]"
                      : "border-[#8B93A1]"
                  }`}
                >
                  {role === "UMKM" && (
                    <div className="h-2 w-2 rounded-[2px] bg-white" />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Badge
                  variant="outline"
                  className="text-[11px] font-mono rounded-[2px] border-[#8B93A1]"
                >
                  Pemasok / Konveksi
                </Badge>
                <h3 className="mt-2 font-heading text-lg font-semibold text-[#0E1422]">
                  Saya UMKM Konveksi
                </h3>
                <p className="mt-1 text-xs text-[#5B6475] leading-relaxed">
                  Penyedia jasa jahit CMT atau full package yang ingin menerima
                  order skala industri, mendapat kepastian rilis dana escrow,
                  dan membangun rekam jejak.
                </p>
              </div>

              <ul className="mt-4 space-y-2 border-t border-[#E5E7EB] pt-4 text-xs text-[#5B6475]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[#15803D]" />
                  Akses katalog RFQ terstruktur & notifikasi matching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[#15803D]" />
                  Readiness Score untuk meningkatkan daya saing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[#15803D]" />
                  Pembayaran 100% aman dalam sistem escrow platform
                </li>
              </ul>
            </div>

            {/* Card Industri */}
            <div
              onClick={() => setRole("INDUSTRY")}
              className={`cursor-pointer rounded-[4px] border p-6 transition-all ${
                role === "INDUSTRY"
                  ? "border-[#2862E0] bg-[#EFF4FE]/30 ring-1 ring-[#2862E0]"
                  : "border-[#E5E7EB] bg-white hover:border-[#8B93A1]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-[#EFF4FE] text-[#2862E0] border border-[#BFDBFE]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-[4px] border transition-colors ${
                    role === "INDUSTRY"
                      ? "border-[#2862E0] bg-[#2862E0]"
                      : "border-[#8B93A1]"
                  }`}
                >
                  {role === "INDUSTRY" && (
                    <div className="h-2 w-2 rounded-[2px] bg-white" />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Badge
                  variant="outline"
                  className="text-[11px] font-mono rounded-[2px] border-[#8B93A1]"
                >
                  Pembeli / Korporasi
                </Badge>
                <h3 className="mt-2 font-heading text-lg font-semibold text-[#0E1422]">
                  Saya Industri / Pembeli
                </h3>
                <p className="mt-1 text-xs text-[#5B6475] leading-relaxed">
                  Perusahaan, instansi pemerintah, hotel, atau brand lokal yang
                  ingin mengadakan seragam, merchandise promosi, atau produksi
                  maklon dengan standar mutu terjamin.
                </p>
              </div>

              <ul className="mt-4 space-y-2 border-t border-[#E5E7EB] pt-4 text-xs text-[#5B6475]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[#15803D]" />
                  Posting RFQ item tunggal atau bagi ke 2-4 lot
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[#15803D]" />
                  Matriks perbandingan penawaran transparan & sampel
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[#15803D]" />
                  Kendali mutu QC dan pengembalian dana jika sengketa
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 flex items-center justify-between border-t border-[#E5E7EB] pt-5">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#5B6475] hover:text-[#0E1422]"
              >
                ← Sudah punya akun? Masuk
              </Link>
              <Button
                type="button"
                variant="default"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-xs font-semibold rounded-[4px]"
              >
                Lanjutkan Pendaftaran
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Form Akun & Data Usaha */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Data Akun & PIC */}
              <Panel className="p-6 space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3">
                  <h2 className="font-heading text-sm font-semibold text-[#0E1422]">
                    1. Data Akun & Penanggung Jawab
                  </h2>
                  <p className="text-xs text-[#5B6475]">
                    Kredensial login dan kontak operasional.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Nama Penanggung Jawab (PIC) *
                  </label>
                  <Input
                    type="text"
                    required
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    placeholder="Nama lengkap penanggung jawab"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Email Akun *
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@usaha.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Nomor Telepon / WhatsApp *
                  </label>
                  <Input
                    type="tel"
                    required
                    value={picPhone}
                    onChange={(e) => setPicPhone(e.target.value)}
                    placeholder="08123456789"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Kata Sandi *
                  </label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Konfirmasi Kata Sandi *
                  </label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                  />
                </div>
              </Panel>

              {/* Box 2: Data Perusahaan & Legalitas */}
              <Panel className="p-6 space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3">
                  <h2 className="font-heading text-sm font-semibold text-[#0E1422]">
                    2. Data Entitas Usaha
                  </h2>
                  <p className="text-xs text-[#5B6475]">
                    {role === "UMKM"
                      ? "Identitas konveksi/bengkel jahit untuk matching dan scoring."
                      : "Identitas badan usaha untuk verifikasi penerbitan RFQ."}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Nama Usaha / Perusahaan *
                  </label>
                  <Input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder={
                      role === "UMKM"
                        ? "Contoh: CV Berkah Busana Makmur"
                        : "Contoh: PT Nusantara Logistik Mandiri"
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Bentuk Badan Usaha *
                  </label>
                  <select
                    value={organizationType}
                    onChange={(e) =>
                      setOrganizationType(
                        e.target.value as "PT" | "CV" | "PERORANGAN"
                      )
                    }
                    className="h-10 w-full rounded-[4px] border border-[#8B93A1] bg-white px-3 text-xs text-[#0E1422] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
                  >
                    <option value="CV">CV (Persekutuan Komanditer)</option>
                    <option value="PT">PT (Perseroan Terbatas)</option>
                    <option value="PERORANGAN">
                      Usaha Dagang / Perorangan
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Kota / Kabupaten *
                  </label>
                  <Input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Bandung"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0E1422] mb-1">
                    Provinsi *
                  </label>
                  <Input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Contoh: Jawa Barat"
                  />
                </div>

                <div className="rounded-[4px] bg-[#EFF4FE] border border-[#BFDBFE] p-3 text-xs text-[#1E40AF] leading-relaxed">
                  <strong>Aturan Bisnis BR-01:</strong> Akun baru akan berada
                  dalam status <strong>PENDING</strong> sampai dokumen legalitas
                  dasar (NIB / KTP) diverifikasi oleh admin platform sebelum
                  dapat membuat RFQ atau menawar.
                </div>
              </Panel>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5B6475] hover:text-[#0E1422]"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Pilih Peran
              </button>

              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="flex items-center gap-2 text-xs font-semibold rounded-[4px]"
              >
                {loading ? "Memproses..." : "Daftarkan Akun Sekarang"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
