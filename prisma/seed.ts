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
