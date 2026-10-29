import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface CreateAuditLogParams {
  entity: string;
  entityId: string;
  action: string;
  actorId?: string | null;
  details?: Prisma.InputJsonValue;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  return db.auditLog.create({
    data: {
      entity: params.entity,
      entityId: params.entityId,
      action: params.action,
      actorId: params.actorId ?? null,
      details: params.details ?? Prisma.JsonNull,
    },
  });
}

export async function listAuditLogs(filter?: {
  entity?: string;
  entityId?: string;
  actorId?: string;
  limit?: number;
}) {
  return db.auditLog.findMany({
    where: {
      ...(filter?.entity ? { entity: filter.entity } : {}),
      ...(filter?.entityId ? { entityId: filter.entityId } : {}),
      ...(filter?.actorId ? { actorId: filter.actorId } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: filter?.limit ?? 50,
  });
}
