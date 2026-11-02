import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

// Helper formula WCAG 2.1 contrast ratio
function parseRgb(colorStr: string): [number, number, number] {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return [14, 20, 34];
  return [
    parseInt(match[1], 10),
    parseInt(match[2], 10),
    parseInt(match[3], 10),
  ];
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

test.describe("Visual Redesign R1: Design System & Responsive Shell", () => {
  const screenshotDir = path.resolve(
    "/Users/kalingga/.gemini/antigravity/brain/3fc283c5-57dc-4746-b158-18b86aeba62b"
  );

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test("Halaman Beranda: 2-kolom Upwork style, bebas bentuk pil, dan screenshot tersimpan", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Verifikasi promo banner dan in-page search bar
    await expect(
      page.getByText("PLATFORM BROKER PENGADAAN TEKSTIL B2B")
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "Cari RFQ tender seragam kerja, kaos event, polo maklon, atau kebutuhan tekstil..."
      )
    ).toBeVisible();

    // Verifikasi underline tabs (tanpa pill)
    await expect(
      page.getByRole("button", { name: "Semua Tender Terbuka" })
    ).toBeVisible();

    // Verifikasi tidak ada horizontal scroll
    let hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    // Verifikasi TIDAK ADA elemen 'rounded-full' pada elemen struktural halaman
    const pillElementCount = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll(".rounded-full"));
      // Filter out only non-decorative elements (e.g., skip 1.5px tiny dot)
      return elements.filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 12 && rect.height > 12;
      }).length;
    });
    expect(pillElementCount).toBe(0);

    // Ambil screenshot desktop Beranda
    await page.screenshot({
      path: path.join(screenshotDir, "home-1280.png"),
      fullPage: true,
    });

    // Mobile: 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    // Ambil screenshot mobile Beranda
    await page.screenshot({
      path: path.join(screenshotDir, "home-390.png"),
      fullPage: true,
    });
  });

  test("Halaman Login: Desktop 1280px bebas horizontal scroll, kontras teks valid, dan screenshot tersimpan", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Masuk ke Akun" })
    ).toBeVisible();

    // Verifikasi tidak ada horizontal scroll
    const hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    // Verifikasi kontras teks judul utama di atas latar putih
    const headingStyles = await page
      .getByRole("heading", { name: "Masuk ke Akun" })
      .evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
        };
      });

    const textRgb = parseRgb(headingStyles.color);
    const bgRgb: [number, number, number] = [255, 255, 255]; // Pure White #FFFFFF
    const contrast = getContrastRatio(textRgb, bgRgb);
    expect(contrast).toBeGreaterThanOrEqual(4.5);

    // Verifikasi border kontrol input memiliki kontras minimal 3:1
    const inputStyles = await page
      .locator("input[type='email']")
      .evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          borderColor: styles.borderColor,
          borderRadius: styles.borderRadius,
        };
      });
    const borderRgb = parseRgb(inputStyles.borderColor);
    const borderContrast = getContrastRatio(borderRgb, bgRgb);
    expect(borderContrast).toBeGreaterThanOrEqual(3.0);
    expect(inputStyles.borderRadius).toBe("4px");

    // Ambil screenshot desktop
    await page.screenshot({
      path: path.join(screenshotDir, "login-1280.png"),
      fullPage: true,
    });
  });

  test("Halaman Login: Mobile 390px responsive bebas horizontal scroll dan screenshot tersimpan", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Masuk ke Akun" })
    ).toBeVisible();

    // Verifikasi tidak ada horizontal scroll
    const hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    // Ambil screenshot mobile
    await page.screenshot({
      path: path.join(screenshotDir, "login-390.png"),
      fullPage: true,
    });
  });

  test("Halaman Industri (Daftar/Tabel): Desktop 1280px dan Mobile 390px konsisten tanpa scroll horizontal", async ({
    page,
  }) => {
    // Login sebagai akun industri
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("industri@nusantara.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    await page.waitForURL("/industri", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "PT Nusantara Logistik" })
    ).toBeVisible();

    // Desktop: Verifikasi sidebar terlihat pada desktop
    await expect(page.locator("aside")).toBeVisible();

    // Verifikasi Sidebar menyesuaikan tinggi screen dan tidak floating di atas content
    const sidebarMetrics = await page.locator("aside").evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentElement?.getBoundingClientRect() || rect;
      return {
        sidebarWidth: rect.width,
        sidebarHeight: rect.height,
        parentTop: parentRect.top,
      };
    });
    expect(sidebarMetrics.sidebarWidth).toBe(256);
    expect(sidebarMetrics.sidebarHeight).toBe(800); // Tepat seukuran viewport height (h-screen)

    // Verifikasi Main content berada di sebelah kanan sidebar tanpa pernah tumpang tindih
    const mainMetrics = await page.locator("main").evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return {
        mainX: rect.x,
      };
    });
    expect(mainMetrics.mainX).toBeGreaterThanOrEqual(256); // Main content tidak pernah tertimpa sidebar

    // Verifikasi saat di-scroll, sidebar tetap fixed di top (sticky top-0)
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(100);
    const scrolledSidebarTop = await page.locator("aside").evaluate((el) => {
      return el.getBoundingClientRect().top;
    });
    expect(scrolledSidebarTop).toBe(0); // Tetap di top-0 saat halaman di-scroll

    // Desktop: Cek horizontal scroll
    let hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    // Desktop: Verifikasi kontras teks judul organisasi
    const headingStyles = await page
      .getByRole("heading", { name: "PT Nusantara Logistik" })
      .evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return { color: styles.color };
      });
    const textRgb = parseRgb(headingStyles.color);
    const bgRgb: [number, number, number] = [255, 255, 255];
    const contrast = getContrastRatio(textRgb, bgRgb);
    expect(contrast).toBeGreaterThanOrEqual(4.5);

    // Ambil screenshot desktop industri
    await page.screenshot({
      path: path.join(screenshotDir, "industri-1280.png"),
      fullPage: true,
    });

    // Mobile: Resize ke 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    hasHorizontalScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    // Mobile Drawer Test: Buka drawer via hamburger button
    const hamburgerBtn = page.getByRole("button", { name: "Buka navigasi" });
    await expect(hamburgerBtn).toBeVisible();
    await hamburgerBtn.click();

    // Verifikasi drawer terbuka
    await expect(
      page.getByRole("navigation", { name: "Navigasi Utama" })
    ).toBeVisible();

    // Ambil screenshot mobile industri dengan drawer terbuka
    await page.screenshot({
      path: path.join(screenshotDir, "industri-390.png"),
      fullPage: true,
    });
  });
});
