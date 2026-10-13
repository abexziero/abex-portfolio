import type { NextConfig } from "next";
import { siteSettings } from "./src/lib/site.ts";
const staticExport = process.env.NEXT_STATIC_EXPORT === "1";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  ...(staticExport ? {
    output: "export" as const,
    images: { loader: "custom" as const, loaderFile: "./src/lib/static-image-loader.ts", deviceSizes: [640, 768, 1024, 1280, 1600], imageSizes: [320, 480] },
  } : {
  async redirects() { return [{ source: "/", destination: "/id", permanent: false }]; },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
      ...(siteSettings().indexable ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
    ] }];
  },
  }),
};
export default nextConfig;
