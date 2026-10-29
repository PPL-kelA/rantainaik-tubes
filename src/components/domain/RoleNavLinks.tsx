"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function RoleNavLinks() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="h-4 w-16 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[#E5E7EB]" />
        <div className="h-4 w-16 animate-pulse rounded bg-[#E5E7EB]" />
      </div>
    );
  }

  const role = session?.user?.role;

  // 1. Menu Khusus Admin
  if (role === "ADMIN") {
    return (
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
        <Link
          href="/admin"
          className={`transition-colors ${
            pathname === "/admin"
              ? "font-semibold text-[#1D4ED8]"
              : "text-[#4B5563] hover:text-[#1D4ED8]"
          }`}
        >
          Dashboard Admin
        </Link>
        <Link
          href="/admin#verifikasi"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Verifikasi Akun
        </Link>
        <Link
          href="/admin#konfigurasi"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Konfigurasi & Master Data
        </Link>
        <Link
          href="/admin#sengketa"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Sengketa
        </Link>
        <Link
          href="/admin#ledger"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Ledger Escrow
        </Link>
      </nav>
    );
  }

  // 2. Menu Khusus Industri / Pembeli
  if (role === "INDUSTRY") {
    return (
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
        <Link
          href="/industri"
          className={`transition-colors ${
            pathname === "/industri"
              ? "font-semibold text-[#1D4ED8]"
              : "text-[#4B5563] hover:text-[#1D4ED8]"
          }`}
        >
          Dashboard Pengadaan
        </Link>
        <Link
          href="/industri/profil"
          className={`transition-colors ${
            pathname === "/industri/profil"
              ? "font-semibold text-[#1D4ED8]"
              : "text-[#4B5563] hover:text-[#1D4ED8]"
          }`}
        >
          Profil & Legalitas
        </Link>
        <Link
          href="/industri#rfq"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          RFQ Saya
        </Link>
        <Link
          href="/industri#mitra"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Cari UMKM
        </Link>
        <Link
          href="/industri#escrow"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Status Dana Escrow
        </Link>
      </nav>
    );
  }

  // 3. Menu Khusus UMKM Konveksi
  if (role === "UMKM") {
    return (
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
        <Link
          href="/umkm"
          className={`transition-colors ${
            pathname === "/umkm"
              ? "font-semibold text-[#1D4ED8]"
              : "text-[#4B5563] hover:text-[#1D4ED8]"
          }`}
        >
          Dashboard UMKM
        </Link>
        <Link
          href="/umkm/profil"
          className={`transition-colors ${
            pathname === "/umkm/profil"
              ? "font-semibold text-[#1D4ED8]"
              : "text-[#4B5563] hover:text-[#1D4ED8]"
          }`}
        >
          Profil & Dokumen
        </Link>
        <Link
          href="/umkm/readiness"
          className={`transition-colors ${
            pathname === "/umkm/readiness"
              ? "font-semibold text-[#1D4ED8]"
              : "text-[#4B5563] hover:text-[#1D4ED8]"
          }`}
        >
          Readiness Score
        </Link>
        <Link
          href="/umkm#cari-rfq"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Cari RFQ
        </Link>
        <Link
          href="/umkm#penawaran"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Penawaran Saya
        </Link>
        <Link
          href="/umkm#order"
          className="text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Order & Produksi
        </Link>
      </nav>
    );
  }

  // 4. Menu Publik (Belum Login / Tamu)
  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4B5563]">
      <Link
        href="/"
        className={`transition-colors ${
          pathname === "/"
            ? "font-semibold text-[#1D4ED8]"
            : "hover:text-[#1D4ED8]"
        }`}
      >
        Beranda
      </Link>
      <Link href="/#escrow" className="hover:text-[#1D4ED8] transition-colors">
        Alur Escrow
      </Link>
      <Link
        href="/#cara-kerja"
        className="hover:text-[#1D4ED8] transition-colors"
      >
        Cara Kerja
      </Link>
    </nav>
  );
}
