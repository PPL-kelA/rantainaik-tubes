<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

### 7.4 Penawaran UMKM: struktur, aturan, dan siklus

**Ide utama:** penawaran adalah **jawaban terstruktur atas RFQ**, bukan teks bebas. Setiap persyaratan dijawab, sehingga pembeli dapat membandingkan dan UMKM tidak lupa hal penting.

#### 7.4.1 Alur UMKM sebelum mengirim penawaran
1. Melihat RFQ yang cocok (rekomendasi) atau mencari di daftar RFQ. UMKM boleh mengikuti banyak RFQ sekaligus.
2. Membaca spesifikasi dan **daftar periksa kelayakan** otomatis ("Kapasitas sesuai", "Sertifikasi/uji lengkap", "Dekorasi sesuai", "Jadwal dapat dipenuhi?") dan indikator **kapasitas terpakai** (komitmen dari penawaran aktif dan order berjalan).
3. Mengajukan pertanyaan pada tab Tanya Jawab (jawaban terlihat semua UMKM, penanya anonim).
4. Menyusun penawaran (draft dapat disimpan), lalu mengirim sebelum tenggat.

#### 7.4.2 Isi penawaran
| Bagian | Isi |
|---|---|
| **Header** | RFQ, UMKM, versi, **berlaku hingga** (tanggal), mata uang Rupiah |
| **Per item** | Harga satuan, **bahan yang ditawarkan** (sesuai spesifikasi atau alternatif beserta jenis dan gsm), metode dekorasi yang ditawarkan, subtotal otomatis. Jika bahan disediakan pembeli, harga dihitung sebagai jasa saja |
| **Lot yang ditawar** (hanya RFQ mode LOT) | UMKM memilih satu atau lebih lot (maksimum `maks_lot_per_umkm`). **Harga satuan, lead time, kapasitas, dan tanggal kirim dinyatakan per lot.** UMKM juga menyatakan sumber bahan (kode kain/pemasok) sesuai aturan konsistensi, kesediaan menerima lot tambahan bila ada lot kosong, dan kesediaan harga disamakan (bila kebijakan `HARGA_DISAMAKAN`) |
| **Biaya tambahan** (opsional, per baris) | Nama biaya (pola/grading, setting sablon atau digitizing bordir, label dan packing, ongkir), nominal, satuan (sekali atau per pcs) |
| **Total** | Subtotal item + biaya tambahan otomatis. Pilihan "harga sudah/belum termasuk PPN" |
| **Jadwal dan kapasitas** | MOQ, lead time produksi (hari kerja sejak PO dan persetujuan sampel), kapasitas yang dialokasikan (pcs/minggu), tanggal kirim yang dapat dipenuhi (sistem membandingkan dengan target RFQ: "Memenuhi" atau "Terlambat N hari"), kesediaan kirim bertahap |
| **Komersial** | Termin pembayaran yang diminta (DP dan pelunasan), pihak yang menanggung ongkir, kebijakan perbaikan reject (mis. diganti dalam N hari) |
| **Sampel** | Bersedia kirim sampel (ya/tidak), biaya sampel, waktu pengerjaan sampel, apakah ada *ready sample* |
| **Matriks kesesuaian** | Lihat 7.4.3 |
| **Lampiran** | Portofolio produk sejenis, hasil uji kain, foto lini produksi, referensi pelanggan (opsional) |
| **Catatan dan asumsi** | Teks bebas |

#### 7.4.3 Matriks kesesuaian spesifikasi
Untuk setiap persyaratan RFQ (bahan, gramasi, warna, dekorasi, uji/sertifikasi, jadwal, jumlah dan toleransi, label dan packing, serta **standar acuan lot**: toleransi dimensi, acuan warna, sumber bahan), UMKM memilih salah satu:
- **Sesuai**
- **Alternatif/dengan catatan** (wajib menjelaskan deviasi, mis. "gsm 150 sebagai pengganti 140")
- **Tidak sesuai** (hanya boleh untuk syarat non-wajib, wajib dijelaskan)

Sistem menghitung **tingkat kesesuaian** (persentase "Sesuai") dan menampilkan daftar deviasi di perbandingan. Syarat yang ditandai **wajib** oleh pembeli tidak dapat dijawab "Tidak sesuai" (UMKM harus memilih Sesuai atau Alternatif; jika memang tidak mampu, tidak mengirim penawaran).

#### 7.4.4 Aturan penawaran
| ID | Aturan |
|---|---|
| Q-01 | Hanya UMKM `VERIFIED` yang lolos filter wajib (atau diundang) dapat mengirim penawaran |
| Q-02 | Satu penawaran aktif per RFQ (pada mode LOT, satu penawaran dapat memuat beberapa lot). Revisi membuat **versi baru** dan riwayat versi tersimpan |
| Q-03 | Harga mengikat selama masa "berlaku hingga" |
| Q-04 | Penawaran bersifat rahasia antar-UMKM, pembeli melihat semua |
| Q-05 | Setelah tenggat, penawaran terkunci kecuali pembeli meminta revisi (maksimal satu putaran, tenggat revisi default 2×24 jam) |
| Q-06 | Validasi saat kirim: semua item terisi, total konsisten, MOQ ≤ qty RFQ (qty lot pada mode LOT). Lead time melewati target RFQ memunculkan **peringatan**, bukan penolakan |
| Q-07 | Jika ada Addendum RFQ setelah penawaran dikirim, penawaran ditandai "perlu konfirmasi" dan UMKM diberi kesempatan merevisi |
| Q-08 | UMKM boleh mengirim penawaran ke banyak RFQ pada waktu yang sama. Sistem menghitung **kapasitas terpakai** dari penawaran aktif (kapasitas yang dialokasikan) dan order berjalan, lalu menampilkan **peringatan komitmen berlebih** bila total melebihi kapasitas. Ini peringatan, bukan pemblokiran |
| Q-09 | Pada mode LOT, tiap lot dalam penawaran dievaluasi terpisah. Penawaran dapat dimenangkan sebagian (mis. satu dari dua lot yang ditawar) |
| Q-10 | Menarik penawaran (`WITHDRAWN`) boleh dilakukan sebelum `ACCEPTED`. Mundur setelah `ACCEPTED` diperlakukan sebagai pembatalan sepihak oleh UMKM (7.12.4) dan memengaruhi skor |
| Q-11 | Harga mengikat (Q-03) berlaku per lot. Pada kebijakan `HARGA_DISAMAKAN`, UMKM yang menolak harga yang disamakan melepas lot tanpa penalti |

#### 7.4.5 Contoh penawaran (data demo)
> **Penawaran CV Karya Mandiri Konveksi untuk RFQ-0007** (v1, berlaku hingga 31 Des)
> | Item | Qty | Harga satuan | Bahan | Dekorasi |
> |---|---|---|---|---|
> | Kemeja kerja LP | 200 | Rp118.000 | Katun TC 140 gsm (sesuai) | Bordir dada kiri (sesuai) |
> | Rompi operasional | 100 | Rp96.000 | Drill 250 gsm (alternatif) | Sablon punggung (sesuai) |
>
> Biaya tambahan: digitizing bordir Rp350.000 (sekali), setting sablon Rp200.000 (sekali). Total: Rp23.600.000 + Rp9.600.000 + Rp550.000 = **Rp33.750.000** (belum termasuk PPN).
> Jadwal: lead time 21 hari kerja, kapasitas dialokasikan 150 pcs/minggu, tanggal kirim 9 Januari (**memenuhi** target 15 Januari).
> Sampel: bersedia, 5 hari kerja, biaya sampel dikreditkan ke order.
> Termin (rilis lewat escrow): 30% saat bahan tiba, 70% setelah QC lolos. Kesesuaian: 7 dari 8 persyaratan **Sesuai**, 1 **Alternatif** (gsm rompi).

> **Contoh pada RFQ-0008 (mode LOT):** Konveksi Sinar Jaya menawar **Lot B** saja: 50 pcs × Rp112.000 = **Rp5.600.000**, lead time 14 hari kerja, kapasitas dialokasikan 60 pcs/minggu, kain KTC-140-NVY (sesuai aturan satu sumber), sampel bersedia. Kapasitas terpakai Sinar Jaya bulan ini: 62% sebelum penawaran ini, 80% bila menang.

#### 7.4.6 Siklus penawaran
```
DRAFT → SUBMITTED (v1, v2, ...) → SHORTLISTED
      → [REVISION_REQUESTED → RESUBMITTED]   (maks. 1 putaran)
      → [SAMPLE_REQUESTED → SAMPLE_SUBMITTED → SAMPLE_APPROVED | SAMPLE_REJECTED]
      → ACCEPTED | REJECTED | WITHDRAWN | EXPIRED
```

Pada mode LOT, setiap lot dalam penawaran memiliki status sendiri: `SUBMITTED → SHORTLISTED → WON | BACKUP | REJECTED`. Penawaran berstatus `ACCEPTED` bila minimal satu lotnya menang.
