import { describe, expect, it, vi, beforeEach } from "vitest";
import { reviewDocument } from "./service";
import * as repo from "./repo";
import * as auditService from "@/modules/audit/service";
import * as emailLib from "@/lib/email";

vi.mock("./repo");
vi.mock("@/modules/audit/service");
vi.mock("@/lib/email");

describe("reviewDocument", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOrg = {
    id: "org-umkm-1",
    type: "UMKM" as const,
    name: "CV Konveksi Barokah",
    verificationStatus: "PENDING" as const,
    members: [{ userId: "user-umkm", user: { email: "umkm@barokah.id" } }],
  };

  const mockDoc = {
    id: "doc-1",
    organizationId: "org-umkm-1",
    type: "FOTO_BENGKEL" as const,
    fileUrl: "/api/documents/files/mock.jpg",
    fileName: "bengkel.jpg",
    status: "PENDING" as const,
    rejectionReason: null,
    organization: mockOrg,
  };

  it("approves document, records audit, and verifies organization when minimum docs met", async () => {
    vi.spyOn(repo, "getDocumentById").mockResolvedValue(
      mockDoc as unknown as Awaited<ReturnType<typeof repo.getDocumentById>>
    );
    vi.spyOn(repo, "updateDocumentStatus").mockResolvedValue({
      ...mockDoc,
      status: "VERIFIED",
    } as unknown as Awaited<ReturnType<typeof repo.updateDocumentStatus>>);

    // Organization now has all 4 required verified documents
    vi.spyOn(repo, "listDocumentsByOrgId").mockResolvedValue([
      { type: "NIB", status: "VERIFIED" },
      { type: "NPWP", status: "VERIFIED" },
      { type: "IZIN_USAHA", status: "VERIFIED" },
      { type: "FOTO_BENGKEL", status: "VERIFIED" },
    ] as unknown as Awaited<ReturnType<typeof repo.listDocumentsByOrgId>>);

    const updateOrgSpy = vi
      .spyOn(repo, "updateOrgAndUsersStatus")
      .mockResolvedValue({
        ...mockOrg,
        verificationStatus: "VERIFIED",
      } as unknown as Awaited<ReturnType<typeof repo.updateOrgAndUsersStatus>>);

    const auditSpy = vi.spyOn(auditService, "audit").mockResolvedValue(null);
    const emailSpy = vi
      .spyOn(emailLib, "sendVerificationNotification")
      .mockResolvedValue({ success: true });

    const result = await reviewDocument("admin-id", {
      documentId: "doc-1",
      status: "VERIFIED",
    });

    expect(result.document.status).toBe("VERIFIED");
    expect(result.organizationVerified).toBe(true);
    expect(updateOrgSpy).toHaveBeenCalledWith("org-umkm-1", "VERIFIED");
    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "ORGANIZATION",
        action: "VERIFY_ORGANIZATION",
      })
    );
    expect(emailSpy).toHaveBeenCalledWith(
      "umkm@barokah.id",
      "CV Konveksi Barokah",
      true
    );
  });

  it("rejects document with mandatory reason, audits, and notifies via email", async () => {
    vi.spyOn(repo, "getDocumentById").mockResolvedValue(
      mockDoc as unknown as Awaited<ReturnType<typeof repo.getDocumentById>>
    );
    vi.spyOn(repo, "updateDocumentStatus").mockResolvedValue({
      ...mockDoc,
      status: "REJECTED",
      rejectionReason: "Foto buram dan tidak terbaca",
    } as unknown as Awaited<ReturnType<typeof repo.updateDocumentStatus>>);

    vi.spyOn(repo, "listDocumentsByOrgId").mockResolvedValue([
      { type: "FOTO_BENGKEL", status: "REJECTED" },
    ] as unknown as Awaited<ReturnType<typeof repo.listDocumentsByOrgId>>);

    const auditSpy = vi.spyOn(auditService, "audit").mockResolvedValue(null);
    const emailSpy = vi
      .spyOn(emailLib, "sendVerificationNotification")
      .mockResolvedValue({ success: true });

    const result = await reviewDocument("admin-id", {
      documentId: "doc-1",
      status: "REJECTED",
      rejectionReason: "Foto buram dan tidak terbaca",
    });

    expect(result.document.status).toBe("REJECTED");
    expect(result.organizationVerified).toBe(false);
    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "DOCUMENT",
        action: "REVIEW_DOCUMENT",
      })
    );
    expect(emailSpy).toHaveBeenCalledWith(
      "umkm@barokah.id",
      "CV Konveksi Barokah",
      false,
      expect.objectContaining({
        reason: "Foto buram dan tidak terbaca",
      })
    );
  });
});
