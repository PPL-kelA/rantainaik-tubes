"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ShieldCheck, Clock } from "lucide-react";
import { Badge, Button } from "@/components/ui";

export function AuthNavButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 w-20 animate-pulse rounded-[4px] bg-[#E5E7EB]" />
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/login"
            className="text-xs font-medium text-[#5B6475] hover:text-[#0E1422]"
          >
            Masuk
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link href="/register" className="text-xs font-semibold">
            Daftar
          </Link>
        </Button>
      </div>
    );
  }

  const role = session.user.role;
  const isVerified = session.user.status === "VERIFIED";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Role & Verification Badge */}
      <div className="hidden sm:flex items-center gap-1.5">
        <Badge
          variant="outline"
          className="font-mono text-[11px] rounded-[2px] border-[#8B93A1]"
        >
          {role}
        </Badge>
        {isVerified ? (
          <Badge variant="success" dot className="text-[11px] rounded-[2px]">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </Badge>
        ) : (
          <Badge variant="warning" dot className="text-[11px] rounded-[2px]">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )}
      </div>

      {/* User Inisial / Nama */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#FAFBFC] text-[#2862E0] border border-[#E5E7EB]">
          <User className="h-3.5 w-3.5" />
        </div>
        <div className="hidden xl:block text-left">
          <p className="text-xs font-medium text-[#0E1422] truncate max-w-[130px]">
            {session.user.organizationName || session.user.email}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        title="Keluar"
        className="rounded-[4px] p-1.5 text-[#5B6475] hover:bg-[#FAFBFC] hover:text-[#B91C1C] border border-transparent hover:border-[#E5E7EB] transition-colors focus:outline-none focus:ring-1 focus:ring-[#2862E0]"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
