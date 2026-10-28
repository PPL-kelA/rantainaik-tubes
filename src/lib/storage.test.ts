import { describe, expect, it } from "vitest";
import { LocalStorageProvider, MAX_FILE_SIZE_BYTES } from "./storage";

describe("LocalStorageProvider", () => {
  const provider = new LocalStorageProvider();

  it("validates allowed mime types properly", () => {
    expect(provider.validateFile(1024, "application/pdf").valid).toBe(true);
    expect(provider.validateFile(1024, "image/jpeg").valid).toBe(true);
    expect(provider.validateFile(1024, "image/png").valid).toBe(true);
    expect(provider.validateFile(1024, "image/webp").valid).toBe(true);

    const invalidType = provider.validateFile(1024, "application/zip");
    expect(invalidType.valid).toBe(false);
    expect(invalidType.error).toContain("Format berkas tidak didukung");
  });

  it("rejects files exceeding 5MB limit", () => {
    const oversized = provider.validateFile(
      MAX_FILE_SIZE_BYTES + 1,
      "application/pdf"
    );
    expect(oversized.valid).toBe(false);
    expect(oversized.error).toContain("melebihi batas maksimal 5 MB");
  });
});
