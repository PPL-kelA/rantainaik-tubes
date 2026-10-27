<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

### 7.9 Order, produksi, dan QC

**Struktur order:**
- **Mode TUNGGAL:** satu order per penawaran yang diterima.
- **Mode LOT:** satu **order induk** (`order_group`) memayungi RFQ, dan satu **sub-order** per lot yang dimenangi. Setiap sub-order memiliki UMKM, milestone, escrow, QC, dan rating sendiri. Status induk bersifat turunan: `IN_PROGRESS`, `PARTIALLY_COMPLETED`, `PARTIALLY_FAILED`, `COMPLETED`.

**Siklus order (per order atau sub-order):**
```
AWAITING_FUNDING → CONFIRMED (dana masuk escrow) → MATERIAL_READY → IN_PRODUCTION
          → READY_TO_SHIP → SHIPPED → RECEIVED
          → QC_PASSED | QC_PASSED_WITH_NOTES | QC_FAILED
          → [REWORK → RECEIVED (ulang) → QC ulang]
          → COMPLETED   (atau CANCELLED / FAILED dengan alasan)

Status dana (escrow_status, terpisah dari status order):
AWAITING_FUNDING → FUNDED → PARTIALLY_RELEASED → RELEASED
          cabang: DISPUTED → RELEASED | PARTIALLY_REFUNDED | REFUNDED
```

- **Order terbentuk** dari penawaran diterima dengan snapshot item, harga, jadwal, termin, dan syarat. Order baru berstatus `CONFIRMED` setelah dana masuk escrow.
- **Milestone produksi** (**Must**, karena menjadi pemicu rilis dana): bahan tiba (dengan bukti foto bahan dan nota atau gulungan kain), mulai potong, mulai jahit, QC internal, siap kirim. UMKM melampirkan foto progres.
- **Pengiriman:** nomor resi dan tanggal kirim dicatat. Pengiriman bertahap jika diizinkan RFQ.
- **QC penerimaan oleh pembeli:** jumlah diterima per ukuran, jumlah reject **per jenis cacat** (jahitan, ukuran, noda/kain, dekorasi, label/packing, dan pada mode LOT **variasi antar-lot**), hasil (lolos, lolos dengan catatan, gagal), foto bukti.
- **Rework:** jika gagal atau lolos dengan catatan yang perlu perbaikan, UMKM memperbaiki dalam jangka yang disepakati, lalu QC ulang. Dana tahap akhir tetap tertahan sampai QC ulang lolos atau sengketa diputus.
- **Pembayaran** lewat escrow (7.12). Rilis dana mengikuti milestone dan hasil QC, bukan konfirmasi manual kedua pihak.
- **Pengiriman mode LOT:** semua sub-order memakai tanggal batas yang sama. Pembeli menerima dan memeriksa per sub-order. Konsolidasi pengiriman ke satu titik adalah opsi (Could).
- **QC mode LOT:** selain QC per sub-order, pembeli membandingkan hasil terhadap **standar acuan bersama**. Variasi warna atau ukuran yang melewati toleransi dicatat sebagai cacat "variasi antar-lot" pada sub-order yang menyimpang, dan memicu rework di sub-order tersebut saja.
- **Kegagalan satu sub-order:** tidak membatalkan sub-order lain. Pembeli memilih: mengaktifkan backup (sub-order pengganti), membatalkan lot (dana tersisa direfund), atau menerima jumlah parsial.
- Setiap perubahan status tercatat di `order_status_log`.
- Metrik performa dari order: **on-time delivery rate**, **reject rate**, rating, jumlah order selesai, serta kejadian pembatalan dan sengketa, yang mengisi komponen D Readiness Score. Pada mode LOT, metrik dihitung per sub-order.

### 7.10 Aturan bisnis umum
| ID | Aturan |
|---|---|
| BR-01 | Hanya akun `VERIFIED` yang dapat memposting RFQ atau mengirim penawaran |
| BR-02 | Penawaran bersifat rahasia antar-UMKM |
| BR-03 | Satu putaran revisi per penawaran |
| BR-04 | Rating hanya setelah order `COMPLETED`, oleh pihak terlibat, satu kali per order |
| BR-05 | Readiness Score dihitung ulang otomatis pada peristiwa pemicu |
| BR-06 | Dokumen kedaluwarsa tidak dihitung dalam skor |
| BR-07 | Semua perubahan status penting tercatat di audit log |
| BR-08 | Kontak langsung UMKM baru terlihat pembeli setelah penawaran `SHORTLISTED`. Kesepakatan dan pembayaran di luar platform tidak dilindungi escrow dan melanggar ketentuan penggunaan (lihat BR-10) |
| BR-09 | Seluruh pembayaran order dilakukan lewat **escrow platform**. Dana hanya dirilis menurut aturan 7.12 atau keputusan admin. Pembayaran di luar platform tidak diakui sebagai pemenuhan order |
| BR-10 | Admin dapat menangguhkan akun yang melanggar, penangguhan membatalkan RFQ/penawaran terbuka dengan notifikasi. Order yang sedang berjalan ditangani admin, dan dana ditahan sampai ada keputusan |
| BR-11 | Perubahan RFQ setelah terbit hanya lewat Addendum (R-04) |
| BR-12 | Penawaran tidak dapat dikirim setelah tenggat RFQ |
| BR-13 | Industri dapat membagi satu RFQ menjadi 2-4 lot. Spesifikasi dan standar acuan sama untuk semua lot (R-08 s.d. R-12) |
| BR-14 | Pada mode LOT, tiap lot memiliki pemenang dan sub-order sendiri. Dana, QC, dan rating dihitung per sub-order. Kegagalan satu sub-order tidak membatalkan sub-order lain |
| BR-15 | Dana order hanya dirilis oleh sistem menurut aturan rilis (milestone dan QC) atau oleh keputusan admin. Pembeli boleh merilis lebih awal secara sukarela, tetapi tidak dapat menarik kembali dana yang sudah dirilis |
| BR-16 | Pembatalan sepihak setelah order terbentuk mengikuti matriks kompensasi (7.12.4) dan memengaruhi reputasi pihak yang membatalkan |
| BR-17 | Komisi platform dipotong dari dana yang dirilis ke UMKM. Persentase disimpan di `platform_config` |
| BR-18 | UMKM boleh menawar banyak RFQ. Komitmen kapasitas berlebih memunculkan peringatan, tetapi menang melebihi kapasitas tidak membebaskan UMKM dari kewajiban order |

### 7.11 Kasus tepi
- **RFQ tanpa kandidat:** tampilkan saran melonggarkan syarat (kurangi syarat uji, izinkan pemenuhan sebagian, ganti bahan).
- **RFQ kedaluwarsa tanpa penawaran:** status `EXPIRED`, pembeli dapat menggandakan dan membuka kembali.
- **Semua penawaran terlalu tinggi atau tidak sesuai:** pembeli dapat membatalkan, mengubah lewat addendum, atau membuka ulang.
- **Sampel ditolak:** penawaran `SAMPLE_REJECTED`, pembeli dapat meminta sampel dari kandidat lain.
- **Harga atau ketersediaan kain berubah setelah penawaran:** harga mengikat selama masa berlaku, di luar itu perlu penawaran baru.
- **UMKM gagal memenuhi order:** `FAILED` dengan alasan, memengaruhi on-time dan reject rate. Dana yang belum dirilis dikembalikan ke pembeli (7.12.4).
- **Ukuran tidak sesuai size chart:** dicatat sebagai cacat "ukuran" pada QC dan memicu rework.
- **Kirim bertahap:** tetap Could-have, di luar MVP.
- **Lot tidak terisi atau tidak ada penawar pada sebuah lot:** lihat 7.5.3.
- **Pemenang lot mundur sebelum DP dirilis:** sub-order `CANCELLED`, dana direfund penuh, backup diaktifkan bila ada.
- **Variasi warna atau ukuran antar-lot:** dicatat sebagai cacat "variasi antar-lot" dan memicu rework hanya pada lot yang menyimpang dari standar acuan, bukan pada semua lot.
- **Pembeli tidak mendanai tepat waktu:** order `CANCELLED` setelah batas pendanaan, tanpa biaya bagi UMKM. Kejadian ini tercatat pada reputasi pembeli.
- **UMKM menang di banyak RFQ melebihi kapasitas:** peringatan sudah muncul sejak penawaran (Q-08). Jika tetap menang dan tidak sanggup, UMKM dapat meminta pembatalan dengan konsekuensi 7.12.4.
- **Pembeli tidak merespons setelah barang tiba:** konfirmasi dan rilis otomatis setelah jendela waktu (7.12.2), kecuali sengketa dibuka.
