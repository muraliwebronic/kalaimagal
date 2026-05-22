import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  // Reuse a single PrismaClient across HMR reloads in dev.
  var __prisma__: PrismaClient | undefined;
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  // Hostinger shared MySQL typically caps a user at very few simultaneous
  // connections (often 3–10). Prisma's default pool size of 10 + the
  // mariadb driver's hold-on-acquire behaviour leads to "pool timeout"
  // errors in dev: the pool thinks it has free slots, opens new sockets,
  // and the DB refuses them — leaving requests queued for the full 10s
  // acquire timeout before failing.
  //
  // Parse the URL into a PoolConfig so we can attach pool tuning. Hard
  // cap of 5 stays under Hostinger's limit with room for heartbeats; 8s
  // connect timeout surfaces dead-end attempts quickly instead of
  // compounding.
  const u = new URL(url);
  const adapter = new PrismaMariaDb({
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
    connectionLimit: 5,
    connectTimeout: 8000,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__prisma__ ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma__ = prisma;
}
