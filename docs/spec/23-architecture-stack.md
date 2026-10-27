<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

## 11. Arsitektur dan tech stack Fase 1

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Frontend | **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui** | Responsif, gaya minimalis |
| Backend | **Next.js Route Handlers / Server Actions** | Monolit modular |
| ORM | **Prisma** | |
| Database | **PostgreSQL** | Full-text search bawaan untuk matching kata kunci |
| Auth | **Auth.js (NextAuth) + RBAC** | INDUSTRY, UMKM, ADMIN |
| Validasi | **Zod** | |
| File storage | Cloudinary / Supabase Storage / S3 | Tech pack, foto, dokumen |
| Email | Resend / Nodemailer | |
| PDF | `@react-pdf/renderer` atau pdfkit | PO dan laporan |
| Pembayaran / escrow | Ledger internal di PostgreSQL (*append-only*) di balik antarmuka `EscrowProvider` | Simulasi di Fase 1. Adapter mitra berizin atau sandbox payment gateway menyusul |
| Job terjadwal | Vercel Cron / node-cron | Kedaluwarsa RFQ, pengingat dokumen, tenggat revisi, batas pendanaan, konfirmasi dan rilis otomatis, deteksi UMKM tidak aktif |
| Testing | Vitest/Jest, Playwright | Fokus scoring, matching, alur RFQ-penawaran-order |
| Deploy | Vercel + Postgres terkelola, atau Docker | |

**Struktur modul:** `auth`, `organizations`, `capabilities`, `readiness`, `rfq` (item, lot, tanya jawab, addendum), `matching`, `quotations` (penawaran, kesesuaian), `sampling`, `orders` (order induk dan sub-order, milestone, QC, rework), `escrow` (ledger, aturan rilis, komisi, refund), `disputes`, `payouts`, `reviews`, `notifications`, `admin`.

**Desain siap Fase 2:** matching di balik antarmuka `MatchingProvider.rankCandidates(rfq)`, hasil matching dan keputusan akhir dicatat di `match_event`, spesifikasi RFQ dan deskripsi kapabilitas disimpan sebagai teks terstruktur siap di-*embed*, foto QC dan sampel disimpan terorganisir (bahan latih deteksi cacat).

**Desain escrow:** `EscrowProvider` menyediakan operasi `fund`, `hold`, `release`, dan `refund`. Aturan rilis (milestone dan QC) berada di lapisan layanan yang memanggil provider, sehingga implementasi simulasi dapat diganti adapter mitra berizin tanpa mengubah aturan bisnis.

---
