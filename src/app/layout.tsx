import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search } from "lucide-react";
import { AuthNavButtons } from "@/components/domain/AuthNavButtons";
import { RoleNavLinks } from "@/components/domain/RoleNavLinks";
import { SessionProviderWrapper } from "@/components/domain/SessionProviderWrapper";

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
        <SessionProviderWrapper>
          <header className="sticky top-0 z-50 h-16 w-full border-b border-[#E5E7EB] bg-white">
            <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
              {/* Logo */}
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-[#1D4ED8]">
                    RantaiNaik
                  </span>
                </Link>

                {/* Role-based Dynamic Navigation Links */}
                <RoleNavLinks />
              </div>

              {/* Right Header Actions: Search & Auth Buttons */}
              <div className="flex items-center gap-4">
                <div className="relative hidden sm:block w-[260px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Cari RFQ atau UMKM..."
                    className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] pl-9 pr-3 text-xs text-[#111827] placeholder:text-[#6B7280] focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
                  />
                </div>

                <AuthNavButtons />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
