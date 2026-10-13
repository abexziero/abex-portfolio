import "./globals.css";
import Link from "next/link";
import { ThemeInit } from "@/components/theme-init";
export const metadata = { title: "404 — Halaman tidak ditemukan / Page not found", robots: { index: false, follow: false } };
export default function GlobalNotFound() {
  return <html lang="id" suppressHydrationWarning><head><ThemeInit /></head><body><main className="not-found"><p className="eyebrow">404</p><h1>Halaman tidak ditemukan.</h1><p lang="en">Page not found.</p><div><Link href="/id">Beranda →</Link><Link href="/en" lang="en">Home →</Link></div></main></body></html>;
}
