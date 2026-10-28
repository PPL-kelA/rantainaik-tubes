"use client";

import { useState } from "react";
import { updateOrganizationProfileAction } from "@/modules/organizations/actions";
import {
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  User,
  Phone,
  Save,
  Loader2,
} from "lucide-react";

interface OrganizationProfileFormProps {
  organization: {
    id: string;
    name: string;
    city: string;
    province: string;
    address: string | null;
    picName: string;
    picPhone: string | null;
    verificationStatus: string;
    type: string;
  };
}

export function OrganizationProfileForm({
  organization,
}: OrganizationProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.append("organizationId", organization.id);

    try {
      const res = await updateOrganizationProfileAction(formData);
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "Profil berhasil diperbarui.",
        });
      } else {
        setMessage({
          type: "error",
          text: res.error || "Gagal memperbarui profil.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <div>
          <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#1D4ED8]" />
            Data Profil Organisasi / Usaha
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Kelola data legalitas alamat operasional dan narahubung utama (PIC).
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
            organization.verificationStatus === "VERIFIED"
              ? "bg-[#F0FDF4] text-[#15803D] border-[#DCFCE7]"
              : organization.verificationStatus === "SUSPENDED"
                ? "bg-[#FEF2F2] text-[#B91C1C] border-[#FCA5A5]"
                : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
          }`}
        >
          Status: {organization.verificationStatus}
        </span>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-lg p-3.5 text-xs font-medium ${
            message.type === "success"
              ? "bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
              : "bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Nama Usaha / Perusahaan
          </label>
          <input
            name="name"
            defaultValue={organization.name}
            required
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Kota / Kabupaten
          </label>
          <div className="relative">
            <input
              name="city"
              defaultValue={organization.city}
              required
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            />
            <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Provinsi
          </label>
          <input
            name="province"
            defaultValue={organization.province}
            required
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Alamat Lengkap (Workshop / Kantor)
          </label>
          <input
            name="address"
            defaultValue={organization.address || ""}
            placeholder="Jl. Perindustrian No. 42"
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Penanggung Jawab (Nama PIC)
          </label>
          <div className="relative">
            <input
              name="picName"
              defaultValue={organization.picName}
              required
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            />
            <User className="absolute right-3 top-2.5 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Nomor Telepon / WhatsApp PIC
          </label>
          <div className="relative">
            <input
              name="picPhone"
              defaultValue={organization.picPhone || ""}
              placeholder="08123456789"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#1D4ED8] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
            />
            <Phone className="absolute right-3 top-2.5 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1E40AF] disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Simpan Perubahan Profil
            </>
          )}
        </button>
      </div>
    </form>
  );
}
