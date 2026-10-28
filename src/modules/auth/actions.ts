"use server";

import {
  register,
  requestPasswordReset,
  resetPassword,
  verifyUserAccount,
  suspendUserAccount,
} from "./service";
import { revalidatePath } from "next/cache";
import {
  RegisterSchema,
  RequestPasswordResetSchema,
  ResetPasswordSchema,
} from "./schema";
import { AuthError } from "./rules";

export async function registerAction(formData: unknown) {
  try {
    const validated = RegisterSchema.parse(formData);
    const result = await register(validated);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message, code: error.code };
    }
    if (error && typeof error === "object" && "errors" in error) {
      const issues = (error as { errors: Array<{ message: string }> }).errors;
      return {
        success: false,
        error: issues[0]?.message || "Input tidak valid.",
      };
    }
    return {
      success: false,
      error: "Terjadi kesalahan saat pendaftaran. Silakan coba lagi.",
    };
  }
}

export async function requestPasswordResetAction(email: string) {
  try {
    const validated = RequestPasswordResetSchema.parse({ email });
    await requestPasswordReset(validated.email);
    return {
      success: true,
      message:
        "Jika email terdaftar, tautan pengaturan ulang kata sandi telah dikirimkan.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Format email tidak valid." };
  }
}

export async function resetPasswordAction(formData: unknown) {
  try {
    const validated = ResetPasswordSchema.parse(formData);
    await resetPassword(validated);
    return {
      success: true,
      message: "Kata sandi Anda berhasil diperbarui. Silakan masuk kembali.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "Gagal memperbarui kata sandi. Pastikan tautan masih valid.",
    };
  }
}

export async function verifyUserAction(targetUserId: string) {
  try {
    const result = await verifyUserAccount(targetUserId);
    revalidatePath("/admin");
    return { success: true, message: result.message };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Gagal memverifikasi akun pengguna." };
  }
}

export async function suspendUserAction(targetUserId: string) {
  try {
    const result = await suspendUserAccount(targetUserId);
    revalidatePath("/admin");
    return { success: true, message: result.message };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Gagal menangguhkan akun pengguna." };
  }
}
