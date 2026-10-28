<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

### 7.3 RFQ: struktur, aturan, dan siklus

**Ide utama:** RFQ terdiri dari **header + satu atau lebih item + persyaratan + jadwal dan komersial**. Struktur ini membuat penawaran bisa dibandingkan item demi item. Industri memilih mode alokasi **tunggal** (satu pemenang) atau **dibagi per lot** (2-4 pemenang dengan standar yang sama, lihat 7.3.3).

#### 7.3.1 Langkah pembuatan RFQ (wizard)
1. **Pilih jenis kebutuhan** (`SERAGAM`/`MERCHANDISE`/`MAKLON`). Sistem memuat template field yang relevan.
2. **Informasi dasar:** judul, konteks singkat, visibilitas (`TERBUKA` atau `UNDANGAN`).
3. **Item** (satu atau lebih). Lihat 7.3.2.
4. **Alokasi dan standar acuan:** pilih `TUNGGAL` atau `LOT` (2-4 lot). Pada mode LOT, sistem membantu membagi qty (bagi rata atau proporsional ukuran), industri menyesuaikan, lalu menetapkan aturan konsistensi bahan, standar acuan (golden sample, toleransi, acuan warna), batas lot per UMKM, dan kebijakan harga antar lot. Lihat 7.3.3.
5. **Persyaratan:** syarat wajib dan nilai tambah, dokumen legal, pengalaman minimal.
6. **Sampel:** perlu atau tidak, penanggung biaya, jumlah dan tenggat sampel.
7. **Jadwal dan pengiriman:** tenggat tanya jawab, tenggat penawaran, target tanggal kirim, lokasi, pengiriman bertahap.
8. **Komersial dan pembayaran:** termin rilis dana (mis. 30% saat bahan tiba, 70% setelah QC lolos; dana didanai penuh ke escrow di awal, lihat 7.12), klausul denda keterlambatan (opsional), anggaran indikatif (opsional, boleh disembunyikan).
9. **Bobot evaluasi** (default tersedia).
10. **Tinjau dan terbitkan.** Sistem menampilkan estimasi jumlah kandidat yang cocok sejak langkah 3 (per lot pada mode LOT) dan **saran** bila qty masih dapat dipenuhi satu UMKM (lihat 7.3.3).

#### 7.3.2 Field per item
| Kelompok | Field |
|---|---|
| Identitas | Nama item (mis. "Kemeja kerja lengan panjang pria"), kategori/subkategori |
| Bahan | Jenis kain, rentang gramasi (gsm), warna (deskripsi/kode), **bahan disediakan pembeli?** (ya = CMT, tidak = full package) |
| Desain | Lampiran gambar/foto referensi atau **tech pack** (wajib untuk `MAKLON`), catatan konstruksi (kerah, saku, kancing, belahan, dan sebagainya) |
| Dekorasi | Tidak ada / bordir / sablon / DTF, penempatan dan ukuran logo, file logo |
| Jumlah | **Rincian ukuran (size breakdown)**: qty per ukuran (S, M, L, XL, XXL, kustom), total otomatis, toleransi jumlah (mis. ±3%) |
| Label dan packing | Label/hangtag, cara packing (per pcs, per set, **per nama karyawan** untuk seragam) |
| Standar mutu | Toleransi dimensi, acuan AQL (opsional), uji lab kain diminta atau tidak (susut, ketahanan luntur warna) |

#### 7.3.3 Alokasi per lot (split award)

**Ide utama:** satu RFQ dapat dipecah industri menjadi **2-4 lot**. Setiap lot dikerjakan satu UMKM pemenang, sedangkan **spesifikasi dan standar mutu sama untuk semua lot** agar hasil akhir seragam. Contoh: 200 kemeja menjadi 4 lot × 50 pcs.

**Kapan sebaiknya dipakai:** qty melebihi kapasitas satu UMKM, tenggat ketat, atau industri ingin diversifikasi risiko. Bila qty RFQ masih dapat dipenuhi banyak kandidat tunggal, sistem menampilkan **saran** (bukan larangan): "Qty ini bisa dipenuhi satu UMKM. Membagi lot menambah risiko ketidakseragaman dan koordinasi."

| Field | Penjelasan |
|---|---|
| `mode_alokasi` | `TUNGGAL` (default) atau `LOT` |
| Lot (2-4) | Nama (Lot A sampai D), **rincian ukuran per item** (qty per ukuran), qty total lot. Tanggal kirim mengikuti RFQ kecuali ditetapkan lain |
| `maks_lot_per_umkm` | Berapa lot yang boleh dimenangi satu UMKM. Default 1 (diversifikasi), industri boleh menaikkan |
| Aturan konsistensi bahan | `DISEDIAKAN_PEMBELI` (CMT, paling konsisten), `SATU_SUMBER` (pembeli menunjuk pemasok/kode kain/batch yang wajib dipakai semua UMKM), atau `BEBAS_DENGAN_TOLERANSI` (UMKM memilih sumber sendiri dalam toleransi warna dan gsm, sistem menampilkan peringatan risiko variasi antar-lot) |
| Standar acuan bersama | **Golden sample** (sampel fisik milik pembeli atau tech pack yang dikunci), toleransi dimensi, acuan warna (kode atau swatch), AQL yang sama untuk semua lot |
| Kebijakan harga antar lot | `PAY_AS_BID` (default, tiap pemenang memakai harga tawarannya) atau `HARGA_DISAMAKAN` (pembeli menawarkan harga pemenang terendah ke pemenang lain, UMKM boleh menerima atau menolak dalam 2×24 jam, bila menolak lot dialihkan ke backup) |
| Lot backup | Opsional: runner-up per lot disiapkan sebagai pengganti bila pemenang mundur atau gagal |

#### 7.3.4 Aturan RFQ
| ID | Aturan |
|---|---|
| R-01 | Minimal satu item. Tiap item wajib memiliki bahan, jumlah, dan minimal satu lampiran referensi (tech pack wajib untuk maklon) |
| R-02 | Total qty item = jumlah seluruh ukuran pada rincian ukuran. Pada mode LOT, jumlah qty per ukuran di seluruh lot harus sama dengan total item |
| R-03 | Tenggat penawaran minimal N hari setelah terbit (default 3), dan tenggat tanya jawab sebelum tenggat penawaran |
| R-04 | Perubahan material setelah terbit (item, qty, bahan, tenggat, syarat) **hanya lewat Addendum** yang bernomor dan diberitahukan ke semua UMKM terkait. Penawaran yang sudah masuk ditandai "perlu konfirmasi" dan UMKM dapat merevisi sebelum tenggat. Tenggat dapat diperpanjang lewat addendum |
| R-05 | RFQ dapat dibatalkan sebelum pemenang dipilih dengan alasan wajib |
| R-06 | RFQ `UNDANGAN` hanya terlihat oleh UMKM yang diundang. RFQ `TERBUKA` terlihat oleh UMKM yang lolos filter wajib matching |
| R-07 | Anggaran indikatif bersifat informasi dan bukan batas mengikat |
| R-08 | Mode LOT: 2-4 lot (batas dikonfigurasi). Tiap lot memenuhi qty minimum lot (nilai awal 20 pcs) |
| R-09 | Seluruh lot memakai spesifikasi, standar mutu, dan standar acuan yang **sama**. Antar-lot hanya boleh berbeda pada qty dan rincian ukuran (dan tanggal kirim bila ditetapkan) |
| R-10 | Mode LOT mewajibkan aturan konsistensi bahan dan standar acuan terisi |
| R-11 | Addendum yang mengubah spesifikasi berlaku untuk seluruh lot. Addendum yang mengubah qty lot hanya boleh pada lot yang belum memiliki pemenang, atau dengan konfirmasi UMKM pemenang lot tersebut |
| R-12 | Lot tanpa penawaran atau tanpa pemenang dapat dibuka kembali, digabung ke lot lain, atau dilanjutkan secara parsial (lihat 7.5.3) |

#### 7.3.5 Contoh RFQ (data demo)
> **RFQ-0007 Seragam Karyawan Kantor 2027** (jenis: `SERAGAM`, `TERBUKA`)
> - **Item 1:** Kemeja kerja lengan panjang, katun TC ±140 gsm, warna biru navy, bordir logo dada kiri. Rincian ukuran: S 20, M 70, L 70, XL 30, XXL 10 = **200 pcs**. Bahan: ditanggung UMKM (full package).
> - **Item 2:** Rompi operasional, drill ±240 gsm, abu-abu, sablon logo punggung. Rincian ukuran: M 40, L 40, XL 20 = **100 pcs**.
> - Syarat wajib: NIB, uji lab kain (ketahanan luntur warna). Nilai tambah: pengalaman seragam korporasi.
> - Sampel: **ya**, 1 pcs per item, biaya sampel dikreditkan ke order bila menang, tenggat sampel 7 hari sejak diminta.
> - Jadwal: tenggat tanya jawab 18 Nov, tenggat penawaran 25 Nov, target kirim 15 Januari. Pengiriman bertahap: tidak.
> - Termin (dirilis lewat escrow): dana didanai penuh saat order. 30% dirilis saat bahan tiba, 70% dirilis setelah QC lolos.
> - Bobot evaluasi: default.

> **RFQ-0008 Kemeja Seragam Panitia Event** (jenis: `SERAGAM`, `TERBUKA`, alokasi: **`LOT`**)
> - **Item:** Kemeja lengan pendek, katun TC ±140 gsm, biru navy, bordir logo dada kiri. Total **200 pcs** (S 20, M 70, L 70, XL 30, XXL 10).
> - **Pembagian lot (4 × 50 pcs):**
>
>   | Lot | S | M | L | XL | XXL | Total |
>   |---|---|---|---|---|---|---|
>   | A | 5 | 18 | 18 | 7 | 2 | 50 |
>   | B | 5 | 18 | 18 | 7 | 2 | 50 |
>   | C | 5 | 17 | 17 | 8 | 3 | 50 |
>   | D | 5 | 17 | 17 | 8 | 3 | 50 |
>
> - `maks_lot_per_umkm` = 1. Konsistensi bahan: `SATU_SUMBER` (kain katun TC kode contoh KTC-140-NVY dari pemasok yang ditunjuk pembeli). Standar acuan: tech pack terkunci + 1 sampel acuan fisik dari pembeli, toleransi dimensi ±1 cm, AQL 2,5. Kebijakan harga: `PAY_AS_BID`. Lot backup: ya.
> - Jadwal: tenggat penawaran 25 Nov, target kirim semua lot 15 Januari. Sampel: wajib, dinilai terhadap sampel acuan.

#### 7.3.6 Template per jenis kebutuhan
| Jenis | Penekanan template |
|---|---|
| `SERAGAM` | Rincian ukuran per karyawan/divisi, bordir/sablon logo, packing per nama, sampel hampir selalu dianjurkan |
| `MERCHANDISE` | Qty besar dengan ukuran sederhana, warna dan dekorasi menjadi inti, tenggat acara |
| `MAKLON` | Tech pack wajib, pola/grading, bahan disediakan atau full package, estimasi produksi berulang per bulan |

#### 7.3.7 Siklus RFQ
```
DRAFT → OPEN (tanya jawab berjalan) → CLOSED (tenggat lewat) → EVALUATING
      → SAMPLING (opsional) → AWARDED | AWARDED_PARTIAL → ORDERED
            ├→ EXPIRED   (tidak ada penawaran sampai tenggat)
            └→ CANCELLED (dibatalkan pembeli, alasan wajib)
```

Pada mode LOT, `AWARDED` berarti seluruh lot memiliki pemenang, sedangkan `AWARDED_PARTIAL` berarti sebagian lot belum terisi (lihat 7.5.3).
