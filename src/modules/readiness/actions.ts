"use server";

import { auth } from "@/lib/auth";
import { getUserOrganization } from "@/modules/organizations/service";
import * as service from "./service";
import { revalidatePath } from "next/cache";

export async function recalculateReadinessAction() {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Harus masuk terlebih dahulu." };
  }

  const organization = await getUserOrganization(session.user.id);
  if (!organization) {
    return { success: false, error: "Organisasi tidak ditemukan." };
  }

  try {
    const data = await service.calculateAndSaveReadiness(organization.id);
    revalidatePath("/umkm/readiness");
    revalidatePath("/umkm");
    return {
      success: true,
      data,
      message: "Readiness Score berhasil dihitung ulang.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Gagal menghitung skor kesiapan.",
    };
  }
}
