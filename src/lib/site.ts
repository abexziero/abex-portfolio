import { profile } from "./content.ts";

export function siteSettings(env: Record<string, string | undefined> = process.env) {
  const configured = env.SITE_URL || profile.domain;
  let url = "https://portfolio.invalid";
  if (configured) {
    let parsed: URL;
    try { parsed = new URL(configured); } catch { throw new Error("SITE_URL must be a real HTTPS origin"); }
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash || !parsed.hostname.includes(".") || parsed.hostname.endsWith(".invalid")) {
      throw new Error("SITE_URL must be a real HTTPS origin");
    }
    url = parsed.origin;
  }
  if (env.PORTFOLIO_RELEASE === "1" && !configured) throw new Error("Set SITE_URL before building a release");
  const indexable = env.PORTFOLIO_RELEASE === "1" && (!env.CF_PAGES_BRANCH || env.CF_PAGES_BRANCH === "main");
  return { url, indexable };
}
