# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-10-29, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/t6-readiness-score-gap-analysis
**Fase / sprint:** Fase 1 (core business), Sprint 2 (Readiness Score & Gap Analysis - Tahap 6)

## Status ringkas
- Tahap 6 (Readiness Score dan Gap Analysis) selesai 100%:
  - Model Prisma baru: `ReadinessSnapshot` (`totalScore`, `tier`, `componentScores`, `calculatedAt`) terindeks ringan dan hemat storage di Neon DB.
  - Pure functions & rules (`src/modules/readiness/rules.ts`):
    - `computeReadiness(input, config)`: menghitung 6 pilar kesiapan A-F (Legalitas 20, Fasilitas 20, Mutu 20, Rekam Jejak 20, Administrasi 10, Finansial 10) dengan pembobotan dinamis dari DB/config.
    - Prinsip penilaian transparan (Spec 7.7): Berkas terverifikasi bernilai 100%, dinyatakan sendiri bernilai 50%, dokumen kedaluwarsa bernilai 0 poin, dan akun baru tanpa riwayat order mendapat nilai awal 50% pada komponen D dengan catatan *"belum ada riwayat, memakai nilai awal 50%"*.
    - Tiering 4 tingkat: 0-39 (Tahap Awal), 40-59 (Berkembang), 60-79 (Siap Kemitraan), 80-100 (Siap Industri).
    - Fixture spesifikasi skor 68/100 (Legalitas 17/20, Kapasitas 15/20, Mutu 12/20, Rekam jejak 10/20, Administrasi 8/10, Finansial 6/10) lulus uji presisi.
    - `recommendNextSteps(gaps, rules)`: gap analysis cerdas untuk 3 langkah tercepat naik tier diurutkan berdasarkan rasio efisiensi `poin / tingkat_kesulitan` (MUDAH: 1, SEDANG: 2, SULIT: 3) sesuai Spec 7.8.
  - Backend service, repo, dan server actions aman (`src/modules/readiness/`):
    - Pembaca data terpadu `getReadinessDashboardData` dan `calculateAndSaveReadiness` otomatis membaca bobot dinamis via `loadScoringConfig` dan mencatat jejak audit ke `audit_log`.
    - Event hook hitung ulang readiness otomatis terpasang pada modul dokumen (`reviewDocumentAction`) dan modul kapabilitas (`saveCapabilityAction`).
  - Antarmuka Readiness Score P5 (`/umkm/readiness` & `ReadinessClient.tsx`):
    - Skor besar (mis. 68/100), pil tier, bilah visual tersegmen 4 tier dengan penanda posisi skor real-time.
    - Kartu *3 Langkah Tercepat Naik Tier* lengkap dengan badge tingkat kesulitan, estimasi tambahan poin, dan tautan aksi "Kerjakan".
    - Accordion 6 komponen skor A-F yang dapat dibuka untuk melihat transparansi penilaian per item, status bukti dokumen, dan rincian skor pilar.
    - Modal dialog panduan *"Cara skor dihitung"* yang merinci formula dan kriteria penilaian.
    - Tombol interaktif *"Hitung Ulang Skor"* untuk memicu rekalkulasi snapshot secara instan.
  - Tautan navigasi Readiness Score tersedia di header navigasi UMKM (`RoleNavLinks.tsx`) dan kartu ringkasan dashboard UMKM (`/umkm`).
  - Pengujian lengkap: 53 Vitest unit tests (100% passing) dan 28 Playwright E2E tests (100% passing). Linter, formatting prettier, dan TypeScript typecheck bersih tanpa error.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Readiness Score & Gap Analysis (Tahap 6) | `feat/t6-readiness-score-gap-analysis` | Skema DB ReadinessSnapshot, pure functions computeReadiness & recommendNextSteps, fixture skor 68, repo/service/actions, event hooks rekalkulasi, UI P5 lengkap (/umkm/readiness), 53 Vitest tests, 28 Playwright E2E tests | Selesai & terverifikasi | prisma/*, src/modules/readiness/*, src/modules/documents/*, src/modules/capabilities/*, src/app/(umkm)/*, tests/e2e/*, docs/* |

## Selesai (terbaru di atas)
- Implementasi antarmuka Readiness Score Figma P5 (`/umkm/readiness`) dengan skor besar, pil tier, bilah progress 4 segmen tier, accordion rincian 6 komponen A-F, kartu rekomendasi 3 langkah tercepat, dan modal transparansi skor.
- Pure functions `computeReadiness` & `recommendNextSteps` lengkap dengan 7 unit tests (fixture skor 68, akun tanpa riwayat, dokumen kedaluwarsa, self-declared vs verified, dynamic config weights, dan rasio efisiensi gap analysis).
- Integrasi event hooks rekalkulasi otomatis skor kesiapan di server actions dokumen dan kapabilitas.
- Sinkronisasi model `ReadinessSnapshot` ke database Neon secara aman dan hemat penyimpanan.
- Pengujian Playwright E2E (`readiness.spec.ts`) mencakup navigasi dashboard, verifikasi ringkasan & 4 tier, interaksi accordion 6 komponen, dialog transparansi formula, dan tombol hitung ulang snapshot (28/28 total e2e tests passing).

## Berikutnya (1-3 langkah konkret)
1. Tahap 7: RFQ Wizard 10 Langkah untuk Industri (FR-19, spec 7.3.1, 7.3.2) dengan spesifikasi item, rincian ukuran, dekorasi, opsi split award (Mode TUNGGAL / LOT 2-4), dan anggaran.
2. Tahap 8: Rule-Based Matching Engine (spec 7.6, FR-20) yang menghitung kesesuaian kategori, kapasitas, bahan, dan lead time UMKM terhadap RFQ.
3. Tahap 9: Penawaran Terstruktur UMKM (FR-21, FR-22, spec 7.4) dengan perlindungan kerahasiaan penawaran antar-UMKM (BR-02).

## Blocker dan pertanyaan terbuka
- Tidak ada blocker.

## Catatan teknis penting
- Akun uji coba lokal (password default: `Password123`):
  - Admin: `admin@rantainaik.id`
  - Industri: `industri@nusantara.id`
  - UMKM (Verified): `umkm@karyamandiri.id`
  - UMKM (Pending): `umkm.pending@sinar.id`
- Testing:
  - Unit test: `pnpm run test` (Vitest, 53 tests passing)
  - E2E test: `pnpm exec playwright test` (Playwright, 28 tests passing)
  - Lint & Typecheck: `pnpm run lint` & `pnpm run typecheck`
- Halaman UI:
  - `/umkm/readiness`: Antarmuka Industrial Readiness Score, bilah 4 tier, accordion 6 komponen, 3 langkah tercepat naik tier, dan modal transparansi perhitungan skor.
