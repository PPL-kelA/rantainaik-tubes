import { describe, it, expect, vi, beforeEach } from "vitest";
import { answerQuestion } from "./service";
import * as repo from "./repo";

vi.mock("./repo");
vi.mock("@/modules/audit/service");

describe("F3: answerQuestion hanya untuk pemilik RFQ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menolak industry org yang bukan pemilik RFQ", async () => {
    vi.mocked(repo.findRfqByQuestionId).mockResolvedValue({
      id: "q-1",
      rfqId: "rfq-1",
      rfq: { industryOrgId: "org-owner" },
    } as never);

    await expect(
      answerQuestion({ questionId: "q-1", answer: "Jawaban resmi" }, "org-lain")
    ).rejects.toThrow(/hak akses/i);

    expect(repo.answerQuestion).not.toHaveBeenCalled();
  });

  it("menolak ketika pertanyaan tidak ditemukan", async () => {
    vi.mocked(repo.findRfqByQuestionId).mockResolvedValue(null);

    await expect(
      answerQuestion(
        { questionId: "q-x", answer: "Jawaban resmi" },
        "org-owner"
      )
    ).rejects.toThrow(/Pertanyaan tidak ditemukan/i);
  });

  it("mengizinkan pemilik RFQ menjawab", async () => {
    vi.mocked(repo.findRfqByQuestionId).mockResolvedValue({
      id: "q-1",
      rfqId: "rfq-1",
      rfq: { industryOrgId: "org-owner" },
    } as never);
    vi.mocked(repo.answerQuestion).mockResolvedValue({
      id: "q-1",
      answer: "Jawaban resmi",
    } as never);

    const result = await answerQuestion(
      { questionId: "q-1", answer: "Jawaban resmi" },
      "org-owner",
      "user-1"
    );

    expect(repo.answerQuestion).toHaveBeenCalledWith("q-1", "Jawaban resmi");
    expect(result.answer).toBe("Jawaban resmi");
  });
});
