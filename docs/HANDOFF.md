# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-10-29, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/t7-rfq-item-tunggal
**Fase / sprint:** Fase 1 (core business), Sprint 2 (RFQ Berbasis Item Tunggal - Tahap 7)

## Status ringkas
- Tahap 7 (RFQ Berbasis Item - Mode Tunggal) selesai 100%:
  - Model Prisma baru: `Rfq`, `RfqItem`, `RfqItemSize`, `RfqRequirement`, `RfqQuestion`, `RfqAddendum`, `RfqInvitation` dengan skema efisien tanpa penyimpanan blob berlebih di Neon DB.
  - Pure functions & rules (`src/modules/rfq/rules.ts`):
    - `validateRfq(input)`: memvalidasi aturan R-01 s.d R-07 (minimal satu item, total qty item = jumlah rincian ukuran, tenggat minimal 3 hari di masa depan, anggaran positif, bobot evaluasi total 100%).
    - `transitionRfqStatus(current, target)`: state machine status RFQ murni sesuai Spec 7.3.7 (`DRAFT`, `OPEN`, `CLOSED`, `EVALUATING`, `SAMPLING`, `AWARDED`, `AWARDED_PARTIAL`, `EXPIRED`, `CANCELLED`).
    - Aturan integritas R-04: setelah RFQ diterbitkan (`OPEN`), spesifikasi material tidak dapat diubah langsung, melainkan harus melalui Addendum resmi bernomor urut (`addendumNumber`).
    - Kerahasiaan Q&A (Q-04 / BR-02): pertanyaan diajukan secara anonim antar-UMKM (`Penanya Anonim (Mitra UMKM)`).
  - Backend service, repo, dan server actions aman (`src/modules/rfq/`):
    - `createDraftRfqAction`, `publishRfqAction`, `cancelRfqAction`, `askQuestionAction`, `answerQuestionAction`, `createAddendumAction` dengan validasi Zod dan proteksi RBAC (`INDUSTRY` & `UMKM`).
    - Nomor RFQ otomatis unik format `RFQ-xxxx` (misal demo data `RFQ-0007`).
    - Job stub `checkAndExpireRfqsJob` untuk kedaluwarsa otomatis RFQ yang melewati batas tenggat penawaran tanpa penawaran aktif.
  - Antarmuka Industri & UMKM:
    - Wizard 10 Langkah Pembuatan RFQ Industri (`/industri/rfq/baru` & `RfqWizardClient.tsx`, Figma P13): stepper progress bar, auto size sum, draft save, kalkulator total estimasi, dan template field per jenis kategori (SERAGAM, MERCHANDISE, MAKLON).
    - Detail RFQ sisi UMKM (`/umkm/rfq/[id]` & `RfqDetailClient.tsx`, Figma P7): ringkasan dokumen RFQ, tab Spesifikasi Material & Tabel Ukuran, tab Q&A interaktif (anonim), tab Addendum resmi, dan kartu Rekam Jejak Pembeli.
    - Dashboard Industri P12 (`/industri`): tab RFQ Aktif, Draft, dan Selesai lengkap dengan aksi cepat "+ Buat RFQ Baru".
  - Pengujian lengkap: 72 Vitest unit tests (100% passing) dan 33 Playwright E2E tests (100% passing). Linter, formatting prettier, dan TypeScript typecheck 100% bersih tanpa error.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| RFQ Berbasis Item - Tunggal (Tahap 7) | `feat/t7-rfq-item-tunggal` | Skema DB RFQ terpadu, pure functions validateRfq & transitionRfqStatus (19 unit test), repo/service/actions, Wizard 10 langkah P13, UI Detail UMKM P7, Dashboard P12, Seeder RFQ-0007, 5 skenario Playwright e2e | Selesai & terverifikasi (72 unit tests, 33 E2E tests) | prisma/*, src/modules/rfq/*, src/app/(industri)/*, src/app/(umkm)/*, tests/e2e/rfq.spec.ts, docs/* |

## Selesai (terbaru di atas)
- Implementasi RFQ Wizard 10 Langkah untuk Industri (`/industri/rfq/baru`, Figma P13) dengan template per kategori, validasi auto-sum ukuran, dan simpan draft.
- Antarmuka Detail RFQ UMKM (`/umkm/rfq/[id]`, Figma P7) dengan tab Spesifikasi, Q&A tanya jawab anonim, Addendum resmi, dan kartu Rekam Jejak Pembeli.
- Pure functions `validateRfq` (aturan R-01 s.d R-07) dan `transitionRfqStatus` state machine murni dengan 19 unit test lulus 100%.
- Server actions dan repository RFQ aman berlandaskan RBAC dan Zod validation schema.
- Sinkronisasi skema Prisma model RFQ ke Neon PostgreSQL dan seeder demo data `RFQ-0007` (200 kemeja + 100 rompi = 300 pcs).
- Pengujian Playwright E2E (`rfq.spec.ts`) menguji alur pembuatan RFQ, validasi ukuran, Q&A, dan addendum (33/33 e2e tests passing).

## Berikutnya (1-3 langkah konkret)
1. Tahap 8: Alokasi per lot (Split Award) & Sub-Order (spec 7.3.3, 7.5, FR-20) - mengaktifkan mode LOT (2-4 lot) dengan standar acuan bersama.
2. Tahap 9: Rule-Based Matching Engine (spec 7.6, FR-20) - mencocokkan kapasitas, sertifikasi, lokasi, dan kategori UMKM dengan RFQ.
3. Tahap 10: Penawaran Terstruktur UMKM (FR-21, FR-22, spec 7.4) - pengajuan penawaran rahasia antar-UMKM dengan breakdown HPP & lead time.

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
