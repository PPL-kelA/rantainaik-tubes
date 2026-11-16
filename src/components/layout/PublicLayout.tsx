import React from "react";
import {
  AnnouncementBar,
  PublicNavbar,
  PublicFooter,
} from "@/components/landing";

export interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-[#0E1422] selection:bg-[#EFF4FE] selection:text-[#2862E0] flex flex-col w-full overflow-x-hidden">
      <AnnouncementBar />
      <PublicNavbar />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <PublicFooter />
    </div>
  );
}
