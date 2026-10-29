import { test, expect } from "@playwright/test";

test.describe("Tahap 4: Master Data dan Konfigurasi Platform (PBI-90)", () => {
  test.beforeEach(async ({ page }) => {
    // Login as Admin
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("admin@rantainaik.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/admin", { timeout: 15000 });
  });

  test("1. Panel Konfigurasi Platform P23.2 tampil dengan 6 tab navigasi", async ({
    page,
  }) => {
    await expect(
      page.getByText("Konfigurasi Platform & Master Data (P23.2)")
    ).toBeVisible();

    // Pastikan 6 tab navigasi terlihat (gunakan exact: true untuk membedakan tab vs tombol aksi)
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
  });

  test("2. Validasi Real-time Bobot Readiness: Total harus 100 dan penolakan nilai invalid", async ({
    page,
  }) => {
    // Tab Bobot Readiness aktif secara default
    await expect(
      page.getByText("Validasi Total Bobot Readiness")
    ).toBeVisible();
    await expect(page.getByText("Total: 100 / 100")).toBeVisible();

    // Input legalitas
    const legalitasInput = page.locator("input[name='legalitas']");
    await expect(legalitasInput).toBeVisible();

    // Ubah nilai legalitas menjadi 50 (sehingga total menjadi 130)
    await legalitasInput.fill("50");

    // Harus muncul badge merah "Total: 130 / 100"
    await expect(page.getByText("Total: 130 / 100")).toBeVisible();

    // Tombol simpan harus nonaktif (disabled)
    const saveButton = page.getByRole("button", {
      name: "Simpan Bobot Readiness",
    });
    await expect(saveButton).toBeDisabled();

    // Kembalikan ke 20
    await legalitasInput.fill("20");
    await expect(page.getByText("Total: 100 / 100")).toBeVisible();
    await expect(saveButton).toBeEnabled();
  });

  test("3. Perubahan Bobot memerlukan konfirmasi modal dan berhasil disimpan", async ({
    page,
  }) => {
    // Sesuaikan legalitas jadi 25 dan fasilitas jadi 15 (total tetap 100)
    const legalitasInput = page.locator("input[name='legalitas']");
    const fasilitasInput = page.locator("input[name='fasilitas']");

    await legalitasInput.fill("25");
    await fasilitasInput.fill("15");

    await expect(page.getByText("Total: 100 / 100")).toBeVisible();

    const saveButton = page.getByRole("button", {
      name: "Simpan Bobot Readiness",
    });
    await saveButton.click();

    // Modal konfirmasi harus muncul
    await expect(
      page.getByText("Simpan Perubahan Bobot Readiness Score?")
    ).toBeVisible();

    // Klik tombol Konfirmasi Simpan
    await page.getByRole("button", { name: "Konfirmasi Simpan" }).click();

    // Notifikasi sukses muncul
    await expect(
      page.getByText("Bobot Readiness Score berhasil diperbarui.")
    ).toBeVisible();

    // Kembalikan ke default menggunakan tombol Pulihkan Default
    await page.getByRole("button", { name: "Pulihkan Default" }).click();
    await expect(
      page.getByText("Pulihkan Bobot Readiness ke Default Spec?")
    ).toBeVisible();
    await page.getByRole("button", { name: "Konfirmasi Simpan" }).click();

    await expect(
      page.getByText("Bobot Readiness berhasil dipulihkan.")
    ).toBeVisible();
  });

  test("4. Parameter Platform menampilkan nilai bisnis dari database", async ({
    page,
  }) => {
    // Pindah ke tab Parameter Platform
    await page
      .getByRole("button", { name: "Parameter Platform", exact: true })
      .click();

    await expect(page.getByText("Komisi Platform (%)")).toBeVisible();
    await expect(page.getByText("Batas Jumlah Lot (Min - Maks)")).toBeVisible();
    await expect(page.getByText("Qty Minimum per Lot (pcs)")).toBeVisible();
    await expect(
      page.getByText("Batas Waktu Pendanaan Escrow (Jam)")
    ).toBeVisible();
    await expect(
      page.getByText("Tabel Matriks Kompensasi Pembatalan (Spec 7.12.4)")
    ).toBeVisible();
  });

  test("5. Tab Kategori & Layanan menampilkan taksonomi tekstil", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Kategori & Layanan", exact: true })
      .click();

    await expect(
      page.getByText("Taksonomi Kategori Tekstil 2-Tingkat")
    ).toBeVisible();
    await expect(
      page.getByText("Layanan Produksi Konveksi (Multi-Pilih)")
    ).toBeVisible();

    // Cek master layanan hasil seed
    await expect(page.getByText("Jahit CMT (Cut-Make-Trim)")).toBeVisible();
  });
});
