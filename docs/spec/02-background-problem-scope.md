<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

## 2. Latar belakang

### 2.1 Tekstil dan konveksi adalah sektor padat karya yang strategis
- Industri tekstil dan pakaian jadi menyerap lebih dari 3,8 juta tenaga kerja dan mencatat ekspor sekitar USD4,85 miliar pada semester I 2026 (Kemenperin, Agustus 2026).
- Wamenperin menyebut TPT sebagai industri prioritas nasional; kontribusinya sekitar 0,97% PDB dan 5,61% PDB manufaktur (triwulan III-2025), dengan penyerapan sekitar 4 juta pekerja atau ±19,5% tenaga kerja manufaktur (Februari 2026).
- Di tingkat daerah, IKM konveksi dicatat sebagai pemasok kebutuhan pakaian jadi dan seragam industri, tetapi masih terkendala teknologi dan peralatan yang efisien sehingga produktivitas dan daya saingnya lebih rendah dibanding industri skala besar (dokumen Bappeda Kabupaten Bekasi, 2025).

### 2.2 IKM konveksi menghadapi tekanan, kapasitas, dan standar mutu
- Permintaan berfluktuasi. IKM konveksi melaporkan penurunan pesanan sejak Juli 2026 dengan persaingan harga ketat dan margin tipis (Bisnis.com, Agustus 2026), sementara asosiasi konveksi mencatat kenaikan pesanan sekitar 30% sejak April 2026 setelah impor ilegal berkurang (Kontan, Juni 2026). Fluktuasi ini membuat UMKM membutuhkan **aliran pesanan yang lebih stabil dan terprediksi**.
- Tenaga kerja terampil sulit didapat. Pengusaha konveksi skala kecil-menengah kesulitan mencari penjahit yang memenuhi standar kualitas tinggi, dan dukungan permodalan dinilai penting untuk menambah kapasitas (Kontan dan CNBC Indonesia, Januari 2026).
- Skala UMKM membatasi pesanan besar. Studi kasus konfeksi UMKM menyebut tenaga kerja umumnya 7-10 orang, dan pesanan di atas 1.000 potong menjadi kendala (tugas akhir Telkom University).

### 2.3 Bukti bahwa kesiapan, bukan hanya akses, yang menghambat UMKM masuk pengadaan
- Contoh nyata pengadaan seragam di Kabupaten Siak (RRI, April 2026): untuk pengadaan sekitar 24 ribu pasang seragam lewat e-catalog, UMKM penjahit lokal akhirnya mundur karena harga kurang kompetitif dan belum siap secara administrasi, misalnya belum memiliki NIB. Sebaliknya, pengadaan skala kecil (lebih dari 1.000 pasang) dengan mekanisme yang lebih fleksibel dapat melibatkan lebih dari 40 penjahit UMKM.
- Di sisi maklon, memilih mitra didasarkan pada kualitas, harga, waktu produksi, dan kapasitas (UKM Indonesia), dan studi kasus SLA maklon menunjukkan ketepatan produksi berbeda antarmitra (Telkom University). Artinya **informasi kapasitas dan rekam jejak ketepatan waktu** sangat menentukan.

### 2.4 Konteks UMKM dan rantai pasok industri (tetap berlaku dari v1)
- UMKM menyumbang sekitar 57,14% PDB dan menyerap sekitar 96,92% tenaga kerja (data BI Aceh via Antara).
- Kemenkop UKM (2024) menyebut realisasi kemitraan UMKM dengan usaha besar baru sekitar 7% (±4,5 juta dari 64,2 juta UMKM) dengan target RPJMN 11%. Data 2025 Kementerian UMKM mencatat 1.219 UMKM bermitra dengan perusahaan besar dengan nilai transaksi Rp177,1 miliar (metodologi tiap tahun dapat berbeda).
- Keterikatan UMKM dengan industri besar masih sering sebatas tanggung jawab sosial, bukan kontrak bisnis (Menteri UMKM, Februari 2025). Syarat masuk rantai pasok mencakup kemampuan menjaga produksi, kesiapan pembiayaan, dan kemampuan menjaga kualitas jangka panjang (Bisnis.com, 2022).
- Pemerintah daerah mendorong basis data UMKM (jenis produk, kapasitas, kualitas, sertifikasi, lokasi) untuk menghubungkan UMKM dengan pengadaan perusahaan besar (RRI Semarang, Agustus 2026).

### 2.5 Mengapa fokus ke tekstil (argumen tim)
Bagian ini adalah argumen desain, bukan statistik:
1. **Kebutuhan korporasi nyata dan berulang.** Seragam kantor, seragam hospitality, wearpack, dan merchandise dipesan rutin dan dalam jumlah yang dapat dipenuhi UMKM yang tepat.
2. **Maklon brand lokal** membuka hubungan produksi berulang, bukan sekali pesan.
3. **Spesifikasi relatif terstruktur** (jenis produk, bahan, gramasi, ukuran, dekorasi, tech pack), sehingga RFQ, penawaran, dan matching bisa dibakukan.
4. **Kesiapan UMKM terukur.** Kapasitas (mesin, penjahit), mutu (SOP QC, uji kain, sampel), dan rekam jejak (ketepatan waktu, reject) dapat dinilai objektif.
5. **Data demo dan validasi lapangan lebih mudah** karena konveksi tersebar luas dan mudah dijangkau untuk wawancara.

### 2.6 Kaitan dengan SDG 9
| Target | Relevansi |
|---|---|
| **9.3** | Meningkatkan akses UMKM ke pasar dan **integrasi ke rantai nilai** industri |
| **9.2** | Industrialisasi yang inklusif, melibatkan UMKM dalam proses industri |
| 9.4 (pendukung) | Pengadaan lokal memperpendek rantai pasok, meningkatkan efisiensi sumber daya |

---

## 3. Problem statement

### 3.1 Pernyataan masalah
Pembeli korporasi dan brand lokal kesulitan menemukan UMKM konveksi yang sesuai spesifikasi, kapasitas, jadwal, dan standar mutu secara cepat dan terpercaya, sementara UMKM konveksi kesulitan mengetahui kebutuhan pengadaan yang sesuai kemampuannya dan tidak tahu apa yang kurang dari dirinya untuk dapat menjadi pemasok. Akibatnya, kerja sama berjalan sporadis lewat kenalan atau chat yang tidak terstruktur, penawaran sulit dibandingkan, dan tidak terbentuk rekam jejak yang dapat dipakai UMKM untuk naik kelas.

### 3.2 Masalah dari sisi UMKM konveksi
1. Tidak punya informasi terstruktur tentang kebutuhan pengadaan industri yang sesuai kapasitasnya.
2. Tidak tahu standar yang diminta dan seberapa jauh posisinya dari standar tersebut (administrasi, mutu, kapasitas).
3. Kapabilitas (mesin, penjahit, hasil produksi) tidak terdokumentasi sehingga sulit dipercaya pembeli.
4. Spesifikasi permintaan sering tidak lengkap sehingga harga dan jadwal sulit dihitung, dan risiko salah paham tinggi.
5. Tidak punya rekam jejak transaksi yang dapat dibuktikan.
6. Pesanan besar melampaui kapasitas satu UMKM, padahal tidak ada cara terstandar untuk berbagi satu pesanan dengan UMKM lain tanpa merusak keseragaman mutu.
7. Risiko pembayaran: pembeli membatalkan atau menunda bayar setelah bahan dibeli dan produksi berjalan.

### 3.3 Masalah dari sisi pembeli (industri)
1. Mencari dan menyaring konveksi memakan waktu dan tidak terstandar.
2. Sulit memverifikasi kapasitas, kemampuan teknis, dan kredibilitas.
3. Spesifikasi dan penawaran diterima dalam format berbeda-beda (chat, email, spreadsheet) sehingga sulit dibandingkan.
4. Risiko keterlambatan, cacat, dan ketidaksesuaian ukuran setelah pesanan berjalan.
5. Satu UMKM sering tidak sanggup mengerjakan pesanan besar sendirian, sedangkan membaginya ke banyak vendor menyulitkan koordinasi dan keseragaman hasil.
6. Risiko UMKM menghilang atau gagal setelah DP dibayar, tanpa mekanisme pengembalian dana yang jelas.

### 3.4 Rumusan masalah (untuk laporan)
1. Bagaimana merancang sistem informasi yang mempertemukan kebutuhan pengadaan tekstil dengan UMKM konveksi secara terstruktur?
2. Bagaimana merumuskan RFQ dan penawaran yang jelas dan sebanding sehingga spesifikasi, harga, dan jadwal dapat dievaluasi objektif?
3. Bagaimana mengukur dan menampilkan kesiapan UMKM konveksi sebagai pemasok industri secara transparan?
4. Bagaimana memberi arahan perbaikan agar UMKM yang belum siap dapat naik tingkat?
5. Bagaimana mencatat rekam jejak pemenuhan pesanan sebagai dasar kepercayaan transaksi berikutnya?
6. Bagaimana membagi satu pesanan ke beberapa UMKM (split award) dengan tetap menjaga standar dan keseragaman mutu?
7. Bagaimana mengelola pembayaran (escrow) dan sengketa agar dana dapat dilindungi dan dikembalikan bila terjadi masalah?

### 3.5 Tujuan
- Membangun platform web dengan basis data kapabilitas UMKM konveksi, RFQ berbasis item, penawaran terstruktur, sampel, order, QC, dan rating.
- Menyediakan matching berbasis aturan dan Readiness Score yang transparan.
- Menyediakan *gap analysis* yang dapat ditindaklanjuti UMKM.
- Menyediakan pembagian pesanan per lot dengan standar acuan bersama.
- Menyediakan alur pembayaran escrow dengan aturan rilis, refund, dan penanganan sengketa.

---

## 4. Ruang lingkup

### 4.1 Lingkup sektor
| Dalam lingkup Fase 1 | Di luar lingkup Fase 1 |
|---|---|
| **UMKM konveksi/garmen**: potong, jahit (CMT), full package, dan jasa pendukung (bordir, sablon/DTF, finishing, packing, pembuatan pola dan sampel) | UMKM sektor lain (kemasan, furnitur, makanan olahan, dan lainnya), ditunda ke Fase 3 |
| Produk pakaian dan perlengkapan tekstil jadi (seragam, kaos, polo, kemeja, jaket, celana, rompi, topi, tote bag) | Tekstil hulu (pemintalan, pertenunan, finishing kain skala pabrik) |
| Tiga jenis kebutuhan: seragam, merchandise, maklon | Pengadaan pemerintah via e-catalog/LKPP (hanya dicatat sebagai pengembangan lanjutan) |

### 4.2 Fitur dalam lingkup Fase 1
- Registrasi, login, peran, verifikasi akun dan dokumen oleh admin
- Profil UMKM konveksi: kapabilitas, layanan, mesin, tenaga kerja, portofolio, dokumen, sertifikasi/uji
- **Readiness Score (rule-based)** dan **gap analysis**
- **RFQ berbasis item** dengan template per jenis kebutuhan, rincian ukuran, tanya jawab, dan addendum, serta **alokasi per lot (split award)** dengan standar acuan bersama
- **Matching rule-based** dan daftar kandidat
- **Penawaran per item** dengan matriks kesesuaian, biaya tambahan, dan kesesuaian jadwal
- Perbandingan penawaran, shortlist, **alur sampel**, satu putaran revisi, pemilihan pemenang (**per lot** pada RFQ yang dibagi)
- Order (tunggal atau **induk + sub-order per lot**), milestone produksi, pengiriman, QC per ukuran dan jenis cacat (termasuk variasi antar-lot), rework
- Rating dua arah, dashboard ringkas, notifikasi, audit log
- **Pembayaran escrow (simulasi di Fase 1)**: pendanaan, rilis per milestone dan QC, refund, komisi, pembatalan dengan kompensasi, dan **sengketa** dengan keputusan admin
- **Kapasitas terpakai** UMKM dengan peringatan komitmen berlebih, serta pencarian dan undangan UMKM oleh industri (pola ala Upwork)

### 4.3 Di luar lingkup Fase 1
- Semua fitur ML/AI (semantic matching, rekomendasi harga, deteksi cacat dari foto, prediksi pemenuhan order)
- Integrasi nyata dengan bank atau payment gateway berizin (Fase 1 memakai escrow simulasi di balik antarmuka yang dapat diganti, lihat 7.12.7)
- Pembiayaan (supply chain financing) dan asuransi pengiriman
- Integrasi logistik, ERP, atau sistem pemerintah
- Aplikasi mobile native, kontrak digital bertanda tangan elektronik, lelang terbalik

### 4.4 Asumsi
- Pengguna awal berasal dari satu klaster terbatas (misalnya Jabodetabek atau Bandung Raya) untuk uji coba.
- Data demo sebagian bersifat simulasi karena belum ada mitra nyata.
- Escrow Fase 1 **disimulasikan** (saldo dan rilis dicatat di ledger internal tanpa uang sungguhan) untuk mendemonstrasikan alur. Penyimpanan dana sungguhan memerlukan mitra berizin dan kajian hukum.

---
