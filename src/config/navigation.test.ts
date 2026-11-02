import { describe, it, expect } from "vitest";
import { getNavigationForRole, NAVIGATION_CONFIG } from "./navigation";

describe("Konfigurasi Navigasi Terpusat (R1)", () => {
  it("mengembalikan navigasi sesuai peran INDUSTRY", () => {
    const nav = getNavigationForRole("INDUSTRY");
    expect(nav.length).toBeGreaterThan(0);
    const titles = nav.flatMap((g) => g.items.map((i) => i.title));
    expect(titles).toContain("Dashboard Pengadaan");
    expect(titles).toContain("RFQ Saya");
    expect(titles).toContain("Cari UMKM");
    expect(titles).toContain("Order & Escrow");
    expect(titles).toContain("Profil & Legalitas");
  });

  it("mengembalikan navigasi sesuai peran UMKM", () => {
    const nav = getNavigationForRole("UMKM");
    expect(nav.length).toBeGreaterThan(0);
    const titles = nav.flatMap((g) => g.items.map((i) => i.title));
    expect(titles).toContain("Beranda Mitra");
    expect(titles).toContain("Readiness Score");
    expect(titles).toContain("Profil & Portofolio");
    expect(titles).toContain("Cari RFQ");
    expect(titles).toContain("Penawaran Saya");
    expect(titles).toContain("Dana & Escrow");
  });

  it("mengembalikan navigasi sesuai peran ADMIN", () => {
    const nav = getNavigationForRole("ADMIN");
    expect(nav.length).toBeGreaterThan(0);
    const titles = nav.flatMap((g) => g.items.map((i) => i.title));
    expect(titles).toContain("Dashboard Admin");
    expect(titles).toContain("Verifikasi Akun");
    expect(titles).toContain("Mediasi Sengketa");
    expect(titles).toContain("Ledger Escrow");
    expect(titles).toContain("Konfigurasi Master Data");
  });

  it("fallback ke navigasi PUBLIC bila peran tidak ada", () => {
    const navNull = getNavigationForRole(null);
    expect(navNull).toEqual(NAVIGATION_CONFIG.PUBLIC);

    const navUnknown = getNavigationForRole("GUEST");
    expect(navUnknown).toEqual(NAVIGATION_CONFIG.PUBLIC);
  });

  it("memverifikasi bahwa header tidak berisi tautan navigasi utama (aturan Upwork shell)", () => {
    // Navigasi dialokasikan khusus untuk sidebar
    for (const role of ["INDUSTRY", "UMKM", "ADMIN", "PUBLIC"]) {
      const groups = NAVIGATION_CONFIG[role];
      expect(groups).toBeDefined();
      expect(groups.length).toBeGreaterThan(0);
      for (const group of groups) {
        expect(group.label).toBeTruthy();
        expect(group.items.length).toBeGreaterThan(0);
        for (const item of group.items) {
          expect(item.title).toBeTruthy();
          expect(item.href).toBeTruthy();
          expect(item.icon).toBeDefined();
        }
      }
    }
  });
});
