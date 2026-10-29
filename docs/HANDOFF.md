# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-10-29, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/t4-master-data-config
**Fase / sprint:** Fase 1 (core business), Sprint 2 (Master Data & Konfigurasi Platform - Tahap 4 / PBI-90)

## Status ringkas
- Tahap 4 (Master Data Tekstil dan Konfigurasi Platform - PBI-90) selesai 100%:
  - Model Prisma baru: `ProductCategory` (hierarki self-relation 2-tingkat), `ProductionService`, `Certification`, `ScoringConfig`, `RecommendationRule`, dan `PlatformConfig` tersinkron ke Neon DB via `prisma db push` dengan struktur ringkas tanpa blob besar.
  - Seeding lengkap taksonomi tekstil (`prisma/seed.ts`): 5 kategori induk + 20 subkategori tekstil (spec 7.2), 8 layanan produksi konveksi multi-pilih, 4 master sertifikasi/lab, 5 aturan rekomendasi gap analysis, serta nilai default bobot Readiness, Matching, dan parameter platform.
  - Reader bertipe `loadPlatformConfig()` dan `loadScoringConfig()` dengan validasi Zod dan fallback default spec: menghilangkan seluruh angka bisnis hard-coded (komisi 5%, batas lot 2-4, qty min lot 20 pcs, deadline escrow 72 jam, auto-confirm 48 jam & 5 hari kerja, denda pembatalan 2%, matriks kompensasi pembatalan spec 7.12.4).
  - UI Admin P23.2 (`AdminConfigPanel.tsx` di `/admin#konfigurasi`): 6 tab interaktif (Bobot Readiness dengan validasi total 100 real-time, Bobot Matching, Parameter Platform, Aturan Rekomendasi, Kategori & Layanan, Uji/Sertifikasi).
  - Setiap perubahan konfigurasi dan penambahan master data dilindungi modal konfirmasi dan dicatat secara append-only di `audit_log`.
  - Seluruh 35 unit test Vitest dan 18 test Playwright E2E hijau 100%. Linter, formatting prettier, dan TypeScript typecheck lulus tanpa error.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Master Data & Konfigurasi Platform (Tahap 4 - PBI-90) | `feat/t4-master-data-config` | Schema DB, seed data tekstil, rules & schema validasi Zod, repo & service reader/mutasi, audit_log integration, UI Admin P23.2, unit tests (bobot total 100 & params), Playwright E2E tests | Selesai & terverifikasi | prisma/*, src/modules/admin/*, src/app/(admin)/*, src/components/domain/*, tests/e2e/* |

## Selesai (terbaru di atas)
- Implementasi panel UI Admin P23.2 (`AdminConfigPanel.tsx`) dengan validasi real-time total bobot 100, tombol pulihkan default, modal konfirmasi aksi, dan form penambahan master data.
- Reader bertipe `loadPlatformConfig()` dan `loadScoringConfig()` yang membaca parameter dinamis dari database tanpa hardcoding angka bisnis.
- Aturan bisnis & pure function validasi bobot (`validateReadinessWeights`, `validateMatchingWeights`, `validatePlatformParams`) dengan unit test Vitest (35/35 passing).
- Sinkronisasi model database kategori hierarkis 2-tingkat, layanan produksi, sertifikasi, rules rekomendasi, dan config ke Neon database.
- Seeding master data taksonomi tekstil dari spec 7.2.
- Pengujian E2E Playwright (`config.spec.ts`) mencakup navigasi 6 tab, validasi total 100, modal konfirmasi penyimpanan, parameter platform, dan master data taksonomi (18/18 total e2e tests passing).

## Berikutnya (1-3 langkah konkret)
1. Tahap 5: Kapabilitas UMKM & Kalkulasi Readiness Score (FR-10, FR-11, FR-12, FR-13, FR-14, spec 7.7) menggunakan bobot dinamis dari `ScoringConfig` dan aturan gap analysis dari `RecommendationRule`.
2. RFQ Wizard 10 Langkah untuk Industri (FR-19, spec 7.3.1, 7.3.2) dengan pemilihan kategori 2-tingkat dan layanan produksi dari master data.
3. Split Award Mode LOT (FR-38, spec 7.3.3) dengan batas validasi jumlah lot dan qty lot dari `PlatformConfig`.

## Blocker dan pertanyaan terbuka
- Tidak ada blocker.

## Catatan teknis penting
- Akun uji coba lokal (password default: `Password123`):
  - Admin: `admin@rantainaik.id`
  - Industri: `industri@nusantara.id`
  - UMKM (Verified): `umkm@karyamandiri.id`
  - UMKM (Pending): `umkm.pending@sinar.id`
- Testing:
  - Unit test: `pnpm run test`
  - E2E test: `pnpm run test:e2e` (Playwright)
  - Lint & Typecheck: `pnpm run lint` & `pnpm run typecheck`
- Helper konfigurasi bertipe:
  - `loadPlatformConfig()`: mengembalikan `PlatformParams` (komisi, lot, batas waktu, denda) dan `compensationMatrix`.
  - `loadScoringConfig()`: mengembalikan bobot `readiness` dan `matching`.
- UI Admin Anchor:
  - `/admin#verifikasi` (Antrean berkas NIB/legalitas P23.1)
  - `/admin#konfigurasi` (Master Data & Konfigurasi Platform P23.2)
