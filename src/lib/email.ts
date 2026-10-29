export interface EmailMessage {
  to: string;
  subject: string;
  html?: string;
  text: string;
}

export interface EmailAdapter {
  send(
    message: EmailMessage
  ): Promise<{ success: boolean; messageId?: string }>;
}

export class ConsoleEmailAdapter implements EmailAdapter {
  async send(
    message: EmailMessage
  ): Promise<{ success: boolean; messageId?: string }> {
    console.log("----------------------------------------");
    console.log(`[EMAIL DISPATCH] To: ${message.to}`);
    console.log(`[SUBJECT] ${message.subject}`);
    console.log(`[CONTENT]\n${message.text}`);
    console.log("----------------------------------------");
    return { success: true, messageId: `mock-${Date.now()}` };
  }
}

export const emailAdapter: EmailAdapter = new ConsoleEmailAdapter();

export async function sendVerificationNotification(
  toEmail: string,
  orgName: string,
  isApproved: boolean,
  details?: { docType?: string; reason?: string }
) {
  const subject = isApproved
    ? `[RantaiNaik] Selamat! Organisasi Anda (${orgName}) Telah Terverifikasi`
    : `[RantaiNaik] Pembaruan Dokumen Verifikasi untuk ${orgName}`;

  const text = isApproved
    ? `Halo ${orgName},\n\nSelamat! Seluruh dokumen legalitas minimum Anda telah diverifikasi oleh tim kurasi RantaiNaik. Status akun Anda kini aktif (VERIFIED) dan Anda dapat mulai memposting RFQ atau mengajukan penawaran.\n\nSalam,\nTim RantaiNaik`
    : `Halo ${orgName},\n\nDokumen ${details?.docType || "verifikasi"} Anda ditinjau dan belum dapat disetujui.\nAlasan: ${details?.reason || "Dokumen belum memenuhi persyaratan."}\n\nSilakan unggah ulang dokumen perbaikan melalui dasbor Anda.\n\nSalam,\nTim RantaiNaik`;

  return emailAdapter.send({
    to: toEmail,
    subject,
    text,
  });
}
