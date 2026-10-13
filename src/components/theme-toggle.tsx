"use client";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import type { Copy } from "@/lib/content";

function subscribe(update: () => void) {
  try {
    const preference = localStorage.getItem("portfolio-theme");
    if (preference === "light" || preference === "dark") document.documentElement.dataset.themePreference = preference;
  } catch { /* Preserve the in-session choice when storage is blocked. */ }
  const applyTheme = () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.themePreference || "dark";
    update();
  };
  const storage = (event: StorageEvent) => {
    if (event.key !== "portfolio-theme" && event.key !== null) return;
    const root = document.documentElement;
    if (event.newValue === "light" || event.newValue === "dark") root.dataset.themePreference = event.newValue;
    else delete root.dataset.themePreference;
    applyTheme();
  };
  window.addEventListener("storage", storage);
  window.addEventListener("portfolio:theme", update);
  applyTheme();
  return () => {
    window.removeEventListener("storage", storage);
    window.removeEventListener("portfolio:theme", update);
  };
}
const snapshot = () => document.documentElement.dataset.theme;
const serverSnapshot = () => undefined;

export function useTheme() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

export function ThemeToggle({ copy }: { copy: Copy }) {
  const theme = useTheme();
  const label = (theme ?? "dark") === "dark" ? copy.themeLight : copy.themeDark;
  return <Button variant="outline" className="theme-toggle" data-ready={theme !== undefined} aria-label={label} title={label} onClick={() => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.dataset.theme = next; root.dataset.themePreference = next;
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Keep the current session usable when storage is blocked. */ }
    window.dispatchEvent(new Event("portfolio:theme"));
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {theme === "dark" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.8 13.1A9 9 0 0 1 10.9 3.2a9 9 0 1 0 9.9 9.9Z" />}
    </svg>
  </Button>;
}
