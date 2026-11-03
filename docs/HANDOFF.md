# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-11-03, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/redesign-ui(PBI-107)
**Fase / sprint:** Sprint 2 (Visual Redesign R2: Halaman UMKM & Fitur di Dalamnya - PBI-107)

## Status ringkas
- Redesain Sistem Visual R2 (Halaman UMKM & Kelompok INDUSTRI Selesai 100%):
  - **Arah Visual & Layout Kompartemen Bergaris (Seamless 1px Hairline #E5E7EB)**:
    - Latar putih murni `#FFFFFF` di seluruh antarmuka Industri dan UMKM, tanpa kartu mengambang (`shadow-*`), tanpa latar abu-abu/gradien, dan tanpa celah renggang (*gap*) antar-kompartemen.
    - Tiap halaman menerapkan `PageHeader` resmi di kompartemen paling atas.
    - Halaman daftar/feed memakai `SearchBar` tepat di bawah header (bebas kolom pencarian di navbar).
    - Baris daftar/feed memiliki padding simetris 24px kiri-kanan dan 20px atas-bawah (`px-6 py-5`).
    - Seluruh badge status menggunakan `StatusBadge` berlatar warna solid lembut tanpa stroke (`border-0`), persegi industrial `rounded-[2px]`.
    - Eliminasi total bentuk pil/kapsul (`rounded-full` > 16px) di seluruh antarmuka (avatar kotak 4px, chip tag 2px, bilah 4-tier bergaris 2px, nomor langkah kotak 2px, tab underline 2px).
  - **Penyempurnaan Navigasi & Sidebar Kelompok Industri**:
    - Seluruh anchor hash (`/industri#rfq`, `/industri#mitra`, `/industri#order`) diubah menjadi rute fisik riil (`/industri/rfq`, `/industri/mitra`, `/industri/order`).
    - Ditambahkan rute evaluasi tender: `/industri/penawaran`.
    - Logika `isActive` single-active terverifikasi: **tepat hanya 1 item menu yang aktif/ter-highlight** saat membuka rute industri mana pun.
  - **Kelompok Halaman Industri yang Ditransformasi & Ditambahkan**:
    1. `/industri` (Dashboard Pengadaan):
       - Header kompartemen resmi `PageHeader`, in-page `SearchBar`, stat strip instrumen 4-kolom (*RFQ Aktif*, *Total Item Dipesan*, *Order Berjalan*, *Dana Escrow Diamankan*).
       - Grid 2-kolom kompartemen: Kolom kiri "Daftar RFQ Saya (P12)" dengan underline tabs (Aktif, Draft, Selesai) dan feed baris `px-6 py-5`; Kolom kanan Ringkasan Rekening Escrow Terpadu (Tahap 1 Bahan 30%, Tahap 2 QC 70%).
    2. `/industri/rfq` (Katalog RFQ Saya):
       - Tampilan katalog lengkap RFQ yang dibuat industri dengan pengelompokan status berbasis underline tabs (*Semua*, *Aktif/Buka*, *Tahap Evaluasi*, *Draft*, *Sampling Prototipe*, *Selesai/Teraward*).
       - In-page `SearchBar`, feed katalog baris `px-6 py-5` dengan tag alokasi persegi `rounded-[2px]`, metrik item & kuantitas, lokasi gudang pengiriman, dan tombol "Buka Detail & Kontrol".
    3. `/industri/rfq/[id]` (Detail Tampilan RFQ Industri & Kontrol Edit):
       - Banner Mode Pratinjau Pengadaan: Menampilkan spesifikasi tender dari perspektif mitra UMKM.
       - Kontrol tender interaktif: Tombol "Edit Form RFQ" (untuk status DRAFT) dan tombol "Terbitkan Addendum (R-04)" dengan modal bernomor resmi (untuk status OPEN).
       - Strip 4-kolom fakta kunci, navigasi underline tabs (Spesifikasi Teknis, Penawaran Masuk, Tanya Jawab Publik, Addendum Resmi).
       - Formulir interaktif bagi industri untuk menjawab pertanyaan klarifikasi UMKM secara publik (Q-04).
    4. `/industri/penawaran` (Evaluasi Penawaran Masuk):
       - Papan komparasi penawaran tender antar-UMKM (berbeda dari tata letak penawaran pribadi UMKM).
       - Stat strip 4-kolom evaluasi (*Total Penawaran Masuk*, *Perlu Dievaluasi*, *Dalam Klarifikasi BR-03*, *Penawaran Diterima*).
       - In-page `SearchBar` dan dropdown filter per RFQ.
       - Feed komparasi baris `px-6 py-5` memuat profil UMKM (skor & tier readiness), angka finansial vs lead time, alert peringatan Q-06, serta aksi industri: "Terima & Terbitkan PO", "Minta Revisi 1x (BR-03)", atau "Tolak".
    5. `/industri/mitra` (Cari UMKM / Direktori Scouting):
       - Kompartemen Search & Filter Terintegrasi (in-search compartment filter): Input search baris atas, baris kontrol filter terpadu di bawahnya (kategori produk, tier kesiapan industri, kapasitas bulanan, checkbox verifikasi NIB & mesin khusus).
       - Feed direktori UMKM konveksi baris `px-6 py-5` dengan tag kapabilitas jahit, aset mesin, kapasitas bulanan, dan modal "Undang ke RFQ Saya" (`RfqInvitation`).
    6. `/industri/order` (Manajemen Order & Rekening Escrow):
       - Sesuai logic business Spec 15-16: Simulasi escrow didanai 100% di awal (`FUNDED`), pelacakan milestone 2-tahap (Tahap 1: 30% Bahan Tiba, Tahap 2: 70% Lolos QC dipotong 5% komisi platform BR-17).
       - Strip 4-kolom metrik escrow, underline tabs status order, baris order `px-6 py-5` dengan tombol aksi simulasi pendanaan dan konfirmasi QC.
    7. `/industri/profil` (Profil & Legalitas Perusahaan):
       - Redesain dari formulir terpisah menjadi kompartemen 1px 2-kolom menyatu (`divide-x divide-[#E5E7EB]`).
       - Kolom kiri: Status kepatuhan hukum, ringkasan kontak PIC pengadaan, alamat gudang tekstil; Kolom kanan: Formulir `OrganizationProfileForm` dan `DocumentUploadSection` kompartemen.
  - **Verifikasi & Tangkapan Layar (Screenshots)**:
    - E2E Playwright `tests/e2e/industri-redesign.spec.ts` (8 tests) lulus 100%.
    - E2E Playwright `tests/e2e/umkm-navigation-features.spec.ts` (3 tests), `tests/e2e/umkm-redesign.spec.ts` (4 tests), dan `tests/e2e/rfq.spec.ts` (5 tests) tetap lulus 100%.
    - 26 tangkapan layar tersimpan di direktori artefak pada resolusi Desktop (1280px) dan Mobile (390px):
      - Industri: `industri-dashboard`, `industri-rfq-katalog`, `industri-rfq-detail`, `industri-penawaran`, `industri-mitra-scouting`, `industri-order-escrow`, `industri-profil`.
      - UMKM: `umkm-dashboard`, `umkm-rfq-search`, `umkm-penawaran`, `umkm-profil`, `umkm-readiness`, `umkm-rfq-detail`.
    - Seluruh assertions verifikasi terpenuhi:
      - 0 elemen rounded-full struktural (> 16px).
      - Bebas horizontal scroll (`scrollWidth <= clientWidth` di 1280px & 390px).
      - Kontras WCAG terpenuhi.
      - Tepat 1 item menu sidebar aktif per halaman.
    - Unit test Vitest: 77 tests lulus 100% (13 test files).
    - Typecheck (`tsc --noEmit`): 0 error.
    - Lint (`eslint` & `prettier --check`): Bersih tanpa error.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Redesain Visual R2 (PBI-107) | `feat/redesign-ui(PBI-107)` | Seluruh halaman UMKM & Seluruh halaman Industri (/industri, /industri/rfq, /industri/rfq/[id], /industri/penawaran, /industri/mitra, /industri/order, /industri/profil), E2E test industri-redesign, umkm-redesign, rfq regression | Selesai & terverifikasi (Berikutnya: R3 antarmuka admin /admin & antrean verifikasi) | src/app/(industri)/*, src/app/(umkm)/*, src/config/navigation.ts, src/components/ui/*, tests/e2e/*, docs/HANDOFF.md |

## Selesai (terbaru di atas)
- Redesain R2 Industri: Implementasi kompartemen 1px, `PageHeader`, `SearchBar`, `StatusBadge`, katalog RFQ grouping status, detail RFQ dengan kontrol edit/addendum, evaluasi penawaran perbandingan tender, direktori scouting UMKM dengan in-search filter, manajemen order & escrow 2-milestone, profil legalitas 2-kolom menyatu, serta single-active sidebar highlight.
- Redesain R2 UMKM: Implementasi kompartemen bergaris 1px, `PageHeader`, `SearchBar` in-page, pencarian RFQ kapabilitas, manajemen penawaran saya, dan `StatusBadge` tanpa stroke pada seluruh halaman UMKM.
- Pengujian visual otomatis Playwright e2e 1280px dan 390px (26 screenshot tersimpan di direktori artefak).
- Verifikasi 0 elemen rounded-full, 0 horizontal scroll, dan kelulusan 100% tes regresi (rfq, readiness, capabilities, auth, dan 77 unit tests).
- Redesain Sistem Visual R1 (PBI-107): Token, komponen dasar, shell layout desktop & mobile, beranda 2-kolom, auth.

## Berikutnya (1-3 langkah konkret)
1. Redesain R3: Terapkan sistem desain ke antarmuka Admin (`/admin`, antrean verifikasi organisasi dan dokumen, ledger escrow, konfigurasi scoring).
2. Terapkan komponen baru ke RFQ Wizard 10 Langkah Industri (`/industri/rfq/baru`).
3. Verifikasi e2e Playwright untuk portal Admin.

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