import type { MetadataRoute } from "next";
import { locales, projects } from "@/lib/content";
import { siteSettings } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const site = siteSettings();
  if (!site.indexable) return [];
  const paths = ["", "/about", "/work", "/services", "/experiments", "/snippets", ...projects.map(project => `/projects/${project.slug}`)];
  return locales.flatMap(lang => paths.map(path => ({
    url: `${site.url}/${lang}${path}`,
    alternates: { languages: Object.fromEntries(locales.map(locale => [locale, `${site.url}/${locale}${path}`])) },
  })));
}
