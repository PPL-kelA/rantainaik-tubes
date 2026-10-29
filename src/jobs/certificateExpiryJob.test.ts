import { describe, expect, it, vi, beforeEach } from "vitest";
import { runCertificateExpiryCheckJob } from "./certificateExpiryJob";
import { db } from "@/lib/db";
import * as auditService from "@/modules/audit/service";

vi.mock("@/lib/db", () => ({
  db: {
    orgCertification: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/modules/audit/service", () => ({
  audit: vi.fn(),
}));

describe("Certificate Expiry Scheduled Job", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("identifies certificates expiring soon and expired, then records audit", async () => {
    const now = new Date();
    const mockExpiringSoon = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days ahead
    const mockExpired = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago

    vi.mocked(db.orgCertification.findMany).mockResolvedValue([
      {
        id: "cert-1",
        validUntil: mockExpiringSoon,
        certification: { name: "OEKO-TEX Standard 100" },
        organization: { id: "org-1", name: "CV Konveksi Sukses" },
      },
      {
        id: "cert-2",
        validUntil: mockExpired,
        certification: { name: "ISO 9001" },
        organization: { id: "org-1", name: "CV Konveksi Sukses" },
      },
    ] as unknown as Awaited<ReturnType<typeof db.orgCertification.findMany>>);

    const result = await runCertificateExpiryCheckJob(30);

    expect(result.totalFound).toBe(2);
    expect(result.expiringSoon).toHaveLength(1);
    expect(result.expired).toHaveLength(1);
    expect(auditService.audit).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "JOB_CERTIFICATE_EXPIRY",
        action: "DETECT_EXPIRING_CERTIFICATES",
      })
    );
  });
});
