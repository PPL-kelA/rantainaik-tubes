"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ShieldCheck, Clock } from "lucide-react";

export function AuthNavButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-[#F3F4F6]" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-xs font-semibold text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-[#1D4ED8] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF] transition-colors"
        >
          Daftar
        </Link>
      </div>
    );
  }

  const role = session.user.role;
  const isVerified = session.user.status === "VERIFIED";

  return (
    <div className="flex items-center gap-3">
      {/* Role & Verification Badge */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#374151] border border-[#E5E7EB]">
          {role}
        </span>
        {isVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-medium text-[#15803D] border border-[#DCFCE7]">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-medium text-[#B45309] border border-[#FDE68A]">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )}
      </div>

      {/* User Avatar / Name */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
          <User className="h-4 w-4" />
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-xs font-semibold text-[#111827] truncate max-w-[140px]">
            {session.user.organizationName || session.user.email}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        title="Keluar"
        className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#B91C1C] transition-colors"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
