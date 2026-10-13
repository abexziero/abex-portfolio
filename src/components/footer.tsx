"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
export function Footer({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (/^\/(id|en)$/.test(pathname)) return null;
  return <footer className="site-footer">{children}</footer>;
}
