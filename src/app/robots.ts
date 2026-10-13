import type { MetadataRoute } from "next";
import { siteSettings } from "@/lib/site";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  const site = siteSettings();
  return site.indexable ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` } : { rules: { userAgent: "*", disallow: "/" } };
}
