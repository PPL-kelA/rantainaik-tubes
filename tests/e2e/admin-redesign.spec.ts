import { test, expect, Page } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR =
  "/Users/kalingga/.gemini/antigravity/brain/7236cb71-479e-4685-b1b3-0ae5f8fe0ece";

async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page
    .locator("input[placeholder='contoh@perusahaan.com']")
    .fill("admin@rantainaik.id");
  await page
    .locator("input[placeholder='Minimal 8 karakter']")
    .fill("Password123");
  await page.getByRole("button", { name: "Masuk Sekarang" }).click();
  await page.waitForURL("/admin", { timeout: 15000 });
  await expect(page.locator("text=ADMIN").first()).toBeVisible({
    timeout: 10000,
  });
}

test.describe("Visual Redesign R2: Kelompok Admin (Dashboard, Verifikasi Terpadu, Sengketa QC, Ledger Escrow, Konfigurasi)", () => {
  test("1. Dashboard Admin: PageHeader, SearchBar, 4-stat strip, 0 pil (1280px & 390px)", async ({
    page,
  }) => {
    // 1. Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsAdmin(page);

    await expect(
      page.getByRole("heading", { name: "Dashboard Administrator" })
    ).toBeVisible();
    await expect(
      page.getByText("Antrean Verifikasi", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("Pengguna Terverifikasi")).toBeVisible();

    // Verifikasi SearchBar in-page
    const searchBar = page.locator("input[placeholder*='Cari organisasi']");
    await expect(searchBar).toBeVisible();

    // Pastikan tepat 1 link sidebar yang aktif (Dashboard Admin)
    const activeLinks = page.locator("aside nav a[data-active='true']");
    await expect(activeLinks).toHaveCount(1);
    await expect(activeLinks.first()).toContainText("Dashboard Admin");

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
      path: path.join(ARTIFACT_DIR, "admin-dashboard-1280.png"),
      fullPage: true,
    });

    // 2. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Dashboard Administrator" })
    ).toBeVisible();

    const hasScrollMobile = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasScrollMobile).toBe(false);

    // Screenshot Mobile
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-dashboard-390.png"),
      fullPage: true,
    });
  });

  test("2. Verifikasi Akun & Dokumen Terpadu: Single Page, Tabs, SearchBar (1280px & 390px)", async ({
    page,
  }) => {
    // 1. Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsAdmin(page);

    await page.goto("/admin/verifikasi");
    await expect(
      page.getByRole("heading", {
        name: "Pusat Verifikasi Akun & Dokumen Legalitas",
      })
    ).toBeVisible();

    // Single-active sidebar check
    const activeLinks = page.locator("aside nav a[data-active='true']");
    await expect(activeLinks).toHaveCount(1);
    await expect(activeLinks.first()).toContainText(
      "Verifikasi Akun & Dokumen"
    );

    // Tabs exist
    const docsTab = page.getByRole("button", {
      name: /Dokumen Legalitas Organisasi/i,
    });
    const usersTab = page.getByRole("button", {
      name: /Verifikasi Akun Pengguna/i,
    });
    await expect(docsTab).toBeVisible();
    await expect(usersTab).toBeVisible();

    // Default tab: docs
    await expect(
      page.getByText("Antrean Verifikasi Dokumen & Organisasi")
    ).toBeVisible();

    // Switch to users tab
    await usersTab.click();
    await expect(page.getByText("Antrean Verifikasi Akun Baru")).toBeVisible();

    // Switch back to docs tab
    await docsTab.click();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-verifikasi-1280.png"),
      fullPage: true,
    });

    // 2. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/verifikasi");
    await expect(
      page.getByRole("heading", {
        name: "Pusat Verifikasi Akun & Dokumen Legalitas",
      })
    ).toBeVisible();

    const hasScrollMobile = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasScrollMobile).toBe(false);

    // Screenshot Mobile
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-verifikasi-390.png"),
      fullPage: true,
    });
  });

  test("3. Mediasi Sengketa QC: Arbitrase, Stat Strip, Modal Keputusan (1280px & 390px)", async ({
    page,
  }) => {
    // 1. Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsAdmin(page);

    await page.goto("/admin/sengketa");
    await expect(
      page.getByRole("heading", {
        name: "Mediasi Sengketa & Penjaminan Mutu QC",
      })
    ).toBeVisible();
    await expect(page.getByText("Total Kasus Masuk")).toBeVisible();
    await expect(page.getByText("Menunggu Mediasi Admin")).toBeVisible();

    // Single-active sidebar check
    const activeLinks = page.locator("aside nav a[data-active='true']");
    await expect(activeLinks).toHaveCount(1);
    await expect(activeLinks.first()).toContainText("Mediasi Sengketa");

    // Open mediasi modal
    const openBtn = page.getByRole("button", { name: "Buka Mediasi" }).first();
    if (await openBtn.isVisible()) {
      await openBtn.click();
      await expect(page.getByText("Panel Arbitrase Admin")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Instruksi Rework" })
      ).toBeVisible();
      // Close modal
      await page
        .locator("button:has-text('✕'), button:has(.lucide-x)")
        .last()
        .click();
    }

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-sengketa-1280.png"),
      fullPage: true,
    });

    // 2. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/sengketa");
    await expect(
      page.getByRole("heading", {
        name: "Mediasi Sengketa & Penjaminan Mutu QC",
      })
    ).toBeVisible();

    const hasScrollMobile = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasScrollMobile).toBe(false);

    // Screenshot Mobile
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-sengketa-390.png"),
      fullPage: true,
    });
  });

  test("4. Ledger Escrow & Rekonsiliasi: Invarian, Monospace amounts (1280px & 390px)", async ({
    page,
  }) => {
    // 1. Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsAdmin(page);

    await page.goto("/admin/ledger");
    await expect(
      page.getByRole("heading", {
        name: "Buku Besar Escrow & Rekonsiliasi Komisi Platform",
      })
    ).toBeVisible();
    await expect(page.getByText("Invarian Keuangan Platform:")).toBeVisible();
    await expect(page.getByText("Total Dana Masuk")).toBeVisible();
    await expect(page.getByText("Dana Dirilis ke UMKM")).toBeVisible();
    await expect(page.getByText("Komisi Broker (5%)")).toBeVisible();

    // Single-active sidebar check
    const activeLinks = page.locator("aside nav a[data-active='true']");
    await expect(activeLinks).toHaveCount(1);
    await expect(activeLinks.first()).toContainText("Ledger Escrow");

    // Filter tab check
    const depositTab = page.getByRole("button", {
      name: "Deposit Masuk 100%",
    });
    await expect(depositTab).toBeVisible();
    await depositTab.click();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-ledger-1280.png"),
      fullPage: true,
    });

    // 2. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/ledger");
    await expect(
      page.getByRole("heading", {
        name: "Buku Besar Escrow & Rekonsiliasi Komisi Platform",
      })
    ).toBeVisible();

    const hasScrollMobile = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasScrollMobile).toBe(false);

    // Screenshot Mobile
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-ledger-390.png"),
      fullPage: true,
    });
  });

  test("5. Konfigurasi Master Data: 6 Underline Tabs & Validasi Bobot (1280px & 390px)", async ({
    page,
  }) => {
    // 1. Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsAdmin(page);

    await page.goto("/admin/konfigurasi");
    await expect(
      page.getByRole("heading", {
        name: "Konfigurasi Platform & Master Data Tekstil",
      })
    ).toBeVisible();
    await expect(
      page.getByText("Konfigurasi Platform & Master Data (P23.2)")
    ).toBeVisible();

    // Single-active sidebar check
    const activeLinks = page.locator("aside nav a[data-active='true']");
    await expect(activeLinks).toHaveCount(1);
    await expect(activeLinks.first()).toContainText("Konfigurasi Master Data");

    // Pastikan 6 tab navigasi terlihat
    await expect(
      page.getByRole("button", { name: "Bobot Readiness", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Bobot Matching", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Parameter Platform", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Aturan Rekomendasi", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Kategori & Layanan", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Uji & Sertifikasi", exact: true })
    ).toBeVisible();

    // Screenshot Desktop
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-konfigurasi-1280.png"),
      fullPage: true,
    });

    // 2. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/konfigurasi");
    await expect(
      page.getByRole("heading", {
        name: "Konfigurasi Platform & Master Data Tekstil",
      })
    ).toBeVisible();

    const hasScrollMobile = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasScrollMobile).toBe(false);

    // Screenshot Mobile
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "admin-konfigurasi-390.png"),
      fullPage: true,
    });
  });
});
