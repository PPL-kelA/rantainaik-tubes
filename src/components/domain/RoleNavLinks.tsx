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
        <div className="h-4 w-16 animate-pulse rounded bg-[#EAEFF8]" />
        <div className="h-4 w-20 animate-pulse rounded bg-[#EAEFF8]" />
        <div className="h-4 w-16 animate-pulse rounded bg-[#EAEFF8]" />
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
              ? "font-semibold text-[#2862E0]"
              : "text-[#475569] hover:text-[#0E1422]"
          }`}
        >
          Dashboard Admin
        </Link>
        <Link
          href="/admin#verifikasi"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          Verifikasi Akun
        </Link>
        <Link
          href="/admin#konfigurasi"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          Konfigurasi & Master Data
        </Link>
        <Link
          href="/admin#sengketa"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          Sengketa
        </Link>
        <Link
          href="/admin#ledger"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
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
              ? "font-semibold text-[#2862E0]"
              : "text-[#475569] hover:text-[#0E1422]"
          }`}
        >
          Dashboard Pengadaan
        </Link>
        <Link
          href="/industri/profil"
          className={`transition-colors ${
            pathname === "/industri/profil"
              ? "font-semibold text-[#2862E0]"
              : "text-[#475569] hover:text-[#0E1422]"
          }`}
        >
          Profil & Legalitas
        </Link>
        <Link
          href="/industri#rfq"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          RFQ Saya
        </Link>
        <Link
          href="/industri#mitra"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          Cari UMKM
        </Link>
        <Link
          href="/industri#order"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          Order & Escrow
        </Link>
      </nav>
    );
  }

  // 3. Menu Khusus UMKM / Pemasok
  if (role === "UMKM") {
    return (
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
        <Link
          href="/umkm"
          className={`transition-colors ${
            pathname === "/umkm"
              ? "font-semibold text-[#2862E0]"
              : "text-[#475569] hover:text-[#0E1422]"
          }`}
        >
          Beranda Mitra
        </Link>
        <Link
          href="/umkm/readiness"
          className={`transition-colors ${
            pathname === "/umkm/readiness"
              ? "font-semibold text-[#2862E0]"
              : "text-[#475569] hover:text-[#0E1422]"
          }`}
        >
          Readiness Score
        </Link>
        <Link
          href="/umkm/profil"
          className={`transition-colors ${
            pathname === "/umkm/profil"
              ? "font-semibold text-[#2862E0]"
              : "text-[#475569] hover:text-[#0E1422]"
          }`}
        >
          Profil & Portofolio
        </Link>
        <Link
          href="/umkm#cari-rfq"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          Cari RFQ
        </Link>
        <Link
          href="/umkm#penawaran"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          Penawaran Saya
        </Link>
        <Link
          href="/umkm#dana"
          className="text-[#475569] hover:text-[#0E1422] transition-colors"
        >
          Dana & Escrow
        </Link>
      </nav>
    );
  }

  // 4. Menu Publik (Belum Login)
  return (
    <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[#475569]">
      <Link
        href="/"
        className={`transition-colors ${
          pathname === "/"
            ? "font-semibold text-[#2862E0]"
            : "hover:text-[#0E1422]"
        }`}
      >
        Beranda
      </Link>
      <Link
        href="/#alur-kerja"
        className="hover:text-[#0E1422] transition-colors"
      >
        Alur Kerja Broker
      </Link>
      <Link
        href="/#keamanan"
        className="hover:text-[#0E1422] transition-colors"
      >
        Keamanan Escrow
      </Link>
      <Link
        href="/#mitra-umkm"
        className="hover:text-[#0E1422] transition-colors"
      >
        Mitra UMKM
      </Link>
    </nav>
  );
}
