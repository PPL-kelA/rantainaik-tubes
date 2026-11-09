/**
 * Helper ownership untuk akses RFQ dari sisi industri.
 * Audit F2: halaman detail RFQ industri harus memverifikasi bahwa pemanggil
 * adalah pemilik RFQ (atau ADMIN) sebelum menampilkan isinya.
 */
export function canViewIndustryRfq(
  rfqIndustryOrgId: string,
  callerOrgId: string,
  callerRole?: string
): boolean {
  if (callerRole === "ADMIN") return true;
  return Boolean(callerOrgId) && rfqIndustryOrgId === callerOrgId;
}
