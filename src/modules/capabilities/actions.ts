"use server";

import { auth } from "@/lib/auth";
import { getUserOrganization } from "@/modules/organizations/service";
import * as service from "./service";
import { calculateAndSaveReadiness } from "@/modules/readiness/service";
import { revalidatePath } from "next/cache";

async function getAuthorizedOrg() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Anda harus masuk terlebih dahulu");
  }

  const organization = await getUserOrganization(session.user.id);
  if (!organization) {
    throw new Error("Organisasi tidak ditemukan untuk akun ini");
  }

  return { session, organization };
}

export async function saveCapabilityAction(formData: unknown) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    const result = await service.saveCapability(
      session.user.id,
      organization.id,
      formData
    );
    try {
      await calculateAndSaveReadiness(organization.id);
    } catch {
      // Non-fatal hook error
    }
    revalidatePath("/umkm/profil");
    revalidatePath("/umkm/readiness");
    return {
      success: true,
      data: result,
      message: "Kapabilitas berhasil disimpan.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Gagal menyimpan kapabilitas.",
    };
  }
}

export async function removeCapabilityAction(capabilityId: string) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    await service.removeCapability(
      session.user.id,
      organization.id,
      capabilityId
    );
    revalidatePath("/umkm/profil");
    return { success: true, message: "Kapabilitas berhasil dihapus." };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Gagal menghapus kapabilitas.",
    };
  }
}

export async function addMachineAssetAction(formData: unknown) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    const result = await service.addMachineAsset(
      session.user.id,
      organization.id,
      formData
    );
    revalidatePath("/umkm/profil");
    return {
      success: true,
      data: result,
      message: "Aset mesin berhasil ditambahkan.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Gagal menambahkan aset mesin.",
    };
  }
}

export async function removeMachineAssetAction(machineId: string) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    await service.removeMachineAsset(
      session.user.id,
      organization.id,
      machineId
    );
    revalidatePath("/umkm/profil");
    return { success: true, message: "Aset mesin berhasil dihapus." };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menghapus mesin.",
    };
  }
}

export async function addPortfolioItemAction(formData: unknown) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    const result = await service.addPortfolioItem(
      session.user.id,
      organization.id,
      formData
    );
    revalidatePath("/umkm/profil");
    return {
      success: true,
      data: result,
      message: "Item portofolio berhasil disimpan.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menyimpan portofolio.",
    };
  }
}

export async function removePortfolioItemAction(portfolioId: string) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    await service.removePortfolioItem(
      session.user.id,
      organization.id,
      portfolioId
    );
    revalidatePath("/umkm/profil");
    return { success: true, message: "Item portofolio berhasil dihapus." };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal menghapus portofolio.",
    };
  }
}

export async function addOrgCertificationAction(formData: unknown) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    const result = await service.addOrgCertification(
      session.user.id,
      organization.id,
      formData
    );
    revalidatePath("/umkm/profil");
    return {
      success: true,
      data: result,
      message: "Sertifikasi berhasil dicatat.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Gagal menyimpan sertifikasi.",
    };
  }
}

export async function removeOrgCertificationAction(certId: string) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    await service.removeOrgCertification(
      session.user.id,
      organization.id,
      certId
    );
    revalidatePath("/umkm/profil");
    return { success: true, message: "Sertifikasi berhasil dihapus." };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Gagal menghapus sertifikasi.",
    };
  }
}

export async function updateOrgFacilityDetailsAction(formData: unknown) {
  try {
    const { session, organization } = await getAuthorizedOrg();
    const result = await service.updateOrgFacilityDetails(
      session.user.id,
      organization.id,
      formData
    );
    revalidatePath("/umkm/profil");
    return {
      success: true,
      data: result,
      message: "Data fasilitas usaha berhasil diperbarui.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Gagal memperbarui data fasilitas.",
    };
  }
}
