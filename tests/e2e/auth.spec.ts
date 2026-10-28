import { test, expect } from "@playwright/test";

test.describe("Autentikasi dan RBAC (Tahap 2)", () => {
  test("Alur Pendaftaran: Pilih peran, isi form, dan dialihkan ke halaman verifikasi pending", async ({
    page,
  }) => {
    await page.goto("/register");

    // Langkah 1: Pilih Peran Industri
    await expect(
      page.getByRole("heading", { name: "Langkah 1: Pilih Peran Anda" })
    ).toBeVisible();
    await page.getByText("Saya Industri / Pembeli").click();
    await page.getByRole("button", { name: "Lanjutkan Pendaftaran" }).click();

    // Langkah 2: Lengkapi form
    await expect(
      page.getByRole("heading", {
        name: "Langkah 2: Lengkapi Data Akun & Usaha",
      })
    ).toBeVisible();

    const uniqueEmail = `test.industri.${Date.now()}@perusahaan.com`;
    await page
      .locator("input[placeholder='Nama lengkap penanggung jawab']")
      .fill("Budi Santoso");
    await page
      .locator("input[placeholder='email@usaha.com']")
      .fill(uniqueEmail);
    await page.locator("input[placeholder='08123456789']").fill("081299887766");
    await page
      .locator("input[placeholder='Minimal 8 karakter, ada huruf & angka']")
      .fill("Password123");
    await page
      .locator("input[placeholder*='PT Nusantara Logistik']")
      .fill("PT Tekstil Sejahtera Bersama");
    await page
      .locator("input[placeholder='Contoh: Bekasi']")
      .fill("Jakarta Barat");
    await page
      .locator("input[placeholder='Contoh: Jawa Barat']")
      .fill("DKI Jakarta");
    await page.getByRole("checkbox").check();

    await page.getByRole("button", { name: "Selesaikan Pendaftaran" }).click();

    // Tiba di halaman /verifikasi-pending
    await expect(page).toHaveURL(/.*verifikasi-pending.*/);
    await expect(
      page.getByRole("heading", { name: "Pendaftaran Berhasil Diterima" })
    ).toBeVisible();
    await expect(
      page.getByText("Status Akun: Menunggu Verifikasi")
    ).toBeVisible();
    await expect(
      page.getByText("Aturan Akses Fitur (Guard BR-01)")
    ).toBeVisible();
  });

  test("Login Berhasil: Industri masuk ke /industri", async ({ page }) => {
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
    await expect(page.getByText("Terverifikasi")).toBeVisible();
  });

  test("Login Berhasil: Admin masuk ke /admin", async ({ page }) => {
    await page.goto("/login");

    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("admin@rantainaik.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    await page.waitForURL("/admin", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "Dashboard Administrator" })
    ).toBeVisible();
    await expect(page.getByText("Role: ADMIN")).toBeVisible();
  });

  test("Login Berhasil: UMKM Terverifikasi masuk ke /umkm", async ({
    page,
  }) => {
    await page.goto("/login");

    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("umkm@karyamandiri.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    await page.waitForURL("/umkm", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "CV Karya Mandiri Konveksi" })
    ).toBeVisible();
    await expect(
      page.getByText("Terverifikasi", { exact: true })
    ).toBeVisible();
  });

  test("Akses Akun PENDING: UMKM Pending melihat peringatan verifikasi dan guard BR-01", async ({
    page,
  }) => {
    await page.goto("/login");

    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("umkm.pending@sinar.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();

    await page.waitForURL("/umkm", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "Konveksi Sinar Jaya" })
    ).toBeVisible();
    await expect(page.getByText("Menunggu Verifikasi")).toBeVisible();
    await expect(
      page.getByText(
        "Akun Anda Sedang Dalam Tahap Verifikasi (Status: PENDING)"
      )
    ).toBeVisible();
    await expect(
      page.getByText("Fitur penawaran terkunci (BR-01)")
    ).toBeVisible();
  });

  test("Akses Silang Ditolak (RBAC): UMKM dicegah mengakses rute /admin", async ({
    page,
  }) => {
    // 1. Login sebagai UMKM
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("umkm@karyamandiri.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/umkm");

    // 2. Coba paksa akses /admin
    await page.goto("/admin");

    // 3. Sistem RBAC menolak dan mengarahkan kembali ke dashboard UMKM dengan error
    await expect(page).toHaveURL(/\/umkm/);
    await expect(
      page.getByRole("heading", { name: "CV Karya Mandiri Konveksi" })
    ).toBeVisible();
  });

  test("Akses Silang Ditolak (RBAC): Industri dicegah mengakses rute /umkm", async ({
    page,
  }) => {
    // 1. Login sebagai Industri
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("industri@nusantara.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/industri");

    // 2. Coba paksa akses /umkm
    await page.goto("/umkm");

    // 3. Sistem RBAC menolak dan mengarahkan kembali ke dashboard Industri
    await expect(page).toHaveURL(/\/industri/);
    await expect(
      page.getByRole("heading", { name: "PT Nusantara Logistik" })
    ).toBeVisible();
  });

  test("Fitur Admin: Admin dapat memverifikasi (ACC) akun pending", async ({
    page,
  }) => {
    // 1. Login sebagai Admin
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("admin@rantainaik.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/admin");

    // 2. Cek tabel verifikasi
    await expect(
      page.getByRole("heading", { name: "Antrean Verifikasi Akun Baru" })
    ).toBeVisible();

    // 3. Bila ada tombol Verifikasi (ACC), klik untuk meng-ACC
    const accButton = page
      .getByRole("button", { name: "Verifikasi (ACC)" })
      .first();
    if (await accButton.isVisible()) {
      await accButton.click();
      await expect(page.getByText("berhasil diverifikasi")).toBeVisible();
    }
  });
});
