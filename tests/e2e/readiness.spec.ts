import { test, expect } from "@playwright/test";

test.describe("Tahap 6: Readiness Score dan Gap Analysis (P5)", () => {
  test.beforeEach(async ({ page }) => {
    // Login as UMKM
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("umkm@karyamandiri.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/umkm", { timeout: 15000 });
  });

  test("1. Navigasi ke halaman Readiness Score dari dashboard UMKM", async ({
    page,
  }) => {
    // Klik tombol CTA di sidebar dashboard UMKM
    await page
      .getByRole("link", { name: "Lihat Analisis Gap & Cara Naik Tier" })
      .click();
    await page.waitForURL("/umkm/readiness", { timeout: 10000 });

    // Verifikasi header halaman
    await expect(
      page.getByRole("heading", { name: "Skor Kesiapan Industri" })
    ).toBeVisible();
    await expect(page.getByText("Industrial Readiness Score")).toBeVisible();
    await expect(page.getByText("/ 100")).toBeVisible();
  });

  test("2. Menampilkan ringkasan skor, pil tier, dan bilah tersegmen 4 tier", async ({
    page,
  }) => {
    await page.goto("/umkm/readiness");

    // Skor besar & tier
    await expect(page.getByText("/ 100")).toBeVisible();

    // 4 tier pada progress bar
    await expect(page.getByText("Tahap Awal (0-39)")).toBeVisible();
    await expect(page.getByText("Berkembang (40-59)")).toBeVisible();
    await expect(page.getByText("Siap Kemitraan (60-79)")).toBeVisible();
    await expect(page.getByText("Siap Industri (80-100)")).toBeVisible();

    // Verifikasi 3 langkah tercepat naik tier
    await expect(
      page.getByRole("heading", { name: "3 Langkah Tercepat Naik Tier" })
    ).toBeVisible();
    const kerjakanButtons = page.getByRole("link", { name: "Kerjakan" });
    await expect(kerjakanButtons.first()).toBeVisible();
  });

  test("3. Accordion rincian 6 komponen skor A-F dapat dibuka", async ({
    page,
  }) => {
    await page.goto("/umkm/readiness");

    // Verifikasi keberadaan komponen A-F
    await expect(
      page.getByRole("button", { name: /Legalitas dan Profil/ })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Kapasitas dan Fasilitas Produksi/ })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Mutu dan Kompetensi/ })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Rekam Jejak Transaksi/ })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Administrasi dan Digital/ })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Finansial dan Sumber Bahan/ })
    ).toBeVisible();

    // Verifikasi catatan nilai awal 50% untuk akun tanpa riwayat
    await expect(
      page.getByText("* belum ada riwayat, memakai nilai awal 50%")
    ).toBeVisible();

    // Klik Komponen B untuk membuka detail accordion fasilitas
    await page
      .getByRole("button", { name: /Kapasitas dan Fasilitas Produksi/ })
      .click();
    await expect(
      page.getByText("Kapasitas bulanan per jenis produk terdokumentasi")
    ).toBeVisible();
  });

  test("4. Dialog penjelasan 'Cara skor dihitung' menampilkan formula transparan", async ({
    page,
  }) => {
    await page.goto("/umkm/readiness");

    // Klik tombol Cara skor dihitung
    await page.getByRole("button", { name: "Cara skor dihitung" }).click();

    // Verifikasi isi modal transparan
    await expect(
      page.getByText("Cara Industrial Readiness Score Dihitung")
    ).toBeVisible();
    await expect(page.getByText("1. Verifikasi Dokumen:")).toBeVisible();
    await expect(page.getByText("4. Akun Baru Tanpa Riwayat:")).toBeVisible();

    // Tutup dialog
    await page.getByRole("button", { name: "Saya Mengerti" }).click();
    await expect(
      page.getByText("Cara Industrial Readiness Score Dihitung")
    ).not.toBeVisible();
  });

  test("5. Tombol 'Hitung Ulang Skor' memicu pembaruan snapshot", async ({
    page,
  }) => {
    await page.goto("/umkm/readiness");

    const refreshButton = page.getByRole("button", {
      name: "Hitung Ulang Skor",
    });
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();

    // Verifikasi tetap di halaman dan skor tetap tampil
    await expect(page.getByText("/ 100")).toBeVisible();
  });
});
