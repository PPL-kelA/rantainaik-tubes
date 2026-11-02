"use client";

import React from "react";
import Link from "next/link";
import { Menu, X, Search, Bell } from "lucide-react";
import { AuthNavButtons } from "@/components/domain/AuthNavButtons";

export interface AppHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function AppHeader({ onToggleSidebar, isSidebarOpen }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#E5E7EB] bg-white px-4 sm:px-6">
      {/* Left: Mobile Toggle & Brand Logo */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? "Tutup navigasi" : "Buka navigasi"}
            className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#8B93A1]/40 text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422] focus:outline-none focus:ring-2 focus:ring-[#2862E0] lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        )}

        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#2862E0] text-xs font-bold text-white shadow-none">
            RN
          </div>
          <span className="font-heading text-base font-semibold tracking-[-0.02em] text-[#0E1422]">
            RantaiNaik
          </span>
        </Link>
      </div>

      {/* Center: Global Search (Max 560px, strictly no navigation links here) */}
      <div className="mx-4 hidden max-w-[560px] flex-1 sm:block">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5B6475]" />
          <input
            type="search"
            placeholder="Cari RFQ, penawaran, atau mitra UMKM..."
            className="h-8 w-full rounded-[4px] border border-[#8B93A1] bg-white pl-9 pr-3 text-xs text-[#0E1422] placeholder:text-[#5B6475] focus:border-[#2862E0] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
          />
        </div>
      </div>

      {/* Right: Notifications & Auth profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Notifikasi"
          className="relative flex h-8 w-8 items-center justify-center rounded-[4px] text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422] focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#2862E0]" />
        </button>

        <div className="h-4 w-[1px] bg-[#E5E7EB]" />

        <AuthNavButtons />
      </div>
    </header>
  );
}
