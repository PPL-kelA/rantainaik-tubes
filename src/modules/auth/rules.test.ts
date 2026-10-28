import { describe, it, expect } from "vitest";
import {
  hasRequiredRole,
  requireRole,
  isAccountVerified,
  requireVerified,
  canPostRfq,
  canSubmitQuotation,
  isAccountLocked,
  computeFailedLogin,
  isResetTokenExpired,
  AuthError,
  MAX_FAILED_LOGIN_ATTEMPTS,
} from "./rules";

describe("Auth & RBAC Rules (Pure Business Logic)", () => {
  describe("Role & RBAC Guards", () => {
    it("hasRequiredRole returns true when role matches allowed list", () => {
      expect(hasRequiredRole("ADMIN", ["ADMIN"])).toBe(true);
      expect(hasRequiredRole("UMKM", ["UMKM", "INDUSTRY"])).toBe(true);
      expect(hasRequiredRole("INDUSTRY", ["ADMIN"])).toBe(false);
      expect(hasRequiredRole(null, ["ADMIN"])).toBe(false);
      expect(hasRequiredRole(undefined, ["ADMIN"])).toBe(false);
    });

    it("requireRole throws AuthError with code FORBIDDEN_ROLE when role is not permitted", () => {
      expect(() => requireRole("UMKM", ["ADMIN"])).toThrow(AuthError);
      expect(() => requireRole(null, ["INDUSTRY"])).toThrow("Akses ditolak");
      expect(() =>
        requireRole("INDUSTRY", ["INDUSTRY", "ADMIN"])
      ).not.toThrow();
    });
  });

  describe("Verification Guards & BR-01", () => {
    it("isAccountVerified returns true only when status is VERIFIED", () => {
      expect(isAccountVerified("VERIFIED")).toBe(true);
      expect(isAccountVerified("PENDING")).toBe(false);
      expect(isAccountVerified("SUSPENDED")).toBe(false);
      expect(isAccountVerified(null)).toBe(false);
    });

    it("requireVerified throws AuthError when account is PENDING or SUSPENDED", () => {
      expect(() => requireVerified("PENDING")).toThrow(
        "hanya dapat diakses oleh akun yang telah terverifikasi"
      );
      expect(() => requireVerified("SUSPENDED")).toThrow(AuthError);
      expect(() => requireVerified("VERIFIED")).not.toThrow();
    });

    it("Guard BR-01: canPostRfq returns true only for VERIFIED INDUSTRY", () => {
      expect(canPostRfq("INDUSTRY", "VERIFIED")).toBe(true);
      expect(canPostRfq("INDUSTRY", "PENDING")).toBe(false);
      expect(canPostRfq("INDUSTRY", "SUSPENDED")).toBe(false);
      expect(canPostRfq("UMKM", "VERIFIED")).toBe(false);
      expect(canPostRfq("ADMIN", "VERIFIED")).toBe(false);
    });

    it("Guard BR-01: canSubmitQuotation returns true only for VERIFIED UMKM", () => {
      expect(canSubmitQuotation("UMKM", "VERIFIED")).toBe(true);
      expect(canSubmitQuotation("UMKM", "PENDING")).toBe(false);
      expect(canSubmitQuotation("UMKM", "SUSPENDED")).toBe(false);
      expect(canSubmitQuotation("INDUSTRY", "VERIFIED")).toBe(false);
    });
  });

  describe("Rate Limiting & Lockout Rules", () => {
    it("isAccountLocked correctly identifies if lockout time is in the future", () => {
      const now = new Date("2026-10-28T10:00:00Z");
      const futureLock = new Date("2026-10-28T10:15:00Z");
      const pastLock = new Date("2026-10-28T09:59:00Z");

      expect(isAccountLocked(futureLock, now)).toBe(true);
      expect(isAccountLocked(pastLock, now)).toBe(false);
      expect(isAccountLocked(null, now)).toBe(false);
    });

    it(`computeFailedLogin locks account after ${MAX_FAILED_LOGIN_ATTEMPTS} attempts`, () => {
      const now = new Date("2026-10-28T10:00:00Z");
      const attempt1 = computeFailedLogin(0, now);
      expect(attempt1.newAttempts).toBe(1);
      expect(attempt1.isLocked).toBe(false);
      expect(attempt1.lockedUntil).toBeNull();

      const attempt5 = computeFailedLogin(4, now);
      expect(attempt5.newAttempts).toBe(5);
      expect(attempt5.isLocked).toBe(true);
      expect(attempt5.lockedUntil).not.toBeNull();
      // Locked for 15 minutes
      expect(attempt5.lockedUntil?.getTime()).toBe(
        now.getTime() + 15 * 60 * 1000
      );
    });
  });

  describe("Password Reset Token Expiry", () => {
    it("isResetTokenExpired returns true if token passed expiry or is null", () => {
      const now = new Date("2026-10-28T12:00:00Z");
      const future = new Date("2026-10-28T13:00:00Z");
      const past = new Date("2026-10-28T11:00:00Z");

      expect(isResetTokenExpired(future, now)).toBe(false);
      expect(isResetTokenExpired(past, now)).toBe(true);
      expect(isResetTokenExpired(null, now)).toBe(true);
    });
  });
});
