import Link from "next/link";
import { Clock, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";

export default function VerificationPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; role?: string; org?: string }>;
}) {
  return <VerificationPendingContent searchParamsPromise={searchParams} />;
}

async function VerificationPendingContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ email?: string; role?: string; org?: string }>;
}) {
  const params = await searchParamsPromise;
  const email = params.email;
  const role = params.role;
  const org = params.org;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-[760px] space-y-6">
        {/* Main Status Card */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFBEB] px-3 py-1 text-xs font-semibold text-[#B45309] border border-[#FDE68A]">
                <Clock className="h-3.5 w-3.5" />
                Status Akun: Menunggu Verifikasi
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#111827]">
                Pendaftaran Berhasil Diterima
              </h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Akun Anda telah terdaftar dan saat ini berada dalam antrean
                peninjauan administrator.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold uppercase text-[#6B7280]">
              Tahap 1 dari 2
            </span>
          </div>

          {/* Registration Details Strip */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs">
            <div>
              <p className="text-[#6B7280]">Email Terdaftar</p>
              <p className="mt-0.5 font-semibold text-[#111827]">
                {email || "Email akun"}
              </p>
            </div>
            <div>
              <p className="text-[#6B7280]">Entitas Usaha</p>
              <p className="mt-0.5 font-semibold text-[#111827]">
                {org || "Nama usaha"}
              </p>
            </div>
            <div>
              <p className="text-[#6B7280]">Peran Terpilih</p>
              <p className="mt-0.5 font-semibold text-[#111827]">
                {role === "INDUSTRY" ? "Industri / Pembeli" : "UMKM Konveksi"}
              </p>
            </div>
          </div>

          {/* Time & Guard Information (BR-01) */}
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4 text-xs text-[#1E40AF]">
              <Clock className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Estimasi Verifikasi: 1-2 Hari Kerja
                </p>
                <p className="mt-0.5 leading-relaxed text-[#1D4ED8]">
                  Tim admin akan memverifikasi kesesuaian data usaha Anda
                  sebelum mengaktifkan status `VERIFIED`.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-4 text-xs text-[#92400E]">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Aturan Akses Fitur (Guard BR-01)
                </p>
                <p className="mt-0.5 leading-relaxed text-[#B45309]">
                  Sesuai aturan bisnis platform, hanya akun berstatus{" "}
                  <strong>VERIFIED</strong> yang dapat memposting RFQ (Industri)
                  atau mengirim penawaran harga (UMKM). Selama status masih
                  PENDING, akses posting transaksi belum diizinkan.
                </p>
              </div>
            </div>
          </div>

          {/* What to do in the meantime */}
          <div className="mt-6 border-t border-[#E5E7EB] pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3">
              Apa yang Dapat Anda Lakukan Sementara?
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#15803D] mt-0.5 shrink-0" />
                <p className="text-[#4B5563]">
                  Menjelajahi halaman beranda untuk melihat taksonomi produk
                  tekstil dan alur kerja escrow.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#15803D] mt-0.5 shrink-0" />
                <p className="text-[#4B5563]">
                  Menyiapkan berkas verifikasi: Nomor Induk Berusaha (NIB),
                  NPWP, izin usaha/domisili, dan foto fasilitas bengkel
                  produksi.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#15803D] mt-0.5 shrink-0" />
                <p className="text-[#4B5563]">
                  Login ke dashboard akun Anda untuk melihat ringkasan status
                  sementara.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-5">
            <Link
              href="/"
              className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              ← Kembali ke Beranda
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF] transition-colors"
              >
                Masuk ke Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
