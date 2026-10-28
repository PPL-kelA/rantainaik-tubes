"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Scissors,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { registerAction } from "@/modules/auth/actions";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"INDUSTRY" | "UMKM">("UMKM");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picName, setPicName] = useState("");
  const [picPhone, setPicPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [address, setAddress] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!agreeTerms) {
      setErrorMessage(
        "Anda wajib menyetujui syarat & ketentuan serta klausul sengketa platform."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await registerAction({
        role,
        email,
        password,
        picName,
        picPhone,
        organizationName,
        city,
        province,
        address,
        agreeTerms,
      });

      if (res.success) {
        router.push(
          `/verifikasi-pending?email=${encodeURIComponent(email)}&role=${role}&org=${encodeURIComponent(
            organizationName
          )}`
        );
      } else {
        setErrorMessage(res.error || "Gagal melakukan pendaftaran.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-[960px]">
        {/* Step Indicator Header */}
        <div className="mb-6 flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
              Pendaftaran Akun Baru
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#111827]">
              {step === 1
                ? "Langkah 1: Pilih Peran Anda"
                : "Langkah 2: Lengkapi Data Akun & Usaha"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                step === 1
                  ? "bg-[#1D4ED8] text-white"
                  : "bg-[#EFF6FF] text-[#1D4ED8]"
              }`}
            >
              1
            </span>
            <div className="h-0.5 w-6 bg-[#D1D5DB]" />
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                step === 2
                  ? "bg-[#1D4ED8] text-white"
                  : "bg-[#F3F4F6] text-[#6B7280]"
              }`}
            >
              2
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3 text-xs text-[#B91C1C]">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Select Role (Upwork style segment) */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card UMKM */}
            <div
              onClick={() => setRole("UMKM")}
              className={`cursor-pointer rounded-xl border p-6 transition-all ${
                role === "UMKM"
                  ? "border-[#1D4ED8] bg-[#EFF6FF]/30 ring-2 ring-[#1D4ED8]/20 shadow-sm"
                  : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                  <Scissors className="h-6 w-6" />
                </div>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    role === "UMKM"
                      ? "border-[#1D4ED8] bg-[#1D4ED8]"
                      : "border-[#D1D5DB]"
                  }`}
                >
                  {role === "UMKM" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <span className="inline-block rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                  Pemasok / Konveksi
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#111827]">
                  Saya UMKM Konveksi
                </h3>
                <p className="mt-1 text-xs text-[#4B5563] leading-relaxed">
                  Penyedia jasa jahit CMT atau full package yang ingin menerima
                  order skala industri, mendapat kepastian rilis dana escrow,
                  dan membangun rekam jejak.
                </p>
              </div>

              <ul className="mt-4 space-y-2 border-t border-[#E5E7EB] pt-4 text-xs text-[#6B7280]">
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
              className={`cursor-pointer rounded-xl border p-6 transition-all ${
                role === "INDUSTRY"
                  ? "border-[#1D4ED8] bg-[#EFF6FF]/30 ring-2 ring-[#1D4ED8]/20 shadow-sm"
                  : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                  <Building2 className="h-6 w-6" />
                </div>
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    role === "INDUSTRY"
                      ? "border-[#1D4ED8] bg-[#1D4ED8]"
                      : "border-[#D1D5DB]"
                  }`}
                >
                  {role === "INDUSTRY" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <span className="inline-block rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                  Pembeli / Korporasi
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#111827]">
                  Saya Industri / Pembeli
                </h3>
                <p className="mt-1 text-xs text-[#4B5563] leading-relaxed">
                  Perusahaan, instansi pemerintah, hotel, atau brand lokal yang
                  ingin mengadakan seragam, merchandise promosi, atau produksi
                  maklon dengan standar mutu terjamin.
                </p>
              </div>

              <ul className="mt-4 space-y-2 border-t border-[#E5E7EB] pt-4 text-xs text-[#6B7280]">
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
                className="text-xs font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                ← Sudah punya akun? Masuk
              </Link>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors"
              >
                Lanjutkan Pendaftaran
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Form Akun & Data Usaha */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Data Akun & PIC */}
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3">
                  <h2 className="text-sm font-bold text-[#111827]">
                    1. Data Akun & Penanggung Jawab
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    Kredensial login dan kontak operasional.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Nama Penanggung Jawab (PIC) *
                  </label>
                  <input
                    type="text"
                    required
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    placeholder="Nama lengkap penanggung jawab"
                    className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Email Akun *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@usaha.com"
                    className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Nomor Telepon / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={picPhone}
                    onChange={(e) => setPicPhone(e.target.value)}
                    placeholder="08123456789"
                    className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Kata Sandi *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter, ada huruf & angka"
                    className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>
              </div>

              {/* Box 2: Data Usaha / Perusahaan */}
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3">
                  <h2 className="text-sm font-bold text-[#111827]">
                    2. Data{" "}
                    {role === "UMKM"
                      ? "Konveksi / Usaha"
                      : "Perusahaan / Instansi"}
                  </h2>
                  <p className="text-xs text-[#6B7280]">
                    Identitas resmi untuk verifikasi profil.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Nama Resmi Usaha / Perusahaan *
                  </label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder={
                      role === "UMKM"
                        ? "Contoh: CV Karya Mandiri Konveksi"
                        : "Contoh: PT Nusantara Logistik"
                    }
                    className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">
                      Kota / Kabupaten *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Contoh: Bekasi"
                      className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">
                      Provinsi *
                    </label>
                    <input
                      type="text"
                      required
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Contoh: Jawa Barat"
                      className="h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Alamat Workshop / Kantor
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Alamat lengkap lokasi operasional"
                    className="w-full rounded-lg border border-[#E5E7EB] p-2.5 text-xs text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>
              </div>
            </div>

            {/* S&K Consent Checkbox (P2) */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
                <span className="text-xs text-[#4B5563] leading-relaxed">
                  Saya menyatakan data yang diisi adalah benar, menyetujui
                  Ketentuan Layanan & Kebijakan Privasi RantaiNaik, serta
                  menyetujui bahwa seluruh penyelesaian sengketa transaksi
                  escrow akan diputuskan oleh administrator platform berdasarkan
                  bukti objektif.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                <ArrowLeft className="h-4 w-4" />
                Ganti Peran
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-60 transition-colors shadow-sm"
              >
                {loading ? "Mendaftarkan..." : "Selesaikan Pendaftaran"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
