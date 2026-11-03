import {
  LayoutDashboard,
  Building2,
  FileText,
  Search,
  ShieldCheck,
  CreditCard,
  Scale,
  Settings,
  Briefcase,
  Award,
  Layers,
  FolderKanban,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: Record<string, NavGroup[]> = {
  INDUSTRY: [
    {
      label: "Pengadaan",
      items: [
        {
          title: "Dashboard Pengadaan",
          href: "/industri",
          icon: LayoutDashboard,
        },
        {
          title: "RFQ Saya",
          href: "/industri/rfq",
          icon: FileText,
        },
        {
          title: "Penawaran Masuk",
          href: "/industri/penawaran",
          icon: Briefcase,
        },
        {
          title: "Cari UMKM",
          href: "/industri/mitra",
          icon: Search,
        },
      ],
    },
    {
      label: "Kemitraan & Dana",
      items: [
        {
          title: "Order & Escrow",
          href: "/industri/order",
          icon: Layers,
        },
        {
          title: "Profil & Legalitas",
          href: "/industri/profil",
          icon: Building2,
        },
      ],
    },
  ],
  UMKM: [
    {
      label: "Pekerjaan",
      items: [
        {
          title: "Beranda Mitra",
          href: "/umkm",
          icon: LayoutDashboard,
        },
        {
          title: "Cari RFQ",
          href: "/umkm/rfq",
          icon: Search,
        },
        {
          title: "Penawaran Saya",
          href: "/umkm/penawaran",
          icon: Briefcase,
        },
      ],
    },
    {
      label: "Kualifikasi & Dana",
      items: [
        {
          title: "Readiness Score",
          href: "/umkm/readiness",
          icon: Award,
        },
        {
          title: "Profil & Portofolio",
          href: "/umkm/profil",
          icon: Building2,
        },
        {
          title: "Dana & Escrow",
          href: "/umkm#dana",
          icon: CreditCard,
        },
      ],
    },
  ],
  ADMIN: [
    {
      label: "Pengawasan Platform",
      items: [
        {
          title: "Dashboard Admin",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Verifikasi Akun",
          href: "/admin#verifikasi",
          icon: ShieldCheck,
        },
        {
          title: "Mediasi Sengketa",
          href: "/admin#sengketa",
          icon: Scale,
        },
      ],
    },
    {
      label: "Keuangan & Sistem",
      items: [
        {
          title: "Ledger Escrow",
          href: "/admin#ledger",
          icon: FolderKanban,
        },
        {
          title: "Konfigurasi Master Data",
          href: "/admin#konfigurasi",
          icon: Settings,
        },
      ],
    },
  ],
  PUBLIC: [
    {
      label: "Menu Utama",
      items: [
        {
          title: "Beranda",
          href: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Alur Kerja Broker",
          href: "/#alur-kerja",
          icon: Layers,
        },
        {
          title: "Keamanan Escrow",
          href: "/#keamanan",
          icon: ShieldCheck,
        },
        {
          title: "Mitra UMKM",
          href: "/#mitra-umkm",
          icon: Building2,
        },
      ],
    },
  ],
};

export function getNavigationForRole(role?: string | null): NavGroup[] {
  if (!role) return NAVIGATION_CONFIG.PUBLIC;
  return NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG.PUBLIC;
}
