import { db } from "@/lib/db";
import { UpdateOrganizationProfileInput } from "./schema";

export async function getOrganizationById(orgId: string) {
  return db.organization.findUnique({
    where: { id: orgId },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
      },
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getOrganizationByUserId(userId: string) {
  const member = await db.organizationMember.findFirst({
    where: { userId },
    include: {
      organization: {
        include: {
          documents: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  return member?.organization ?? null;
}

export async function updateOrganization(
  orgId: string,
  data: UpdateOrganizationProfileInput
) {
  return db.organization.update({
    where: { id: orgId },
    data: {
      name: data.name,
      city: data.city,
      province: data.province,
      address: data.address ?? null,
      picName: data.picName,
      picPhone: data.picPhone ?? null,
    },
  });
}
