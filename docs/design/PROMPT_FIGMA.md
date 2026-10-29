# PROMPT_FIGMA: Prompt Desain UI RantaiNaik (v3.1, padat dan rapi gaya Upwork/Fiverr)

> Pasangan dari `PROJECT_CONTEXT.md` **v3** (fokus tekstil/konveksi, model broker, escrow, split award per lot).
> **Arah desain (revisi kepadatan):** rapi dan bersih, tetapi **padat informasi seperti Upwork dan Fiverr**, bukan halaman lengang. Setiap layar terisi kartu, baris daftar yang kaya metadata, chip, avatar, foto, rating, dan panel samping. Industrial yang tenang, mudah dibaca. Yang dipinjam hanya struktur dan kepadatannya, bukan warna, logo, atau elemen merek.
> Nama "RantaiNaik" adalah nama kerja.

**Perubahan dari prompt v2:** wizard RFQ menjadi 10 langkah (ada langkah Alokasi dan standar acuan), papan alokasi lot, halaman pendanaan escrow, status dana, dana dan pencairan UMKM, pembatalan order, sengketa (pembeli, UMKM, admin), ledger escrow admin, direktori UMKM, kapasitas terpakai, rekam jejak pembeli, dan order induk + sub-order.

---

## 0. Cara memakai

1. **Mulai dari P0 (design system)** dan tempel di awal setiap sesi atau prompt baru supaya gaya antarlayar konsisten.
2. **Bangun variables dan komponen dasar di Figma lebih dulu** (warna, tipografi, spacing, tombol, input, badge, baris daftar, tabel). Layar lain tinggal memakainya.
3. **Satu prompt = satu layar atau satu alur pendek.**
4. **Perbaiki lewat prompt iterasi** (bagian 5), jangan membuat ulang dari nol.
5. Semua teks UI dalam **Bahasa Indonesia**.

**Urutan pengerjaan yang disarankan:**

| Urutan | Prompt | Alasan |
|---|---|---|
| 1 | P0 Design system | Fondasi |
| 2 | P7 Detail RFQ, P8 Form penawaran | Inti proses RFQ dan penawaran |
| 3 | P13 Wizard RFQ, P16 Perbandingan, P17 Papan alokasi lot | Sisi industri dan pembeda utama |
| 4 | P19 Pendanaan escrow, P10 Detail order, P22 Sengketa | Inti model broker |
| 5 | P5 Readiness Score, P14 Kandidat | Fitur pembeda |
| 6 | P3, P12 Beranda UMKM dan Industri | Layar pertama |
| 7 | P6, P9, P11, P15, P18, P20, P21 | Melengkapi alur |
| 8 | P1, P2, P23, P24 | Publik dan admin |
| 9 | P25 State, P26 Mobile | Penyempurnaan |

**Struktur halaman di file Figma:** `00 Cover` · `01 Design System` · `02 Flows` · `03 UMKM` · `04 Industri` · `05 Bersama` · `06 Admin` · `07 Mobile`. Penamaan frame: `Peran / Layar / State`.

---

## 0.1 Peta pola: apa yang dipinjam dari Upwork dan Fiverr

Pakai tabel ini sebagai pegangan gaya. Tujuannya mirip secara struktur dan kepadatan, tidak menyalin tampilan.

| Pola yang dipinjam | Dipakai di RantaiNaik |
|---|---|
| Navigasi atas dengan pencarian, menu, notifikasi, avatar (Upwork, Fiverr) | Semua peran |
| Latar halaman abu muda dengan **kartu putih bergaris tipis** (Upwork) | Seluruh halaman aplikasi, supaya halaman terasa terisi dan terstruktur |
| **Baris pekerjaan padat**: meta posting, judul biru, ringkasan, deskripsi 3 baris, chip keahlian, info klien (Upwork) | Cari RFQ, RFQ yang cocok, RFQ saya |
| **Rail filter** kiri dengan grup yang dapat dilipat dan jumlah hasil (Upwork) | Cari RFQ, Cari UMKM |
| Detail pekerjaan: strip fakta kunci, bagian bertingkat, **"Aktivitas pada pekerjaan ini"**, panel aksi dan **"Tentang klien"** di kanan (Upwork) | Detail RFQ dan **Rekam Jejak Pembeli** |
| Daftar proposal dengan avatar, rating, ringkasan, tombol Shortlist dan Message (Upwork) | Penawaran masuk, kandidat |
| Halaman kontrak dengan milestone dan dana di escrow (Upwork) | Detail order, pendanaan, rilis dana |
| **Grid kartu berfoto**: foto atas, avatar dan level penjual, judul 2 baris, rating, harga "Mulai dari" (Fiverr) | Direktori UMKM, UMKM populer di landing |
| Hero berfoto dengan pencarian besar dan chip "Populer" (Fiverr) | Landing |
| **Strip kategori** dengan ikon dan carousel kartu (Fiverr) | Landing, Cari UMKM |
| Pita gelap bergantian dengan bagian putih (Fiverr) | Landing: pembayaran escrow, CTA, footer |
| Kotak paket Basic/Standard/Premium dengan harga dan tombol (Fiverr) | Ringkasan penawaran dan ringkasan dana |
| Pil, chip, badge level penjual (Fiverr) | Tier Readiness, layanan, bahan |

**Aturan kepadatan:** tiap baris daftar membawa 5 sampai 7 potong informasi. Tidak ada halaman desktop satu kolom yang lengang: bila konten utama sempit, tambahkan panel samping yang relevan (ringkasan, rekam jejak, langkah berikutnya). Kerapian dijaga dengan grid, tiga tingkat teks, garis tipis, dan satu warna aksen.

---

## P0. Design system dan aturan global

> Tempel ini di awal setiap sesi.

```
Kamu adalah desainer UI/UX senior. Rancang UI web app B2B bernama "RantaiNaik".

TENTANG PRODUK
Platform pengadaan tekstil berbentuk broker, mirip marketplace jasa. Industri/pembeli (perusahaan, brand lokal) memposting RFQ (permintaan penawaran) untuk seragam, merchandise, atau maklon. UMKM konveksi mengirim penawaran terstruktur. Satu RFQ bisa dikerjakan satu UMKM (tunggal) atau dibagi 2-4 lot ke beberapa UMKM dengan standar yang sama. Pembayaran lewat escrow: pembeli mendanai penuh di awal, dana dirilis per milestone dan QC, sengketa diputus admin. Ada Readiness Score (0-100) yang menunjukkan kesiapan UMKM menjadi pemasok. Tiga peran: Industri (pembeli), UMKM (pemasok), Admin.

ARAH GAYA (penting)
Padat informasi tetapi rapi, seperti Upwork dan Fiverr. Halaman terasa terisi: kartu putih bergaris tipis di atas latar abu muda, baris daftar yang kaya metadata (judul, ringkasan, chip, rating, lokasi, status), foto dan avatar, panel samping berisi ringkasan dan rekam jejak, strip angka, dan filter di kiri. Pola Upwork: navigasi atas dengan pencarian, baris pekerjaan, rail filter, detail dengan panel aksi kanan, kotak "Tentang klien". Pola Fiverr: hero berfoto, strip kategori, grid kartu penyedia berfoto, pita gelap bergantian. Nuansa industrial yang tenang: netral abu-abu baja, garis tipis, sudut tegas, satu warna aksen.
Kepadatan: tiap baris daftar membawa 5 sampai 7 potong informasi. Tidak boleh ada layar yang lengang. Bila satu kolom terlihat kosong, isi dengan panel samping yang relevan.
JANGAN: gradien warna-warni, ilustrasi kartun, bayangan tebal, banyak warna aksen, sudut sangat bulat, animasi berlebihan, kartu bersarang dalam kartu, widget grafik yang tidak membawa keputusan.
Jangan menyalin warna, logo, atau elemen merek Upwork dan Fiverr. Hanya struktur dan kepadatannya.

BAHASA UI
Bahasa Indonesia yang sederhana dan lugas. Hindari istilah teknis atau beri keterangan singkat.

UKURAN DAN LAYOUT
Desktop 1440. Navigasi ATAS (bukan sidebar), tinggi 64px, putih dengan garis bawah tipis: logo teks di kiri, menu utama sesuai peran, kolom pencarian (lebar 280), ikon notifikasi dengan titik penanda, avatar. Konten dipusatkan, lebar maksimal 1200px, gutter 24px, grid 12 kolom. Halaman aplikasi berlatar abu muda dengan kartu putih; landing berlatar putih dengan pita gelap. Mobile 390. Gunakan Auto Layout dan komponen yang dapat dipakai ulang. Irama spasi 4/8/12/16/24/32/48.
Menu utama: UMKM (Beranda, Cari RFQ, Penawaran, Order, Dana), Industri (Beranda, RFQ Saya, Cari UMKM, Order, Dana), Admin (Verifikasi, Sengketa, Ledger, Konfigurasi, Pengguna).

DESIGN TOKENS
- Teks utama #111827, sekunder #4B5563, tersier #6B7280
- Garis #E5E7EB, garis tegas #D1D5DB
- Latar halaman aplikasi #F6F7F9, kartu #FFFFFF, permukaan halus #F3F4F6, pita gelap #111827 (landing dan footer)
- Aksen tunggal (tombol utama, tautan judul, fokus, terpilih): biru baja #1D4ED8, hover #1E40AF, tint #EFF6FF (pil kecocokan, baris terpilih, banner info)
- Semantik dengan tint: sukses #15803D / #F0FDF4, peringatan #B45309 / #FFFBEB, bahaya #B91C1C / #FEF2F2. Bintang rating #F59E0B.
- Tipografi: Inter untuk semua teks, IBM Plex Mono untuk kode (RFQ-0007, nomor order).
  Judul baris daftar 18/26 semibold biru. Isi daftar 14/22. Isi halaman detail 16/26. Meta 13/18 tersier. H1 28/36 semibold, H2 22/30 semibold, H3 18/26 semibold. Angka stat 28/36 semibold. Label bagian huruf kapital kecil 12/16 semibold, letter-spacing 0.04em, tersier.
  Nominal rupiah penuh dengan titik ribuan (Rp33.750.000), tabular figures. Lebar paragraf maksimal sekitar 72 karakter.
- Radius: kartu 12px, tombol dan input 8px, chip dan badge pil penuh, modal 12px, foto 8px.
- Bayangan: tidak ada pada kartu biasa (garis 1px). Hanya hover kartu yang dapat diklik (0 2px 8px rgba(17,24,39,0.08)) dan dropdown.
- Ikon outline 1.5px: 16px di baris meta (lokasi, jam, centang terverifikasi, simpan), 20px di navigasi, 24px di strip kategori.
- Avatar bulat 32/40/56/96. Logo usaha kotak radius 8. Foto: pakai foto stok placeholder bertema konveksi (mesin jahit, gulungan kain, polo bordir, seragam) di kartu UMKM, portofolio, dan hero landing.
- Spasi: padding kartu 20-24, jarak antarkartu 16, jarak antarbagian 32.

KOMPONEN (padat dan konsisten)
- Tombol: utama (biru solid), sekunder (putih, garis 1px), teks, bahaya. Tinggi 40, kecil 32.
- Input 40px, garis 1px, fokus cincin 2px biru. Label di atas, teks bantu di bawah.
- Chip: pil abu #F3F4F6 13px untuk layanan, bahan, kategori. Chip filter aktif: tint biru dengan tanda silang.
- Tab garis bawah dengan jumlah di sebelah label (mis. "Penawaran (3)").
- Tabel: pemisah baris tipis, header lengket, tanpa zebra.
- BARIS RFQ (gaya baris pekerjaan Upwork), di dalam kartu putih, dipisah garis, padding 20-24, ikon simpan (bookmark) di kanan atas:
  1 meta kecil: "Diposting 2 jam lalu · Seragam · Tunggal"
  2 judul biru 18/26 semibold (tautan)
  3 ringkasan: "Total 300 pcs · 2 item · Target kirim 15 Jan 2027 · Anggaran Rp30-35 juta"
  4 deskripsi 2-3 baris dengan "selengkapnya"
  5 chip: Kemeja kerja, Katun TC, Bordir, Sablon, Full package
  6 baris pembeli: centang "Terverifikasi", ★ 4,9, "Didanai tepat waktu 100%", lokasi, "Penawaran: 3 dari 11"; di kanan pil tint biru "Kecocokan 86%".
- KARTU UMKM (gaya kartu Fiverr): foto 4:3 di atas dengan ikon simpan di pojok; avatar 32, nama, pil tier; judul 2 baris ("Konveksi seragam kantor, bordir dan sablon"); ★ 4,7 (12); garis tipis; footer "Kapasitas 3.000 pcs/bulan" di kiri dan "MOQ 50 pcs" di kanan. Hover memberi garis tegas dan bayangan lembut.
- BARIS PENAWARAN/KANDIDAT (gaya proposal Upwork): avatar 56, nama (tautan), pil tier, ★ rating, lokasi; deret 3 foto portofolio 72px; chip alasan; strip metrik 4 kolom bergaris; skor besar di kanan; tombol Shortlist, Lihat, Undang.
- PANEL SAMPING (gaya "Tentang klien"): kartu putih, bagian dipisah garis, judul label kapital kecil, baris label-nilai dengan ikon 16px.
- STRIP STAT: satu kartu, 3-4 kolom dipisah garis vertikal tipis, angka 28/36 di atas, label 13 di bawah.
- RAIL FILTER: lebar 260, grup dapat dilipat dengan chevron, kotak centang dengan jumlah hasil di kanan ("Seragam (24)"), tautan "Hapus semua".
- Badge status: pil kecil 12px dengan titik warna dan teks.
- Stepper wizard: "Langkah 3 dari 10" dengan bilah progres tipis. Stepper order: 8 titik dengan label.
- Banner: kotak dengan tint, garis kiri 3px, ikon 16px, satu atau dua baris teks, tombol teks di kanan bila perlu.
- Empty state: ikon outline 32px abu, satu kalimat, satu tombol. Toast kecil di kanan bawah.

STATUS (konsisten di seluruh aplikasi)
RFQ: Draft, Dibuka, Ditutup, Evaluasi, Sampel, Dimenangkan, Dimenangkan sebagian, Dipesan, Kedaluwarsa, Dibatalkan.
Penawaran: Draft, Terkirim, Shortlist, Revisi diminta, Sampel diminta, Sampel dikirim, Sampel disetujui, Sampel ditolak, Diterima, Ditolak, Ditarik, Perlu konfirmasi (setelah addendum).
Status lot dalam penawaran: Terkirim, Shortlist, Menang, Cadangan, Ditolak.
Order: Menunggu pendanaan, Dikonfirmasi, Bahan siap, Produksi, Siap kirim, Dikirim, Diterima, QC lolos, QC lolos dengan catatan, QC gagal, Rework, Selesai, Dibatalkan, Gagal.
STATUS DANA (label terpisah dari status order, selalu tampil berdampingan): Menunggu dana, Didanai, Dirilis sebagian, Dirilis penuh, Disengketakan, Dikembalikan sebagian, Dikembalikan.
Sengketa: Dibuka, Menunggu tanggapan, Ditelaah admin, Diputus.
Tier Readiness: Tahap Awal (abu), Berkembang (amber), Siap Kemitraan (biru), Siap Industri (hijau), tampil sebagai pil dengan titik warna.

AKSESIBILITAS
Kontras WCAG AA, area sentuh mobile minimal 44px, jangan hanya mengandalkan warna untuk status (sertakan teks).

DATA CONTOH (pakai konsisten, jangan diganti-ganti)
- UMKM utama: "CV Karya Mandiri Konveksi", Bekasi. Layanan: Jahit CMT, Full package, Bordir, Sablon. Kapasitas 3.000 pcs/bulan, 22 penjahit, 24 mesin. Readiness 68 (Siap Kemitraan). Rating 4,7 (12 ulasan), tepat waktu 92%.
- UMKM lain: UD Sinar Jahit, Koperasi Penjahit Bersama, CV Tiga Warna Garmen, Konveksi Sinar Jaya.
- Industri: "PT Nusantara Logistik", Jakarta Selatan. Rekam jejak pembeli: didanai tepat waktu 100%, pembatalan sepihak 0, sengketa 1 dari 14 order. Brand lokal untuk maklon: "Studio Rimba".
- RFQ-0007 "Seragam Karyawan Kantor 2027" (jenis Seragam, Terbuka, alokasi Tunggal):
  Item 1 Kemeja kerja lengan panjang, katun TC sekitar 140 gsm, biru navy, bordir logo dada kiri, ukuran S20 M70 L70 XL30 XXL10 = 200 pcs, full package.
  Item 2 Rompi operasional, drill sekitar 240 gsm, abu-abu, sablon logo punggung, M40 L40 XL20 = 100 pcs.
  Syarat wajib: NIB dan uji lab kain (luntur warna). Sampel: ya, 1 pcs per item, biaya dikreditkan ke order. Tenggat tanya jawab 18 Nov 2026, tenggat penawaran 25 Nov 2026, target kirim 15 Jan 2027. Termin lewat escrow: didanai penuh di awal, 30% dirilis saat bahan tiba, 70% setelah QC lolos.
- Penawaran RFQ-0007: CV Karya Mandiri Konveksi Rp33.750.000, lead time 21 hari kerja, kirim 9 Jan, kesesuaian 7 dari 8. UD Sinar Jahit Rp31.900.000, 25 hari kerja, kirim 14 Jan, kesesuaian 8 dari 8. Koperasi Penjahit Bersama Rp30.400.000, 35 hari kerja, kirim 23 Jan (terlambat 8 hari), kesesuaian 6 dari 8.
- Dana order RFQ-0007 (pemenang CV Karya Mandiri Konveksi): didanai Rp33.750.000. Rilis tahap 1 (30%) Rp10.125.000, komisi 5% Rp506.250, diterima UMKM Rp9.618.750. Rilis tahap 2 (70%) Rp23.625.000, komisi Rp1.181.250, diterima UMKM Rp22.443.750.
- RFQ-0008 "Kemeja Seragam Panitia Event" (alokasi LOT, 4 lot x 50 pcs, kemeja lengan pendek katun TC 140 gsm biru navy, maks 1 lot per UMKM, konsistensi bahan: satu sumber kode KTC-140-NVY, standar acuan: tech pack terkunci + sampel acuan fisik, toleransi dimensi ±1 cm, AQL 2,5, kebijakan harga: tiap pemenang memakai harga tawarannya, lot cadangan: ya).
  Rincian ukuran lot (S/M/L/XL/XXL): A 5/18/18/7/2, B 5/18/18/7/2, C 5/17/17/8/3, D 5/17/17/8/3, masing-masing 50 pcs.
  Skor penawaran per lot: Lot A: CV Karya Mandiri Konveksi 88 (Rp110.000), UD Sinar Jahit 81. Lot B: Konveksi Sinar Jaya 84 (Rp112.000), UD Sinar Jahit 79. Lot C: CV Karya Mandiri Konveksi 86, Koperasi Penjahit Bersama 74 (Rp108.000, sumber bahan belum dinyatakan). Lot D: UD Sinar Jahit 83 (Rp111.000), Koperasi Penjahit Bersama 72.
  Saran alokasi (total skor 329): A CV Karya Mandiri Konveksi, B Konveksi Sinar Jaya, C Koperasi Penjahit Bersama, D UD Sinar Jahit.
- Kapasitas terpakai Konveksi Sinar Jaya: 62% sebelum menawar Lot B, 80% bila menang.
- Kandidat matching RFQ-0007: CV Karya Mandiri Konveksi 86, UD Sinar Jahit 82, Koperasi Penjahit Bersama 74, CV Tiga Warna Garmen 68.

Konfirmasi dulu dengan merangkum design system dalam 5 baris, lalu tunggu instruksi layar.
```

---

## Prompt publik

### P1. Landing
```
Rancang "Landing Page" (desktop 1440). Pakai P0. Gaya Fiverr: hero berfoto, strip kategori, baris kartu penyedia, pita gelap bergantian. Padat dan terisi.

Susunan:
1. Navbar putih 64px: logo, kolom pencarian kecil, tautan (Cari RFQ, Cari UMKM, Cara kerja), "Masuk" dan tombol biru "Daftar".
2. Hero tinggi 560px: foto placeholder konveksi (mesin jahit dan gulungan kain) dengan overlay gelap 60%, teks putih rata kiri. Judul 48/56 "Temukan konveksi yang siap untuk seragam, merchandise, dan maklon Anda", satu kalimat penjelas, kolom pencarian besar (tinggi 56) dengan pilihan jenis dan tombol biru "Cari". Di bawahnya baris "Populer:" dengan 5 chip outline putih (Seragam kantor, Wearpack, Polo bordir, Jaket, Tote bag). Di bagian bawah hero, tiga butir centang kecil: Pemasok terverifikasi, Dana dilindungi escrow, Penawaran mudah dibandingkan.
3. Strip kategori: 10 item horizontal, tiap item ikon outline 24px dan label (Seragam kantor, Wearpack, Hospitality, Kaos dan polo, Jaket, Topi, Tote bag, Bordir, Sablon, Maklon).
4. Bagian "UMKM konveksi terverifikasi": baris carousel 4 kartu UMKM (anatomi Kartu UMKM di P0), panah kiri dan kanan, tautan "Lihat semua".
5. Pita gelap #111827: kiri judul putih "Pembayaran terlindungi lewat escrow" dan satu paragraf, kanan tiga langkah bernomor dengan ikon (Didanai di awal, Dirilis per milestone dan QC, Sengketa diputus admin berdasarkan bukti), tombol putih "Pelajari alur dana".
6. "Cara kerja": tab "Untuk industri | Untuk UMKM", di bawahnya 4 kolom bernomor dengan ikon 24px, judul, dan dua baris teks, serta satu foto samping.
7. Strip stat dalam satu kartu, diberi label kecil "Data contoh": UMKM terverifikasi 28, RFQ terbuka 8, Rata-rata penawaran per RFQ 3,4, Order selesai 38.
8. "Readiness Score": dua kolom. Kiri tiga poin teks dengan ikon centang. Kanan kartu contoh skor 68/100 dengan pil tier dan enam bilah komponen.
9. Pita CTA biru #1D4ED8 dengan dua tombol ("Buat RFQ", "Daftar sebagai UMKM"), lalu footer gelap 4 kolom (Produk, Untuk UMKM, Untuk Industri, Bantuan) dan baris hak cipta.
```

### P2. Registrasi dan login
```
Rancang alur "Autentikasi" (desktop 1440, form di tengah lebar maksimal 440px). Pakai P0. Tampilkan sebagai frame terpisah:
1. Login: email, password, "Lupa password", tautan daftar.
2. Pilih peran: dua pilihan sederhana berupa baris bergaris ("Saya UMKM konveksi", "Saya industri/pembeli") dengan satu kalimat deskripsi.
3. Form data akun lalu data usaha (nama, kota, penanggung jawab). Centang persetujuan syarat dan ketentuan, termasuk keputusan admin atas sengketa.
4. Unggah dokumen verifikasi: daftar dokumen sesuai peran, tiap baris punya tombol "Unggah" dan status.
5. "Menunggu verifikasi": teks singkat, estimasi waktu, dan apa yang bisa dilakukan sementara. Tanpa ilustrasi.
```

---

## Prompt UMKM

### P3. Beranda UMKM
```
Rancang "UMKM / Beranda" (desktop 1440, latar abu muda, semua konten dalam kartu putih bergaris). Pakai P0 dan pola Upwork "Find work".

Susunan:
- Baris atas: logo usaha 56, "Selamat pagi, CV Karya Mandiri Konveksi", pil tier "Siap Kemitraan", tombol "Cari RFQ" di kanan.
- Strip stat dalam satu kartu (4 kolom bergaris): Penawaran aktif 3, Order berjalan 2, Dana di escrow Rp23.625.000, Kapasitas terpakai 62% (dengan bilah tipis).
- Dua kolom: utama 2/3 dan samping 1/3.
- Kolom utama:
  - Kartu "RFQ yang cocok untukmu" dengan tab garis bawah (Rekomendasi, Terbaru, Tersimpan). Isi 4 Baris RFQ lengkap sesuai anatomi di P0 (meta, judul, ringkasan, deskripsi, chip, baris pembeli, pil kecocokan). Tautan "Lihat semua RFQ".
  - Kartu "Penawaran aktif": 3 baris berisi kode RFQ, judul, pembeli, total, versi, badge status, dan tombol aksi bila perlu (Revisi sekarang, Kirim sampel).
  - Kartu "Order berjalan": 2 baris berisi nomor order, pembeli, nilai, stepper mini 8 titik, badge status order dan badge status dana berdampingan.
- Kolom samping (kartu terpisah, berurutan):
  - "Readiness Score": angka besar 68/100, pil tier, bilah tersegmen empat tier, tautan "Lihat rincian", dan satu baris "Langkah tercepat: Unggah SOP QC jahit (+5)".
  - "Kapasitas bulan ini": bilah 62%, keterangan "dari penawaran aktif dan order berjalan".
  - "Dana": di escrow, sudah dirilis, tautan "Lihat dana".
  - "Perlu perhatian": 3 item dengan ikon peringatan kecil dan tombol teks (sertifikat akan kedaluwarsa, penawaran diminta revisi, addendum baru).
```

### P4. Profil dan kapabilitas
```
Rancang "UMKM / Profil dan Kapabilitas" (desktop 1440, latar abu muda, kartu putih). Pakai P0 dan pola profil penyedia Fiverr/Upwork.

Susunan dua kolom: kiri kartu profil 320px (lengket), kanan konten.
- Kartu profil kiri: logo usaha 96, nama, lokasi, pil tier, ★ 4,7 (12 ulasan), tombol "Edit profil". Di bawah garis: daftar label-nilai dengan ikon (Anggota sejak 2026, Tepat waktu 92%, 38 order selesai, Waktu respons < 24 jam, Kapasitas 3.000 pcs/bulan). Lalu "Layanan" (chip: Jahit CMT, Full package, Bordir, Sablon), "Kelengkapan profil 80%" dengan bilah dan daftar yang belum diisi, "Dokumen dan uji" (daftar dengan status), dan "Rekening pencairan" (bank, nomor tersamar •••• 4821, status verifikasi, tombol "Ubah").
- Kanan, tiap bagian satu kartu: Tentang usaha (paragraf); Portofolio (grid foto 3 kolom, tiap foto dengan keterangan dan chip jenis produk, tombol "Tambah"); Kapabilitas produk (tabel: produk, kapasitas per bulan, MOQ, lead time, bahan); Mesin dan tenaga kerja (strip stat: 24 mesin, 22 penjahit, 1 shift, lalu daftar jenis mesin); Ulasan (rating ringkas dengan rincian tiga aspek, lalu 3 ulasan dengan avatar, nama pembeli, bintang, tanggal, komentar).
Sertakan state edit: panel samping formulir "Tambah kapabilitas" (kategori, layanan, bahan, dekorasi, kapasitas bulanan, MOQ, lead time) dengan satu contoh error validasi.
```

### P5. Readiness Score
```
Rancang "UMKM / Readiness Score" (desktop 1440). Pakai P0. Tampilan sederhana berbasis teks dan bilah tipis, tanpa radar chart dan tanpa gauge.

Susunan:
1. Judul dan tanggal hitung terakhir. Angka besar "68/100" dengan pil tier "Siap Kemitraan". Di bawahnya satu bilah tipis bersegmen empat tier (0-39, 40-59, 60-79, 80-100) dengan penanda posisi.
2. Bagian "Rincian skor": enam baris, tiap baris berisi nama komponen, bilah tipis, dan nilai:
   Legalitas dan profil 17/20, Kapasitas dan fasilitas produksi 15/20, Mutu dan kompetensi 12/20, Rekam jejak transaksi 10/20 (keterangan kecil "belum ada riwayat, memakai nilai awal"), Administrasi dan digital 8/10, Finansial dan sumber bahan 6/10.
   Tiap baris dapat dibuka (accordion) menampilkan item penilaian dengan label "Terverifikasi" atau "Dinyatakan sendiri (bernilai 50%)". Pada komponen Rekam jejak, tampilkan catatan "Mundur sepihak setelah diterima dan sengketa yang merugikan UMKM mengurangi poin".
3. Bagian "3 langkah tercepat naik tier": tiga baris bernomor berisi tindakan, tambahan poin, tingkat kesulitan (teks), dan tombol "Kerjakan":
   Unggah SOP QC jahit (+5, mudah); Verifikasi hasil uji lab kain (+4, sedang); Catat produksi di sistem (+3, mudah).
4. Tautan teks "Cara skor dihitung".
Nada teks mendukung dan memotivasi.
```

### P6. Cari RFQ
```
Rancang "UMKM / Cari RFQ" (desktop 1440, latar abu muda). Pakai P0 dan pola Upwork "Find work".

Susunan:
- Kolom pencarian lebar di atas dengan tombol biru "Cari", lalu baris chip filter aktif (mis. "Seragam" ×, "Bekasi" ×) dan tautan "Hapus semua".
- Tab garis bawah: Rekomendasi untukmu (24) | Terbaru | Tersimpan (3).
- Rail filter kiri 260px (anatomi Rail Filter di P0): jenis kebutuhan (Seragam 24, Merchandise 11, Maklon 6), mode (Tunggal, Dibagi per lot), kategori produk, jumlah total (rentang), dekorasi (Bordir, Sablon, DTF), lokasi pengiriman, tenggat penawaran, toggle "Hanya yang sesuai kapabilitasku".
- Kolom hasil: baris di dalam satu kartu, bar atas "41 RFQ" dan pilihan urut. Tiap baris memakai anatomi Baris RFQ di P0 secara lengkap. Pada RFQ lot, ringkasan menulis "4 lot x 50 pcs" dan pil kecocokan menulis "Cocok untuk Lot A, C".
- Satu baris RFQ yang belum memenuhi syarat memakai tint amber dan teks "Belum memenuhi: butuh hasil uji lab kain" dengan tautan "Cara memenuhinya".
- Paginasi.
```

### P7. Detail RFQ (sisi UMKM)
```
Rancang "UMKM / Detail RFQ" (desktop 1440, latar abu muda, kartu putih). Pakai P0 dan pola halaman detail pekerjaan Upwork. Padat tetapi mudah dibaca.

Susunan dua kolom: konten 2/3 dan panel kanan 1/3 (lengket).
- Kartu header: breadcrumb, kode "RFQ-0007" (mono), judul H1 "Seragam Karyawan Kantor 2027", nama pembeli, badge "Dibuka", ikon simpan dan bagikan, sisa waktu penawaran.
- Strip fakta kunci dalam satu kartu (4 kolom dengan ikon): Total 300 pcs, Target kirim 15 Jan 2027, Sampel: Ya, Tenggat penawaran 25 Nov 2026.
- Tab garis bawah: Spesifikasi (aktif) | Tanya Jawab (4) | Addendum (1).
- Tab Spesifikasi, tiap bagian satu kartu: "Ringkasan" (daftar label-nilai: jenis, mode alokasi, lokasi, pengiriman bertahap, sampel dan biaya dikreditkan, kebijakan harga); "Item" (dua blok bergaris, tiap blok berisi daftar label-nilai bahan, gsm, warna, dekorasi, catatan konstruksi, label dan packing, standar mutu, tabel kecil rincian ukuran, dan lampiran file dengan ikon dan ukuran); "Keahlian dan layanan yang dibutuhkan" (chip: Full package, Bordir, Sablon, Katun TC, Drill); "Persyaratan" (daftar centang NIB dan uji lab kain dengan penanda wajib, dan nilai tambah); "Pembayaran" ("Pembeli mendanai penuh ke escrow sebelum produksi. 30% dirilis saat bahan tiba, 70% setelah QC lolos. Komisi platform 5% dipotong dari dana yang dirilis.").
- Kartu "Aktivitas pada RFQ ini" (gaya Upwork): Penawaran 11, Terakhir dilihat 2 jam lalu, UMKM diundang 5, Pertanyaan 4.
- Di bawah, "RFQ serupa": 3 baris ringkas.
- Panel kanan (kartu bertumpuk): (1) aksi: hitung mundur tenggat, "Kecocokan 86%", daftar periksa kelayakan dengan ikon centang (Kapasitas sesuai, Dekorasi sesuai, Uji lab: belum ada, Jadwal: dapat dipenuhi), tombol utama "Ajukan penawaran", tombol sekunder "Simpan RFQ", tautan "Ajukan pertanyaan"; (2) **"Rekam Jejak Pembeli"** ala "Tentang klien" Upwork: PT Nusantara Logistik, centang Terverifikasi, ★ 4,9, Didanai tepat waktu 100%, Pembatalan sepihak 0, Sengketa 1 dari 14 order, Jakarta Selatan, anggota sejak 2026; (3) "Lampiran" dengan daftar file.
- Variasi tab Tanya Jawab: daftar tanya jawab dengan penanya anonim dan kolom "Ajukan pertanyaan".
- Variasi banner Addendum: "Addendum 1 mengubah tenggat. Periksa penawaranmu."
- **Variasi RFQ-0008 (mode lot):** tab tambahan "Lot (4)": tabel lot (Lot A-D, rincian ukuran, qty 50) dan kartu "Standar acuan bersama" (konsistensi bahan satu sumber kode KTC-140-NVY, tech pack terkunci, sampel acuan fisik, toleransi ±1 cm, AQL 2,5, maksimal 1 lot per UMKM, kebijakan harga). Panel kanan menampilkan "Cocok untuk Lot A, C" dan tombol "Pilih lot dan ajukan penawaran".
```

### P8. Form penawaran
```
Rancang "UMKM / Form Penawaran" untuk RFQ-0007 (desktop 1440). Pakai P0. Halaman satu kolom lebar maksimal 760px dengan bagian bernomor, ditambah ringkasan lengket di kanan. Fokus pada kejelasan dan kemudahan mengisi.

Bagian:
1. Per item (dua blok): nama item, harga satuan (Rp), bahan yang ditawarkan (pilih "Sesuai spesifikasi" atau "Alternatif" lalu isi jenis dan gsm), dekorasi yang ditawarkan, subtotal otomatis. Data: Kemeja Rp118.000 x 200, Rompi Rp96.000 x 100 (bahan alternatif drill 250 gsm).
2. Biaya tambahan (baris dinamis): nama biaya, nominal, satuan (sekali/per pcs). Contoh: digitizing bordir Rp350.000, setting sablon Rp200.000. Tombol "Tambah biaya".
3. Jadwal dan kapasitas: lead time (hari kerja), kapasitas dialokasikan (pcs/minggu), tanggal kirim yang dapat dipenuhi dengan penanda otomatis "Memenuhi target 15 Jan 2027", MOQ, kirim bertahap.
4. Komersial: termin yang diminta, ongkir ditanggung siapa, kebijakan perbaikan reject, berlaku hingga, harga sudah/belum termasuk PPN.
5. Sampel: bersedia kirim, biaya sampel, waktu pengerjaan.
6. Kesesuaian spesifikasi: tabel dengan satu baris per persyaratan (8 baris: bahan, gsm, warna, dekorasi, uji lab kain, jadwal, jumlah dan toleransi, label dan packing). Tiap baris punya pilihan Sesuai / Alternatif / Tidak sesuai dan kolom catatan. Persyaratan wajib tidak menyediakan "Tidak sesuai". Ringkasan di atas tabel: "Kesesuaian 7 dari 8 (88%)".
7. Lampiran dan catatan.
Panel kanan lengket: total otomatis Rp33.750.000, rincian singkat, tenggat, indikator "Kapasitas terpakai 62% menjadi 80% bila menang" (peringatan lembut bila lebih dari 100%: "Komitmen melebihi kapasitas. Kamu tetap bisa mengirim, tetapi menang melebihi kapasitas tidak membebaskan kewajiban order."), tombol "Kirim penawaran" dan "Simpan draft".
Sertakan variasi dengan peringatan "Tanggal kirim melewati target 15 Jan 2027" (peringatan, bukan penolakan).

**Variasi mode lot (RFQ-0008):** bagian 1 diganti "Pilih lot yang ditawar": daftar Lot A-D dengan kotak centang (maksimal 1 lot, tampilkan teks aturan). Untuk lot yang dipilih (Lot B): harga satuan Rp112.000 x 50 = Rp5.600.000, lead time 14 hari kerja, kapasitas dialokasikan 60 pcs/minggu, tanggal kirim, **sumber bahan (kode kain KTC-140-NVY)**, pilihan "Bersedia menerima lot tambahan bila ada lot kosong". Bagian kesesuaian ditambah tiga baris standar acuan lot: toleransi dimensi, acuan warna, sumber bahan.
```

### P9. Penawaran dan order saya
```
Rancang "UMKM / Penawaran dan Order Saya" (desktop 1440, latar abu muda). Pakai P0 dan pola "My jobs" Upwork.

Susunan:
- Judul, dua tab garis bawah: Penawaran (6) | Order (3), dan satu kartu strip stat: Aktif 3, Perlu tindakan 2, Menang bulan ini 1, Kapasitas terpakai 62% (bilah tipis).
- Baris chip filter status (Semua, Perlu tindakan, Shortlist, Menang) dan kolom cari.
- Tab Penawaran: baris di dalam satu kartu. Tiap baris: kode RFQ, judul (tautan), pembeli dengan ★, total, versi (v2), tanggal kirim, badge status, tombol aksi. Satu baris "Revisi diminta" (tombol "Revisi sekarang" dan sisa waktu), satu "Sampel diminta" ("Kirim sampel"), satu "Perlu konfirmasi" ("Periksa addendum"). Pada penawaran lot, tampilkan badge status tiap lot (mis. "Lot B: Menang").
- Tab Order: tiap baris berisi nomor order, pembeli, nilai, stepper mini 8 titik, badge status order dan **badge status dana** berdampingan (mis. "Produksi" + "Dana: Didanai"), dan milestone berikutnya. Satu baris "Menunggu pendanaan" dengan teks "Produksi dimulai setelah pembeli mendanai".
```

### P10. Detail order (sisi UMKM)
```
Rancang "UMKM / Detail Order" (desktop 1440). Pakai P0 dan pola halaman kontrak Upwork dengan milestone.

Susunan dua kolom: kiri 2/3, kanan 1/3.
- Header: nomor order, pembeli, badge status order, badge status dana, tombol "Perbarui milestone".
- Stepper tipis (Dikonfirmasi, Bahan siap, Produksi, Siap kirim, Dikirim, Diterima, QC, Selesai).
- Kiri: "Milestone" sebagai daftar bernomor, tiap baris punya status, tanggal, foto kecil, dan keterangan pemicu dana (mis. "Bahan tiba: memicu rilis 30%"). Tombol "Unggah bukti" memakai unggah foto dan nota. Lalu "Riwayat" (timeline waktu dan pelaku), lalu "Hasil QC" bila ada (jumlah diterima per ukuran, jenis cacat) dengan tombol "Buka sengketa" bila relevan.
- Kanan: kotak bergaris "Dana order" berisi tiga baris: Didanai Rp33.750.000; Tahap 1 (30%) Rp10.125.000, komisi Rp506.250, diterima Rp9.618.750, status "Dirilis"; Tahap 2 (70%) Rp23.625.000, status "Menunggu QC". Teks kecil di bawahnya: "Dana tahap 2 dirilis setelah QC lolos atau otomatis 5 hari kerja setelah barang diterima bila tidak ada sengketa".
- Variasi order lot: header menampilkan "Sub-order Lot B dari RFQ-0008" dengan tautan "Lihat order induk".
- Variasi "Menunggu pendanaan": banner "Produksi dimulai setelah pembeli mendanai. Batas pendanaan 3 x 24 jam."
```

### P11. Dana dan pencairan
```
Rancang "UMKM / Dana" (desktop 1440). Pakai P0. Halaman berbasis tabel dan angka dalam kartu putih bergaris di atas latar abu muda.

Susunan:
- Judul "Dana". Strip stat dalam satu kartu (anatomi Strip Stat di P0): Di escrow Rp23.625.000, Sudah dirilis Rp9.618.750, Komisi dipotong Rp506.250.
- Kotak bergaris "Rekening pencairan": bank, •••• 4821, nama pemilik, status "Terverifikasi", tombol "Ubah".
- Tabel "Riwayat dana": tanggal, order, kejadian (Didanai, Rilis tahap 1, Rilis tahap 2, Refund, Komisi), jumlah, status. Filter ringan berdasarkan order.
- Bagian "Order dengan dana tertahan": baris per order dengan status dana dan syarat rilis berikutnya dalam satu kalimat (mis. "Menunggu QC lolos").
- Teks bantu: "Komisi 5% dipotong dari dana yang dirilis."
```

---

## Prompt Industri

### P12. Beranda Industri
```
Rancang "Industri / Beranda" (desktop 1440, latar abu muda, kartu putih). Pakai P0 dan pola dashboard klien Upwork.

Susunan:
- Baris atas: logo perusahaan 56, "Selamat pagi, PT Nusantara Logistik", tombol utama "Buat RFQ" dan tombol sekunder "Cari UMKM".
- Strip stat dalam satu kartu (4 kolom): RFQ aktif 3, Penawaran masuk 11, Order berjalan 2, Dana di escrow Rp33.750.000.
- Dua kolom: utama 2/3, samping 1/3.
- Utama: kartu "RFQ saya" dengan tab garis bawah (Aktif, Draft, Selesai). Tiap baris: kode, judul, jenis, penanda "Tunggal" atau "4 lot", tenggat dengan sisa hari, chip jumlah kandidat cocok, bilah tipis "Penawaran masuk 3", badge status, tombol aksi (Lihat penawaran, Bandingkan). Satu RFQ tanpa penawaran dengan tenggat dekat diberi banner amber kecil. Kartu "Perlu tindakan" (penawaran baru menunggu evaluasi, sampel menunggu penilaian, order menunggu pendanaan dengan sisa waktu, order menunggu QC) dengan ikon dan tombol teks per baris. Kartu "Order berjalan" dengan stepper mini dan badge ganda status order + status dana.
- Samping: kartu "UMKM yang disarankan" (3 mini kartu: avatar, nama, pil tier, ★, kecocokan, tombol "Undang"), kartu "Dana escrow" (didanai, dirilis, tertahan, tautan), kartu "Aktivitas terbaru" (timeline 5 kejadian dengan waktu).
```

### P13. Wizard buat RFQ (10 langkah)
```
Rancang alur "Industri / Buat RFQ" (desktop 1440). Pakai P0. Form satu kolom lebar maksimal 720px dengan teks "Langkah X dari 10" dan bilah progres tipis, footer lengket berisi "Kembali", "Simpan draft", "Lanjut". Tampilkan frame untuk langkah-langkah berikut:

1. Jenis kebutuhan: tiga pilihan baris bergaris (Seragam dan pakaian kerja, Merchandise, Maklon untuk brand), tiap pilihan punya satu kalimat deskripsi. Template menyesuaikan.
2. Informasi dasar: judul, konteks singkat, visibilitas (Terbuka atau Undangan).
3. Item (frame terpenting): daftar item, tombol "Tambah item". Satu item dibuka berisi: nama item, kategori, bahan (jenis kain, rentang gsm, warna), toggle "Bahan disediakan pembeli", unggah desain atau tech pack (wajib untuk maklon), catatan konstruksi, dekorasi (Tidak ada/Bordir/Sablon/DTF) dan penempatan logo, tabel rincian ukuran (S, M, L, XL, XXL, kustom) dengan total otomatis "200 pcs" dan toleransi jumlah, label dan packing (termasuk "per nama karyawan"), standar mutu.
4. **Alokasi dan standar acuan:** dua pilihan baris bergaris, "Satu pemenang (tunggal)" dan "Bagi per lot (2-4 lot)". Bila tunggal, langkah selesai dengan satu kalimat penjelas. Bila lot: tombol "Bagi rata" dan "Bagi sesuai proporsi ukuran", tabel lot (Lot A-D) dengan rincian ukuran per lot dan total otomatis, bilah validasi "Jumlah semua lot sama dengan total item: 200 pcs" (tampilkan juga variasi error bila tidak sama). Di bawahnya bagian "Standar acuan bersama": aturan konsistensi bahan (Bahan disediakan pembeli / Satu sumber dengan kolom kode kain / Bebas dengan toleransi, dengan peringatan risiko variasi antar-lot), sampel acuan atau tech pack terkunci, toleransi dimensi, acuan warna, AQL, maksimal lot per UMKM (default 1), kebijakan harga antar lot (Tiap pemenang memakai harganya / Harga disamakan dengan pemenang terendah), toggle "Siapkan lot cadangan". Banner info saran: "Qty ini bisa dipenuhi satu UMKM. Membagi lot menambah risiko ketidakseragaman dan koordinasi."
5. Persyaratan: pilih syarat wajib dan nilai tambah (NIB, uji lab kain, pengalaman), minimal Readiness (opsional).
6. Sampel: perlu atau tidak, penanggung biaya, jumlah, tenggat sampel.
7. Jadwal dan pengiriman: tenggat tanya jawab, tenggat penawaran, target kirim, lokasi, kirim bertahap.
8. Komersial dan pembayaran: termin rilis dana (default 30% saat bahan tiba, 70% setelah QC lolos), penjelasan singkat "Anda mendanai penuh ke escrow setelah memilih pemenang", denda keterlambatan (opsional), anggaran indikatif (opsional, boleh disembunyikan dari UMKM).
9. Bobot evaluasi: empat input (Harga 35, Kesesuaian 25, Jadwal 20, Reputasi 20) dengan total otomatis 100.
10. Tinjau dan terbitkan: ringkasan semua isian (termasuk lot dan standar acuan bila ada) dan tombol "Terbitkan RFQ".

Di sisi kanan setiap langkah (mulai langkah 3), teks kecil lengket: "Perkiraan kandidat yang cocok: 12 UMKM" (pada mode lot ditampilkan per lot, mis. "Lot A: 9 UMKM") dengan petunjuk "Kurangi syarat uji untuk menambah kandidat".
Sertakan satu variasi error validasi (mis. total ukuran tidak sama dengan jumlah).
```

### P14. Detail RFQ: kandidat
```
Rancang "Industri / Detail RFQ - Kandidat" (desktop 1440). Pakai P0 dan pola daftar penyedia ala Upwork.

Susunan:
- Header RFQ-0007: judul, badge "Dibuka", ringkasan satu baris. Tab garis bawah: Ringkasan | Kandidat (aktif) | Penawaran (11) | Tanya Jawab | Addendum.
- Bilah urut dan filter ringan (kecocokan, Readiness, rating, jarak).
- Rail filter kiri 260px (tier, kota, rating, kapasitas) dan daftar kandidat di kanan dalam satu kartu.
- Tiap kandidat memakai anatomi Baris Penawaran/Kandidat di P0: avatar 56, nama UMKM (tautan), lokasi, pil tier, ★ 4,7 (12 ulasan), deret 3 foto portofolio 72px, angka kecocokan besar di kanan (86), strip metrik (kapasitas 3.000 pcs/bulan, tepat waktu 92%, lead time standar, order selesai 38), baris chip alasan ("Kategori sama", "Kapasitas 2x kebutuhan", "Bordir dikuasai"), tombol "Lihat profil" dan "Undang ke RFQ".
- Data: CV Karya Mandiri Konveksi 86, UD Sinar Jahit 82, Koperasi Penjahit Bersama 74, CV Tiga Warna Garmen 68.
- Tautan "Lihat rincian skor" membuka panel samping berisi skor per komponen dalam daftar sederhana.
- Variasi mode lot (RFQ-0008): tiap kandidat menampilkan chip lot yang cocok ("Cocok: Lot A, C").
- Variasi kosong: "Belum ada kandidat yang cocok" dengan saran melonggarkan syarat.
```

### P15. Cari UMKM (direktori)
```
Rancang "Industri / Cari UMKM" (desktop 1440). Pakai P0 dan pola pencarian penyedia ala Fiverr: grid kartu berfoto yang terisi.

Susunan:
- Judul "Cari UMKM konveksi", kolom pencarian lebar.
- Filter horizontal di atas hasil: layanan (Jahit CMT, Full package, Bordir, Sablon), kategori produk, kota, tier Readiness, kapasitas minimal, "Hanya yang terverifikasi". Urut: Paling relevan.
- Strip kategori dengan ikon di atas filter (Seragam, Wearpack, Polo, Jaket, Topi, Tote bag, Bordir, Sablon).
- Grid 4 kolom Kartu UMKM (anatomi di P0): foto 4:3, avatar, nama, pil tier, judul 2 baris, ★ rating, footer "Kapasitas 3.000 pcs/bulan" dan "MOQ 50 pcs". Minimal 12 kartu, paginasi di bawah. Hover memperlihatkan tombol "Undang ke RFQ".
- Dari halaman profil UMKM (sudut pandang industri): tombol utama "Undang ke RFQ" yang membuka modal pilih RFQ milik pembeli (RFQ berstatus Dibuka atau Undangan).
- Variasi hasil kosong.
```

### P16. Penawaran masuk dan perbandingan (RFQ tunggal)
```
Rancang "Industri / Penawaran dan Perbandingan" untuk RFQ-0007 (desktop 1440). Pakai P0. Pola daftar proposal ala Upwork, dengan tampilan perbandingan sederhana.

Frame 1, daftar penawaran:
- Header RFQ dan tab "Penawaran (3)" aktif. Bilah urut (Skor evaluasi, Harga, Jadwal) dan tombol "Bandingkan" (aktif jika 2-3 dipilih, ada kotak centang di tiap baris).
- Dua kolom: daftar 2/3 dan panel samping 1/3 (ringkasan RFQ, bobot evaluasi, tenggat revisi).
- Tiap penawaran sebagai baris proposal di dalam kartu: avatar 56, nama UMKM, pil tier, ★ rating, lokasi; di kanan skor evaluasi besar. Satu strip metrik 4 kolom: Total harga, Lead time dan tanggal kirim (dengan teks "Memenuhi" atau "Terlambat 8 hari"), Kesesuaian (mis. 7 dari 8), Readiness. Di bawahnya ringkasan "Deviasi: rompi memakai drill 250 gsm". Tombol "Lihat penawaran", "Shortlist", "Minta revisi".
- Data: CV Karya Mandiri Konveksi Rp33.750.000; UD Sinar Jahit Rp31.900.000; Koperasi Penjahit Bersama Rp30.400.000.

Frame 2, perbandingan:
- Tabel bersih: kolom pertama label lengket, tiga kolom penawaran. Baris: Total harga, Harga per item, Lead time, Tanggal kirim vs target, Kapasitas dialokasikan, Tingkat kesesuaian dan daftar deviasi, Termin pembayaran, Sampel, Readiness dan rating, Skor evaluasi (baris akhir, angka tebal).
- Di atas tabel: empat input bobot sebaris (Harga 35, Kesesuaian 25, Jadwal 20, Reputasi 20) dengan total 100.
- Di bawah tiap kolom: tombol "Shortlist", "Minta sampel", "Pilih sebagai pemenang". Modal konfirmasi pemenang dengan kolom alasan opsional dan teks "Order akan dibuat dan menunggu pendanaan escrow dalam 3 x 24 jam. Penawaran lain ditolak dengan umpan balik."
Warna hanya aksen biru, tint, dan warna status.
```

### P17. Papan alokasi lot (mode LOT)
```
Rancang "Industri / Papan Alokasi Lot" untuk RFQ-0008 (desktop 1440, latar abu muda, kartu putih). Pakai P0. Ini layar terpenting untuk split award. Tabel garis tipis di dalam kartu, sel terpilih bertint biru.

Susunan:
- Header RFQ-0008, badge "Evaluasi", ringkasan "4 lot x 50 pcs, maks 1 lot per UMKM, satu sumber kain KTC-140-NVY".
- Bagian "Papan alokasi": tabel dengan baris = Lot A sampai D, kolom = penawar (CV Karya Mandiri Konveksi, Konveksi Sinar Jaya, UD Sinar Jahit, Koperasi Penjahit Bersama). Isi sel: skor dan harga satuan (mis. "88 · Rp110.000"), strip "-" bila tidak menawar. Tiap sel dapat dipilih dengan pilihan radio per baris (satu pemenang per lot) dan satu pilihan "Cadangan" opsional. Sel terpilih ditandai garis biru tegas dan teks "Menang" atau "Cadangan". Penawar yang sudah menang di satu lot memperlihatkan peringatan teks pada lot lain "Batas 1 lot per UMKM".
- Banner info di atas tabel: "Saran alokasi: total skor 329. A CV Karya Mandiri Konveksi, B Konveksi Sinar Jaya, C Koperasi Penjahit Bersama, D UD Sinar Jahit." dengan tombol "Terapkan saran". Pembeli bebas mengubah.
- Bagian "Indikator konsistensi" berdampingan di samping atau di bawah tabel: selisih harga satuan antar pemenang (Rp108.000 s.d. Rp112.000, selisih Rp4.000 atau 3,7%), sumber bahan yang dinyatakan (tiga "KTC-140-NVY sesuai", satu "Belum dinyatakan" dengan penanda peringatan), deviasi pada matriks kesesuaian. Tiap peringatan punya tautan "Minta klarifikasi".
- Bagian "Status lot": ringkasan lot yang belum terisi dengan empat pilihan baris (Buka kembali dengan addendum, Gabungkan ke lot lain, Tawarkan ke runner-up, Lanjut parsial) dan tampil hanya bila ada lot kosong. Sertakan variasi "Lot D belum ada pemenang".
- Footer lengket: ringkasan "4 dari 4 lot terisi, total Rp...", tombol "Pilih pemenang dan buat order". Modal konfirmasi menjelaskan "Akan terbentuk satu order induk dan empat sub-order, masing-masing dengan dana, QC, dan ulasan sendiri."
```

### P18. Penilaian sampel
```
Rancang "Industri / Sampel" (desktop 1440). Pakai P0.

Susunan:
- Dari tab Penawaran, halaman "Sampel" untuk CV Karya Mandiri Konveksi: status (Sampel dikirim, resi, tanggal), tanggal tenggat.
- Form penilaian: skala 1-5 untuk Kesesuaian bahan, Jahitan dan konstruksi, Ukuran (toleransi dimensi), Finishing dan dekorasi; kolom catatan; unggah foto; tombol "Setujui sampel" dan "Tolak sampel" (tolak mewajibkan alasan).
- Setelah disetujui: banner teks "Sampel disetujui. Penawaran ini dapat dimenangkan." dan tombol "Pilih sebagai pemenang".
- Variasi mode lot (RFQ-0008): judul bagian "Dinilai terhadap standar acuan bersama" dan tampilkan standar acuan (sampel acuan, toleransi ±1 cm, acuan warna) di panel samping selama menilai. Daftar sampel dari beberapa UMKM pada satu lot tampil sebagai baris bersebelahan dengan skor masing-masing.
```

### P19. Pendanaan escrow
```
Rancang "Industri / Pendanaan Escrow" (desktop 1440). Pakai P0. Halaman satu kolom lebar maksimal 720px, sederhana dan menenangkan, seperti halaman pendanaan milestone di Upwork.

Susunan:
- Judul "Danai order OR-0007". Banner info: "Produksi dimulai setelah dana masuk escrow. Batas pendanaan 3 x 24 jam, sisa 2 hari 14 jam."
- Ringkasan order: pemasok CV Karya Mandiri Konveksi, item dan nilai (Rp33.750.000, belum termasuk PPN).
- Bagian "Cara dana dirilis" sebagai tiga baris bernomor: 1 Anda mendanai 100% (Rp33.750.000) ke escrow. 2 30% (Rp10.125.000) dirilis saat bahan tiba dan Anda konfirmasi (atau otomatis 2 x 24 jam tanpa keberatan). 3 70% (Rp23.625.000) dirilis setelah QC lolos (atau otomatis 5 hari kerja setelah barang diterima bila tidak ada sengketa).
- Bagian "Perlindungan": satu paragraf pendek bahwa dana dapat dikembalikan bila UMKM tidak memenuhi, dan sengketa diputus admin berdasarkan bukti.
- Pilihan metode bayar sederhana (mis. transfer virtual account), tombol utama "Danai Rp33.750.000". Teks kecil: "Pada versi demo, pembayaran disimulasikan."
- Variasi "Berhasil didanai": status "Didanai", tautan "Lihat order". Variasi "Batas waktu lewat": banner "Order dibatalkan karena tidak didanai."
- Variasi order induk: daftar sub-order (Lot A-D) dengan nilai masing-masing, tombol "Danai semua" dan opsi mendanai per sub-order.
```

### P20. Detail order dan QC (sisi industri)
```
Rancang "Industri / Detail Order dan QC" (desktop 1440). Pakai P0.

Susunan:
- Header: nomor order, pemasok, badge status order dan badge status dana berdampingan, tombol "Unduh PO (PDF)".
- Stepper tipis (Dikonfirmasi, Bahan siap, Produksi, Siap kirim, Dikirim, Diterima, QC, Selesai) dan timeline milestone dengan foto kecil. Pada milestone "Bahan tiba" tampil tombol "Konfirmasi dan rilis 30%" dan teks "Otomatis dirilis dalam 2 x 24 jam bila tidak ada keberatan".
- Dua kolom: kiri ringkasan order (item, harga, jadwal, termin, status dana per tahap), kanan kotak bergaris "Penerimaan dan QC": tabel jumlah diterima per ukuran, tabel reject per jenis cacat (Jahitan, Ukuran, Noda/kain, Dekorasi, Label/packing, dan khusus mode lot "Variasi antar-lot"), hasil (Lolos / Lolos dengan catatan / Gagal), catatan, unggah foto, tombol "Simpan hasil QC". Setelah QC lolos tampil "Sisa dana Rp23.625.000 dirilis ke UMKM".
- Variasi hasil gagal: banner "Perlu rework", tombol "Minta perbaikan" dan tautan "Buka sengketa", lalu variasi QC ulang. Dana tahap 2 tetap tertahan, jelaskan di satu kalimat.
- **Variasi order induk (RFQ-0008):** halaman "Order Induk" berisi tabel sub-order (Lot A-D: UMKM, qty, status order, status dana, hasil QC), status induk turunan ("Sebagian selesai"), dan blok "Perbandingan terhadap standar acuan" yang mencantumkan variasi warna atau ukuran antar-lot. Satu sub-order bermasalah memperlihatkan pilihan "Aktifkan cadangan", "Batalkan lot (dana tersisa dikembalikan)", "Terima jumlah parsial".
```

### P21. Pembatalan order dan ulasan
```
Rancang dua layar (desktop 1440). Pakai P0.

1. "Batalkan order" (modal besar atau halaman sempit 640px): pilih alasan, lalu bagian "Perhitungan dana" yang berubah sesuai tahap order. Contoh sebelum bahan tiba: "Dikembalikan Rp33.075.000 (biaya administrasi 2% Rp675.000)". Contoh setelah bahan tiba: "UMKM berhak kompensasi sesuai bukti (bahan dan progres). Besaran dihitung dari milestone dan dapat diputus admin bila tidak sepakat." Tombol bahaya "Batalkan order" dan catatan "Pembatalan tercatat pada rekam jejak pembeli".
2. "Beri ulasan" (modal setelah order selesai): bintang keseluruhan dan tiga aspek (Ketepatan waktu, Kesesuaian mutu, Komunikasi), kolom komentar, catatan kecil "Ulasan memengaruhi Readiness Score dan tidak dapat diubah". Pada order lot, ulasan per sub-order.
```

---

## Prompt bersama dan admin

### P22. Sengketa (pembeli dan UMKM)
```
Rancang alur "Sengketa" (desktop 1440). Pakai P0. Nada tenang, jelas, tidak menyudutkan. Tampilkan frame terpisah:

1. Buka sengketa: dari detail order. Pilih alasan (Tidak sesuai spesifikasi, Cacat, Terlambat, UMKM tidak aktif, Pembatalan, Pembayaran, Lainnya), pilih tuntutan (Refund penuh, Refund parsial, Rilis, Kompensasi) dengan kolom nominal, deskripsi, unggah bukti. Banner: "Dana yang belum dirilis akan dibekukan selama sengketa."
2. Halaman sengketa SGT-0003 (order RFQ-0007, alasan Cacat, tuntutan Refund parsial): header dengan badge status, stepper tipis (Dibuka, Menunggu tanggapan, Ditelaah admin, Diputus). Dua kolom: kiri "Bukti dan tanggapan" sebagai timeline (bukti pembeli berupa foto QC dan resi, tanggapan UMKM, bukti milestone), kanan kotak "Dana dibekukan Rp23.625.000" dan teks "Pihak lawan menanggapi dalam 3 x 24 jam".
3. Sisi penerima: pihak lawan melihat tuntutan dan tombol "Tanggapi" (form teks dan unggah bukti), serta sisa waktu.
4. Keputusan: kartu bergaris tegas "Keputusan admin" berisi hasil (Rilis penuh / Refund penuh / Proporsional / Rework dulu), rincian nominal, alasan tertulis, dan efek pada status dana. Tanpa ilustrasi.
```

### P23. Admin: verifikasi dan konfigurasi
```
Rancang "Admin" (desktop 1440). Pakai P0. Dua layar:

1. Antrian verifikasi: judul, tiga angka ringkas (Menunggu 14, Disetujui hari ini 6, Ditolak 2), tabel (organisasi, tipe, jumlah dokumen, tanggal masuk, status, tombol "Tinjau"). "Tinjau" membuka panel samping lebar: pratinjau dokumen di kiri, daftar dokumen dengan tombol "Setujui" dan "Tolak" di kanan (tolak wajib alasan, dengan alasan cepat sebagai chip), lalu tombol "Simpan keputusan".
2. Konfigurasi: tab garis bawah (Bobot Readiness, Bobot Matching, Aturan Rekomendasi, Parameter Platform, Kategori dan Layanan, Uji/Sertifikasi). Tab Bobot Readiness: enam input angka dengan total real-time dan validasi "Total harus 100", tombol "Simpan" dan "Pulihkan default". Tab Aturan Rekomendasi: tabel (komponen, kondisi, teks, poin, kesulitan) dengan aksi ubah/hapus. **Tab Parameter Platform:** daftar label-nilai yang dapat diubah: komisi 5%, jumlah lot minimum 2 dan maksimum 4, qty minimum per lot 20 pcs, batas pendanaan 3 x 24 jam, konfirmasi otomatis bahan tiba 2 x 24 jam, konfirmasi otomatis QC 5 hari kerja, tenggang UMKM tidak aktif 3 x 24 jam, jendela klaim sengketa 5 hari kerja, biaya administrasi pembatalan 2%, dan tabel matriks kompensasi pembatalan. Tiap perubahan membutuhkan konfirmasi dan tercatat di audit log.
```

### P24. Admin: sengketa dan ledger escrow
```
Rancang "Admin / Sengketa dan Ledger" (desktop 1440). Pakai P0. Padat informasi dalam kartu putih, tabel dengan garis tipis.

1. Antrian sengketa: tiga angka (Menunggu ditelaah 4, Rata-rata selesai 3,2 hari, Diputus bulan ini 11), tabel (nomor, order, pembuka, alasan, nominal dibekukan, sisa waktu, status, tombol "Telaah"). "Telaah" membuka halaman dua kolom: kiri ringkasan order dan bukti kedua pihak (milestone, QC, resi, tech pack, addendum, tanya jawab) dalam daftar bertab, kanan panel "Keputusan": pilihan Rilis penuh / Refund penuh / Proporsional (input nominal dengan total otomatis sama dengan dana dibekukan) / Rework dulu (tenggat baru), kolom alasan tertulis wajib, tombol "Putuskan". Modal konfirmasi menjelaskan dampak ke status dana dan skor.
2. Ledger escrow: tabel append-only (waktu, order, tipe: Fund, Hold, Release, Refund, Fee, Adjust, jumlah, referensi milestone/QC/sengketa, pelaku sistem atau admin). Di atas tabel, tiga angka (Dana masuk, Dikeluarkan, Tertahan) dan baris pemeriksaan satu kalimat: "Dana masuk = dirilis + dikembalikan + komisi + tertahan: Seimbang" dengan tanda teks hijau, dan variasi "Selisih Rp...: perlu rekonsiliasi" berwarna merah. Tab kedua "Komisi" berisi total komisi per bulan dan tabel per order. Tanpa grafik. Tidak ada tombol untuk mengubah atau menghapus baris.
```

---

## Komponen, state, dan mobile

### P25. Pustaka komponen dan state
```
Buat satu halaman "Library Komponen dan State" (desktop). Pakai P0. Tampilkan semua komponen beserta varian: tombol (semua tipe, hover, disabled, loading), input (default, fokus, error, disabled), select, checkbox, radio, toggle, unggah file, badge status (semua daftar di P0, termasuk status dana dan sengketa), badge ganda "status order + status dana", baris RFQ (anatomi lengkap), baris kandidat/penawaran, kartu UMKM (untuk grid direktori), panel samping, strip stat, rail filter, chip dan chip filter aktif, avatar dan logo usaha, panel "Rekam Jejak Pembeli", tab, tabel perbandingan, sel papan alokasi (default, terpilih Menang, Cadangan, peringatan), stepper wizard, stepper order, baris milestone dengan keterangan dana, banner (info, peringatan, bahaya), modal, toast, breadcrumb, paginasi. Lalu state: kosong (belum ada RFQ, belum ada penawaran, tanpa kandidat), skeleton loading, error 404 dan koneksi, banner dokumen kedaluwarsa dan ditolak, banner addendum, banner menunggu pendanaan, banner dana dibekukan, dialog konfirmasi tindakan berisiko (tarik penawaran, batalkan RFQ, batalkan order, pilih pemenang). Empty state memakai ikon outline 32px. Gunakan Auto Layout dan variants.
```

### P26. Versi mobile layar kunci
```
Rancang versi mobile (390 x 844) untuk peran UMKM: (1) Beranda, (2) Daftar RFQ, (3) Detail RFQ dengan tombol "Ajukan penawaran" lengket di bawah, (4) Readiness Score, (5) Form penawaran (bagian dapat dilipat), (6) Detail order dengan milestone dan status dana, (7) Unggah bukti milestone dengan kamera. Pakai P0, navigasi bawah 4 tab (Beranda, RFQ, Penawaran, Order), area sentuh minimal 44px, tabel menjadi daftar label-nilai. Padat seperti aplikasi Upwork dan Fiverr di ponsel (kartu penuh lebar, chip, avatar), tetapi tetap terbaca.
```

---

## 5. Prompt iterasi

**Cek kemiripan gaya (jalankan pada layar mana pun)**
```
Periksa layar ini terhadap arah gaya P0: padat informasi tetapi rapi seperti Upwork dan Fiverr, industrial tenang, mudah dibaca. Daftar yang melanggar: layar lengang, baris daftar yang membawa kurang dari 5 potong informasi, bayangan tebal, gradien, kartu bersarang, warna aksen berlebih, sidebar, teks di bawah 13px. Perbaiki satu per satu tanpa mengubah konten inti, lalu ringkas perubahannya dalam 5 baris.
```

**Layar terlalu kosong (tambah kepadatan ala Upwork/Fiverr)**
```
Layar ini terlalu lengang. Latar jadikan abu muda #F6F7F9 dan bungkus tiap bagian dalam kartu putih bergaris tipis radius 12. Perkaya tiap baris daftar dengan metadata (meta posting, ringkasan, chip, ★ rating, lokasi, badge status, tombol aksi) sesuai anatomi Baris RFQ atau Kartu UMKM di P0. Tambahkan strip stat di atas, panel samping (ringkasan, rekam jejak, langkah berikutnya), avatar, dan foto placeholder konveksi. Jangan menambah gradien atau warna aksen baru.
```

**Konsistensi dengan design system**
```
Periksa layar ini terhadap P0. Sesuaikan warna, tipografi, spacing, radius, dan badge status agar konsisten tanpa mengubah konten. Ganti elemen yang berdiri sendiri dengan komponen dari library.
```

**Terlalu ramai (rapikan)**
```
Layar ini terlalu ramai. Hapus elemen yang tidak membawa informasi (dekorasi, bayangan, kartu bersarang, ikon berlebih), kelompokkan isi dalam kartu, perjelas hierarki lewat ukuran teks, ketebalan, dan spasi, dan batasi tiap baris daftar pada 5 sampai 7 potong informasi.
```

**Perbaiki keterbacaan**
```
Perbaiki keterbacaan: ukuran isi 16px, tinggi baris 26px, lebar teks maksimal sekitar 68 karakter, heading jelas, label-nilai rapi, jarak antarbagian lebih lega. Jangan menambah elemen baru.
```

**Perbaiki teks**
```
Tulis ulang teks UI agar sederhana, singkat, dan mudah dipahami pelaku UMKM yang tidak terbiasa aplikasi. Hindari istilah teknis atau beri keterangan singkat.
```

**Tambah state**
```
Buat variasi layar ini untuk state: kosong, memuat (skeleton), error, dan data panjang (teks panjang, banyak baris). Pertahankan gaya yang sama.
```

**Versi mobile**
```
Buat versi mobile 390 px: ubah tabel menjadi daftar label-nilai, jadikan filter sebagai bottom sheet, dan letakkan tombol aksi utama lengket di bawah.
```

**Audit aksesibilitas**
```
Audit layar ini untuk kontras WCAG AA, ukuran teks, area sentuh, dan penggunaan warna sebagai satu-satunya pembeda. Sebutkan masalahnya lalu perbaiki.
```

**Prototipe alur**
```
Hubungkan layar-layar berikut menjadi prototipe alur interaktif: [daftar layar]. Tetapkan transisi, tombol yang dapat diklik, dan titik awal.
```

---

## 6. Daftar periksa sebelum presentasi

- [ ] Variables warna dan tipografi sudah dibuat dan dipakai di semua layar
- [ ] Gaya konsisten: navigasi atas, latar abu muda dengan kartu putih, baris daftar padat (5 sampai 7 potong informasi), panel kanan lengket, satu warna aksen, tanpa gradien dan bayangan tebal
- [ ] Tidak ada layar yang terlihat lengang (cek terhadap Upwork dan Fiverr)
- [ ] Layar inti RFQ dan penawaran (P7, P8, P13, P16) sudah rapi
- [ ] Layar pembeda model broker (P17 papan alokasi, P19 pendanaan, P20 order induk dan QC, P22 sengketa, P24 ledger) sudah rapi
- [ ] Data contoh konsisten (RFQ-0007, tiga penawaran, empat kandidat, dana Rp33.750.000, RFQ-0008 empat lot)
- [ ] Status order dan status dana selalu tampil berdampingan
- [ ] Minimal 4 alur prototipe: (1) UMKM: lihat RFQ → isi form penawaran → kirim, (2) Industri: buat RFQ lot → papan alokasi → pilih pemenang → danai escrow, (3) Order: milestone → QC gagal → rework → rilis dana atau sengketa, (4) Admin: verifikasi dokumen dan putus sengketa
- [ ] Penamaan frame mengikuti `Peran / Layar / State`
- [ ] Teks UI berbahasa Indonesia dan bebas typo
- [ ] Kontras dan ukuran teks sudah diperiksa
- [ ] Satu slide ringkasan design system (warna, tipografi, komponen) untuk presentasi