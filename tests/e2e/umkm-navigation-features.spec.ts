import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("UMKM Navigation & New Pages: Pencarian RFQ, Penawaran Saya, & Single Active Sidebar", () => {
  const screenshotDir = path.resolve(
    "/Users/kalingga/.gemini/antigravity/brain/7236cb71-479e-4685-b1b3-0ae5f8fe0ece"
  );

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  async function loginAsUmkm(page: Page) {
    await page.goto("/login");
    await page.getByRole("button", { name: "UMKM (Verified)" }).click();
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/umkm", { timeout: 15000 });
  }

  // -------------------------------------------------------------
  // 1. Verifikasi Single Active Sidebar Item (Tepat 1 Item Aktif)
  // -------------------------------------------------------------
  test("1. Sidebar Navigation: Tepat hanya 1 item yang ter-highlight per halaman", async ({
    page,
  }) => {
    await loginAsUmkm(page);
    await page.setViewportSize({ width: 1280, height: 900 });

    const routesToCheck = [
      { url: "/umkm", expectedTitle: "Beranda Mitra" },
      { url: "/umkm/rfq", expectedTitle: "Cari RFQ" },
      { url: "/umkm/penawaran", expectedTitle: "Penawaran Saya" },
      { url: "/umkm/readiness", expectedTitle: "Readiness Score" },
      { url: "/umkm/profil", expectedTitle: "Profil & Portofolio" },
    ];

    for (const route of routesToCheck) {
      await page.goto(route.url);

      // Tunggu hingga navigasi UMKM termuat setelah session hydration
      await expect(
        page
          .locator("nav[aria-label='Navigasi Utama']")
          .getByText("Beranda Mitra")
      ).toBeVisible();

      // Hitung jumlah item navigasi yang memiliki data-active="true"
      const activeItems = page.locator(
        "nav[aria-label='Navigasi Utama'] a[data-active='true']"
      );
      const count = await activeItems.count();

      // Pastikan TEPAT HANYA 1 item yang aktif
      expect(
        count,
        `Jumlah item aktif di rute ${route.url} harus tepat 1`
      ).toBe(1);

      // Pastikan item yang aktif adalah rute yang sesuai
      const activeText = await activeItems.first().innerText();
      expect(activeText).toContain(route.expectedTitle);
    }
  });

  // -------------------------------------------------------------
  // 2. Halaman Pencarian RFQ (/umkm/rfq)
  // -------------------------------------------------------------
  test("2. Halaman Pencarian RFQ: In-page search bar, filter panel, dan screenshot (1280px & 390px)", async ({
    page,
  }) => {
    await loginAsUmkm(page);

    // Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 950 });
    await page.goto("/umkm/rfq");

    await expect(
      page.getByRole("heading", { name: "Pencarian Tender RFQ Tekstil" })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "Cari RFQ terbuka, jenis bahan (katun, TC), nomor tender (RFQ-0007), atau nama industri..."
      )
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Filter Pencarian" })
    ).toBeVisible();

    // Verifikasi tidak ada horizontal scroll
    let hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    // Verifikasi 0 elemen rounded-full struktural (> 16px)
    const roundedFullCount = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll(".rounded-full"));
      return els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 16 && r.height > 16;
      }).length;
    });
    expect(roundedFullCount).toBe(0);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-rfq-search-1280.png"),
      fullPage: true,
    });

    // Coba interaksi search bar
    await page
      .getByPlaceholder(
        "Cari RFQ terbuka, jenis bahan (katun, TC), nomor tender (RFQ-0007), atau nama industri..."
      )
      .fill("Seragam");
    await expect(
      page.getByRole("heading", { name: /Seragam/i }).first()
    ).toBeVisible();

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/umkm/rfq");
    hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-rfq-search-390.png"),
      fullPage: true,
    });
  });

  // -------------------------------------------------------------
  // 3. Halaman Penawaran Saya (/umkm/penawaran)
  // -------------------------------------------------------------
  test("3. Halaman Penawaran Saya: Metrik 4-kolom, tab status, list penawaran, dan screenshot (1280px & 390px)", async ({
    page,
  }) => {
    await loginAsUmkm(page);

    // Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 950 });
    await page.goto("/umkm/penawaran");

    await expect(
      page.getByRole("heading", { name: "Penawaran Saya" })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "Cari berdasarkan nomor penawaran (Q-xxxx), nomor RFQ (RFQ-0007), atau mitra industri..."
      )
    ).toBeVisible();

    // Verifikasi metrik instrumen
    await expect(page.getByText("Total Penawaran")).toBeVisible();
    await expect(page.getByText("Sedang Evaluasi")).toBeVisible();
    await expect(page.getByText("Butuh Revisi").first()).toBeVisible();
    await expect(page.getByText("Menang / Diterima")).toBeVisible();

    // Verifikasi tidak ada horizontal scroll
    let hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    // Verifikasi 0 elemen rounded-full struktural (> 16px)
    const roundedFullCount = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll(".rounded-full"));
      return els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 16 && r.height > 16;
      }).length;
    });
    expect(roundedFullCount).toBe(0);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-penawaran-1280.png"),
      fullPage: true,
    });

    // Coba interaksi tab filter "Butuh Revisi"
    await page.getByRole("button", { name: /Butuh Revisi/ }).click();
    await expect(
      page.getByText("Catatan Klarifikasi dari Pembeli")
    ).toBeVisible();

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/umkm/penawaran");
    hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-penawaran-390.png"),
      fullPage: true,
    });
  });
});
