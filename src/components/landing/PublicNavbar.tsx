"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui";
import { NavDropdown, DropdownItem } from "./NavDropdown";
import { MobileSheet } from "./MobileSheet";

export function PublicNavbar() {
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const industriCol1: DropdownItem[] = [
    {
      title: "Buat RFQ Terstruktur",
      description: "Susun spesifikasi tender 10 langkah terstandar",
      href: "#feature-rfq",
    },
    {
      title: "Bandingkan Penawaran",
      description: "Evaluasi matriks harga, kapasitas, dan lead time",
      href: "#feature-compare",
    },
  ];

  const industriCol2: DropdownItem[] = [
    {
      title: "Split Award per Lot",
      description: "Bagi alokasi produksi ke multi-konveksi",
      href: "#feature-split",
    },
    {
      title: "Escrow Milestone",
      description: "Perlindungan komitmen pembayaran bertahap",
      href: "#feature-escrow",
      badge: "Dalam pengembangan",
    },
  ];

  const umkmCol1: DropdownItem[] = [
    {
      title: "Cari Tender Tekstil",
      description: "Akses langsung ke proyek pengadaan industri",
      href: "#feature-rfq",
    },
    {
      title: "Penawaran Tertutup",
      description: "Kirim penawaran tanpa perang harga terbuka",
      href: "#feature-compare",
    },
  ];

  const umkmCol2: DropdownItem[] = [
    {
      title: "Readiness Score 0-100",
      description: "Tingkatkan reputasi lewat 6 pilar kesiapan",
      href: "#feature-readiness",
    },
    {
      title: "Pencairan Dana Escrow",
      description: "Kepastian pembayaran sesuai milestone order",
      href: "#feature-escrow",
      badge: "Dalam pengembangan",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo Left */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#2862E0] rounded-[4px] p-1"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#2862E0] text-xs font-bold text-white font-mono">
              RN
            </div>
            <span className="font-heading text-lg font-semibold tracking-tight text-[#0E1422]">
              RantaiNaik
            </span>
          </Link>

          {/* Center Navigation Links (Desktop lg+) */}
          <nav
            aria-label="Navigasi Publik"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            <Link
              href="#cara-kerja"
              className="text-sm font-medium text-[#5B6475] hover:text-[#0E1422] rounded-[4px] px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
            >
              Cara Kerja
            </Link>

            <NavDropdown
              label="Untuk Industri"
              columnOneTitle="Fitur Pengadaan"
              columnOneItems={industriCol1}
              columnTwoTitle="Keamanan Transaksi"
              columnTwoItems={industriCol2}
            />

            <NavDropdown
              label="Untuk UMKM"
              columnOneTitle="Akses Tender"
              columnOneItems={umkmCol1}
              columnTwoTitle="Reputasi & Pencairan"
              columnTwoItems={umkmCol2}
            />

            <Link
              href="#partner-wall"
              className="text-sm font-medium text-[#5B6475] hover:text-[#0E1422] rounded-[4px] px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
            >
              Direktori UMKM
            </Link>

            <Link
              href="#komisi"
              className="text-sm font-medium text-[#5B6475] hover:text-[#0E1422] rounded-[4px] px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
            >
              Komisi
            </Link>

            <Link
              href="#bantuan"
              className="text-sm font-medium text-[#5B6475] hover:text-[#0E1422] rounded-[4px] px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
            >
              Bantuan
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-medium text-[#0E1422] hover:text-[#2862E0] transition-colors px-2 py-1.5 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
            >
              Masuk
            </Link>

            <Button
              variant="default"
              size="default"
              asChild
              className="h-10 px-4 text-xs font-semibold rounded-[4px]"
            >
              <Link href="/register">Daftar</Link>
            </Button>

            {/* Mobile Hamburger Button (<1024px) */}
            <button
              type="button"
              onClick={() => setIsMobileSheetOpen(true)}
              aria-label="Buka navigasi menu"
              className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#8B93A1]/40 text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422] focus:outline-none focus:ring-2 focus:ring-[#2862E0] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Sheet */}
      <MobileSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
      />
    </>
  );
}
