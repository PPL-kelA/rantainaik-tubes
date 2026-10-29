import { describe, expect, it, vi, beforeEach } from "vitest";
import { updateOrganizationProfile } from "./service";
import * as repo from "./repo";
import * as auditService from "@/modules/audit/service";

vi.mock("./repo");
vi.mock("@/modules/audit/service");

describe("updateOrganizationProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOrg = {
    id: "org-123",
    type: "UMKM" as const,
    name: "CV Lama",
    city: "Bandung",
    province: "Jawa Barat",
    address: "Jl. Lama No 1",
    picName: "Budi",
    picPhone: "08123456789",
    verificationStatus: "PENDING" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      {
        userId: "user-1",
        organizationId: "org-123",
        role: "OWNER" as const,
        id: "m-1",
        createdAt: new Date(),
        user: {
          id: "user-1",
          email: "user@test.id",
          passwordHash: "hash",
          role: "UMKM" as const,
          status: "PENDING" as const,
          failedLoginAttempts: 0,
          lockedUntil: null,
          resetToken: null,
          resetTokenExpiry: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ],
    documents: [],
  };

  it("updates organization profile and creates an audit log with lightweight diff", async () => {
    vi.spyOn(repo, "getOrganizationById").mockResolvedValue(
      mockOrg as unknown as Awaited<ReturnType<typeof repo.getOrganizationById>>
    );
    vi.spyOn(repo, "updateOrganization").mockResolvedValue({
      ...mockOrg,
      name: "CV Baru Mandiri",
      city: "Cimahi",
    } as unknown as Awaited<ReturnType<typeof repo.updateOrganization>>);

    const auditSpy = vi.spyOn(auditService, "audit").mockResolvedValue(null);

    const result = await updateOrganizationProfile(
      "user-1",
      "UMKM",
      "org-123",
      {
        name: "CV Baru Mandiri",
        city: "Cimahi",
        province: "Jawa Barat",
        address: "Jl. Lama No 1",
        picName: "Budi",
        picPhone: "08123456789",
      }
    );

    expect(result.name).toBe("CV Baru Mandiri");
    expect(auditSpy).toHaveBeenCalledWith({
      entity: "ORGANIZATION",
      entityId: "org-123",
      action: "UPDATE_PROFILE",
      actorId: "user-1",
      details: {
        name: { from: "CV Lama", to: "CV Baru Mandiri" },
        city: { from: "Bandung", to: "Cimahi" },
      },
    });
  });

  it("throws error if user is not member and not admin", async () => {
    vi.spyOn(repo, "getOrganizationById").mockResolvedValue(
      mockOrg as unknown as Awaited<ReturnType<typeof repo.getOrganizationById>>
    );

    await expect(
      updateOrganizationProfile("other-user", "UMKM", "org-123", {
        name: "Hacked",
        city: "Jakarta",
        province: "DKI Jakarta",
        picName: "Hacker",
      })
    ).rejects.toThrow("Anda tidak memiliki akses");
  });
});
