import { test, expect } from "@playwright/test";

test.describe("Tahap 5: Kapabilitas UMKM dan Portofolio (P4)", () => {
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

  test("1. Menampilkan layout profil dua kolom P4 dan kartu kelengkapan profil", async ({
    page,
  }) => {
    await page.goto("/umkm/profil");

    // Kolom kiri (profil, kelengkapan, label stat)
    await expect(page.getByText("Kelengkapan Profil")).toBeVisible();
    await expect(page.getByText("Total Kapasitas")).toBeVisible();
    await expect(page.getByText("Tenaga Kerja", { exact: true })).toBeVisible();
    await expect(page.getByText("Dokumen & Akreditasi")).toBeVisible();
    await expect(page.getByText("Rekening Pencairan Escrow")).toBeVisible();

    // Kolom kanan (kartu-kartu utama)
    await expect(
      page.getByRole("heading", { name: "Tentang Usaha Konveksi" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Kapabilitas Produk Tekstil" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Mesin dan Tenaga Kerja" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Portofolio dan Contoh Produk" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Ulasan dan Evaluasi Pembeli Industri",
      })
    ).toBeVisible();
  });

  test("2. Slide-over Tambah Kapabilitas: Validasi error jika MOQ > Kapasitas", async ({
    page,
  }) => {
    await page.goto("/umkm/profil");

    // Buka Slide-over panel Tambah Kapabilitas
    const addCapBtn = page
      .getByRole("button", { name: /Tambah Kapabilitas/i })
      .first();
    await addCapBtn.click();

    // Verifikasi slide-over panel terbuka
    await expect(
      page.getByRole("heading", { name: "Tambah Kapabilitas Produk" })
    ).toBeVisible();

    // Isi kapasitas 2000 dan MOQ 5000 (invalid)
    const capacityInput = page.locator("input[name='monthlyCapacity']");
    const moqInput = page.locator("input[name='minOrderQty']");

    await capacityInput.fill("2000");
    await moqInput.fill("5000");

    // Pesan error validasi harus muncul
    await expect(
      page.getByText("tidak boleh melampaui kapasitas bulanan")
    ).toBeVisible();

    // Tombol simpan dinonaktifkan
    const submitBtn = page.getByRole("button", { name: "Simpan Kapabilitas" });
    await expect(submitBtn).toBeDisabled();

    // Perbaiki nilai MOQ menjadi 100
    await moqInput.fill("100");
    await expect(
      page.getByText("tidak boleh melampaui kapasitas bulanan")
    ).not.toBeVisible();
    await expect(submitBtn).toBeEnabled();

    // Tutup panel
    await page.getByRole("button", { name: "Batal" }).click();
  });

  test("3. Menambah kapabilitas produk baru dan tampil pada tabel", async ({
    page,
  }) => {
    await page.goto("/umkm/profil");

    // Buka Slide-over panel Tambah Kapabilitas
    const addCapBtn = page
      .getByRole("button", { name: /Tambah Kapabilitas/i })
      .first();
    await addCapBtn.click();

    // Pilih kategori pertama yang tersedia di dropdown
    const categorySelect = page.locator("select").first();
    await categorySelect.selectOption({ index: 1 });

    // Pilih layanan (checkbox pertama)
    const firstServiceCheckbox = page.locator("input[type='checkbox']").first();
    await firstServiceCheckbox.check();

    // Pilih bahan (checkbox bahan pertama, di section bahan)
    const materialCheckbox = page
      .locator("label", { hasText: "Katun Kombed" })
      .locator("input");
    await materialCheckbox.check();

    // Isi kapasitas, MOQ, lead time
    await page.locator("input[name='monthlyCapacity']").fill("4000");
    await page.locator("input[name='minOrderQty']").fill("50");
    await page.locator("input[name='leadTimeDays']").fill("14");

    // Submit form
    await page.getByRole("button", { name: "Simpan Kapabilitas" }).click();

    // Halaman refresh dan kapasitas tercatat
    await expect(page.getByText("4.000 pcs").first()).toBeVisible();
    await expect(page.getByText("14 hari kerja").first()).toBeVisible();
  });

  test("4. Menambah aset mesin konveksi melalui modal", async ({ page }) => {
    await page.goto("/umkm/profil");

    await page.getByRole("button", { name: /Tambah Mesin/i }).click();

    // Modal terbuka
    await expect(
      page.getByRole("heading", { name: "Tambah Aset Mesin Konveksi" })
    ).toBeVisible();

    await page
      .locator("input[placeholder*='Mesin Jahit Lurus']")
      .fill("Mesin Obras 5 Benang");
    await page.locator("input[placeholder*='Juki']").fill("Pegasus EX-5200");
    await page.locator("input[type='number']").last().fill("4");

    await page.getByRole("button", { name: "Simpan Mesin" }).click();

    // Tampil di daftar mesin
    await expect(page.getByText("Mesin Obras 5 Benang").first()).toBeVisible();
    await expect(page.getByText("4 unit").first()).toBeVisible();
  });

  test("5. Menambah portofolio produk jadi", async ({ page }) => {
    await page.goto("/umkm/profil");

    await page.getByRole("button", { name: /Tambah Portofolio/i }).click();

    // Modal terbuka
    await expect(
      page.getByRole("heading", { name: "Tambah Portofolio Produk Jadi" })
    ).toBeVisible();

    await page
      .locator("input[placeholder*='Kemeja Drill Seragam']")
      .fill("Polo Shirt Bordir Komunitas");
    await page.locator("input[placeholder*='Kemeja, Polo']").fill("Polo Shirt");
    await page.locator("input[placeholder*='BUMN, Brand']").fill("Alumni ITB");
    await page.locator("input[placeholder*='5000']").fill("1200");
    await page
      .locator("input[placeholder*='unsplash']")
      .fill(
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
      );

    await page.getByRole("button", { name: "Simpan Portofolio" }).click();

    // Tampil di grid portofolio
    await expect(
      page.getByText("Polo Shirt Bordir Komunitas").first()
    ).toBeVisible();
    await expect(page.getByText("Alumni ITB").first()).toBeVisible();
  });
});
