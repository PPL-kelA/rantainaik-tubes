<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

# PROJECT_CONTEXT: RantaiNaik, Platform Pengadaan Tekstil untuk UMKM Konveksi

> **Nama kerja:** RantaiNaik (placeholder, silakan ganti)
> **Tagline:** Menghubungkan kebutuhan pengadaan tekstil industri (seragam, merchandise, maklon) dengan UMKM konveksi yang siap, dengan pembayaran yang terlindungi, dan menunjukkan jalan bagi UMKM yang belum siap.
> **Mata kuliah:** Proyek Perangkat Lunak (PPL), tugas besar sistem informasi berbasis web
> **Tema SDG:** SDG 9, Industry, Innovation and Infrastructure (fokus target 9.3 dan 9.2)
> **Versi:** v3 (27 Oktober 2026), v2 (revisi dosen) + **revisi model bisnis broker**: split award per lot, pembayaran escrow, dan pola interaksi ala Upwork
> **Fase pengembangan saat ini:** **Fase 1 = core business saja (tanpa ML/AI).** ML/AI dijadwalkan di Fase 2 (lihat bagian 13).
> **Dokumen pasangan:** `PROMPT_FIGMA.md` (prompt desain UI v2). **Perlu disesuaikan dengan v3:** wizard 10 langkah, papan alokasi lot, halaman pendanaan escrow dan sengketa.

---

## 0. Cara memakai dokumen ini

Dokumen ini adalah sumber konteks utama proyek. Jika dipakai sebagai konteks untuk asisten AI atau anggota tim baru:

- Anggap bagian 4 (ruang lingkup) dan bagian 7 (logika inti) sebagai **sumber kebenaran**. Perubahan keputusan harus diperbarui di sini.
- **Fase 1 tidak memakai ML/AI.** Matching dan Readiness Score di Fase 1 dihitung dengan aturan (rule-based) yang transparan.
- Nilai bobot, ambang batas, dan angka lain adalah **nilai awal yang dapat dikonfigurasi**, bukan hasil riset. Semuanya perlu divalidasi lewat wawancara dan uji coba.
- Angka statistik di bagian 2 berasal dari sumber di bagian 19 dengan tahun yang berbeda-beda. Periksa ulang ke sumber resmi sebelum dipakai di laporan akhir.
- **Model bisnis v3 = broker (ala Upwork):** platform memegang kendali alur dana lewat escrow, memediasi sengketa, dan memperoleh komisi. Aturan dana ada di **7.12**, aturan pembagian pesanan (lot) di **7.3.3**.
- Nilai komisi, jendela waktu, dan persentase kompensasi adalah **nilai awal yang dapat dikonfigurasi** (`platform_config`), belum divalidasi.

### Ringkasan perubahan dari v1 (revisi dosen)

| Aspek | v1 | v2 |
|---|---|---|
| Sektor UMKM | Umum (semua kategori produk) | **Satu sektor: tekstil dan konveksi** (seragam, merchandise, maklon) |
| Taksonomi dan atribut | Kategori generik, sertifikasi halal/SNI/PIRT | Atribut khusus tekstil: jenis produk, bahan, gramasi, dekorasi (bordir/sablon), mesin, ukuran, sampel |
| RFQ | Satu form umum | **RFQ berbasis item**: spesifikasi bahan, desain/tech pack, rincian ukuran (size breakdown), dekorasi, sampel, termin, template per jenis kebutuhan, addendum, tanya jawab |
| Penawaran | Harga, lead time, MOQ, catatan | **Penawaran per item** + biaya tambahan + **matriks kesesuaian spesifikasi** + jadwal vs target + sampel + masa berlaku |
| Proses setelah penawaran | Shortlist, revisi, pemenang | Shortlist, **alur sampel** (permintaan, pengiriman, penilaian), satu putaran revisi, pemenang |
| Order dan QC | QC lolos atau gagal | Milestone produksi, QC per ukuran dan jenis cacat, **rework** |
| Readiness Score | Enam komponen generik | Enam komponen yang **diterjemahkan ke konteks konveksi** (mesin, penjahit, tech pack, sampel, uji kain) |
| Desain UI | Dashboard dengan sidebar, banyak elemen visual | **Minimalis, bergaya marketplace jasa (mirip Upwork/Fiverr)**: navigasi atas, daftar dan kartu bersih, mudah dibaca |
| Sektor lain | Termasuk lingkup | Ditunda ke Fase 3 |

### Ringkasan perubahan dari v2 (revisi model bisnis broker)

| Aspek | v2 | v3 |
|---|---|---|
| Peran platform | Mempertemukan dan menstandarkan proses, pembayaran di luar platform | **Broker**: pertemuan, proses, **pengendali dana (escrow)**, mediator sengketa, pencatat reputasi. Pendapatan dari komisi |
| Pembagian pesanan | Satu pemenang per RFQ, split award berstatus Could | **Split award per lot**: industri membagi satu RFQ menjadi 2-4 lot dengan standar acuan yang sama, pemenang dipilih per lot |
| Pembayaran | Di luar platform (BR-09), platform hanya mencatat | **Escrow**: dana didanai penuh di awal, dirilis per milestone dan QC, refund bila bermasalah, **sengketa** diputus admin. Fase 1 berupa simulasi ledger di balik `EscrowProvider` |
| Pola interaksi | RFQ ke penawaran | **Ala Upwork**: UMKM menawar banyak RFQ sekaligus (dengan peringatan kapasitas terpakai), industri dapat mencari dan mengundang UMKM, kontrak terikat per order |
| Order | Satu order per penawaran | Order tunggal, atau **order induk + sub-order per lot**, dengan status dana terpisah |
| Aturan bisnis | BR-01 s.d. BR-12 | BR-09 diganti, BR-08 dan BR-10 diperluas, **BR-13 s.d. BR-18** ditambah |
| Milestone produksi | Should | **Must** (menjadi pemicu rilis dana) |

---
