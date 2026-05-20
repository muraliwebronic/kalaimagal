// NOTE: deliberately not importing "server-only" so the smoke-test script
// (scripts/test-pdf-render.ts) can `tsx`-run this file directly.
// This file pulls in @napi-rs/canvas + sharp, which would fail to bundle
// in a client component long before any runtime check anyway.
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  createCanvas,
  DOMMatrix as NapiDOMMatrix,
  Path2D as NapiPath2D,
  ImageData as NapiImageData,
} from "@napi-rs/canvas";
import sharp from "sharp";

/**
 * Render a single PDF page to a watermarked WebP buffer.
 *
 * Stack:
 *   - pdfjs-dist (Mozilla pdf.js, legacy ESM build, fake worker → main thread)
 *   - @napi-rs/canvas (prebuilt-binary Canvas API for Node, no native build)
 *   - sharp (encode to WebP + composite the SVG watermark)
 *
 * The pdfjs side needs DOMMatrix / Path2D / ImageData on globalThis when
 * running outside a browser; we lazy-polyfill the first time render() is
 * called.
 */

type PdfjsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");
let pdfjsCache: PdfjsModule | null = null;

async function loadPdfjs(): Promise<PdfjsModule> {
  if (pdfjsCache) return pdfjsCache;
  // Polyfill the DOM bits pdfjs touches in Node. The DOM-lib and napi-canvas
  // class types differ slightly at the type-level (extra methods on the DOM
  // version) but napi's implementations satisfy pdfjs's actual runtime needs.
  // Cast through `unknown` so the type-checker doesn't quibble.
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g.DOMMatrix) g.DOMMatrix = NapiDOMMatrix;
  if (!g.Path2D) g.Path2D = NapiPath2D;
  if (!g.ImageData) g.ImageData = NapiImageData;

  // Each canvas context gets patched on creation — see applyContextLeniency.

  // (patchNapiContextLeniency is invoked above; declaration below)
  const mod: PdfjsModule = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // Point pdfjs at its worker bundle as a file:// URL (Windows-safe).
  // pdfjs uses its "fake worker" path which dynamically imports this file
  // on the main thread — no Web Worker actually spawns.
  const workerPath = path.join(
    process.cwd(),
    "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
  );
  mod.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  pdfjsCache = mod;
  return mod;
}

export interface RenderPageOptions {
  /** Raw PDF bytes. */
  pdfBuffer: Buffer;
  /** 1-indexed page number. */
  page: number;
  /** Render scale; 2.0 ≈ 144 DPI which is sharp on retina. Default 2.0. */
  scale?: number;
  /** Watermark text (e.g., "PREVIEW" or "user@email.com"). */
  watermarkText?: string;
  /** WebP quality 1-100. Default 78. */
  webpQuality?: number;
}

/**
 * Wrap a 2D context with lenient versions of clip/fill/stroke that match
 * browser canvas semantics. Browsers tolerate `clip(undefined)` and
 * `clip(null)`; @napi-rs/canvas throws "Value is none of these types".
 *
 * We wrap per-context (own properties) rather than on the shared prototype
 * — Turbopack's module cache makes prototype patches unreliable across
 * HMR, and some napi-canvas builds don't expose a single shared prototype.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyContextLeniency(ctx: any): void {
  if (!ctx || ctx.__leniencyApplied) return;
  for (const method of ["clip", "fill", "stroke", "isPointInPath", "isPointInStroke"]) {
    const orig = ctx[method];
    if (typeof orig !== "function") continue;
    ctx[method] = function (this: unknown, ...args: unknown[]) {
      while (
        args.length > 0 &&
        (args[args.length - 1] === undefined || args[args.length - 1] === null)
      ) {
        args.pop();
      }
      try {
        return orig.apply(this, args);
      } catch (e) {
        if (e instanceof Error && /Value is none of these types/.test(e.message)) {
          try {
            return orig.call(this);
          } catch {
            return undefined;
          }
        }
        throw e;
      }
    };
  }
  ctx.__leniencyApplied = true;
}

/**
 * pdfjs needs a CanvasFactory for intermediate render targets (group/mask
 * compositing). Without one, complex pages fail mid-render with
 * "Value is none of these types `String`, `Path`". The factory wraps
 * @napi-rs/canvas's createCanvas so pdfjs gets real native canvases.
 */
function makeCanvasFactory() {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(width: number, height: number): any {
      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");
      applyContextLeniency(context);
      return { canvas, context };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reset(obj: any, width: number, height: number): void {
      obj.canvas.width = width;
      obj.canvas.height = height;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destroy(obj: any): void {
      // Help GC: shrink the backing memory before drop
      obj.canvas.width = 0;
      obj.canvas.height = 0;
    },
  };
}

export async function renderPdfPageToWebp(opts: RenderPageOptions): Promise<Buffer> {
  const { pdfBuffer, page, scale = 2.0, watermarkText, webpQuality = 78 } = opts;

  const pdfjs = await loadPdfjs();

  const canvasFactory = makeCanvasFactory();

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    isEvalSupported: false,
    useSystemFonts: true,
    disableFontFace: true,
    verbosity: 0,
    canvasFactory,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  const doc = await loadingTask.promise;
  try {
    if (page < 1 || page > doc.numPages) {
      throw new Error(`Page ${page} out of range (1..${doc.numPages})`);
    }
    const pdfPage = await doc.getPage(page);
    const viewport = pdfPage.getViewport({ scale });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const ctx = canvas.getContext("2d");
    applyContextLeniency(ctx);
    // Fill white — PDFs without a defined background render transparent
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await pdfPage.render({
      canvas: canvas as unknown as HTMLCanvasElement,
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      viewport,
      canvasFactory,
    } as Parameters<typeof pdfPage.render>[0]).promise;

    const pngBuffer = canvas.toBuffer("image/png");

    // Compose watermark + encode WebP via sharp
    let pipeline = sharp(pngBuffer);
    if (watermarkText) {
      const watermarkSvg = buildWatermarkSvg(
        watermarkText,
        Math.ceil(viewport.width),
        Math.ceil(viewport.height),
      );
      pipeline = pipeline.composite([{ input: Buffer.from(watermarkSvg), blend: "over" }]);
    }
    const webp = await pipeline.webp({ quality: webpQuality }).toBuffer();
    return webp;
  } finally {
    await doc.destroy().catch(() => {});
  }
}

/** Get the page count of a PDF without rendering. */
export async function getPdfPageCount(pdfBuffer: Buffer): Promise<number> {
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    isEvalSupported: false,
    verbosity: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any).promise;
  try {
    return doc.numPages;
  } finally {
    await doc.destroy().catch(() => {});
  }
}

/**
 * Build an SVG that lays out diagonal repeated watermark text across the
 * whole page. Returned as a UTF-8 string ready for sharp.composite().
 */
function buildWatermarkSvg(text: string, w: number, h: number): string {
  const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Density: roughly 5 columns x 8 rows for typical book aspect — tune later
  const cols = 5;
  const rows = 8;
  const fontSize = Math.round(Math.min(w, h) / 18);
  const tiles: string[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = ((col + 0.5) * w) / cols;
      const cy = ((row + 0.5) * h) / rows;
      tiles.push(
        `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" ` +
          `transform="rotate(-30 ${cx} ${cy})" font-family="serif" font-size="${fontSize}" ` +
          `fill="#000000" fill-opacity="0.10" letter-spacing="3">${safeText}</text>`,
      );
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${tiles.join("")}</svg>`;
}
