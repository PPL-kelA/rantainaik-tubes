import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
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
import { AdminConfigPanel } from "../AdminConfigPanel";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/konfigurasi");
  }

  try {
    requireRole(session.user.role, ["ADMIN"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const [
    scoringConfig,
    platformConfig,
    rawCategories,
    rawServices,
    rawCertifications,
    rawRules,
  ] = await Promise.all([
    loadScoringConfig(),
    loadPlatformConfig(),
    listCategoriesHierarchy(),
    listProductionServices(),
    listCertifications(),
    listRecommendationRules(),
  ]);

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

  return (
    <div className="bg-white">
      {/* 1. Page Header */}
      <PageHeader
        title="Konfigurasi Platform & Master Data Tekstil"
        description="Tata kelola bobot penilaian kesiapan UMKM (Readiness Score), bobot matching tender, batas parameter platform, taksonomi industri, dan katalog sertifikasi (Spec 10, 14, 23.2)."
        actions={
          <div className="flex items-center gap-1.5">
            <StatusBadge status="MASTER CONFIGURATION" variant="default" />
            <span className="font-mono text-xs text-[#5B6475]">
              Append-Only Audit
            </span>
          </div>
        }
      />

      {/* 2. In-Page Search Bar */}
      <div className="border-b border-[#E5E7EB] px-6 py-4 bg-white">
        <SearchBar
          placeholder="Cari parameter, taksonomi pakaian, tipe sertifikasi, atau aturan rekomendasi..."
          defaultValue=""
          aria-label="Cari konfigurasi platform"
        />
      </div>

      {/* 3. Master Config Panel */}
      <AdminConfigPanel
        initialScoring={scoringConfig}
        initialPlatform={platformConfig}
        categories={serializedCategories}
        services={serializedServices}
        certifications={serializedCertifications}
        rules={serializedRules}
      />
    </div>
  );
}
