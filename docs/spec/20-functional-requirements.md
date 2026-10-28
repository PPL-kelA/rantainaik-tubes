<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

## 8. Kebutuhan fungsional Fase 1

Prioritas: **M** = Must, **S** = Should, **C** = Could.

**Dampak v3:** FR-38 (split award per lot) dan FR-36 (milestone) naik menjadi **Must**. FR-40 s.d. FR-50 adalah kebutuhan baru untuk escrow, sengketa, kapasitas terpakai, dan direktori UMKM.

### 8.1 Autentikasi dan akun
| ID | Kebutuhan | Prio |
|---|---|---|
| FR-01 | Registrasi dan login dengan peran Industri, UMKM, Admin | M |
| FR-02 | Reset password lewat email | S |
| FR-03 | Pengelolaan profil organisasi | M |
| FR-04 | Pengunggahan dokumen verifikasi | M |

### 8.2 Admin dan master data
| ID | Kebutuhan | Prio |
|---|---|---|
| FR-05 | Antrian verifikasi akun dan dokumen | M |
| FR-06 | Kelola kategori produk tekstil, layanan, dan master sertifikasi/uji | M |
| FR-07 | Kelola konfigurasi bobot skor, aturan rekomendasi, dan **parameter platform** (komisi, batas lot, qty minimum lot, jendela waktu pendanaan dan klaim, matriks kompensasi) | S |
| FR-08 | Kelola pengguna (tangguhkan/aktifkan) | M |
| FR-09 | Laporan ringkas platform | S |
| FR-40 | **Antrian sengketa**: telaah bukti dan keputusan admin (rilis, refund, proporsional, rework dulu) | M |
| FR-41 | Monitoring **ledger escrow** dan laporan komisi | M |

### 8.3 Sisi UMKM
| ID | Kebutuhan | Prio |
|---|---|---|
| FR-10 | Kelola kapabilitas konveksi: produk, layanan, bahan, dekorasi, kapasitas, MOQ, lead time, mesin, tenaga kerja | M |
| FR-11 | Kelola portofolio/katalog produk dengan foto dan spesifikasi | S |
| FR-12 | Kelola sertifikasi/uji dan masa berlaku | M |
| FR-13 | Readiness Score, rincian per komponen, dan tier | M |
| FR-14 | Gap analysis dan "3 langkah tercepat naik tier" | M |
| FR-15 | RFQ rekomendasi dan pencarian/filter RFQ terbuka, dengan daftar periksa kelayakan | M |
| FR-16 | Penawaran per item (harga, biaya tambahan, jadwal, sampel), **per lot pada RFQ mode LOT**, simpan draft, revisi bernomor versi, tarik | M |
| FR-33 | **Matriks kesesuaian spesifikasi** pada penawaran | M |
| FR-17 | Lihat dan perbarui status order milik sendiri | M |
| FR-36 | Milestone produksi dengan foto progres (**pemicu rilis dana**) | M |
| FR-18 | Notifikasi RFQ cocok, status penawaran, dokumen akan kedaluwarsa | S |
| FR-42 | Indikator **kapasitas terpakai** dan peringatan komitmen berlebih saat menawar | S |
| FR-43 | Rekening pencairan, status dana per order, dan riwayat rilis | M |

### 8.4 Sisi industri
| ID | Kebutuhan | Prio |
|---|---|---|
| FR-19 | **RFQ berbasis item** (wizard 10 langkah, rincian ukuran, dekorasi, tech pack, sampel, termin, visibilitas) | M |
| FR-39 | Template RFQ per jenis kebutuhan (seragam, merchandise, maklon) | S |
| FR-20 | Daftar kandidat hasil matching beserta alasan dan skor | M |
| FR-21 | Undang kandidat ke RFQ | S |
| FR-31 | **Tanya jawab RFQ** (UMKM bertanya, pembeli menjawab, terlihat semua) | M |
| FR-35 | **Addendum RFQ** bernomor dengan notifikasi | S |
| FR-22 | Perbandingan penawaran (kesesuaian, jadwal, reputasi) dengan bobot yang dapat diatur, **per lot dengan papan alokasi** pada mode LOT | M |
| FR-23 | Shortlist, minta revisi (1×), pilih pemenang (RFQ tunggal) | M |
| FR-34 | **Alur sampel**: permintaan, pengiriman, penilaian, keputusan | M |
| FR-24 | Pembuatan dan ekspor PDF order/PO | S |
| FR-25 | Catat penerimaan dan QC per ukuran dan jenis cacat (termasuk **variasi antar-lot**) | M |
| FR-37 | Rework dan QC ulang | S |
| FR-26 | Daftar pemasok favorit | C |
| FR-38 | **Alokasi RFQ per lot (2-4 lot)**: standar acuan, aturan konsistensi bahan, batas lot per UMKM, pemilihan pemenang per lot, backup, dan penanganan lot kosong | M |
| FR-44 | **Pendanaan escrow**: membayar 100% nilai order dan memantau status dana | M |
| FR-45 | **Direktori UMKM** yang dapat dicari dan difilter oleh industri | S |

### 8.5 Lintas peran
| ID | Kebutuhan | Prio |
|---|---|---|
| FR-27 | Rating dan ulasan dua arah setelah order selesai | M |
| FR-28 | Dashboard per peran | M |
| FR-29 | Notifikasi in-app dan email | S |
| FR-30 | Audit log perubahan status | S |
| FR-32 | Ekspor data (CSV/PDF) | C |
| FR-46 | **Ledger escrow**: pencatatan dana masuk, rilis otomatis berdasarkan milestone dan QC, refund, dan komisi | M |
| FR-47 | **Sengketa**: membuka, mengunggah bukti, menanggapi, dan menerima keputusan admin | M |
| FR-48 | **Pembatalan order** dengan perhitungan kompensasi sesuai matriks 7.12.4 | M |
| FR-49 | **Reputasi pembeli** (pembatalan sepihak, ketepatan pendanaan, sengketa) | S |
| FR-50 | Integrasi mitra pembayaran berizin atau sandbox payment gateway di balik `EscrowProvider` | C |

---
