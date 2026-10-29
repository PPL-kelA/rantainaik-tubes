import fs from "fs/promises";
import path from "path";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface StorageProvider {
  uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
  validateFile(fileSize: number, mimeType: string): FileValidationResult;
  readFile(fileUrl: string): Promise<Buffer | null>;
}

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(
    baseDir: string = path.join(process.cwd(), "storage", "documents")
  ) {
    this.baseDir = baseDir;
  }

  validateFile(fileSize: number, mimeType: string): FileValidationResult {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        valid: false,
        error:
          "Format berkas tidak didukung. Hanya PDF, PNG, JPG, dan WebP yang diizinkan.",
      };
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: "Ukuran berkas melebihi batas maksimal 5 MB.",
      };
    }

    return { valid: true };
  }

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<string> {
    const validation = this.validateFile(fileBuffer.length, mimeType);
    if (!validation.valid) {
      throw new Error(validation.error || "Berkas tidak valid");
    }

    await fs.mkdir(this.baseDir, { recursive: true });

    // Sanitize filename and create unique stored name
    const ext = path.extname(filename) || ".bin";
    const cleanBase = path
      .basename(filename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanBase}${ext}`;
    const destinationPath = path.join(this.baseDir, uniqueName);

    await fs.writeFile(destinationPath, fileBuffer);

    // Return reference url (to be served via protected API route)
    return `/api/documents/files/${uniqueName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.baseDir, filename);
      await fs.unlink(filePath);
    } catch {
      // Ignore if file already doesn't exist
    }
  }

  async readFile(fileUrl: string): Promise<Buffer | null> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.baseDir, filename);
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  }
}

export const storageProvider: StorageProvider = new LocalStorageProvider();
