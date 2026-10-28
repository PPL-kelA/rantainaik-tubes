# Spec RantaiNaik (v3): indeks

Spec produk dipecah per topik agar agen hanya membaca yang perlu. **Jangan memuat semua file sekaligus.**
Sumber kebenaran adalah file-file di folder ini. Perubahan keputusan wajib diperbarui di sini dan dicatat di `docs/DECISIONS.md`.

## Cara memilih file
| Bila tugasnya tentang... | Baca |
|---|---|
| Registrasi, verifikasi dokumen, kategori dan atribut produk | `10-verification-taxonomy.md`, `20-functional-requirements.md` (FR-01..09) |
| Wizard RFQ, item, rincian ukuran, tanya jawab, addendum, mode lot | `11-rfq.md` |
| Form penawaran, matriks kesesuaian, kapasitas terpakai | `12-quotation.md` |
| Perbandingan, skor evaluasi, sampel, revisi, pemenang, papan alokasi lot | `13-evaluation-sample-award.md` |
| Daftar kandidat, matching, Readiness Score, gap analysis | `14-matching-readiness.md` |
| Order, milestone, QC, rework, aturan BR-xx, kasus tepi | `15-order-qc-rules-edgecases.md` |
| Escrow, rilis dana, komisi, pembatalan, sengketa, ledger | `16-escrow-dispute.md` |
| Skema database, relasi, atribut entitas | `22-data-model.md` |
| Daftar halaman per peran | `24-ui-pages.md` dan `docs/design/PROMPT_FIGMA.md` |
| Stack, modul, antarmuka provider | `23-architecture-stack.md` |
| Prioritas dan jadwal sprint | `20-functional-requirements.md`, `30-roadmap.md` |
| Laporan, slide, latar belakang | `02-background-problem-scope.md`, `33-references-slides.md` |

## Daftar file
| File | Isi | Baris |
|---|---|---|
| `00-overview-and-changelog.md` | Ikhtisar, cara memakai, riwayat perubahan v1 ke v3 | 51 |
| `01-product-actors-flow.md` | Ringkasan produk, aktor, model broker, alur end-to-end | 121 |
| `02-background-problem-scope.md` | Latar belakang, problem statement, ruang lingkup (untuk laporan dan batas fitur) | 115 |
| `10-verification-taxonomy.md` | Verifikasi akun (7.1), taksonomi dan atribut tekstil (7.2) | 33 |
| `11-rfq.md` | RFQ: wizard, field item, alokasi lot, aturan R-xx, contoh RFQ-0007 dan RFQ-0008, siklus (7.3) | 100 |
| `12-quotation.md` | Penawaran: isi, matriks kesesuaian, aturan Q-xx, contoh, siklus (7.4) | 72 |
| `13-evaluation-sample-award.md` | Perbandingan, skor evaluasi, alur sampel, revisi, pemenang, papan alokasi lot (7.5) | 36 |
| `14-matching-readiness.md` | Matching rule-based (7.6), Readiness Score (7.7), gap analysis (7.8) | 61 |
| `15-order-qc-rules-edgecases.md` | Order, produksi, QC, rework (7.9), aturan bisnis BR-xx (7.10), kasus tepi (7.11) | 69 |
| `16-escrow-dispute.md` | Pembayaran, escrow, komisi, skenario masalah, sengketa (7.12) | 64 |
| `20-functional-requirements.md` | Daftar kebutuhan fungsional FR-01 s.d. FR-50 dengan prioritas MoSCoW (8) | 78 |
| `21-non-functional.md` | Kebutuhan non-fungsional (9) | 16 |
| `22-data-model.md` | ERD (mermaid) dan atribut entitas (10) | 90 |
| `23-architecture-stack.md` | Arsitektur dan tech stack Fase 1 (11) | 26 |
| `24-ui-pages.md` | Daftar halaman dan arah desain UI (12) | 14 |
| `30-roadmap.md` | Roadmap Fase 1 (sprint 0-7), Fase 2, Fase 3 (13) | 33 |
| `31-metrics-testing-risks.md` | Metrik, pengujian dan validasi, risiko, pertanyaan terbuka (14-17) | 81 |
| `32-glossary.md` | Glosarium (18) | 34 |
| `33-references-slides.md` | Referensi dan kerangka slide proposal (19-20) | 53 |

## Peta ID aturan
| Awalan | Arti | Lokasi |
|---|---|---|
| FR-xx | Kebutuhan fungsional | `20-functional-requirements.md` |
| R-xx | Aturan RFQ | `11-rfq.md` (7.3.4) |
| Q-xx | Aturan penawaran | `12-quotation.md` (7.4.4) |
| BR-xx | Aturan bisnis umum | `15-order-qc-rules-edgecases.md` (7.10) |
| 7.12.x | Aturan dana dan sengketa | `16-escrow-dispute.md` |

## Catatan
- Bobot, ambang, komisi, dan jendela waktu adalah nilai awal yang dapat dikonfigurasi (`scoring_config`, `platform_config`), bukan hasil riset.
- Escrow Fase 1 adalah simulasi ledger. Fase 1 tanpa ML/AI.
