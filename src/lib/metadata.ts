import type { Metadata } from "next";
import { projects, ui, type Locale } from "@/lib/content";
import { siteSettings } from "@/lib/site";
export function pageMetadata(lang: Locale, slug?: string, title?: string, pagePath?: "/snippets" | "/experiments" | "/work" | "/about" | "/services"): Metadata {
  const path = pagePath ?? (slug ? `/projects/${slug}` : "");
  const description = pagePath === "/services" ? ui[lang].servicesPageIntro : projects.find(project => project.slug === slug)?.summary[lang] ?? ui[lang].metaDescription;
  return {
    title: title ? `${title} — ${ui[lang].metaTitle}` : ui[lang].metaTitle,
    description,
    metadataBase: new URL(siteSettings().url),
    alternates: { canonical: `/${lang}${path}`, languages: { id: `/id${path}`, en: `/en${path}`, "x-default": `/id${path}` } },
    robots: { index: siteSettings().indexable, follow: siteSettings().indexable },
    openGraph: { title: title ?? ui[lang].metaTitle, description, locale: lang === "id" ? "id_ID" : "en_US", type: "website", url: `/${lang}${path}` },
  };
}
