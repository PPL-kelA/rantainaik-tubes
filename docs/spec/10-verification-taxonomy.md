<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

## 7. Logika inti (business logic)

> Semua bobot dan ambang dapat dikonfigurasi admin (`scoring_config`), bukan hard-coded.

### 7.1 Verifikasi
1. Akun baru berstatus `PENDING`.
2. Dokumen diunggah. **UMKM:** NIB, NPWP, izin usaha/domisili usaha, foto bengkel/lokasi produksi. **Industri:** NIB/akta, NPWP, kontak penanggung jawab.
3. Admin memberi status per dokumen: `VERIFIED` atau `REJECTED` (dengan alasan).
4. Akun menjadi `VERIFIED` jika dokumen minimum terpenuhi. Hanya akun terverifikasi yang dapat memposting RFQ atau mengirim penawaran.

### 7.2 Taksonomi dan atribut tekstil

**Jenis kebutuhan RFQ:** `SERAGAM`, `MERCHANDISE`, `MAKLON`.

**Kategori produk (dua tingkat):**
| Kategori | Subkategori contoh |
|---|---|
| Seragam dan workwear | Kemeja kerja, blazer/jas, batik, wearpack/coverall, rompi, seragam hospitality (housekeeping, F&B) |
| Atasan dan kaos | Kaos, polo, hoodie, jaket |
| Bawahan | Celana kerja, celana panjang, rok |
| Aksesori tekstil | Topi, tote bag, apron |
| Layanan pendukung | Bordir, sablon/DTF, pembuatan pola dan sampel, finishing dan packing |

**Layanan produksi (multi-pilih):** potong, jahit CMT, full package (termasuk bahan), bordir, sablon/DTF, pembuatan pola/grading, sampling, finishing dan packing.

**Atribut kapabilitas UMKM (per kategori produk):**
- Kapasitas per bulan (pcs), MOQ per style, lead time standar (hari kerja)
- Jenis bahan yang biasa dikerjakan (katun, drill, TC/tetoron-katun, polyester, rayon, denim, dan lainnya)
- Dekorasi yang dikuasai (bordir, sablon, DTF) dan batas ukuran/warna jika ada
- Jumlah dan jenis mesin (jahit lurus, obras, bordir, mesin lain), jumlah penjahit/operator, jumlah shift
- Kemampuan membuat pola/tech pack dan sampel
- Portofolio (foto produk jadi, jenis klien, order terbesar)
