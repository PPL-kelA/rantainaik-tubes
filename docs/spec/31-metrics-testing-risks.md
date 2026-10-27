<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

## 14. Metrik keberhasilan

**Metrik produk:**
- Jumlah UMKM konveksi terverifikasi dan RFQ terpublikasi
- Persentase RFQ yang menerima ≥ 1 penawaran
- Waktu rata-rata dari RFQ terbit hingga penawaran pertama
- **Jumlah pertanyaan per RFQ** dan **persentase RFQ yang memerlukan addendum** (indikator kejelasan RFQ)
- **Rata-rata tingkat kesesuaian** penawaran terhadap RFQ
- Persentase penawaran yang menjadi order, dan **persentase sampel yang disetujui**
- Kenaikan Readiness Score dan jumlah UMKM yang naik tier
- On-time delivery rate dan reject rate
- **Persentase RFQ mode LOT**, rata-rata jumlah lot, dan persentase lot yang terisi
- **Tingkat variasi antar-lot** (cacat "variasi antar-lot" per sub-order)
- **Persentase order yang didanai tepat waktu**, serta nilai dana tertahan dan dirilis di escrow
- **Tingkat sengketa**, waktu rata-rata penyelesaian, dan proporsi keputusan (rilis, refund, proporsional)
- **Tingkat pembatalan sepihak** (pembeli dan UMKM) dan **take rate** (komisi terhadap nilai order)

**Metrik proyek/akademik:**
- Cakupan kebutuhan Must terimplementasi (target 100%)
- Tingkat lolos skenario UAT, skor SUS
- Cakupan unit test pada modul scoring dan matching

---

## 15. Rencana pengujian dan validasi

**Pengujian teknis:** unit test scoring dan matching (termasuk UMKM baru tanpa riwayat), integrasi alur RFQ → penawaran → sampel → order → rating, E2E tiga alur utama, otorisasi antarperan (kerahasiaan penawaran). **Tambahan v3:** unit test aturan rilis dan kompensasi (7.12.4), **invarian ledger** (dana masuk = rilis + refund + komisi + saldo tertahan, transaksi idempoten), validasi pembagian lot (jumlah qty per ukuran seluruh lot = total item), peringatan kapasitas terpakai, serta otorisasi dana (hanya sistem dan admin yang dapat merilis).

**Validasi dengan pengguna (wawancara):**
- **3-5 pelaku konveksi/maklon:** bagaimana mereka mendapat order sekarang, apa yang sering kurang jelas pada permintaan, bagaimana menghitung harga (bahan, jahit, dekorasi), bagaimana sampel ditangani, kendala kapasitas dan penjahit.
- **1-2 pihak pengadaan** (HRD/GA/procurement perusahaan atau pengelola brand lokal): bagaimana mencari vendor seragam/maklon, apa yang dinilai (harga, sampel, ketepatan waktu), dokumen apa yang diminta.
- **Tambahan v3, untuk UMKM:** apakah bersedia membayar komisi dan berapa yang wajar, apakah bersedia mengerjakan porsi (lot) kecil seperti 50 pcs, apa yang membuat dana di escrow dipercaya, dan kapan modal bahan perlu cair.
- **Tambahan v3, untuk pembeli:** apakah bersedia mendanai penuh di muka (atau butuh termin seperti net 30), apakah pernah membagi pesanan ke beberapa vendor dan masalahnya (mis. variasi warna), dan bagaimana biasanya menangani pembatalan.
- Hasilnya dipakai menyesuaikan field RFQ dan penawaran, taksonomi, daftar uji/sertifikasi, bobot skor, template, besaran komisi, aturan lot, dan matriks kompensasi.

**UAT:** skenario tertulis (RFQ seragam end-to-end, RFQ maklon dengan sampel, **RFQ mode LOT dengan 4 pemenang lalu satu lot gagal dan diganti backup**, **UMKM menghilang dan dana direfund**, **pembeli membatalkan setelah bahan tiba dan UMKM menerima kompensasi**, **sengketa cacat barang**) dan kuesioner SUS.

**Data demo:** 20-30 profil UMKM konveksi simulasi (variasi kapasitas, layanan, kota), 5-8 RFQ simulasi dari ketiga jenis kebutuhan (termasuk 1-2 RFQ mode LOT), dan data escrow simulasi. Tandai jelas sebagai data simulasi.

---

## 16. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| *Cold start* (belum ada pembeli/pemasok) | Platform terlihat kosong | Data demo, fokus satu klaster wilayah, mitra uji coba |
| Spesifikasi RFQ tetap tidak lengkap | Penawaran tidak sebanding | Template per jenis kebutuhan, field wajib, tanya jawab, addendum |
| Klaim kapasitas UMKM tidak akurat | Skor menyesatkan | Bedakan item terverifikasi vs klaim sendiri (50%), verifikasi admin, rating |
| Beban administrasi terlalu berat bagi UMKM | UMKM enggan memakai | Form bertahap, simpan draft, bahasa sederhana, panduan |
| Pengguna bertransaksi di luar platform | Rekam jejak tidak terbentuk, komisi hilang | Escrow sebagai nilai tambah (perlindungan dana), rekam jejak dan skor, BR-08, ketentuan penggunaan |
| Bias skor terhadap UMKM yang lebih "administratif" | UMKM kecil tersisih | Nilai awal netral, gap analysis membantu, rincian skor |
| Cakupan terlalu luas | Proyek tidak selesai | MoSCoW ketat, Should/Could di backlog opsional, escrow simulasi, urutan pengorbanan di bagian 13 |
| Keamanan dan privasi dokumen | Pelanggaran data | RBAC, akses terbatas, UU PDP |
| Ketidakseragaman mutu antar-lot | Pembeli kecewa pada hasil split | Standar acuan bersama, aturan konsistensi bahan (disediakan pembeli atau satu sumber), toleransi, sampel terhadap acuan, cacat "variasi antar-lot", saran tidak membagi bila satu UMKM mampu |
| Satu lot gagal atau terlambat | Pesanan induk tertunda | Backup per lot, sub-order independen, opsi parsial, tenggat bersama |
| Regulasi dan kustodi dana | Risiko hukum bila platform menampung dana sendiri | Escrow lewat mitra berizin, Fase 1 simulasi, kajian hukum sebelum komersialisasi (7.12.7) |
| Beban mediasi sengketa | Admin kewalahan, keputusan dinilai tidak adil | Bukti terstruktur (milestone, QC, resi), rilis otomatis untuk kasus jelas, jendela waktu, keputusan tertulis, banding (Could) |
| Modal kerja UMKM tertahan | UMKM enggan ikut karena uang tidak cair di awal | Rilis tahap 1 saat bahan tiba, konfirmasi otomatis, transparansi status dana |
| UMKM overcommit karena menawar banyak RFQ | Gagal kirim, skor turun | Kapasitas terpakai dan peringatan (Q-08), kapasitas tersedia pada skor matching |

---

## 17. Asumsi dan pertanyaan terbuka

- [ ] Jumlah anggota kelompok dan pembagian peran: _..._
- [ ] Batas waktu pengerjaan dan jadwal presentasi/demo: _..._
- [ ] Apakah dosen mensyaratkan framework atau teknologi tertentu: _..._
- [ ] Format dokumen yang dinilai (SRS, use case, activity diagram, ERD, UI/UX, test plan): _..._
- [ ] Klaster wilayah uji coba (mis. Bekasi, Bandung, Jabodetabek): _..._
- [ ] Apakah ada konveksi/pembeli yang dapat diwawancarai: _..._
- [ ] Daftar uji/sertifikasi tekstil yang dipakai di platform (dari hasil wawancara): _..._
- [ ] Nama final produk: _..._
- [ ] Besaran komisi, pihak yang menanggung, dan biaya mitra pembayaran: _..._
- [ ] Apakah escrow Fase 1 cukup berupa simulasi ledger (persetujuan dosen)? Mitra escrow atau payment gateway untuk produksi: _..._
- [ ] Batas jumlah lot (2-4), qty minimum per lot, dan nilai awal jendela waktu (pendanaan, konfirmasi otomatis, tenggang UMKM tidak aktif, klaim): _..._
- [ ] Matriks kompensasi pembatalan dan biaya administrasi (dari hasil wawancara): _..._
- [ ] Apakah pembeli korporasi dapat menerima pendanaan penuh di muka, atau perlu opsi pendanaan bertahap atau termin: _..._
- [ ] Kajian hukum dan status badan usaha penyelenggara platform: _..._

---
