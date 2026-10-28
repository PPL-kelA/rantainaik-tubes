# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-10-28, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/t3-profile-docs-verification
**Fase / sprint:** Fase 1 (core business), Sprint 2 (Profil, Dokumen & Verifikasi Admin - Tahap 3)

## Status ringkas
- Tahap 3 (Profil Organisasi, Dokumen, dan Verifikasi Admin) selesai lengkap:
  - Model Prisma `Document` dan `AuditLog` tersinkronisasi ke Neon DB dengan payload ringkas (hemat storage).
  - Profil organisasi (FR-03) dapat diedit untuk UMKM & Industri (`/umkm/profil` & `/industri/profil`) dengan jejak audit otomatis `audit()`.
  - Sistem pengunggahan dokumen legalitas dengan `StorageProvider` (lokal untuk dev), validasi MIME (PDF/PNG/JPG/WebP) dan ukuran maksimal 5MB.
  - Otorisasi dokumen privat: endpoint `/api/documents/[id]/file` dikunci server-side (hanya anggota organisasi pemilik & Admin yang dapat mengakses).
  - Fungsi murni `isMinimumDocsMet()` (spec 7.1) dengan aturan dokumen minimum berbeda antara UMKM (NIB, NPWP, Izin Usaha, Foto Bengkel) dan Industri (NIB/Akta, NPWP, Kontak PIC).
  - Panel kurasi Admin (P23) di `/admin`: pratinjau dokumen, antrean verifikasi, tombol Setujui, Tolak (wajib alasan penolakan dengan chip alasan cepat), dan otomasi kenaikan akun ke `VERIFIED` saat dokumen minimum terpenuhi, serta notifikasi email via adapter.
  - Kelola pengguna: penangguhan (`SUSPENDED`) dan pengaktifan kembali (`VERIFIED`) dengan audit trail.
- Seluruh 25 unit test Vitest dan 13 E2E test Playwright hijau 100%. Linter, prettier, typecheck, dan Next.js build berhasil tanpa error.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Profil, Dokumen & Verifikasi Admin (Tahap 3) | `feat/t3-profile-docs-verification` | Schema Document & AuditLog, StorageProvider, rules isMinimumDocsMet, UI profil & upload dokumen, Panel Admin P23, email adapter, unit & E2E tests | Selesai & terverifikasi | prisma/*, src/modules/documents/*, src/modules/organizations/*, src/modules/audit/*, src/lib/*, src/app/*, tests/e2e/* |

## Selesai (terbaru di atas)
- Implementasi panel kurasi verifikasi dokumen admin P23 (`AdminVerificationQueue.tsx`) dengan modal 2 kolom pratinjau dan persetujuan/penolakan dokumen ber-alasan wajib.
- Implementasi halaman Profil & Legalitas (`/umkm/profil` & `/industri/profil`) dengan form edit (FR-03) dan komponen unggah dokumen (`DocumentUploadSection.tsx`).
- Helper `audit()` global append-only dan `LocalStorageProvider` yang membatasi MIME dan ukuran berkas.
- Route terproteksi file dokumen `/api/documents/[id]/file` dengan pengecekan kepemilikan dan otorisasi Admin.
- Unit test Vitest (25 test) dan Playwright E2E (13 test) mencakup alur edit profil, unggah dokumen, tolak berkas ber-alasan, dan otorisasi akses file.

## Berikutnya (1-3 langkah konkret)
1. Tahap 4: Taksonomi Tekstil & Profil Kapabilitas UMKM (kategori produk 2 tingkat, jenis bahan, mesin konveksi, kapasitas, MOQ, lead time - FR-10, FR-11, FR-12).
2. Perhitungan Readiness Score & Snapshot (skor komponen legalitas, kapasitas, kualitas, reputasi - FR-13, FR-14).
3. Pembuatan RFQ Wizard 10 Langkah untuk Industri (FR-19, mode Tunggal & Split Award per Lot FR-38).

## Blocker dan pertanyaan terbuka
- Tidak ada blocker.

## Catatan teknis penting
- Akun uji coba lokal (password default: `Password123`):
  - Admin: `admin@rantainaik.id`
  - Industri: `industri@nusantara.id`
  - UMKM (Verified): `umkm@karyamandiri.id`
  - UMKM (Pending): `umkm.pending@sinar.id`
- Testing: `pnpm run test` (Vitest unit test) & `pnpm run test:e2e` (Playwright E2E)
- Server-side Guards:
  - `isMinimumDocsMet(orgType, docs)` (aturan verifikasi otomatis dokumen minimum)
  - `requireRole(session.user.role, allowedRoles)` dan `requireVerified(session.user.status)`
  - Route proteksi dokumen: `/api/documents/[id]/file` (RBAC owner + admin)
