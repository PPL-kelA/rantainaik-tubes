<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

### 7.12 Pembayaran, escrow, dan sengketa

> Bagian ini menggantikan prinsip "pembayaran di luar platform" pada v2.

#### 7.12.1 Prinsip
- Dana order dititipkan di **escrow (rekening bersama)** dan baru berpindah ke UMKM ketika syarat rilis terpenuhi. Bila terjadi masalah, dana yang belum dirilis dapat dikembalikan ke pembeli.
- Platform **mengendalikan instruksi rilis dan refund**, bukan memakai dana tersebut. Pada produksi nyata, dana disimpan di mitra berizin (lihat 7.12.7).
- Aturan rilis berbasis **bukti di platform** (milestone, foto, resi, QC). Karena itu milestone menjadi fitur Must.
- Semua persentase, jendela waktu, dan komisi adalah nilai awal di `platform_config`.

#### 7.12.2 Alur dana standar
Pembeli mendanai **100% nilai order** ke escrow di awal, lalu dana dirilis bertahap sesuai termin RFQ (nilai awal 30% dan 70%).

| Tahap | Pemicu | Aksi dana | Status dana |
|---|---|---|---|
| 1. Pendanaan | Order terbentuk | Pembeli membayar penuh ke escrow. Batas waktu nilai awal 3×24 jam, bila lewat order `CANCELLED` tanpa biaya bagi UMKM | `FUNDED`, order `CONFIRMED` |
| 2. Rilis tahap 1 (DP) | Milestone **bahan tiba** terbukti (foto dan nota atau bukti bahan) dan dikonfirmasi pembeli, atau otomatis 2×24 jam tanpa keberatan. Pada CMT (bahan dari pembeli) pemicunya "mulai produksi" | Persentase tahap 1 dirilis ke UMKM dikurangi komisi proporsional | `PARTIALLY_RELEASED` |
| 3. Rilis tahap 2 (sisa) | **QC lolos** (atau lolos dengan catatan tanpa rework), atau konfirmasi otomatis bila pembeli tidak mengisi QC dalam N hari kerja setelah `RECEIVED` (nilai awal 5) dan tidak membuka sengketa | Sisa dana dirilis ke UMKM dikurangi komisi | `RELEASED`, order `COMPLETED` |
| Rework | QC gagal | Dana tahap 2 tetap tertahan sampai QC ulang lolos atau sengketa diputus | tidak berubah |

Pada mode LOT, seluruh tahap berlaku **per sub-order** dengan nilai sub-order masing-masing.

#### 7.12.3 Komisi dan biaya
- Komisi platform (nilai awal 5% dari nilai order, ditanggung UMKM, belum divalidasi) dipotong secara proporsional pada setiap rilis.
- Biaya mitra pembayaran (bila ada) belum diputuskan: dimasukkan ke komisi atau ditanggung pembeli (lihat bagian 17).
- Biaya administrasi pembatalan (lihat matriks di bawah) adalah nilai awal dan dikonfigurasi admin.

#### 7.12.4 Skenario masalah dan perlakuan dana
| Skenario | Perlakuan dana dan proses | Dampak reputasi |
|---|---|---|
| **UMKM menghilang** (tidak ada update milestone N hari kerja setelah tanggal yang dijanjikan, nilai awal 5, dan tidak membalas pengingat) | Pengingat, lalu masa tenggang (nilai awal 3×24 jam), lalu admin menetapkan order `FAILED`. Dana yang belum dirilis dikembalikan **100%** ke pembeli. DP yang sudah dirilis berdasarkan bukti bahan ditinjau lewat sengketa. Pada mode LOT, hanya sub-order tersebut yang gagal dan backup dapat diaktifkan | Poin komponen D turun, akun dapat ditangguhkan (BR-10) |
| **UMKM mundur sepihak** | Dana yang belum dirilis dikembalikan penuh. DP yang sudah dirilis wajib dikembalikan (ditagih lewat sengketa) | Poin turun, tercatat sebagai pembatalan UMKM |
| **Pembeli memutus sebelum bahan tiba** (belum ada rilis) | Dana dikembalikan penuh dikurangi biaya administrasi (nilai awal 2%) | Tercatat pada reputasi pembeli |
| **Pembeli memutus setelah bahan tiba atau produksi berjalan** | UMKM berhak **kompensasi sebesar nilai yang terbukti** (bahan terbeli dan progres produksi menurut milestone) dari dana escrow. Sisa dana dikembalikan. Besaran diputus admin bila tidak ada kesepakatan | Tercatat pada reputasi pembeli |
| **Pembeli memutus setelah barang siap kirim** | UMKM berhak atas nilai order dikurangi biaya yang dapat dihemat. Admin memutuskan setelah memeriksa bukti bahwa barang sesuai spesifikasi | Tercatat pada reputasi pembeli |
| **Barang cacat atau tidak sesuai** | Rework lalu QC ulang. Bila tetap gagal: sengketa dengan keputusan refund proporsional terhadap qty reject, rilis untuk qty lolos, atau refund penuh bila ketidaksesuaian mendasar | Reject rate dan sengketa memengaruhi skor |
| **Keterlambatan** | Potongan sesuai klausul denda keterlambatan bila disepakati di RFQ. Tanpa klausul, keterlambatan hanya memengaruhi on-time delivery rate | Skor ketepatan waktu |
| **Pembeli tidak mendanai tepat waktu** | Order `CANCELLED` tanpa biaya bagi UMKM (belum ada produksi) | Tercatat pada reputasi pembeli |
| **Pembatalan dengan kesepakatan bersama** | Dana dikembalikan sesuai kesepakatan yang dikonfirmasi kedua pihak, lalu dicatat oleh admin | Netral |
| **Keadaan di luar kendali** (bencana, kelangkaan bahan) | Dibahas lewat kesepakatan bersama atau sengketa, admin memutuskan berdasarkan bukti | Ditinjau kasus per kasus |

#### 7.12.5 Sengketa
1. **Pembukaan.** Pembeli atau UMKM membuka sengketa pada order selama dana tahap akhir belum dirilis, atau dalam N hari kerja setelah `RECEIVED` (nilai awal 5). Pembuka memilih alasan (tidak sesuai spesifikasi, cacat, terlambat, UMKM tidak aktif, pembatalan, pembayaran, lainnya) dan **tuntutan** (refund penuh, refund parsial, rilis, kompensasi).
2. **Pembekuan.** Dana yang belum dirilis pada order tersebut **dibekukan**.
3. **Bukti.** Kedua pihak mengunggah bukti (foto milestone, QC, resi, tech pack dan addendum, riwayat tanya jawab). Pihak lawan menanggapi dalam 3×24 jam. Bila tidak menanggapi, admin memutus berdasarkan bukti yang ada.
4. **Keputusan admin:** `RELEASE_FULL`, `REFUND_FULL`, `SPLIT` (proporsional dengan rincian nominal), atau `REWORK_FIRST` (rework dengan tenggat baru lalu ditinjau ulang). Keputusan disertai alasan tertulis dan tercatat di audit log.
5. **Eksekusi.** Sistem mencatat pergerakan dana di ledger, menyesuaikan skor dan reputasi, lalu menutup order (`COMPLETED`, `CANCELLED`, atau `FAILED`).
6. **Banding** satu kali ke admin lain (Could-have).

Keputusan admin mengikat di dalam platform (syarat dan ketentuan disetujui saat registrasi) dan tidak menghilangkan hak para pihak menempuh jalur hukum.

#### 7.12.6 Reputasi pembeli dan pencegahan bypass
- **Reputasi pembeli** (tingkat pembatalan sepihak, ketepatan pendanaan, jumlah sengketa) ditampilkan kepada UMKM pada halaman RFQ sebagai "Rekam Jejak Pembeli", sehingga UMKM berani menawar.
- **Pencegahan bypass:** kontak baru terbuka setelah shortlist (BR-08), tetapi kesepakatan di luar platform tidak dilindungi escrow, tidak menambah rekam jejak, dan melanggar ketentuan penggunaan. Nilai tambah platform untuk tetap bertransaksi di dalam: perlindungan dana, rekam jejak, dan Readiness Score.

#### 7.12.7 Catatan hukum dan implementasi
- Escrow yang kredibel melibatkan **pihak ketiga netral yang berizin** (bank atau lembaga keuangan berizin). Penyelenggara jasa pembayaran seperti payment gateway dan dompet elektronik di Indonesia memerlukan izin Bank Indonesia. Pola yang lazim: platform digital menggandeng bank sebagai penyedia rekening escrow dan tidak menghimpun dana sendiri (lihat referensi bagian 19).
- Konsekuensinya, pada produksi nyata **platform tidak boleh menampung dana di rekening operasionalnya sendiri**. Gunakan mitra berizin (bank dengan layanan escrow atau payment gateway dengan fitur penahanan dana), dan platform bertindak sebagai pengirim instruksi rilis atau refund.
- **Fase 1 (PPL):** antarmuka `EscrowProvider` dengan implementasi **simulasi** (ledger internal, saldo dan rilis dicatat tanpa uang sungguhan) agar alur, aturan rilis, dan sengketa dapat didemonstrasikan. Adapter mitra berizin atau sandbox payment gateway adalah Could-have.
- Sebelum komersialisasi diperlukan kajian hukum dan konsultasi (perizinan, pajak atas komisi dan PPN, syarat dan ketentuan, KYC, perlindungan data rekening). Dokumen ini bukan nasihat hukum.
- **Ledger:** pencatatan berpasangan, *append-only*, transaksi idempoten, dan direkonsiliasi. Invarian: dana masuk = dana dirilis + dana direfund + komisi + saldo tertahan.

---
