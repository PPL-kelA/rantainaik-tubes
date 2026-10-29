import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RfqWizardClient } from "./RfqWizardClient";

export default async function NewRfqWizardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "INDUSTRY") {
    redirect("/umkm");
  }

  return (
    <RfqWizardClient
      userOrgId={session.user.organizationId || ""}
      userName={session.user.name || "Perusahaan Industri"}
    />
  );
}
