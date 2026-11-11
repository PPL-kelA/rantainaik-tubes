import { AppShell } from "@/components/layout";

export default function IndustriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
