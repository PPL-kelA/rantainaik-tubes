import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Scale,
  FileText,
  CheckCircle,
  ShieldCheck,
  FolderKanban,
  Settings,
  ArrowRight,
} from "lucide-react";
import { listUsersForAdmin } from "@/modules/auth/service";
import { listVerificationQueue } from "@/modules/documents/repo";
import {
  loadScoringConfig,
  loadPlatformConfig,
  listCategoriesHierarchy,
  listProductionServices,
  listCertifications,
  listRecommendationRules,
} from "@/modules/admin/service";
import { PageHeader, StatusBadge } from "@/components/ui";
import { SearchBar } from "@/components/ui/search-bar";
import { AdminVerificationTable } from "./AdminVerificationTable";
import { AdminVerificationQueue } from "./AdminVerificationQueue";
import { AdminConfigPanel } from "./AdminConfigPanel";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  try {
    requireRole(session.user.role, ["ADMIN"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const [
    rawUsers,
    rawQueue,
    scoringConfig,
    platformConfig,
    rawCategories,
    rawServices,
    rawCertifications,
    rawRules,
  ] = await Promise.all([
    listUsersForAdmin(),
    listVerificationQueue(),
    loadScoringConfig(),
    loadPlatformConfig(),
    listCategoriesHierarchy(),
    listProductionServices(),
    listCertifications(),
    listRecommendationRules(),
  ]);

  const serializedUsers = rawUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  const serializedCategories = rawCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    children: (c.children || []).map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
    })),
  }));

  const serializedServices = rawServices.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
  }));

  const serializedCertifications = rawCertifications.map((cert) => ({
    id: cert.id,
    name: cert.name,
    issuer: cert.issuer,
    description: cert.description,
  }));

  const serializedRules = rawRules.map((r) => ({
    id: r.id,
    component: r.component,
    condition: r.condition,
    text: r.text,
    points: r.points,
    difficulty: r.difficulty,
  }));

  const serializedQueue = rawQueue.map((org) => ({
    id: org.id,
    name: org.name,
    type: org.type,
    city: org.city,
    province: org.province,
    picName: org.picName,
    picPhone: org.picPhone,
    verificationStatus: org.verificationStatus,
    createdAt: org.createdAt.toISOString(),
    documents: org.documents.map((d) => ({
      id: d.id,
      type: d.type,
      fileName: d.fileName,
      fileSize: d.fileSize,
      status: d.status,
      rejectionReason: d.rejectionReason,
      validUntil: d.validUntil ? d.validUntil.toISOString() : null,
      createdAt: d.createdAt.toISOString(),
    })),
    members: org.members.map((m) => ({
      userId: m.userId,
      user: {
        id: m.user.id,
        email: m.user.email,
        status: m.user.status,
      },
    })),
  }));

  const pendingCount = serializedUsers.filter(
    (u) => u.status === "PENDING"
  ).length;
  const verifiedCount = serializedUsers.filter(
    (u) => u.status === "VERIFIED"
  ).length;

  return (
    <div className="bg-white">
      {/* 1. Page Header Standar R2 */}
      <PageHeader
        title="Dashboard Administrator"
        description="Area kerja terpusat untuk kurasi berkas legalitas NIB/NPWP, audit ledger escrow, mediasi sengketa QC, dan tata kelola master data platform RantaiNaik."
        actions={
          <div className="flex items-center gap-1.5">
            <StatusBadge status="Role: ADMIN" variant="destructive" />
            <StatusBadge status="SUPER PRIVILEGES" variant="success" />
          </div>
        }
      />

      {/* 2. In-page Search Bar Compartment */}
      <div className="border-b border-[#E5E7EB] px-6 py-4 bg-white">
        <SearchBar
          placeholder="Cari organisasi, nomor NIB, nama PIC, email pengguna, atau ID transaksi..."
          defaultValue=""
          aria-label="Pencarian cepat platform"
        />
      </div>

      {/* 3. 4-Column Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#E5E7EB] bg-white">
        <div className="p-6 border-r border-b md:border-b-0 border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Antrean Verifikasi</span>
            <FileText className="h-4 w-4" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {pendingCount}
          </p>
          <span className="text-[11px] font-mono font-medium text-[#B45309]">
            {pendingCount} akun menunggu telaah & ACC
          </span>
        </div>

        <div className="p-6 border-r border-b md:border-b-0 border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Pengguna Terverifikasi</span>
            <CheckCircle className="h-4 w-4 text-[#15803D]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {verifiedCount}
          </p>
          <span className="text-[11px] font-mono font-medium text-[#15803D]">
            Siap transaksi & posting RFQ
          </span>
        </div>

        <div className="p-6 border-r border-[#E5E7EB]">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Total Akun Terdaftar</span>
            <Users className="h-4 w-4" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            {serializedUsers.length}
          </p>
          <span className="text-[11px] font-mono text-[#5B6475]">
            UMKM, Industri & Admin
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-[#5B6475]">
            <span className="text-xs font-medium">Status Escrow</span>
            <Scale className="h-4 w-4 text-[#2862E0]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-[#0E1422]">
            Normal
          </p>
          <span className="text-[11px] font-mono font-medium text-[#2862E0]">
            0 sengketa tertahan
          </span>
        </div>
      </div>

      {/* 4. Quick Shortcut Strip to Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#E5E7EB] bg-white divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
        <Link
          href="/admin/verifikasi"
          className="p-5 hover:bg-[#FAFBFC] transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#5B6475]">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-[#8B93A1]">
                Modul Kurasi
              </span>
              <ShieldCheck className="h-4 w-4 text-[#2862E0]" />
            </div>
            <h3 className="mt-1.5 text-sm font-semibold text-[#0E1422] group-hover:text-[#2862E0] transition-colors">
              Verifikasi Akun & Dokumen
            </h3>
            <p className="mt-1 text-xs text-[#5B6475]">
              Validasi berkas NIB, NPWP, Akta & aktivasi akun baru terpadu.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#2862E0]">
            <span>Buka Halaman</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/sengketa"
          className="p-5 hover:bg-[#FAFBFC] transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#5B6475]">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-[#8B93A1]">
                Penjaminan Mutu
              </span>
              <Scale className="h-4 w-4 text-[#B45309]" />
            </div>
            <h3 className="mt-1.5 text-sm font-semibold text-[#0E1422] group-hover:text-[#2862E0] transition-colors">
              Mediasi Sengketa QC
            </h3>
            <p className="mt-1 text-xs text-[#5B6475]">
              Arbitrase perselisihan mutu hasil inspeksi dan window kompensasi.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#2862E0]">
            <span>Buka Halaman</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/ledger"
          className="p-5 hover:bg-[#FAFBFC] transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#5B6475]">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-[#8B93A1]">
                Pembukuan Escrow
              </span>
              <FolderKanban className="h-4 w-4 text-[#15803D]" />
            </div>
            <h3 className="mt-1.5 text-sm font-semibold text-[#0E1422] group-hover:text-[#2862E0] transition-colors">
              Ledger & Rekonsiliasi
            </h3>
            <p className="mt-1 text-xs text-[#5B6475]">
              Audit append-only transaksi deposit, termin, dan komisi platform
              5%.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#2862E0]">
            <span>Buka Halaman</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/konfigurasi"
          className="p-5 hover:bg-[#FAFBFC] transition-colors group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#5B6475]">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-[#8B93A1]">
                Master Data
              </span>
              <Settings className="h-4 w-4 text-[#0E1422]" />
            </div>
            <h3 className="mt-1.5 text-sm font-semibold text-[#0E1422] group-hover:text-[#2862E0] transition-colors">
              Konfigurasi Master Data
            </h3>
            <p className="mt-1 text-xs text-[#5B6475]">
              Pengaturan bobot scoring, parameter platform, dan taksonomi.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#2862E0]">
            <span>Buka Halaman</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 5. P23 Kurasi Dokumen & Antrean Organisasi */}
      <AdminVerificationQueue initialQueue={serializedQueue} />

      {/* 6. Interactive Verification Table Component */}
      <AdminVerificationTable initialUsers={serializedUsers} />

      {/* 7. P23.2 Master Data & Konfigurasi Platform (Kept for direct anchor & test suite compatibility) */}
      <div id="konfigurasi" className="border-t border-[#E5E7EB]">
        <AdminConfigPanel
          initialScoring={scoringConfig}
          initialPlatform={platformConfig}
          categories={serializedCategories}
          services={serializedServices}
          certifications={serializedCertifications}
          rules={serializedRules}
        />
      </div>
    </div>
  );
}
