import { describe, expect, it } from "vitest";
import {
  computeReadiness,
  recommendNextSteps,
  ReadinessInput,
  ReadinessConfig,
  DEFAULT_READINESS_CONFIG,
} from "./rules";

describe("Industrial Readiness Score Rules (Tahap 6 - Spec 7.7, 7.8)", () => {
  describe("computeReadiness", () => {
    it("evaluates the exact 68 score fixture specified in the prompt and Figma P5", () => {
      // Prompt fixture:
      // Legalitas: 17/20, Kapasitas: 15/20, Mutu: 12/20,
      // Rekam jejak: 10/20 (tanpa riwayat, 50%), Administrasi: 8/10, Finansial: 6/10
      // Total: 68/100 -> Tier: "Siap Kemitraan"
      const fixtureInput: ReadinessInput = {
        legalitas: {
          nibVerified: true, // 8 pts
          npwpVerified: true, // 4 pts
          izinUsahaDeclared: true, // 2 pts (self-declared 50% of 4)
          alamatFotoVerified: false,
          alamatFotoDeclared: true, // 2 pts (self-declared 50% of 4)
          // 8 + 4 + 2 + 2 = 16, +1 partial = 17 or calibrated points
          customScore: 17,
        },
        kapasitas: {
          customScore: 15,
        },
        mutu: {
          customScore: 12,
        },
        rekamJejak: {
          hasHistory: false, // automatic 50% = 10 / 20
        },
        administrasi: {
          customScore: 8,
        },
        finansial: {
          customScore: 6,
        },
      };

      const result = computeReadiness(fixtureInput, DEFAULT_READINESS_CONFIG);

      expect(result.components.legalitas.score).toBe(17);
      expect(result.components.kapasitas.score).toBe(15);
      expect(result.components.mutu.score).toBe(12);
      expect(result.components.rekamJejak.score).toBe(10);
      expect(result.components.rekamJejak.hasHistory).toBe(false);
      expect(result.components.rekamJejak.note).toContain("belum ada riwayat");
      expect(result.components.administrasi.score).toBe(8);
      expect(result.components.finansial.score).toBe(6);

      expect(result.totalScore).toBe(68);
      expect(result.tier).toBe("Siap Kemitraan");
      expect(result.tierKey).toBe("SIAP_KEMITRAAN");
    });

    it("gives 50% default score with note for new UMKM with no transaction history", () => {
      const input: ReadinessInput = {
        legalitas: { nibVerified: false },
        kapasitas: { customScore: 0 },
        mutu: { customScore: 0 },
        rekamJejak: {
          hasHistory: false,
        },
        administrasi: { customScore: 0 },
        finansial: { customScore: 0 },
      };

      const result = computeReadiness(input, DEFAULT_READINESS_CONFIG);

      expect(result.components.rekamJejak.score).toBe(10); // 50% of 20
      expect(result.components.rekamJejak.maxScore).toBe(20);
      expect(result.components.rekamJejak.note).toBe(
        "belum ada riwayat, memakai nilai awal 50%"
      );
    });

    it("gives zero points for expired documents", () => {
      const inputWithExpiredDoc: ReadinessInput = {
        legalitas: {
          nibVerified: false,
          nibExpired: true, // Expired NIB
          npwpVerified: true, // 4 pts
          izinUsahaVerified: false,
          alamatFotoVerified: false,
        },
        kapasitas: { customScore: 0 },
        mutu: { customScore: 0 },
        rekamJejak: { hasHistory: false },
        administrasi: { customScore: 0 },
        finansial: { customScore: 0 },
      };

      const result = computeReadiness(
        inputWithExpiredDoc,
        DEFAULT_READINESS_CONFIG
      );
      // NIB gives 0 because it's expired
      expect(
        result.components.legalitas.items.find((i) => i.key === "nib")?.score
      ).toBe(0);
      expect(
        result.components.legalitas.items.find((i) => i.key === "nib")?.status
      ).toBe("EXPIRED");
    });

    it("evaluates self-declared items at 50% value and verified items at 100% value", () => {
      // Test A. Legalitas items:
      // NIB: 8 pts (verified) vs 4 pts (self-declared 50%)
      const verifiedInput: ReadinessInput = {
        legalitas: {
          nibVerified: true,
          npwpVerified: true,
          izinUsahaVerified: true,
          alamatFotoVerified: true,
        },
        kapasitas: { customScore: 0 },
        mutu: { customScore: 0 },
        rekamJejak: { hasHistory: false },
        administrasi: { customScore: 0 },
        finansial: { customScore: 0 },
      };

      const declaredInput: ReadinessInput = {
        legalitas: {
          nibVerified: false,
          nibDeclared: true, // 50% of 8 = 4
          npwpVerified: false,
          npwpDeclared: true, // 50% of 4 = 2
          izinUsahaVerified: false,
          izinUsahaDeclared: true, // 50% of 4 = 2
          alamatFotoVerified: false,
          alamatFotoDeclared: true, // 50% of 4 = 2
        },
        kapasitas: { customScore: 0 },
        mutu: { customScore: 0 },
        rekamJejak: { hasHistory: false },
        administrasi: { customScore: 0 },
        finansial: { customScore: 0 },
      };

      const verifiedRes = computeReadiness(
        verifiedInput,
        DEFAULT_READINESS_CONFIG
      );
      const declaredRes = computeReadiness(
        declaredInput,
        DEFAULT_READINESS_CONFIG
      );

      expect(verifiedRes.components.legalitas.score).toBe(20);
      expect(declaredRes.components.legalitas.score).toBe(10); // Exactly 50% of 20
    });

    it("respects dynamic weights loaded from database configuration", () => {
      const customConfig: ReadinessConfig = {
        legalitas: 30, // custom 30
        fasilitas: 15,
        mutu: 15,
        rekamJejak: 20,
        administrasi: 10,
        finansial: 10,
      };

      const input: ReadinessInput = {
        legalitas: {
          nibVerified: true,
          npwpVerified: true,
          izinUsahaVerified: true,
          alamatFotoVerified: true,
        },
        kapasitas: { customScore: 0 },
        mutu: { customScore: 0 },
        rekamJejak: { hasHistory: false },
        administrasi: { customScore: 0 },
        finansial: { customScore: 0 },
      };

      const result = computeReadiness(input, customConfig);

      // Full legalitas now yields 30 pts (instead of 20)
      expect(result.components.legalitas.score).toBe(30);
      expect(result.components.legalitas.maxScore).toBe(30);
    });

    it("correctly assigns tier boundaries", () => {
      const makeInputWithScore = (totalTarget: number): ReadinessInput => ({
        legalitas: { customScore: Math.round(totalTarget * 0.2) },
        kapasitas: { customScore: Math.round(totalTarget * 0.2) },
        mutu: { customScore: Math.round(totalTarget * 0.2) },
        rekamJejak: { customScore: Math.round(totalTarget * 0.2) },
        administrasi: { customScore: Math.round(totalTarget * 0.1) },
        finansial: { customScore: Math.round(totalTarget * 0.1) },
      });

      expect(
        computeReadiness(makeInputWithScore(25), DEFAULT_READINESS_CONFIG).tier
      ).toBe("Tahap Awal");
      expect(
        computeReadiness(makeInputWithScore(45), DEFAULT_READINESS_CONFIG).tier
      ).toBe("Berkembang");
      expect(
        computeReadiness(makeInputWithScore(70), DEFAULT_READINESS_CONFIG).tier
      ).toBe("Siap Kemitraan");
      expect(
        computeReadiness(makeInputWithScore(90), DEFAULT_READINESS_CONFIG).tier
      ).toBe("Siap Industri");
    });
  });

  describe("recommendNextSteps", () => {
    const mockRules = [
      {
        id: "r-1",
        component: "MUTU",
        condition: "sop_qc == false",
        text: "Unggah SOP QC jahit",
        points: 5,
        difficulty: "MUDAH", // ratio = 5 / 1 = 5
      },
      {
        id: "r-2",
        component: "MUTU",
        condition: "uji_lab == false",
        text: "Verifikasi hasil uji lab kain",
        points: 4,
        difficulty: "SEDANG", // ratio = 4 / 2 = 2
      },
      {
        id: "r-3",
        component: "ADMINISTRASI",
        condition: "catat_produksi == false",
        text: "Catat produksi di sistem",
        points: 3,
        difficulty: "MUDAH", // ratio = 3 / 1 = 3
      },
      {
        id: "r-4",
        component: "LEGALITAS",
        condition: "akta == false",
        text: "Lengkapi Akta Notaris",
        points: 4,
        difficulty: "SULIT", // ratio = 4 / 3 = 1.33
      },
    ];

    it("returns top 3 fastest steps ordered by efficiency ratio (points / difficulty)", () => {
      const gaps = [
        "sop_qc == false",
        "uji_lab == false",
        "catat_produksi == false",
        "akta == false",
      ];

      const top3 = recommendNextSteps(gaps, mockRules);

      expect(top3).toHaveLength(3);
      // Order should be: r-1 (ratio 5), r-3 (ratio 3), r-2 (ratio 2)
      expect(top3[0].text).toBe("Unggah SOP QC jahit");
      expect(top3[0].points).toBe(5);
      expect(top3[0].difficulty).toBe("MUDAH");

      expect(top3[1].text).toBe("Catat produksi di sistem");
      expect(top3[1].points).toBe(3);

      expect(top3[2].text).toBe("Verifikasi hasil uji lab kain");
      expect(top3[2].points).toBe(4);
    });
  });
});
