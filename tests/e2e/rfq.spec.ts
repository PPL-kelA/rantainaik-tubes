import { test, expect } from "@playwright/test";

test.describe("Tahap 7: RFQ Berbasis Item Tunggal (P7, P12, P13)", () => {
  test("1. Industri melihat daftar RFQ saya di dashboard (P12) dan tombol Buat RFQ", async ({
    page,
  }) => {
    // Login as Industri
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("industri@nusantara.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/industri", { timeout: 15000 });

    // Verifikasi Header & Tombol Buat RFQ
    await expect(
      page.getByText("Portal Pengadaan Industri & Korporasi")
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Buat RFQ Baru/i })
    ).toBeVisible();

    // Verifikasi Tab RFQ Saya
    await expect(
      page.getByRole("heading", { name: "Daftar RFQ Saya (P12)" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Aktif/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Draft/i })).toBeVisible();
  });

  test("2. Industri dapat membuat dan menyimpan draft RFQ via Wizard 10 Langkah (P13)", async ({
    page,
  }) => {
    // Login as Industri
    await page.goto("/login");
    await page
      .locator("input[placeholder='contoh@perusahaan.com']")
      .fill("industri@nusantara.id");
    await page
      .locator("input[placeholder='Minimal 8 karakter']")
      .fill("Password123");
    await page.getByRole("button", { name: "Masuk Sekarang" }).click();
    await page.waitForURL("/industri", { timeout: 15000 });

    // Buka Wizard Buat RFQ
    await page.getByRole("link", { name: /Buat RFQ Baru/i }).click();
    await page.waitForURL("/industri/rfq/baru", { timeout: 10000 });

    // Langkah 1: Jenis Kebutuhan
    await expect(
      page.getByText("Langkah 1 dari 10: Jenis Kebutuhan")
    ).toBeVisible();
    await page.getByText("Seragam dan Pakaian Kerja").click();
    await page.getByRole("button", { name: "Lanjut" }).click();

    // Langkah 2: Informasi Dasar
    await expect(
      page.getByText("Langkah 2 dari 10: Informasi Dasar")
    ).toBeVisible();
    await page
      .locator("input[placeholder*='Contoh: Pengadaan Seragam']")
      .fill("Pengadaan Kemeja Event 2027");
    await page.getByRole("button", { name: "Lanjut" }).click();

    // Langkah 3: Item & Ukuran
    await expect(
      page.getByText("Langkah 3 dari 10: Item & Spesifikasi")
    ).toBeVisible();
    await expect(page.getByText("Item #1")).toBeVisible();
    // Verifikasi total otomatis ukuran
    await expect(page.getByText("Total Item: 200 pcs")).toBeVisible();

    // Simpan Draft
    await page.getByRole("button", { name: "Simpan Draft" }).click();
    await expect(page.getByText(/berhasil disimpan!/i)).toBeVisible();
  });

  test("3. UMKM dapat membuka detail RFQ-0007 (P7) beserta rincian item, ukuran, dan tab", async ({
    page,
  }) => {
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

    // Buka RFQ-0007 dari dashboard UMKM
    await page
      .getByRole("link", { name: /Buka Spesifikasi & Q&A/i })
      .first()
      .click();
    await page.waitForURL("**/umkm/rfq/RFQ-0007", { timeout: 10000 });

    // Verifikasi Header & Strip Fakta Kunci (P7)
    await expect(page.getByText("RFQ-0007").first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Seragam Karyawan Kantor 2027" })
    ).toBeVisible();
    await expect(page.getByText("300 pcs (2 item)")).toBeVisible();
    await expect(page.getByText("Dibuka untuk Penawaran")).toBeVisible();

    // Verifikasi Tab Spesifikasi: Rincian Ukuran S-XXL item 1 (200 pcs)
    await expect(
      page.getByRole("heading", { name: "Kemeja kerja lengan panjang pria" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Rompi operasional" })
    ).toBeVisible();
    await expect(page.getByText("Total: 200 pcs")).toBeVisible();
    await expect(page.getByText("Total: 100 pcs")).toBeVisible();

    // Verifikasi Rekam Jejak Pembeli
    await expect(
      page.getByRole("heading", { name: "PT Nusantara Logistik" })
    ).toBeVisible();
    await expect(page.getByText("100% Escrow")).toBeVisible();
  });

  test("4. UMKM dapat membuka tab Tanya Jawab dan mengajukan pertanyaan anonim (Q-04)", async ({
    page,
  }) => {
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

    await page.goto("/umkm/rfq/RFQ-0007");

    // Buka Tab Tanya Jawab
    await page.getByRole("button", { name: /Tanya Jawab/i }).click();

    // Verifikasi pertanyaan seed awal yang ada
    await expect(page.getByText("Tanya Jawab Publik (Q&A)")).toBeVisible();
    await expect(
      page.getByText("Penanya Anonim (Mitra UMKM)").first()
    ).toBeVisible();
    await expect(
      page.getByText("Apakah merk benang jahit disyaratkan khusus")
    ).toBeVisible();
    await expect(
      page.getByText("Boleh menggunakan Coats atau Astra")
    ).toBeVisible();

    // Ajukan pertanyaan baru
    const questionInput = page.locator(
      "textarea[placeholder*='Contoh: Apakah toleransi warna']"
    );
    await questionInput.fill(
      "Apakah kancing kemeja harus di-engrave logo perusahaan?"
    );
    await page.getByRole("button", { name: "Kirim Pertanyaan" }).click();

    await expect(
      page.getByText(/Pertanyaan Anda berhasil diajukan/i)
    ).toBeVisible();
  });

  test("5. UMKM dapat melihat Addendum resmi pada Tab Addendum (R-04)", async ({
    page,
  }) => {
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

    await page.goto("/umkm/rfq/RFQ-0007");

    // Buka Tab Addendum
    await page.getByRole("button", { name: /Addendum Resmi/i }).click();

    // Verifikasi Addendum #1
    await expect(page.getByText("Riwayat Addendum Resmi (R-04)")).toBeVisible();
    await expect(page.getByText("Addendum #1")).toBeVisible();
    await expect(
      page.getByText(/Penyesuaian toleransi ukuran panjang lengan/i)
    ).toBeVisible();
  });
});
