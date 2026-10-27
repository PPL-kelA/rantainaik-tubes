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

## Belum diputuskan (dari spec bagian 17)
- Besaran komisi final, penanggung biaya mitra pembayaran
- Apakah escrow simulasi cukup untuk dosen
- Batas jumlah lot, qty minimum lot, jendela waktu final
- Matriks kompensasi pembatalan final
- Apakah pembeli korporasi menerima pendanaan penuh di muka atau perlu termin
