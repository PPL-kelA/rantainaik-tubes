import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Regression test untuk temuan audit keamanan F1-F3:
 * - F1: verifyUserAction / suspendUserAction harus menolak non-ADMIN
 * - F2: halaman detail RFQ industri harus memverifikasi ownership (fungsi helper canViewIndustryRfq)
 * - F3: answerQuestion harus menolak jawaban dari industry org yang bukan pemilik RFQ
 */

vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));

// ---- F1: guard admin di auth actions ----
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}));
vi.mock("./service", () => ({
  verifyUserAccount: vi
    .fn()
    .mockResolvedValue({ success: true, message: "ok" }),
  suspendUserAccount: vi
    .fn()
    .mockResolvedValue({ success: true, message: "ok" }),
  register: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("./schema", async (importOriginal) => ({
  ...(await importOriginal<object>()),
}));
vi.mock("./rules", async (importOriginal) => ({
  ...(await importOriginal<object>()),
}));

import { verifyUserAction, suspendUserAction } from "./actions";

describe("F1: aksi verifikasi/suspend akun hanya untuk ADMIN", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menolak ketika belum login", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await verifyUserAction("user-1");
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Admin/i);
  });

  it("menolak akun UMKM", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u-umkm", role: "UMKM" },
    });
    const res = await verifyUserAction("user-1");
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Admin/i);
  });

  it("menolak akun INDUSTRY", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u-ind", role: "INDUSTRY" },
    });
    const res = await suspendUserAction("user-1");
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Admin/i);
  });

  it("mengizinkan ADMIN", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u-admin", role: "ADMIN" },
    });
    const res = await verifyUserAction("user-1");
    expect(res.success).toBe(true);
  });
});
