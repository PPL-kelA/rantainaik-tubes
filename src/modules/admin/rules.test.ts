import { describe, expect, it } from "vitest";
import {
  DEFAULT_READINESS_WEIGHTS,
  DEFAULT_MATCHING_WEIGHTS,
  DEFAULT_PLATFORM_CONFIG,
  validateReadinessWeights,
  validateMatchingWeights,
  validatePlatformParams,
} from "./rules";

describe("Scoring and Platform Configuration Rules", () => {
  describe("Default Spec Values", () => {
    it("default readiness weights sum to exactly 100", () => {
      const result = validateReadinessWeights(DEFAULT_READINESS_WEIGHTS);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);

      const sum =
        DEFAULT_READINESS_WEIGHTS.legalitas +
        DEFAULT_READINESS_WEIGHTS.fasilitas +
        DEFAULT_READINESS_WEIGHTS.mutu +
        DEFAULT_READINESS_WEIGHTS.rekamJejak +
        DEFAULT_READINESS_WEIGHTS.administrasi +
        DEFAULT_READINESS_WEIGHTS.finansial;
      expect(sum).toBe(100);
    });

    it("default matching weights sum to exactly 100", () => {
      const result = validateMatchingWeights(DEFAULT_MATCHING_WEIGHTS);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);

      const sum =
        DEFAULT_MATCHING_WEIGHTS.kategori +
        DEFAULT_MATCHING_WEIGHTS.kapasitas +
        DEFAULT_MATCHING_WEIGHTS.bahanDekorasi +
        DEFAULT_MATCHING_WEIGHTS.leadTime +
        DEFAULT_MATCHING_WEIGHTS.lokasi +
        DEFAULT_MATCHING_WEIGHTS.readiness +
        DEFAULT_MATCHING_WEIGHTS.reputasi;
      expect(sum).toBe(100);
    });

    it("default platform parameters match spec 7.12 and P23", () => {
      expect(DEFAULT_PLATFORM_CONFIG.commissionPercent).toBe(5);
      expect(DEFAULT_PLATFORM_CONFIG.minLots).toBe(2);
      expect(DEFAULT_PLATFORM_CONFIG.maxLots).toBe(4);
      expect(DEFAULT_PLATFORM_CONFIG.minLotQty).toBe(20);
      expect(DEFAULT_PLATFORM_CONFIG.fundingDeadlineHours).toBe(72);
      expect(DEFAULT_PLATFORM_CONFIG.autoConfirmMaterialHours).toBe(48);
      expect(DEFAULT_PLATFORM_CONFIG.autoConfirmQcDays).toBe(5);
      expect(DEFAULT_PLATFORM_CONFIG.cancellationFeePercent).toBe(2);

      const validation = validatePlatformParams(DEFAULT_PLATFORM_CONFIG);
      expect(validation.valid).toBe(true);
    });
  });

  describe("Validation Failures & Edge Cases", () => {
    it("rejects readiness weights when sum is not 100", () => {
      const invalidWeights = {
        ...DEFAULT_READINESS_WEIGHTS,
        legalitas: 25, // Total becomes 105
      };
      const result = validateReadinessWeights(invalidWeights);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("harus tepat 100");
    });

    it("rejects negative weights in readiness and matching", () => {
      const negativeReadiness = {
        ...DEFAULT_READINESS_WEIGHTS,
        legalitas: -10,
        fasilitas: 50, // Total 100 but contains negative
      };
      const resReadiness = validateReadinessWeights(negativeReadiness);
      expect(resReadiness.valid).toBe(false);
      expect(resReadiness.errors.some((e) => e.includes("negatif"))).toBe(true);

      const negativeMatching = {
        ...DEFAULT_MATCHING_WEIGHTS,
        kategori: -5,
        kapasitas: 50,
      };
      const resMatching = validateMatchingWeights(negativeMatching);
      expect(resMatching.valid).toBe(false);
      expect(resMatching.errors.some((e) => e.includes("negatif"))).toBe(true);
    });

    it("rejects platform params when maxLots is less than minLots", () => {
      const invalidLots = {
        ...DEFAULT_PLATFORM_CONFIG,
        minLots: 4,
        maxLots: 2, // invalid
      };
      const result = validatePlatformParams(invalidLots);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes("tidak boleh lebih kecil"))
      ).toBe(true);
    });

    it("rejects negative commission percent or fee percent > 100", () => {
      const negativeCommission = {
        ...DEFAULT_PLATFORM_CONFIG,
        commissionPercent: -5,
      };
      const result = validatePlatformParams(negativeCommission);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("komisi"))).toBe(true);

      const excessiveFee = {
        ...DEFAULT_PLATFORM_CONFIG,
        cancellationFeePercent: 120,
      };
      const resFee = validatePlatformParams(excessiveFee);
      expect(resFee.valid).toBe(false);
      expect(resFee.errors.some((e) => e.includes("pembatalan"))).toBe(true);
    });
  });
});
