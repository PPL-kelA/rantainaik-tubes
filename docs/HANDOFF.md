# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-10-28, oleh: Antigravity (AI Assistant)
**Branch aktif:** feat/auth-rbac
**Fase / sprint:** Fase 1 (core business), Sprint 1 (Autentikasi & RBAC)

## Status ringkas
- Tahap 2 (Autentikasi dan RBAC) selesai lengkap: Skema database (User, Organization, Member), Auth.js v5 credentials, server guards (`requireRole`, `requireVerified`, BR-01), login attempt lockout, reset password.
- Navbar di-limit dinamis per user: tiap role hanya melihat menu yang relevan (Guest: Beranda/Escrow/Cara Kerja; UMKM: Cari RFQ/Penawaran/Order; Industri: RFQ Saya/Cari UMKM/Status Escrow; Admin: Dashboard/Verifikasi Akun/Ledger/Sengketa).
- Fitur verifikasi admin: Admin dapat melihat antrean akun pending dan langsung meng-ACC (Verifikasi) atau menolak/menangguhkan akun.
- Seluruh 12 unit test Vitest dan 9 E2E test Playwright hijau 100%. Next.js build berhasil tanpa error.

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Autentikasi & RBAC (Tahap 2) | `feat/auth-rbac` | Schema, auth service, actions, dynamic navbar, admin ACC verification, E2E & unit tests | Selesai & terverifikasi | prisma/*, src/modules/auth/*, src/app/*, tests/e2e/* |

## Selesai (terbaru di atas)
- Implementasi fitur Admin verifikasi (ACC) akun pending langsung di `/admin` dengan revalidasi state.
- Dynamic Role-based Navbar (`RoleNavLinks.tsx`): membatasi tautan navigasi sesuai peran aktif pengguna.
- Halaman UI kaya data (Upwork/Fiverr style) untuk `/login`, `/register`, `/verifikasi-pending`, `/reset-password`, `/umkm`, `/industri`, dan `/admin`.
- Skema Prisma User, Organization, OrganizationMember dan seed akun lokal 4 peran (Admin, UMKM Verified, UMKM Pending, Industri Verified).

## Berikutnya (1-3 langkah konkret)
1. Tahap 3: Modul Dokumen Legalitas & Verifikasi Dokumen NIB/NPWP oleh Admin (FR-03 s.d. FR-05).
2. Modul Taksonomi Tekstil & Profil Kapabilitas UMKM (mesin, kapasitas, jenis produk).
3. Modul Pembuatan RFQ (mode Tunggal & Split Award per Lot).

## Blocker dan pertanyaan terbuka
- Tidak ada blocker.

## Catatan teknis penting
- Akun uji coba lokal (password default: `Password123`):
  - Admin: `admin@rantainaik.id`
  - Industri: `industri@nusantara.id`
  - UMKM (Verified): `umkm@karyamandiri.id`
  - UMKM (Pending): `umkm.pending@sinar.id`
- Testing: `pnpm run test` (Vitest) & `pnpm run test:e2e` (Playwright)
- Server-side RBAC: `requireRole(session.user.role, allowedRoles)` dan `canPostRfq()` / `canSubmitQuotation()` (BR-01)
