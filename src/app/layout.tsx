import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RantaiNaik - Platform Pengadaan Tekstil UMKM Konveksi",
  description:
    "Menghubungkan pengadaan tekstil industri dengan UMKM konveksi terverifikasi dan pembayaran escrow terlindungi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} antialiased bg-[#F6F7F9] text-[#111827]`}
      >
        <header className="sticky top-0 z-50 h-16 w-full border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#1D4ED8]">
                  RantaiNaik
                </span>
              </Link>

              {/* Navigation Menu Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4B5563]">
                <Link
                  href="/"
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  Beranda
                </Link>
                <Link
                  href="/umkm"
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  UMKM
                </Link>
                <Link
                  href="/industri"
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  Industri
                </Link>
                <Link
                  href="/admin"
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  Admin
                </Link>
              </nav>
            </div>

            {/* Right Header Actions: Search, Notifications, Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Cari RFQ atau UMKM..."
                  className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] pl-9 pr-4 text-sm text-[#111827] placeholder:text-[#6B7280] focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                />
              </div>

              <button
                type="button"
                className="relative rounded-lg p-2 text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                aria-label="Notifikasi"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1D4ED8]" />
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
