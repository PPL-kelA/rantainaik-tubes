import { describe, it, expect } from "vitest";
import {
  validateRfq,
  transitionRfqStatus,
  canAccessRfq,
  canEditRfqDirectly,
  RfqValidationInput,
} from "./rules";

describe("Tahap 7: Aturan Bisnis RFQ (R-01 sampai R-07)", () => {
  const now = new Date("2026-11-01T10:00:00Z");
  const validQaDeadline = new Date("2026-11-18T23:59:59Z");
  const validQuotationDeadline = new Date("2026-11-25T23:59:59Z");
  const validDeliveryDate = new Date("2027-01-15T23:59:59Z");

  // Fixture RFQ-0007 demo data (Spec 7.3.5)
  const validRfq0007Input: RfqValidationInput = {
    title: "Seragam Karyawan Kantor 2027",
    categoryType: "SERAGAM",
    visibility: "TERBUKA",
    quotationDeadline: validQuotationDeadline,
    qaDeadline: validQaDeadline,
    targetDeliveryDate: validDeliveryDate,
    items: [
      {
        name: "Kemeja kerja lengan panjang pria",
        fabricType: "Katun TC",
        gsmMin: 135,
        gsmMax: 145,
        color: "Biru Navy",
        materialProvidedByBuyer: false,
        referencePhotoUrl: "https://example.com/kemeja.jpg",
        decorationType: "BORDIR",
        decorationPlacement: "Dada Kiri",
        totalQuantity: 200,
        sizes: [
          { size: "S", quantity: 20 },
          { size: "M", quantity: 70 },
          { size: "L", quantity: 70 },
          { size: "XL", quantity: 30 },
          { size: "XXL", quantity: 10 },
        ],
      },
      {
        name: "Rompi operasional",
        fabricType: "Drill",
        gsmMin: 230,
        gsmMax: 250,
        color: "Abu-abu",
        materialProvidedByBuyer: false,
        referencePhotoUrl: "https://example.com/rompi.jpg",
        decorationType: "SABLON",
        decorationPlacement: "Punggung",
        totalQuantity: 100,
        sizes: [
          { size: "M", quantity: 40 },
          { size: "L", quantity: 40 },
          { size: "XL", quantity: 20 },
        ],
      },
    ],
  };

  it("1. RFQ-0007 valid lolos semua aturan bisnis R-01 sampai R-03", () => {
    const result = validateRfq(validRfq0007Input, now);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  describe("R-01: Validasi minimal satu item, bahan, kuantitas, dan lampiran/tech pack", () => {
    it("Menolak RFQ tanpa item sama sekali", () => {
      const invalid = { ...validRfq0007Input, items: [] };
      const res = validateRfq(invalid, now);
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain(
        "Minimal harus ada satu item dalam RFQ (R-01)"
      );
    });

    it("Menolak item tanpa nama bahan atau kuantitas 0", () => {
      const invalid = {
        ...validRfq0007Input,
        items: [
          {
            ...validRfq0007Input.items[0],
            fabricType: "   ",
            totalQuantity: 0,
            sizes: [],
          },
        ],
      };
      const res = validateRfq(invalid, now);
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes("Bahan wajib diisi"))).toBe(
        true
      );
      expect(
        res.errors.some((e) =>
          e.includes("Jumlah kuantitas item harus lebih besar dari 0")
        )
      ).toBe(true);
    });

    it("Menolak item tanpa lampiran referensi sama sekali", () => {
      const invalid = {
        ...validRfq0007Input,
        items: [
          {
            ...validRfq0007Input.items[0],
            referencePhotoUrl: undefined,
            techPackUrl: undefined,
          },
        ],
      };
      const res = validateRfq(invalid, now);
      expect(res.isValid).toBe(false);
      expect(
        res.errors.some((e) =>
          e.includes("Minimal satu lampiran referensi atau tech pack")
        )
      ).toBe(true);
    });

    it("Wajib melampirkan tech pack jika jenis kebutuhan adalah MAKLON", () => {
      const maklonNoTechPack = {
        ...validRfq0007Input,
        categoryType: "MAKLON" as const,
        items: [
          {
            ...validRfq0007Input.items[0],
            referencePhotoUrl: "https://example.com/foto.jpg",
            techPackUrl: undefined,
          },
        ],
      };
      const res = validateRfq(maklonNoTechPack, now);
      expect(res.isValid).toBe(false);
      expect(
        res.errors.some((e) =>
          e.includes("Tech pack wajib dilampirkan untuk jenis kebutuhan Maklon")
        )
      ).toBe(true);
    });
  });

  describe("R-02: Total qty item wajib sama dengan jumlah rincian ukuran", () => {
    it("Menolak jika jumlah seluruh rincian ukuran tidak cocok dengan totalQuantity", () => {
      const invalidSizes = {
        ...validRfq0007Input,
        items: [
          {
            ...validRfq0007Input.items[0],
            totalQuantity: 200,
            sizes: [
              { size: "S", quantity: 20 },
              { size: "M", quantity: 70 },
              { size: "L", quantity: 70 },
              // Total hanya 160, kurang 40 pcs
            ],
          },
        ],
      };
      const res = validateRfq(invalidSizes, now);
      expect(res.isValid).toBe(false);
      expect(
        res.errors.some((e) =>
          e.includes(
            "Total kuantitas (200) tidak sesuai dengan jumlah rincian ukuran (160)"
          )
        )
      ).toBe(true);
    });

    it("Menolak jika ada ukuran dengan kuantitas negatif", () => {
      const negativeSize = {
        ...validRfq0007Input,
        items: [
          {
            ...validRfq0007Input.items[0],
            totalQuantity: 200,
            sizes: [
              { size: "S", quantity: 210 },
              { size: "M", quantity: -10 },
            ],
          },
        ],
      };
      const res = validateRfq(negativeSize, now);
      expect(res.isValid).toBe(false);
      expect(
        res.errors.some((e) =>
          e.includes("Kuantitas ukuran tidak boleh negatif")
        )
      ).toBe(true);
    });
  });

  describe("R-03: Validasi jadwal (tenggat penawaran min N hari, QA sebelum penawaran, target kirim setelah penawaran)", () => {
    it("Menolak tenggat penawaran kurang dari 3 hari dari sekarang", () => {
      const tooShort = {
        ...validRfq0007Input,
        quotationDeadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 hari
      };
      const res = validateRfq(tooShort, now);
      expect(res.isValid).toBe(false);
      expect(
        res.errors.some((e) => e.includes("Tenggat penawaran minimal 3 hari"))
      ).toBe(true);
    });

    it("Menolak jika tenggat tanya jawab setelah tenggat penawaran", () => {
      const invalidQa = {
        ...validRfq0007Input,
        qaDeadline: new Date("2026-11-26T10:00:00Z"), // setelah 25 Nov
      };
      const res = validateRfq(invalidQa, now);
      expect(res.isValid).toBe(false);
      expect(
        res.errors.some((e) =>
          e.includes("Tenggat tanya jawab harus sebelum tenggat penawaran")
        )
      ).toBe(true);
    });

    it("Menolak jika target pengiriman sebelum atau sama dengan tenggat penawaran", () => {
      const invalidDelivery = {
        ...validRfq0007Input,
        targetDeliveryDate: new Date("2026-11-20T10:00:00Z"),
      };
      const res = validateRfq(invalidDelivery, now);
      expect(res.isValid).toBe(false);
      expect(
        res.errors.some((e) =>
          e.includes("Target tanggal kirim harus setelah tenggat penawaran")
        )
      ).toBe(true);
    });
  });

  describe("R-04: Aturan editing langsung vs Addendum", () => {
    it("Hanya RFQ berstatus DRAFT yang boleh diubah langsung tanpa addendum", () => {
      expect(canEditRfqDirectly("DRAFT")).toBe(true);
      expect(canEditRfqDirectly("OPEN")).toBe(false);
      expect(canEditRfqDirectly("CLOSED")).toBe(false);
      expect(canEditRfqDirectly("EVALUATING")).toBe(false);
    });
  });

  describe("R-05: Pembatalan RFQ wajib menyertakan alasan", () => {
    it("Menolak pembatalan tanpa alasan atau alasan terlalu pendek", () => {
      const res = transitionRfqStatus("OPEN", "CANCELLED", {
        cancelReason: " ",
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain("Alasan pembatalan wajib disertakan");
    });

    it("Menerima pembatalan dengan alasan valid saat status belum AWARDED", () => {
      const res = transitionRfqStatus("OPEN", "CANCELLED", {
        cancelReason: "Anggaran proyek dibatalkan oleh manajemen",
      });
      expect(res.success).toBe(true);
    });
  });

  describe("R-06: Visibilitas RFQ TERBUKA vs UNDANGAN", () => {
    it("RFQ TERBUKA dapat diakses oleh semua UMKM", () => {
      expect(canAccessRfq("TERBUKA", "org-umkm-1", [])).toBe(true);
      expect(canAccessRfq("TERBUKA", "org-umkm-2", [])).toBe(true);
    });

    it("RFQ UNDANGAN hanya dapat diakses oleh UMKM yang terdaftar di undangan", () => {
      const invitedOrgs = ["org-umkm-invited", "org-umkm-vip"];
      expect(canAccessRfq("UNDANGAN", "org-umkm-invited", invitedOrgs)).toBe(
        true
      );
      expect(canAccessRfq("UNDANGAN", "org-umkm-stranger", invitedOrgs)).toBe(
        false
      );
    });
  });

  describe("State Machine Status RFQ (Spec 7.3.7)", () => {
    it("Memvalidasi transisi yang sah dalam siklus normal", () => {
      expect(transitionRfqStatus("DRAFT", "OPEN").success).toBe(true);
      expect(transitionRfqStatus("OPEN", "CLOSED").success).toBe(true);
      expect(transitionRfqStatus("CLOSED", "EVALUATING").success).toBe(true);
      expect(transitionRfqStatus("EVALUATING", "SAMPLING").success).toBe(true);
      expect(transitionRfqStatus("SAMPLING", "AWARDED").success).toBe(true);
      expect(transitionRfqStatus("EVALUATING", "AWARDED").success).toBe(true);
    });

    it("Menangani transisi EXPIRED ketika tidak ada penawaran sampai tenggat", () => {
      expect(
        transitionRfqStatus("OPEN", "EXPIRED", { hasBids: false }).success
      ).toBe(true);
      // Gagal jika sudah ada penawaran masuk
      expect(
        transitionRfqStatus("OPEN", "EXPIRED", { hasBids: true }).success
      ).toBe(false);
    });

    it("Menolak lompatan status ilegal", () => {
      expect(transitionRfqStatus("DRAFT", "AWARDED").success).toBe(false);
      expect(transitionRfqStatus("DRAFT", "EVALUATING").success).toBe(false);
      expect(transitionRfqStatus("CLOSED", "SAMPLING").success).toBe(false);
    });

    it("Menolak transisi dari terminal state (AWARDED, EXPIRED, CANCELLED)", () => {
      expect(transitionRfqStatus("AWARDED", "OPEN").success).toBe(false);
      expect(transitionRfqStatus("EXPIRED", "OPEN").success).toBe(false);
      expect(transitionRfqStatus("CANCELLED", "DRAFT").success).toBe(false);
      expect(
        transitionRfqStatus("AWARDED", "CANCELLED", { cancelReason: "batal" })
          .success
      ).toBe(false);
    });
  });
});
