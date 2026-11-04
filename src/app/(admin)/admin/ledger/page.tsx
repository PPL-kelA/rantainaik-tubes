import { auth } from "@/lib/auth";
import { requireRole } from "@/modules/auth/rules";
import { redirect } from "next/navigation";
import { AdminLedgerClient } from "./AdminLedgerClient";

export const dynamic = "force-dynamic";

export default async function AdminLedgerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/ledger");
  }

  try {
    requireRole(session.user.role, ["ADMIN"]);
  } catch {
    redirect("/?error=unauthorized");
  }

  return <AdminLedgerClient />;
}
