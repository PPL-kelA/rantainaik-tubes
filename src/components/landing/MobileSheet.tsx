"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSheet({ isOpen, onClose }: MobileSheetProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleGroup = (groupName: string) => {
    setOpenGroup((prev) => (prev === groupName ? null : groupName));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigasi Menu Seluler"
      className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden"
    >
      {/* Top Bar of Sheet */}
      <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-4 sm:px-6">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2862E0] rounded-[4px] p-1"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#2862E0] text-xs font-bold text-white font-mono">
            RN
          </div>
          <span className="font-heading text-base font-semibold tracking-tight text-[#0E1422]">
            RantaiNaik
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup navigasi"
          className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#8B93A1]/40 text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422] focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Sheet Content: List of links (48px height rows) */}
      <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-[#E5E7EB]">
        {/* Cara Kerja */}
        <Link
          href="#cara-kerja"
          onClick={onClose}
          className="flex h-12 items-center text-sm font-medium text-[#0E1422] hover:text-[#2862E0] transition-colors"
        >
          Cara Kerja
        </Link>

        {/* Group: Untuk Industri (Accordion) */}
        <div>
          <button
            type="button"
            onClick={() => toggleGroup("industri")}
            aria-expanded={openGroup === "industri"}
            className="flex h-12 w-full items-center justify-between text-sm font-medium text-[#0E1422] hover:text-[#2862E0] transition-colors"
          >
            <span>Untuk Industri</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-150 text-[#5B6475]",
                openGroup === "industri" && "rotate-180 text-[#2862E0]"
              )}
            />
          </button>
          {openGroup === "industri" && (
            <div className="pl-3 pb-3 space-y-2 border-l-2 border-[#2862E0] ml-1 my-1">
              <Link
                href="#feature-rfq"
                onClick={onClose}
                className="block text-xs text-[#5B6475] hover:text-[#2862E0] py-1"
              >
                Buat RFQ Terstruktur
              </Link>
              <Link
                href="#feature-compare"
                onClick={onClose}
                className="block text-xs text-[#5B6475] hover:text-[#2862E0] py-1"
              >
                Bandingkan Penawaran
              </Link>
              <Link
                href="#feature-split"
                onClick={onClose}
                className="block text-xs text-[#5B6475] hover:text-[#2862E0] py-1"
              >
                Split Award per Lot
              </Link>
              <Link
                href="#feature-escrow"
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs text-[#5B6475] hover:text-[#2862E0] py-1"
              >
                <span>Escrow & Milestone</span>
                <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-mono px-1 rounded-[2px]">
                  Dalam pengembangan
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Group: Untuk UMKM (Accordion) */}
        <div>
          <button
            type="button"
            onClick={() => toggleGroup("umkm")}
            aria-expanded={openGroup === "umkm"}
            className="flex h-12 w-full items-center justify-between text-sm font-medium text-[#0E1422] hover:text-[#2862E0] transition-colors"
          >
            <span>Untuk UMKM</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-150 text-[#5B6475]",
                openGroup === "umkm" && "rotate-180 text-[#2862E0]"
              )}
            />
          </button>
          {openGroup === "umkm" && (
            <div className="pl-3 pb-3 space-y-2 border-l-2 border-[#2862E0] ml-1 my-1">
              <Link
                href="#feature-rfq"
                onClick={onClose}
                className="block text-xs text-[#5B6475] hover:text-[#2862E0] py-1"
              >
                Cari Tender Tekstil
              </Link>
              <Link
                href="#feature-compare"
                onClick={onClose}
                className="block text-xs text-[#5B6475] hover:text-[#2862E0] py-1"
              >
                Penawaran Tertutup
              </Link>
              <Link
                href="#feature-readiness"
                onClick={onClose}
                className="block text-xs text-[#5B6475] hover:text-[#2862E0] py-1"
              >
                Readiness Score 0-100
              </Link>
              <Link
                href="#feature-escrow"
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs text-[#5B6475] hover:text-[#2862E0] py-1"
              >
                <span>Pencairan Dana Escrow</span>
                <span className="bg-[#FFFBEB] text-[#B45309] text-[9px] font-mono px-1 rounded-[2px]">
                  Dalam pengembangan
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Direktori UMKM */}
        <Link
          href="#partner-wall"
          onClick={onClose}
          className="flex h-12 items-center text-sm font-medium text-[#0E1422] hover:text-[#2862E0] transition-colors"
        >
          Direktori UMKM
        </Link>

        {/* Komisi */}
        <Link
          href="#komisi"
          onClick={onClose}
          className="flex h-12 items-center text-sm font-medium text-[#0E1422] hover:text-[#2862E0] transition-colors"
        >
          Komisi Platform
        </Link>

        {/* Bantuan */}
        <Link
          href="#bantuan"
          onClick={onClose}
          className="flex h-12 items-center text-sm font-medium text-[#0E1422] hover:text-[#2862E0] transition-colors"
        >
          Bantuan
        </Link>
      </div>

      {/* Bottom Actions: Full Width Buttons */}
      <div className="border-t border-[#E5E7EB] p-4 space-y-2.5 bg-[#FAFBFC]">
        <Button
          variant="secondary"
          size="default"
          asChild
          className="w-full h-11 text-sm font-medium rounded-[4px] border-[#8B93A1]"
        >
          <Link href="/login" onClick={onClose}>
            Masuk ke Akun
          </Link>
        </Button>
        <Button
          variant="default"
          size="default"
          asChild
          className="w-full h-11 text-sm font-semibold rounded-[4px]"
        >
          <Link href="/register" onClick={onClose}>
            Daftar Sekarang
          </Link>
        </Button>
      </div>
    </div>
  );
}
