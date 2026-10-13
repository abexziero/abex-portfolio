"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
export function CardFan({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", context => {
      const cards = [...ref.current!.children] as HTMLElement[];
      const listeners: (() => void)[] = [];
      cards.forEach((card, index) => {
        const rotation = [-5, 1, 4][index] ?? 0;
        gsap.fromTo(card, { y: 80, rotation: 0, opacity: 0 }, { y: 0, rotation, opacity: 1, duration: .8, delay: index * .08, ease: "power3.out" });
        const enter = () => context.add(() => { card.style.zIndex = "5"; gsap.to(card, { y: -18, rotation: 0, scale: 1.03, duration: .3, overwrite: "auto" }); });
        const leave = () => context.add(() => { card.style.zIndex = String(index === 1 ? 3 : 2); gsap.to(card, { y: 0, rotation, scale: 1, duration: .4, overwrite: "auto" }); });
        card.addEventListener("pointerenter", enter); card.addEventListener("pointerleave", leave); card.addEventListener("focusin", enter); card.addEventListener("focusout", leave);
        listeners.push(() => { card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave); card.removeEventListener("focusin", enter); card.removeEventListener("focusout", leave); });
      });
      return () => listeners.forEach(remove => remove());
    }, ref);
    return () => mm.revert();
  }, []);
  return <div ref={ref} className="card-fan">{children}</div>;
}
