<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

### 7.5 Evaluasi, sampel, dan pemilihan pemenang

#### 7.5.1 Perbandingan penawaran
Tampilan perbandingan memuat per penawaran: total harga, lead time vs target, kapasitas dialokasikan, tingkat kesesuaian dan daftar deviasi, Readiness Score dan tier, rating, status sampel.

**Skor evaluasi otomatis** (bobot default, dapat diatur pembeli per RFQ, total 100):
| Kriteria | Bobot | Cara hitung |
|---|---|---|
| Harga | 35 | `harga_terendah / harga_penawaran × bobot` |
| Kesesuaian spesifikasi dan mutu | 25 | Dari tingkat kesesuaian matriks, dan dari penilaian sampel bila ada |
| Jadwal | 20 | Penuh jika tanggal kirim terpenuhi, berkurang proporsional jika terlambat, nol jika terlambat lebih dari 30 hari |
| Reputasi | 20 | Gabungan Readiness Score dan rating |

Pembeli tetap bebas memilih pemenang di luar urutan skor, dan alasan dapat dicatat.

**Mode LOT:**
- Perbandingan dilakukan **per lot**: harga, lead time, kapasitas, dan kesesuaian dihitung terhadap qty lot. Tampilan **papan alokasi** (baris = lot, kolom = penawaran) memperlihatkan skor tiap penawaran pada tiap lot.
- Sistem memberi **saran alokasi**: kombinasi pemenang dengan skor total tertinggi yang memenuhi `maks_lot_per_umkm`. Pembeli dapat mengubahnya.
- **Indikator konsistensi** ditampilkan berdampingan (selisih harga satuan antar pemenang, sumber bahan yang dinyatakan, deviasi pada matriks kesesuaian) agar risiko ketidakseragaman terlihat sebelum memilih.

#### 7.5.2 Alur sampel (opsional per RFQ)
1. Pembeli **shortlist** 1-3 penawaran dan menekan "Minta sampel" (atau sampel sudah diwajibkan pada RFQ).
2. UMKM mengirim sampel dan mencatat pengiriman (resi, tanggal).
3. Pembeli menerima dan **menilai sampel** (skala 1-5): kesesuaian bahan, jahitan dan konstruksi, ukuran (toleransi dimensi), finishing dan dekorasi. Keputusan: **Setujui** atau **Tolak** dengan catatan.
4. Hanya penawaran dengan sampel disetujui yang dapat dimenangkan jika RFQ mewajibkan sampel.
5. Biaya sampel mengikuti kesepakatan di RFQ dan penawaran (ditanggung pembeli, UMKM, atau dikreditkan ke order).
6. **Mode LOT:** semua UMKM yang di-shortlist pada suatu lot menilai sampelnya terhadap **standar acuan bersama** yang sama. Hanya UMKM dengan sampel disetujui yang dapat memenangkan lot (bila sampel diwajibkan).

#### 7.5.3 Revisi dan pemenang
- **Satu putaran revisi** (harga, jadwal, atau deviasi spesifikasi) per penawaran, lewat fitur "Minta revisi".
- **Pilih pemenang** dengan konfirmasi dan alasan opsional. Penawaran lain otomatis `REJECTED` dengan ringkasan umpan balik (skor dan alasan jika diisi) agar UMKM belajar.
- **Mode TUNGGAL:** satu pemenang dipilih, terbentuk satu order.
- **Mode LOT (split award):** pembeli memilih **satu pemenang per lot** (dan opsional satu `BACKUP` per lot) lewat papan alokasi. Penawaran yang kalah di semua lotnya menjadi `REJECTED` dengan umpan balik. Hasilnya **order induk + sub-order per lot** (7.9).
- **Lot belum terisi:** pembeli memilih salah satu: (a) membuka kembali lot dengan memperpanjang tenggat lewat addendum, (b) menggabungkan qty ke lot lain (addendum + konfirmasi pemenang lot tersebut), (c) menawarkan ke runner-up atau UMKM yang menyatakan bersedia lot tambahan, atau (d) lanjut parsial (RFQ `AWARDED_PARTIAL`, sisa qty dapat dibuat menjadi RFQ baru).
- **Setelah pemenang dipilih:** order menunggu pendanaan escrow (batas waktu nilai awal 3×24 jam). Jika tidak didanai, order `CANCELLED` dan backup dapat diaktifkan (7.12.2).
