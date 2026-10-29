/**
 * Pure business logic for UMKM Capabilities & Portfolio (Tahap 5).
 * No database or I/O dependencies.
 */

export interface CapabilityInput {
  categoryId: string;
  services: string[];
  materials: string[];
  decorations: string[];
  monthlyCapacity: number;
  minOrderQty: number;
  leadTimeDays: number;
  serviceArea?: string | null;
  notes?: string | null;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates capability parameters per spec 7.2.
 */
export function validateCapability(input: CapabilityInput): ValidationResult {
  const errors: string[] = [];

  if (input.monthlyCapacity < 0) {
    errors.push("Kapasitas bulanan tidak boleh bernilai negatif.");
  }

  if (input.minOrderQty < 0) {
    errors.push("MOQ tidak boleh bernilai negatif.");
  }

  if (input.monthlyCapacity > 0 && input.minOrderQty > input.monthlyCapacity) {
    errors.push("MOQ tidak boleh melampaui kapasitas bulanan konveksi.");
  }

  if (input.leadTimeDays < 1) {
    errors.push("Lead time minimum adalah 1 hari kerja.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export interface ProfileCompletenessInput {
  organization: {
    name: string;
    city: string;
    province: string;
    description?: string | null;
    address?: string | null;
    picName: string;
    picPhone?: string | null;
    yearEstablished?: number | null;
    operatorCount?: number | null;
    shiftCount?: number | null;
  };
  capabilities: Array<{
    id: string;
    categoryId: string;
    monthlyCapacity: number;
    minOrderQty: number;
  }>;
  machines: Array<{ id: string; machineType: string; quantity: number }>;
  portfolio: Array<{ id: string; title: string; imageUrl: string }>;
  certifications: Array<{ id: string; validUntil?: Date | null }>;
  documentsCount: number;
}

export interface ProfileCompletenessResult {
  percentage: number;
  missingItems: string[];
}

/**
 * Pure function: calculates profile completeness percentage and missing recommendations.
 * Weight breakdown:
 * - Basic Info (Description, Address, PIC, Year, Operator): 25%
 * - Capabilities (at least 1 product category): 25%
 * - Machine Assets (at least 1 machine): 20%
 * - Portfolio (at least 1 photo): 15%
 * - Legal Documents (at least 1 document): 10%
 * - Certifications (optional bonus/finishing): 5%
 */
export function profileCompleteness(
  data: ProfileCompletenessInput
): ProfileCompletenessResult {
  let score = 0;
  const missingItems: string[] = [];

  // 1. Basic Info (25%)
  let basicScore = 0;
  if (
    data.organization.description &&
    data.organization.description.trim().length >= 10
  ) {
    basicScore += 10;
  } else {
    missingItems.push("Lengkapi deskripsi tentang usaha konveksi");
  }

  if (
    data.organization.address &&
    data.organization.address.trim().length > 0
  ) {
    basicScore += 5;
  } else {
    missingItems.push("Lengkapi alamat bengkel / lokasi produksi");
  }

  if (
    data.organization.picPhone &&
    data.organization.picPhone.trim().length > 0
  ) {
    basicScore += 4;
  } else {
    missingItems.push("Lengkapi nomor kontak PIC penanggung jawab");
  }

  if (data.organization.operatorCount && data.organization.operatorCount > 0) {
    basicScore += 3;
  } else {
    missingItems.push("Isi jumlah tenaga penjahit / operator");
  }

  if (
    data.organization.yearEstablished &&
    data.organization.yearEstablished > 1900
  ) {
    basicScore += 3;
  } else {
    missingItems.push("Isi tahun berdiri usaha konveksi");
  }
  score += basicScore;

  // 2. Capabilities (25%)
  if (data.capabilities.length > 0) {
    score += 25;
  } else {
    missingItems.push("Tambahkan minimal 1 kapabilitas produk tekstil");
  }

  // 3. Machine Assets (20%)
  if (data.machines.length > 0) {
    score += 20;
  } else {
    missingItems.push("Tambahkan minimal 1 aset mesin konveksi");
  }

  // 4. Portfolio (15%)
  if (data.portfolio.length > 0) {
    score += 15;
  } else {
    missingItems.push("Tambahkan minimal 1 foto portofolio produk");
  }

  // 5. Legal Documents (10%)
  if (data.documentsCount > 0) {
    score += 10;
  } else {
    missingItems.push("Unggah dokumen legalitas (NIB / NPWP)");
  }

  // 6. Certifications (5%)
  if (data.certifications.length > 0) {
    score += 5;
  }

  return {
    percentage: Math.min(100, Math.round(score)),
    missingItems,
  };
}

export type CertificateStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED";

export interface CheckedCertificate {
  id: string;
  name: string;
  validUntil: Date | null;
  status: CertificateStatus;
  daysRemaining: number | null;
}

/**
 * Pure function: checks validity and expiration status of certificates.
 * Spec requirement: alert 30 days before expiration.
 */
export function checkExpiringCertificates(
  certs: Array<{ id: string; name: string; validUntil: Date | null }>,
  thresholdDays: number = 30,
  currentDate: Date = new Date()
): CheckedCertificate[] {
  const currentMs = currentDate.getTime();

  return certs.map((cert) => {
    if (!cert.validUntil) {
      return {
        id: cert.id,
        name: cert.name,
        validUntil: null,
        status: "VALID",
        daysRemaining: null,
      };
    }

    const expiryMs = new Date(cert.validUntil).getTime();
    const diffMs = expiryMs - currentMs;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let status: CertificateStatus = "VALID";
    if (diffDays <= 0) {
      status = "EXPIRED";
    } else if (diffDays <= thresholdDays) {
      status = "EXPIRING_SOON";
    }

    return {
      id: cert.id,
      name: cert.name,
      validUntil: cert.validUntil,
      status,
      daysRemaining: diffDays,
    };
  });
}
