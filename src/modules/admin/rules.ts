export interface ReadinessWeights {
  legalitas: number;
  fasilitas: number;
  mutu: number;
  rekamJejak: number;
  administrasi: number;
  finansial: number;
}

export interface MatchingWeights {
  kategori: number;
  kapasitas: number;
  bahanDekorasi: number;
  leadTime: number;
  lokasi: number;
  readiness: number;
  reputasi: number;
}

export interface PlatformParams {
  commissionPercent: number;
  minLots: number;
  maxLots: number;
  minLotQty: number;
  fundingDeadlineHours: number;
  autoConfirmMaterialHours: number;
  autoConfirmQcDays: number;
  umkmInactivityGraceHours: number;
  disputeClaimWindowDays: number;
  cancellationFeePercent: number;
}

export const DEFAULT_READINESS_WEIGHTS: ReadinessWeights = {
  legalitas: 20,
  fasilitas: 20,
  mutu: 20,
  rekamJejak: 20,
  administrasi: 10,
  finansial: 10,
};

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  kategori: 25,
  kapasitas: 20,
  bahanDekorasi: 15,
  leadTime: 10,
  lokasi: 10,
  readiness: 10,
  reputasi: 10,
};

export const DEFAULT_PLATFORM_CONFIG: PlatformParams = {
  commissionPercent: 5,
  minLots: 2,
  maxLots: 4,
  minLotQty: 20,
  fundingDeadlineHours: 72, // 3 x 24 jam
  autoConfirmMaterialHours: 48, // 2 x 24 jam
  autoConfirmQcDays: 5, // 5 hari kerja
  umkmInactivityGraceHours: 72, // 3 x 24 jam
  disputeClaimWindowDays: 5, // 5 hari kerja
  cancellationFeePercent: 2, // 2%
};

export const DEFAULT_COMPENSATION_MATRIX = [
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
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateReadinessWeights(
  weights: ReadinessWeights
): ValidationResult {
  const errors: string[] = [];
  const values = Object.values(weights);

  for (const [key, val] of Object.entries(weights)) {
    if (typeof val !== "number" || isNaN(val)) {
      errors.push(`Bobot ${key} harus berupa angka valid.`);
    } else if (val < 0) {
      errors.push(`Bobot ${key} tidak boleh bernilai negatif.`);
    }
  }

  const total = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  if (total !== 100) {
    errors.push(`Total bobot Readiness harus tepat 100. Saat ini: ${total}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateMatchingWeights(
  weights: MatchingWeights
): ValidationResult {
  const errors: string[] = [];
  const values = Object.values(weights);

  for (const [key, val] of Object.entries(weights)) {
    if (typeof val !== "number" || isNaN(val)) {
      errors.push(`Bobot ${key} harus berupa angka valid.`);
    } else if (val < 0) {
      errors.push(`Bobot ${key} tidak boleh bernilai negatif.`);
    }
  }

  const total = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  if (total !== 100) {
    errors.push(`Total bobot Matching harus tepat 100. Saat ini: ${total}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePlatformParams(
  params: PlatformParams
): ValidationResult {
  const errors: string[] = [];

  if (params.commissionPercent < 0 || params.commissionPercent > 100) {
    errors.push("Persentase komisi harus di antara 0% dan 100%.");
  }

  if (
    params.cancellationFeePercent < 0 ||
    params.cancellationFeePercent > 100
  ) {
    errors.push("Biaya administrasi pembatalan harus di antara 0% dan 100%.");
  }

  if (params.minLots < 1) {
    errors.push("Jumlah lot minimum harus sekurang-kurangnya 1.");
  }

  if (params.maxLots < params.minLots) {
    errors.push(
      `Jumlah lot maksimum (${params.maxLots}) tidak boleh lebih kecil dari minimum (${params.minLots}).`
    );
  }

  if (params.minLotQty < 1) {
    errors.push("Qty minimum per lot harus minimal 1 pcs.");
  }

  if (params.fundingDeadlineHours < 1) {
    errors.push("Batas waktu pendanaan harus minimal 1 jam.");
  }

  if (params.autoConfirmMaterialHours < 1) {
    errors.push("Waktu konfirmasi otomatis bahan harus minimal 1 jam.");
  }

  if (params.autoConfirmQcDays < 1) {
    errors.push("Waktu konfirmasi otomatis QC harus minimal 1 hari kerja.");
  }

  if (params.umkmInactivityGraceHours < 1) {
    errors.push("Tenggang UMKM tidak aktif harus minimal 1 jam.");
  }

  if (params.disputeClaimWindowDays < 1) {
    errors.push("Jendela klaim sengketa harus minimal 1 hari kerja.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
