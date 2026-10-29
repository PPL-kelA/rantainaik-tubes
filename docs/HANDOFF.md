# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-10-29, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/t5-umkm-capabilities-portfolio
**Fase / sprint:** Fase 1 (core business), Sprint 2 (Kapabilitas UMKM & Portofolio - Tahap 5)

## Status ringkas
- Tahap 5 (Kapabilitas UMKM dan Portofolio) selesai 100%:
  - Model Prisma baru: `Capability`, `MachineAsset`, `PortfolioItem`, dan `OrgCertification` tersinkron ke Neon DB via `prisma db push` dengan skema terindeks ringan tanpa beban storage (tanpa binary blob).
  - Pure functions & rules (`src/modules/capabilities/rules.ts`):
    - `validateCapability(input)`: memastikan kapasitas bulanan dan MOQ non-negatif, MOQ tidak melampaui kapasitas bulanan konveksi, dan lead time $\ge 1$ hari.
    - `profileCompleteness(data)`: menghitung persentase kelengkapan profil UMKM (0-100%) dan memberikan daftar spesifik butir yang belum dilengkapi.
    - `checkExpiringCertificates(certs, thresholdDays = 30)`: mendeteksi dan memberi status `VALID`, `EXPIRING_SOON` ($\le 30$ hari ke depan dengan sisa hari), atau `EXPIRED`.
  - Backend service, repo, dan server actions aman (`src/modules/capabilities/`): terlindungi autentikasi sesi dan RBAC UMKM, serta mencatat jejak mutasi ke `audit_log`.
  - Job terjadwal stub `runCertificateExpiryCheckJob(thresholdDays)` di `src/jobs/certificateExpiryJob.ts` yang mengaudit sertifikat kedaluwarsa secara berkala.
  - UI Profil & Kapabilitas UMKM P4 (`/umkm/profil` & `UmkmProfileClient.tsx`):
    - Kolom kiri (320px sticky): logo usaha 96, nama & lokasi, tier pil, rating ★ 4.8, daftar metrik usaha (tahun berdiri, order selesai, total kapasitas, penjahit/shift), bilah kelengkapan profil dengan checklist rekomendasi belum diisi, daftar status sertifikasi/dokumen berpenanda kedaluwarsa jelas, serta info rekening pencairan.
    - Kolom kanan: kartu *Tentang Usaha*, kartu *Kapabilitas Produk Tekstil* dengan slide-over panel samping *Tambah Kapabilitas*, kartu *Mesin dan Tenaga Kerja* dengan modal *Tambah Mesin*, kartu *Portofolio dan Contoh Produk* (grid 3 kolom foto produk), serta kartu *Ulasan dan Reputasi*.
  - Seluruh 46 unit test Vitest dan 23 Playwright E2E test lulus 100%. Linter, formatting prettier, dan TypeScript typecheck hijau bersih tanpa error.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Kapabilitas UMKM & Portofolio (Tahap 5) | `feat/t5-umkm-capabilities-portfolio` | Schema DB, rules & validasi MOQ, profileCompleteness, checkExpiringCertificates, repo/service/actions, job expiry stub, UI P4 lengkap (2 kolom & slide-over), unit tests, Playwright E2E tests | Selesai & terverifikasi | prisma/*, src/modules/capabilities/*, src/jobs/*, src/app/(umkm)/*, tests/e2e/* |

## Selesai (terbaru di atas)
- Implementasi antarmuka profil UMKM Figma P4 (`UmkmProfileClient.tsx`) dengan slide-over panel samping *Tambah Kapabilitas*, modal *Tambah Mesin*, modal *Tambah Portofolio*, modal *Tambah Sertifikasi*, dan modal *Edit Info Usaha*.
- Pure functions `validateCapability`, `profileCompleteness`, dan `checkExpiringCertificates` dengan unit test Vitest lengkap (10 tests).
- Implementasi scheduled job stub `runCertificateExpiryCheckJob` di `src/jobs/certificateExpiryJob.ts` beserta unit test mock.
- Sinkronisasi model Prisma `Capability`, `MachineAsset`, `PortfolioItem`, dan `OrgCertification` ke database Neon.
- Pengujian E2E Playwright (`capabilities.spec.ts`) mencakup navigasi layout P4, validasi error real-time MOQ > kapasitas, penambahan kapabilitas produk, penambahan mesin, dan penambahan portofolio produk (23/23 total e2e tests passing).

## Berikutnya (1-3 langkah konkret)
1. Tahap 6: Kalkulasi Readiness Score & Snapshot (FR-13, FR-14, spec 7.7) menggunakan formula 6 pilar, tiering (0-39, 40-59, 60-79, 80-100), dan rekomendasi 3 langkah tercepat naik tier (Figma P5).
2. RFQ Wizard 10 Langkah untuk Industri (FR-19, spec 7.3.1, 7.3.2) dengan rincian ukuran, dekorasi, sampel, dan termin.
3. Rule-Based Matching Engine (spec 7.6, FR-20) yang menghitung kesesuaian kategori, kapasitas, bahan, dan lead time UMKM terhadap RFQ.

## Blocker dan pertanyaan terbuka
- Tidak ada blocker.

## Catatan teknis penting
- Akun uji coba lokal (password default: `Password123`):
  - Admin: `admin@rantainaik.id`
  - Industri: `industri@nusantara.id`
  - UMKM (Verified): `umkm@karyamandiri.id`
  - UMKM (Pending): `umkm.pending@sinar.id`
- Testing:
  - Unit test: `pnpm run test` (Vitest, 46 tests passing)
  - E2E test: `pnpm run test:e2e` (Playwright, 23 tests passing)
  - Lint & Typecheck: `pnpm run lint` & `pnpm run typecheck`
- Halaman UI:
  - `/umkm/profil`: Antarmuka profil UMKM, kelengkapan profil, kapabilitas produk, mesin, portofolio, sertifikasi, dan dokumen legalitas.
