import { DocumentStatus, DocumentType, OrgType } from "@prisma/client";

export interface DocumentSummary {
  type: DocumentType;
  status: DocumentStatus;
  validUntil?: Date | null;
}

export const UMKM_REQUIRED_DOC_TYPES: DocumentType[] = [
  "NIB",
  "NPWP",
  "IZIN_USAHA",
  "FOTO_BENGKEL",
];

export const INDUSTRY_REQUIRED_DOC_TYPES: DocumentType[] = [
  "NPWP",
  "KONTAK_PIC",
  // Requires either NIB or AKTA
];

/**
 * Checks whether the minimum required documents are verified for an organization.
 * Pure function as required by spec 7.1 and AGENTS.md.
 *
 * @param orgType - Organization type (UMKM or INDUSTRY)
 * @param docs - List of documents with their type and verification status
 * @param referenceDate - Optional date to check expiration (defaults to now)
 * @returns boolean - true if all minimum docs are VERIFIED and not expired
 */
export function isMinimumDocsMet(
  orgType: OrgType | "UMKM" | "INDUSTRY",
  docs: DocumentSummary[],
  referenceDate: Date = new Date()
): boolean {
  if (orgType === "UMKM") {
    return UMKM_REQUIRED_DOC_TYPES.every((requiredType) => {
      return docs.some((doc) => {
        if (doc.type !== requiredType || doc.status !== "VERIFIED") {
          return false;
        }
        if (doc.validUntil && doc.validUntil < referenceDate) {
          return false;
        }
        return true;
      });
    });
  }

  if (orgType === "INDUSTRY") {
    // Must have NPWP and KONTAK_PIC
    const hasBaseDocs = INDUSTRY_REQUIRED_DOC_TYPES.every((requiredType) => {
      return docs.some((doc) => {
        if (doc.type !== requiredType || doc.status !== "VERIFIED") {
          return false;
        }
        if (doc.validUntil && doc.validUntil < referenceDate) {
          return false;
        }
        return true;
      });
    });

    // Must have at least one of NIB or AKTA verified
    const hasNibOrAkta = docs.some((doc) => {
      if (
        (doc.type === "NIB" || doc.type === "AKTA") &&
        doc.status === "VERIFIED"
      ) {
        if (doc.validUntil && doc.validUntil < referenceDate) {
          return false;
        }
        return true;
      }
      return false;
    });

    return hasBaseDocs && hasNibOrAkta;
  }

  return false;
}

/**
 * Returns missing or unverified document types for an organization.
 */
export function getMissingDocTypes(
  orgType: OrgType | "UMKM" | "INDUSTRY",
  docs: DocumentSummary[],
  referenceDate: Date = new Date()
): string[] {
  const missing: string[] = [];

  if (orgType === "UMKM") {
    for (const req of UMKM_REQUIRED_DOC_TYPES) {
      const isVerified = docs.some(
        (d) =>
          d.type === req &&
          d.status === "VERIFIED" &&
          (!d.validUntil || d.validUntil >= referenceDate)
      );
      if (!isVerified) {
        missing.push(req);
      }
    }
  } else if (orgType === "INDUSTRY") {
    for (const req of INDUSTRY_REQUIRED_DOC_TYPES) {
      const isVerified = docs.some(
        (d) =>
          d.type === req &&
          d.status === "VERIFIED" &&
          (!d.validUntil || d.validUntil >= referenceDate)
      );
      if (!isVerified) {
        missing.push(req);
      }
    }

    const hasNibOrAkta = docs.some(
      (d) =>
        (d.type === "NIB" || d.type === "AKTA") &&
        d.status === "VERIFIED" &&
        (!d.validUntil || d.validUntil >= referenceDate)
    );
    if (!hasNibOrAkta) {
      missing.push("NIB_ATAU_AKTA");
    }
  }

  return missing;
}
