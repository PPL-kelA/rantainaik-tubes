import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, Scale, FileText, CheckCircle } from "lucide-react";
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
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
              Portal Administrasi Platform
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Dashboard Administrator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF2F2] px-3 py-1 text-xs font-semibold text-[#B91C1C] border border-[#FECACA]">
              <ShieldAlert className="h-3.5 w-3.5" />
              Role: ADMIN
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-[#15803D] border border-[#DCFCE7]">
              <CheckCircle className="h-3.5 w-3.5" />
              Super Privileges
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#4B5563] leading-relaxed">
          Area kerja terpusat untuk verifikasi berkas NIB UMKM/Industri, audit
          transaksi append-only ledger escrow, mediasi sengketa hasil QC, dan
          manajemen pengguna platform.
        </p>

        {/* 4-Column Stat Strip */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">Antrean Verifikasi</span>
              <FileText className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {pendingCount}
            </p>
            <span className="text-[11px] text-[#B45309] font-medium">
              {pendingCount} akun menunggu telaah & ACC
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">
                Pengguna Terverifikasi
              </span>
              <CheckCircle className="h-4 w-4 text-[#15803D]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {verifiedCount}
            </p>
            <span className="text-[11px] text-[#15803D] font-medium">
              Siap transaksi & RFQ
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">Total Akun Terdaftar</span>
              <Users className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#111827]">
              {serializedUsers.length}
            </p>
            <span className="text-[11px] text-[#6B7280]">
              UMKM, Industri & Admin
            </span>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-medium">Status Escrow</span>
              <Scale className="h-4 w-4 text-[#1D4ED8]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#111827]">Normal</p>
            <span className="text-[11px] text-[#1D4ED8] font-medium">
              0 sengketa aktif
            </span>
          </div>
        </div>
      </div>

      {/* P23 Kurasi Dokumen & Antrean Organisasi */}
      <AdminVerificationQueue initialQueue={serializedQueue} />

      {/* Interactive Verification Component */}
      <AdminVerificationTable initialUsers={serializedUsers} />

      {/* P23.2 Master Data & Konfigurasi Platform */}
      <div id="konfigurasi" className="pt-2">
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
