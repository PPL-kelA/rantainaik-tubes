import { Role, AccountStatus } from "./schema";

export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;
export const RESET_TOKEN_EXPIRY_HOURS = 2;

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Memeriksa apakah role pengguna diizinkan untuk mengakses resource tertentu.
 */
export function hasRequiredRole(
  userRole: Role | undefined | null,
  allowedRoles: Role[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Server guard untuk memastikan role pengguna sesuai. Melempar AuthError bila tidak diizinkan.
 */
export function requireRole(
  userRole: Role | undefined | null,
  allowedRoles: Role[]
): void {
  if (!hasRequiredRole(userRole, allowedRoles)) {
    throw new AuthError(
      `Akses ditolak: role '${userRole ?? "ANONYMOUS"}' tidak memiliki izin mengakses rute ini.`,
      "FORBIDDEN_ROLE",
      403
    );
  }
}

/**
 * Memeriksa apakah akun pengguna sudah berstatus VERIFIED.
 */
export function isAccountVerified(
  status: AccountStatus | undefined | null
): boolean {
  return status === "VERIFIED";
}

/**
 * Server guard untuk memastikan akun berstatus VERIFIED.
 */
export function requireVerified(
  status: AccountStatus | undefined | null
): void {
  if (!isAccountVerified(status)) {
    throw new AuthError(
      "Akses ditolak: fitur ini hanya dapat diakses oleh akun yang telah terverifikasi (VERIFIED).",
      "ACCOUNT_NOT_VERIFIED",
      403
    );
  }
}

/**
 * Guard BR-01: Hanya akun VERIFIED dengan role INDUSTRY yang dapat memposting RFQ.
 */
export function canPostRfq(
  userRole: Role | undefined | null,
  status: AccountStatus | undefined | null
): boolean {
  return userRole === "INDUSTRY" && isAccountVerified(status);
}

/**
 * Guard BR-01: Hanya akun VERIFIED dengan role UMKM yang dapat mengirim penawaran (Quotation).
 */
export function canSubmitQuotation(
  userRole: Role | undefined | null,
  status: AccountStatus | undefined | null
): boolean {
  return userRole === "UMKM" && isAccountVerified(status);
}

/**
 * Memeriksa apakah akun sedang terkunci akibat terlalu banyak percobaan login gagal.
 */
export function isAccountLocked(
  lockedUntil: Date | null | undefined,
  now: Date = new Date()
): boolean {
  if (!lockedUntil) return false;
  return lockedUntil.getTime() > now.getTime();
}

/**
 * Menghitung status penguncian setelah kegagalan login baru.
 */
export function computeFailedLogin(
  currentAttempts: number,
  now: Date = new Date()
): { newAttempts: number; lockedUntil: Date | null; isLocked: boolean } {
  const newAttempts = currentAttempts + 1;
  if (newAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    const lockedUntil = new Date(
      now.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000
    );
    return { newAttempts, lockedUntil, isLocked: true };
  }
  return { newAttempts, lockedUntil: null, isLocked: false };
}

/**
 * Memeriksa apakah token reset password telah kedaluwarsa.
 */
export function isResetTokenExpired(
  expiryDate: Date | null | undefined,
  now: Date = new Date()
): boolean {
  if (!expiryDate) return true;
  return now.getTime() > expiryDate.getTime();
}
