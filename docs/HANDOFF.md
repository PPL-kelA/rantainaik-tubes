# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-11-03, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/redesign-ui(PBI-107)
**Fase / sprint:** Sprint 2 (Visual Redesign R2: Halaman UMKM & Fitur di Dalamnya - PBI-107)

## Status ringkas
- Redesain Sistem Visual R2 (Halaman UMKM & Fitur di Dalamnya) selesai 100%:
  - **Arah Visual & Layout Kompartemen Bergaris (Seamless 1px Hairline #E5E7EB)**:
    - Latar putih murni `#FFFFFF` di seluruh antarmuka UMKM, tanpa kartu mengambang (`shadow-*`), tanpa latar abu-abu/gradien, dan tanpa celah renggang (*gap*) antar-kompartemen.
    - Tiap halaman menerapkan `PageHeader` resmi di kompartemen paling atas.
    - Halaman daftar/feed memakai `SearchBar` tepat di bawah header (bebas kolom pencarian di navbar).
    - Baris daftar/feed memiliki padding simetris 24px kiri-kanan dan 20px atas-bawah (`px-6 py-5`).
    - Seluruh badge status menggunakan `StatusBadge` berlatar warna solid lembut tanpa stroke (`border-0`), persegi industrial `rounded-[2px]`.
    - Eliminasi total bentuk pil/kapsul (`rounded-full` > 16px) di seluruh halaman UMKM (avatar kotak 4px, chip tag 2px, bilah 4-tier bergaris 2px, nomor langkah kotak 2px, tab underline 2px).
  - **Penyempurnaan Navigasi & Sidebar**:
    - Perbaikan `AppSidebar` dengan visual grouping tipografi industrial mono uppercase `text-[10px] tracking-[0.08em] text-[#8B93A1]` dan padding `px-3 py-2 text-xs`.
    - Garis aksen aktif 2px `#2862E0` berlatar `#EFF4FE` dengan border transparan normal untuk mencegah layout shift.
    - Logika `isActive` diperbaiki: Dashboard root memakai exact match (`pathname === href`), hash `#` diabaikan, dan sub-rute memakai prefix match sehingga **tepat hanya 1 item menu yang ter-highlight** saat membuka halaman mana pun.
  - **Halaman yang Ditransformasi & Ditambahkan**:
    1. `/umkm` (Dasbor UMKM):
       - Header kompartemen memuat `PageHeader` resmi dengan `StatusBadge` status akun (VERIFIED/PENDING) di samping category/nama organisasi.
       - In-page `SearchBar` di bawah header dengan border 1px `#8B93A1` dan focus ring `#2862E0`.
       - Instrument grid 4-kolom dan feed tender dengan padding baris `px-6 py-5` serta chip tag persegi tanpa stroke.
    2. `/umkm/rfq` (Pencarian RFQ Terfokus):
       - Halaman pencarian terfokus bagi UMKM untuk mencocokkan tender dengan kapabilitas dan kuota produksinya.
       - Header `PageHeader` "Cari Tender RFQ", in-page `SearchBar`, dan filter samping kompartemen: kesesuaian kapabilitas, kategori pakaian, alokasi (Tunggal/Lot), ketentuan bahan (CMT/Full Package), kebutuhan sampel pra-produksi, dan batas kuantitas.
       - Feed tender baris `px-6 py-5` dengan tag persegi `rounded-[2px]`, chip persentase kecocokan kapabilitas, `StatusBadge`, dan tombol aksi tawar.
    3. `/umkm/penawaran` (Manajemen Penawaran Saya):
       - Halaman portofolio tender yang telah diajukan UMKM beserta ringkasan metrik (Total Penawaran, Sedang Dievaluasi, Butuh Revisi, Diterima/Menang).
       - In-page `SearchBar` dan tab status bergaya garis bawah (*underline tabs*: Semua, Diajukan, Butuh Revisi, Diterima, Ditolak).
       - Filter mode alokasi tender dan baris penawaran `px-6 py-5` dengan alert klarifikasi revisi (BR-03), nilai komitmen (integer rupiah), lead time, dan `StatusBadge`.
    4. `/umkm/profil` (Profil & Portofolio UMKM):
       - Layout 2-kolom kompartemen menyatu (`divide-x divide-[#E5E7EB]`).
       - Kolom kiri: Avatar kotak industrial `h-20 w-20 rounded-[4px] bg-[#EFF4FE] border border-[#2862E0]/20`, status badge `StatusBadge`, progress bar kelengkapan profil `rounded-[2px]`, daftar sertifikasi & rekening dengan status chip persegi.
       - Kolom kanan: Seksi Tentang Usaha, Kapabilitas Jahit, Aset Mesin, Portofolio Foto, dan Ulasan dengan kompartemen bergaris 1px.
       - Seluruh modal & slide-over (`showCapabilityPanel`, `showMachineModal`, `showPortfolioModal`, `showCertModal`, `showFacilityModal`) menggunakan overlay `bg-black/50` tanpa `backdrop-blur`, kontainer `rounded-[4px]`, kontrol input `rounded-[4px] border-[#8B93A1]`, tombol `rounded-[4px] bg-[#2862E0]`.
       - `DocumentUploadSection` & `OrganizationProfileForm`: Bebas dari wrapper `rounded-xl shadow-sm`, kontrol input dengan kontras 3.1:1, status dokumen memakai `StatusBadge`.
    5. `/umkm/readiness` (Industrial Readiness Score & Gap Analysis):
       - Kontainer kompartemen putih tanpa bayangan dengan `PageHeader` resmi "Skor Kesiapan Industri".
       - Bilah segmen 4-tier geometris industrial dengan sudut persegi `rounded-[2px]`.
       - Seksi "3 Langkah Tercepat Naik Tier" memakai padding baris `px-6 py-5` dan nomor langkah kotak `rounded-[2px]`.
       - Seksi "Rincian Skor" accordion 6 pilar A-F memakai padding baris `px-6 py-5`, bilah progres tipis `rounded-[2px]`, dan status dokumen memakai `StatusBadge`.
    6. `/umkm/rfq/[id]` (Detail Spesifikasi Tender & Q&A):
       - Header breadcrumb & info ringkasan RFQ dalam kompartemen bergaris 1px dengan `StatusBadge` status tender.
       - Strip 4-kolom fakta kunci (total pesanan, target kirim, sampel pra-produksi, batas Q&A).
       - Navigasi tab underline aktif 2px `#2862E0` tanpa bentuk pil.
       - Baris daftar tanya jawab publik (Q&A) dan addendum bernomor resmi dengan padding baris `px-6 py-5`.
       - Panel samping rekam jejak pembeli dan aktivitas RFQ dengan `StatusBadge` verifikasi 100% escrow.
       - State "Akses Terbatas" (visibilitas undangan R-06) diselaraskan ke panel kompartemen putih.
  - **Verifikasi & Tangkapan Layar (Screenshots)**:
    - E2E Playwright `tests/e2e/umkm-redesign.spec.ts` (4 tests) & `tests/e2e/umkm-navigation-features.spec.ts` (3 tests) lulus 100%.
    - 12 tangkapan layar tersimpan di direktori artefak pada resolusi Desktop (1280px) dan Mobile (390px):
      - `umkm-dashboard-1280.png` & `umkm-dashboard-390.png`
      - `umkm-rfq-search-1280.png` & `umkm-rfq-search-390.png`
      - `umkm-penawaran-1280.png` & `umkm-penawaran-390.png`
      - `umkm-profil-1280.png` & `umkm-profil-390.png`
      - `umkm-readiness-1280.png` & `umkm-readiness-390.png`
      - `umkm-rfq-detail-1280.png` & `umkm-rfq-detail-390.png`
    - Seluruh assertions verifikasi terpenuhi:
      - 0 elemen rounded-full struktural (> 16px).
      - Bebas horizontal scroll (`scrollWidth <= clientWidth` di 1280px & 390px).
      - Kontras WCAG terpenuhi.
      - Tepat 1 item menu sidebar aktif per halaman.
    - Seluruh test regresi Playwright yang ada tetap lulus 100%:
      - `tests/e2e/readiness.spec.ts` (5 tests passing)
      - `tests/e2e/capabilities.spec.ts` (5 tests passing)
      - `tests/e2e/rfq.spec.ts` (5 tests passing)
      - `tests/e2e/auth.spec.ts` (passing)
    - Unit test Vitest: 77 tests lulus 100% (13 test files termasuk `navigation.test.ts`).
    - Typecheck (`tsc --noEmit`): 0 error.
    - Lint (`eslint` & `prettier --check`): Bersih tanpa error.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Redesain Visual R2 (PBI-107) | `feat/redesign-ui(PBI-107)` | Seluruh halaman UMKM (/umkm, /umkm/profil, /umkm/readiness, /umkm/rfq/[id]), StatusBadge, SearchBar, DocumentUploadSection, OrganizationProfileForm, e2e umkm-redesign & regression tests | Selesai & terverifikasi (Berikutnya: R3 antarmuka admin /admin & antrean verifikasi) | src/app/(umkm)/*, src/components/ui/*, src/components/domain/*, tests/e2e/umkm-redesign.spec.ts, docs/design/DESIGN_SYSTEM.md, docs/HANDOFF.md |

## Selesai (terbaru di atas)
- Redesain R2: Implementasi kompartemen bergaris 1px, `PageHeader`, `SearchBar` in-page, dan `StatusBadge` tanpa stroke pada seluruh halaman UMKM (`/umkm`, `/umkm/profil`, `/umkm/readiness`, `/umkm/rfq/[id]`).
- Penyusunan komponen `SearchBar` dan `StatusBadge` ke dalam sistem desain resmi (`src/components/ui` dan `docs/design/DESIGN_SYSTEM.md`).
- Pengujian visual otomatis Playwright e2e 1280px dan 390px (8 screenshot tersimpan di direktori artefak).
- Verifikasi 0 elemen rounded-full, 0 horizontal scroll, dan kelulusan 100% tes regresi (capabilities, readiness, rfq, auth, dan 77 unit tests).
- Redesain Sistem Visual R1 (PBI-107): Token, komponen dasar, shell layout desktop & mobile, beranda 2-kolom, auth.

## Berikutnya (1-3 langkah konkret)
1. Redesain R3: Terapkan sistem desain ke antarmuka Admin (`/admin`, antrean verifikasi organisasi dan dokumen).
2. Terapkan komponen baru ke RFQ Wizard 10 Langkah Industri (`/industri/rfq/baru`).
3. Verifikasi e2e Playwright untuk portal Industri dan Admin.

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
