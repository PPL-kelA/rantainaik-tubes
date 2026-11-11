import { AppShell } from "@/components/layout";

export default function UmkmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
