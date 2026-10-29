"use server";

import { auth } from "@/lib/auth";
import * as service from "./service";
import { ReadinessWeights, MatchingWeights, PlatformParams } from "./rules";
import { revalidatePath } from "next/cache";

function requireAdmin(
  session: { user?: { id?: string; role?: string } } | null
) {
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error(
      "Akses ditolak: Hanya Admin yang dapat mengubah konfigurasi platform."
    );
  }
}

export async function updateReadinessWeightsAction(weights: ReadinessWeights) {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.updateReadinessWeights(session!.user.id, weights);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Bobot Readiness Score berhasil diperbarui.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui bobot Readiness.",
    };
  }
}

export async function updateMatchingWeightsAction(weights: MatchingWeights) {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.updateMatchingWeights(session!.user.id, weights);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Bobot Matching Rule-Based berhasil diperbarui.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui bobot Matching.",
    };
  }
}

export async function updatePlatformParametersAction(params: PlatformParams) {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.updatePlatformParameters(session!.user.id, params);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Parameter platform berhasil diperbarui.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui parameter platform.",
    };
  }
}

export async function resetReadinessWeightsAction() {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.resetReadinessWeightsToDefault(session!.user.id);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Bobot Readiness dikembalikan ke nilai default spec.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal memulihkan bobot Readiness.",
    };
  }
}

export async function resetMatchingWeightsAction() {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.resetMatchingWeightsToDefault(session!.user.id);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Bobot Matching dikembalikan ke nilai default spec.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal memulihkan bobot Matching.",
    };
  }
}

export async function resetPlatformParametersAction() {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.resetPlatformParametersToDefault(session!.user.id);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Parameter platform dikembalikan ke nilai default spec.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal memulihkan parameter platform.",
    };
  }
}

export async function createCategoryAction(data: {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}) {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.createCategory(session!.user.id, data);
    revalidatePath("/admin");
    return { success: true, message: "Kategori produk berhasil ditambahkan." };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Gagal menambah kategori.",
    };
  }
}

export async function createProductionServiceAction(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.createProductionService(session!.user.id, data);
    revalidatePath("/admin");
    return { success: true, message: "Layanan produksi berhasil ditambahkan." };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal menambah layanan.",
    };
  }
}

export async function createCertificationAction(data: {
  name: string;
  issuer?: string;
  description?: string;
}) {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.createCertification(session!.user.id, data);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Master sertifikasi berhasil ditambahkan.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Gagal menambah sertifikasi.",
    };
  }
}

export async function createRecommendationRuleAction(data: {
  component: string;
  condition: string;
  text: string;
  points: number;
  difficulty: "MUDAH" | "SEDANG" | "SULIT";
  link?: string;
}) {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.createRecommendationRule(session!.user.id, data);
    revalidatePath("/admin");
    return {
      success: true,
      message: "Aturan rekomendasi berhasil ditambahkan.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Gagal menambah aturan rekomendasi.",
    };
  }
}

export async function deleteRecommendationRuleAction(id: string) {
  const session = await auth();
  try {
    requireAdmin(session);
    await service.deleteRecommendationRule(session!.user.id, id);
    revalidatePath("/admin");
    return { success: true, message: "Aturan rekomendasi berhasil dihapus." };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal menghapus aturan.",
    };
  }
}
