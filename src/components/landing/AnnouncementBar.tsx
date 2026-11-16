"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Pengumuman"
      className="relative z-50 flex h-10 w-full items-center justify-between border-b border-[#E5E7EB] bg-[#EFF4FE] px-4 text-xs text-[#0E1422]"
    >
      <div className="mx-auto flex items-center gap-2 overflow-hidden text-center truncate">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.06em] bg-[#2862E0] text-white px-1.5 py-0.5 rounded-[2px]">
          BARU
        </span>
        <span className="truncate">
          Readiness Score untuk UMKM konveksi telah aktif.
        </span>
        <Link
          href="#feature-readiness"
          className="inline-flex items-center font-medium text-[#2862E0] hover:text-[#2858B8] hover:underline shrink-0"
        >
          <span>Lihat caranya</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="Tutup pengumuman"
        className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[#5B6475] hover:bg-[#E5E7EB] hover:text-[#0E1422] focus:outline-none focus:ring-2 focus:ring-[#2862E0]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
