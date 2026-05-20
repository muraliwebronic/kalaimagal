// One-shot smoke test for src/lib/pdf-render.ts
// Run: npx tsx scripts/test-pdf-render.ts
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { renderPdfPageToWebp, getPdfPageCount } from "@/lib/pdf-render";

async function main() {
  const pdfDir = path.resolve("public/uploads/pdfs");
  const files = readdirSync(pdfDir).filter((f) => f.endsWith(".pdf"));
  if (files.length === 0) {
    console.error("No PDFs in public/uploads/pdfs/");
    process.exit(1);
  }
  const pdfPath = path.join(pdfDir, files[0]);
  console.log("→ Rendering from:", pdfPath);

  const pdfBuffer = readFileSync(pdfPath);
  const pageCount = await getPdfPageCount(pdfBuffer);
  console.log(`  pages: ${pageCount}`);

  const t0 = Date.now();
  const webp = await renderPdfPageToWebp({
    pdfBuffer,
    page: 1,
    scale: 2.0,
    watermarkText: "PREVIEW",
  });
  const t1 = Date.now();
  console.log(`  rendered page 1 → ${webp.byteLength} bytes in ${t1 - t0}ms`);

  const outPath = path.resolve("test-render-page1.webp");
  writeFileSync(outPath, webp);
  console.log("  wrote:", outPath);
}

main().catch((e) => {
  console.error("✗ test failed:", e);
  process.exit(1);
});
