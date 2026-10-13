"use client";
import { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Copy } from "@/lib/content";
import type { DemoSlug } from "@/lib/motion-catalog";

const paletteProperties = ["--hero-0", "--hero-1", "--hero-2", "--hero-3", "--art-extra"];
const palette = paletteProperties.map(property => `var(${property})`);
type Particle = { x: number; y: number; vx: number; vy: number; homeX: number; homeY: number; r: number };
export function MotionDemo({ slug, copy }: { slug: DemoSlug; copy: Copy }) {
  const ref = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const paused = useRef(false), reset = useRef<() => void>(() => {});
  const [isPaused, setPaused] = useState(false);
  const [activated, setActivated] = useState(false);
  const filterId = `blob-${useId().replace(/:/g, "")}`;
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setActivated(true); observer.disconnect(); }
    }, { rootMargin: "80px" });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (!activated) return;
    const el = ref.current!, surface = canvas.current!, ctx = surface.getContext("2d");
    if (!ctx) return;
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(hover: hover) and (pointer: fine)", motion: "(prefers-reduced-motion: no-preference)" }, context => {
      const interactive = !!context.conditions?.desktop && !!context.conditions?.motion;
      el.dataset.interactive = String(interactive);
      let width = 600, height = 320, time = 0, previous = 0, visible = false, direction = 1, scrollSpeed = 0;
      let particles: Particle[] = [], controls: { x: number; y: number }[] = [], selected = -1;
      let ripple = { x: .5, y: .5, age: 10 };
      const pointer = { x: .5, y: .5, down: false, inside: false };
      const spring = { x: .5, y: .5, vx: 0, vy: 0 };
      const seed = () => {
        time = 0; direction = 1; selected = -1; spring.x = spring.y = .5; spring.vx = spring.vy = 0;
        ripple = { x: .5, y: .5, age: 10 };
        controls = [{ x: .1, y: .65 }, { x: .25, y: .05 }, { x: .75, y: .95 }, { x: .9, y: .35 }];
        particles = Array.from({ length: slug === "flow-field" ? 100 : slug === "cloth-pluck" ? 96 : 36 }, (_, i) => {
          const x = slug === "cloth-pluck" ? .12 + (i % 12) * .069 : .1 + ((i * 37 % 83) / 100);
          const y = slug === "cloth-pluck" ? .12 + Math.floor(i / 12) * .105 : .1 + ((i * 23 % 79) / 100);
          return { x, y, homeX: x, homeY: y, vx: Math.sin(i) * .06, vy: Math.cos(i) * .06, r: 10 + i % 11 };
        });
      };
      const dot = (x: number, y: number, radius: number, color: string) => {
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x * width, y * height, Math.max(1, radius), 0, Math.PI * 2); ctx.fill();
      };
      const curvePoint = (t: number) => {
        const a = 1 - t;
        return { x: a ** 3 * controls[0].x + 3 * a * a * t * controls[1].x + 3 * a * t * t * controls[2].x + t ** 3 * controls[3].x,
          y: a ** 3 * controls[0].y + 3 * a * a * t * controls[1].y + 3 * a * t * t * controls[2].y + t ** 3 * controls[3].y };
      };
      const draw = (dt: number) => {
        const style = getComputedStyle(el), palette = paletteProperties.map(property => style.getPropertyValue(property).trim());
        const foreground = style.getPropertyValue("--foreground").trim();
        const background = style.getPropertyValue("--card").trim();
        if (slug === "flow-field" && dt > 0) { ctx.globalAlpha = .16; ctx.fillStyle = background; ctx.fillRect(0, 0, width, height); ctx.globalAlpha = 1; }
        else ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1.5; ctx.strokeStyle = palette[0];
        if (slug === "velocity-marquee" || slug === "text-loop") {
          const speed = slug === "velocity-marquee" ? 35 + Math.min(220, Math.abs(scrollSpeed) * .15) : 40;
          const text = "ABEX / CODE / MOTION / "; ctx.font = `700 ${Math.min(48, width / 10)}px Arial`;
          const span = ctx.measureText(text).width;
          for (let row = 0; row < 3; row++) {
            const shift = (time * speed * direction * (row % 2 ? -1 : 1)) % span;
            ctx.fillStyle = palette[row];
            for (let x = -span + shift; x < width + span; x += span) ctx.fillText(text, x, height * (.27 + row * .28));
          }
          scrollSpeed *= Math.pow(.06, dt);
        } else if (slug === "text-scramble" || slug === "text-pressure") {
          const text = "BUILD WITH ABEX", step = width / (text.length + 2);
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          [...text].forEach((letter, i) => {
            const x = step * (i + 1.5), distance = Math.hypot(x / width - pointer.x, (.5 - pointer.y) * .6);
            const power = pointer.inside ? Math.max(0, 1 - distance * 5) : 0;
            const size = step * (slug === "text-pressure" ? 1 + power * .6 : 1);
            ctx.font = `${Math.round(400 + power * 500)} ${size}px Arial`;
            ctx.fillStyle = power > .1 ? palette[i % 5] : foreground;
            const scrambled = slug === "text-scramble" && power > .2 && Math.sin(time * 12 + i) > -.3;
            ctx.fillText(scrambled ? "01!/#<>"[Math.floor(time * 15 + i) % 7] : letter, x, height / 2);
          });
          ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
        } else if (slug === "motion-path" || slug === "path-editor") {
          ctx.beginPath(); ctx.moveTo(controls[0].x * width, controls[0].y * height);
          ctx.bezierCurveTo(controls[1].x * width, controls[1].y * height, controls[2].x * width, controls[2].y * height, controls[3].x * width, controls[3].y * height); ctx.stroke();
          const t = ((time * .18 * direction) % 1 + 1) % 1, position = curvePoint(t); dot(position.x, position.y, 11, palette[1]);
          if (slug === "path-editor") {
            ctx.setLineDash([4, 5]); ctx.beginPath(); controls.forEach((p, i) => i ? ctx.lineTo(p.x * width, p.y * height) : ctx.moveTo(p.x * width, p.y * height)); ctx.stroke(); ctx.setLineDash([]);
            controls.forEach((p, i) => dot(p.x, p.y, 9, palette[i]));
          }
        } else if (slug === "parallax-tilt") {
          const x = pointer.inside ? (pointer.x - .5) * 25 : 0, y = pointer.inside ? (pointer.y - .5) * 25 : 0;
          ctx.save(); ctx.translate(width / 2 + x, height / 2 + y); ctx.rotate(x * .004); ctx.transform(1, y * .003, x * .002, 1, 0, 0);
          ctx.fillStyle = palette[0]; ctx.fillRect(-width * .26, -height * .32, width * .52, height * .64);
          ctx.fillStyle = "#0D2118"; ctx.font = `700 ${width * .06}px Arial`; ctx.fillText("ABEX", -width * .2 + x, 5 + y);
          ctx.font = "12px monospace"; ctx.fillText("ENGINEERING / MOTION", -width * .2, height * .22); ctx.restore();
          dot(.76 + x / width, .22 + y / height, 20, palette[3]);
        } else if (slug === "ripple-grid" || slug === "iron-filings") {
          ripple.age += dt;
          for (let row = 0; row < 12; row++) for (let col = 0; col < 22; col++) {
            const x = (col + 1) / 23, y = (row + 1) / 13;
            if (slug === "ripple-grid") {
              const distance = Math.hypot((x - ripple.x) * width / height, y - ripple.y);
              const wave = Math.exp(-Math.abs(distance - ripple.age * .75) * 14) * Math.exp(-ripple.age * .5);
              dot(x, y, 2 + wave * 9, palette[(col + row) % 5]);
            } else {
              const dx = x - pointer.x, dy = (y - pointer.y) * height / width;
              const angle = Math.atan2(3 * dx * dy, 2 * dx * dx - dy * dy + .0001);
              ctx.strokeStyle = palette[(row + col) % 5]; ctx.beginPath(); ctx.moveTo(x * width - Math.cos(angle) * 6, y * height - Math.sin(angle) * 6); ctx.lineTo(x * width + Math.cos(angle) * 6, y * height + Math.sin(angle) * 6); ctx.stroke();
            }
          }
        } else if (slug === "spring-drag") {
          const tx = pointer.down ? pointer.x : .5, ty = pointer.down ? pointer.y : .5;
          spring.vx += ((tx - spring.x) * 45 - spring.vx * 6) * dt; spring.vy += ((ty - spring.y) * 45 - spring.vy * 6) * dt;
          spring.x += spring.vx * dt; spring.y += spring.vy * dt;
          ctx.beginPath(); ctx.moveTo(width / 2, height / 2); ctx.lineTo(spring.x * width, spring.y * height); ctx.stroke(); dot(.5, .5, 4, foreground); dot(spring.x, spring.y, 28, palette[1]);
        } else if (slug === "metaballs") {
          for (let i = 0; i < 5; i++) {
            const x = i === 0 && pointer.inside ? pointer.x : .5 + Math.sin(time * .65 + i * 1.3) * .22;
            const y = i === 0 && pointer.inside ? pointer.y : .5 + Math.cos(time * .8 + i * 1.1) * .2;
            dot(x, y, Math.min(width, height) * .13, palette[0]);
          }
        } else if (slug === "cloth-pluck") {
          particles.forEach((p, i) => {
            if (i >= 12) {
              let fx = (p.homeX - p.x) * 25, fy = (p.homeY - p.y) * 25;
              for (const neighbor of [i - 12, i + 12, i % 12 ? i - 1 : -1, i % 12 < 11 ? i + 1 : -1]) {
                const q = particles[neighbor]; if (!q) continue;
                fx += ((q.x - p.x) - (q.homeX - p.homeX)) * 18; fy += ((q.y - p.y) - (q.homeY - p.homeY)) * 18;
              }
              if (pointer.down && Math.hypot(p.x - pointer.x, p.y - pointer.y) < .18) { fx += (pointer.x - p.x) * 160; fy += (pointer.y - p.y) * 160; }
              p.vx += (fx - p.vx * 4) * dt; p.vy += (fy - p.vy * 4) * dt; p.x += p.vx * dt; p.y += p.vy * dt;
            }
            ctx.strokeStyle = palette[0]; ctx.beginPath(); ctx.moveTo(p.x * width, p.y * height);
            const right = i % 12 < 11 ? particles[i + 1] : undefined; if (right) ctx.lineTo(right.x * width, right.y * height); ctx.stroke();
            const below = particles[i + 12]; if (below) { ctx.beginPath(); ctx.moveTo(p.x * width, p.y * height); ctx.lineTo(below.x * width, below.y * height); ctx.stroke(); }
            dot(p.x, p.y, 2, palette[1]);
          });
        } else {
          particles.forEach((p, i) => {
            if (slug === "shape-pit") {
              if (selected === i && pointer.down) { p.x = pointer.x; p.y = pointer.y; p.vx = p.vy = 0; }
              else { p.vy += .65 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
              const rx = p.r / width, ry = p.r / height;
              if (p.y > 1 - ry) { p.y = 1 - ry; p.vy = -Math.abs(p.vy) * .72; }
              if (p.x < rx || p.x > 1 - rx) { p.x = Math.max(rx, Math.min(1 - rx, p.x)); p.vx *= -.8; }
              // shortcut: circular collision envelopes; use a rigid-body engine for exact polygon collisions.
              for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j], dx = (q.x - p.x) * width, dy = (q.y - p.y) * height, d = Math.hypot(dx, dy), overlap = p.r + q.r - d;
                if (overlap > 0 && d > .01) {
                  const nx = dx / d, ny = dy / d; p.x -= nx * overlap / width * .5; p.y -= ny * overlap / height * .5; q.x += nx * overlap / width * .5; q.y += ny * overlap / height * .5;
                  const velocity = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
                  if (velocity < 0) { p.vx += velocity * nx * .8; p.vy += velocity * ny * .8; q.vx -= velocity * nx * .8; q.vy -= velocity * ny * .8; }
                }
              }
              ctx.save(); ctx.translate(p.x * width, p.y * height); ctx.rotate(time * .15 + i); ctx.fillStyle = palette[i % 5];
              if (i % 3 === 0) ctx.fillRect(-p.r * .7, -p.r * .7, p.r * 1.4, p.r * 1.4);
              else if (i % 3 === 1) { ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.lineTo(p.r, p.r * .7); ctx.lineTo(-p.r, p.r * .7); ctx.closePath(); ctx.fill(); }
              else { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
            } else if (slug === "flocking") {
              let fx = (pointer.x - p.x) * .16, fy = (pointer.y - p.y) * .16;
              for (const q of particles) {
                if (q === p) continue; const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
                if (d < .06 && d > 0) { fx -= dx * 5; fy -= dy * 5; }
                else if (d < .2) { fx += (q.vx - p.vx) * .04 + dx * .015; fy += (q.vy - p.vy) * .04 + dy * .015; }
              }
              p.vx = gsap.utils.clamp(-.22, .22, p.vx + fx * dt); p.vy = gsap.utils.clamp(-.22, .22, p.vy + fy * dt);
              p.x = (p.x + p.vx * dt + 1) % 1; p.y = (p.y + p.vy * dt + 1) % 1;
              ctx.save(); ctx.translate(p.x * width, p.y * height); ctx.rotate(Math.atan2(p.vy, p.vx)); ctx.fillStyle = palette[i % 5]; ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(-4, 3); ctx.lineTo(-4, -3); ctx.closePath(); ctx.fill(); ctx.restore();
            } else {
              const angle = Math.sin(p.x * 8 + time * .2) + Math.cos(p.y * 7 - time * .15) + (pointer.inside ? Math.atan2(pointer.y - p.y, pointer.x - p.x) * .4 : 0);
              const x = p.x, y = p.y; p.x = (p.x + Math.cos(angle) * dt * .08 + 1) % 1; p.y = (p.y + Math.sin(angle) * dt * .08 + 1) % 1;
              ctx.strokeStyle = palette[i % 5]; ctx.beginPath(); ctx.moveTo(x * width, y * height); if (Math.hypot(x - p.x, y - p.y) < .1) ctx.lineTo(p.x * width, p.y * height); ctx.stroke();
              if (!dt) dot(p.x, p.y, 2, palette[i % 5]);
            }
          });
        }
      };
      const resize = () => {
        if (!visible) return;
        el.dataset.rendered = "true";
        width = Math.max(1, el.clientWidth); height = Math.max(1, surface.clientHeight);
        const ratio = Math.min(devicePixelRatio || 1, 2); surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); draw(0);
      };
      seed(); reset.current = () => { seed(); resize(); };
      const ticker = (now: number) => {
        const dt = Math.min(.033, Math.max(0, now - previous)); previous = now;
        if (!visible || paused.current || document.hidden) return;
        time += dt; draw(dt);
      };
      const move = (event: PointerEvent) => {
        const box = surface.getBoundingClientRect(); pointer.x = gsap.utils.clamp(0, 1, (event.clientX - box.left) / box.width); pointer.y = gsap.utils.clamp(0, 1, (event.clientY - box.top) / box.height); pointer.inside = true;
        if (slug === "path-editor" && pointer.down && selected >= 0) controls[selected] = { x: pointer.x, y: pointer.y };
      };
      const down = (event: PointerEvent) => {
        move(event); pointer.down = true; surface.setPointerCapture(event.pointerId); ripple = { x: pointer.x, y: pointer.y, age: 0 };
        if (slug === "motion-path" || slug === "text-loop") direction *= -1;
        if (slug === "path-editor") selected = controls.reduce((best, p, i) => Math.hypot(p.x - pointer.x, p.y - pointer.y) < Math.hypot(controls[best].x - pointer.x, controls[best].y - pointer.y) ? i : best, 0);
        if (slug === "shape-pit") selected = particles.reduce((best, p, i) => Math.hypot(p.x - pointer.x, p.y - pointer.y) < Math.hypot(particles[best].x - pointer.x, particles[best].y - pointer.y) ? i : best, 0);
      };
      const up = () => { pointer.down = false; selected = -1; };
      const leave = () => { pointer.inside = false; };
      const key = (event: KeyboardEvent) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "].includes(event.key)) return;
        event.preventDefault(); pointer.inside = true;
        if (event.key === "ArrowLeft") pointer.x = Math.max(0, pointer.x - .06);
        if (event.key === "ArrowRight") pointer.x = Math.min(1, pointer.x + .06);
        if (event.key === "ArrowUp") pointer.y = Math.max(0, pointer.y - .06);
        if (event.key === "ArrowDown") pointer.y = Math.min(1, pointer.y + .06);
        if (event.key === "Enter" || event.key === " ") { pointer.down = !pointer.down; ripple = { x: pointer.x, y: pointer.y, age: 0 }; direction *= -1; }
        if (slug === "path-editor") controls[1] = { x: pointer.x, y: pointer.y };
        if (slug === "shape-pit" && pointer.down) selected = 0;
      };
      let lastScroll = window.scrollY, lastScrollTime = performance.now();
      const scroll = () => { const now = performance.now(); scrollSpeed = (window.scrollY - lastScroll) / Math.max(16, now - lastScrollTime) * 1000; lastScroll = window.scrollY; lastScrollTime = now; };
      const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(el);
      const themeObserver = new MutationObserver(() => { if (visible) draw(0); }); themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; previous = 0; if (visible) resize(); }, { rootMargin: "80px" }); visibility.observe(el);
      if (interactive) {
        gsap.ticker.add(ticker); surface.addEventListener("pointermove", move); surface.addEventListener("pointerdown", down); surface.addEventListener("pointerup", up); surface.addEventListener("pointercancel", up); surface.addEventListener("lostpointercapture", up); surface.addEventListener("pointerleave", leave); surface.addEventListener("blur", up); surface.addEventListener("keydown", key); window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("portfolio:scroll", scroll);
      }
      return () => {
        gsap.ticker.remove(ticker); resizeObserver.disconnect(); themeObserver.disconnect(); visibility.disconnect(); reset.current = () => {};
        surface.removeEventListener("pointermove", move); surface.removeEventListener("pointerdown", down); surface.removeEventListener("pointerup", up); surface.removeEventListener("pointercancel", up); surface.removeEventListener("lostpointercapture", up); surface.removeEventListener("pointerleave", leave); surface.removeEventListener("blur", up); surface.removeEventListener("keydown", key); window.removeEventListener("scroll", scroll); window.removeEventListener("portfolio:scroll", scroll);
      };
    }, ref);
    return () => mm.revert();
  }, [slug, activated]);
  return <div ref={ref} className="demo-surface" data-interactive="false">
    <svg className="demo-static-preview" viewBox="0 0 600 320" role="img" aria-label={copy.motionTitle}><path d="M60 208C150 16 450 304 540 112" fill="none" stroke={palette[0]} strokeWidth="3" />{[0, 1, 2, 3, 4].map(i => <circle key={i} cx={100 + i * 100} cy={160 + Math.sin(i * 2) * 55} r={18 + i * 3} fill={palette[i]} />)}</svg>
    {slug === "metaballs" && <svg width="0" height="0" aria-hidden="true"><defs><filter id={filterId} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8" /><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" /></filter></defs></svg>}
    <canvas ref={canvas} tabIndex={0} role="img" aria-label={copy.motionHint} style={slug === "metaballs" ? { filter: `url(#${filterId})` } : undefined} />
    <div className="demo-controls"><button type="button" aria-pressed={isPaused} onClick={() => { paused.current = !paused.current; setPaused(paused.current); }}>{isPaused ? copy.motionResume : copy.motionPause}</button><button type="button" onClick={() => reset.current()}>{copy.motionReset}<span aria-hidden="true"> ↻</span></button></div>
  </div>;
}
