import Link from "next/link";

export function PublicFooter() {
  return (
    <footer
      aria-label="Footer Navigasi Publik"
      className="w-full bg-[#0E1422] text-[#A9B1D6] border-t border-[#2A3142]"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Main Footer Grid: Desktop 5 Cols, Tablet 2-3 Cols, Mobile 1 Col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-8 border-b border-[#2A3142] pb-12">
          {/* Brand Info Left (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#2862E0] rounded-[4px] p-1"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#2862E0] text-xs font-bold text-white font-mono">
                RN
              </div>
              <span className="font-heading text-lg font-semibold tracking-tight text-white">
                RantaiNaik
              </span>
            </Link>

            <p className="text-xs text-[#A9B1D6] leading-relaxed max-w-sm">
              Platform broker pengadaan tekstil B2B Indonesia. Menghubungkan
              korporasi pembeli dengan UMKM konveksi terverifikasi lewat sistem
              tender tertutup, penilaian kesiapan 6 pilar, dan simulasi escrow.
            </p>

            <div className="pt-2 text-[11px] font-mono text-[#8B93A1]">
              STANDAR PENGADAAN TEKSTIL BERKELANJUTAN (SDG 9)
            </div>
          </div>

          {/* Column 1: Produk (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-white">
              Produk
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="#feature-rfq"
                  className="hover:text-white transition-colors"
                >
                  Katalog Tender RFQ
                </Link>
              </li>
              <li>
                <Link
                  href="#feature-split"
                  className="hover:text-white transition-colors"
                >
                  Split Award per Lot
                </Link>
              </li>
              <li>
                <Link
                  href="#feature-readiness"
                  className="hover:text-white transition-colors"
                >
                  Readiness Score 0-100
                </Link>
              </li>
              <li>
                <Link
                  href="#feature-escrow"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Simulasi Escrow</span>
                  <span className="bg-[#1E293B] text-[#FEF3C7] text-[9px] font-mono px-1 py-0.2 rounded-[2px] border border-[#2A3142]">
                    Rancangan
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Untuk Industri (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-white">
              Untuk Industri
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="#cara-kerja"
                  className="hover:text-white transition-colors"
                >
                  Alur Pengadaan
                </Link>
              </li>
              <li>
                <Link
                  href="/register?role=industri"
                  className="hover:text-white transition-colors"
                >
                  Daftar sebagai Pembeli
                </Link>
              </li>
              <li>
                <Link
                  href="#partner-wall"
                  className="hover:text-white transition-colors"
                >
                  Direktori UMKM Mitra
                </Link>
              </li>
              <li>
                <Link
                  href="#komisi"
                  className="hover:text-white transition-colors"
                >
                  Struktur Biaya & Komisi
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Untuk UMKM (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-white">
              Untuk UMKM
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/register?role=umkm"
                  className="hover:text-white transition-colors"
                >
                  Daftar Mitra Konveksi
                </Link>
              </li>
              <li>
                <Link
                  href="#feature-readiness"
                  className="hover:text-white transition-colors"
                >
                  Uji Kesiapan Mesin
                </Link>
              </li>
              <li>
                <Link
                  href="#cara-kerja"
                  className="hover:text-white transition-colors"
                >
                  Panduan Penawaran
                </Link>
              </li>
              <li>
                <Link
                  href="#feature-escrow"
                  className="hover:text-white transition-colors"
                >
                  Jaminan Pencairan Dana
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Bantuan (2 Cols) */}
          <div className="lg:col-span-2 space-y-3" id="bantuan">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-white">
              Bantuan
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="#sumber-belajar"
                  className="hover:text-white transition-colors"
                >
                  Pusat Bantuan & FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Mediasi Sengketa QC
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Copyright & Legal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B93A1]">
          <p>© 2026 RantaiNaik. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-[#A9B1D6]">
              Modern Industrial Design System (R3)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
