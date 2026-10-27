<!-- Bagian dari spec RantaiNaik v3. Sumber kebenaran. Perubahan wajib dicatat di docs/DECISIONS.md -->

## 13. Roadmap

### Fase 1: Core business
Estimasi sprint dua mingguan (**asumsi, sesuaikan dengan kalender PPL**; cakupan v2 lebih besar dari v1 karena RFQ/penawaran/sampel diperjelas):
| Sprint | Fokus |
|---|---|
| 0 | Perencanaan, desain, ERD, validasi awal dan data demo tekstil |
| 1 | Inisiasi proyek, auth, RBAC, profil, dokumen, verifikasi admin |
| 2 | Kapabilitas konveksi, sertifikasi/uji, Readiness Score v1 + gap analysis |
| 3 | RFQ berbasis item + **alokasi per lot** dan standar acuan, tanya jawab, matching rule-based (per lot), daftar kandidat |
| 4 | Penawaran per item dan per lot, matriks kesesuaian, kapasitas terpakai, perbandingan dan papan alokasi |
| 5 | Alur sampel, revisi, pemenang per lot (+ backup), order induk dan sub-order, milestone, **ledger escrow dan pendanaan (simulasi)** |
| 6 | QC (termasuk variasi antar-lot), rework, **rilis dana, pembatalan dan kompensasi, sengketa**, rating, dashboard, notifikasi |
| 7 | Pengujian, UAT, perbaikan, dokumentasi, persiapan demo |

> **Peringatan cakupan:** v3 menambah lot, escrow (ledger), dan sengketa, sehingga cakupan Fase 1 jauh lebih besar. Jika waktu tetap 14 minggu (7 sprint), korbankan dalam urutan ini: (1) direktori UMKM dan reputasi pembeli (FR-45, FR-49), (2) addendum dan template (FR-35, FR-39), (3) backup lot dan banding sengketa, (4) integrasi mitra pembayaran (sudah Could). **Jangan memotong** ledger, milestone, dan sengketa, karena itulah inti model broker.

### Fase 2: ML/AI (setelah core stabil)
| Fitur | Pendekatan | Prasyarat |
|---|---|---|
| Semantic matching RFQ ↔ kapabilitas | Embedding teks (IndoBERT/sentence-transformers) + pgvector | Data deskripsi dan RFQ cukup |
| Ekstraksi spesifikasi dari teks/tech pack RFQ | NLP | Contoh RFQ nyata |
| **Deteksi cacat jahitan/kain dari foto QC dan sampel** | Computer vision (klasifikasi/deteksi) | Kumpulan foto QC berlabel |
| Rekomendasi harga wajar | Regresi pada riwayat penawaran | Riwayat penawaran |
| Prediksi kemungkinan UMKM memenuhi order | Gradient boosting | Riwayat order dan `match_event` |

> **Peringatan jujur:** tanpa data transaksi nyata, model Fase 2 hanya dapat dilatih dari data simulasi atau data publik. Laporkan keterbatasan ini dengan terbuka.

### Fase 3: Ekspansi
Sektor UMKM lain (kemasan, furnitur, dan lainnya), integrasi bank atau payment gateway berizin untuk dana sungguhan, supply chain financing, integrasi logistik, API ke ERP, dashboard fasilitator (dinas, asosiasi konveksi, inkubator), integrasi dengan pengadaan pemerintah.

---
