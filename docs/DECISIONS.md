# DECISIONS: log keputusan

> Satu entri per keputusan. Tambah di bawah, jangan menghapus entri lama (tandai "Digantikan oleh D-xxx"). Agen wajib mencatat keputusan baru di sini sebelum mengakhiri sesi.

Format: `D-nomor | tanggal | keputusan | alasan | dampak`

| ID | Tanggal | Keputusan | Alasan | Dampak |
|---|---|---|---|---|
| D-001 | 2026-10 | Fokus ke satu sektor UMKM: tekstil/konveksi (seragam, merchandise, maklon) | Saran dosen. Spesifikasi terstruktur, kebutuhan korporasi nyata | Taksonomi, RFQ, dan skor khusus tekstil. Sektor lain ditunda ke Fase 3 |
| D-002 | 2026-10-27 | Model bisnis broker: komisi, escrow, mediasi sengketa | Platform mengendalikan dana agar dapat refund bila bermasalah | Spec 7.12. Escrow Fase 1 berupa simulasi ledger di balik `EscrowProvider` |
| D-003 | 2026-10-27 | Split award per lot (2-4 lot) dengan standar acuan bersama | Pesanan besar melampaui kapasitas satu UMKM | Spec 7.3.3, 7.5. Order induk dan sub-order |
| D-004 | 2026-10 | Fase 1 rule-based, tanpa ML/AI | Fokus core business | `MatchingProvider` agar Fase 2 dapat memakai semantic matching |
| D-005 | 2026-10 | UI minimalis tetapi padat informasi, gaya Upwork/Fiverr, navigasi atas | Banyak teks dan data, keterbacaan | `docs/design/PROMPT_FIGMA.md` v3.1 |
| D-006 | 2026-10 | Stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, Prisma, PostgreSQL, Auth.js, Zod | Satu codebase fullstack, cepat untuk proyek kuliah | Spec bagian 11 |
| D-007 | 2026-10-27 | `AGENTS.md` adalah panduan agen utama, `CLAUDE.md` hanya meng-import-nya | Dua akun/alat AI harus membaca aturan yang sama | Hindari aturan ganda yang tidak sinkron |
| D-008 | 2026-10-27 | Package manager pnpm (v12.15.0) dan versi paket utama: Next.js 16.4.3, React 19.3.0, Prisma 6.19.3, Tailwind 4, Vitest 5.0.5, Playwright 1.64.1 | Performa instalasi efisien pnpm, Prisma 6 stabil untuk migrate/generate, toolchain modern | Skrip dan lockfile berbasis pnpm, CI menggunakan pnpm/action-setup |
| D-009 | 2026-10-28 | Arsitektur Auth.js v5 terpisah (`auth.config.ts` untuk Edge middleware, `auth.ts` untuk server) & dynamic role-based navbar | Isolasi modul Edge dari Node native crypto, menu bar terisolasi sesuai hak akses peran pengguna | Middleware aman & build Next.js 16 bersih, proteksi rute server-side terjamin |
| D-010 | 2026-10-28 | Dokumen verifikasi legalitas, StorageProvider (lokal dev), helper audit() append-only, dan otomatisasi kurasi akun VERIFIED (spec 7.1) | Pengendalian keabsahan mitra UMKM & Industri serta kepatuhan jejak audit dengan konsumsi storage hemat di Neon DB | Model Document & AuditLog di Prisma, fungsi murni isMinimumDocsMet, UI kurasi admin P23, API file route terlindungi RBAC |

## Belum diputuskan (dari spec bagian 17)
- Besaran komisi final, penanggung biaya mitra pembayaran
- Apakah escrow simulasi cukup untuk dosen
- Batas jumlah lot, qty minimum lot, jendela waktu final
- Matriks kompensasi pembatalan final
- Apakah pembeli korporasi menerima pendanaan penuh di muka atau perlu termin
