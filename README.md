# rantainaik
=======
# RantaiNaik

Platform pengadaan tekstil B2B (model broker) yang menghubungkan industri/pembeli dengan UMKM konveksi: RFQ berbasis item (tunggal atau lot), penawaran terstruktur, scoring kesiapan (Readiness Score), dan perlindungan pembayaran escrow berbasis milestone.

---

## Prasyarat Lingkungan

Sebelum menjalankan proyek, pastikan komputer Anda telah terpasang:
- **Node.js**: `v20.x` ke atas (direkomendasikan `v24.x`)
- **pnpm**: `v9.x` atau `v12.x`
- **PostgreSQL**: `v15` / `v16` (bisa lewat PostgreSQL lokal, cloud seperti Supabase/Neon, atau Docker)
- **Git**: `v2.x`

> **Catatan pnpm di macOS**: Jika pnpm belum ada di PATH terminal Anda, jalankan:
> ```bash
> export PATH="$HOME/Library/pnpm:$PATH"
> ```

---

## Cara Menjalankan dari Nol

### 1. Klon Repositori & Masuk ke Direktori
```bash
git clone <url-repo>
cd rantainaik-agent-kit
```

### 2. Instalasi Dependensi
```bash
pnpm install
```

### 3. Siapkan Variabel Lingkungan (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database `DATABASE_URL` jika menggunakan PostgreSQL lokal atau cloud provider.

### 4. Database Setup (Prisma)
Generate Prisma Client:
```bash
pnpm run db:generate
```
*(Opsional jika database sudah aktif)* Jalankan migrasi dan seeding:
```bash
pnpm run db:migrate
pnpm run db:seed
```

### 5. Jalankan Development Server
```bash
pnpm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## Daftar Skrip Tersedia

| Skrip | Deskripsi |
|---|---|
| `pnpm run dev` | Menjalankan server dev Next.js (Turbopack) di port 3000 |
| `pnpm run build` | Melakukan build produksi Next.js |
| `pnpm run start` | Menjalankan build produksi secara lokal |
| `pnpm run lint` | Menjalankan ESLint dan pemeriksaan formatting Prettier |
| `pnpm run lint:fix` | Memperbaiki otomatis error formatting ESLint dan Prettier |
| `pnpm run typecheck` | Menjalankan typecheck TypeScript (`tsc --noEmit`) |
| `pnpm run test` | Menjalankan unit test dengan Vitest |
| `pnpm run test:watch` | Menjalankan Vitest dalam mode watch interaktif |
| `pnpm run test:e2e` | Menjalankan end-to-end (e2e) test dengan Playwright |
| `pnpm run db:generate` | Men-generate Prisma Client |
| `pnpm run db:migrate` | Menjalankan migrasi database Prisma |
| `pnpm run db:seed` | Menjalankan data seeding database |
| `pnpm run db:studio` | Membuka UI Prisma Studio untuk mengelola data |

---

## Struktur Rute & Halaman

- **`/`**: Halaman publik / beranda platform
- **`/umkm`**: Portal dashboard untuk UMKM Konveksi
- **`/industri`**: Portal dashboard untuk Pembeli Industri
- **`/admin`**: Portal dashboard untuk Administrator Platform

---

## Token Desain & UI

Aplikasi menggunakan tema **P0 (Industrial / Upwork-like)**:
- **Latar Halaman**: `#F6F7F9`
- **Kartu Konten**: `#FFFFFF` dengan border tipis `#E5E7EB` (radius 12px)
- **Aksen Utama**: Biru baja `#1D4ED8` (hover `#1E40AF`, tint `#EFF6FF`)
- **Tipografi**: Inter (isi) dan IBM Plex Mono (nomor RFQ/Order)
- **Navigasi Shell**: Header sticky 64px, lebar konten maksimum 1200px.
>>>>>>> develop
