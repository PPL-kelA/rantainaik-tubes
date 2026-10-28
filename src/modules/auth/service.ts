import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  RegisterInput,
  RegisterSchema,
  ResetPasswordInput,
  ResetPasswordSchema,
} from "./schema";
import * as repo from "./repo";
import {
  AuthError,
  computeFailedLogin,
  isAccountLocked,
  isResetTokenExpired,
  RESET_TOKEN_EXPIRY_HOURS,
} from "./rules";

const SALT_ROUNDS = 10;

export async function register(input: RegisterInput) {
  const validated = RegisterSchema.parse(input);

  const existingUser = await repo.findUserByEmail(validated.email);
  if (existingUser) {
    throw new AuthError(
      "Email sudah terdaftar. Silakan gunakan email lain atau masuk.",
      "EMAIL_ALREADY_EXISTS",
      400
    );
  }

  const passwordHash = await bcrypt.hash(validated.password, SALT_ROUNDS);

  const result = await repo.createUserWithOrganization({
    email: validated.email,
    passwordHash,
    role: validated.role,
    organizationName: validated.organizationName,
    city: validated.city,
    province: validated.province,
    address: validated.address,
    picName: validated.picName,
    picPhone: validated.picPhone,
  });

  return {
    userId: result.user.id,
    email: result.user.email,
    role: result.user.role,
    status: result.user.status,
    organizationId: result.organization.id,
    organizationName: result.organization.name,
  };
}

export async function verifyCredentials(email: string, passwordPlain: string) {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new AuthError(
      "Email atau kata sandi tidak valid.",
      "INVALID_CREDENTIALS",
      401
    );
  }

  // Check account lockout
  const now = new Date();
  if (isAccountLocked(user.lockedUntil, now)) {
    const remainingMinutes = Math.ceil(
      ((user.lockedUntil?.getTime() ?? 0) - now.getTime()) / (60 * 1000)
    );
    throw new AuthError(
      `Akun terkunci sementara karena terlalu banyak percobaan gagal. Coba lagi dalam ${remainingMinutes} menit.`,
      "ACCOUNT_LOCKED",
      423
    );
  }

  const isPasswordValid = await bcrypt.compare(
    passwordPlain,
    user.passwordHash
  );
  if (!isPasswordValid) {
    const { newAttempts, lockedUntil } = computeFailedLogin(
      user.failedLoginAttempts,
      now
    );
    await repo.updateFailedLogin(user.id, newAttempts, lockedUntil);

    if (lockedUntil) {
      throw new AuthError(
        "Terlalu banyak percobaan masuk yang salah. Akun Anda dikunci selama 15 menit.",
        "ACCOUNT_LOCKED",
        423
      );
    }

    throw new AuthError(
      "Email atau kata sandi tidak valid.",
      "INVALID_CREDENTIALS",
      401
    );
  }

  // Reset failed login attempts on successful login
  if (user.failedLoginAttempts > 0) {
    await repo.resetFailedLogin(user.id);
  }

  const organization = user.organizationMembers[0]?.organization;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    organizationId: organization?.id ?? null,
    organizationName: organization?.name ?? null,
  };
}

export async function requestPasswordReset(email: string) {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    // Return success to avoid email enumeration
    return { success: true };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(
    Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
  );

  await repo.saveResetToken(user.id, resetToken, expiry);

  // Send email (via adapter / console fallback)
  const resetUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH - RESET PASSWORD] To: ${user.email}`);
  console.log(`Link Reset Kata Sandi: ${resetUrl}`);
  console.log(`Kedaluwarsa: ${RESET_TOKEN_EXPIRY_HOURS} jam dari sekarang.`);
  console.log(`======================================================\n`);

  return { success: true, resetToken };
}

export async function resetPassword(input: ResetPasswordInput) {
  const validated = ResetPasswordSchema.parse(input);

  const user = await repo.findUserByResetToken(validated.token);
  if (!user || isResetTokenExpired(user.resetTokenExpiry)) {
    throw new AuthError(
      "Token reset kata sandi tidak valid atau telah kedaluwarsa.",
      "INVALID_RESET_TOKEN",
      400
    );
  }

  const newHash = await bcrypt.hash(validated.newPassword, SALT_ROUNDS);
  await repo.updatePassword(user.id, newHash);

  return { success: true };
}

export async function listUsersForAdmin() {
  const users = await repo.listAllUsers();
  return users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    failedAttempts: u.failedLoginAttempts,
    organization: u.organizationMembers[0]?.organization || null,
  }));
}

export async function verifyUserAccount(targetUserId: string) {
  const user = await repo.findUserById(targetUserId);
  if (!user) {
    throw new AuthError("Pengguna tidak ditemukan.", "USER_NOT_FOUND", 404);
  }

  await repo.updateUserAndOrgStatus(targetUserId, "VERIFIED");
  return {
    success: true,
    message: `Akun ${user.email} berhasil diverifikasi (VERIFIED).`,
  };
}

export async function suspendUserAccount(targetUserId: string) {
  const user = await repo.findUserById(targetUserId);
  if (!user) {
    throw new AuthError("Pengguna tidak ditemukan.", "USER_NOT_FOUND", 404);
  }

  await repo.updateUserAndOrgStatus(targetUserId, "SUSPENDED");
  return {
    success: true,
    message: `Akun ${user.email} berhasil ditangguhkan (SUSPENDED).`,
  };
}
