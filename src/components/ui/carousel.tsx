"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import type { Copy } from "@/lib/content";
// Native scroll snap owns the track; GSAP only animates slide contents.
export function Carousel({ children, count, copy }: { children: ReactNode; count: number; copy: Copy }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0), [state, setState] = useState("idle");
  const active = useRef(0);
  useLayoutEffect(() => {
    const el = track.current!; let timeout: ReturnType<typeof setTimeout>;
    const ctx = gsap.context(() => {}, el);
    function settle() {
      const next = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(next); setState("idle");
      if (active.current !== next && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        ctx.add(() => gsap.fromTo(el.children[next]?.firstElementChild, { opacity: 0.65, y: 10 }, { opacity: 1, y: 0, duration: 0.35, overwrite: true }));
      }
      active.current = next;
    }
    function scroll() { setState("settling"); clearTimeout(timeout); timeout = setTimeout(settle, 120); }
    el.addEventListener("scroll", scroll, { passive: true }); el.addEventListener("scrollend", settle);
    const resize = new ResizeObserver(() => { el.scrollLeft = active.current * el.clientWidth; }); resize.observe(el);
    return () => { clearTimeout(timeout); resize.disconnect(); el.removeEventListener("scroll", scroll); el.removeEventListener("scrollend", settle); ctx.revert(); };
  }, []);
  function go(next: number) {
    const el = track.current!; const target = Math.max(0, Math.min(count - 1, next));
    setState("settling"); el.scrollTo({ left: target * el.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <div className="case-carousel" role="region" aria-roledescription="carousel" aria-label={copy.gallery} tabIndex={0} data-state={state}
    onKeyDown={e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); go(index + (e.key === "ArrowRight" ? 1 : -1)); } }}>
    <div ref={track} className="carousel-track" onPointerDown={() => setState("dragging")} onPointerUp={() => setState("settling")} onPointerCancel={() => setState("idle")}>{children}</div>
    <div className="carousel-controls"><span className="slide-counter" role="status" aria-label={`${copy.slide} ${index + 1} ${copy.of} ${count}`}>{index + 1} / {count}</span>{count > 1 && <div><Button variant="outline" aria-label={copy.previous} disabled={index === 0} onClick={() => go(index - 1)}>←</Button><Button variant="outline" aria-label={copy.next} disabled={index === count - 1} onClick={() => go(index + 1)}>→</Button></div>}</div>
  </div>;
}
