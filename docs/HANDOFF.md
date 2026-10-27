# HANDOFF: status kerja terkini

> File ini adalah **memori bersama** antar sesi dan antar akun. Agen membacanya di awal sesi dan memperbaruinya di akhir sesi (`/handoff`). Tulis ringkas dan konkret.

**Terakhir diperbarui:** 2026-10-27, oleh: Antigravity (AI Assistant)
**Branch aktif:** chore/init-project
**Fase / sprint:** Fase 1 (core business), Sprint 0 (Setup Proyek)

## Status ringkas
- Inisiasi baseline proyek selesai: Next.js (App Router), TypeScript strict, Tailwind v4, Prisma 6 (PostgreSQL), Zod, Auth.js v5 beta, Vitest, Playwright, layout shell 64px max-w 1200px, token desain P0.
- Skrip lint, typecheck, unit test, build, dan e2e test telah lulus secara lokal.
- Spec: `docs/spec/` (v3). Desain: `docs/design/PROMPT_FIGMA.md` (v3.1).

## Sedang dikerjakan
| Tugas (ID Jira / FR) | Branch | Sudah | Tersisa | File yang disentuh |
|---|---|---|---|---|
| Inisiasi Proyek (Tahap 1) | `chore/init-project` | Setup stack, testing, token desain, shell layout, CI workflow, README | Siap review & lanjut ke Sprint 1 | package.json, prisma/*, src/*, tests/*, .github/*, docs/* |

## Selesai (terbaru di atas)
- Inisiasi baseline proyek berjalan dari nol (Next.js 16 + React 19 + Prisma 6 + Vitest + Playwright).
- Token desain P0 diaplikasikan pada shell layout navigasi atas dan halaman placeholder grup rute.
- Setup workflow CI di `.github/workflows/ci.yml`.

## Berikutnya (1-3 langkah konkret)
1. Perbarui `BACKLOG_JIRA.csv` ke v3 sesuai spec v3.
2. Mulai implementasi Sprint 1: Modul Autentikasi dan Registrasi Akun (FR-01 s.d. FR-05).
3. Buat skema Prisma data model untuk model `User`, `Account`, dan `Session`.

## Blocker dan pertanyaan terbuka
- Tidak ada blocker teknis.

## Catatan teknis penting
- Cara menjalankan lokal: `pnpm run dev` (buka http://localhost:3000)
- Testing: `pnpm run test` (Vitest) dan `pnpm run test:e2e` (Playwright)
- Package manager: pnpm v12.15.0 (dapat diakses via PATH `$HOME/Library/pnpm`)
