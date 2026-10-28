# HUMAN_GUIDE: cara kerja bersama AI coding agent (untuk Kal)

File ini untuk **kamu**, bukan untuk agen.

## 1. Prinsip utama
AI coding agent **tidak punya ingatan** antar sesi, apalagi antar akun. Riwayat chat di akun A tidak terbaca di akun B. Karena itu:

> **Repo adalah memori.** Apa pun yang agen perlu tahu harus ada di file yang ikut ke Git. Pindah akun hanya berarti membuka repo yang sama dan menjalankan `/start`.

Tiga file yang membuat ini bekerja: `AGENTS.md` (aturan tetap), `docs/HANDOFF.md` (status hari ini), `docs/DECISIONS.md` (keputusan yang sudah final).

## 2. Setup sekali (sekitar 30 menit)
1. Salin isi starter kit ke **root repo**. Bila repo sudah ada, jangan menimpa file yang sudah ada tanpa membandingkan.
2. Pastikan `docs/spec/` berisi spec yang sudah dipecah (jangan simpan `PROJECT_CONTEXT.md` utuh di root agar agen tidak memuatnya sekaligus).
3. Salin `PROMPT_FIGMA.md` ke `docs/design/`. Bila desain Figma sudah jadi, tambahkan tautan Figma dan screenshot layar kunci ke folder itu.
4. Pastikan `.gitignore` memuat `.env`, `.env.local`, `node_modules`, `.next`. Commit `.env.example`, jangan commit `.env`.
5. Commit: `chore: tambah konteks agen`.
6. Sesi pertama: jalankan `/audit` (hanya mengisi dokumen, tidak mengubah kode). Periksa hasilnya di `HANDOFF.md`.
7. Bagikan repo ke **kedua akun** (clone di mesin yang sama atau mesin berbeda, remote GitHub yang sama).

Bila akun kedua memakai alat selain Claude Code: `AGENTS.md` dibaca banyak agen. Untuk alat yang memakai file nama lain, buat file satu baris yang berisi "Baca `AGENTS.md` dan ikuti aturannya", dan tempel isi `.claude/commands/*.md` sebagai prompt biasa.

## 3. Ritme setiap sesi
| Tahap | Kamu | Hasil |
|---|---|---|
| Mulai | `/start` | Agen membaca repo dan merangkum status. Kamu cek ringkasannya. |
| Kerja | `/task FR-xx ringkasan` | Agen merencanakan, menulis tes, mengimplementasikan. |
| Titik simpan | minta commit tiap 20-30 menit | Pekerjaan aman bila limit tiba-tiba habis. |
| Akhir | `/handoff` | `HANDOFF.md` terbarui, kode ter-commit. |

Jangan menunggu limit habis. Jalankan `/handoff` begitu satu tugas selesai atau kamu merasa sesi sudah panjang.

## 4. Pindah akun saat limit
**Kasus normal (kamu sempat `/handoff`):**
1. Pindah ke akun/jendela kedua, buka repo yang sama.
2. `git pull` bila beda mesin, lalu `/start`.
3. Lanjut dengan `/task` sesuai bagian "Berikutnya".

**Kasus mendadak (limit habis di tengah tugas):**
1. Di terminal biasa (tanpa AI): `git add -A && git commit -m "wip: <tugas>"` di branch `wip/<id>-<slug>`, lalu `git push`.
2. Akun kedua menjalankan `/start`. Perintah itu membaca `git status`, `git log`, dan `git diff`, sehingga agen dapat melihat apa yang setengah jadi.
3. Minta akun kedua: "Lanjutkan pekerjaan di branch wip tadi, periksa dulu apakah diff masuk akal terhadap spec", lalu `/handoff` setelah selesai.

**Aturan keras:** jangan menjalankan dua agen di folder dan branch yang sama pada waktu yang sama. Bila ingin paralel, pakai branch berbeda dan `git worktree` atau clone terpisah.

## 5. Cara menulis tugas yang baik
Agen bekerja baik bila tugasnya kecil, jelas, dan bisa dites. Pakai templat ini:

```
/task <ID Jira> <judul>
Tujuan: <satu kalimat hasil yang terlihat>
Spec: FR-xx, R-xx, Q-xx (lihat docs/spec/<file>)
Kriteria selesai:
- <perilaku 1 yang bisa dicek>
- <perilaku 2>
Di luar lingkup: <apa yang jangan disentuh>
```

Contoh:
```
/task EP3-04 Validasi total ukuran RFQ
Tujuan: RFQ tidak bisa disimpan bila total ukuran tidak sama dengan qty item.
Spec: R-02 (docs/spec/11-rfq.md)
Kriteria selesai:
- fungsi murni validateSizeBreakdown() dengan unit test (cocok, kurang, lebih, mode LOT)
- form wizard langkah 3 menampilkan error "Total ukuran tidak sama dengan jumlah"
Di luar lingkup: langkah alokasi lot
```

Ukuran ideal satu tugas: selesai dalam satu sesi, menyentuh paling banyak sekitar 5 file, ada 3-5 kriteria selesai. Tugas yang lebih besar dipecah dulu (minta agen membuat rencana pemecahan, lalu kamu setujui).

## 6. Urutan membangun
Bangun **irisan vertikal** (satu alur lengkap dari DB sampai UI), bukan semua tabel dulu lalu semua UI.
1. Fondasi: auth, RBAC, profil, dokumen, verifikasi admin (epic yang sudah jalan).
2. Kapabilitas UMKM dan Readiness Score (fungsi murni dulu, UI kemudian).
3. RFQ item dan rincian ukuran, lalu mode LOT, tanya jawab, addendum.
4. Matching rule-based dan daftar kandidat.
5. Penawaran dan matriks kesesuaian, perbandingan, papan alokasi lot.
6. Sampel, pemenang, order induk dan sub-order, milestone.
7. Ledger escrow, rilis dana, pembatalan, sengketa.
8. QC, rework, ulasan, dashboard, notifikasi, pengujian, demo.

Logika yang paling berisiko (aturan rilis dana, kompensasi, invarian ledger, validasi lot, scoring, matching) harus berupa fungsi murni dengan unit test **sebelum** UI-nya dibuat.

Siapkan `prisma/seed.ts` sejak awal agar demo selalu punya data (RFQ-0007, RFQ-0008, UMKM contoh). Data demo ada di `docs/design/PROMPT_FIGMA.md` bagian P0.

## 7. Aturan Git yang dipakai
- `main` selalu bisa dijalankan. Semua pekerjaan lewat branch dan Pull Request, minimal self-review.
- Nama branch: `feat/<id>-<slug>`, `fix/...`, `wip/...`, `docs/...`.
- Pesan commit: `feat(rfq): validasi total ukuran`.
- Satu PR = satu tugas. Cantumkan ID Jira di judul PR.
- Bila beberapa anggota kelompok ikut coding, bagi per modul agar jarang bentrok di file yang sama.

## 8. Menjaga konteks tetap kecil dan akurat
- Spec utuh sekitar 50 ribu token. Jangan menempelkannya ke chat. Agen membaca `docs/spec/README.md`, lalu satu atau dua file saja.
- Bila spec berubah, ubah di `docs/spec/` **dan** catat di `DECISIONS.md`. Jangan hanya mengubah di chat.
- Bila agen menemukan aturan yang kurang jelas, biarkan dia bertanya. Jawaban Kal masuk ke `DECISIONS.md`.
- Tinjau `HANDOFF.md` seminggu sekali. Pangkas catatan lama supaya tetap ringkas.

## 9. Kesalahan umum
| Kesalahan | Akibat | Pencegahan |
|---|---|---|
| Menjelaskan konteks lewat chat, bukan file | Hilang saat pindah akun | Tulis ke `docs/`, commit |
| Tugas terlalu besar ("buat seluruh modul RFQ") | Kode tidak konsisten, sulit ditinjau | Pecah per FR, kriteria selesai jelas |
| Tidak commit sampai akhir | Limit habis, pekerjaan hilang | Commit tiap 20-30 menit |
| Dua agen di satu branch | Konflik dan saling menimpa | Branch atau worktree terpisah |
| Percaya hasil tanpa tes | Bug di aturan bisnis (dana, lot) | Unit test fungsi murni, jalankan test sebelum merge |
| Spec dan kode berbeda diam-diam | Demo berbeda dari laporan | `/audit` berkala, catat di `DECISIONS.md` |
| Menyimpan rahasia di repo | Kebocoran kunci | `.env` di `.gitignore`, hanya `.env.example` |

## 10. Ringkasan satu halaman
`/start` → `/task ...` → commit sering → `/handoff`. Semua yang penting ada di `AGENTS.md`, `docs/HANDOFF.md`, `docs/DECISIONS.md`, dan `docs/spec/`.
