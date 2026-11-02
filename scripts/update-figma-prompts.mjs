import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "docs/design/PROMPT_FIGMA.md");
let content = fs.readFileSync(filePath, "utf8");

// 1. Header dan pengantar
content = content.replace(
  "# PROMPT_FIGMA: Prompt Desain UI RantaiNaik (v3.1, padat dan rapi gaya Upwork/Fiverr)",
  "# PROMPT_FIGMA: Prompt Desain UI RantaiNaik (v4.0, Modern Industrial Kompartemen Bergaris)"
);

content = content.replace(
  `> **Arah desain (revisi kepadatan):** rapi dan bersih, tetapi **padat informasi seperti Upwork dan Fiverr**, bukan halaman lengang. Setiap layar terisi kartu, baris daftar yang kaya metadata, chip, avatar, foto, rating, dan panel samping. Industrial yang tenang, mudah dibaca. Yang dipinjam hanya struktur dan kepadatannya, bukan warna, logo, atau elemen merek.`,
  `> **Arah desain (Modern Industrial):** bersih, teknis, tenang, dan **padat informasi terstruktur ala Upwork**, bukan halaman lengang. Halaman dibagi menjadi kompartemen (panel) bergaris 1px #E5E7EB di atas latar putih murni #FFFFFF (tanpa latar abu, kartu bertumpuk, efek transparansi, atau elemen kapsul/lonjong). Navigasi utama berada di sidebar kiri 240px, bukan di header.`
);

// 2. Tabel 0.1 Peta Pola
content = content.replace(
  `| Navigasi atas dengan pencarian, menu, notifikasi, avatar (Upwork, Fiverr) | Semua peran |`,
  `| Header ringkas 56px (logo, cari, notifikasi, akun) + Sidebar kiri 240px per peran (Upwork) | Semua peran |`
);

content = content.replace(
  `| Latar halaman abu muda dengan **kartu putih bergaris tipis** (Upwork) | Seluruh halaman aplikasi, supaya halaman terasa terisi dan terstruktur |`,
  `| Latar putih murni #FFFFFF dengan **kompartemen (panel) bergaris 1px #E5E7EB** (Upwork) | Seluruh halaman aplikasi, kompartemen bersebelahan berbagi satu garis |`
);

content = content.replace(
  `| Pil, chip, badge level penjual (Fiverr) | Tier Readiness, layanan, bahan |`,
  `| Badge persegi radius 2px, filter chip persegi radius 4px, tab garis bawah, tanpa elemen lonjong | Tier Readiness, layanan, bahan |`
);

// 3. P0 Design System
const p0Old = `## P0. Design system dan aturan global

> Tempel ini di awal setiap sesi.

\`\`\`
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
- Empty state: ikon outline 32px abu, satu kalimat, satu tombol. Toast kecil di kanan bawah.`;

const p0New = `## P0. Design system dan aturan global

> Tempel ini di awal setiap sesi.

\`\`\`
Kamu adalah desainer UI/UX senior. Rancang UI web app B2B bernama "RantaiNaik".

TENTANG PRODUK
Platform pengadaan tekstil berbentuk broker, mirip marketplace jasa. Industri/pembeli (perusahaan, brand lokal) memposting RFQ (permintaan penawaran) untuk seragam, merchandise, atau maklon. UMKM konveksi mengirim penawaran terstruktur. Satu RFQ bisa dikerjakan satu UMKM (tunggal) atau dibagi 2-4 lot ke beberapa UMKM dengan standar yang sama. Pembayaran lewat escrow: pembeli mendanai penuh di awal, dana dirilis per milestone dan QC, sengketa diputus admin. Ada Readiness Score (0-100) yang menunjukkan kesiapan UMKM menjadi pemasok. Tiga peran: Industri (pembeli), UMKM (pemasok), Admin.

ARAH GAYA (penting)
Modern industrial, bersih, teknis, tenang, dan nyaman dibaca lama. Halaman dibagi menjadi kompartemen (panel) bergaris 1px #E5E7EB di atas latar putih murni #FFFFFF, bukan kartu bertumpuk. Kompartemen bersebelahan berbagi satu garis pembatas. Kompartemen sekunder menggunakan #FAFBFC. Kepadatan data terstruktur ala Upwork: baris daftar kaya metadata (judul, ringkasan, chip persegi, rating, lokasi, badge status persegi), avatar, panel samping ringkasan, strip angka, dan filter rail di kiri. Nuansa industrial teknis yang tenang: garis tipis tegas, border kontrol kontras minimal 3:1 (#8B93A1), satu warna aksen biru.
Kepadatan: tiap baris daftar membawa 5 sampai 7 potong informasi. Tidak boleh ada layar yang lengang. Bila satu kolom terlihat kosong, isi dengan panel samping yang relevan.
JANGAN: bentuk lonjong/kapsul di mana pun, latar abu-abu di halaman, kartu bertumpuk dengan bayangan, efek transparansi atau filter blur, gradien warna-warni, bayangan tebal, banyak warna aksen, warna hardcode di komponen, navigasi utama di header.

BAHASA UI
Bahasa Indonesia yang sederhana dan lugas. Hindari istilah teknis atau beri keterangan singkat.

UKURAN DAN LAYOUT
Desktop 1440. Header ringkas 56px putih solid dengan garis bawah 1px #E5E7EB: logo di kiri, kolom pencarian (lebar 280), ikon notifikasi, avatar akun (tanpa menu navigasi). Navigasi utama berada di SIDEBAR kiri selebar 240px (dapat diciutkan 64px) per peran; item aktif bergaris aksen kiri 2px biru #2862E0. Konten kerja fleksibel, gutter 24px. Latar kanvas putih #FFFFFF dengan kompartemen bergaris 1px #E5E7EB; kompartemen sekunder #FAFBFC. Mobile 390 dengan drawer sidebar dari tombol menu header. Irama spasi 4/8/12/16/24/32/48.
Menu sidebar: UMKM (Beranda, Cari RFQ, Penawaran, Order, Dana), Industri (Beranda, RFQ Saya, Cari UMKM, Order, Dana), Admin (Verifikasi, Sengketa, Ledger, Konfigurasi, Pengguna).

DESIGN TOKENS
- Teks utama #0E1422, sekunder #5B6475 (kontras 5.3:1), tersier/border kontrol #8B93A1 (kontras 3.1:1)
- Garis pembagi #E5E7EB, garis kontrol tegas #8B93A1
- Latar halaman aplikasi #FFFFFF, panel kompartemen #FFFFFF, permukaan halus #FAFBFC, pita gelap #0E1422 (landing dan footer)
- Aksen tunggal: biru #2862E0, hover #2858B8, tint #EFF4FE (badge info, baris terpilih, banner info)
- Semantik status: sukses #15803D / #F0FDF4, peringatan #B45309 / #FFFBEB, bahaya #B91C1C / #FEF2F2. Bintang rating #F59E0B.
- Tokyo Night (hanya blok kode/terminal): background #1A1B26, teks #A9B1D6, aksen #C0CAF5.
- Tipografi: Geist (judul), Inter (isi teks), Geist Mono (kode RFQ-0007, nomor order, label bagian, harga tabular).
  Judul baris daftar 18/26 semibold biru. Isi daftar 14/22. Isi halaman detail 16/26. Meta 13/18 tersier. H1 28/36 semibold, H2 22/30 semibold, H3 18/26 semibold. Angka stat 28/36 semibold. Label bagian huruf kapital kecil 11-12px font mono, letter-spacing 0.06em, warna sekunder.
  Nominal rupiah penuh dengan titik ribuan (Rp33.750.000), tabular figures. Lebar paragraf maksimal sekitar 70 karakter.
- Radius: panel 0px bersambung, tombol dan input 4px, badge persegi 2px, dialog 4px, foto 4px. DILARANG bentuk kapsul atau lonjong.
- Bayangan: tanpa bayangan pada panel kompartemen atau tombol. Bayangan hanya untuk elemen mengambang (dropdown, dialog, tooltip: 0 4px 16px rgba(14,20,34,0.08)).
- Ikon outline 1.5px: 16px di baris meta (lokasi, jam, centang terverifikasi, simpan), 20px di sidebar, 24px di strip kategori.
- Avatar kotak radius 4px atau bulat 32/40/56/96. Logo usaha kotak radius 4px. Foto: pakai placeholder konveksi di direktori UMKM, portofolio, dan hero landing.
- Spasi: padding kompartemen 20-24, jarak antarbagian 24-32.

KOMPONEN (padat dan konsisten)
- Tombol: utama (biru solid, tanpa bayangan), netral (#0E1422), sekunder (putih, border 1px #8B93A1), teks, bahaya. Radius 4px, tinggi 40px, kecil 32px.
- Input 40px, border 1px #8B93A1, fokus ring 2px #2862E0. Radius 4px. Label di atas, teks bantu di bawah.
- Chip filter: persegi radius 4px abu #FAFBFC border #E5E7EB 13px untuk layanan, bahan, kategori. Chip filter aktif: border #2862E0 tint biru dengan tanda silang.
- Tab garis bawah dengan jumlah di sebelah label (mis. "Penawaran (3)").
- Tabel: pemisah baris tipis 1px #E5E7EB, header latar #FAFBFC, teks angka tabular-nums font mono.
- BARIS RFQ (gaya baris pekerjaan Upwork), di dalam kompartemen bergaris 1px #E5E7EB, padding 20-24, ikon simpan di kanan atas:
  1 meta kecil: "Diposting 2 jam lalu · Seragam · Tunggal"
  2 judul biru 18/26 semibold (tautan)
  3 ringkasan: "Total 300 pcs · 2 item · Target kirim 15 Jan 2027 · Anggaran Rp30-35 juta"
  4 deskripsi 2-3 baris dengan "selengkapnya"
  5 chip persegi: Kemeja kerja, Katun TC, Bordir, Sablon, Full package
  6 baris pembeli: centang "Terverifikasi", ★ 4,9, "Didanai tepat waktu 100%", lokasi, "Penawaran: 3 dari 11"; di kanan badge persegi tint biru "Kecocokan 86%".
- KOMPARTEMEN UMKM: foto 4:3 di atas dengan ikon simpan di pojok; avatar, nama, badge tier persegi 2px; judul 2 baris ("Konveksi seragam kantor, bordir dan sablon"); ★ 4,7 (12); garis tipis; footer "Kapasitas 3.000 pcs/bulan" di kiri dan "MOQ 50 pcs" di kanan.
- BARIS PENAWARAN/KANDIDAT (gaya proposal Upwork): avatar 56, nama (tautan), badge tier persegi 2px, ★ rating, lokasi; deret 3 foto portofolio 72px; chip alasan; strip metrik 4 kolom bergaris; skor besar di kanan; tombol Shortlist, Lihat, Undang.
- PANEL SAMPING (gaya "Tentang klien"): kompartemen putih bergaris 1px, judul label kapital kecil font mono, baris label-nilai dengan ikon 16px.
- STRIP STAT: satu kompartemen bergaris, 3-4 kolom dipisah garis vertikal tipis, angka 28/36 di atas, label 13 di bawah.
- RAIL FILTER: lebar 260, grup dapat dilipat dengan chevron, kotak centang dengan jumlah hasil di kanan ("Seragam (24)"), tautan "Hapus semua".
- Badge status: persegi kecil radius 2px dengan titik warna dan teks.
- Stepper wizard: "Langkah 3 dari 10" dengan bilah progres tipis. Stepper order: 8 titik dengan label.
- Banner: kotak dengan tint, border 1px, garis kiri 3px, ikon 16px, satu atau dua baris teks.
- Empty state: ikon outline 32px abu, satu kalimat, satu tombol. Toast kecil di kanan bawah.`;

content = content.replace(p0Old, p0New);

// 4. Update status tier readiness
content = content.replace(
  `Tier Readiness: Tahap Awal (abu), Berkembang (amber), Siap Kemitraan (biru), Siap Industri (hijau), tampil sebagai pil dengan titik warna.`,
  `Tier Readiness: Tahap Awal (abu), Berkembang (amber), Siap Kemitraan (biru), Siap Industri (hijau), tampil sebagai badge persegi radius 2px dengan titik warna.`
);

// 5. Sapu dari P1 sampai P26
// P1 Landing
content = content.replace(
  `8. "Readiness Score": dua kolom. Kiri tiga poin teks dengan ikon centang. Kanan kartu contoh skor 68/100 dengan pil tier dan enam bilah komponen.`,
  `8. "Readiness Score": dua kolom. Kiri tiga poin teks dengan ikon centang. Kanan panel contoh skor 68/100 dengan badge tier persegi 2px dan enam bilah komponen.`
);

// P3 UMKM Beranda
content = content.replace(
  `Rancang "UMKM / Beranda" (desktop 1440, latar abu muda, semua konten dalam kartu putih bergaris). Pakai P0 dan pola Upwork "Find work".`,
  `Rancang "UMKM / Beranda" (desktop 1440, latar putih murni, semua konten dalam kompartemen bergaris 1px #E5E7EB dengan sidebar kiri 240px). Pakai P0 dan pola Upwork "Find work".`
);
content = content.replace(
  `- Baris atas: logo usaha 56, "Selamat pagi, CV Karya Mandiri Konveksi", pil tier "Siap Kemitraan", tombol "Cari RFQ" di kanan.`,
  `- Baris atas: logo usaha 56, "Selamat pagi, CV Karya Mandiri Konveksi", badge tier persegi "Siap Kemitraan", tombol "Cari RFQ" di kanan.`
);
content = content.replace(
  `- Kartu "RFQ yang cocok untukmu" dengan tab garis bawah (Rekomendasi, Terbaru, Tersimpan). Isi 4 Baris RFQ lengkap sesuai anatomi di P0 (meta, judul, ringkasan, deskripsi, chip, baris pembeli, pil kecocokan). Tautan "Lihat semua RFQ".`,
  `- Kompartemen "RFQ yang cocok untukmu" dengan tab garis bawah (Rekomendasi, Terbaru, Tersimpan). Isi 4 Baris RFQ lengkap sesuai anatomi di P0 (meta, judul, ringkasan, deskripsi, chip persegi, baris pembeli, badge kecocokan persegi). Tautan "Lihat semua RFQ".`
);
content = content.replace(
  `- "Readiness Score": angka besar 68/100, pil tier, bilah tersegmen empat tier, tautan "Lihat rincian", dan satu baris "Langkah tercepat: Unggah SOP QC jahit (+5)".`,
  `- "Readiness Score": angka besar 68/100, badge tier persegi, bilah tersegmen empat tier, tautan "Lihat rincian", dan satu baris "Langkah tercepat: Unggah SOP QC jahit (+5)".`
);
content = content.replace(
  `- Kartu profil kiri: logo usaha 96, nama, lokasi, pil tier, ★ 4,7 (12 ulasan), tombol "Edit profil". Di bawah garis: daftar label-nilai dengan ikon (Anggota sejak 2026, Tepat waktu 92%, 38 order selesai, Waktu respons < 24 jam, Kapasitas 3.000 pcs/bulan). Lalu "Layanan"`,
  `- Panel profil kiri: logo usaha 96, nama, lokasi, badge tier persegi, ★ 4,7 (12 ulasan), tombol "Edit profil". Di bawah garis: daftar label-nilai dengan ikon (Anggota sejak 2026, Tepat waktu 92%, 38 order selesai, Waktu respons < 24 jam, Kapasitas 3.000 pcs/bulan). Lalu "Layanan"`
);

// P4 UMKM Profil
content = content.replace(
  `Rancang "UMKM / Profil dan Kapabilitas" (desktop 1440, latar abu muda, kartu putih). Pakai P0 dan pola profil penyedia Fiverr/Upwork.`,
  `Rancang "UMKM / Profil dan Kapabilitas" (desktop 1440, latar putih murni, kompartemen bergaris dengan sidebar kiri 240px). Pakai P0 dan pola profil penyedia Upwork.`
);

// P5 Readiness Score
content = content.replace(
  `1. Judul dan tanggal hitung terakhir. Angka besar "68/100" dengan pil tier "Siap Kemitraan". Di bawahnya satu bilah tipis bersegmen empat tier (0-39, 40-59, 60-79, 80-100) dengan penanda posisi.`,
  `1. Judul dan tanggal hitung terakhir. Angka besar "68/100" dengan badge tier persegi "Siap Kemitraan". Di bawahnya satu bilah tipis bersegmen empat tier (0-39, 40-59, 60-79, 80-100) dengan penanda posisi.`
);

// P6 Direktori UMKM
content = content.replace(
  `3. Grid hasil: 12 kartu UMKM (3 kolom). Tiap kartu memakai anatomi Kartu UMKM di P0 (foto 4:3, avatar, nama, pil tier, judul 2 baris, rating, kapasitas, MOQ).`,
  `3. Grid hasil: 12 kompartemen UMKM (3 kolom). Tiap kompartemen memakai anatomi Kompartemen UMKM di P0 (foto 4:3, avatar, nama, badge tier persegi, judul 2 baris, rating, kapasitas, MOQ).`
);

// P7 Detail RFQ
content = content.replace(
  `Rancang "UMKM / Detail RFQ" (desktop 1440, latar abu muda, kartu putih). Pakai P0 dan pola halaman detail pekerjaan Upwork. Padat tetapi mudah dibaca.`,
  `Rancang "UMKM / Detail RFQ" (desktop 1440, latar putih murni, kompartemen bergaris dengan sidebar kiri 240px). Pakai P0 dan pola halaman detail pekerjaan Upwork. Padat tetapi mudah dibaca.`
);

// P8 Form Penawaran
content = content.replace(
  `1. Strip atas: judul RFQ, nama industri dengan centang verifikasi, anggaran, target kirim, status dana (Awaiting funding / Funded), dan badge penawaran kamu ("Draft").`,
  `1. Strip atas: judul RFQ, nama industri dengan centang verifikasi, anggaran, target kirim, status dana (Awaiting funding / Funded), dan badge penawaran kamu ("Draft", persegi radius 2px).`
);

// P9 Cari RFQ
content = content.replace(
  `Rancang "UMKM / Cari RFQ" (desktop 1440, latar abu muda). Pakai P0 dan pola Upwork "Find work".`,
  `Rancang "UMKM / Cari RFQ" (desktop 1440, latar putih murni dengan sidebar kiri 240px). Pakai P0 dan pola Upwork "Find work".`
);
content = content.replace(
  `- Kolom hasil: baris di dalam satu kartu, bar atas "41 RFQ" dan pilihan urut. Tiap baris memakai anatomi Baris RFQ di P0 secara lengkap. Pada RFQ lot, ringkasan menulis "4 lot x 50 pcs" dan pil kecocokan menulis "Cocok untuk Lot A, C".`,
  `- Kolom hasil: baris di dalam kompartemen bergaris, bar atas "41 RFQ" dan pilihan urut. Tiap baris memakai anatomi Baris RFQ di P0 secara lengkap. Pada RFQ lot, ringkasan menulis "4 lot x 50 pcs" dan badge kecocokan menulis "Cocok untuk Lot A, C".`
);

// P11 Penawaran dan Order
content = content.replace(
  `Rancang "UMKM / Penawaran dan Order Saya" (desktop 1440, latar abu muda). Pakai P0 dan pola "My jobs" Upwork.`,
  `Rancang "UMKM / Penawaran dan Order Saya" (desktop 1440, latar putih murni dengan sidebar kiri 240px). Pakai P0 dan pola "My jobs" Upwork.`
);

// P12 Industri Beranda
content = content.replace(
  `Rancang "Industri / Beranda" (desktop 1440, latar abu muda, kartu putih). Pakai P0 dan pola dashboard klien Upwork.`,
  `Rancang "Industri / Beranda" (desktop 1440, latar putih murni, kompartemen bergaris dengan sidebar kiri 240px). Pakai P0 dan pola dashboard klien Upwork.`
);
content = content.replace(
  `- Samping: kartu "UMKM yang disarankan" (3 mini kartu: avatar, nama, pil tier, ★, kecocokan, tombol "Undang"), kartu "Dana escrow" (didanai, dirilis, tertahan, tautan), kartu "Aktivitas terbaru" (timeline 5 kejadian dengan waktu).`,
  `- Samping: panel "UMKM yang disarankan" (3 mini baris: avatar, nama, badge tier persegi, ★, kecocokan, tombol "Undang"), panel "Dana escrow" (didanai, dirilis, tertahan, tautan), panel "Aktivitas terbaru" (timeline 5 kejadian dengan waktu).`
);

// P14 Kandidat
content = content.replace(
  `- Tiap kandidat memakai anatomi Baris Penawaran/Kandidat di P0: avatar 56, nama UMKM (tautan), lokasi, pil tier, ★ 4,7 (12 ulasan), deret 3 foto portofolio 72px, angka kecocokan besar di kanan (86), strip metrik (kapasitas 3.000 pcs/bulan, tepat waktu 92%, lead time standar, order selesai 38), baris chip alasan kecocokan, tombol "Shortlist", "Lihat profil", "Undang menawar".`,
  `- Tiap kandidat memakai anatomi Baris Penawaran/Kandidat di P0: avatar 56, nama UMKM (tautan), lokasi, badge tier persegi, ★ 4,7 (12 ulasan), deret 3 foto portofolio 72px, angka kecocokan besar di kanan (86), strip metrik (kapasitas 3.000 pcs/bulan, tepat waktu 92%, lead time standar, order selesai 38), baris chip alasan kecocokan, tombol "Shortlist", "Lihat profil", "Undang menawar".`
);

// P15 Dana UMKM
content = content.replace(
  `Rancang "UMKM / Dana" (desktop 1440). Pakai P0. Halaman berbasis tabel dan angka dalam kartu putih bergaris di atas latar abu muda.`,
  `Rancang "UMKM / Dana" (desktop 1440). Pakai P0. Halaman berbasis tabel dan angka dalam kompartemen bergaris di atas latar putih murni.`
);

// P17 Papan Alokasi Lot
content = content.replace(
  `Rancang "Industri / Papan Alokasi Lot" untuk RFQ-0008 (desktop 1440, latar abu muda, kartu putih). Pakai P0. Ini layar terpenting untuk split award. Tabel garis tipis di dalam kartu, sel terpilih bertint biru.`,
  `Rancang "Industri / Papan Alokasi Lot" untuk RFQ-0008 (desktop 1440, latar putih murni, kompartemen bergaris dengan sidebar kiri 240px). Pakai P0. Ini layar terpenting untuk split award. Tabel garis tipis di dalam kompartemen, sel terpilih bertint biru.`
);

// P18 Penawaran Masuk
content = content.replace(
  `- Tiap baris penawaran: avatar 56, nama UMKM (tautan), pil tier, lokasi, ★ rating; harga total (besar tebal) dan harga satuan; waktu pengiriman; riwayat revisi (Revisi 1); tombol "Lihat rincian", "Pilih pemenang", "Minta revisi", "Tolak".`,
  `- Tiap baris penawaran: avatar 56, nama UMKM (tautan), badge tier persegi, lokasi, ★ rating; harga total (besar tebal) dan harga satuan; waktu pengiriman; riwayat revisi (Revisi 1); tombol "Lihat rincian", "Pilih pemenang", "Minta revisi", "Tolak".`
);

// P23 Admin Verifikasi
content = content.replace(
  `Rancang "Admin / Verifikasi dan Kurasi" (desktop 1440). Pakai P0. Padat informasi dalam kartu putih, tabel dengan garis tipis.`,
  `Rancang "Admin / Verifikasi dan Kurasi" (desktop 1440). Pakai P0. Padat informasi dalam kompartemen bergaris 1px #E5E7EB, tabel dengan garis tipis, dengan sidebar kiri 240px.`
);
content = content.replace(
  `- Tabel antrian (18 baris): nama usaha, tipe (Industri / UMKM), tanggal daftar, dokumen (NIB, NPWP, Akta, KTP, Foto bengkel, Bukti rekening) dengan badge centang hijau atau silang abu-abu, kelengkapan (80%), pil tier awal, status akun (Pending / Ditinjau), tombol "Telaah".`,
  `- Tabel antrian (18 baris): nama usaha, tipe (Industri / UMKM), tanggal daftar, dokumen (NIB, NPWP, Akta, KTP, Foto bengkel, Bukti rekening) dengan badge centang hijau atau silang abu-abu, kelengkapan (80%), badge tier awal, status akun (Pending / Ditinjau), tombol "Telaah".`
);

// P24 Admin Sengketa & Ledger
content = content.replace(
  `Rancang "Admin / Sengketa dan Ledger" (desktop 1440). Pakai P0. Padat informasi dalam kartu putih, tabel dengan garis tipis.`,
  `Rancang "Admin / Sengketa dan Ledger" (desktop 1440). Pakai P0. Padat informasi dalam kompartemen bergaris 1px #E5E7EB, tabel dengan garis tipis, dengan sidebar kiri 240px.`
);

// P26 Mobile
content = content.replace(
  `Padat seperti aplikasi Upwork dan Fiverr di ponsel (kartu penuh lebar, chip, avatar), tetapi tetap terbaca.`,
  `Padat seperti aplikasi Upwork di ponsel (kompartemen penuh lebar, chip persegi, avatar), tetapi tetap terbaca.`
);

// 6. Bagian 5 (Prompt Iterasi)
content = content.replace(
  `Periksa layar ini terhadap arah gaya P0: padat informasi tetapi rapi seperti Upwork dan Fiverr, industrial tenang, mudah dibaca. Daftar yang melanggar: layar lengang, baris daftar yang membawa kurang dari 5 potong informasi, bayangan tebal, gradien, kartu bersarang, warna aksen berlebih, sidebar, teks di bawah 13px. Perbaiki satu per satu tanpa mengubah konten inti, lalu ringkas perubahannya dalam 5 baris.`,
  `Periksa layar ini terhadap arah gaya P0: modern industrial teknis, bersih, tenang, mudah dibaca lama. Daftar yang melanggar: layar lengang, bentuk lonjong/kapsul, latar sekunder abu-abu, kartu bertumpuk dengan bayangan, transparansi atau filter blur, navigasi utama di header, teks di bawah 13px. Perbaiki satu per satu tanpa mengubah konten inti, lalu ringkas perubahannya dalam 5 baris.`
);

content = content.replace(
  `Layar ini terlalu lengang. Latar jadikan abu muda #F6F7F9 dan bungkus tiap bagian dalam kartu putih bergaris tipis radius 12. Perkaya tiap baris daftar dengan metadata (meta posting, ringkasan, chip, ★ rating, lokasi, badge status, tombol aksi) sesuai anatomi Baris RFQ atau Kartu UMKM di P0. Tambahkan strip stat di atas, panel samping (ringkasan, rekam jejak, langkah berikutnya), avatar, dan foto placeholder konveksi. Jangan menambah gradien atau warna aksen baru.`,
  `Layar ini terlalu lengang. Latar jadikan putih murni #FFFFFF dan bagi tiap bagian dalam kompartemen bergaris 1px #E5E7EB radius 0px. Perkaya tiap baris daftar dengan metadata (meta posting, ringkasan, chip persegi, ★ rating, lokasi, badge status persegi, tombol aksi) sesuai anatomi Baris RFQ atau Kompartemen UMKM di P0. Tambahkan strip stat di atas, panel samping (ringkasan, rekam jejak, langkah berikutnya), avatar, dan foto placeholder konveksi. Tanpa bayangan dan tanpa bentuk lonjong.`
);

// 7. Bagian 6 (Daftar Periksa)
content = content.replace(
  `- [ ] Gaya konsisten: navigasi atas, latar abu muda dengan kartu putih, baris daftar padat (5 sampai 7 potong informasi), panel kanan lengket, satu warna aksen, tanpa gradien dan bayangan tebal`,
  `- [ ] Gaya konsisten: header 56px dan sidebar kiri 240px, latar putih murni dengan kompartemen bergaris 1px #E5E7EB, baris daftar padat (5 sampai 7 potong informasi), badge persegi radius 2px, satu warna aksen, tanpa bayangan kartu`
);

fs.writeFileSync(filePath, content, "utf8");
console.log("Pembaruan PROMPT_FIGMA.md selesai.");
