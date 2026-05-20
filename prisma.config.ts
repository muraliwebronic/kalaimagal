import { config as loadDotenv } from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment variables from .env.local (Next.js convention) so we have
// a single source of truth across the app, Prisma CLI, and seed script.
loadDotenv({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
