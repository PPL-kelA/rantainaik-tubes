import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { getUserOrganization } from "@/modules/organizations/service";
import { getUmkmFullProfile } from "@/modules/capabilities/service";
import {
  listCategoriesHierarchy,
  listProductionServices,
  listCertifications,
} from "@/modules/admin/service";
import { UmkmProfileClient } from "./UmkmProfileClient";
import { OrganizationProfileForm } from "@/components/domain/OrganizationProfileForm";
import { DocumentUploadSection } from "@/components/domain/DocumentUploadSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UmkmProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/umkm/profil");
  }

  try {
    requireRole(session.user.role, ["UMKM"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  const organization = await getUserOrganization(session.user.id);
  if (!organization) {
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#EF4444]">
          Data organisasi tidak ditemukan untuk akun ini.
        </p>
      </div>
    );
  }

  const [fullProfile, categories, services, certifications] = await Promise.all(
    [
      getUmkmFullProfile(organization.id),
      listCategoriesHierarchy(),
      listProductionServices(),
      listCertifications(),
    ]
  );

  // Safe Serialization for Next.js Client Component Boundary
  const serializedProfile = {
    organization: {
      id: fullProfile.organization.id,
      name: fullProfile.organization.name,
      city: fullProfile.organization.city,
      province: fullProfile.organization.province,
      address: fullProfile.organization.address,
      description: fullProfile.organization.description,
      picName: fullProfile.organization.picName,
      picPhone: fullProfile.organization.picPhone,
      yearEstablished: fullProfile.organization.yearEstablished,
      operatorCount: fullProfile.organization.operatorCount,
      shiftCount: fullProfile.organization.shiftCount,
      verificationStatus: fullProfile.organization.verificationStatus,
      createdAt: fullProfile.organization.createdAt.toISOString(),
    },
    capabilities: fullProfile.capabilities.map((c) => ({
      id: c.id,
      categoryId: c.categoryId,
      category: {
        id: c.category.id,
        name: c.category.name,
        parent: c.category.parent
          ? { id: c.category.parent.id, name: c.category.parent.name }
          : null,
      },
      services: c.services,
      materials: c.materials,
      decorations: c.decorations,
      monthlyCapacity: c.monthlyCapacity,
      minOrderQty: c.minOrderQty,
      leadTimeDays: c.leadTimeDays,
      serviceArea: c.serviceArea,
      notes: c.notes,
    })),
    machines: fullProfile.machines.map((m) => ({
      id: m.id,
      machineType: m.machineType,
      brand: m.brand,
      quantity: m.quantity,
      condition: m.condition,
    })),
    portfolio: fullProfile.portfolio.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      productType: p.productType,
      clientType: p.clientType,
      largestOrderQty: p.largestOrderQty,
      imageUrl: p.imageUrl,
    })),
    certifications: fullProfile.certifications.map((c) => ({
      id: c.id,
      certificationId: c.certificationId,
      certification: {
        id: c.certification.id,
        name: c.certification.name,
        issuer: c.certification.issuer,
      },
      certificateNumber: c.certificateNumber,
      validUntil: c.validUntil ? c.validUntil.toISOString() : null,
      expiryStatus: c.expiryStatus,
      daysRemaining: c.daysRemaining,
    })),
    documents: fullProfile.documents.map((d) => ({
      id: d.id,
      type: d.type,
      status: d.status,
      validUntil: d.validUntil ? d.validUntil.toISOString() : null,
    })),
    stats: fullProfile.stats,
    completeness: fullProfile.completeness,
  };

  const serializedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    children: (cat.children || []).map((ch) => ({
      id: ch.id,
      name: ch.name,
      slug: ch.slug,
    })),
  }));

  const serializedServices = services.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
  }));

  const serializedMasterCerts = certifications.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#1D4ED8] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Dashboard UMKM
        </Link>
      </div>

      {/* P4: Full Profile & Capabilities Interface */}
      <UmkmProfileClient
        initialProfile={serializedProfile}
        categories={serializedCategories}
        productionServices={serializedServices}
        masterCertifications={serializedMasterCerts}
      />

      {/* Accordion / Bagian Dokumen Legalitas NIB / NPWP */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111827]">
          Kelola Berkas Dokumen Legalitas (NIB & Izin Usaha)
        </h3>
        <DocumentUploadSection
          organizationId={organization.id}
          orgType={organization.type}
          documents={organization.documents}
        />
      </div>

      {/* Form Edit Data Umum Organisasi */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111827]">
          Data Kontak & Domisili Perusahaan
        </h3>
        <OrganizationProfileForm organization={organization} />
      </div>
    </div>
  );
}
