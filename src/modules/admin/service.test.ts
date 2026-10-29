import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  updateReadinessWeights,
  updatePlatformParameters,
  resetReadinessWeightsToDefault,
} from "./service";
import * as repo from "./repo";
import * as auditService from "@/modules/audit/service";

vi.mock("./repo");
vi.mock("@/modules/audit/service");

describe("Admin Configuration Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates readiness weights and creates an audit log entry", async () => {
    const validWeights = {
      legalitas: 15,
      fasilitas: 25,
      mutu: 20,
      rekamJejak: 20,
      administrasi: 10,
      finansial: 10,
    };

    vi.spyOn(repo, "updateReadinessWeights").mockResolvedValue({
      id: "default",
      readinessLegalitas: 15,
      readinessKapasitas: 25,
      readinessMutu: 20,
      readinessRekamJejak: 20,
      readinessAdmin: 10,
      readinessFinansial: 10,
      matchingKategori: 25,
      matchingKapasitas: 20,
      matchingBahan: 15,
      matchingLeadTime: 10,
      matchingLokasi: 10,
      matchingReadiness: 10,
      matchingReputasi: 10,
      updatedAt: new Date(),
    });

    const auditSpy = vi.spyOn(auditService, "audit").mockResolvedValue(null);

    const result = await updateReadinessWeights("admin-1", validWeights);
    expect(result.readinessLegalitas).toBe(15);
    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "SCORING_CONFIG",
        action: "UPDATE_READINESS_WEIGHTS",
        actorId: "admin-1",
      })
    );
  });

  it("updates platform params and creates an audit log entry", async () => {
    const validParams = {
      commissionPercent: 6,
      minLots: 2,
      maxLots: 5,
      minLotQty: 25,
      fundingDeadlineHours: 48,
      autoConfirmMaterialHours: 48,
      autoConfirmQcDays: 7,
      umkmInactivityGraceHours: 72,
      disputeClaimWindowDays: 7,
      cancellationFeePercent: 3,
    };

    vi.spyOn(repo, "updatePlatformConfig").mockResolvedValue({
      id: "default",
      ...validParams,
      compensationMatrix: null,
      updatedAt: new Date(),
    });

    const auditSpy = vi.spyOn(auditService, "audit").mockResolvedValue(null);

    const result = await updatePlatformParameters("admin-1", validParams);
    expect(result.commissionPercent).toBe(6);
    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "PLATFORM_CONFIG",
        action: "UPDATE_PLATFORM_CONFIG",
        actorId: "admin-1",
      })
    );
  });

  it("resets readiness weights to default spec and audits", async () => {
    vi.spyOn(repo, "updateReadinessWeights").mockResolvedValue({
      id: "default",
      readinessLegalitas: 20,
      readinessKapasitas: 20,
      readinessMutu: 20,
      readinessRekamJejak: 20,
      readinessAdmin: 10,
      readinessFinansial: 10,
      matchingKategori: 25,
      matchingKapasitas: 20,
      matchingBahan: 15,
      matchingLeadTime: 10,
      matchingLokasi: 10,
      matchingReadiness: 10,
      matchingReputasi: 10,
      updatedAt: new Date(),
    });

    const auditSpy = vi.spyOn(auditService, "audit").mockResolvedValue(null);

    await resetReadinessWeightsToDefault("admin-1");
    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "UPDATE_READINESS_WEIGHTS",
        details: expect.objectContaining({
          legalitas: 20,
          fasilitas: 20,
          mutu: 20,
          rekamJejak: 20,
          administrasi: 10,
          finansial: 10,
        }),
      })
    );
  });
});
