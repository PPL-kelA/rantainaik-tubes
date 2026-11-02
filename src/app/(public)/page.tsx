import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Building2,
  Scissors,
  ArrowRight,
  Lock,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="w-full space-y-0 divide-y divide-[#E5E7EB] border border-[#E5E7EB] bg-white">
      {/* ================= 1. HERO WELCOME SECTION (SEAMLESS COMPARTMENTS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">
        {/* Left Hero Pitch */}
        <div className="lg:col-span-8 bg-[#0E1422] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#C0CAF5]">
                PLATFORM BROKER PENGADAAN TEKSTIL B2B
              </span>
              <span className="bg-[#15803D] text-white text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] font-semibold">
                FASE 1 AKTIF
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl font-semibold tracking-[-0.02em] text-white leading-tight">
              Hubungkan Pengadaan Tekstil Industri dengan UMKM Konveksi Siap
              Pakai
            </h1>

            <p className="text-sm text-[#A9B1D6] leading-relaxed">
              Solusi pengadaan seragam kerja, merchandise promosi, dan maklon
              jahit dengan sistem penawaran tertutup, penilaian kesiapan
              terstandarisasi, dan kepastian bayar melalui simulasi escrow
              berbasis milestone.
            </p>

            {/* Quick Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button variant="default" size="default" asChild>
                <Link
                  href="/register"
                  className="font-semibold text-xs rounded-[4px] px-5 h-10"
                >
                  Daftar Akun Baru
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="default"
                asChild
                className="bg-transparent border-[#8B93A1] text-white hover:bg-white/10 text-xs rounded-[4px] px-5 h-10"
              >
                <Link href="/login">Masuk ke Portal</Link>
              </Button>
            </div>
          </div>

          {/* Core Trust Indicators Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono text-[#A9B1D6]">
            <div>
              <span className="text-white text-lg font-semibold tabular-nums block">
                100%
              </span>
              <span>Escrow Didanai di Awal</span>
            </div>
            <div>
              <span className="text-white text-lg font-semibold tabular-nums block">
                6 Komponen
              </span>
              <span>Readiness Score Standar</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-white text-lg font-semibold tabular-nums block">
                SDG 9
              </span>
              <span>Pemberdayaan UMKM</span>
            </div>
          </div>
        </div>

        {/* Right Welcome Widget (Upwork Side Panel Style) */}
        <div className="lg:col-span-4 bg-[#FAFBFC] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
              AKSES MASUK PORTAL
            </span>
            <h2 className="font-heading text-lg font-semibold text-[#0E1422]">
              Pilih Peran Anda untuk Memulai Transaksi
            </h2>
            <p className="text-xs text-[#5B6475] leading-relaxed">
              Bergabunglah dengan ekosistem pengadaan tekstil yang adil,
              transparan, dan terlindungi regulasi platform.
            </p>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/login"
                className="group flex items-start gap-3 p-3 bg-white border border-[#E5E7EB] hover:border-[#2862E0] transition-colors rounded-[4px]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#EFF4FE] text-[#2862E0] rounded-[4px]">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0E1422] group-hover:text-[#2862E0]">
                    Sebagai Industri / Pembeli
                  </p>
                  <p className="text-[11px] text-[#5B6475] mt-0.5">
                    Posting RFQ terstruktur & amankan dana di escrow.
                  </p>
                </div>
              </Link>

              <Link
                href="/login"
                className="group flex items-start gap-3 p-3 bg-white border border-[#E5E7EB] hover:border-[#2862E0] transition-colors rounded-[4px]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#EFF4FE] text-[#2862E0] rounded-[4px]">
                  <Scissors className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0E1422] group-hover:text-[#2862E0]">
                    Sebagai Mitra UMKM Konveksi
                  </p>
                  <p className="text-[11px] text-[#5B6475] mt-0.5">
                    Kirim penawaran harga & terima pencairan pasti.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] pt-4 text-xs text-[#5B6475]">
            <p>
              Belum memiliki akun terdaftar?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#2862E0] hover:underline"
              >
                Daftar sekarang gratis
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. VALUE PROPOSITION: 3 PILAR KEUNGGULAN (SEAMLESS GRID) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB] bg-white">
        <div className="p-6 sm:p-7 space-y-2">
          <div className="flex h-8 w-8 items-center justify-center bg-[#EFF4FE] text-[#2862E0] rounded-[4px]">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-[#0E1422]">
            1. RFQ Terstruktur & Mode Lot
          </h3>
          <p className="text-xs text-[#5B6475] leading-relaxed">
            Spesifikasi item tunggal atau bagi ke beberapa lot kecil untuk
            melibatkan lebih banyak UMKM lokal dengan standar acuan mutu yang
            seragam.
          </p>
        </div>

        <div className="p-6 sm:p-7 space-y-2">
          <div className="flex h-8 w-8 items-center justify-center bg-[#EFF4FE] text-[#2862E0] rounded-[4px]">
            <BadgeCheck className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-[#0E1422]">
            2. Transparansi Readiness Score
          </h3>
          <p className="text-xs text-[#5B6475] leading-relaxed">
            Penilaian kesiapan 0-100 berbasis 6 komponen transparan (Legalitas,
            Mesin, QC, Rekam Jejak) untuk memetakan kapasitas riil mitra jahit.
          </p>
        </div>

        <div className="p-6 sm:p-7 space-y-2">
          <div className="flex h-8 w-8 items-center justify-center bg-[#EFF4FE] text-[#2862E0] rounded-[4px]">
            <Lock className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-[#0E1422]">
            3. Escrow Aman Tanpa Risiko
          </h3>
          <p className="text-xs text-[#5B6475] leading-relaxed">
            Dana terkunci 100% di awal dan hanya dirilis setelah approval bahan
            & kendali mutu (QC) lolos, melindungi kedua belah pihak secara
            berimbang.
          </p>
        </div>
      </div>

      {/* ================= 3. IN-PAGE SEARCH & RFQ SHOWCASE ================= */}
      <div className="bg-white">
        {/* Header & In-Page Search Bar Compartment */}
        <div className="p-6 sm:p-8 space-y-5 border-b border-[#E5E7EB]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
                KATALOG TENDER TERBUKA
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[#0E1422]">
                Eksplorasi Permintaan Pengadaan Terkini
              </h2>
            </div>
            <span className="font-mono text-xs text-[#5B6475]">
              Menampilkan tender industri terverifikasi
            </span>
          </div>

          {/* In-Page Search Bar under Header */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6475]" />
            <input
              type="text"
              placeholder="Cari RFQ tender seragam kerja, kaos event, polo maklon, atau kebutuhan tekstil..."
              className="h-10 w-full rounded-[4px] border border-[#8B93A1] bg-white pl-10 pr-4 text-xs sm:text-sm text-[#0E1422] placeholder:text-[#5B6475] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
            />
          </div>

          {/* Underline Tabs without Pill */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pt-1">
            <div className="flex items-center gap-6 text-xs sm:text-sm">
              <button
                type="button"
                className="border-b-2 border-[#2862E0] pb-2.5 font-semibold text-[#0E1422]"
              >
                Semua Tender Terbuka
              </button>
              <button
                type="button"
                className="border-b-2 border-transparent pb-2.5 font-medium text-[#5B6475] hover:border-[#8B93A1] hover:text-[#0E1422]"
              >
                Seragam Korporasi
              </button>
              <button
                type="button"
                className="hidden sm:block border-b-2 border-transparent pb-2.5 font-medium text-[#5B6475] hover:border-[#8B93A1] hover:text-[#0E1422]"
              >
                Maklon & Jahit CMT
              </button>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 border border-[#8B93A1] bg-white px-2.5 py-1 text-xs text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422] rounded-[4px]"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Seamless RFQ Feed List with Generous & Uniform 4-Sided Padding */}
        <div className="divide-y divide-[#E5E7EB]">
          {/* RFQ Item 1 */}
          <div className="p-6 sm:p-7 space-y-3.5 transition-colors hover:bg-[#FAFBFC]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5B6475]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                  RFQ-0007
                </span>
                <span>Diterbitkan 1 jam lalu · 5 penawaran masuk</span>
              </div>
              <Badge
                variant="default"
                className="font-mono text-[11px] rounded-[2px]"
              >
                Mode TUNGGAL
              </Badge>
            </div>

            <h3 className="font-heading text-base sm:text-lg font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors">
              <Link href="/login">
                Pengadaan Seragam Kerja Kantor & Lapangan (300 pcs)
              </Link>
            </h3>

            <p className="text-xs text-[#5B6475]">
              Kategori: <strong className="text-[#0E1422]">SERAGAM</strong> ·
              Estimasi Anggaran:{" "}
              <strong className="font-mono text-[#0E1422]">Rp33.750.000</strong>{" "}
              · Tenggat:{" "}
              <span className="text-[#0E1422]">20 November 2026</span>
            </p>

            <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
              Dibutuhkan konveksi jahit berpengalaman untuk produksi kemeja PDL
              lengan panjang dan seragam kantor berbahan American Drill.
              Kebutuhan rincian ukuran: S (60), M (100), L (100), XL (40). Wajib
              mengajukan approval sampel sebelum produksi massal.
            </p>

            {/* Tag Chips: Pure Solid Background without Stroke */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                Kemeja PDL
              </span>
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                Bahan Drill
              </span>
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                Jahit CMT
              </span>
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                QC Standar SNI
              </span>
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                300 Pcs
              </span>
            </div>

            {/* Footer Trust & Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3 text-xs text-[#5B6475]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 font-medium text-[#15803D]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Industri Terverifikasi
                </span>
                <span>·</span>
                <span>Dana Escrow 100% Diamankan</span>
                <span>·</span>
                <span>Pengiriman: Tangerang</span>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/login"
                  className="font-semibold text-[#2862E0] hover:text-[#2858B8] flex items-center gap-1"
                >
                  Buka Rincian RFQ
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* RFQ Item 2 */}
          <div className="p-6 sm:p-7 space-y-3.5 transition-colors hover:bg-[#FAFBFC]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5B6475]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#2862E0] bg-[#EFF4FE] px-2 py-0.5 rounded-[2px]">
                  RFQ-0008
                </span>
                <span>Diterbitkan 3 jam lalu · 2 penawaran masuk</span>
              </div>
              <Badge
                variant="default"
                className="font-mono text-[11px] rounded-[2px]"
              >
                Mode TUNGGAL
              </Badge>
            </div>

            <h3 className="font-heading text-base sm:text-lg font-semibold text-[#0E1422] hover:text-[#2862E0] transition-colors">
              <Link href="/login">
                Pengadaan Kaos Polos Katun Combed Merchandise Event (500 pcs)
              </Link>
            </h3>

            <p className="text-xs text-[#5B6475]">
              Kategori: <strong className="text-[#0E1422]">MERCHANDISE</strong>{" "}
              · Estimasi Anggaran:{" "}
              <strong className="font-mono text-[#0E1422]">Rp25.000.000</strong>{" "}
              · Tenggat:{" "}
              <span className="text-[#0E1422]">28 November 2026</span>
            </p>

            <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed">
              Dibutuhkan konveksi kaos untuk event korporasi nasional. Bahan
              Katun Combed 30s reaktif dengan sablon plastisol berkualitas
              tinggi. Waktu pengerjaan maksimal 14 hari kalender setelah sampel
              disetujui.
            </p>

            {/* Tag Chips: Pure Solid Background without Stroke */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                Kaos Combed 30s
              </span>
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                Sablon Plastisol
              </span>
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                Full Package
              </span>
              <span className="bg-[#F1F3F5] text-[#374151] px-2 py-0.5 font-mono text-[11px] rounded-[2px]">
                500 Pcs
              </span>
            </div>

            {/* Footer Trust & Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3 text-xs text-[#5B6475]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 font-medium text-[#15803D]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Industri Terverifikasi
                </span>
                <span>·</span>
                <span>Escrow Milestone 30% / 70%</span>
                <span>·</span>
                <span>Pengiriman: Kota Bandung</span>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/login"
                  className="font-semibold text-[#2862E0] hover:text-[#2858B8] flex items-center gap-1"
                >
                  Buka Rincian RFQ
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. ALUR KERJA BROKER TRANSAKSI ================= */}
      <div className="p-6 sm:p-8 bg-[#FAFBFC] space-y-5">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
            STANDAR PROSEDUR OPERASIONAL
          </span>
          <h2 className="font-heading text-lg sm:text-xl font-semibold text-[#0E1422]">
            Alur Pengadaan Tekstil Aman & Terukur
          </h2>
          <p className="text-xs text-[#5B6475]">
            Empat tahapan utama transaksi pengadaan terstruktur di platform
            RantaiNaik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-[4px] space-y-1.5">
            <span className="font-mono text-xs font-semibold text-[#2862E0]">
              01. RFQ & Spesifikasi
            </span>
            <p className="text-xs font-semibold text-[#0E1422]">
              Industri Menerbitkan Tender
            </p>
            <p className="text-[11px] text-[#5B6475] leading-relaxed">
              Spesifikasi ukuran, kain, dan standar mutu diinput lengkap melalui
              wizard 10 langkah.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-[4px] space-y-1.5">
            <span className="font-mono text-xs font-semibold text-[#2862E0]">
              02. Penawaran Tertutup
            </span>
            <p className="text-xs font-semibold text-[#0E1422]">
              UMKM Mengajukan Penawaran
            </p>
            <p className="text-[11px] text-[#5B6475] leading-relaxed">
              Kerahasiaan harga antar-UMKM terjamin (BR-02) dengan matching
              kesiapan mesin.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-[4px] space-y-1.5">
            <span className="font-mono text-xs font-semibold text-[#2862E0]">
              03. Escrow & Sampel
            </span>
            <p className="text-xs font-semibold text-[#0E1422]">
              Dana Diamankan di Awal
            </p>
            <p className="text-[11px] text-[#5B6475] leading-relaxed">
              Pembeli mendanai 100% dana ke escrow dan menyetujui approval
              golden sample.
            </p>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-[4px] space-y-1.5">
            <span className="font-mono text-xs font-semibold text-[#2862E0]">
              04. QC & Rilis Dana
            </span>
            <p className="text-xs font-semibold text-[#0E1422]">
              Pencairan Dana Bertahap
            </p>
            <p className="text-[11px] text-[#5B6475] leading-relaxed">
              Dana dirilis otomatis ke rekening konveksi setelah hasil QC
              dinyatakan lolos.
            </p>
          </div>
        </div>
      </div>

      {/* ================= 5. BOTTOM CTA BANNER ================= */}
      <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-base sm:text-lg font-semibold text-[#0E1422]">
            Siap Memulai Pengadaan Tekstil yang Lebih Aman?
          </h3>
          <p className="text-xs text-[#5B6475] mt-0.5">
            Daftarkan entitas usaha Anda sekarang dan nikmati ekosistem
            pengadaan B2B tanpa perantara.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="rounded-[4px] text-xs"
          >
            <Link href="/login">Masuk Akun</Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            asChild
            className="rounded-[4px] text-xs font-semibold"
          >
            <Link href="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
