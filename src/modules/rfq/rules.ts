/**
 * RFQ Rules & Pure Functions (Spec 7.3, 7.3.4, 7.3.7)
 * Menegakkan aturan R-01 s.d R-07 dan state machine siklus hidup RFQ.
 */

export type RfqCategoryType = "SERAGAM" | "MERCHANDISE" | "MAKLON";
export type RfqVisibility = "TERBUKA" | "UNDANGAN";
export type RfqAllocationMode = "TUNGGAL" | "LOT";
export type RfqStatus =
  | "DRAFT"
  | "OPEN"
  | "CLOSED"
  | "EVALUATING"
  | "SAMPLING"
  | "AWARDED"
  | "AWARDED_PARTIAL"
  | "EXPIRED"
  | "CANCELLED";

export interface RfqItemSizeInput {
  size: string;
  quantity: number;
}

export interface RfqItemInput {
  name: string;
  fabricType: string;
  gsmMin?: number | null;
  gsmMax?: number | null;
  color: string;
  materialProvidedByBuyer?: boolean;
  techPackUrl?: string | null;
  referencePhotoUrl?: string | null;
  constructionNotes?: string | null;
  decorationType?: string | null;
  decorationPlacement?: string | null;
  labelPackingNotes?: string | null;
  quantityTolerancePercent?: number | null;
  dimensionTolerance?: string | null;
  aqlStandard?: string | null;
  needLabTest?: boolean;
  totalQuantity: number;
  sizes: RfqItemSizeInput[];
}

export interface RfqValidationInput {
  title: string;
  categoryType: RfqCategoryType;
  visibility: RfqVisibility;
  items: RfqItemInput[];
  quotationDeadline: Date | string;
  qaDeadline?: Date | string | null;
  targetDeliveryDate: Date | string;
  indicativeBudget?: number | bigint | null;
}

export interface RfqValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validasi aturan R-01 s.d R-03 untuk RFQ (Pure function).
 */
export function validateRfq(
  input: RfqValidationInput,
  currentDate: Date = new Date(),
  minQuotationDeadlineDays: number = 3
): RfqValidationResult {
  const errors: string[] = [];

  // R-01: Minimal satu item
  if (!input.items || input.items.length === 0) {
    errors.push("Minimal harus ada satu item dalam RFQ (R-01)");
    return { isValid: false, errors };
  }

  // R-01 & R-02: Validasi per item
  input.items.forEach((item, idx) => {
    const itemPrefix = `Item ${idx + 1} (${item.name || "Tanpa Nama"}):`;

    if (!item.fabricType || item.fabricType.trim().length === 0) {
      errors.push(`${itemPrefix} Bahan wajib diisi (R-01)`);
    }

    if (item.totalQuantity <= 0) {
      errors.push(
        `${itemPrefix} Jumlah kuantitas item harus lebih besar dari 0 (R-01)`
      );
    }

    const hasAttachment =
      Boolean(
        item.referencePhotoUrl && item.referencePhotoUrl.trim().length > 0
      ) || Boolean(item.techPackUrl && item.techPackUrl.trim().length > 0);

    if (!hasAttachment) {
      errors.push(
        `${itemPrefix} Minimal satu lampiran referensi atau tech pack wajib disertakan (R-01)`
      );
    }

    if (
      input.categoryType === "MAKLON" &&
      (!item.techPackUrl || item.techPackUrl.trim().length === 0)
    ) {
      errors.push(
        `${itemPrefix} Tech pack wajib dilampirkan untuk jenis kebutuhan Maklon (R-01)`
      );
    }

    // R-02: Total qty item = jumlah seluruh ukuran
    let sizeSum = 0;
    let hasNegativeSize = false;

    if (item.sizes && item.sizes.length > 0) {
      for (const s of item.sizes) {
        if (s.quantity < 0) {
          hasNegativeSize = true;
        }
        sizeSum += s.quantity;
      }
    }

    if (hasNegativeSize) {
      errors.push(`${itemPrefix} Kuantitas ukuran tidak boleh negatif (R-02)`);
    }

    if (sizeSum !== item.totalQuantity) {
      errors.push(
        `${itemPrefix} Total kuantitas (${item.totalQuantity}) tidak sesuai dengan jumlah rincian ukuran (${sizeSum}) (R-02)`
      );
    }
  });

  // R-03: Validasi jadwal
  const qDeadline = new Date(input.quotationDeadline);
  const now = new Date(currentDate);
  const minDeadlineMillis = minQuotationDeadlineDays * 24 * 60 * 60 * 1000;

  if (qDeadline.getTime() - now.getTime() < minDeadlineMillis - 1000) {
    errors.push(
      `Tenggat penawaran minimal ${minQuotationDeadlineDays} hari setelah tanggal pembuatan/terbit (R-03)`
    );
  }

  if (input.qaDeadline) {
    const qa = new Date(input.qaDeadline);
    if (qa.getTime() >= qDeadline.getTime()) {
      errors.push("Tenggat tanya jawab harus sebelum tenggat penawaran (R-03)");
    }
  }

  const delivery = new Date(input.targetDeliveryDate);
  if (delivery.getTime() <= qDeadline.getTime()) {
    errors.push("Target tanggal kirim harus setelah tenggat penawaran (R-03)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * R-04: Cek apakah RFQ boleh diubah secara langsung tanpa Addendum.
 * Hanya RFQ yang masih berstatus DRAFT yang boleh diedit langsung.
 */
export function canEditRfqDirectly(status: RfqStatus): boolean {
  return status === "DRAFT";
}

/**
 * R-05 & Spec 7.3.7: State machine transisi status RFQ.
 */
export function transitionRfqStatus(
  currentStatus: RfqStatus,
  nextStatus: RfqStatus,
  context?: {
    cancelReason?: string | null;
    hasBids?: boolean;
  }
): { success: boolean; error?: string } {
  // R-05: Penanganan khusus pembatalan
  if (nextStatus === "CANCELLED") {
    // Tidak boleh membatalkan jika sudah selesai / awarded / terminal
    if (
      currentStatus === "AWARDED" ||
      currentStatus === "AWARDED_PARTIAL" ||
      currentStatus === "EXPIRED" ||
      currentStatus === "CANCELLED"
    ) {
      return {
        success: false,
        error: `Tidak dapat membatalkan RFQ yang sudah berada pada status ${currentStatus}`,
      };
    }

    if (!context?.cancelReason || context.cancelReason.trim().length < 5) {
      return {
        success: false,
        error: "Alasan pembatalan wajib disertakan minimal 5 karakter (R-05)",
      };
    }

    return { success: true };
  }

  // Transisi normal
  switch (currentStatus) {
    case "DRAFT":
      if (nextStatus === "OPEN") return { success: true };
      break;

    case "OPEN":
      if (nextStatus === "CLOSED") return { success: true };
      if (nextStatus === "EXPIRED") {
        if (context?.hasBids) {
          return {
            success: false,
            error:
              "RFQ tidak dapat ditandai EXPIRED karena sudah memiliki penawaran masuk",
          };
        }
        return { success: true };
      }
      break;

    case "CLOSED":
      if (nextStatus === "EVALUATING") return { success: true };
      break;

    case "EVALUATING":
      if (nextStatus === "SAMPLING") return { success: true };
      if (nextStatus === "AWARDED" || nextStatus === "AWARDED_PARTIAL") {
        return { success: true };
      }
      break;

    case "SAMPLING":
      if (nextStatus === "AWARDED" || nextStatus === "AWARDED_PARTIAL") {
        return { success: true };
      }
      break;

    default:
      // Status terminal tidak bisa beralih
      break;
  }

  return {
    success: false,
    error: `Transisi status tidak valid dari ${currentStatus} ke ${nextStatus}`,
  };
}

/**
 * R-06: Cek visibilitas RFQ.
 */
export function canAccessRfq(
  visibility: RfqVisibility,
  userOrgId: string,
  invitedOrgIds: string[] = []
): boolean {
  if (visibility === "TERBUKA") {
    return true;
  }
  // Mode UNDANGAN
  return invitedOrgIds.includes(userOrgId);
}

/**
 * Template default per jenis kebutuhan tekstil (Spec 7.3.6).
 */
export function getRfqTemplate(type: RfqCategoryType) {
  switch (type) {
    case "SERAGAM":
      return {
        defaultLabelNotes:
          "Packing individual per nama karyawan dengan hangtag",
        recommendSample: true,
        defaultDecoration: "BORDIR",
        description:
          "Rincian ukuran per karyawan/divisi, bordir/sablon logo, packing per nama.",
      };
    case "MERCHANDISE":
      return {
        defaultLabelNotes: "Packing polybag standar per lusin",
        recommendSample: false,
        defaultDecoration: "SABLON",
        description:
          "Kuantitas besar dengan ukuran sederhana, warna dan dekorasi menjadi inti.",
      };
    case "MAKLON":
      return {
        defaultLabelNotes: "Packing karton ekspor dengan silica gel",
        recommendSample: true,
        defaultDecoration: "TIDAK_ADA",
        description:
          "Tech pack wajib, spesifikasi pola/grading, bahan CMT atau full package.",
      };
  }
}
