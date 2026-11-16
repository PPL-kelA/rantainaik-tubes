import Link from "next/link";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge, Button, Panel } from "@/components/ui";

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
    <div className="w-full max-w-[760px] mx-auto py-12 px-4">
      <div className="space-y-6">
        {/* Main Status Panel (Strictly no pill) */}
        <Panel className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5E7EB] pb-5">
            <div>
              <Badge
                variant="warning"
                dot
                className="font-mono text-[11px] rounded-[2px]"
              >
                <Clock className="h-3 w-3" />
                Status Akun: Menunggu Verifikasi
              </Badge>
              <h1 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.02em] text-[#0E1422]">
                Pendaftaran Berhasil Diterima
              </h1>
              <p className="mt-1 text-xs text-[#5B6475]">
                Akun Anda telah terdaftar dan saat ini berada dalam antrean
                peninjauan administrator.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold uppercase text-[#5B6475]">
              Tahap 1 dari 2
            </span>
          </div>

          {/* Registration Details Strip */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-[#E5E7EB] bg-[#FAFBFC] p-4 text-xs">
            <div>
              <p className="text-[#5B6475] font-mono text-[11px] uppercase">
                Email Terdaftar
              </p>
              <p className="mt-0.5 font-semibold text-[#0E1422] font-mono truncate">
                {email || "Email akun"}
              </p>
            </div>
            <div>
              <p className="text-[#5B6475] font-mono text-[11px] uppercase">
                Entitas Usaha
              </p>
              <p className="mt-0.5 font-semibold text-[#0E1422] truncate">
                {org || "Nama usaha"}
              </p>
            </div>
            <div>
              <p className="text-[#5B6475] font-mono text-[11px] uppercase">
                Peran Akun
              </p>
              <Badge
                variant="outline"
                className="mt-1 rounded-[2px] font-mono text-[11px] border-[#8B93A1]"
              >
                {role === "UMKM" ? "UMKM KONVEKSI" : "INDUSTRI / PEMBELI"}
              </Badge>
            </div>
          </div>

          {/* BR-01 Explanation */}
          <div className="mt-6 space-y-3 text-xs leading-relaxed text-[#5B6475]">
            <p>
              Sesuai dengan <strong>Aturan Bisnis BR-01</strong>, seluruh akun
              yang baru mendaftar memiliki status <strong>PENDING</strong> dan
              belum dapat menerbitkan RFQ atau mengajukan penawaran harga sampai
              admin platform melakukan validasi terhadap:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kelengkapan identitas penanggung jawab usaha (PIC).</li>
              <li>Keberadaan dan keabsahan Nomor Induk Berusaha (NIB).</li>
              <li>Kesesuaian kapasitas atau spesialisasi kategori tekstil.</li>
            </ul>
            <p>
              Proses verifikasi standar membutuhkan waktu maksimal 1x24 jam
              kerja. Anda akan menerima notifikasi email saat akun disetujui.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-5">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#5B6475] hover:text-[#0E1422]"
            >
              ← Kembali ke Halaman Masuk
            </Link>

            <Button variant="default" size="sm" asChild>
              <Link
                href="/login"
                className="flex items-center gap-1.5 font-semibold"
              >
                Coba Masuk Akun
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </Panel>

        {/* Verification Checklist Information Panel */}
        <Panel className="p-5 sm:p-6 space-y-3">
          <h2 className="font-heading text-xs font-semibold uppercase tracking-wider text-[#5B6475]">
            Langkah Selanjutnya Setelah Verifikasi
          </h2>
          <div className="space-y-3 text-xs text-[#5B6475]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D] mt-0.5" />
              <p>
                <strong>Unggah Dokumen Sertifikasi:</strong> Tambahkan bukti
                kapabilitas mesin, sertifikat SNI/OEKO-TEX untuk mendongkrak
                Readiness Score ke Tier A/B.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D] mt-0.5" />
              <p>
                <strong>Eksplorasi Katalog RFQ:</strong> Jelajahi pengadaan
                seragam sekolah, kaos merchandise event, atau maklon skala
                menengah.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D] mt-0.5" />
              <p>
                <strong>Simulasi Escrow Terlindungi:</strong> Nikmati kepastian
                dana terkunci 100% di awal sebelum produksi dimulai.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
