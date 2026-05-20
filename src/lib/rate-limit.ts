/**
 * In-memory token-bucket rate limiter.
 *
 * Suitable for single-instance dev / single-Vercel-region deployments.
 * For multi-region or horizontal scale, swap the backing Map for Upstash
 * Redis (`@upstash/ratelimit`) — same interface.
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  /** Maximum tokens (i.e. burst capacity). */
  capacity: number;
  /** Tokens added per interval. */
  refillRate: number;
  /** Refill interval in ms. */
  intervalMs: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Try to consume one token. Returns whether the request is allowed plus
 * remaining tokens and time-until-next-refill for response headers.
 */
export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  let b = buckets.get(key);

  if (!b) {
    b = { tokens: config.capacity, lastRefill: now };
    buckets.set(key, b);
  } else {
    // Refill based on elapsed intervals
    const elapsed = now - b.lastRefill;
    const intervals = Math.floor(elapsed / config.intervalMs);
    if (intervals > 0) {
      b.tokens = Math.min(config.capacity, b.tokens + intervals * config.refillRate);
      b.lastRefill += intervals * config.intervalMs;
    }
  }

  if (b.tokens <= 0) {
    const resetMs = config.intervalMs - (now - b.lastRefill);
    return { allowed: false, remaining: 0, resetMs: Math.max(0, resetMs) };
  }

  b.tokens -= 1;
  return { allowed: true, remaining: b.tokens, resetMs: config.intervalMs };
}

/** Common limits for known endpoints. */
export const limits = {
  login: { capacity: 5, refillRate: 5, intervalMs: 60_000 },           // 5 per minute
  register: { capacity: 3, refillRate: 3, intervalMs: 60 * 60_000 },   // 3 per hour
  passwordReset: { capacity: 3, refillRate: 3, intervalMs: 60 * 60_000 }, // 3 per hour
  convert: { capacity: 60, refillRate: 60, intervalMs: 60_000 },       // 60 per minute
} satisfies Record<string, RateLimitConfig>;

/** Try-consume helper that derives the key from endpoint + identifier(s). */
export function checkLimit(endpoint: keyof typeof limits, ...identifiers: string[]): RateLimitResult {
  const key = `${endpoint}:${identifiers.join(":")}`;
  return rateLimit(key, limits[endpoint]);
}

/** Pull the caller's IP from a Next.js request — falls back to a stable placeholder. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
