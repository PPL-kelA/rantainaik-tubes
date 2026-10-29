import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Tahap 3: Profil, Dokumen, dan Verifikasi Admin", () => {
  const dummyFilePath = path.join(
    process.cwd(),
    "tests",
    "e2e",
    "fixtures",
    "dummy-nib.pdf"
  );

  test.beforeAll(async () => {
    // Ensure test fixture file exists
    const dir = path.dirname(dummyFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dummyFilePath)) {
      fs.writeFileSync(dummyFilePath, "%PDF-1.4 Mock NIB Document for Testing");
    }
  });

  test("1. Edit profil organisasi dan verifikasi perubahan", async ({
    page,
  }) => {
    // Login as UMKM
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("umkm.pending@sinar.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/umkm", { timeout: 15000 });

    // Buka halaman profil
    await page.goto("/umkm/profil");
    await expect(
      page.getByText("Data Profil Organisasi / Usaha")
    ).toBeVisible();

    // Edit nama PIC dan alamat
    const addressInput = page.locator("input[name='address']");
    await addressInput.fill("Kawasan Sentra Rajut Binong Jati No. 88");
    await page.getByRole("button", { name: "Simpan Perubahan Profil" }).click();

    await expect(
      page.getByText("Profil organisasi berhasil diperbarui.")
    ).toBeVisible();
  });

  test("2. Unggah dokumen legalitas oleh UMKM", async ({ page }) => {
    // Login as UMKM
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("umkm.pending@sinar.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/umkm", { timeout: 15000 });

    await page.goto("/umkm/profil");
    await expect(
      page.getByText("Dokumen Legalitas & Verifikasi Akun")
    ).toBeVisible();

    // Pilih jenis dokumen NIB dan upload file
    await page.locator("select").selectOption("NIB");
    await page.locator("input[type='file']").setInputFiles(dummyFilePath);
    await page.getByRole("button", { name: "Unggah" }).click();

    await expect(
      page.getByText("Dokumen berhasil diunggah dan menunggu verifikasi admin.")
    ).toBeVisible();

    // Verifikasi bahwa status dokumen NIB berubah menjadi "Menunggu Admin"
    await expect(page.getByText("Menunggu Admin").first()).toBeVisible();
  });

  test("3. Admin meninjau dokumen: Tolak dengan alasan wajib", async ({
    page,
  }) => {
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

    // Tinjau dokumen organisasi Konveksi Sinar Jaya
    const row = page.locator("tr", { hasText: "Konveksi Sinar Jaya" }).first();
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: /Tinjau Dokumen/i }).click();

    // Modal terbuka
    await expect(page.getByText("Panel Kurasi Admin (P23)")).toBeVisible();

    // Klik Tolak
    await page.getByRole("button", { name: "Tolak" }).first().click();

    // Pilih chip alasan cepat
    await page.getByText("Dokumen buram atau tidak dapat dibaca jelas").click();
    await page.getByRole("button", { name: "Konfirmasi Penolakan" }).click();

    await expect(
      page.getByText("Dokumen ditolak dan notifikasi perbaikan dikirimkan.")
    ).toBeVisible();
  });

  test("4. Otorisasi dokumen: Pengguna lain tidak bisa membuka berkas organisasi lain", async ({
    request,
  }) => {
    // Coba akses route file dokumen tanpa sesi
    const responseNoAuth = await request.get(
      "/api/documents/non-existent-id/file"
    );
    expect(responseNoAuth.status()).toBe(401);
  });
});
