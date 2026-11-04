import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { AdminDisputeClient } from "./AdminDisputeClient";

export const dynamic = "force-dynamic";

export default async function AdminDisputePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/sengketa");
  }

  try {
    requireRole(session.user.role, ["ADMIN"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  return <AdminDisputeClient />;
}
