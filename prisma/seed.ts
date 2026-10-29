import {
  PrismaClient,
  Role,
  AccountStatus,
  OrgType,
  VerificationStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("Seeding RantaiNaik initial baseline accounts...");

  const defaultPassword = "Password123";
  const passwordHash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);

  // 1. Admin Platform
  const adminOrg = await prisma.organization.upsert({
    where: { id: "org-admin-platform" },
    update: {},
    create: {
      id: "org-admin-platform",
      name: "RantaiNaik Platform Operations",
      type: OrgType.PLATFORM,
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      picName: "Super Admin",
      picPhone: "08110000001",
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@rantainaik.id" },
    update: { passwordHash, role: Role.ADMIN, status: AccountStatus.VERIFIED },
    create: {
      email: "admin@rantainaik.id",
      passwordHash,
      role: Role.ADMIN,
      status: AccountStatus.VERIFIED,
      organizationMembers: {
        create: {
          organizationId: adminOrg.id,
          role: "ADMIN",
        },
      },
    },
  });
  console.log(`✓ Admin seeded: ${adminUser.email}`);

  // 2. UMKM Verified (CV Karya Mandiri Konveksi)
  const umkmOrg = await prisma.organization.upsert({
    where: { id: "org-umkm-karyamandiri" },
    update: {},
    create: {
      id: "org-umkm-karyamandiri",
      name: "CV Karya Mandiri Konveksi",
      type: OrgType.UMKM,
      city: "Bekasi",
      province: "Jawa Barat",
      address: "Jl. Industri Konveksi No. 42, Bekasi",
      picName: "Hendra Wijaya",
      picPhone: "081298765432",
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const umkmUser = await prisma.user.upsert({
    where: { email: "umkm@karyamandiri.id" },
    update: { passwordHash, role: Role.UMKM, status: AccountStatus.VERIFIED },
    create: {
      email: "umkm@karyamandiri.id",
      passwordHash,
      role: Role.UMKM,
      status: AccountStatus.VERIFIED,
      organizationMembers: {
        create: {
          organizationId: umkmOrg.id,
          role: "OWNER",
        },
      },
    },
  });
  console.log(`✓ UMKM (Verified) seeded: ${umkmUser.email}`);

  // 3. UMKM Pending (Konveksi Sinar Jaya)
  const umkmPendingOrg = await prisma.organization.upsert({
    where: { id: "org-umkm-sinarjaya" },
    update: {
      name: "Konveksi Sinar Jaya",
      verificationStatus: VerificationStatus.PENDING,
    },
    create: {
      id: "org-umkm-sinarjaya",
      name: "Konveksi Sinar Jaya",
      type: OrgType.UMKM,
      city: "Bandung",
      province: "Jawa Barat",
      picName: "Bambang Setiawan",
      picPhone: "081311223344",
      verificationStatus: VerificationStatus.PENDING,
    },
  });

  const umkmPendingUser = await prisma.user.upsert({
    where: { email: "umkm.pending@sinar.id" },
    update: { passwordHash, role: Role.UMKM, status: AccountStatus.PENDING },
    create: {
      email: "umkm.pending@sinar.id",
      passwordHash,
      role: Role.UMKM,
      status: AccountStatus.PENDING,
      organizationMembers: {
        create: {
          organizationId: umkmPendingOrg.id,
          role: "OWNER",
        },
      },
    },
  });
  console.log(`✓ UMKM (Pending) seeded: ${umkmPendingUser.email}`);

  // 4. Industri Verified (PT Nusantara Logistik)
  const industriOrg = await prisma.organization.upsert({
    where: { id: "org-industri-nusantara" },
    update: {},
    create: {
      id: "org-industri-nusantara",
      name: "PT Nusantara Logistik",
      type: OrgType.INDUSTRY,
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      address: "Gedung Perkantoran Tower 8 Lt. 12, Jakarta",
      picName: "Irfan Pratama",
      picPhone: "081700998877",
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const industriUser = await prisma.user.upsert({
    where: { email: "industri@nusantara.id" },
    update: {
      passwordHash,
      role: Role.INDUSTRY,
      status: AccountStatus.VERIFIED,
    },
    create: {
      email: "industri@nusantara.id",
      passwordHash,
      role: Role.INDUSTRY,
      status: AccountStatus.VERIFIED,
      organizationMembers: {
        create: {
          organizationId: industriOrg.id,
          role: "OWNER",
        },
      },
    },
  });
  console.log(`✓ Industri (Verified) seeded: ${industriUser.email}`);

  // 5. Default Scoring Config
  await prisma.scoringConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      readinessLegalitas: 20,
      readinessKapasitas: 20,
      readinessMutu: 20,
      readinessRekamJejak: 20,
      readinessAdmin: 10,
      readinessFinansial: 10,

      matchingKategori: 25,
      matchingKapasitas: 20,
      matchingBahan: 15,
      matchingLeadTime: 10,
      matchingLokasi: 10,
      matchingReadiness: 10,
      matchingReputasi: 10,
    },
  });
  console.log("✓ Default Scoring Config seeded");

  // 6. Default Platform Config
  await prisma.platformConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      commissionPercent: 5,
      minLots: 2,
      maxLots: 4,
      minLotQty: 20,
      fundingDeadlineHours: 72,
      autoConfirmMaterialHours: 48,
      autoConfirmQcDays: 5,
      umkmInactivityGraceHours: 72,
      disputeClaimWindowDays: 5,
      cancellationFeePercent: 2,
      compensationMatrix: [
        {
          stage: "SEBELUM_BAHAN_TIBA",
          label: "Sebelum bahan tiba (belum ada rilis)",
          buyerRefundRule: "100% dikurangi biaya administrasi platform (2%)",
          umkmCompensationRule: "Tidak ada kompensasi",
        },
        {
          stage: "BAHAN_TIBA_ATAU_PRODUKSI",
          label: "Setelah bahan tiba / produksi berjalan",
          buyerRefundRule: "Sisa dana escrow setelah kompensasi",
          umkmCompensationRule:
            "Sebesar nilai yang terbukti (bahan terbeli & progres milestone)",
        },
        {
          stage: "BARANG_SIAP_KIRIM",
          label: "Setelah barang siap kirim",
          buyerRefundRule:
            "Biaya yang dapat dihemat (ongkir / finishing akhir bila ada)",
          umkmCompensationRule:
            "Nilai order penuh dikurangi biaya yang dapat dihemat",
        },
      ],
    },
  });
  console.log("✓ Default Platform Config seeded");

  // 7. Textile Product Taxonomy 2-Tingkat (Spec 7.2)
  const categoriesData = [
    {
      name: "Seragam dan Workwear",
      slug: "seragam-workwear",
      children: [
        { name: "Kemeja Kerja", slug: "kemeja-kerja" },
        { name: "Blazer / Jas", slug: "blazer-jas" },
        { name: "Batik Kantor", slug: "batik-kantor" },
        { name: "Wearpack / Coverall", slug: "wearpack-coverall" },
        { name: "Rompi Lapangan", slug: "rompi-lapangan" },
        { name: "Seragam Hospitality", slug: "seragam-hospitality" },
      ],
    },
    {
      name: "Atasan dan Kaos",
      slug: "atasan-kaos",
      children: [
        { name: "Kaos Oblong (T-Shirt)", slug: "kaos-oblong" },
        { name: "Polo Shirt", slug: "polo-shirt" },
        { name: "Hoodie & Sweatshirt", slug: "hoodie-sweatshirt" },
        { name: "Jaket Bomber / Parka", slug: "jaket-bomber-parka" },
      ],
    },
    {
      name: "Bawahan",
      slug: "bawahan",
      children: [
        { name: "Celana Kerja Formal", slug: "celana-kerja-formal" },
        { name: "Celana Chino / Cargo", slug: "celana-chino-cargo" },
        { name: "Rok Kerja", slug: "rok-kerja" },
      ],
    },
    {
      name: "Aksesori Tekstil",
      slug: "aksesori-tekstil",
      children: [
        { name: "Topi & Headwear", slug: "topi-headwear" },
        { name: "Tote Bag & Goodie Bag", slug: "tote-bag" },
        { name: "Apron & Celemek", slug: "apron-celemek" },
      ],
    },
    {
      name: "Layanan Pendukung",
      slug: "layanan-pendukung",
      children: [
        { name: "Bordir Komputer", slug: "bordir-komputer" },
        { name: "Sablon Manual & DTF", slug: "sablon-dtf" },
        { name: "Pembuatan Pola & Sampel", slug: "pola-sampel" },
        { name: "Finishing & Packing", slug: "finishing-packing" },
      ],
    },
  ];

  for (const cat of categoriesData) {
    const parent = await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });

    for (const sub of cat.children) {
      await prisma.productCategory.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, parentId: parent.id },
        create: { name: sub.name, slug: sub.slug, parentId: parent.id },
      });
    }
  }
  console.log("✓ Textile Product Taxonomy 2-Tingkat seeded");

  // 8. Layanan Produksi (Spec 7.2)
  const services = [
    { name: "Potong (Cutting Bahan)", slug: "potong-cutting" },
    { name: "Jahit CMT (Cut-Make-Trim)", slug: "jahit-cmt" },
    { name: "Full Package (Termasuk Bahan)", slug: "full-package" },
    { name: "Bordir Komputer", slug: "bordir" },
    { name: "Sablon / DTF", slug: "sablon-dtf" },
    { name: "Pembuatan Pola & Grading", slug: "pola-grading" },
    { name: "Pembuatan Sampel (Prototipe)", slug: "sampling" },
    { name: "Finishing dan Packing", slug: "finishing-packing-service" },
  ];

  for (const s of services) {
    await prisma.productionService.upsert({
      where: { slug: s.slug },
      update: { name: s.name },
      create: { name: s.name, slug: s.slug },
    });
  }
  console.log("✓ Production Services seeded");

  // 9. Master Sertifikasi & Uji Tekstil (Spec 7.2 & 7.7)
  const certs = [
    {
      name: "OEKO-TEX Standard 100",
      issuer: "OEKO-TEX Association",
      description: "Uji keamanan bebas zat kimia berbahaya pada tekstil.",
    },
    {
      name: "Uji Lab Kain SNI",
      issuer: "Balai Besar Tekstil / Sucofindo",
      description:
        "Pengujian komposisi serat, gramasi (GSM), dan ketahanan luntur warna.",
    },
    {
      name: "ISO 9001:2015 Sistem Manajemen Mutu",
      issuer: "Badan Sertifikasi Terakreditasi",
      description: "Standar proses kendali mutu industri dan konveksi.",
    },
    {
      name: "Sertifikat Halal Tekstil",
      issuer: "BPJPH / LPPOM MUI",
      description:
        "Sertifikasi kehalalan bahan kain dan proses finishing tekstil.",
    },
  ];

  for (const c of certs) {
    const existing = await prisma.certification.findFirst({
      where: { name: c.name },
    });
    if (!existing) {
      await prisma.certification.create({ data: c });
    }
  }
  console.log("✓ Master Certifications seeded");

  // 10. Aturan Rekomendasi (Spec 7.8)
  const rules = [
    {
      component: "MUTU",
      condition: "qc_inline_sop == null",
      text: "Unggah SOP QC jahit untuk meningkatkan skor mutu (+5)",
      points: 5,
      difficulty: "MUDAH",
    },
    {
      component: "LEGALITAS",
      condition: "nib_verified == false",
      text: "Lengkapi dan verifikasi NIB dari OSS (+8)",
      points: 8,
      difficulty: "SEDANG",
    },
    {
      component: "FASILITAS",
      condition: "machine_list_count == 0",
      text: "Tambahkan foto dan daftar mesin bengkel konveksi (+5)",
      points: 5,
      difficulty: "MUDAH",
    },
    {
      component: "MUTU",
      condition: "fabric_lab_test == null",
      text: "Lakukan uji lab kain untuk bahan utama seragam (+5)",
      points: 5,
      difficulty: "SEDANG",
    },
    {
      component: "ADMINISTRASI",
      condition: "avg_response_time > 24",
      text: "Pertahankan kecepatan respons penawaran di bawah 24 jam (+3)",
      points: 3,
      difficulty: "MUDAH",
    },
  ];

  for (const r of rules) {
    const existing = await prisma.recommendationRule.findFirst({
      where: { text: r.text },
    });
    if (!existing) {
      await prisma.recommendationRule.create({ data: r });
    }
  }
  console.log("✓ Recommendation Rules seeded");

  // 10. Seed Demo RFQ-0007 (Spec 7.3.5)
  const existingRfq7 = await prisma.rfq.findUnique({
    where: { rfqNumber: "RFQ-0007" },
  });

  if (!existingRfq7) {
    const rfq7 = await prisma.rfq.create({
      data: {
        rfqNumber: "RFQ-0007",
        industryOrgId: industriOrg.id,
        title: "Seragam Karyawan Kantor 2027",
        categoryType: "SERAGAM",
        visibility: "TERBUKA",
        contextDescription:
          "Pengadaan kemeja kerja dan rompi operasional untuk seluruh karyawan cabang PT Nusantara Logistik.",
        allocationMode: "TUNGGAL",
        maxLotsPerUmkm: 1,
        needSample: true,
        sampleCostBearer: "DIKREDITKAN",
        sampleCount: 1,
        sampleDeadlineDays: 7,
        qaDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        quotationDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        targetDeliveryDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        deliveryLocation: "Gudang Logistik Pusat, Daan Mogot, Tangerang",
        staggeredDelivery: false,
        releaseTerms: {
          stages: [
            { percentage: 30, trigger: "Bahan tiba di workshop konveksi" },
            {
              percentage: 70,
              trigger: "QC akhir lolos dan barang diterima di gudang",
            },
          ],
          description:
            "Pembeli mendanai penuh ke escrow sebelum produksi. 30% dirilis saat bahan tiba, 70% setelah QC lolos.",
        },
        indicativeBudget: BigInt(35000000),
        hideBudget: false,
        evaluationWeights: {
          price: 35,
          compliance: 25,
          timeline: 20,
          reputation: 20,
        },
        status: "OPEN",
        items: {
          create: [
            {
              name: "Kemeja kerja lengan panjang pria",
              fabricType: "Katun TC ±140 gsm",
              gsmMin: 135,
              gsmMax: 145,
              color: "Biru Navy",
              materialProvidedByBuyer: false,
              referencePhotoUrl:
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
              constructionNotes:
                "Kerah standar tegak, belahan kancing depan tertutup, kancing lengan ganda.",
              decorationType: "BORDIR",
              decorationPlacement: "Dada Kiri",
              labelPackingNotes:
                "Packing individual per nama karyawan dengan hangtag.",
              quantityTolerancePercent: 3.0,
              dimensionTolerance: "±1 cm",
              aqlStandard: "AQL 2.5",
              needLabTest: true,
              totalQuantity: 200,
              sizes: {
                create: [
                  { size: "S", quantity: 20 },
                  { size: "M", quantity: 70 },
                  { size: "L", quantity: 70 },
                  { size: "XL", quantity: 30 },
                  { size: "XXL", quantity: 10 },
                ],
              },
            },
            {
              name: "Rompi operasional",
              fabricType: "Drill ±240 gsm",
              gsmMin: 230,
              gsmMax: 250,
              color: "Abu-abu",
              materialProvidedByBuyer: false,
              referencePhotoUrl:
                "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600",
              constructionNotes:
                "Lapisan furing parasut, resleting depan vislon, 2 saku tempel bawah.",
              decorationType: "SABLON",
              decorationPlacement: "Punggung",
              labelPackingNotes: "Packing polybag per lusin.",
              quantityTolerancePercent: 3.0,
              dimensionTolerance: "±1.5 cm",
              aqlStandard: "AQL 2.5",
              needLabTest: false,
              totalQuantity: 100,
              sizes: {
                create: [
                  { size: "M", quantity: 40 },
                  { size: "L", quantity: 40 },
                  { size: "XL", quantity: 20 },
                ],
              },
            },
          ],
        },
        requirements: {
          create: [
            {
              type: "LEGALITAS",
              description: "Nomor Induk Berusaha (NIB) terverifikasi",
              isMandatory: true,
            },
            {
              type: "MUTU",
              description: "Hasil uji lab kain untuk ketahanan luntur warna",
              isMandatory: true,
            },
            {
              type: "PENGALAMAN",
              description:
                "Pengalaman pengerjaan seragam korporasi minimal 1 order",
              isMandatory: false,
            },
          ],
        },
        questions: {
          create: [
            {
              askerOrgId: umkmOrg.id,
              question:
                "Apakah merk benang jahit disyaratkan khusus seperti Coats atau Astra?",
              answer:
                "Boleh menggunakan Coats atau Astra dengan warna senada bahan utama.",
              answeredAt: new Date(),
            },
          ],
        },
        addendums: {
          create: [
            {
              addendumNumber: 1,
              summary:
                "Penyesuaian toleransi ukuran panjang lengan kemeja disepakati menjadi ±1.5 cm.",
              changes: {
                field: "dimensionTolerance",
                before: "±1 cm",
                after: "±1.5 cm",
              },
            },
          ],
        },
      },
    });
    console.log(`✓ Demo RFQ-0007 seeded: ${rfq7.rfqNumber}`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
