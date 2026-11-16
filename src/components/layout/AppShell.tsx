"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Public and Auth pages are rendered standalone without sidebar
  const isPublicPage =
    pathname === "/" ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verifikasi-pending");

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white text-[#0E1422] selection:bg-[#EFF4FE] selection:text-[#2862E0] flex flex-col">
      {/* Mobile Top Header (Only on screens < 1024px, strictly hidden on desktop) */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#E5E7EB] bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label={isSidebarOpen ? "Tutup navigasi" : "Buka navigasi"}
          className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#8B93A1]/40 text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422] focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
        >
          {isSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#2862E0] text-xs font-bold text-white">
            RN
          </div>
          <span className="font-heading text-base font-semibold tracking-tight text-[#0E1422]">
            RantaiNaik
          </span>
        </Link>

        <div className="flex h-9 w-9 items-center justify-center text-[#5B6475]">
          <Bell className="h-4 w-4" />
        </div>
      </header>

      {/* Main Layout Structure: Pure Flexbox Layout (Desktop Sidebar & Main Workspace are side-by-side) */}
      <div className="flex flex-1 min-h-screen w-full items-start">
        {/* Desktop Sidebar: 
            - Height: exactly fits screen (h-screen)
            - Fixed in place when scrolling: sticky top-0 self-start
            - Width: 256px (w-64 shrink-0)
            - In-flow so it NEVER floats over or covers content
        */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen self-start z-20 bg-white">
          <AppSidebar className="h-full w-full" />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl h-full">
              <AppSidebar onCloseMobile={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Workspace: Flex-1 Min-w-0 Natural Column */}
        <main
          className={cn(
            "flex-1 min-w-0 bg-white p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden",
            "transition-all duration-150"
          )}
        >
          <div className="mx-auto max-w-[1440px] w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
