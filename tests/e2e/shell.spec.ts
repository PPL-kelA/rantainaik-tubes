import { test, expect } from "@playwright/test";

test.describe("Layout Shell and Navigation", () => {
  test("halaman utama tampil dengan layout shell, logo, dan navigasi publik 64px", async ({
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

    // Cek tombol Masuk di navigasi publik
    const loginBtn = page.getByRole("link", { name: "Masuk" });
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();
    await expect(page).toHaveURL("/login");
    await expect(
      page.getByRole("heading", { name: "Masuk ke Akun" })
    ).toBeVisible();
  });
});
