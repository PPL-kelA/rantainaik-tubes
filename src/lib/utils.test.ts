import { describe, it, expect } from "vitest";
import { cn, formatRupiah } from "./utils";

describe("Utils Library", () => {
  it("cn merges class names properly with tailwind rules", () => {
    const result = cn("p-4", "text-sm", { "bg-white": true, hidden: false });
    expect(result).toBe("p-4 text-sm bg-white");
  });

  it("cn handles conflicting tailwind utility classes", () => {
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });

  it("formatRupiah formats integer to Indonesian currency format", () => {
    const result = formatRupiah(33750000);
    // Should contain Rp and formatted numbers
    expect(result).toMatch(/Rp.*33\.750\.000/);
  });
});
