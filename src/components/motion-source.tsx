"use client";
import { useEffect, useRef, useState } from "react";
import type { Copy } from "@/lib/content";
export function MotionSource({ copy }: { copy: Copy }) {
  const [code, setCode] = useState<string | null>(null), [failed, setFailed] = useState(false);
  const requested = useRef(false), controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  return <details id="engine-source" className="demo-source" onToggle={event => {
    if (!event.currentTarget.open || requested.current) return;
    requested.current = true; setFailed(false); controller.current = new AbortController();
    fetch("/motion-source", { signal: controller.current.signal }).then(response => {
      if (!response.ok) throw new Error("Source unavailable");
      return response.text();
    }).then(setCode).catch(error => {
      if (error.name !== "AbortError") { requested.current = false; setFailed(true); }
    });
  }}><summary>{copy.demoCode}</summary>{code === null && <p role="status">{failed ? copy.codeError : copy.codeLoading}</p>}<pre><code>{code ?? ""}</code></pre><noscript><a className="text-link" href="/motion-source" download="motion-demo.tsx">{copy.codeDownload}</a></noscript></details>;
}
