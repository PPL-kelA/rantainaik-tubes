# ARCHITECTURE: struktur kode

> Rancangan target. Bagian "Aktual" diisi oleh `/audit` dari repo yang sebenarnya. Bila berbeda, tulis selisihnya, jangan menyembunyikannya.

## Prinsip
Monolit modular di atas Next.js. Logika bisnis berada di `src/modules/*`, bukan di komponen UI atau route handler.

## Struktur target
```
.
├─ AGENTS.md  CLAUDE.md
├─ .claude/commands/        # /audit /start /task /handoff
├─ docs/
│  ├─ HANDOFF.md  DECISIONS.md  ARCHITECTURE.md  HUMAN_GUIDE.md
│  ├─ spec/                 # sumber kebenaran produk, dipecah per topik
│  ├─ design/               # PROMPT_FIGMA.md
│  └─ backlog/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts               # data demo simulasi (20-30 UMKM, 5-8 RFQ, ledger)
├─ src/
│  ├─ app/                  # route Next.js per peran: (public) (umkm) (industri) (admin)
│  ├─ modules/<modul>/      # rules.ts service.ts repo.ts schema.ts *.test.ts
│  ├─ lib/                  # db, auth, storage, email, escrow/provider.ts, matching/provider.ts
│  ├─ components/
│  │  ├─ ui/                # shadcn/ui
│  │  └─ domain/            # RfqRow, ProviderCard, StatusBadge, StatStrip, FilterRail
│  └─ jobs/                 # cron: kedaluwarsa RFQ, batas pendanaan, rilis otomatis
├─ tests/e2e/               # Playwright
└─ .env.example
```

## Lapisan
`route/action` → validasi Zod → `service` → `rules` (murni) + `repo` (Prisma) → PostgreSQL. UI hanya memanggil route/action.

## Antarmuka yang harus ada sejak awal
- `EscrowProvider`: `fund`, `hold`, `release`, `refund` (implementasi Fase 1: ledger internal).
- `MatchingProvider.rankCandidates(rfq)` (implementasi Fase 1: rule-based, Fase 2: semantic).
- `StorageProvider` untuk unggah file.

## State machine (sumber: `docs/spec/`)
RFQ (7.3.7), penawaran (7.4.6), order dan dana (7.9), sengketa (7.12.5). Implementasikan sebagai fungsi transisi murni yang menolak transisi tidak sah, dengan unit test.

## Aktual (diisi setelah inisiasi proyek Tahap 1)
- Package manager: pnpm v12.15.0
- Struktur yang ada:
  - `src/app/` dengan grup rute `(public)`, `(umkm)`, `(industri)`, `(admin)`
  - `src/lib/` (db.ts, utils.ts, utils.test.ts)
  - `src/modules/` (direktori placeholder siap isi)
  - `src/components/ui/` dan `src/components/domain/` (direktori siap komponen)
  - `src/jobs/` (direktori siap cron jobs)
  - `prisma/` (schema.prisma, seed.ts)
  - `tests/e2e/` (Playwright shell.spec.ts)
- Modul yang sudah ada: Struktur dasar folder `src/modules/` (belum ada logika bisnis sesuai batas Tahap 1)
- Selisih terhadap target: Logika domain modul (auth, organizations, rfq, dll.), interface provider (EscrowProvider, MatchingProvider), dan komponen domain akan diimplementasikan pada tahap fitur berikutnya.
