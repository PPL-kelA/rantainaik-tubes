# AGENTS.md: RantaiNaik

Platform web pengadaan tekstil (model broker) yang menghubungkan industri/pembeli dengan UMKM konveksi: RFQ berbasis item (tunggal atau dibagi per lot), penawaran terstruktur, matching rule-based, Readiness Score, escrow (simulasi), dan sengketa. Proyek PPL bertema SDG 9.
**Fase 1 = core business. Tanpa ML/AI dan tanpa uang sungguhan.**

## Mulai dari sini (wajib, berurutan)
1. Baca `docs/HANDOFF.md`: status terakhir dan tugas berikutnya.
2. Baca `docs/DECISIONS.md`: keputusan yang sudah final.
3. Baca `docs/spec/README.md`, lalu **hanya** file spec yang relevan dengan tugas. Jangan memuat seluruh spec sekaligus.
4. Jalankan `git status`, `git branch --show-current`, `git log -10 --oneline`.

Kamu tidak punya ingatan dari sesi atau akun lain. Semua konteks ada di repo ini.

## Sumber kebenaran
| Hal | Lokasi |
|---|---|
| Aturan bisnis, alur, kebutuhan (FR-xx, BR-xx, R-xx, Q-xx) | `docs/spec/` |
| Skema data (kode) | `prisma/schema.prisma` (harus sejalan dengan `docs/spec/22-data-model.md`) |
| Keputusan arsitektur dan produk | `docs/DECISIONS.md` |
| Status pekerjaan | `docs/HANDOFF.md` |
| Struktur kode aktual | `docs/ARCHITECTURE.md` |
| Desain UI (token, anatomi komponen, prompt per layar) | `docs/design/PROMPT_FIGMA.md` |

Bila spec dan kode bertentangan, spec menang. Bila spec kurang jelas atau saling bertentangan, **berhenti dan tanyakan**. Jangan mengarang aturan bisnis. Setelah diputuskan, catat di `docs/DECISIONS.md`.

## Stack
Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, Prisma + PostgreSQL, Auth.js (RBAC: INDUSTRY, UMKM, ADMIN), Zod, Vitest, Playwright. File: Cloudinary/Supabase/S3. Email: Resend. Job terjadwal: Vercel Cron/node-cron.

## Perintah
| Tujuan | Perintah |
|---|---|
| Dev | `pnpm run dev` |
| Lint | `pnpm run lint` |
| Typecheck | `pnpm run typecheck` |
| Test unit | `pnpm run test` |
| Test e2e | `pnpm run test:e2e` |
| Migrasi DB | `pnpm run db:migrate` |

## Konvensi kode
- Struktur per modul: `src/modules/<modul>/` berisi `rules.ts` (fungsi murni), `service.ts`, `repo.ts` (satu-satunya tempat memakai Prisma), `schema.ts` (Zod), `*.test.ts`. Modul: auth, organizations, capabilities, readiness, rfq, matching, quotations, sampling, orders, escrow, disputes, payouts, reviews, notifications, admin.
- Route handler dan server action tipis: validasi Zod, panggil service, kembalikan hasil. **Tidak ada logika bisnis di komponen UI.**
- Scoring, matching, aturan rilis dana, dan kompensasi pembatalan adalah **fungsi murni dengan unit test wajib**.
- Uang disimpan sebagai **integer rupiah**, tanpa float. Tanggal disimpan UTC, ditampilkan Asia/Jakarta.
- Enum dan status persis seperti di spec (mis. `TUNGGAL | LOT`, `AWAITING_FUNDING`, `FUNDED`). Jangan mengganti nama.
- Bobot, ambang, komisi, dan jendela waktu dibaca dari DB (`scoring_config`, `platform_config`), bukan hard-coded.
- Escrow lewat `EscrowProvider` (Fase 1: simulasi ledger). Matching lewat `MatchingProvider.rankCandidates(rfq)`.
- Ledger escrow append-only dan idempoten (`idempotency_key`). Invarian: dana masuk = dirilis + dikembalikan + komisi + tertahan.
- Setiap perubahan status penting dicatat di `order_status_log` atau `audit_log`.
- Otorisasi dicek di server, bukan hanya di UI.
- Kode dan nama variabel berbahasa Inggris. **Teks UI berbahasa Indonesia.**

## Aturan bisnis yang tidak boleh dilanggar (ringkas)
Rincian dan ID ada di `docs/spec/`.
1. Hanya akun `VERIFIED` yang dapat memposting RFQ atau menawar (BR-01).
2. Penawaran rahasia antar-UMKM (BR-02, Q-04).
3. Perubahan RFQ setelah terbit hanya lewat Addendum (R-04).
4. Total qty item = jumlah rincian ukuran. Mode LOT: jumlah semua lot = total item (R-02). Semua lot memakai spesifikasi dan standar acuan yang sama (R-09).
5. Satu putaran revisi per penawaran (BR-03).
6. Pembayaran hanya lewat escrow: didanai 100% di awal, dirilis oleh sistem atau admin, pembeli tidak dapat menarik dana yang sudah dirilis (BR-09, BR-15). Komisi dipotong dari dana yang dirilis (BR-17).
7. Lead time melewati target dan komitmen kapasitas berlebih adalah **peringatan**, bukan penolakan (Q-06, Q-08).
8. Kegagalan satu sub-order tidak membatalkan sub-order lain (BR-14).
9. Rating hanya setelah order `COMPLETED`, sekali per order (BR-04).
10. Readiness Score: item terverifikasi bernilai penuh, dinyatakan sendiri 50%, tanpa riwayat memakai nilai awal 50% (spec 7.7).

## UI
Ikuti P0 di `docs/design/PROMPT_FIGMA.md`: navigasi atas (bukan sidebar), latar `#F6F7F9`, kartu putih bergaris tipis, aksen biru `#1D4ED8`, font Inter, padat informasi seperti Upwork/Fiverr. Pakai shadcn/ui dan token Tailwind, jangan menulis warna langsung di komponen.

## Cara kerja
- Satu tugas per sesi. Branch `feat/<id>-<slug>` atau `fix/<id>-<slug>`. Jangan commit langsung ke `main`.
- Commit kecil dengan Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`). Commit setiap 20-30 menit sebagai titik simpan.
- Tulis tes untuk aturan bisnis lebih dulu, lalu implementasi.
- Sebelum menyatakan selesai: lint, typecheck, dan test lulus, lalu perbarui `docs/HANDOFF.md`.

## Dilarang
- Meng-commit `.env`, kunci, atau data pribadi.
- Migrasi destruktif (drop kolom/tabel) tanpa bertanya.
- Mengubah spec secara diam-diam. Usulkan perubahan, tunggu keputusan, catat di `DECISIONS.md`.
- Menambah dependensi besar tanpa mencatatnya di `DECISIONS.md`.
- Menambah fitur ML/AI atau integrasi pembayaran sungguhan (Fase 2 dan 3).
- Mengubah file di luar lingkup tugas.

## Definition of done
- [ ] Perilaku sesuai spec dan ID yang disebut pada tugas
- [ ] Unit test untuk aturan bisnis, lint dan typecheck lulus
- [ ] Otorisasi dan validasi input ada
- [ ] UI sesuai P0 dan teks Indonesia
- [ ] `docs/HANDOFF.md` diperbarui, `DECISIONS.md` bila ada keputusan baru

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
