import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { findRfqById, findRfqByNumber } from "@/modules/rfq/repo";
import { canViewIndustryRfq } from "@/modules/rfq/ownership";
import {
  IndustriRfqDetailClient,
  SerializedRfq,
} from "./IndustriRfqDetailClient";

export const dynamic = "force-dynamic";

interface IndustriRfqDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function IndustriRfqDetailPage({
  params,
}: IndustriRfqDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "INDUSTRY") {
    redirect("/umkm");
  }

  const { id } = await params;
  let rfq = await findRfqById(id);

  if (!rfq && id.startsWith("RFQ-")) {
    rfq = await findRfqByNumber(id);
  }

  if (!rfq) {
    notFound();
  }

  // Audit F2: hanya pemilik RFQ (atau ADMIN) yang boleh melihat detail
  if (
    !canViewIndustryRfq(
      rfq.industryOrgId,
      session.user.organizationId || "",
      session.user.role
    )
  ) {
    notFound();
  }

  // Serialisasi data untuk Client Component
  const serializedRfq: SerializedRfq = {
    id: rfq.id,
    rfqNumber: rfq.rfqNumber,
    title: rfq.title,
    status: rfq.status,
    categoryType: rfq.categoryType,
    visibility: rfq.visibility,
    contextDescription: rfq.contextDescription,
    allocationMode: rfq.allocationMode,
    deliveryLocation: rfq.deliveryLocation,
    quotationDeadline: rfq.quotationDeadline.toISOString(),
    targetDeliveryDate: rfq.targetDeliveryDate.toISOString(),
    qaDeadline: rfq.qaDeadline?.toISOString() || null,
    needSample: rfq.needSample,
    sampleCount: rfq.sampleCount,
    sampleCostBearer: rfq.sampleCostBearer,
    industryOrg: rfq.industryOrg
      ? {
          id: rfq.industryOrg.id,
          name: rfq.industryOrg.name,
          city: rfq.industryOrg.city,
        }
      : null,
    items: rfq.items.map((it) => ({
      id: it.id,
      name: it.name,
      fabricType: it.fabricType,
      gsmMin: it.gsmMin,
      gsmMax: it.gsmMax,
      color: it.color,
      materialProvidedByBuyer: it.materialProvidedByBuyer,
      referencePhotoUrl: it.referencePhotoUrl,
      constructionNotes: it.constructionNotes,
      decorationType: it.decorationType,
      decorationPlacement: it.decorationPlacement,
      labelPackingNotes: it.labelPackingNotes,
      dimensionTolerance: it.dimensionTolerance,
      aqlStandard: it.aqlStandard,
      needLabTest: it.needLabTest,
      totalQuantity: it.totalQuantity,
      sizes: it.sizes.map((s) => ({
        id: s.id,
        size: s.size,
        quantity: s.quantity,
      })),
    })),
    requirements: rfq.requirements.map((req) => ({
      id: req.id,
      type: req.type,
      description: req.description,
      isMandatory: req.isMandatory,
    })),
    questions: rfq.questions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      createdAt: q.createdAt.toISOString(),
    })),
    addendums: rfq.addendums.map((add) => ({
      id: add.id,
      addendumNumber: add.addendumNumber,
      summary: add.summary,
      changes: add.changes,
      createdAt: add.createdAt.toISOString(),
    })),
  };

  return (
    <IndustriRfqDetailClient
      rfq={serializedRfq}
      companyName={session.user.organizationName || "Perusahaan Industri"}
    />
  );
}
