import fs from "fs";
import path from "path";

const FORBIDDEN_PATTERNS = [
  { label: "pil / pill", regex: /\b(pil|pill|pills|rounded-full|9999px)\b/i },
  {
    label: "glass / kaca",
    regex: /\b(glass|kaca|translusen|translucent|backdrop-blur)\b/i,
  },
  { label: "latar abu muda", regex: /abu\s+muda/i },
  {
    label: "hex abu lama (#F4F6FB / #F6F7F9)",
    regex: /#(F4F6FB|F6F7F9|f4f6fb|f6f7f9)/i,
  },
  { label: "navigasi atas / top nav lama", regex: /navigasi\s+atas/i },
];

function checkFile(filePath, contentExtractor) {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File tidak ditemukan: ${filePath}`);
    return false;
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const content = contentExtractor ? contentExtractor(raw) : raw;
  let hasError = false;

  console.log(`\n--- Memeriksa: ${filePath} ---`);
  for (const { label, regex } of FORBIDDEN_PATTERNS) {
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      if (regex.test(line)) {
        console.error(
          `  [GAGAL] Pola lama terdeteksi: "${label}" di baris ${index + 1}:`
        );
        console.error(`    ${line.trim()}`);
        hasError = true;
      }
    });
  }

  if (!hasError) {
    console.log(`  [LULUS] Tidak ditemukan pola lama.`);
  }
  return !hasError;
}

// Ekstrak hanya bagian P0 dari PROMPT_FIGMA.md
function extractP0(content) {
  const startIdx = content.indexOf("## P0. Design system dan aturan global");
  if (startIdx === -1) return "";
  const endIdx = content.indexOf("## 1. Alur UMKM", startIdx);
  return endIdx !== -1
    ? content.slice(startIdx, endIdx)
    : content.slice(startIdx);
}

const res1 = checkFile("docs/design/DESIGN_SYSTEM.md");
const res2 = checkFile("docs/design/PROMPT_FIGMA.md", extractP0);

if (!res1 || !res2) {
  console.error("\n❌ Verifikasi GAGAL: Masih ada rujukan arah lama.");
  process.exit(1);
} else {
  console.log("\n✅ Verifikasi SUKSES: Dokumen bersih dari rujukan arah lama.");
  process.exit(0);
}
