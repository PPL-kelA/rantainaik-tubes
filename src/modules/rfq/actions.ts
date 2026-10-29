"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import * as service from "./service";
import {
  createOrUpdateRfqSchema,
  createQuestionSchema,
  answerQuestionSchema,
  createAddendumSchema,
  cancelRfqSchema,
} from "./schema";

export async function createDraftRfqAction(rawInput: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Sesi tidak valid, silakan masuk kembali",
      };
    }

    if (session.user.role !== "INDUSTRY") {
      return {
        success: false,
        error: "Hanya akun Industri yang dapat membuat RFQ",
      };
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return { success: false, error: "Organisasi industri tidak ditemukan" };
    }

    const parsed = createOrUpdateRfqSchema.parse(rawInput);
    const rfq = await service.createDraftRfq(parsed, orgId, session.user.id);

    revalidatePath("/industri");
    revalidatePath("/industri/rfq");

    return { success: true, rfqId: rfq.id, rfqNumber: rfq.rfqNumber };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal membuat draft RFQ";
    return { success: false, error: message };
  }
}

export async function publishRfqAction(rfqId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak valid" };
    }

    if (session.user.role !== "INDUSTRY") {
      return {
        success: false,
        error: "Hanya akun Industri yang dapat menerbitkan RFQ",
      };
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return { success: false, error: "Organisasi industri tidak ditemukan" };
    }

    const updated = await service.publishRfq(rfqId, orgId, session.user.id);

    revalidatePath("/industri");
    revalidatePath(`/industri/rfq/${rfqId}`);
    revalidatePath(`/umkm/rfq/${rfqId}`);
    revalidatePath("/umkm");

    return { success: true, rfqNumber: updated.rfqNumber };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menerbitkan RFQ";
    return { success: false, error: message };
  }
}

export async function cancelRfqAction(rawInput: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak valid" };
    }

    if (session.user.role !== "INDUSTRY") {
      return {
        success: false,
        error: "Hanya akun Industri yang dapat membatalkan RFQ",
      };
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return { success: false, error: "Organisasi industri tidak ditemukan" };
    }

    const parsed = cancelRfqSchema.parse(rawInput);
    const updated = await service.cancelRfq(parsed, orgId, session.user.id);

    revalidatePath("/industri");
    revalidatePath(`/industri/rfq/${parsed.rfqId}`);
    revalidatePath(`/umkm/rfq/${parsed.rfqId}`);

    return { success: true, rfqNumber: updated.rfqNumber };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal membatalkan RFQ";
    return { success: false, error: message };
  }
}

export async function askQuestionAction(rawInput: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak valid" };
    }

    if (session.user.role !== "UMKM") {
      return {
        success: false,
        error: "Hanya akun UMKM yang dapat mengajukan pertanyaan",
      };
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return { success: false, error: "Organisasi UMKM tidak ditemukan" };
    }

    const parsed = createQuestionSchema.parse(rawInput);
    const question = await service.askQuestion(parsed, orgId, session.user.id);

    revalidatePath(`/umkm/rfq/${parsed.rfqId}`);
    revalidatePath(`/industri/rfq/${parsed.rfqId}`);

    return { success: true, questionId: question.id };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengajukan pertanyaan";
    return { success: false, error: message };
  }
}

export async function answerQuestionAction(rawInput: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak valid" };
    }

    if (session.user.role !== "INDUSTRY") {
      return {
        success: false,
        error: "Hanya akun Industri yang dapat menjawab pertanyaan",
      };
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return { success: false, error: "Organisasi industri tidak ditemukan" };
    }

    const parsed = answerQuestionSchema.parse(rawInput);
    await service.answerQuestion(parsed, orgId, session.user.id);

    revalidatePath(`/industri/rfq/${parsed.questionId}`);
    revalidatePath(`/umkm/rfq/${parsed.questionId}`);

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menjawab pertanyaan";
    return { success: false, error: message };
  }
}

export async function createAddendumAction(rawInput: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak valid" };
    }

    if (session.user.role !== "INDUSTRY") {
      return {
        success: false,
        error: "Hanya akun Industri yang dapat menerbitkan addendum",
      };
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return { success: false, error: "Organisasi industri tidak ditemukan" };
    }

    const parsed = createAddendumSchema.parse(rawInput);
    const addendum = await service.createAddendum(
      parsed,
      orgId,
      session.user.id
    );

    revalidatePath(`/industri/rfq/${parsed.rfqId}`);
    revalidatePath(`/umkm/rfq/${parsed.rfqId}`);

    return { success: true, addendumNumber: addendum.addendumNumber };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menerbitkan addendum";
    return { success: false, error: message };
  }
}
