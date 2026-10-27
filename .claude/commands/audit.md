---
description: Onboarding sekali untuk repo yang sudah berjalan, cocokkan kode dengan spec
---
Ini audit awal untuk repo yang sudah berisi kode. **Jangan mengubah kode aplikasi.** Kamu hanya mengisi dokumen.

1. Baca `AGENTS.md`, `docs/spec/README.md`, `docs/ARCHITECTURE.md`, dan `docs/DECISIONS.md`.
2. Telusuri repo: `package.json`, struktur `src/`, `prisma/schema.prisma`, migrasi, tes, README, konfigurasi.
3. Isi tabel "Perintah" di `AGENTS.md` dari `package.json` (jangan menebak) dan bagian "Aktual" di `docs/ARCHITECTURE.md`.
4. Bandingkan `prisma/schema.prisma` dengan `docs/spec/22-data-model.md`. Daftar entitas atau field yang kurang, berlebih, atau berbeda nama.
5. Daftar kebutuhan FR yang **sudah ada, setengah jadi, belum ada**, dengan bukti berupa path file.
6. Periksa kesehatan: apakah proyek bisa dijalankan, apakah tes ada dan lulus, apakah ada rahasia yang ter-commit, apakah `.env.example` ada.
7. Tulis hasil ke `docs/HANDOFF.md` (status, selisih, "Berikutnya" berisi 3 langkah paling penting).
8. Commit dokumen dengan pesan `docs: audit awal`.
