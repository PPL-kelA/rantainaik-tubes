<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

## 1. Ringkasan produk

**Apa ini:** platform web dua sisi tempat **industri/pembeli** (perusahaan, instansi, hotel, rumah sakit, kontraktor, brand lokal) memposting kebutuhan pengadaan tekstil, dan **UMKM konveksi** menunjukkan kapabilitasnya, menerima rekomendasi kebutuhan yang cocok, mengirim penawaran, dan membangun rekam jejak.

**Peran platform (model broker, ala Upwork):** platform bukan produsen dan bukan pembeli. Platform (1) mempertemukan dan menyaring, (2) menstandarkan proses RFQ, penawaran, sampel, dan order, (3) **memegang kendali dana lewat escrow** sehingga dana dapat dikembalikan bila ada masalah, (4) memediasi sengketa, dan (5) mencatat reputasi dua arah. Pendapatan berasal dari **komisi** atas order yang selesai (lihat 5.1 dan 7.12).

**Tiga jenis kebutuhan yang dilayani di Fase 1:**
1. **Seragam dan pakaian kerja** (seragam kantor, wearpack, seragam hospitality, rompi, dll.)
2. **Merchandise dan produk promosi tekstil** (kaos, polo, jaket, topi, tote bag, dll.)
3. **Maklon/produksi untuk brand lokal** (CMT atau full package, produksi berulang)

**Tiga fungsi inti:**
1. **Supplier Matching + proses pengadaan terstruktur.** RFQ berbasis item, penawaran per item dengan matriks kesesuaian, perbandingan, sampel, dan order.
2. **Industrial Readiness Score.** Skor 0-100 yang menunjukkan kesiapan UMKM menjadi pemasok industri, disertai *gap analysis* dan langkah perbaikan.
3. **Transaksi terlindungi dan pembagian pesanan.** Escrow berbasis milestone, sengketa dengan mediasi admin, dan **split award per lot** agar pesanan besar dapat dibagi ke 2-4 UMKM dengan standar yang sama.

**Nilai tambah dibanding marketplace biasa atau chat:** pengadaan B2B yang terstruktur (spesifikasi jelas, penawaran sebanding, sampel terdokumentasi, rekam jejak pemenuhan pesanan) **dengan pembayaran yang terlindungi**, bukan toko ritel.

---

## 5. Aktor dan *value proposition*

| Aktor | Siapa | Yang mereka dapat |
|---|---|---|
| **Industri (Pembeli)** | Perusahaan/BUMN (seragam kantor, wearpack), hotel/rumah sakit, kontraktor, event/organisasi, **brand lokal** (maklon) | Kandidat UMKM terverifikasi dan terskor, RFQ yang jelas, penawaran sebanding, alur sampel, rekam jejak pemasok, **pembayaran terlindungi escrow**, opsi membagi pesanan ke beberapa UMKM |
| **UMKM Konveksi (Pemasok)** | Konveksi, penjahit terorganisir, jasa bordir/sablon, maklon garmen skala kecil-menengah | Visibilitas ke kebutuhan industri, spesifikasi jelas, Readiness Score, langkah perbaikan, rekam jejak, **kepastian pembayaran (dana sudah di escrow sebelum produksi)**, bisa menawar banyak RFQ dan mengambil porsi (lot) sesuai kapasitas |
| **Admin / Verifikator** | Pengelola platform | Alat verifikasi, master data, moderasi, laporan, **mediasi sengketa dan monitoring dana** |
| *(Fase 3)* Fasilitator | Dinas, asosiasi konveksi, inkubator | Dashboard pendampingan UMKM |

### 5.1 Model bisnis dan peran platform (broker)

**Yang dilakukan platform:**
| Fungsi | Penjelasan |
|---|---|
| Pertemuan | Verifikasi akun, matching, direktori UMKM, RFQ terbuka dan undangan |
| Standarisasi | RFQ berbasis item, penawaran terstruktur, sampel, QC |
| Kendali dana | Escrow: dana tertahan, dirilis per milestone dan QC, dikembalikan bila bermasalah |
| Mediasi | Sengketa diputus admin berdasarkan bukti yang tercatat di platform |
| Reputasi | Rating dua arah, Readiness Score, rekam jejak pembeli |

**Yang bukan peran platform:** memproduksi, menjadi pihak pembeli, mengelola logistik, atau menjamin mutu secara mutlak (platform menyediakan alat dan keputusan berbasis bukti).

**Sumber pendapatan (asumsi awal, belum divalidasi):** komisi persentase dari nilai order yang dirilis (nilai awal 5%, ditanggung UMKM, dikonfigurasi admin). Opsi lanjutan yang belum diputuskan: biaya langganan untuk fitur lanjutan.

**Pola interaksi (ala Upwork):**
| Tahap | Pola | Catatan |
|---|---|---|
| Menemukan peluang | **Banyak-ke-banyak.** UMKM menerima rekomendasi atau mencari RFQ terbuka. Industri menerima kandidat atau mencari dan mengundang UMKM dari direktori | RFQ `UNDANGAN` hanya terlihat oleh yang diundang |
| Penawaran | UMKM boleh menawar banyak RFQ sekaligus | Sistem memperingatkan komitmen kapasitas berlebih (Q-08) |
| Kontrak | **Terikat per order.** Satu industri dengan satu UMKM (RFQ tunggal), atau satu industri dengan 2-4 UMKM (RFQ lot, satu sub-order per UMKM) | Escrow, QC, dan rating per order |
| Setelah kontrak | Komunikasi dan pembayaran tetap di platform | BR-08 dan BR-09 |

**Mengapa tidak 1-ke-1 saja:** model satu RFQ hanya untuk satu UMKM menghilangkan perbandingan harga dan kualitas yang menjadi nilai utama platform. Karena itu persaingan dibuka di tahap penawaran, lalu dikunci per order saat kontrak.

---

## 6. Cara kerja end-to-end

```
[UMKM KONVEKSI]                           [INDUSTRI / PEMBELI]                 [ADMIN]
1. Daftar, lengkapi profil,                1. Daftar, lengkapi profil           Verifikasi akun
   kapabilitas, mesin, dokumen                perusahaan                         dan dokumen
        │                                        │
        ▼                                        ▼
2. Readiness Score + gap analysis          2. Buat RFQ dari template:
        │                                     item, bahan, desain, ukuran,
        │                                     dekorasi, sampel, jadwal, termin
        │                                     + ALOKASI: tunggal ATAU dibagi per
        │                                       lot (2-4) dengan standar acuan
        │                                        │
        │          ┌─────────────────────────────┤
        │          ▼                             ▼
        │   3. Sistem menjalankan matching   RFQ dipublikasikan (Terbuka/Undangan)
        ▼      (per lot jika RFQ dibagi)         Industri juga dapat mencari dan
4. UMKM menerima RFQ yang cocok atau             mengundang UMKM dari direktori
   mencari sendiri, baca spesifikasi,            │
   ajukan pertanyaan  ◄──────────────────►  Pembeli menjawab (terlihat semua UMKM)
        │                                      (perubahan lewat Addendum)
        ▼
5. UMKM menyusun penawaran per item
   (dan per lot yang diambil): harga,
   biaya tambahan, jadwal, matriks
   kesesuaian, sampel. Cek kapasitas terpakai
        │
        ▼                                 6. Pembeli membandingkan penawaran
                                             (per lot jika dibagi): harga,
                                             kesesuaian, jadwal, reputasi
                                             shortlist → minta revisi (1x)
        ▼                                        │
7. (Opsional) Kirim sampel  ◄────────────  Minta sampel terhadap standar acuan
        │                                        │
        └──────────────► Pembeli menilai sampel ─► pilih pemenang (per lot + backup)
                                                 │
8. Order terbentuk (tunggal, atau induk ◄────────┘
   + sub-order per lot)
        │
        ▼
9. Pembeli mendanai ESCROW (100% nilai order) ──► dana tertahan di escrow
        │
        ▼
10. Produksi (milestone + foto) → DP dirilis saat bahan tiba → pengiriman
    → penerimaan + QC pembeli (rework jika perlu) → sisa dana dirilis (dikurangi komisi)
        │
        │   Masalah di tengah jalan (UMKM menghilang, pembatalan, cacat parah)
        │                       ▼
        │          SENGKETA / PEMBATALAN ──► keputusan admin ──► refund / rilis / proporsional
        ▼
11. Order selesai → rating dua arah
        │
        ▼
12. Data performa (tepat waktu, reject, rating, sengketa) memperbarui Readiness Score
    UMKM dan reputasi pembeli → peluang RFQ berikutnya meningkat   (siklus penguatan)
```

**Catatan alur v3:**
- Langkah 2 dan 6-8 berubah pada RFQ mode **LOT**: pemenang dipilih per lot, order menjadi induk dengan sub-order (lihat 7.3.3, 7.5, 7.9).
- Langkah 9-10 adalah alur dana escrow (lihat 7.12). Pengiriman baru dilakukan setelah dana order berstatus `FUNDED`.
- UMKM dapat menawar banyak RFQ sekaligus pada langkah 5, tetapi kontrak (langkah 8) terikat per order.

---
