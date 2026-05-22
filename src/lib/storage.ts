import "server-only";
import { promises as fs } from "node:fs";
import { createReadStream, type ReadStream } from "node:fs";
import path from "node:path";

/**
 * Storage driver abstraction.
 *
 * Driver is selected by STORAGE_DRIVER env (`local` or `r2`). The convert
 * API + admin upload handler call this — they never touch the filesystem
 * or S3 directly. That way, the Phase 5 R2 swap is one env-var change.
 *
 * Keys are POSIX-style ('cache/{uuid}/page_3.webp', 'pdfs/{uuid}.pdf').
 * Each driver maps them to its native layout.
 */

export interface StorageDriver {
  put(key: string, data: Buffer, contentType?: string): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  exists(key: string): Promise<boolean>;
  stream(key: string): Promise<ReadStream | null>;
  delete(key: string): Promise<void>;
}

/* ============================================================================
   Local FS driver — used in dev. STORAGE_LOCAL_PATH points at the root.
   ============================================================================ */

class LocalDriver implements StorageDriver {
  constructor(private root: string) {}

  private resolve(key: string): string {
    // Reject anything trying to escape the root via .. segments
    const normalized = path.posix.normalize(key);
    if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
      throw new Error(`Invalid storage key: ${key}`);
    }
    return path.join(this.root, normalized);
  }

  async put(key: string, data: Buffer): Promise<void> {
    const filePath = this.resolve(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
  }

  async get(key: string): Promise<Buffer | null> {
    try {
      return await fs.readFile(this.resolve(key));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw e;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(key));
      return true;
    } catch {
      return false;
    }
  }

  async stream(key: string): Promise<ReadStream | null> {
    const filePath = this.resolve(key);
    try {
      await fs.access(filePath);
      return createReadStream(filePath);
    } catch {
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(this.resolve(key));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    }
  }
}

/* ============================================================================
   R2 driver stub — wired up in Phase 5.1 with @aws-sdk/client-s3.
   Throws clearly so a misconfigured prod env doesn't silently fall back.
   ============================================================================ */

class R2DriverStub implements StorageDriver {
  put = unsupported;
  get = unsupported;
  exists = unsupported;
  stream = unsupported;
  delete = unsupported;
}

function unsupported(): never {
  throw new Error(
    "STORAGE_DRIVER=r2 selected but the R2 driver is not yet implemented. " +
      "Wired up in Phase 5.1. For dev, set STORAGE_DRIVER=local.",
  );
}

/* ============================================================================
   Factory — singleton per process
   ============================================================================ */

let cached: StorageDriver | null = null;

export function storage(): StorageDriver {
  if (cached) return cached;

  const driver = (process.env.STORAGE_DRIVER ?? "local").toLowerCase();

  if (driver === "local") {
    const root = process.env.STORAGE_LOCAL_PATH ?? "./public/uploads";
    cached = new LocalDriver(path.resolve(root));
    return cached;
  }
  if (driver === "r2") {
    cached = new R2DriverStub();
    return cached;
  }

  throw new Error(`Unknown STORAGE_DRIVER: ${driver}`);
}

/* ============================================================================
   Key helpers — keep the layout consistent across the codebase
   ============================================================================ */

export const storageKeys = {
  pdf: (docId: string) => `pdfs/${docId}.pdf`,
  /** Legacy single-layer cache key (kept so existing files still resolve). */
  page: (docId: string, page: number) => `cache/${docId}/page_${page}.webp`,
  /** Unwatermarked base raster — pre-rendered once at upload, never served raw. */
  baseRaster: (docId: string, page: number) => `cache/${docId}/base/page_${page}.webp`,
  /** Watermarked PREVIEW output for non-subscribers — shared across users. */
  previewPage: (docId: string, page: number) => `cache/${docId}/preview/page_${page}.webp`,
};
