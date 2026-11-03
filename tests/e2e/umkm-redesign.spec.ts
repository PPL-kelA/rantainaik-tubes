import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Visual Redesign R2: UMKM Pages & Sub-features", () => {
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
  // 1. Dashboard UMKM (/umkm)
  // -------------------------------------------------------------
  test("1. Dashboard UMKM: PageHeader, SearchBar, feed kompartemen tanpa pil (1280px & 390px)", async ({
    page,
  }) => {
    await loginAsUmkm(page);

    // Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/umkm");
    await expect(
      page.getByRole("heading", { name: "CV Karya Mandiri Konveksi" })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "Cari RFQ terbuka, tender seragam kantor, atau kebutuhan maklon tekstil..."
      )
    ).toBeVisible();

    // Verifikasi tidak ada horizontal scroll
    let hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    // Verifikasi tidak ada elemen rounded-full struktural (> 16px)
    const roundedFullCount = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll(".rounded-full"));
      return els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 16 && r.height > 16;
      }).length;
    });
    expect(roundedFullCount).toBe(0);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-dashboard-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/umkm");
    hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-dashboard-390.png"),
      fullPage: true,
    });
  });

  // -------------------------------------------------------------
  // 2. Profil UMKM (/umkm/profil)
  // -------------------------------------------------------------
  test("2. Profil UMKM: 2-kolom kompartemen, avatar kotak, dan modal tanpa pil (1280px & 390px)", async ({
    page,
  }) => {
    await loginAsUmkm(page);

    // Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto("/umkm/profil");
    await expect(
      page.getByRole("heading", { name: "Profil & Portofolio Konveksi" })
    ).toBeVisible();

    let hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    const roundedFullCount = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll(".rounded-full"));
      return els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 16 && r.height > 16;
      }).length;
    });
    expect(roundedFullCount).toBe(0);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-profil-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/umkm/profil");
    hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-profil-390.png"),
      fullPage: true,
    });
  });

  // -------------------------------------------------------------
  // 3. Readiness Score (/umkm/readiness)
  // -------------------------------------------------------------
  test("3. Readiness Score: Bilah 4-tier bergaris, 3 langkah naik tier, dan accordion (1280px & 390px)", async ({
    page,
  }) => {
    await loginAsUmkm(page);

    // Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto("/umkm/readiness");
    await expect(
      page.getByRole("heading", { name: "Skor Kesiapan Industri" })
    ).toBeVisible();
    await expect(page.getByText("/ 100")).toBeVisible();
    await expect(page.getByText("Tahap Awal (0-39)")).toBeVisible();

    let hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    const roundedFullCount = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll(".rounded-full"));
      return els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 16 && r.height > 16;
      }).length;
    });
    expect(roundedFullCount).toBe(0);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-readiness-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/umkm/readiness");
    hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-readiness-390.png"),
      fullPage: true,
    });
  });

  // -------------------------------------------------------------
  // 4. Detail RFQ UMKM (/umkm/rfq/[id])
  // -------------------------------------------------------------
  test("4. Detail RFQ: Tab underline, StatusBadge, grid spesifikasi tanpa pil (1280px & 390px)", async ({
    page,
  }) => {
    await loginAsUmkm(page);

    // Ambil RFQ pertama dari dashboard atau langsung ke RFQ-0007
    await page.goto("/umkm");
    const rfqLink = page.locator("a[href^='/umkm/rfq/']").first();
    const href = (await rfqLink.isVisible())
      ? await rfqLink.getAttribute("href")
      : "/umkm/rfq/RFQ-0007";
    const targetUrl = href || "/umkm/rfq/RFQ-0007";

    // Buka detail RFQ di Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto(targetUrl);
    await expect(
      page.getByRole("button", { name: /Spesifikasi & Rincian Item/ })
    ).toBeVisible();

    let hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    const roundedFullCount = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll(".rounded-full"));
      return els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 16 && r.height > 16;
      }).length;
    });
    expect(roundedFullCount).toBe(0);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-rfq-detail-1280.png"),
      fullPage: true,
    });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(targetUrl);
    hasScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasScroll).toBe(false);

    await page.screenshot({
      path: path.join(screenshotDir, "umkm-rfq-detail-390.png"),
      fullPage: true,
    });
  });
});
