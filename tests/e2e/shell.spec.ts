import { test, expect } from "@playwright/test";

test.describe("Layout Shell and Navigation", () => {
  test("halaman utama tampil dengan layout shell, logo, dan header 64px", async ({
    page,
  }) => {
    await page.goto("/");

    // Cek header shell
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Cek logo RantaiNaik
    const logo = page.getByRole("link", { name: "RantaiNaik" });
    await expect(logo).toBeVisible();

    // Cek teks placeholder halaman utama
    await expect(
      page.getByRole("heading", { name: "Selamat Datang di RantaiNaik" })
    ).toBeVisible();

    // Navigasi ke halaman UMKM
    await page.getByRole("link", { name: "UMKM" }).click();
    await expect(page).toHaveURL("/umkm");
    await expect(
      page.getByRole("heading", { name: "Dashboard Mitra UMKM" })
    ).toBeVisible();
  });
});
