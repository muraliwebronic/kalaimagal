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

  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "192.168.0.10" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
