import { test, expect, Page } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR =
  "/Users/kalingga/.gemini/antigravity/brain/7236cb71-479e-4685-b1b3-0ae5f8fe0ece";

async function loginAsIndustri(page: Page) {
  await page.goto("/login");
  await page
    .locator("input[placeholder='contoh@perusahaan.com']")
    .fill("industri@nusantara.id");
  await page
    .locator("input[placeholder='Minimal 8 karakter']")
    .fill("Password123");
  await page.getByRole("button", { name: "Masuk Sekarang" }).click();
  await page.waitForURL("/industri", { timeout: 15000 });
  await expect(page.locator("text=PT Nusantara Logistik").first()).toBeVisible({
    timeout: 10000,
  });
}

test.describe("Visual Redesign R2: Kelompok Industri (Dashboard, RFQ Katalog, Detail Edit, Penawaran, Scouting, Order Escrow, Profil)", () => {
  test("1. Dashboard Pengadaan: PageHeader, SearchBar, feed kompartemen tanpa pil (1280px & 390px)", async ({
    page,
  }) => {
    // 1. Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsIndustri(page);

    await expect(
      page.getByText("Portal Pengadaan Industri & Korporasi")
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Buat RFQ Baru/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Daftar RFQ Saya (P12)" })
    ).toBeVisible();

    // Verifikasi SearchBar in-page
    const searchBar = page.locator("input[placeholder*='Cari RFQ saya']");
    await expect(searchBar).toBeVisible();

    // Bebas bentuk pil struktural
    const pills = await page.evaluate(() => {
      const all = document.querySelectorAll(
        "main *:not(svg):not(path):not(img)"
      );
      return Array.from(all).filter((el) => {
        const style = window.getComputedStyle(el);
        const r = parseFloat(style.borderRadius || "0");
        const w = el.clientWidth;
        const h = el.clientHeight;
        return (
          r > 16 &&
          (w > 32 || h > 32) &&
          (style.backgroundColor !== "rgba(0, 0, 0, 0)" ||
            style.borderWidth !== "0px")
        );
      }).length;
    });
    expect(pills).toBe(0);

    // Bebas horizontal scroll
    const hasScroll = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasScroll).toBe(false);

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-dashboard-1280.png"),
      fullPage: true,
    });

    // 2. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/industri");
    await page.waitForLoadState("networkidle");

    const hasScrollMobile = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasScrollMobile).toBe(false);

    // Screenshot Mobile
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-dashboard-390.png"),
      fullPage: true,
    });
  });

  test("2. Katalog RFQ Saya: Grouping status, SearchBar, dan feed baris px-6 py-5 (1280px & 390px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsIndustri(page);

    await page.goto("/industri/rfq");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Katalog RFQ Saya" })
    ).toBeVisible();
    await expect(page.getByText("Aktif / Buka Tender")).toBeVisible();
    await expect(page.getByText("Semua RFQ")).toBeVisible();

    // Verifikasi SearchBar filter
    const searchBar = page.locator("input[placeholder*='Cari nomor RFQ']");
    await expect(searchBar).toBeVisible();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-rfq-katalog-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/industri/rfq");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-rfq-katalog-390.png"),
      fullPage: true,
    });
  });

  test("3. Detail RFQ Industri: Banner pratinjau UMKM, kontrol edit addendum, dan tab komparasi (1280px & 390px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsIndustri(page);

    // Buka detail RFQ-0007
    await page.goto("/industri/rfq/RFQ-0007");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Mode Pratinjau Pengadaan")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Terbitkan Addendum/i })
    ).toBeVisible();
    await expect(page.getByText("Spesifikasi Teknis")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Penawaran Masuk/i })
    ).toBeVisible();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-rfq-detail-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/industri/rfq/RFQ-0007");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-rfq-detail-390.png"),
      fullPage: true,
    });
  });

  test("4. Evaluasi Penawaran Masuk: Metrik komparasi, status tabs, dan negosiasi BR-03 (1280px & 390px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsIndustri(page);

    await page.goto("/industri/penawaran");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: /Evaluasi Penawaran Masuk/i })
    ).toBeVisible();
    await expect(page.getByText("Total Penawaran Masuk")).toBeVisible();
    await expect(page.getByText("CV Karya Mandiri Konveksi")).toBeVisible();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-penawaran-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/industri/penawaran");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-penawaran-390.png"),
      fullPage: true,
    });
  });

  test("5. Cari UMKM (Scouting Direktori): Kompartemen search & filter menyatu (1280px & 390px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsIndustri(page);

    await page.goto("/industri/mitra");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: /Cari Mitra UMKM Konveksi/i })
    ).toBeVisible();
    await expect(page.getByText("Kategori Spesialisasi")).toBeVisible();
    await expect(page.getByText("Readiness Score Tier")).toBeVisible();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-mitra-scouting-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/industri/mitra");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-mitra-scouting-390.png"),
      fullPage: true,
    });
  });

  test("6. Order & Escrow: Pelacakan milestone 2-tahap dan pendanaan 100% (1280px & 390px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsIndustri(page);

    await page.goto("/industri/order");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: /Manajemen Order & Rekening Escrow/i })
    ).toBeVisible();
    await expect(page.getByText("Total Escrow Diamankan")).toBeVisible();
    await expect(page.getByText("PO-2026-0001")).toBeVisible();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-order-escrow-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/industri/order");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-order-escrow-390.png"),
      fullPage: true,
    });
  });

  test("7. Profil & Legalitas: Kompartemen 1px 2-kolom menyatu (1280px & 390px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsIndustri(page);

    await page.goto("/industri/profil");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText("Identitas Korporasi & Kepatuhan Legalitas")
    ).toBeVisible();
    await expect(page.getByText("PIC Pengadaan & Otorisasi")).toBeVisible();
    await expect(
      page.getByText("Gudang Penerimaan Barang Tekstil")
    ).toBeVisible();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-profil-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/industri/profil");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "industri-profil-390.png"),
      fullPage: true,
    });
  });

  test("8. Sidebar Navigation Industri: Tepat hanya 1 item yang ter-highlight per halaman", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsIndustri(page);

    const routes = [
      "/industri",
      "/industri/rfq",
      "/industri/penawaran",
      "/industri/mitra",
      "/industri/order",
      "/industri/profil",
    ];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const activeCount = await page.evaluate(() => {
        const sidebar = document.querySelector("aside");
        if (!sidebar) return 0;
        const activeLinks = sidebar.querySelectorAll("a[data-active='true']");
        return activeLinks.length;
      });

      expect(
        activeCount,
        `Di rute ${route}, harus tepat hanya 1 item menu sidebar yang aktif, tapi ditemukan ${activeCount}`
      ).toBe(1);
    }
  });
});
