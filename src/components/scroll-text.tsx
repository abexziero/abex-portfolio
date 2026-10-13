"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

// Keep interactive demos, card links and the SVG wordmark under their existing animators.
const targets = [
  ".reference-page-heading h1", ".reference-page-heading p",
  ".service-card h2", ".service-card p", ".service-process h2",
  ".process-step h3", ".process-step p",
  ".about-bio p", ".about-location", ".about-learning",
  ".about-skills h2", ".about-skill-group h3", ".about-contact h2",
  ".case-title h1", ".case-summary", ".case-text-row p",
  ".contact-details>p", ".experiment-row h2", ".experiment-row p",
  ".demo-description h2", ".demo-description p",
].join(",");

export function ScrollText() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    const media = gsap.matchMedia();
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const splits = [...document.querySelectorAll<HTMLElement>(`#main :is(${targets})`)]
          .filter(element => !element.closest("[aria-hidden=true], [inert]") && !element.querySelector("a,button,svg"))
          .map(element => SplitText.create(element, {
            type: "lines", mask: "lines", linesClass: "scroll-line",
            autoSplit: true, tag: "span", aria: element.matches("p") ? "none" : "auto",
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 105, duration: .65, stagger: .08, ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 92%", once: true },
              });
            },
          }));
        return () => splits.forEach(split => split.revert());
      });
    });
    return () => { cancelled = true; media.revert(); };
  }, [pathname]);
  return null;
}
