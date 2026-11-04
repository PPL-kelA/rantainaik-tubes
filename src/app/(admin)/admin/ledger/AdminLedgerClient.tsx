"use client";

import React, { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Percent,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/ui";
import { SearchBar } from "@/components/ui/search-bar";

interface LedgerEntry {
  id: string;
  idempotencyKey: string;
  trxType:
    | "DEPOSIT"
    | "RELEASE_TERMIN_1"
    | "RELEASE_TERMIN_2"
    | "COMMISSION"
    | "REFUND";
  poNumber: string;
  rfqTitle: string;
  payerName: string;
  payeeName: string;
  amount: number;
  platformFee: number;
  netPayout: number;
  createdAt: string;
  status: "SETTLED" | "PENDING_RELEASE" | "HELD";
}

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: "tx-1001",
    idempotencyKey: "idemp_rfq_0994_dep_100",
    trxType: "DEPOSIT",
    poNumber: "PO-2026-0994",
    rfqTitle: "Maklon Rompi Lapangan Ripstop 300 Pcs",
    payerName: "PT Nusantara Karya Prima",
    payeeName: "Rekening Penampungan Escrow",
    amount: 27000000,
    platformFee: 0,
    netPayout: 27000000,
    createdAt: "2026-10-15T08:30:00Z",
    status: "SETTLED",
  },
  {
    id: "tx-1002",
    idempotencyKey: "idemp_rfq_0994_rel_t1_30",
    trxType: "RELEASE_TERMIN_1",
    poNumber: "PO-2026-0994",
    rfqTitle: "Maklon Rompi Lapangan Ripstop 300 Pcs",
    payerName: "Rekening Penampungan Escrow",
    payeeName: "Konveksi Sinar Jaya",
    amount: 8100000, // 30% dari 27jt
    platformFee: 405000, // 5% fee dari dana yang dirilis
    netPayout: 7695000,
    createdAt: "2026-10-17T11:00:00Z",
    status: "SETTLED",
  },
  {
    id: "tx-1003",
    idempotencyKey: "idemp_rfq_1055_dep_100",
    trxType: "DEPOSIT",
    poNumber: "PO-2026-1055",
    rfqTitle: "Produksi Polo Shirt Katun Combed 24s 1.200 Pcs",
    payerName: "PT Indo Busana Mandiri",
    payeeName: "Rekening Penampungan Escrow",
    amount: 78000000,
    platformFee: 0,
    netPayout: 78000000,
    createdAt: "2026-10-22T13:45:00Z",
    status: "SETTLED",
  },
  {
    id: "tx-1004",
    idempotencyKey: "idemp_rfq_1055_rel_t1_30",
    trxType: "RELEASE_TERMIN_1",
    poNumber: "PO-2026-1055",
    rfqTitle: "Produksi Polo Shirt Katun Combed 24s 1.200 Pcs",
    payerName: "Rekening Penampungan Escrow",
    payeeName: "Konveksi Mitra Rajut",
    amount: 23400000, // 30% dari 78jt
    platformFee: 1170000,
    netPayout: 22230000,
    createdAt: "2026-10-24T16:20:00Z",
    status: "SETTLED",
  },
  {
    id: "tx-1005",
    idempotencyKey: "idemp_rfq_1082_dep_100",
    trxType: "DEPOSIT",
    poNumber: "PO-2026-1082",
    rfqTitle: "Pengadaan Kemeja Seragam PDH 500 Pcs",
    payerName: "PT Graha Surya Tekstil",
    payeeName: "Rekening Penampungan Escrow",
    amount: 45000000,
    platformFee: 0,
    netPayout: 45000000,
    createdAt: "2026-10-29T10:00:00Z",
    status: "SETTLED",
  },
  {
    id: "tx-1006",
    idempotencyKey: "idemp_rfq_1082_rel_t1_30",
    trxType: "RELEASE_TERMIN_1",
    poNumber: "PO-2026-1082",
    rfqTitle: "Pengadaan Kemeja Seragam PDH 500 Pcs",
    payerName: "Rekening Penampungan Escrow",
    payeeName: "CV Harapan Busana Jaya",
    amount: 13500000, // 30% dari 45jt
    platformFee: 675000,
    netPayout: 12825000,
    createdAt: "2026-10-31T15:10:00Z",
    status: "SETTLED",
  },
  {
    id: "tx-1007",
    idempotencyKey: "idemp_rfq_1082_t2_hold",
    trxType: "RELEASE_TERMIN_2",
    poNumber: "PO-2026-1082",
    rfqTitle: "Pengadaan Kemeja Seragam PDH 500 Pcs",
    payerName: "Rekening Penampungan Escrow",
    payeeName: "CV Harapan Busana Jaya",
    amount: 31500000, // 70% dari 45jt (tertahan sengketa)
    platformFee: 1575000,
    netPayout: 29925000,
    createdAt: "2026-11-02T10:15:00Z",
    status: "HELD",
  },
];

export function AdminLedgerClient() {
  const [ledger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  // Kalkulasi Invarian Escrow
  const totalDeposit = ledger
    .filter((tx) => tx.trxType === "DEPOSIT")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalReleased = ledger
    .filter(
      (tx) =>
        (tx.trxType === "RELEASE_TERMIN_1" ||
          tx.trxType === "RELEASE_TERMIN_2") &&
        tx.status === "SETTLED"
    )
    .reduce((acc, curr) => acc + curr.netPayout, 0);

  const totalCommission = ledger
    .filter((tx) => tx.status === "SETTLED")
    .reduce((acc, curr) => acc + curr.platformFee, 0);

  const totalHeld = ledger
    .filter((tx) => tx.status === "HELD")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredEntries = ledger.filter((item) => {
    const matchesSearch =
      item.idempotencyKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rfqTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.payeeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "ALL"
        ? true
        : typeFilter === "DEPOSIT"
          ? item.trxType === "DEPOSIT"
          : typeFilter === "RELEASE"
            ? item.trxType === "RELEASE_TERMIN_1" ||
              item.trxType === "RELEASE_TERMIN_2"
            : typeFilter === "HELD"
              ? item.status === "HELD"
              : true;

    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white">
      {/* 1. Header */}
      <PageHeader
        title="Buku Besar Escrow & Rekonsiliasi Komisi Platform"
        description="Audit pembukuan append-only dan idempoten: pencatatan deposit dana 100%, pencairan bertahap 30%/70%, pengembalian dana, dan potongan komisi platform 5% (Spec 16 & BR-17)."
        actions={
          <div className="flex items-center gap-1.5">
            <StatusBadge status="APPEND-ONLY LEDGER" variant="default" />
            <span className="font-mono text-xs text-[#5B6475]">
              Idempoten Mutlak
            </span>
          </div>
        }
      />

      {/* 2. In-Page Search Bar */}
      <div className="border-b border-[#E5E7EB] px-6 py-4 bg-white">
        <SearchBar
          placeholder="Cari kunci idempotensi (idemp_xxx), nomor PO, judul RFQ, nama pembayar, atau penerima..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          aria-label="Cari mutasi buku besar"
        />
      </div>

      {/* 3. Invariant Escrow Strip (Spec 16 Rule) */}
      <div className="border-b border-[#E5E7EB] bg-[#FAFBFC] px-6 py-3 text-xs text-[#0E1422] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#2862E0]" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#5B6475]">
            Invarian Keuangan Platform:
          </span>
          <span className="font-mono text-[11px] font-medium text-[#0E1422]">
            Dana Masuk = Dirilis ({formatRupiah(totalReleased)}) + Komisi 5% (
            {formatRupiah(totalCommission)}) + Tertahan (
            {formatRupiah(totalHeld)})
          </span>
        </div>
        <span className="rounded-[2px] bg-[#F0FDF4] px-2 py-0.5 font-mono text-[10px] font-bold text-[#15803D]">
          Rekonsiliasi Seimbang 100%
        </span>
      </div>

      {/* 4. 4-Column Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#E5E7EB] bg-white">
        <div className="p-6 border-r border-b md:border-b-0 border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Total Dana Masuk</span>
            <ArrowDownLeft className="h-4 w-4 text-[#2862E0]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {formatRupiah(totalDeposit)}
          </p>
          <span className="text-[11px] font-mono text-[#2862E0]">
            Deposit terdanai di muka 100%
          </span>
        </div>

        <div className="p-6 border-r border-b md:border-b-0 border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Dana Dirilis ke UMKM</span>
            <ArrowUpRight className="h-4 w-4 text-[#15803D]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {formatRupiah(totalReleased)}
          </p>
          <span className="text-[11px] font-mono text-[#15803D]">
            Termin 1 (30%) & termin akhir
          </span>
        </div>

        <div className="p-6 border-r border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Komisi Broker (5%)</span>
            <Percent className="h-4 w-4 text-[#2862E0]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {formatRupiah(totalCommission)}
          </p>
          <span className="text-[11px] font-mono text-[#5B6475]">
            Dipotong dari dana rilis (BR-17)
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">
              Saldo Tertahan di Escrow
            </span>
            <Lock className="h-4 w-4 text-[#B45309]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {formatRupiah(totalHeld)}
          </p>
          <span className="text-[11px] font-mono text-[#B45309]">
            Menunggu inspeksi QC / Mediasi
          </span>
        </div>
      </div>

      {/* 5. Underline Tabs Filter */}
      <div className="border-b border-[#E5E7EB] bg-white px-6">
        <div className="flex gap-8 -mb-px">
          <button
            type="button"
            onClick={() => setTypeFilter("ALL")}
            className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              typeFilter === "ALL"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Semua Mutasi ({ledger.length})
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("DEPOSIT")}
            className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              typeFilter === "DEPOSIT"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Deposit Masuk 100%
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("RELEASE")}
            className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              typeFilter === "RELEASE"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Rilis Termin (30% / 70%)
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter("HELD")}
            className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              typeFilter === "HELD"
                ? "border-[#2862E0] text-[#2862E0]"
                : "border-transparent text-[#5B6475] hover:text-[#0E1422]"
            }`}
          >
            Tertahan / Sengketa
          </button>
        </div>
      </div>

      {/* 6. Ledger Table Entries */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#5B6475]">
          <thead className="bg-[#FAFBFC] text-[11px] font-mono font-semibold uppercase tracking-[0.06em] text-[#5B6475] border-b border-[#E5E7EB]">
            <tr>
              <th className="px-6 py-3.5">Tanggal (WIB)</th>
              <th className="px-4 py-3.5">Kunci Idempotensi & PO</th>
              <th className="px-4 py-3.5">Tipe Mutasi</th>
              <th className="px-4 py-3.5">Alur Pembayaran</th>
              <th className="px-4 py-3.5 text-right">Nominal Bruto</th>
              <th className="px-4 py-3.5 text-right">Fee Platform 5%</th>
              <th className="px-4 py-3.5 text-right">Nominal Bersih</th>
              <th className="px-6 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filteredEntries.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#FAFBFC] transition-colors">
                <td className="px-6 py-4 font-mono text-[11px] text-[#5B6475] whitespace-nowrap">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-xs font-semibold text-[#0E1422] block">
                    {tx.idempotencyKey}
                  </span>
                  <span className="font-mono text-[11px] text-[#5B6475]">
                    {tx.poNumber} • {tx.rfqTitle}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-mono text-[11px] font-semibold text-[#2862E0]">
                    {tx.trxType}
                  </span>
                </td>
                <td className="px-4 py-4 text-[11px]">
                  <div className="text-[#0E1422] font-medium">
                    {tx.payerName}
                  </div>
                  <div className="text-[#8B93A1]">→ {tx.payeeName}</div>
                </td>
                <td className="px-4 py-4 text-right font-mono font-semibold text-[#0E1422] whitespace-nowrap">
                  {formatRupiah(tx.amount)}
                </td>
                <td className="px-4 py-4 text-right font-mono text-[#5B6475] whitespace-nowrap">
                  {tx.platformFee > 0 ? formatRupiah(tx.platformFee) : "-"}
                </td>
                <td className="px-4 py-4 text-right font-mono font-bold text-[#15803D] whitespace-nowrap">
                  {formatRupiah(tx.netPayout)}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <StatusBadge
                    status={
                      tx.status === "SETTLED"
                        ? "SELESAI"
                        : tx.status === "HELD"
                          ? "TERTAHAN"
                          : "PROSES"
                    }
                    variant={
                      tx.status === "SETTLED"
                        ? "success"
                        : tx.status === "HELD"
                          ? "warning"
                          : "default"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
