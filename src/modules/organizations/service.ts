import * as repo from "./repo";
import {
  UpdateOrganizationProfileSchema,
  UpdateOrganizationProfileInput,
} from "./schema";
import { audit } from "@/modules/audit/service";
import { Prisma } from "@prisma/client";

export async function updateOrganizationProfile(
  userId: string,
  userRole: string,
  orgId: string,
  input: UpdateOrganizationProfileInput
) {
  const validated = UpdateOrganizationProfileSchema.parse(input);

  const existingOrg = await repo.getOrganizationById(orgId);
  if (!existingOrg) {
    throw new Error("Organisasi tidak ditemukan.");
  }

  // Authorization check: User must be a member of this organization or ADMIN
  const isMember = existingOrg.members.some((m) => m.userId === userId);
  if (!isMember && userRole !== "ADMIN") {
    throw new Error(
      "Anda tidak memiliki akses untuk mengubah profil organisasi ini."
    );
  }

  // Keep audit details lightweight (only diff fields)
  const changes: Record<string, { from: string | null; to: string | null }> =
    {};
  if (existingOrg.name !== validated.name)
    changes.name = { from: existingOrg.name, to: validated.name };
  if (existingOrg.city !== validated.city)
    changes.city = { from: existingOrg.city, to: validated.city };
  if (existingOrg.province !== validated.province)
    changes.province = { from: existingOrg.province, to: validated.province };
  if (existingOrg.address !== (validated.address ?? null))
    changes.address = {
      from: existingOrg.address,
      to: validated.address ?? null,
    };
  if (existingOrg.picName !== validated.picName)
    changes.picName = { from: existingOrg.picName, to: validated.picName };
  if (existingOrg.picPhone !== (validated.picPhone ?? null))
    changes.picPhone = {
      from: existingOrg.picPhone,
      to: validated.picPhone ?? null,
    };

  const updatedOrg = await repo.updateOrganization(orgId, validated);

  if (Object.keys(changes).length > 0) {
    await audit({
      entity: "ORGANIZATION",
      entityId: orgId,
      action: "UPDATE_PROFILE",
      actorId: userId,
      details: changes as Prisma.InputJsonValue,
    });
  }

  return updatedOrg;
}

export async function getOrganizationDetails(orgId: string) {
  return repo.getOrganizationById(orgId);
}

export async function getUserOrganization(userId: string) {
  return repo.getOrganizationByUserId(userId);
}
