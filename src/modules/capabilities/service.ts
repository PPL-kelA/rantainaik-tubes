import * as repo from "./repo";
import {
  CapabilitySchema,
  MachineAssetSchema,
  PortfolioItemSchema,
  OrgCertificationSchema,
  UpdateProfileDetailsSchema,
} from "./schema";
import {
  validateCapability,
  profileCompleteness,
  checkExpiringCertificates,
} from "./rules";
import { audit } from "@/modules/audit/service";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getUmkmFullProfile(organizationId: string) {
  const [
    organization,
    capabilities,
    machines,
    portfolio,
    certifications,
    documents,
  ] = await Promise.all([
    db.organization.findUnique({
      where: { id: organizationId },
    }),
    repo.getCapabilitiesByOrg(organizationId),
    repo.getMachineAssetsByOrg(organizationId),
    repo.getPortfolioItemsByOrg(organizationId),
    repo.getOrgCertifications(organizationId),
    db.document.findMany({
      where: { organizationId },
      select: { id: true, type: true, status: true, validUntil: true },
    }),
  ]);

  if (!organization) {
    throw new Error("Organisasi tidak ditemukan");
  }

  // Calculate completeness
  const completeness = profileCompleteness({
    organization: {
      name: organization.name,
      city: organization.city,
      province: organization.province,
      description: organization.description,
      address: organization.address,
      picName: organization.picName,
      picPhone: organization.picPhone,
      yearEstablished: organization.yearEstablished,
      operatorCount: organization.operatorCount,
      shiftCount: organization.shiftCount,
    },
    capabilities: capabilities.map((c) => ({
      id: c.id,
      categoryId: c.categoryId,
      monthlyCapacity: c.monthlyCapacity,
      minOrderQty: c.minOrderQty,
    })),
    machines: machines.map((m) => ({
      id: m.id,
      machineType: m.machineType,
      quantity: m.quantity,
    })),
    portfolio: portfolio.map((p) => ({
      id: p.id,
      title: p.title,
      imageUrl: p.imageUrl,
    })),
    certifications: certifications.map((c) => ({
      id: c.id,
      validUntil: c.validUntil,
    })),
    documentsCount: documents.length,
  });

  // Check certificate expiry status
  const checkedCertificates = checkExpiringCertificates(
    certifications.map((c) => ({
      id: c.id,
      name: c.certification.name,
      validUntil: c.validUntil,
    }))
  );

  // Aggregate stats
  const totalCapacity = capabilities.reduce(
    (sum, c) => sum + c.monthlyCapacity,
    0
  );
  const totalMachines = machines.reduce((sum, m) => sum + m.quantity, 0);

  return {
    organization,
    capabilities,
    machines,
    portfolio,
    certifications: certifications.map((c) => {
      const checked = checkedCertificates.find((chk) => chk.id === c.id);
      return {
        ...c,
        expiryStatus: checked?.status ?? "VALID",
        daysRemaining: checked?.daysRemaining ?? null,
      };
    }),
    documents,
    stats: {
      totalCapacity,
      totalMachines,
      totalPortfolio: portfolio.length,
      operatorCount: organization.operatorCount || 0,
      shiftCount: organization.shiftCount || 1,
    },
    completeness,
  };
}

export async function saveCapability(
  userId: string,
  organizationId: string,
  rawData: unknown
) {
  const validated = CapabilitySchema.parse(rawData);
  const ruleCheck = validateCapability(validated);
  if (!ruleCheck.valid) {
    throw new Error(ruleCheck.errors.join(", "));
  }

  const result = await repo.upsertCapability(organizationId, validated);

  await audit({
    entity: "CAPABILITY",
    entityId: result.id,
    action: "UPSERT_CAPABILITY",
    actorId: userId,
    details: {
      categoryId: validated.categoryId,
      monthlyCapacity: validated.monthlyCapacity,
      minOrderQty: validated.minOrderQty,
    } as Prisma.JsonObject,
  });

  return result;
}

export async function removeCapability(
  userId: string,
  organizationId: string,
  capabilityId: string
) {
  const res = await repo.deleteCapability(capabilityId, organizationId);
  await audit({
    entity: "CAPABILITY",
    entityId: capabilityId,
    action: "DELETE_CAPABILITY",
    actorId: userId,
  });
  return res;
}

export async function addMachineAsset(
  userId: string,
  organizationId: string,
  rawData: unknown
) {
  const validated = MachineAssetSchema.parse(rawData);
  const result = await repo.createMachineAsset(organizationId, validated);

  await audit({
    entity: "MACHINE_ASSET",
    entityId: result.id,
    action: "CREATE_MACHINE_ASSET",
    actorId: userId,
    details: {
      machineType: validated.machineType,
      quantity: validated.quantity,
    } as Prisma.JsonObject,
  });

  return result;
}

export async function removeMachineAsset(
  userId: string,
  organizationId: string,
  machineId: string
) {
  const res = await repo.deleteMachineAsset(machineId, organizationId);
  await audit({
    entity: "MACHINE_ASSET",
    entityId: machineId,
    action: "DELETE_MACHINE_ASSET",
    actorId: userId,
  });
  return res;
}

export async function addPortfolioItem(
  userId: string,
  organizationId: string,
  rawData: unknown
) {
  const validated = PortfolioItemSchema.parse(rawData);
  const result = await repo.createPortfolioItem(organizationId, validated);

  await audit({
    entity: "PORTFOLIO_ITEM",
    entityId: result.id,
    action: "CREATE_PORTFOLIO_ITEM",
    actorId: userId,
    details: {
      title: validated.title,
      productType: validated.productType,
    } as Prisma.JsonObject,
  });

  return result;
}

export async function removePortfolioItem(
  userId: string,
  organizationId: string,
  portfolioId: string
) {
  const res = await repo.deletePortfolioItem(portfolioId, organizationId);
  await audit({
    entity: "PORTFOLIO_ITEM",
    entityId: portfolioId,
    action: "DELETE_PORTFOLIO_ITEM",
    actorId: userId,
  });
  return res;
}

export async function addOrgCertification(
  userId: string,
  organizationId: string,
  rawData: unknown
) {
  const validated = OrgCertificationSchema.parse(rawData);
  const validUntil = validated.validUntil
    ? new Date(validated.validUntil)
    : null;

  const result = await repo.createOrgCertification(organizationId, {
    certificationId: validated.certificationId,
    certificateNumber: validated.certificateNumber,
    documentUrl: validated.documentUrl,
    validUntil,
  });

  await audit({
    entity: "ORG_CERTIFICATION",
    entityId: result.id,
    action: "CREATE_ORG_CERTIFICATION",
    actorId: userId,
    details: {
      certificationId: validated.certificationId,
      validUntil: validUntil ? validUntil.toISOString() : null,
    } as Prisma.JsonObject,
  });

  return result;
}

export async function removeOrgCertification(
  userId: string,
  organizationId: string,
  certId: string
) {
  const res = await repo.deleteOrgCertification(certId, organizationId);
  await audit({
    entity: "ORG_CERTIFICATION",
    entityId: certId,
    action: "DELETE_ORG_CERTIFICATION",
    actorId: userId,
  });
  return res;
}

export async function updateOrgFacilityDetails(
  userId: string,
  organizationId: string,
  rawData: unknown
) {
  const validated = UpdateProfileDetailsSchema.parse(rawData);
  const res = await repo.updateOrganizationDetails(organizationId, validated);

  await audit({
    entity: "ORGANIZATION",
    entityId: organizationId,
    action: "UPDATE_FACILITY_DETAILS",
    actorId: userId,
    details: validated as unknown as Prisma.JsonObject,
  });

  return res;
}
