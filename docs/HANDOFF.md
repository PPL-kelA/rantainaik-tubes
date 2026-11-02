# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-11-02, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/redesign-ui(PBI-107)
**Fase / sprint:** Sprint 2 (Visual Redesign R1: Token, Komponen Dasar, dan Shell Layout - PBI-107)

## Status ringkas
- Redesain Sistem Visual R1 (PBI-107) selesai 100%:
  - **Arah Visual Modern Industrial Kompartemen Bergaris**: Latar putih murni `#FFFFFF` di seluruh aplikasi, tanpa latar abu-abu/gradien/kaca/bayangan kartu. Kompartemen dipisahkan garis 1px `#E5E7EB`.
  - **Komponen UI Dasar Diperbarui**:
    - `Button`: Radius 4px (`rounded-[4px]`), tanpa bayangan, varian `default` (biru `#2862E0`), `neutral` (`#0E1422`), `secondary` (border `#8B93A1`), `outline`, `ghost`, `link`, `destructive`, `tokyo`.
    - `Input` & `Select`: Border 1px `#8B93A1` (kontras 3.1:1 di atas putih, lulus WCAG kontrol UI ≥ 3:1), radius 4px, focus ring 2px `#2862E0`.
    - `Checkbox`: Dibuat baru dengan border `#8B93A1`, checked background `#2862E0`, radius 4px.
    - `Badge`: Persegi dengan radius 2px (`rounded-[2px]`), border 1px, dilarang bentuk kapsul/lonjong (tanpa bentuk pil).
    - `Tabs`: Bergaya garis bawah (*underline*) aktif 2px `#2862E0`, tanpa bentuk pil.
    - `Table`: Border 1px `#E5E7EB`, header `#FAFBFC`, teks monospace tabular-nums untuk angka/ID/harga.
    - `Panel` & `PageHeader`: Kompartemen bergaris 1px `#E5E7EB` yang saling bersambung (*shared hairline border*) dengan header bergaris pemisah.
    - `Dialog` & `Tooltip`: Radius 4px, bayangan halus hanya untuk elemen melayang.
  - **Layout Shell Terstruktur**:
    - `AppHeader` (56px): Logo RN, kolom pencarian terpusat (maks 560px), ikon notifikasi, dan tombol akun/profil (`AuthNavButtons`). Header **tidak memuat menu navigasi**.
    - `AppSidebar` (240px): Mengambil item dari konfigurasi terpusat `src/config/navigation.ts` (INDUSTRY, UMKM, ADMIN, PUBLIC). Item aktif memiliki garis aksen kiri 2px `#2862E0` dan latar `#EFF4FE`. Responsif mobile drawer dengan hamburger toggle.
    - `AppShell`: Menyatukan header, sidebar, drawer mobile, dan area konten utama. Halaman auth (`/login`, `/register`) dirender secara mandiri tanpa sidebar.
  - **Halaman Beranda & Auth Sesuai Referensi Visual Upwork**:
    - Beranda publik (`/`) dan Beranda UMKM (`/umkm`) menerapkan layout 2-kolom Upwork:
      - Kolom Kiri: Promo banner gelap dengan garis indikator lurus tipis, alert strip tender pengadaan, in-page search bar, underline tabs (Paling Sesuai, RFQ Terbaru, Kategori), dan daftar feed RFQ dengan chip tag persegi `rounded-[2px]` tanpa bentuk pil.
      - Kolom Kanan: Widget profil akun dengan progress bar lurus tipis `rounded-[2px]`, widget verifikasi identitas (IDV), widget status kapasitas/ekosistem, dan trust box escrow 100% didanai.
    - Halaman Auth (`/login`, `/register`, `/verifikasi-pending`, `/reset-password`): seluruh bentuk pil (`rounded-full`) dan sudut bulat tebal (`rounded-xl`) dibersihkan total. Step indicators, selector peran radio, badge status, dan tombol aksi menggunakan radius tegas 4px dan badge 2px.
  - **Verifikasi & Kualitas**:
    - Unit test: 77 tests lulus 100% (Vitest).
    - E2E Playwright: 4 tests design system lulus 100% (termasuk Beranda dan Login di 1280px & 390px, screenshot tersimpan). 5 tests RFQ regression lulus 100%.
    - Lint & Typecheck: Bersih tanpa error dan formatting Prettier valid.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Redesain Visual R1 (PBI-107) | `feat/redesign-ui(PBI-107)` | Token CSS, 10 komponen dasar UI, config navigasi, AppHeader, AppSidebar, AppShell, halaman /login, /industri, / (beranda 2-kolom), /umkm, /register, /verifikasi-pending, /reset-password, e2e design-system & rfq | Selesai & terverifikasi (Berikutnya: R2 migrasi detail RFQ & antarmuka admin) | src/components/ui/*, src/components/layout/*, src/config/*, src/app/layout.tsx, src/app/(public)/*, src/app/(umkm)/umkm/page.tsx, src/app/(industri)/industri/page.tsx, tests/e2e/design-system.spec.ts, docs/HANDOFF.md |

## Selesai (terbaru di atas)
- Penyempurnaan layout shell fleksibel: Sidebar desktop memiliki tinggi tepat 100vh (`h-screen`), tetap terpancang (*fixed*) saat halaman di-scroll (`sticky top-0 self-start`), dan berada di kolom fisik flexbox berdampingan (`w-64 shrink-0`) sehingga **tidak pernah melayang atau menutupi konten utama** (`flex-1 min-w-0`).
- Penyeragaman padding 4-sisi pada seluruh item RFQ (Beranda Publik, Portal Industri, Portal UMKM): `p-6 sm:p-7` simetris atas, kanan, bawah, dan kiri tanpa celah timpang.
- Penyelarasan visual RFQ Detail (`/umkm/rfq/[id]`) dan RFQ Wizard (`/industri/rfq/baru`): latar belakang abu-abu `#F6F7F9` dan kartu mengambang lama diganti dengan kompartemen bergaris 1px `#E5E7EB` pada latar putih `#FFFFFF`, status badge kotak radius 2px tanpa stroke, dan footer wizard terintegrasi di dalam kompartemen (tidak lagi `fixed` menabrak sidebar).
- Eliminasi navbar atas (AppHeader) pada desktop; seluruh navigasi, profil akun (atau tombol Masuk/Daftar bagi tamu), dan tombol notifikasi dipindahkan ke dalam AppSidebar (full-height 256px).
- Pemindahan kolom pencarian (search bar) ke dalam area konten di bawah header portal mitra/katalog tender.
- Redesain Beranda Publik (belum login) menjadi Landing / Welcome Page modern industrial kompartemen terpadu: Hero pitch B2B tekstil, metrik kunci, alur kerja 4-langkah transaksi, dan showcase RFQ terbuka.
- Penghapusan seluruh stroke (border) pada komponen Badge/status pill: beralih ke warna background solid lembut murni per status (success, warning, info, neutral/tag).
- Penghapusan padding/gap renggang antar-kompartemen (*seamless shared borders* 1px #E5E7EB).
- Penambahan padding horizontal dan vertikal yang lega pada list RFQ item (px-6 py-5 sm:px-8 sm:py-6).
- Pembersihan total bentuk kapsul/pil (rounded-full) pada seluruh rute beranda dan auth (/register, /verifikasi-pending, /reset-password, /login).
- Pengujian otomatis E2E Playwright tests/e2e/design-system.spec.ts dan tangkapan layar visual desktop 1280px serta mobile 390px tersimpan di direktori artefak.
- Pengujian regresi RFQ E2E tests/e2e/rfq.spec.ts (5 tests lulus 100%) dan 77 unit tests Vitest lulus 100%.

## Berikutnya (1-3 langkah konkret)
1. Redesain R2: Terapkan layout shell kompartemen dan komponen baru ke halaman UMKM (`/umkm`, `/umkm/readiness`, `/umkm/rfq/[id]`).
2. Terapkan komponen baru ke halaman Admin (`/admin`, antrian verifikasi).
3. Pastikan seluruh form dan wizard (termasuk RFQ Wizard 10 Langkah) menggunakan token kontrol radius 4px dan border kontras 3:1.
- Tidak ada blocker.

## Catatan teknis penting
- Akun uji coba lokal (password default: `Password123`):
  - Admin: `admin@rantainaik.id`
  - Industri: `industri@nusantara.id`
  - UMKM (Verified): `umkm@karyamandiri.id`
  - UMKM (Pending): `umkm.pending@sinar.id`
- Testing:
  - Unit test: `pnpm run test` (Vitest, 77 tests passing)
  - E2E test: `pnpm exec playwright test tests/e2e/design-system.spec.ts` (3 tests passing)
  - Lint & Typecheck: `pnpm run lint` & `pnpm run typecheck`
