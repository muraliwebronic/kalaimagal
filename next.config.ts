import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Native-binding + dynamic-require packages can't be bundled by Turbopack.
  // Keep them external so they're loaded via Node's require() at runtime.
  serverExternalPackages: [
    "@napi-rs/canvas",
    "pdfjs-dist",
    "sharp",
    "mariadb",
    "@prisma/adapter-mariadb",
    "@prisma/client",
  ],
};

export default nextConfig;
