import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import * as repo from "@/modules/documents/repo";
import { storageProvider } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const document = await repo.getDocumentById(id);

  if (!document) {
    return new NextResponse("Dokumen tidak ditemukan", { status: 404 });
  }

  // Authorization: Only organization members or ADMIN can access
  const isAdmin = session.user.role === "ADMIN";
  const isOwner =
    session.user.organizationId === document.organizationId ||
    document.organization.members.some((m) => m.userId === session.user.id);

  if (!isAdmin && !isOwner) {
    return new NextResponse(
      "Forbidden: Anda tidak memiliki hak akses untuk dokumen ini",
      {
        status: 403,
      }
    );
  }

  const fileBuffer = await storageProvider.readFile(document.fileUrl);
  if (!fileBuffer) {
    return new NextResponse("Berkas fisik tidak ditemukan di penyimpanan", {
      status: 404,
    });
  }

  // Determine mime type from extension or file name
  const ext = document.fileName.split(".").pop()?.toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === "pdf") contentType = "application/pdf";
  else if (ext === "png") contentType = "image/png";
  else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
  else if (ext === "webp") contentType = "image/webp";

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${document.fileName}"`,
    },
  });
}
