# DESIGN_SYSTEM: RantaiNaik Visual System (R0)

Sistem visual RantaiNaik R0 mendefinisikan prinsip, token semantik, komponen dasar, dan tata letak shell aplikasi mode terang (Light Mode). Desain ini mengadopsi estetika **modern industrial teknis**, tenang, bersih, dan nyaman dibaca dalam waktu lama, dengan kepadatan informasi dan navigasi sidebar kiri yang terstruktur ala Upwork.

> **Keputusan Arsitektur:** Arah visual ini menggantikan desain awal (lihat `docs/DECISIONS.md` D-016). Seluruh antarmuka berbasis kompartemen bergaris 1px, bukan kartu bertumpuk, tanpa transparansi, dan tanpa elemen berbentuk bundar/lonjong.

---

## 1. Prinsip Utama & Filosofi Visual

1. **Modern Industrial & Bersih**:
   - Latar kanvas putih murni `#FFFFFF`.
   - Tanpa latar sekunder berwarna gelap, tanpa gradien latar, tanpa transparansi, dan tanpa efek blur.
2. **Kompartemen Terhubung (Panel Bergaris)**:
   - Halaman dibagi menjadi kompartemen (panel) yang dipisahkan garis tegas 1px `#E5E7EB`, bukan kartu-kartu yang mengambang.
   - Kompartemen yang bersebelahan berbagi satu garis (*shared hairline border*).
   - Kompartemen sekunder atau area penunjang dapat menggunakan latar halus `#FAFBFC`.
   - Kompartemen disusun menyatu dengan garis pemisah bersama 1px `#E5E7EB`(shared hairline divider), menghadirkan kesan panel instrumen profesional yang padat informasi.
3. **Ketegasan Geometris & Tanpa Sudut Bulat Berlebih**:
   - Radius kontrol (input, select, tombol) adalah `4px`.
   - Radius panel/kompartemen bersambung adalah `0px`.
   - **Dilarang bentuk kapsul/lonjong di seluruh antarmuka**: badge berpenampilan persegi dengan radius `2px`, tab menggunakan gaya garis bawah (*underline*), dan filter chip berbentuk persegi radius `4px`.
4. **Detail Teknis & Kepadatan Data**:
   - Label bagian berukuran kecil huruf kapital (11-12px, tracking `0.06em`, font mono, warna teks sekunder).
   - Angka nominal dan jumlah selalu menggunakan format angka tabel (*tabular-nums*).
   - Tabel rapat dengan garis pemisah baris tipis 1px `#E5E7EB`.
5. **Bayangan Terbatas**:
   - Bayangan kartu ditiadakan.
   - Bayangan hanya digunakan khusus untuk elemen yang mengambang di atas layer utama (*dropdown menu*, *dialog overlay*, dan *tooltip*).
6. **Aksen Tunggal Biru**:
   - Menggunakan biru `#2862E0` (hover `#2858B8`) sebagai aksen tunggal aksi dan status aktif.
   - Warna status semantik hanya dipakai untuk status dan wajib disertai label teks atau ikon.
   - Aksen Tokyo Night (`#1A1B26`, `#A9B1D6`, `#C0CAF5`) hanya digunakan untuk blok kode atau terminal dev-tool, bukan untuk chrome navigasi.
7. **Struktur Tata Letak (Layout Shell)**:
   - Header ringkas setinggi 56px (`h-14`) hanya memuat logo, kolom pencarian, ikon notifikasi, dan profil akun pengguna (tanpa tautan navigasi menu).
   - Navigasi utama ditempatkan pada sidebar kiri selebar 240px (dapat diciutkan menjadi 64px) berdasarkan peran pengguna; item aktif ditandai garis aksen kiri 2px.
   - Pada layar kecil/ponsel, sidebar berubah menjadi laci (*drawer*) samping yang dibuka lewat tombol menu pada header.

---

## 2. Token Desain Semantik

### 2.1 Palet Warna & Verifikasi Kontras

Semua rasio kontras dihitung di atas kanvas putih murni `#FFFFFF` sesuai standar WCAG 2.1:

| Token | Nilai Hex | Peran & Penggunaan | Rasio Kontras di #FFFFFF | Status WCAG |
|---|---|---|---|---|
| `--background` | `#FFFFFF` | Latar utama halaman aplikasi | 1.0 : 1 | Kanvas Dasar |
| `--surface-subtle` | `#FAFBFC` | Latar kompartemen sekunder / sidebar | 1.03 : 1 | Permukaan Halus |
| `--foreground` | `#0E1422` | Teks utama, judul, dan ikon primer | 19.8 : 1 | Lulus AAA |
| `--text-secondary` | `#5B6475` | Teks sekunder, label, keterangan | 5.3 : 1 | Lulus AA (≥ 4.5:1) |
| `--text-tertiary` | `#8B93A1` | Teks bantu, placeholder, metadata | 3.1 : 1 | Lulus Kontras UI (≥ 3:1) |
| `--border` | `#E5E7EB` | Garis kompartemen panel & tabel | 1.2 : 1 | Pembagi Struktural |
| `--border-strong` | `#8B93A1` | Border kontrol input, select, checkbox | 3.1 : 1 | Lulus Elemen Kontrol (≥ 3:1) |
| `--primary` | `#2862E0` | Tombol aksi utama, garis aktif | 4.6 : 1 | Lulus AA |
| `--primary-hover` | `#2858B8` | Hover state tombol utama & link teks | 5.8 : 1 | Lulus AA |
| `--primary-tint` | `#EFF4FE` | Latar seleksi baris & badge info | - | Background Tint |
| `--neutral-dark` | `#0E1422` | Tombol netral industrial, dark badge | 19.8 : 1 | Lulus AAA |

#### Status Semantik (Hanya untuk Status)
Setiap status warna wajib disertai teks penjelas atau ikon:
- **Success**: Teks `#15803D` (kontras 4.8:1), Tint `#F0FDF4`, Border `#DCFCE7`
- **Warning**: Teks `#B45309` (kontras 5.2:1), Tint `#FFFBEB`, Border `#FEF3C7`
- **Destructive**: Teks `#B91C1C` (kontras 5.9:1), Tint `#FEF2F2`, Border `#FEE2E2`

#### Tokyo Night Dev-Tool (Khusus Blok Kode / Terminal)
- **Background**: `#1A1B26`
- **Foreground**: `#A9B1D6`
- **Accent**: `#C0CAF5`
- **Border**: `rgba(192, 202, 245, 0.15)`

---

### 2.2 Tipografi

Dimuat secara native via Next.js `next/font/google`:

1. **Judul (`font-heading`)**: `Geist`, sans-serif.
   - Karakteristik: Bobot 600 (semibold), tracking `-0.02em`, format kalimat natural (*sentence-case*).
   - Skala: H1 24-28px, H2 18-20px, H3 14-16px.
2. **Isi / Teks Bacaan (`font-sans`)**: `Inter`, sans-serif.
   - Karakteristik: Teks antarmuka padat 13-14px, teks bacaan 15-16px, tinggi baris 1.6 (`leading-relaxed`), batas lebar baca maksimal 70 karakter.
3. **Monospace & Metadata (`font-mono`)**: `Geist Mono`, monospace.
   - Karakteristik: Digunakan untuk nomor RFQ (`RFQ-0007`), kode pesanan, harga tabular (`Rp33.750.000`), path file, dan label bagian kapital kecil (`11-12px`, tracking `0.06em`).

---

### 2.3 Garis, Radius, dan Bayangan

- **Radius Panel / Kompartemen**: `0px` (panel bersambung berbagi garis batas).
- **Radius Kontrol (Button, Input, Select)**: `4px` (`rounded-[4px]`).
- **Radius Badge & Label Status**: `2px` (`rounded-[2px]`).
- **Garis Pembagi (Dividers)**: `1px solid #E5E7EB`.
- **Border Kontrol**: `1px solid #8B93A1` (fokus cincin `2px solid #2862E0`).
- **Bayangan**:
  - Tombol utama: **Tanpa bayangan** (`shadow-none`).
  - Panel & kompartemen: **Tanpa bayangan** (`shadow-none`).
  - Elemen melayang: `shadow-[0_4px_16px_rgba(14,20,34,0.08)]` (hanya untuk menu popover, dialog, dan tooltip).

---

## 3. Komponen Target & Pola Penggunaan

Komponen dasar sistem visual R0/R1 diekspor dari `@/components/ui`:

### 3.1 Kompartemen & Panel (`Panel`)
Kompartemen bersambung menggantikan konsep kartu mengambang. Dua kompartemen yang bersisian berbagi garis 1px:
```tsx
import { Panel, PanelHeader, PanelTitle, PanelDescription, PanelContent } from "@/components/ui";

<Panel>
  <PanelHeader>
    <span className="font-mono text-xs uppercase tracking-[0.06em] text-[#5B6475]">
      Spesifikasi Teknis
    </span>
    <PanelTitle className="mt-1">Rincian Kebutuhan Bahan</PanelTitle>
    <PanelDescription>Parameter kualitas dan toleransi ukuran</PanelDescription>
  </PanelHeader>
  <PanelContent className="bg-[#FAFBFC]">
    {/* Area konten kompartemen */}
  </PanelContent>
</Panel>
```

### 3.2 Header Halaman (`PageHeader`)
Kompartemen kepala halaman dengan judul, deskripsi, kategori mono kecil, dan aksi di kanan:
```tsx
import { PageHeader, Button } from "@/components/ui";

<PageHeader
  category="Portal Pengadaan Industri"
  title="Daftar RFQ Saya"
  description="Kelola spesifikasi, pantau penawaran UMKM yang masuk, dan terbitkan addendum."
  actions={<Button variant="default">Buat RFQ Baru</Button>}
/>
```

### 3.3 Shell Layout (`AppHeader`, `AppSidebar`, `AppShell`)
1. **`AppHeader` (56px)**:
   - Baris atas statis tinggi 56px (`h-14`) berlatar putih solid dengan garis bawah 1px `#E5E7EB`.
   - Berisi logo RantaiNaik, pencarian global terpadu (maks 560px), tombol notifikasi, dan avatar pengguna (`AuthNavButtons`).
   - **Strictly tidak memuat menu navigasi**.
2. **`AppSidebar` (240px)**:
   - Terletak di sisi kiri, memanjang dari bawah header hingga dasar layar.
   - Mengambil grup navigasi dari konfigurasi terpusat `src/config/navigation.ts`.
   - Item aktif memiliki latar `#EFF4FE`, teks `#2862E0` font-semibold, dan aksen garis tepi kiri 2px `#2862E0`.
   - Responsif mobile: menjadi drawer samping yang muncul saat tombol menu hamburger pada header ditekan.
3. **`AppShell`**:
   - Menyatukan `AppHeader`, `AppSidebar`, mobile drawer, dan kontainer utama berlatar `#FFFFFF`. Halaman login/register secara otomatis dirender mandiri tanpa sidebar.

### 3.3 Tombol (`Button`)
- **Utama (Primary)**: Latar `#2862E0`, teks putih, radius 4px, tanpa bayangan, hover `#2858B8`.
- **Netral**: Latar `#0E1422`, teks putih, radius 4px, hover `#1E293B`.
- **Sekunder**: Latar `#FFFFFF`, border 1px `#8B93A1`, teks `#0E1422`, radius 4px, hover `#FAFBFC`.
- **Destructive**: Latar `#B91C1C`, teks putih, radius 4px, hover `#991B1B`.

### 3.4 Badge Status (`StatusBadge` & `Badge`)
Badge berpenampilan teknis, persegi dengan radius 2px (`rounded-[2px]`), tidak berbentuk lonjong atau bundar. `StatusBadge` menggunakan latar warna solid lembut tanpa garis tepi (*borderless* / `border-0`) untuk merepresentasikan status secara tegas:
```tsx
import { StatusBadge } from "@/components/ui";

<StatusBadge status="VERIFIED">Terverifikasi</StatusBadge>
<StatusBadge status="PENDING" dot>Menunggu Tinjauan</StatusBadge>
```

### 3.5 Input Pencarian Dalam-Halaman (`SearchBar`)
Input pencarian standar ditempatkan tepat di bawah `PageHeader` pada halaman daftar/feed, tanpa mengotori header/navbar utama:
```tsx
import { SearchBar } from "@/components/ui";

<SearchBar
  placeholder="Cari RFQ terbuka, tender seragam kantor, atau kebutuhan maklon tekstil..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### 3.6 Tab Bergaya Garis Bawah
Tab berbentuk garis bawah horizontal dengan indikator angka di samping label:
```tsx
<div className="flex border-b border-[#E5E7EB] gap-6 text-sm">
  <button className="border-b-2 border-[#2862E0] pb-2 font-semibold text-[#2862E0]">
    Aktif (4)
  </button>
  <button className="border-b-2 border-transparent pb-2 text-[#5B6475] hover:text-[#0E1422]">
    Draft (1)
  </button>
</div>
```

### 3.6 Tabel Rapat
Tabel dengan pembatas baris tipis 1px `#E5E7EB`, header latar `#FAFBFC`, teks monospace untuk nominal mata uang dan ID:
```tsx
<table className="w-full border-collapse border border-[#E5E7EB] text-sm">
  <thead className="bg-[#FAFBFC] border-b border-[#E5E7EB] text-xs font-mono uppercase text-[#5B6475]">
    <tr>
      <th className="p-3 text-left">Nomor RFQ</th>
      <th className="p-3 text-right">Nilai Anggaran</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-[#E5E7EB]">
    <tr>
      <td className="p-3 font-mono text-[#2862E0]">RFQ-0007</td>
      <td className="p-3 text-right font-mono tabular-nums">Rp33.750.000</td>
    </tr>
  </tbody>
</table>
```

---

## 4. Komponen Landing & Layout Publik (R3)

Homepage publik RantaiNaik menggunakan **PublicLayout** yang terpisah dari `AppShell`. Halaman publik berada di route group `(public)` dan **tidak memiliki sidebar**.

### 4.1 Arsitektur Route Group

```
RootLayout (src/app/layout.tsx — hanya SessionProviderWrapper)
  ├── (public)/layout.tsx → PublicLayout (AnnouncementBar + PublicNavbar + children + PublicFooter)
  │     ├── page.tsx          — homepage 12-bagian
  │     ├── login/page.tsx
  │     ├── register/page.tsx
  │     ├── reset-password/page.tsx
  │     └── verifikasi-pending/page.tsx
  ├── (admin)/layout.tsx   → AppShell (dengan sidebar admin)
  ├── (industri)/layout.tsx → AppShell (dengan sidebar industri)
  └── (umkm)/layout.tsx    → AppShell (dengan sidebar UMKM)
```

### 4.2 PublicLayout (`src/components/layout/PublicLayout.tsx`)

Layout publik menggunakan **navbar atas sticky** (bukan sidebar). Navbar 64px putih, garis bawah 1px `#E5E7EB`, menempel di atas saat scroll.

```tsx
import PublicLayout from "@/components/layout/PublicLayout";

// Digunakan di src/app/(public)/layout.tsx:
export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>;
}
```

### 4.3 Komponen Landing (`src/components/landing/`)

Semua diekspor dari `src/components/landing/index.ts`:

| Komponen | Deskripsi |
|---|---|
| `AnnouncementBar` | Pita tipis 40px yang bisa ditutup, satu kalimat + tautan |
| `PublicNavbar` | Navbar 64px sticky; menu dropdown keyboard-navigable; hamburger di bawah 1024px |
| `NavDropdown` | Panel dropdown putih bergaris 2-kolom, keyboard (Esc, panah, Tab) |
| `MobileSheet` | Sheet layar penuh hamburger; accordion grup; kunci scroll body; Esc/tombol close |
| `Hero` | Pita gelap `#0E1422`; H1 fluid `clamp(32px,5vw,56px)`; pratinjau RFQ statis di kanan |
| `TrustStrip` | 4 sel angka metrik dipisah garis; label "Data contoh" |
| `PartnerWall` | Grid 6-kolom nama usaha contoh bergaya teks; label "Data contoh" |
| `UseCases` | 3 sel cerita; angka metrik mono 40px; label "Data contoh" |
| `FeatureTabs` | Daftar tab vertikal kiri + panel kanan; blok kode Tokyo Night; accordion di mobile |
| `TwoPaths` | 2 kompartemen berdampingan: Untuk Industri & Untuk UMKM |
| `HowItWorks` | 4 langkah bernomor mono 01-04 dalam grid 4 sel dengan garis |
| `Resources` | 4 sel sumber belajar dengan tautan |
| `CTABand` | Pita putih; judul + satu kalimat + 2 tombol |
| `PublicFooter` | Pita gelap `#0E1422`; 5-kolom desktop; accordion mobile |

### 4.4 Aturan Konten Landing

- **Data contoh wajib berlabel** `"Data contoh"` — tidak ada angka nyata atau logo pelanggan asli.
- **Escrow belum aktif** — selalu tampilkan badge `"Dalam pengembangan"`, jangan tulis seolah dana benar-benar dipegang.
- **Pita gelap diizinkan dua kali**: Hero (`#0E1422`) dan Footer (`#0E1422`) sebagai pengecualian landing.
- **Pola latar hero**: grid tipis solid `#2A3142` — bukan gradien.
- Di dalam pita gelap: teks putih, kontras ≥ 4.5:1, garis pembagi `#2A3142`.

### 4.5 Container & Padding Halaman Publik

| Properti | Nilai |
|---|---|
| `max-width` container | 1280px, `mx-auto` |
| Padding horizontal | 16px (<640px) · 24px (640–1023px) · 32px (≥1024px) |
| Padding vertikal bagian | 64px mobile · 80px tablet · 96px desktop |
| Jarak judul ke isi | 32–48px |
| Padding sel grid | 24px (20px mobile) |

### 4.6 Komponen Baru yang Ditambahkan ke Sistem

Komponen-komponen ini dibuat baru selama R3 dan mengikuti token yang sama:

- **`NavDropdown`** — panel floating dengan `shadow-[0_4px_16px_rgba(14,20,34,0.08)]`, keyboard-navigable (ARIA `role="menu"`)
- **`MobileSheet`** — drawer layar penuh, `position:fixed inset-0`, tanpa backdrop blur, kunci scroll body, `role="dialog"` dengan `aria-modal="true"`
- **`FeatureTabs`** — tab vertikal desktop / accordion mobile; tab aktif dengan garis kiri 2px `#2862E0`; blok kode Tokyo Night dengan `overflow-x-auto`

---

## 5. Larangan Tegas (Anti-Patterns)

- ❌ **Dilarang elemen berbentuk kapsul / lonjong**: Jangan memakai sudut bulat penuh pada tombol, tab, badge, status, atau filter chip.
- ❌ **Dilarang latar sekunder di seluruh halaman**: Kanvas utama harus putih murni `#FFFFFF`.
- ❌ **Dilarang kartu bertumpuk dengan bayangan tebal**: Halaman disusun dalam kompartemen bergaris 1px `#E5E7EB`.
- ❌ **Dilarang efek transparansi atau filter blur**: Tanpa filter blur, tanpa transparansi pada header atau panel.
- ❌ **Dilarang gradien latar atau warna-warni**: Latar solid dan bersih.
- ❌ **Dilarang warna neon berlebihan**: Pertahankan warna industrial fungsional.
- ❌ **Dilarang ikon dekoratif tanpa fungsi atau emoji**: Gunakan ikon outline fungsional (Lucide SVG).
- ❌ **Dilarang warna hardcode di dalam kode komponen**: Semua warna harus merujuk token Tailwind / CSS.
- ❌ **Dilarang meletakkan menu navigasi utama di header**: Header hanya untuk logo, utilitas pencarian, notifikasi, dan profil. Navigasi utama selalu di sidebar.

---

## 5. Sumber Referensi Desain
- **Upwork (`www.upwork.com`)**: Struktur hierarki data padat, metadata pekerjaan yang komprehensif, dan navigasi sidebar per peran.
- **Modern Industrial Tooling**: Estetika kompartemen garis hairline terstruktur, kontras kontrol tegas, dan kenyamanan membaca jangka panjang.
