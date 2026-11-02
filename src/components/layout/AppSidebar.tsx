"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { HelpCircle, Bell, LogOut, LogIn, UserPlus } from "lucide-react";
import { getNavigationForRole, NavGroup, NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@/components/ui";

export interface AppSidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

export function AppSidebar({ onCloseMobile, className }: AppSidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = session?.user?.role;
  const groups: NavGroup[] = getNavigationForRole(role);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) {
      const [base] = href.split("#");
      return pathname === base;
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col justify-between border-r border-[#E5E7EB] bg-white select-none",
        className
      )}
    >
      {/* ================= TOP SECTION ================= */}
      <div className="flex-1 overflow-y-auto">
        {/* 1. Header: Logo + Notification Bell */}
        <div className="flex h-14 items-center justify-between border-b border-[#E5E7EB] px-4">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#2862E0] text-xs font-bold text-white">
              RN
            </div>
            <span className="font-heading text-base font-semibold tracking-[-0.02em] text-[#0E1422]">
              RantaiNaik
            </span>
          </Link>

          {/* Notification Button */}
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative flex h-8 w-8 items-center justify-center rounded-[4px] text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422] transition-colors focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#2862E0]" />
          </button>
        </div>

        {/* 2. User Account / Auth Section (Integrated in Sidebar) */}
        <div className="border-b border-[#E5E7EB] p-3">
          {status === "loading" ? (
            <div className="h-10 w-full animate-pulse rounded-[4px] bg-[#F1F3F5]" />
          ) : session?.user ? (
            /* Logged in User State */
            <div className="flex items-center justify-between gap-2 rounded-[4px] bg-[#FAFBFC] p-2 border border-[#E5E7EB]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#2862E0] text-xs font-semibold text-white">
                  {(session.user.organizationName ||
                    session.user.name ||
                    "U")[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#0E1422]">
                    {session.user.organizationName ||
                      session.user.name ||
                      "Pengguna"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge
                      variant="default"
                      className="text-[10px] px-1 py-0 font-mono"
                    >
                      {role || "USER"}
                    </Badge>
                    {session.user.status === "VERIFIED" && (
                      <span className="text-[10px] font-medium text-[#15803D]">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Keluar dari akun"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] text-[#5B6475] hover:bg-[#FEE2E2] hover:text-[#B91C1C] transition-colors focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* Guest / Public Unauthenticated State */
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="w-full text-xs rounded-[4px]"
                >
                  <Link
                    href="/login"
                    onClick={onCloseMobile}
                    className="flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Masuk
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="w-full text-xs rounded-[4px]"
                >
                  <Link
                    href="/register"
                    onClick={onCloseMobile}
                    className="flex items-center justify-center gap-1.5 font-semibold"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Daftar
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Navigation Groups & Links */}
        <nav className="space-y-4 px-3 py-3" aria-label="Navigasi Utama">
          {groups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <p className="px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5B6475]">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item: NavItem) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={cn(
                          "group flex items-center justify-between rounded-[4px] px-2.5 py-2 text-xs font-medium transition-colors",
                          active
                            ? "bg-[#EFF4FE] font-semibold text-[#2862E0] border-l-2 border-[#2862E0]"
                            : "text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422]"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              active
                                ? "text-[#2862E0]"
                                : "text-[#5B6475] group-hover:text-[#0E1422]"
                            )}
                          />
                          <span className="truncate">{item.title}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded-[2px] bg-[#F1F3F5] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#0E1422]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* ================= BOTTOM FOOTER SECTION ================= */}
      <div className="border-t border-[#E5E7EB] p-3 text-xs text-[#5B6475]">
        <div className="space-y-1">
          <Link
            href="/panduan"
            onClick={onCloseMobile}
            className="flex items-center gap-2 rounded-[4px] px-2 py-1 text-xs text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#0E1422] transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Pusat Bantuan & Panduan</span>
          </Link>
          <div className="flex items-center justify-between px-2 pt-1 font-mono text-[10px] text-[#5B6475]">
            <span>SDG 9 Pengadaan Tekstil</span>
            <span className="font-semibold text-[#2862E0]">Fase 1</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
