import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

// Helper WCAG 2.1 contrast ratio parser
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

test.describe("R3: Homepage Publik RantaiNaik & PublicLayout", () => {
  const artifactDir = path.resolve(
    "C:/Users/rahma/.gemini/antigravity/brain/0012c8e2-aafa-4ad1-acc9-086a0f410d88"
  );

  test.beforeAll(() => {
    if (!fs.existsSync(artifactDir)) {
      fs.mkdirSync(artifactDir, { recursive: true });
    }
  });

  const breakpoints = [360, 390, 768, 1024, 1280, 1440];

  for (const width of breakpoints) {
    test(`Responsif di ${width}px: Bebas horizontal scroll, tanpa sidebar, dan screenshot tersimpan`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      // 1. Verifikasi TIDAK ADA elemen sidebar
      const sidebarCount = await page.locator("aside").count();
      expect(sidebarCount).toBe(0);

      const appSidebarNav = page.locator("nav[aria-label='Navigasi Utama']");
      await expect(appSidebarNav).toHaveCount(0);

      // 2. Verifikasi TIDAK ADA horizontal scroll pada body/html
      const hasHorizontalScroll = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
            document.documentElement.clientWidth ||
          document.body.scrollWidth > window.innerWidth
        );
      });
      expect(hasHorizontalScroll).toBe(false);

      // 3. Verifikasi elemen inti beranda
      await expect(
        page.getByRole("heading", {
          name: "Temukan konveksi yang siap memproduksi pesanan Anda",
        })
      ).toBeVisible();

      // 4. Hamburger hanya muncul di bawah 1024px (< 1024)
      const hamburger = page.getByRole("button", {
        name: "Buka navigasi menu",
      });
      if (width < 1024) {
        await expect(hamburger).toBeVisible();
      } else {
        await expect(hamburger).toBeHidden();
      }

      // 5. Ambil screenshot untuk tiap ukuran
      await page.screenshot({
        path: path.join(artifactDir, `r3-homepage-${width}.png`),
        fullPage: true,
      });
    });
  }

  test("Mobile Sheet (<1024px): Buka via hamburger, tutup via tombol X dan tombol Esc, kunci body scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const hamburger = page.getByRole("button", { name: "Buka navigasi menu" });
    await expect(hamburger).toBeVisible();

    // Buka sheet
    await hamburger.click();
    const sheetDialog = page.getByRole("dialog", {
      name: "Navigasi Menu Seluler",
    });
    await expect(sheetDialog).toBeVisible();

    // Verifikasi body scroll terkunci (overflow hidden)
    const isBodyLocked = await page.evaluate(() => {
      return document.body.style.overflow === "hidden";
    });
    expect(isBodyLocked).toBe(true);

    // Verifikasi accordion di dalam sheet bisa dibuka
    const industriAccordion = sheetDialog.getByRole("button", {
      name: "Untuk Industri",
    });
    await expect(industriAccordion).toBeVisible();
    await industriAccordion.click();
    await expect(sheetDialog.getByText("Buat RFQ Terstruktur")).toBeVisible();

    // Tutup sheet via tombol X
    const closeBtn = sheetDialog.getByRole("button", {
      name: "Tutup navigasi",
    });
    await closeBtn.click();
    await expect(sheetDialog).toBeHidden();

    // Buka kembali dan tutup via tombol Esc
    await hamburger.click();
    await expect(sheetDialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheetDialog).toBeHidden();
  });

  test("Navbar Dropdown Desktop: Navigasi keyboard (Enter, ArrowDown, Esc)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Cari dropdown Untuk Industri
    const industriBtn = page.getByRole("button", { name: "Untuk Industri" });
    await expect(industriBtn).toBeVisible();

    // Buka dropdown via keyboard
    await industriBtn.focus();
    await page.keyboard.press("Enter");

    const menu = page.getByRole("menu", { name: "Untuk Industri" });
    await expect(menu).toBeVisible();

    // Navigasi dengan ArrowDown
    await page.keyboard.press("ArrowDown");
    const activeElementText = await page.evaluate(() => {
      return document.activeElement?.textContent;
    });
    expect(activeElementText).toBeTruthy();

    // Tutup dengan Escape
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("Audit Gaya & Desain: Tanpa rounded-full (bebas kapsul/pil) dan kontras pita gelap", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // 1. Verifikasi TIDAK ADA elemen rounded-full pada elemen struktural halaman
    const pillElementCount = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll(".rounded-full"));
      return elements.filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 12 && rect.height > 12;
      }).length;
    });
    expect(pillElementCount).toBe(0);

    // 2. Kontras Pita Gelap Hero (#0E1422 vs teks putih H1)
    const heroHeading = page.getByRole("heading", {
      name: "Temukan konveksi yang siap memproduksi pesanan Anda",
    });
    await expect(heroHeading).toBeVisible();
    const headingColor = await heroHeading.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    const headingRgb = parseRgb(headingColor);
    const heroBgRgb: [number, number, number] = [14, 20, 34]; // #0E1422
    const heroContrast = getContrastRatio(headingRgb, heroBgRgb);
    expect(heroContrast).toBeGreaterThanOrEqual(4.5);

    // 3. Kontras Pita Gelap Footer (#0E1422 vs teks #A9B1D6 / putih)
    const footerHeading = page.locator("footer .font-mono").first();
    await expect(footerHeading).toBeVisible();
    const footerTextColor = await footerHeading.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    const footerTextRgb = parseRgb(footerTextColor);
    const footerContrast = getContrastRatio(footerTextRgb, heroBgRgb);
    expect(footerContrast).toBeGreaterThanOrEqual(4.5);
  });

  test("Integritas Konten: Semua data contoh berlabel dan Escrow berstatus 'Dalam pengembangan'", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Verifikasi label Data contoh
    const dataContohCount = await page.getByText("Data contoh").count();
    expect(dataContohCount).toBeGreaterThanOrEqual(3);

    // Verifikasi badge Dalam pengembangan
    const devBadgeCount = await page.getByText("Dalam pengembangan").count();
    expect(devBadgeCount).toBeGreaterThanOrEqual(2);

    // Verifikasi 12 bagian urut
    await expect(page.getByRole("region", { name: "Pengumuman" })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible(); // PublicNavbar
    await expect(page.getByRole("region", { name: "Hero Pengenalan RantaiNaik" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Statistik Metrik Transaksi" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Pelaku Industri dan UMKM Mitra" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Contoh Alur Pengadaan" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Fitur Unggulan Platform" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Pilihan Peran Pengguna" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Alur Cara Kerja Pengadaan" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Pusat Sumber Belajar dan Panduan" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Panggilan Aksi Pengadaan" })).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Halaman Auth (/login & /register): Konsisten memakai PublicLayout tanpa sidebar", async ({
    page,
  }) => {
    // 1. /login
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Masuk ke Akun" })).toBeVisible();
    // Navbar publik terlihat
    await expect(page.getByRole("banner")).toBeVisible();
    // Sidebar tidak ada
    expect(await page.locator("aside").count()).toBe(0);

    let hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // 2. /register
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Langkah 1: Pilih Peran Anda" })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    expect(await page.locator("aside").count()).toBe(0);

    hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});
