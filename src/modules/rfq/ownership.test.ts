import { describe, it, expect } from "vitest";
import { canViewIndustryRfq } from "./ownership";

describe("F2: canViewIndustryRfq — ownership halaman detail RFQ industri", () => {
  it("mengizinkan pemilik RFQ", () => {
    expect(canViewIndustryRfq("org-a", "org-a")).toBe(true);
  });

  it("mengizinkan ADMIN melihat RFQ apa pun", () => {
    expect(canViewIndustryRfq("org-b", "org-a", "ADMIN")).toBe(true);
  });

  it("menolak industry org lain", () => {
    expect(canViewIndustryRfq("org-b", "org-a")).toBe(false);
  });

  it("menolak ketika org pemanggil kosong (tanpa organisasi)", () => {
    expect(canViewIndustryRfq("org-a", "")).toBe(false);
  });
});
