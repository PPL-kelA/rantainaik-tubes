"use client";

import React, { useState } from "react";
import {
  FileText,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/ui";
import { SearchBar } from "@/components/ui/search-bar";
import {
  AdminVerificationQueue,
  OrgQueueItem,
} from "../AdminVerificationQueue";
import { AdminVerificationTable, UserItem } from "../AdminVerificationTable";

interface VerificationUnifiedProps {
  queue: OrgQueueItem[];
  users: UserItem[];
}

export function AdminVerificationUnifiedClient({
  queue,
  users,
}: VerificationUnifiedProps) {
  const [activeTab, setActiveTab] = useState<"docs" | "users">("docs");
  const [searchQuery, setSearchQuery] = useState("");

  const pendingDocsCount = queue.reduce((acc, org) => {
    return (
      acc +
      org.documents.filter(
        (d) => d.status !== "VERIFIED" && d.status !== "REJECTED"
      ).length
    );
  }, 0);

  const pendingUsersCount = users.filter((u) => u.status === "PENDING").length;
  const verifiedUsersCount = users.filter(
    (u) => u.status === "VERIFIED"
  ).length;

  return (
    <div className="bg-white">
      {/* 1. Page Header */}
      <PageHeader
        title="Pusat Verifikasi Akun & Dokumen Legalitas"
        description="Satu pintu verifikasi terpadu untuk kurasi berkas legalitas organisasi (NIB, NPWP, Akta, Workshop) dan otorisasi aktivasi akun pengguna baru sesuai regulasi BR-01."
        actions={
          <div className="flex items-center gap-1.5">
            <StatusBadge status="KURASI TERPUSAT" variant="default" />
            <span className="font-mono text-xs text-[#5B6475]">
              BR-01 Kepatuhan
            </span>
          </div>
        }
      />

      {/* 2. In-Page Search Bar */}
      <div className="border-b border-[#E5E7EB] px-6 py-4 bg-white">
        <SearchBar
          placeholder="Cari nama organisasi, nomor NIB, nama PIC, email akun, atau dokumen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          aria-label="Cari antrean verifikasi"
        />
      </div>

      {/* 3. 3-Column Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#E5E7EB] bg-white">
        <div className="p-6 border-b md:border-b-0 md:border-r border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Dokumen Menunggu Telaah</span>
            <FileText className="h-4 w-4 text-[#B45309]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {pendingDocsCount}
          </p>
          <span className="text-[11px] font-mono text-[#B45309]">
            Berkas NIB / NPWP / Akta aktif
          </span>
        </div>

        <div className="p-6 border-b md:border-b-0 md:border-r border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">
              Akun Pengguna Menunggu ACC
            </span>
            <Clock className="h-4 w-4 text-[#2862E0]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {pendingUsersCount}
          </p>
          <span className="text-[11px] font-mono text-[#2862E0]">
            Siap diverifikasi menjadi VERIFIED
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">
              Total Akun Terverifikasi
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {verifiedUsersCount}
          </p>
          <span className="text-[11px] font-mono text-[#15803D]">
            Dapat bertransaksi & memposting RFQ
          </span>
        </div>
      </div>

      {/* 4. Underline Tabs Selector */}
      <div className="border-b border-[#E5E7EB] bg-white px-6">
        <div className="flex gap-8 -mb-px">
          <button
            type="button"
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-2 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              activeTab === "docs"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#D1D5DB]"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Dokumen Legalitas Organisasi (P23)</span>
            {pendingDocsCount > 0 && (
              <span className="rounded-[2px] bg-[#FEF3C7] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#B45309]">
                {pendingDocsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              activeTab === "users"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422] hover:border-[#D1D5DB]"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Verifikasi Akun Pengguna</span>
            {pendingUsersCount > 0 && (
              <span className="rounded-[2px] bg-[#EFF4FE] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#2862E0]">
                {pendingUsersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 5. Tab Content Panel */}
      <div>
        {activeTab === "docs" ? (
          <div>
            <AdminVerificationQueue initialQueue={queue} />
          </div>
        ) : (
          <div>
            <AdminVerificationTable initialUsers={users} />
          </div>
        )}
      </div>
    </div>
  );
}
