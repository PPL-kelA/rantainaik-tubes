<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

### 7.6 Matching rule-based (Fase 1)

**Tahap A: filter wajib** (gagal berarti tidak menjadi kandidat)
| # | Syarat |
|---|---|
| 1 | Akun UMKM `VERIFIED` |
| 2 | Memiliki kapabilitas pada kategori/subkategori RFQ dan layanan yang dibutuhkan (CMT/full package/dekorasi) |
| 3 | Kapasitas bulanan ≥ kebutuhan bulanan RFQ (jika RFQ mengizinkan pemenuhan sebagian, ≥ 30%). **Mode LOT:** dibandingkan dengan qty lot |
| 4 | MOQ UMKM ≤ qty RFQ (**mode LOT:** ≤ qty lot) |
| 5 | Menguasai dekorasi yang diminta (bordir/sablon/DTF) |
| 6 | Dapat mengerjakan jenis bahan yang diminta (tidak berlaku jika bahan disediakan pembeli) |
| 7 | Memiliki semua sertifikasi/uji wajib RFQ dan masih berlaku pada tanggal kirim |
| 8 | Area layanan mencakup lokasi pengiriman (jika disyaratkan) |

Pada mode LOT, UMKM menjadi kandidat bila lolos untuk **minimal satu lot**, dan daftar kandidat menunjukkan lot yang cocok.

**Tahap B: skor kecocokan (0-100)**
| Komponen | Maks | Aturan awal |
|---|---|---|
| Kategori dan jenis produk | 25 | Subkategori sama = 20, hanya kategori sama = 10; tambah hingga 5 dari kemiripan kata kunci (PostgreSQL full-text search) |
| Kapasitas | 20 | Penuh jika **kapasitas tersedia** (kapasitas bulanan dikurangi komitmen aktif, lihat Q-08) ≥ 1,5× kebutuhan (qty lot pada mode LOT), proporsional di bawahnya |
| Kemampuan bahan dan dekorasi | 15 | Banyaknya kebutuhan bahan dan dekorasi yang dikuasai secara spesifik (bukan sekadar lolos filter) |
| Lead time | 10 | Penuh jika ≤ target, berkurang proporsional jika lebih lama |
| Lokasi | 10 | Satu kota = 10, satu provinsi = 7, satu pulau = 4, lainnya = 2 |
| Readiness Score | 10 | `readiness / 100 × 10` |
| Reputasi | 10 | Rata-rata rating dinormalisasi, belum ada riwayat = nilai netral 5 |

**Urutan:** skor tertinggi dulu. *Tie-break:* Readiness Score, lalu waktu respons rata-rata. Setiap kandidat disertai **alasan kecocokan** yang dapat dibaca.

### 7.7 Industrial Readiness Score (0-100, rule-based)

| Komponen | Bobot | Contoh item penilaian (poin) |
|---|---|---|
| **A. Legalitas dan profil** | 20 | NIB terverifikasi (8), NPWP (4), izin usaha/domisili (4), alamat dan foto bengkel terverifikasi (4) |
| **B. Kapasitas dan fasilitas produksi** | 20 | Kapasitas bulanan per jenis produk terdokumentasi (6), daftar dan jumlah mesin (5), jumlah penjahit/operator dan shift (4), foto/video bengkel (3), order terbesar yang pernah dipenuhi (2) |
| **C. Mutu dan kompetensi** | 20 | SOP/checklist QC inline dan akhir (5), hasil uji lab kain atau sertifikasi relevan (5), portofolio produk sejenis dengan bukti (5), kemampuan membuat pola/tech pack dan sampel (5) |
| **D. Rekam jejak transaksi** | 20 | Tepat waktu (8), tingkat reject (6), rating (6). **Tanpa riwayat: nilai awal 50%** dengan label "belum ada riwayat" |
| **E. Administrasi dan digital** | 10 | Pencatatan produksi/stok (4), respons < 24 jam (3), portofolio/katalog lengkap (3) |
| **F. Finansial dan sumber bahan** | 10 | Kesanggupan modal kerja untuk bahan (4), laporan keuangan sederhana (3), akses pemasok bahan (3) |

**Prinsip penilaian:**
- Item yang **diverifikasi/dibuktikan dokumen** bernilai penuh. Item yang **dinyatakan sendiri** bernilai 50% dari poin item.
- Dokumen kedaluwarsa tidak dihitung dan memicu notifikasi 30 hari sebelum kedaluwarsa.
- Skor dihitung ulang otomatis saat dokumen diverifikasi, profil berubah, order selesai, atau rating masuk.
- Skor selalu ditampilkan **beserta rincian per komponen**.
- **Peristiwa negatif** memengaruhi komponen D: order `FAILED`, mundur atau pembatalan sepihak oleh UMKM setelah `ACCEPTED`, dan sengketa yang diputuskan merugikan UMKM mengurangi poin sesuai `scoring_config`.

**Tier:**
| Skor | Tier | Arti |
|---|---|---|
| 0-39 | Tahap Awal | Perlu melengkapi dasar (legalitas, profil) |
| 40-59 | Berkembang | Sebagian kriteria terpenuhi, dapat ikut RFQ sederhana |
| 60-79 | Siap Kemitraan | Memenuhi mayoritas kriteria industri |
| 80-100 | Siap Industri | Pemasok kuat dan terpercaya |

### 7.8 Gap analysis dan rekomendasi perbaikan
- Sistem membandingkan item yang belum terpenuhi dengan tabel aturan `recommendation_rule` (kondisi, teks, perkiraan tambahan poin, tingkat kesulitan, tautan sumber).
- Keluaran: **"3 langkah tercepat naik tier"** berdasarkan `tambahan_poin / kesulitan`.
- Contoh rekomendasi tekstil: "Unggah SOP QC jahit (+5, mudah)", "Lengkapi NIB (+8, sedang)", "Tambahkan foto dan daftar mesin bengkel (+5, mudah)", "Lakukan uji lab kain untuk bahan utama (+5, sedang)".
- *Gap per RFQ* (Should-have): menunjukkan mengapa UMKM tidak lolos sebuah RFQ ("Belum menguasai bordir", "Kapasitas 800 pcs/bulan, kebutuhan 1.200").
