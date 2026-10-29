import { describe, expect, it } from "vitest";
import {
  validateCapability,
  profileCompleteness,
  checkExpiringCertificates,
  CapabilityInput,
} from "./rules";

describe("UMKM Capabilities Rules (Tahap 5)", () => {
  describe("validateCapability", () => {
    const validData: CapabilityInput = {
      categoryId: "cat-123",
      services: ["CMT", "FULL_PACKAGE"],
      materials: ["Katun Kombed", "Drill"],
      decorations: ["Bordir Komputer"],
      monthlyCapacity: 5000,
      minOrderQty: 50,
      leadTimeDays: 14,
      serviceArea: "Seluruh Indonesia",
    };

    it("accepts valid capability data", () => {
      const result = validateCapability(validData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects negative monthly capacity", () => {
      const result = validateCapability({
        ...validData,
        monthlyCapacity: -100,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Kapasitas bulanan tidak boleh bernilai negatif."
      );
    });

    it("rejects negative min order quantity (MOQ)", () => {
      const result = validateCapability({
        ...validData,
        minOrderQty: -10,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("MOQ tidak boleh bernilai negatif.");
    });

    it("rejects MOQ greater than monthly capacity", () => {
      const result = validateCapability({
        ...validData,
        monthlyCapacity: 500,
        minOrderQty: 1000,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "MOQ tidak boleh melampaui kapasitas bulanan konveksi."
      );
    });

    it("rejects lead time less than 1 day", () => {
      const result = validateCapability({
        ...validData,
        leadTimeDays: 0,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Lead time minimum adalah 1 hari kerja.");
    });
  });

  describe("profileCompleteness", () => {
    it("returns 0% and lists missing sections for an empty profile", () => {
      const completeness = profileCompleteness({
        organization: {
          name: "Konveksi Baru",
          city: "Bandung",
          province: "Jawa Barat",
          description: null,
          address: null,
          picName: "Budi",
          picPhone: null,
          yearEstablished: null,
          operatorCount: null,
          shiftCount: null,
        },
        capabilities: [],
        machines: [],
        portfolio: [],
        certifications: [],
        documentsCount: 0,
      });

      expect(completeness.percentage).toBeLessThan(50);
      expect(completeness.missingItems).toContain(
        "Lengkapi deskripsi tentang usaha konveksi"
      );
      expect(completeness.missingItems).toContain(
        "Tambahkan minimal 1 kapabilitas produk tekstil"
      );
      expect(completeness.missingItems).toContain(
        "Tambahkan minimal 1 aset mesin konveksi"
      );
      expect(completeness.missingItems).toContain(
        "Tambahkan minimal 1 foto portofolio produk"
      );
    });

    it("returns 100% and empty missing list when all profile fields are satisfied", () => {
      const completeness = profileCompleteness({
        organization: {
          name: "CV Sinar Mandiri",
          city: "Bandung",
          province: "Jawa Barat",
          description:
            "Konveksi spesialis seragam kerja dan kemeja dengan kapasitas 10.000 pcs per bulan.",
          address: "Jl. Sentra Rajut Binong No. 12",
          picName: "Bambang",
          picPhone: "08123456789",
          yearEstablished: 2018,
          operatorCount: 20,
          shiftCount: 2,
        },
        capabilities: [
          {
            id: "cap-1",
            categoryId: "cat-1",
            monthlyCapacity: 5000,
            minOrderQty: 50,
          },
        ],
        machines: [{ id: "mac-1", machineType: "Jahit Lurus", quantity: 15 }],
        portfolio: [
          {
            id: "port-1",
            title: "Kemeja Seragam PT ABC",
            imageUrl: "/demo.jpg",
          },
        ],
        certifications: [{ id: "cert-1", validUntil: new Date("2030-01-01") }],
        documentsCount: 3,
      });

      expect(completeness.percentage).toBe(100);
      expect(completeness.missingItems).toHaveLength(0);
    });
  });

  describe("checkExpiringCertificates", () => {
    const now = new Date("2026-10-29T00:00:00.000Z");

    it("detects valid certificates", () => {
      const certs = [
        {
          id: "cert-1",
          name: "OEKO-TEX Standard 100",
          validUntil: new Date("2027-10-29T00:00:00.000Z"),
        },
      ];
      const result = checkExpiringCertificates(certs, 30, now);
      expect(result[0].status).toBe("VALID");
    });

    it("detects certificates expiring within 30 days", () => {
      const certs = [
        {
          id: "cert-2",
          name: "Uji Lab SNI Kain Katun",
          validUntil: new Date("2026-11-15T00:00:00.000Z"), // ~17 days ahead
        },
      ];
      const result = checkExpiringCertificates(certs, 30, now);
      expect(result[0].status).toBe("EXPIRING_SOON");
      expect(result[0].daysRemaining).toBeLessThanOrEqual(30);
      expect(result[0].daysRemaining).toBeGreaterThan(0);
    });

    it("detects already expired certificates", () => {
      const certs = [
        {
          id: "cert-3",
          name: "Sertifikat Mutu ISO 9001",
          validUntil: new Date("2026-10-15T00:00:00.000Z"), // ~14 days ago
        },
      ];
      const result = checkExpiringCertificates(certs, 30, now);
      expect(result[0].status).toBe("EXPIRED");
      expect(result[0].daysRemaining).toBeLessThan(0);
    });
  });
});
