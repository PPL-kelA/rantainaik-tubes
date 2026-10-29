/**
 * Pure functions and business logic for Industrial Readiness Score (Spec 7.7, 7.8).
 * Strictly zero database and zero I/O dependencies.
 */

export interface ReadinessConfig {
  legalitas: number;
  fasilitas: number;
  mutu: number;
  rekamJejak: number;
  administrasi: number;
  finansial: number;
}

export const DEFAULT_READINESS_CONFIG: ReadinessConfig = {
  legalitas: 20,
  fasilitas: 20,
  mutu: 20,
  rekamJejak: 20,
  administrasi: 10,
  finansial: 10,
};

export type ItemStatus = "VERIFIED" | "DECLARED" | "UNMET" | "EXPIRED";

export interface EvaluatedItem {
  key: string;
  label: string;
  status: ItemStatus;
  score: number;
  maxScore: number;
  notes?: string;
}

export interface ComponentScore {
  name: string;
  code: "A" | "B" | "C" | "D" | "E" | "F";
  score: number;
  maxScore: number;
  hasHistory?: boolean;
  note?: string;
  items: EvaluatedItem[];
}

export interface ReadinessInput {
  legalitas?: {
    customScore?: number;
    nibVerified?: boolean;
    nibDeclared?: boolean;
    nibExpired?: boolean;
    npwpVerified?: boolean;
    npwpDeclared?: boolean;
    npwpExpired?: boolean;
    izinUsahaVerified?: boolean;
    izinUsahaDeclared?: boolean;
    izinUsahaExpired?: boolean;
    alamatFotoVerified?: boolean;
    alamatFotoDeclared?: boolean;
  };
  kapasitas?: {
    customScore?: number;
    hasMonthlyCapacity?: boolean;
    hasMachines?: boolean;
    hasOperatorInfo?: boolean;
    hasWorkshopPhoto?: boolean;
    hasLargestOrderRecord?: boolean;
  };
  mutu?: {
    customScore?: number;
    hasSopQc?: boolean;
    hasCertOrLabTest?: boolean;
    hasPortfolioSamples?: boolean;
    canPatternOrTechPack?: boolean;
  };
  rekamJejak?: {
    customScore?: number;
    hasHistory?: boolean;
    onTimeRatePercent?: number;
    defectRatePercent?: number;
    ratingAverage?: number;
    cancellationPenalty?: number;
  };
  administrasi?: {
    customScore?: number;
    hasDigitalRecord?: boolean;
    fastResponseTime?: boolean;
    fullCatalog?: boolean;
  };
  finansial?: {
    customScore?: number;
    hasWorkingCapital?: boolean;
    hasSimpleFinancialReport?: boolean;
    hasMaterialSupplierAccess?: boolean;
  };
}

export type ReadinessTier =
  "Tahap Awal" | "Berkembang" | "Siap Kemitraan" | "Siap Industri";

export type ReadinessTierKey =
  "TAHAP_AWAL" | "BERKEMBANG" | "SIAP_KEMITRAAN" | "SIAP_INDUSTRI";

export interface ReadinessResult {
  totalScore: number;
  tier: ReadinessTier;
  tierKey: ReadinessTierKey;
  tierDescription: string;
  components: {
    legalitas: ComponentScore;
    kapasitas: ComponentScore;
    mutu: ComponentScore;
    rekamJejak: ComponentScore;
    administrasi: ComponentScore;
    finansial: ComponentScore;
  };
}

/**
 * Pure evaluation helper for verified vs declared vs expired items.
 */
function evaluateItem(
  key: string,
  label: string,
  maxPoints: number,
  opts: {
    isVerified?: boolean;
    isDeclared?: boolean;
    isExpired?: boolean;
  }
): EvaluatedItem {
  if (opts.isExpired) {
    return {
      key,
      label,
      status: "EXPIRED",
      score: 0,
      maxScore: maxPoints,
      notes: "Dokumen telah kedaluwarsa (bernilai 0 poin)",
    };
  }
  if (opts.isVerified) {
    return {
      key,
      label,
      status: "VERIFIED",
      score: maxPoints,
      maxScore: maxPoints,
      notes: "Terverifikasi (bernilai penuh)",
    };
  }
  if (opts.isDeclared) {
    return {
      key,
      label,
      status: "DECLARED",
      score: Math.round(maxPoints * 0.5),
      maxScore: maxPoints,
      notes: "Dinyatakan sendiri (bernilai 50%)",
    };
  }
  return {
    key,
    label,
    status: "UNMET",
    score: 0,
    maxScore: maxPoints,
    notes: "Belum dilengkapi",
  };
}

/**
 * Pure function: calculates Industrial Readiness Score (0-100) per Spec 7.7.
 */
export function computeReadiness(
  input: ReadinessInput,
  config: ReadinessConfig = DEFAULT_READINESS_CONFIG
): ReadinessResult {
  // --- A. Legalitas dan profil (Default 20) ---
  const legItems: EvaluatedItem[] = [
    evaluateItem("nib", "NIB OSS", 8, {
      isVerified: input.legalitas?.nibVerified,
      isDeclared: input.legalitas?.nibDeclared,
      isExpired: input.legalitas?.nibExpired,
    }),
    evaluateItem("npwp", "NPWP Usaha / Perusahaan", 4, {
      isVerified: input.legalitas?.npwpVerified,
      isDeclared: input.legalitas?.npwpDeclared,
      isExpired: input.legalitas?.npwpExpired,
    }),
    evaluateItem("izin", "Izin Usaha / Domisili Usaha", 4, {
      isVerified: input.legalitas?.izinUsahaVerified,
      isDeclared: input.legalitas?.izinUsahaDeclared,
      isExpired: input.legalitas?.izinUsahaExpired,
    }),
    evaluateItem("lokasi", "Alamat dan Foto Bengkel Terverifikasi", 4, {
      isVerified: input.legalitas?.alamatFotoVerified,
      isDeclared: input.legalitas?.alamatFotoDeclared,
    }),
  ];

  let rawLegScore = legItems.reduce((sum, item) => sum + item.score, 0);
  if (typeof input.legalitas?.customScore === "number") {
    rawLegScore = input.legalitas.customScore;
  }
  // Scale to configured weight
  const legMax = config.legalitas;
  const legScore = Math.min(legMax, Math.round((rawLegScore / 20) * legMax));

  // --- B. Kapasitas dan fasilitas produksi (Default 20) ---
  const kapItems: EvaluatedItem[] = [
    evaluateItem(
      "kapasitas",
      "Kapasitas bulanan per jenis produk terdokumentasi",
      6,
      {
        isVerified: input.kapasitas?.hasMonthlyCapacity,
        isDeclared: input.kapasitas?.hasMonthlyCapacity,
      }
    ),
    evaluateItem("mesin", "Daftar dan jumlah mesin konveksi", 5, {
      isVerified: input.kapasitas?.hasMachines,
      isDeclared: input.kapasitas?.hasMachines,
    }),
    evaluateItem("sdm", "Jumlah penjahit/operator dan shift operasional", 4, {
      isVerified: input.kapasitas?.hasOperatorInfo,
      isDeclared: input.kapasitas?.hasOperatorInfo,
    }),
    evaluateItem("workshop", "Foto/video bengkel dan lini produksi", 3, {
      isVerified: input.kapasitas?.hasWorkshopPhoto,
      isDeclared: input.kapasitas?.hasWorkshopPhoto,
    }),
    evaluateItem(
      "order_terbesar",
      "Rekam jejak order terbesar yang pernah dipenuhi",
      2,
      {
        isVerified: input.kapasitas?.hasLargestOrderRecord,
        isDeclared: input.kapasitas?.hasLargestOrderRecord,
      }
    ),
  ];
  let rawKapScore = kapItems.reduce((sum, item) => sum + item.score, 0);
  if (typeof input.kapasitas?.customScore === "number") {
    rawKapScore = input.kapasitas.customScore;
  }
  const kapMax = config.fasilitas;
  const kapScore = Math.min(kapMax, Math.round((rawKapScore / 20) * kapMax));

  // --- C. Mutu dan kompetensi (Default 20) ---
  const mutuItems: EvaluatedItem[] = [
    evaluateItem("sop_qc", "SOP / checklist QC inline dan akhir", 5, {
      isVerified: input.mutu?.hasSopQc,
      isDeclared: input.mutu?.hasSopQc,
    }),
    evaluateItem("uji_lab", "Hasil uji lab kain atau sertifikasi relevan", 5, {
      isVerified: input.mutu?.hasCertOrLabTest,
      isDeclared: input.mutu?.hasCertOrLabTest,
    }),
    evaluateItem(
      "portofolio",
      "Portofolio produk sejenis dengan foto fisik",
      5,
      {
        isVerified: input.mutu?.hasPortfolioSamples,
        isDeclared: input.mutu?.hasPortfolioSamples,
      }
    ),
    evaluateItem("sampling", "Kemampuan membuat pola/tech pack dan sampel", 5, {
      isVerified: input.mutu?.canPatternOrTechPack,
      isDeclared: input.mutu?.canPatternOrTechPack,
    }),
  ];
  let rawMutuScore = mutuItems.reduce((sum, item) => sum + item.score, 0);
  if (typeof input.mutu?.customScore === "number") {
    rawMutuScore = input.mutu.customScore;
  }
  const mutuMax = config.mutu;
  const mutuScore = Math.min(
    mutuMax,
    Math.round((rawMutuScore / 20) * mutuMax)
  );

  // --- D. Rekam jejak transaksi (Default 20) ---
  const rekamMax = config.rekamJejak;
  let rekamScore = 0;
  let hasHistory = input.rekamJejak?.hasHistory ?? false;
  let rekamNote = "";

  if (typeof input.rekamJejak?.customScore === "number") {
    rekamScore = input.rekamJejak.customScore;
    hasHistory =
      input.rekamJejak.hasHistory ?? rekamScore !== Math.round(rekamMax * 0.5);
    if (!hasHistory) {
      rekamNote = "belum ada riwayat, memakai nilai awal 50%";
    }
  } else if (!hasHistory) {
    // Spec 7.7 rule: Tanpa riwayat memakai nilai awal 50%
    rekamScore = Math.round(rekamMax * 0.5);
    rekamNote = "belum ada riwayat, memakai nilai awal 50%";
  } else {
    // Has transaction history: onTime (8) + defect (6) + rating (6) - penalty
    const onTimePts = Math.round(
      ((input.rekamJejak?.onTimeRatePercent ?? 90) / 100) * 8
    );
    const defectPts = Math.round(
      (1 - (input.rekamJejak?.defectRatePercent ?? 2) / 100) * 6
    );
    const ratingPts = Math.round(
      ((input.rekamJejak?.ratingAverage ?? 4.5) / 5) * 6
    );
    const penalty = input.rekamJejak?.cancellationPenalty ?? 0;
    const rawHistory = Math.max(0, onTimePts + defectPts + ratingPts - penalty);
    rekamScore = Math.min(rekamMax, Math.round((rawHistory / 20) * rekamMax));
  }

  const rekamItems: EvaluatedItem[] = [
    {
      key: "on_time",
      label: "Ketepatan waktu pengiriman",
      status: hasHistory ? "VERIFIED" : "DECLARED",
      score: Math.round((rekamScore / rekamMax) * 8),
      maxScore: 8,
      notes: hasHistory ? undefined : "Belum ada transaksi selesai",
    },
    {
      key: "reject_rate",
      label: "Tingkat penerimaan QC (rendah reject)",
      status: hasHistory ? "VERIFIED" : "DECLARED",
      score: Math.round((rekamScore / rekamMax) * 6),
      maxScore: 6,
    },
    {
      key: "rating",
      label: "Rating kepuasan pembeli industri",
      status: hasHistory ? "VERIFIED" : "DECLARED",
      score: Math.round((rekamScore / rekamMax) * 6),
      maxScore: 6,
    },
  ];

  // --- E. Administrasi dan digital (Default 10) ---
  const adminItems: EvaluatedItem[] = [
    evaluateItem("pencatatan", "Pencatatan produksi dan stok teratur", 4, {
      isVerified: input.administrasi?.hasDigitalRecord,
      isDeclared: input.administrasi?.hasDigitalRecord,
    }),
    evaluateItem("respons", "Waktu respons komunikasi < 24 jam", 3, {
      isVerified: input.administrasi?.fastResponseTime,
      isDeclared: input.administrasi?.fastResponseTime,
    }),
    evaluateItem("katalog", "Portofolio dan katalog produk lengkap", 3, {
      isVerified: input.administrasi?.fullCatalog,
      isDeclared: input.administrasi?.fullCatalog,
    }),
  ];
  let rawAdminScore = adminItems.reduce((sum, item) => sum + item.score, 0);
  if (typeof input.administrasi?.customScore === "number") {
    rawAdminScore = input.administrasi.customScore;
  }
  const adminMax = config.administrasi;
  const adminScore = Math.min(
    adminMax,
    Math.round((rawAdminScore / 10) * adminMax)
  );

  // --- F. Finansial dan sumber bahan (Default 10) ---
  const finItems: EvaluatedItem[] = [
    evaluateItem("modal", "Kesanggupan modal kerja untuk pengadaan bahan", 4, {
      isVerified: input.finansial?.hasWorkingCapital,
      isDeclared: input.finansial?.hasWorkingCapital,
    }),
    evaluateItem("laporan", "Laporan keuangan / pembukuan sederhana", 3, {
      isVerified: input.finansial?.hasSimpleFinancialReport,
      isDeclared: input.finansial?.hasSimpleFinancialReport,
    }),
    evaluateItem("pemasok", "Akses jaringan pemasok bahan baku tekstil", 3, {
      isVerified: input.finansial?.hasMaterialSupplierAccess,
      isDeclared: input.finansial?.hasMaterialSupplierAccess,
    }),
  ];
  let rawFinScore = finItems.reduce((sum, item) => sum + item.score, 0);
  if (typeof input.finansial?.customScore === "number") {
    rawFinScore = input.finansial.customScore;
  }
  const finMax = config.finansial;
  const finScore = Math.min(finMax, Math.round((rawFinScore / 10) * finMax));

  // --- Total & Tiering (Spec 7.7) ---
  const totalScore = Math.min(
    100,
    legScore + kapScore + mutuScore + rekamScore + adminScore + finScore
  );

  let tier: ReadinessTier = "Tahap Awal";
  let tierKey: ReadinessTierKey = "TAHAP_AWAL";
  let tierDescription = "Perlu melengkapi dasar legalitas dan profil workshop.";

  if (totalScore >= 80) {
    tier = "Siap Industri";
    tierKey = "SIAP_INDUSTRI";
    tierDescription =
      "Pemasok konveksi kuat, terpercaya, dan siap order industri skala besar.";
  } else if (totalScore >= 60) {
    tier = "Siap Kemitraan";
    tierKey = "SIAP_KEMITRAAN";
    tierDescription =
      "Memenuhi mayoritas kriteria pengadaan industri dan tender RFQ.";
  } else if (totalScore >= 40) {
    tier = "Berkembang";
    tierKey = "BERKEMBANG";
    tierDescription =
      "Sebagian kriteria terpenuhi, dapat mengikuti RFQ skala sederhana.";
  }

  return {
    totalScore,
    tier,
    tierKey,
    tierDescription,
    components: {
      legalitas: {
        name: "Legalitas dan Profil",
        code: "A",
        score: legScore,
        maxScore: legMax,
        items: legItems,
      },
      kapasitas: {
        name: "Kapasitas dan Fasilitas Produksi",
        code: "B",
        score: kapScore,
        maxScore: kapMax,
        items: kapItems,
      },
      mutu: {
        name: "Mutu dan Kompetensi",
        code: "C",
        score: mutuScore,
        maxScore: mutuMax,
        items: mutuItems,
      },
      rekamJejak: {
        name: "Rekam Jejak Transaksi",
        code: "D",
        score: rekamScore,
        maxScore: rekamMax,
        hasHistory,
        note: rekamNote || undefined,
        items: rekamItems,
      },
      administrasi: {
        name: "Administrasi dan Digital",
        code: "E",
        score: adminScore,
        maxScore: adminMax,
        items: adminItems,
      },
      finansial: {
        name: "Finansial dan Sumber Bahan",
        code: "F",
        score: finScore,
        maxScore: finMax,
        items: finItems,
      },
    },
  };
}

export interface RecommendationRuleItem {
  id: string;
  component: string;
  condition: string;
  text: string;
  points: number;
  difficulty: string; // "MUDAH" | "SEDANG" | "SULIT"
  link?: string | null;
}

export interface RecommendedStep {
  id: string;
  component: string;
  text: string;
  points: number;
  difficulty: "MUDAH" | "SEDANG" | "SULIT";
  efficiencyRatio: number;
  link?: string | null;
}

/**
 * Pure function: recommends "3 langkah tercepat naik tier" ordered by points / difficulty ratio (Spec 7.8).
 */
export function recommendNextSteps(
  gaps: string[],
  rules: RecommendationRuleItem[]
): RecommendedStep[] {
  const difficultyWeights: Record<string, number> = {
    MUDAH: 1,
    SEDANG: 2,
    SULIT: 3,
  };

  const matchingRules = rules.filter((r) => gaps.includes(r.condition));

  const scoredRules: RecommendedStep[] = matchingRules.map((rule) => {
    const diffWeight = difficultyWeights[rule.difficulty] || 2;
    const efficiencyRatio = rule.points / diffWeight;

    return {
      id: rule.id,
      component: rule.component,
      text: rule.text,
      points: rule.points,
      difficulty: (rule.difficulty as "MUDAH" | "SEDANG" | "SULIT") || "SEDANG",
      efficiencyRatio,
      link: rule.link,
    };
  });

  // Sort by highest ratio first, then by highest points
  scoredRules.sort((a, b) => {
    if (b.efficiencyRatio !== a.efficiencyRatio) {
      return b.efficiencyRatio - a.efficiencyRatio;
    }
    return b.points - a.points;
  });

  return scoredRules.slice(0, 3);
}
