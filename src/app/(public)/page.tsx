import {
  Hero,
  TrustStrip,
  PartnerWall,
  UseCases,
  FeatureTabs,
  TwoPaths,
  HowItWorks,
  Resources,
  CTABand,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="w-full bg-white">
      {/* 3. Hero Section (Pita Gelap #0E1422) */}
      <Hero />

      {/* 4. TrustStrip: 4 Sel Angka Terpisah Garis Vertikal */}
      <TrustStrip />

      {/* 5. PartnerWall: Grid Sel 6 Kolom Pelaku yang Kami Layani */}
      <PartnerWall />

      {/* 6. UseCases: 3 Cerita Pelanggan (Seragam, Merchandise, Maklon) */}
      <UseCases />

      {/* 7. FeatureTabs: 5 Tab Vertikal + Tokyo Night Code Block (Accordion Mobile) */}
      <FeatureTabs />

      {/* 8. TwoPaths: Dua Kompartemen Berdampingan (Industri vs UMKM) */}
      <TwoPaths />

      {/* 9. HowItWorks: 4 Langkah Bernomor Mono 01-04 */}
      <HowItWorks />

      {/* 10. Resources: 4 Sel Sumber Belajar & Panduan */}
      <Resources />

      {/* 11. CTABand: Pita Panggilan Aksi */}
      <CTABand />
    </div>
  );
}
