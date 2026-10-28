"use server";

import { auth } from "@/lib/auth";
import { updateOrganizationProfile } from "./service";
import { UpdateOrganizationProfileSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function updateOrganizationProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Silakan masuk terlebih dahulu." };
  }

  const orgId = formData.get("organizationId") as string;
  if (!orgId) {
    return { success: false, error: "ID Organisasi tidak valid." };
  }

  const rawData = {
    name: formData.get("name") as string,
    city: formData.get("city") as string,
    province: formData.get("province") as string,
    address: (formData.get("address") as string) || null,
    picName: formData.get("picName") as string,
    picPhone: (formData.get("picPhone") as string) || null,
  };

  try {
    const validated = UpdateOrganizationProfileSchema.parse(rawData);
    await updateOrganizationProfile(
      session.user.id,
      session.user.role,
      orgId,
      validated
    );

    revalidatePath("/umkm/profil");
    revalidatePath("/industri/profil");
    revalidatePath("/admin");

    return { success: true, message: "Profil organisasi berhasil diperbarui." };
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Gagal memperbarui profil organisasi.";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
