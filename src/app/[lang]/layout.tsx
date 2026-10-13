import type { ReactNode } from "react";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeInit } from "@/components/theme-init";
import { DoodleMotion } from "@/components/doodle-motion";
import { ScrollText } from "@/components/scroll-text";
import { siteSettings } from "@/lib/site";
import { isLocale, locales, profile, ui } from "@/lib/content";
import "../globals.css";
const parkinsans = localFont({ src: "../fonts/parkinsans-latin.woff2", variable: "--font-parkinsans", display: "swap", weight: "300 800" });
export function generateStaticParams() { return locales.map(lang => ({ lang })); }
export const dynamicParams = false;
export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!isLocale(lang)) notFound(); const copy = ui[lang];
  return <html lang={lang} className={parkinsans.variable} suppressHydrationWarning><head><ThemeInit /></head><body>
    <DoodleMotion />
    <ScrollText />
    <a href="#main" className="skip-link">{copy.skip}</a>
    <Header lang={lang} copy={copy} />
    <main id="main" tabIndex={-1}>{children}</main><Footer><a className="wordmark" href={`/${lang}`}>abex</a><span>© 2026</span><p className="preview-note">{siteSettings().indexable ? copy.footer : copy.previewNote}</p>{profile.social.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</Footer>
  </body></html>;
}
