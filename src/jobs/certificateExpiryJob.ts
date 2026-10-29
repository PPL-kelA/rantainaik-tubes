import { db } from "@/lib/db";
import { checkExpiringCertificates } from "@/modules/capabilities/rules";
import { audit } from "@/modules/audit/service";
import { Prisma } from "@prisma/client";

/**
 * Scheduled Job (can be triggered manually or via cron)
 * Checks all organization certificates and documents expiring within 30 days.
 */
export async function runCertificateExpiryCheckJob(thresholdDays: number = 30) {
  const now = new Date();
  const futureThreshold = new Date(
    now.getTime() + thresholdDays * 24 * 60 * 60 * 1000
  );

  // 1. Fetch org certifications expiring soon or expired
  const expiringCerts = await db.orgCertification.findMany({
    where: {
      validUntil: {
        lte: futureThreshold,
      },
    },
    include: {
      certification: { select: { name: true } },
      organization: { select: { id: true, name: true } },
    },
  });

  const checked = checkExpiringCertificates(
    expiringCerts.map((c) => ({
      id: c.id,
      name: c.certification.name,
      validUntil: c.validUntil,
    })),
    thresholdDays,
    now
  );

  const expiringSoonList = checked.filter(
    (c) => c.status === "EXPIRING_SOON" || c.status === "EXPIRED"
  );

  // Record audit log for platform monitoring
  if (expiringSoonList.length > 0) {
    await audit({
      entity: "JOB_CERTIFICATE_EXPIRY",
      entityId: `run-${now.toISOString().slice(0, 10)}`,
      action: "DETECT_EXPIRING_CERTIFICATES",
      actorId: null,
      details: {
        totalChecked: expiringCerts.length,
        expiringSoonCount: expiringSoonList.filter(
          (c) => c.status === "EXPIRING_SOON"
        ).length,
        expiredCount: expiringSoonList.filter((c) => c.status === "EXPIRED")
          .length,
        items: expiringSoonList.map((item) => ({
          id: item.id,
          name: item.name,
          status: item.status,
          daysRemaining: item.daysRemaining,
        })),
      } as Prisma.JsonObject,
    });
  }

  return {
    processedAt: now.toISOString(),
    totalFound: expiringSoonList.length,
    expiringSoon: expiringSoonList.filter((c) => c.status === "EXPIRING_SOON"),
    expired: expiringSoonList.filter((c) => c.status === "EXPIRED"),
  };
}
