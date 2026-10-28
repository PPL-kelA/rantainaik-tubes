---
description: Akhiri sesi dengan serah terima agar agen atau akun lain bisa lanjut tanpa penjelasan ulang
---
Akhiri sesi ini dengan serah terima.

1. Jalankan lint, typecheck, dan test. Catat hasilnya.
2. Commit pekerjaan. Bila belum lulus, commit ke branch `wip/<id>-<slug>` dengan pesan `wip: ...`. Jangan push atau merge ke `main`.
3. Perbarui `docs/HANDOFF.md`: Status ringkas, Sedang dikerjakan (sudah, tersisa, file yang disentuh), Selesai (tambah baris bertanggal di atas), Berikutnya (1-3 langkah konkret dengan ID Jira atau FR), Blocker dan pertanyaan, Catatan teknis. Isi "Terakhir diperbarui" dengan tanggal dan alat/akun.
4. Bila ada keputusan baru, tambahkan ke `docs/DECISIONS.md`.
5. Commit pembaruan dokumen dengan pesan `docs: handoff <tanggal>`.
6. Tampilkan: ringkasan 5 baris, nama branch, dan satu kalimat prompt untuk membuka sesi berikutnya.

$ARGUMENTS
