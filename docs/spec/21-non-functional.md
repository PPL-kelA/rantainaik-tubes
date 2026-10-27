<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

## 9. Kebutuhan non-fungsional
| Aspek | Target awal |
|---|---|
| Keamanan | RBAC ketat, password di-*hash*, validasi input, proteksi CSRF/XSS, pembatasan tipe dan ukuran file, akses dokumen hanya untuk pihak berwenang, penawaran rahasia antar-UMKM |
| Privasi | Mengacu UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, kumpulkan data seperlunya (termasuk data rekening pencairan, disimpan terenkripsi) |
| **Integritas dana** | Ledger *append-only*, transaksi idempoten, rekonsiliasi (dana masuk = rilis + refund + komisi + saldo tertahan), setiap pergerakan dana tercatat di audit log, hanya sistem dan admin yang dapat memicu rilis |
| **Kepatuhan** | Escrow nyata hanya lewat mitra berizin, kajian hukum sebelum komersialisasi (7.12.7) |
| Kinerja | Halaman utama < 3 detik, daftar kandidat matching < 2 detik untuk ≤ 1.000 UMKM |
| **Keterbacaan** | Banyak teks: ukuran teks isi ≥ 15px, tinggi baris ≥ 1,6, lebar baris teks ≤ 75 karakter, kontras WCAG AA, hierarki heading jelas |
| Kegunaan | Responsif, bahasa Indonesia, alur utama selesai dalam langkah yang ringkas, skor SUS target ≥ 68 |
| Keterujian | Fungsi scoring dan matching berupa fungsi murni |
| Keterawatan | Konfigurasi bobot di database |
| Kesiapan Fase 2 | Antarmuka matching dapat diganti, log peristiwa matching disimpan sebagai data latih |

---
