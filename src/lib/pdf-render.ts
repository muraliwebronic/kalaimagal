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

/**
 * Render a single PDF page to an **unwatermarked** WebP. This is the
 * expensive half of the pipeline — pdfjs parse + napi-canvas rasterize at
 * 144 DPI + WebP encode. The output is a "base raster" suitable for
 * private cache storage; never serve it directly to the client.
 *
 * Use {@link applyWatermarkToWebp} to overlay the per-request watermark on
 * top of the buffer this returns.
 */
export async function renderPdfPageToBaseWebp(
  opts: Omit<RenderPageOptions, "watermarkText">,
): Promise<Buffer> {
  const { pdfBuffer, page, scale = 2.0, webpQuality = 78 } = opts;

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
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await pdfPage.render({
      canvas: canvas as unknown as HTMLCanvasElement,
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      viewport,
      canvasFactory,
    } as Parameters<typeof pdfPage.render>[0]).promise;

    const pngBuffer = canvas.toBuffer("image/png");
    return await sharp(pngBuffer).webp({ quality: webpQuality }).toBuffer();
  } finally {
    await doc.destroy().catch(() => {});
  }
}

/**
 * Composite a diagonal watermark onto an already-rendered WebP and
 * re-encode. Cheap: ~50–100 ms vs ~1000–2000 ms for a full pdf→raster
 * pass. Reads (width, height) from the input's WebP metadata.
 */
export async function applyWatermarkToWebp(
  webpBuffer: Buffer,
  watermarkText: string,
  webpQuality = 78,
): Promise<Buffer> {
  const meta = await sharp(webpBuffer).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) throw new Error("Could not read WebP dimensions for watermarking");
  const watermarkSvg = buildWatermarkSvg(watermarkText, w, h);
  return await sharp(webpBuffer)
    .composite([{ input: Buffer.from(watermarkSvg), blend: "over" }])
    .webp({ quality: webpQuality })
    .toBuffer();
}

/**
 * Compatibility wrapper — render and optionally watermark in one pass.
 * Prefer the split pair above so the heavy raster step can be cached
 * separately from the per-user watermark.
 */
export async function renderPdfPageToWebp(opts: RenderPageOptions): Promise<Buffer> {
  const { watermarkText, webpQuality = 78 } = opts;
  const base = await renderPdfPageToBaseWebp(opts);
  if (!watermarkText) return base;
  return applyWatermarkToWebp(base, watermarkText, webpQuality);
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
 * Build an SVG that places **three light watermarks** on the page —
 * top-right corner, near-center (very faint), bottom-left corner. Kept
 * subtle so subscriber reading isn't disrupted, but still forensically
 * useful: the text carries the subscriber's name + email so any leaked
 * page is traceable back to a single account.
 *
 * For the "PREVIEW" badge (non-subscriber), the same SVG is reused but
 * the marks read "PREVIEW" instead.
 */
function buildWatermarkSvg(text: string, w: number, h: number): string {
  const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const isPreview = text === "PREVIEW";
  // Smaller font than the old 40-tile grid: ~1.5% of min dimension
  const fontSize = Math.max(14, Math.round(Math.min(w, h) / 42));
  // Corner marks at ~6% inset, center mark dead-middle but with very low
  // opacity so it sits behind text rather than across it.
  const inset = Math.round(Math.min(w, h) * 0.055);
  const mark = (x: number, y: number, opacity: number, anchor: string, rotate: number) =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" ` +
    `transform="rotate(${rotate} ${x} ${y})" font-family="serif" font-style="italic" ` +
    `font-size="${fontSize}" fill="#000000" fill-opacity="${opacity}" letter-spacing="1.5">${safeText}</text>`;
  const tiles = [
    // Top-right margin
    mark(w - inset, inset + fontSize, isPreview ? 0.14 : 0.09, "end", 0),
    // Centre — very faint, slightly rotated; sits behind text without blocking
    mark(w / 2, h / 2, isPreview ? 0.07 : 0.04, "middle", -28),
    // Bottom-left margin
    mark(inset, h - inset, isPreview ? 0.14 : 0.09, "start", 0),
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${tiles.join("")}</svg>`;
}
