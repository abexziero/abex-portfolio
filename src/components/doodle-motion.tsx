"use client";
import { useEffect } from "react";
import gsap from "gsap";

export function DoodleMotion() {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const x = gsap.quickTo(document.body, "--doodle-x", { duration: .8, ease: "power2.out" });
      const y = gsap.quickTo(document.body, "--doodle-y", { duration: .8, ease: "power2.out" });
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        x((event.clientX / innerWidth - .5) * 10);
        y((event.clientY / innerHeight - .5) * 8);
      };
      const reset = () => { x(0); y(0); };
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", reset);
      window.addEventListener("blur", reset);
      document.addEventListener("visibilitychange", reset);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", reset);
        window.removeEventListener("blur", reset);
        document.removeEventListener("visibilitychange", reset);
      };
    });
    return () => media.revert();
  }, []);
  return null;
}
