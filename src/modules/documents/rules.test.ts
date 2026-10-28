import { describe, expect, it } from "vitest";
import { isMinimumDocsMet, getMissingDocTypes, DocumentSummary } from "./rules";

describe("isMinimumDocsMet", () => {
  const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365); // +1 year
  const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10); // 10 days ago

  describe("UMKM verification", () => {
    it("returns true when all 4 minimum documents are VERIFIED and valid", () => {
      const docs: DocumentSummary[] = [
        { type: "NIB", status: "VERIFIED", validUntil: futureDate },
        { type: "NPWP", status: "VERIFIED" },
        { type: "IZIN_USAHA", status: "VERIFIED" },
        { type: "FOTO_BENGKEL", status: "VERIFIED" },
      ];

      expect(isMinimumDocsMet("UMKM", docs)).toBe(true);
      expect(getMissingDocTypes("UMKM", docs)).toEqual([]);
    });

    it("returns false if any document is missing or PENDING or REJECTED", () => {
      const docs: DocumentSummary[] = [
        { type: "NIB", status: "VERIFIED" },
        { type: "NPWP", status: "REJECTED" },
        { type: "IZIN_USAHA", status: "PENDING" },
        // FOTO_BENGKEL is missing
      ];

      expect(isMinimumDocsMet("UMKM", docs)).toBe(false);
      const missing = getMissingDocTypes("UMKM", docs);
      expect(missing).toContain("NPWP");
      expect(missing).toContain("IZIN_USAHA");
      expect(missing).toContain("FOTO_BENGKEL");
      expect(missing).not.toContain("NIB");
    });

    it("returns false if a document is expired", () => {
      const docs: DocumentSummary[] = [
        { type: "NIB", status: "VERIFIED", validUntil: pastDate },
        { type: "NPWP", status: "VERIFIED" },
        { type: "IZIN_USAHA", status: "VERIFIED" },
        { type: "FOTO_BENGKEL", status: "VERIFIED" },
      ];

      expect(isMinimumDocsMet("UMKM", docs)).toBe(false);
      expect(getMissingDocTypes("UMKM", docs)).toContain("NIB");
    });
  });

  describe("INDUSTRY verification", () => {
    it("returns true when NPWP, KONTAK_PIC, and NIB are VERIFIED", () => {
      const docs: DocumentSummary[] = [
        { type: "NIB", status: "VERIFIED" },
        { type: "NPWP", status: "VERIFIED" },
        { type: "KONTAK_PIC", status: "VERIFIED" },
      ];

      expect(isMinimumDocsMet("INDUSTRY", docs)).toBe(true);
      expect(getMissingDocTypes("INDUSTRY", docs)).toEqual([]);
    });

    it("returns true when NPWP, KONTAK_PIC, and AKTA (instead of NIB) are VERIFIED", () => {
      const docs: DocumentSummary[] = [
        { type: "AKTA", status: "VERIFIED" },
        { type: "NPWP", status: "VERIFIED" },
        { type: "KONTAK_PIC", status: "VERIFIED" },
      ];

      expect(isMinimumDocsMet("INDUSTRY", docs)).toBe(true);
      expect(getMissingDocTypes("INDUSTRY", docs)).toEqual([]);
    });

    it("returns false if neither NIB nor AKTA is present", () => {
      const docs: DocumentSummary[] = [
        { type: "NPWP", status: "VERIFIED" },
        { type: "KONTAK_PIC", status: "VERIFIED" },
      ];

      expect(isMinimumDocsMet("INDUSTRY", docs)).toBe(false);
      expect(getMissingDocTypes("INDUSTRY", docs)).toContain("NIB_ATAU_AKTA");
    });

    it("returns false if KONTAK_PIC is missing or rejected", () => {
      const docs: DocumentSummary[] = [
        { type: "NIB", status: "VERIFIED" },
        { type: "NPWP", status: "VERIFIED" },
        { type: "KONTAK_PIC", status: "REJECTED" },
      ];

      expect(isMinimumDocsMet("INDUSTRY", docs)).toBe(false);
      expect(getMissingDocTypes("INDUSTRY", docs)).toContain("KONTAK_PIC");
    });
  });
});
