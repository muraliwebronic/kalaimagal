import "server-only";
import { prisma } from "@/lib/db";

/**
 * Read a single Setting row by key.
 *
 * The Setting model stores `value` as JSON, so callers must cast to their
 * expected shape. Returns null if the key isn't set.
 *
 * Keep this on the server — `import "server-only"` will fail the build if
 * a client component imports it.
 */
export async function getSetting<T>(key: string): Promise<T | null> {
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row) return null;
  return row.value as T;
}

/** Read multiple settings in one query. */
export async function getSettings<T extends Record<string, unknown>>(
  keys: readonly string[],
): Promise<Partial<T>> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: keys as string[] } },
  });
  const out: Record<string, unknown> = {};
  for (const r of rows) out[r.key] = r.value;
  return out as Partial<T>;
}

export interface HeroConfig {
  headline_tamil: string;
  headline_english: string;
  cta_text_tamil: string;
  cta_text_english: string;
  featured_content_ids: number[];
}
