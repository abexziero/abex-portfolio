import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { heroArtwork, projects } from "../src/lib/content.ts";
import { siteSettings } from "../src/lib/site.ts";

if (process.argv.includes("--release")) process.env.PORTFOLIO_RELEASE = "1";
siteSettings();
const env = { ...process.env, NEXT_STATIC_EXPORT: "1" };
const assets = [...new Set([heroArtwork.src, ...projects.flatMap(project => project.images.map(image => image.src))])];
for (const src of assets) for (const width of [320, 480, 640, 768, 1024, 1280, 1600]) {
  const destination = resolve(`public/optimized${src}-${width}.webp`);
  await mkdir(dirname(destination), { recursive: true });
  await sharp(resolve("public", `.${src}`)).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(destination);
}
const check = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/check-content.ts", ...(env.PORTFOLIO_RELEASE === "1" ? ["--release"] : [])], { stdio: "inherit", env });
if (check.status !== 0) process.exit(check.status ?? 1);
const build = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build", "--webpack"], { stdio: "inherit", env });
if (build.status !== 0) process.exit(build.status ?? 1);
await writeFile("out/_redirects", "/ /id 302\n/id/writing /id/services 308\n/en/writing /en/services 308\n");
await writeFile("out/_headers", `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: frame-ancestors 'none'; object-src 'none'; base-uri 'self'
${siteSettings().indexable ? "" : "  X-Robots-Tag: noindex, nofollow\n"}
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/motion-source
  Content-Type: text/plain; charset=utf-8
`);
console.log("Cloudflare Pages ready: out/");
