import { db } from "@/lib/db";

export async function getCapabilitiesByOrg(organizationId: string) {
  return db.capability.findMany({
    where: { organizationId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          parent: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function upsertCapability(
  organizationId: string,
  data: {
    categoryId: string;
    services: string[];
    materials: string[];
    decorations: string[];
    monthlyCapacity: number;
    minOrderQty: number;
    leadTimeDays: number;
    serviceArea?: string | null;
    notes?: string | null;
  }
) {
  return db.capability.upsert({
    where: {
      organizationId_categoryId: {
        organizationId,
        categoryId: data.categoryId,
      },
    },
    update: {
      services: data.services,
      materials: data.materials,
      decorations: data.decorations,
      monthlyCapacity: data.monthlyCapacity,
      minOrderQty: data.minOrderQty,
      leadTimeDays: data.leadTimeDays,
      serviceArea: data.serviceArea ?? null,
      notes: data.notes ?? null,
    },
    create: {
      organizationId,
      categoryId: data.categoryId,
      services: data.services,
      materials: data.materials,
      decorations: data.decorations,
      monthlyCapacity: data.monthlyCapacity,
      minOrderQty: data.minOrderQty,
      leadTimeDays: data.leadTimeDays,
      serviceArea: data.serviceArea ?? null,
      notes: data.notes ?? null,
    },
  });
}

export async function deleteCapability(id: string, organizationId: string) {
  return db.capability.deleteMany({
    where: { id, organizationId },
  });
}

// Machine Assets
export async function getMachineAssetsByOrg(organizationId: string) {
  return db.machineAsset.findMany({
    where: { organizationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createMachineAsset(
  organizationId: string,
  data: {
    machineType: string;
    brand?: string | null;
    quantity: number;
    condition?: string | null;
  }
) {
  return db.machineAsset.create({
    data: {
      organizationId,
      machineType: data.machineType,
      brand: data.brand ?? null,
      quantity: data.quantity,
      condition: data.condition ?? "BAIK",
    },
  });
}

export async function deleteMachineAsset(id: string, organizationId: string) {
  return db.machineAsset.deleteMany({
    where: { id, organizationId },
  });
}

// Portfolio
export async function getPortfolioItemsByOrg(organizationId: string) {
  return db.portfolioItem.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPortfolioItem(
  organizationId: string,
  data: {
    title: string;
    description?: string | null;
    productType: string;
    clientType?: string | null;
    largestOrderQty?: number | null;
    imageUrl: string;
  }
) {
  return db.portfolioItem.create({
    data: {
      organizationId,
      title: data.title,
      description: data.description ?? null,
      productType: data.productType,
      clientType: data.clientType ?? null,
      largestOrderQty: data.largestOrderQty ?? null,
      imageUrl: data.imageUrl,
    },
  });
}

export async function deletePortfolioItem(id: string, organizationId: string) {
  return db.portfolioItem.deleteMany({
    where: { id, organizationId },
  });
}

// Certifications
export async function getOrgCertifications(organizationId: string) {
  return db.orgCertification.findMany({
    where: { organizationId },
    include: {
      certification: {
        select: {
          id: true,
          name: true,
          issuer: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrgCertification(
  organizationId: string,
  data: {
    certificationId: string;
    certificateNumber?: string | null;
    documentUrl?: string | null;
    validUntil?: Date | null;
  }
) {
  return db.orgCertification.create({
    data: {
      organizationId,
      certificationId: data.certificationId,
      certificateNumber: data.certificateNumber ?? null,
      documentUrl: data.documentUrl ?? null,
      validUntil: data.validUntil ?? null,
    },
  });
}

export async function deleteOrgCertification(
  id: string,
  organizationId: string
) {
  return db.orgCertification.deleteMany({
    where: { id, organizationId },
  });
}

// Update basic facility details
export async function updateOrganizationDetails(
  organizationId: string,
  data: {
    description?: string | null;
    yearEstablished?: number | null;
    operatorCount?: number | null;
    shiftCount?: number | null;
  }
) {
  return db.organization.update({
    where: { id: organizationId },
    data: {
      description: data.description,
      yearEstablished: data.yearEstablished,
      operatorCount: data.operatorCount,
      shiftCount: data.shiftCount,
    },
  });
}
