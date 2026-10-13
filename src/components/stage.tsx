"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import type { Copy, Locale } from "@/lib/content";
import { useTheme } from "@/components/theme-toggle";
gsap.registerPlugin(CustomEase, MorphSVGPlugin);
CustomEase.create("stage-card", ".22,1,.36,1");
CustomEase.create("stage-smooth", ".45,0,.55,1");
const colours = ["#F6F1DC", "#F0CE72", "#EBA580", "#BCDCDD"];
const darkPalettes = [colours, ["#F0CE72", "#F6DFA6", "#FAEAC4", "#FFF7E3"], ["#BCDCDD", "#CAE5E8", "#DBEFF0", "#F1FAF8"], ["#EBA580", "#F1B895", "#F7D1B5", "#FBE4CF"]];
const lightPalettes = [["#FFFAEA", "#FFDA57", "#FFB591", "#8DE5F3"], ["#FFDA57", "#FFE078", "#FFE79B", "#FFF1C2"], ["#8DE5F3", "#A9EEF8", "#C5F4FA", "#E2FAFC"], ["#FFB591", "#FFC2A5", "#FFD3BC", "#FFE6D6"]];
// Abex's own geometric wordmark; no Hipuku logo paths are used.
const letters = [
  "M0 25C0 16 5 10 13 10C18 10 21 12 23 15V11H30V38H23V34C21 37 18 39 13 39C5 39 0 34 0 25ZM8 25C8 30 10 33 15 33C20 33 23 30 23 25C23 20 20 17 15 17C10 17 8 20 8 25Z",
  "M33 38V0H41V15C44 12 47 10 51 10C59 10 64 16 64 25C64 34 59 39 51 39C46 39 43 37 41 34V38ZM41 25C41 30 44 33 48 33C53 33 56 30 56 25C56 20 53 17 48 17C44 17 41 20 41 25Z",
  "M67 25C67 16 73 10 82 10C91 10 96 16 96 25V28H75C76 32 79 34 83 34C87 34 89 32 91 30L96 34C93 38 89 40 83 40C73 40 67 34 67 25ZM75 22H88C88 18 86 16 82 16C78 16 76 18 75 22Z",
  "M98 11H107L114 20L121 11H130L119 24L130 38H121L114 29L107 38H98L109 24Z",
];
const modes = ["colour", "type", "space", "radius", "opacity"] as const;
type Mode = typeof modes[number] | "none";
const iconPaths = ["M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h4a5 5 0 0 0 0-10Z", "M5 20 12 4l7 16M8 14h8", "M3 12h18M7 8l-4 4 4 4m10-8 4 4-4 4", "M4 20V7a3 3 0 0 1 3-3h13M9 20v-1m5 1v-1m6-4h-1m1-5h-1", "M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z"];
const handles = ["tl", "tr", "bl", "br", "t", "r", "b", "l"];
const letterBounds = [[0,10,30,39],[33,0,64,39],[67,10,96,40],[98,11,130,38]];
function roundedLetter(index: number, radius: number) {
  if (!radius) return letters[index];
  const r = Math.min(radius,2);
  if (index === 0) return `M0 25C0 16 5 10 13 10C18 10 21 12 23 15V${11+r}Q23 11 ${23+r} 11H${30-r}Q30 11 30 ${11+r}V${38-r}Q30 38 ${30-r} 38H${23+r}Q23 38 23 ${38-r}V34C21 37 18 39 13 39C5 39 0 34 0 25ZM8 25C8 30 10 33 15 33C20 33 23 30 23 25C23 20 20 17 15 17C10 17 8 20 8 25Z`;
  if (index === 1) return `M33 ${38-r}V${r}Q33 0 ${33+r} 0H${41-r}Q41 0 41 ${r}V15C44 12 47 10 51 10C59 10 64 16 64 25C64 34 59 39 51 39C46 39 43 37 41 34V${38-r}Q41 38 ${41-r} 38H${33+r}Q33 38 33 ${38-r}ZM41 25C41 30 44 33 48 33C53 33 56 30 56 25C56 20 53 17 48 17C44 17 41 20 41 25Z`;
  if (index === 2) { const edge=Math.min(r,1.5); return `M67 25C67 16 73 10 82 10C91 10 96 16 96 25V${28-edge}Q96 28 ${96-edge} 28H75C76 32 79 34 83 34C87 34 89 32 91 30L96 34C93 38 89 40 83 40C73 40 67 34 67 25ZM75 22H88C88 18 86 16 82 16C78 16 76 18 75 22Z`; }
  const points=[[98,11],[107,11],[114,20],[121,11],[130,11],[119,24],[130,38],[121,38],[114,29],[107,38],[98,38],[109,24]];
  const corners=points.map(([x,y],i)=>{
    const previous=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length];
    const before=Math.hypot(previous[0]-x,previous[1]-y),after=Math.hypot(next[0]-x,next[1]-y),distance=Math.min(r,before/2,after/2);
    return {x,y,entry:[x+(previous[0]-x)*distance/before,y+(previous[1]-y)*distance/before],exit:[x+(next[0]-x)*distance/after,y+(next[1]-y)*distance/after]};
  });
  return corners.map((corner,i)=>`${i ? "L" : "M"}${corner.entry.join(" ")}Q${corner.x} ${corner.y} ${corner.exit.join(" ")}`).join("")+"Z";
}
function squarePath(index: number, unit: number, gap: number, radius: number) {
  const side = (130 - 48/unit)/4, gapUnits = gap/unit, x = (130-4*side-3*gapUnits)/2 + index*(side+gapUnits), y = (43-side)/2, r = Math.min(radius/unit,side/2);
  return r <= 0 ? `M${x} ${y}H${x+side}V${y+side}H${x}Z` : `M${x+r} ${y}H${x+side-r}A${r} ${r} 0 0 1 ${x+side} ${y+r}V${y+side-r}A${r} ${r} 0 0 1 ${x+side-r} ${y+side}H${x+r}A${r} ${r} 0 0 1 ${x} ${y+side-r}V${y+r}A${r} ${r} 0 0 1 ${x+r} ${y}Z`;
}
export function Stage({ lang, copy }: { lang: Locale; copy: Copy }) {
  const theme = useTheme(), palettes = theme === "light" ? lightPalettes : darkPalettes;
  const root = useRef<HTMLElement>(null), wordmark = useRef<SVGSVGElement>(null), animation = useRef<gsap.Context | null>(null);
  const entered = useRef(false), idle = useRef<gsap.core.Timeline | null>(null), customRef = useRef(false);
  const drag = useRef<{ x: number; y: number; value: number; kind: "type" | "space" | "radius"; cx: number; cy: number; distance: number; sx: number; sy: number } | null>(null);
  const [mode, setMode] = useState<Mode>("none"), [scale, setScale] = useState(1), [gap, setGap] = useState(0), [radius, setRadius] = useState(0), [palette, setPalette] = useState(0), [opacity, setOpacity] = useState(1), [custom, setCustom] = useState(false), [motionEnabled, setMotionEnabled] = useState(true);
  const [width, setWidth] = useState(600), [ceiling, setCeiling] = useState(1.35), [loopCode, setLoopCode] = useState<string | null>(null);
  const id = useId().replace(/:/g, ""), labels = [copy.designColor, copy.designType, copy.designSpacing, copy.designRadius, copy.designOpacity];
  const routes = [
    { route: "about", label: copy.stage.about, note: copy.stage.aboutNote },
    { route: "work", label: copy.nav[0], note: copy.stage.workNote },
    { route: "services", label: copy.stage.services, note: copy.stage.servicesNote },
    { route: "experiments", label: copy.experiments, note: copy.stage.experimentsNote },
    { route: "snippets", label: copy.snippets, note: copy.stage.snippetsNote },
  ];
  const maxGap = Math.max(0,Math.floor((width-260)/3)), appliedGap = Math.min(gap,maxGap);
  const unit = (width-3*appliedGap)/130, maxRadius = Math.floor(unit*2), appliedRadius = Math.min(radius,maxRadius);
  const gapUnits = appliedGap/unit, viewWidth = 130+3*gapUnits, fill = palettes[palette][1];
  const preview = custom ? "custom" : mode;
  const edit = () => { customRef.current = true; setCustom(true); idle.current?.pause(); };
  const reset = () => { root.current?.querySelector<HTMLButtonElement>(".tool-colour")?.focus(); customRef.current = false; setCustom(false); setMode("none"); setScale(1); setGap(0); setRadius(0); setPalette(0); setOpacity(1); setLoopCode(null); };
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", all: "all" }, context => {
      animation.current = context;
      const motion = context.conditions?.motion, paths = root.current!.querySelectorAll<SVGPathElement>(".stage-letter");
      const blur = root.current!.querySelector(".intro-blur");
      const letterGroup = root.current!.querySelector(".stage-letter-group");
      setMotionEnabled(!!motion);
      if (!entered.current && motion) {
        gsap.set(letterGroup, { filter: `url(#${id}-intro)` });
        const intro = gsap.timeline().fromTo(blur, { attr: { stdDeviation: 14 } }, { attr: { stdDeviation: 0 }, duration: 1.2, ease: "stage-smooth", onComplete: () => { gsap.set(letterGroup, { clearProps: "filter" }); } }, 0)
          .from(paths, { yPercent: 18, duration: .8, stagger: .05, ease: "stage-card" }, 0)
          .from(".stage-portal", { opacity: 0, y: 14, duration: .45, stagger: .08, clearProps: "opacity,transform" }, 1.25)
          .from(".stage-leader", { strokeDasharray: 350, strokeDashoffset: 350, duration: .9, stagger: .08, clearProps: "strokeDasharray,strokeDashoffset" }, 1.1);
        if (matchMedia("(hover: hover) and (pointer: fine)").matches) intro.from(".stage-bio,.stage-bar", { opacity: 0, y: 14, duration: .6, stagger: .12, clearProps: "opacity,transform" }, .88);
      }
      entered.current = true;
      if (motion) {
        const specimen = wordmark.current!, space = { value:16 }, round = { value:0 };
        const unit = () => specimen.clientWidth/130;
        const caption = (code: string) => { if (innerWidth < 768) setLoopCode(current=>current===code?current:code); };
        const draw = (gap: number, radius: number) => paths.forEach((path,i)=>path.setAttribute("d",squarePath(i,unit(),gap,radius)));
        const morph = (boxes: boolean) => {
          const phase = gsap.timeline(); paths.forEach((path,i)=>phase.to(path,{morphSVG:boxes?squarePath(i,unit(),16,0):letters[i],duration:.4,ease:"stage-card"},i*.03)); return phase;
        };
        const loop = gsap.timeline({ repeat:-1, delay:4 }); idle.current = loop;
        loop.call(()=>caption(`fill: ${getComputedStyle(document.documentElement).getPropertyValue("--hero-1").trim()};`)).to({}, {duration:2.6})
          .call(()=>caption("font-size: var(--text-wordmark);"))
          .to(specimen,{keyframes:[1,.84,.68,.84,1].map(value=>({"--auto-scale":value,duration:.7,ease:"power2.inOut"}))})
          .to({}, {duration:.5}).call(()=>caption("opacity: 0.4;"))
          .to(paths,{keyframes:[1,.4,1].map(opacity=>({opacity,duration:.8,ease:"power2.inOut"})),stagger:.06})
          .to({}, {duration:.4}).call(()=>caption("gap: 16px;"))
          .add(morph(true))
          .to(space,{value:()=>Math.max(16,(root.current!.querySelector<HTMLElement>(".stage-canvas")!.clientWidth-44-specimen.clientWidth+48)/3),duration:1.5,yoyo:true,repeat:1,ease:"power2.inOut",onUpdate:()=>{draw(space.value,0);caption(`gap: ${Math.round(space.value)}px;`);}})
          .to({}, {duration:.3}).call(()=>caption("border-radius: 0px;"))
          .to(round,{value:()=>(specimen.clientWidth-48)/8,duration:1.4,yoyo:true,repeat:1,ease:"power2.inOut",onUpdate:()=>{draw(16,round.value);caption(`border-radius: ${Math.round(round.value)}px;`);}})
          .to({}, {duration:.3}).add(morph(false)).to({}, {duration:.5});
        if (customRef.current) loop.pause();
      }
      return () => { gsap.killTweensOf(paths); idle.current = null; animation.current = null; };
    }, root);
    return () => mm.revert();
  }, [id]);
  useLayoutEffect(() => {
    if (mode === "none" && !custom) idle.current?.restart(true); else idle.current?.pause();
  }, [mode, custom, motionEnabled]);
  useLayoutEffect(() => {
    const context = animation.current; if (!context) return;
    context.add(() => {
      gsap.set(wordmark.current, { "--auto-scale":1 });
      const paths = root.current!.querySelectorAll<SVGPathElement>(".stage-letter");
      if (preview === "custom") { gsap.killTweensOf(paths,"yPercent"); gsap.set(paths,{yPercent:0}); }
      paths.forEach((path, i) => {
        gsap.set(path,{opacity, x:i*gapUnits, y:0});
        gsap.to(path, { morphSVG: roundedLetter(i,appliedRadius/unit), ...(theme === undefined ? {} : { fill:palettes[palette][i] }), duration: motionEnabled ? .4 : 0, delay: motionEnabled ? i * .03 : 0, ease: "stage-card", overwrite: "auto" });
      });
    });
  }, [preview, palette, palettes, theme, opacity, gapUnits, appliedRadius, unit, motionEnabled]);
  useLayoutEffect(() => {
    const canvas = root.current!.querySelector<HTMLElement>(".stage-canvas")!;
    const svg = root.current!.querySelector<SVGSVGElement>(".stage-connections")!;
    const dots = [[13,10],[37,0],[125.5,11],[82,10],[102.5,11]];
    const measure = () => {
      const area = canvas.getBoundingClientRect(), specimen = wordmark.current!.getBoundingClientRect();
      if (!area.width || !area.height) return;
      const naturalWidth = wordmark.current!.clientWidth || specimen.width;
      setWidth(naturalWidth); setCeiling(Math.min(1.35, (area.width - 44) / naturalWidth));
      svg.setAttribute("viewBox", `0 0 ${area.width} ${area.height}`);
      const slots = root.current!.querySelectorAll<HTMLElement>(".stage-portal");
      const paths = svg.querySelectorAll("path"), circles = svg.querySelectorAll("circle");
      if (innerWidth < 768) return;
      const compact = innerHeight <= 650, height = Math.max(...Array.from(slots,slot=>slot.offsetHeight));
      const lowerTop = specimen.top-area.top-height-(compact ? 32 : 44), upperTop = lowerTop-height-(compact ? 24 : 48);
      const placement = [[.1,upperTop],[.38,upperTop],[.96,upperTop],[.58,lowerTop],[.85,lowerTop]];
      slots.forEach((slot,i) => {
        const parent = slot.parentElement!;
        parent.style.left = `${specimen.left-area.left+specimen.width*placement[i][0]}px`;
        parent.style.top = `${placement[i][1]}px`;
        const note = parent.querySelector<HTMLElement>(".stage-portal-note")!;
        const center = specimen.left-area.left+specimen.width*placement[i][0];
        const noteCenter = Math.max(note.offsetWidth/2,Math.min(area.width-note.offsetWidth/2,center));
        note.style.left = `${slot.offsetWidth/2+noteCenter-center}px`;
      });
      slots.forEach((slot, i) => {
        const rect = slot.getBoundingClientRect(), dx = specimen.left - area.left + specimen.width * (dots[i][0]+[0,1,3,2,3][i]*gapUnits) / viewWidth, dy = specimen.top - area.top + specimen.height * dots[i][1] / 43;
        const sx = rect.left+rect.width/2-area.left, sy = rect.bottom-area.top;
        const lane = specimen.top-area.top-[24,32,20,16,8][i];
        const r = Math.min(8, Math.abs(dx-sx)/2, Math.max(0,lane-sy)/2), signX = Math.sign(dx-sx);
        const d = `M${sx} ${sy}V${lane-r}Q${sx} ${lane} ${sx+r*signX} ${lane}H${dx-r*signX}Q${dx} ${lane} ${dx} ${lane+r}V${dy}`;
        paths[i].setAttribute("d", d); circles[i].setAttribute("cx", String(dx)); circles[i].setAttribute("cy", String(dy));
      });
    };
    const observer = new ResizeObserver(measure); observer.observe(canvas); observer.observe(wordmark.current!);
    root.current!.querySelectorAll(".stage-portal").forEach(link=>observer.observe(link));
    measure(); const timer = setTimeout(measure, 2200);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [mode, scale, gapUnits, viewWidth, radius, custom]);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", context => {
      const listeners: (() => void)[] = [];
      root.current!.querySelectorAll<HTMLElement>(".stage-portal").forEach(link => {
        const fill = link.querySelector<HTMLElement>(".portal-fill")!, roll = link.querySelector(".portal-roll");
        const enter = (event: Event) => context.add(() => {
          const rect = link.getBoundingClientRect(), e = event as globalThis.PointerEvent;
          const x = Number.isFinite(e.clientX) ? e.clientX - rect.left : rect.width/2, y = Number.isFinite(e.clientY) ? e.clientY - rect.top : rect.height/2;
          const diameter = 2 * Math.hypot(Math.max(x,rect.width-x),Math.max(y,rect.height-y));
          gsap.set(fill,{left:x,top:y,width:diameter,height:diameter,xPercent:-50,yPercent:-50});
          gsap.to(fill,{scale:1,duration:.4,ease:"power2.out",overwrite:true});
          gsap.to(roll,{y:-22,duration:.32,ease:"power2.inOut",overwrite:true});
        });
        const leave = () => context.add(() => { gsap.to(fill,{scale:0,duration:.3,ease:"power2.in",overwrite:true}); gsap.to(roll,{y:0,duration:.32,ease:"power2.inOut",overwrite:true}); });
        link.addEventListener("pointerenter",enter); link.addEventListener("pointerleave",leave); link.addEventListener("focus",enter); link.addEventListener("blur",leave);
        listeners.push(()=>{link.removeEventListener("pointerenter",enter);link.removeEventListener("pointerleave",leave);link.removeEventListener("focus",enter);link.removeEventListener("blur",leave);});
      });
      return () => listeners.forEach(remove=>remove());
    });
    return () => mm.revert();
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || (event.target as HTMLElement).matches("input,select,textarea")) return;
      if (/^[1-5]$/.test(event.key)) { event.preventDefault(); root.current?.querySelector<HTMLButtonElement>(`.tool-${modes[Number(event.key)-1]}`)?.click(); }
      if (event.key === "Escape") {
        if (root.current?.contains(document.activeElement)) root.current.querySelector<HTMLButtonElement>(`.tool-${root.current.dataset.tool}`)?.focus();
        setMode("none");
      }
    };
    const visibility = () => { if (document.hidden) idle.current?.pause(); else if (!customRef.current && root.current?.dataset.tool === "none") idle.current?.resume(); };
    window.addEventListener("keydown", key); document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("keydown", key); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  const changeColour = () => {
    edit();
    setMode("colour");
    const colors = palettes[(palette+1)%palettes.length]; setPalette(value=>(value+1)%palettes.length);
    animation.current?.add(() => {
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const paths = root.current!.querySelectorAll(".stage-letter");
      gsap.to(paths, { fill: i => colors[i], duration: reduced ? 0 : .3, stagger: reduced ? 0 : .045, ease: "stage-smooth", overwrite: "auto" });
      if (!reduced) gsap.to(paths, { keyframes: [{ y: -8, duration: .154 }, { y: 2, duration: .132 }, { y: -4, duration: .11 }, { y: 1, duration: .077 }, { y: -1, duration: .05 }, { y: 0, duration: .027 }], stagger: .045, ease: "power2.inOut", overwrite: "auto" });
    });
  };
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect(), x = (event.clientX - bounds.left) / bounds.width * viewWidth, y = (event.clientY - bounds.top) / bounds.height * 43;
    for (const selector of [".stage-spot"]) {
      const node = root.current!.querySelector(selector); if (node) { node.setAttribute("cx", String(x)); node.setAttribute("cy", String(y)); }
    }
  };
  const startDrag = (event: PointerEvent<HTMLButtonElement>, kind: "type" | "space" | "radius", sx = 1, sy = 1) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = wordmark.current!.getBoundingClientRect(), cx = bounds.left+bounds.width/2, cy = bounds.top+bounds.height/2;
    drag.current = { x: event.clientX, y: event.clientY, kind, value: kind === "type" ? Math.min(scale,ceiling) : kind === "space" ? gap : radius, cx, cy, distance: Math.max(1,Math.hypot(event.clientX-cx,event.clientY-cy)), sx, sy };
  };
  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const state = drag.current; if (!state) return;
    edit();
    const delta = (event.clientX-state.x)*state.sx + (state.kind === "radius" ? (event.clientY-state.y)*state.sy : 0);
    if (state.kind === "type") setScale(Math.max(.5, Math.min(ceiling, state.value*Math.hypot(event.clientX-state.cx,event.clientY-state.cy)/state.distance)));
    else if (state.kind === "space") setGap(Math.max(0, Math.min(maxGap, Math.round(state.value + delta / 3))));
    else setRadius(Math.max(0, Math.min(maxRadius, Math.round(state.value + delta / 2))));
  };
  const code = mode === "colour" ? `fill: ${fill};` : mode === "type" ? `font-size: ${Math.round(292 * Math.min(scale,ceiling))}px;` : mode === "space" ? `letter-spacing: ${appliedGap}px;` : mode === "radius" ? `border-radius: ${appliedRadius}px;` : `opacity: ${opacity};`;
  const hint = mode === "colour" ? copy.nameHint : mode === "type" ? copy.stage.typeHint : mode === "space" ? copy.stage.spaceHint : mode === "radius" ? copy.stage.radiusHint : copy.stage.opacityHint;
  const shapeHandles = mode === "space" ? Array.from({length:3},(_,i)=>({x:((letterBounds[i][2]+letterBounds[i+1][0])/2+(i+.5)*gapUnits)/viewWidth*100,y:50,sx:1,sy:1})) : letterBounds.flatMap(([left,top,right,bottom],i)=>[[-1,-1],[1,-1],[-1,1],[1,1]].map(([x,y])=>({x:((x===1?right:left)+i*gapUnits)/viewWidth*100,y:(y===1?bottom:top)/43*100,sx:-x,sy:-y})));
  return <section ref={root} className="hero-stage" data-tool={mode} data-custom={custom}>
    <div className="stage-canvas">
      <div className="stage-portals">
        <svg className="stage-connections" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1"><path className="stage-leader" d="M190 120V260Q190 276 207 276H360"/><path className="stage-leader" d="M500 52H350Q332 52 332 71V167"/><path className="stage-leader" d="M680 120H820Q838 120 838 139V292"/><path className="stage-leader" d="M480 170H585Q606 170 606 191V222"/><path className="stage-leader" d="M700 171V235"/></g><g fill="currentColor">{[[360,276],[332,167],[838,292],[606,222],[700,235]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="4"/>)}</g></svg>
        {routes.map(route => <div className={`stage-portal-slot portal-${route.route}`} key={route.route}><span className="stage-portal-note" aria-hidden="true">{route.note}</span><Link className="stage-portal" href={`/${lang}/${route.route}`}><span className="portal-fill" aria-hidden="true"/><span className="portal-label"><span className="portal-roll"><span>{route.label.toLowerCase()}</span><span aria-hidden="true">{route.label.toLowerCase()}</span></span></span></Link></div>)}
      </div>
      <p className="stage-mobile-code" aria-hidden="true">{custom ? `fill: ${fill};` : loopCode ?? `fill: ${fill};`}</p>
      <h1 className="stage-wordmark" aria-label="Abex" style={{ transform: `scale(${Math.min(scale,ceiling)})` }}>
        <svg ref={wordmark} className="stage-svg" viewBox={`0 0 ${viewWidth} 43`} aria-hidden="true" onPointerEnter={() => idle.current?.pause()} onPointerMove={pointer} onPointerLeave={() => { if(mode === "none" && !custom) idle.current?.resume(); }}>
          <defs><filter id={`${id}-intro`} x="-30%" y="-50%" width="160%" height="200%" colorInterpolationFilters="sRGB"><feGaussianBlur className="intro-blur" stdDeviation="0" result="blur"/><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"/></filter><filter id={`${id}-goo`} x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="2.2" result="goo"/><feColorMatrix in="goo" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 15 -6"/></filter><radialGradient id={`${id}-spot`} className="stage-spot" gradientUnits="userSpaceOnUse" cx="65" cy="21" r="22"><stop offset=".4" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient><mask id={`${id}-mask`}><rect width={viewWidth} height="43" fill={`url(#${id}-spot)`}/></mask></defs>
          <g className="stage-letter-group"><g id={`${id}-letters`}>{letters.map((d,i)=><path className="stage-letter" fillRule="evenodd" key={i} d={d} fill={`var(--hero-${i})`}/>)}</g></g>
          <use className="stage-goo" href={`#${id}-letters`} filter={`url(#${id}-goo)`} mask={`url(#${id}-mask)`}/>
        </svg>
        {mode === "type" && <span className="stage-resize-frame">{handles.map(handle => <button key={handle} className={`stage-handle handle-${handle}`} aria-label={copy.stage.typeHint} onPointerDown={e=>startDrag(e,"type")} onPointerMove={moveDrag} onPointerUp={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}} onKeyDown={e=>{if(["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"].includes(e.key)){e.preventDefault();edit();setScale(value=>Math.max(.5,Math.min(ceiling,value+(["ArrowUp","ArrowRight"].includes(e.key)?.03:-.03))));}}}/>)}<span className="stage-dimensions">{Math.round(292*Math.min(scale,ceiling))} px</span></span>}
        {(mode === "space" || mode === "radius") && <span className="stage-shape-controls">{shapeHandles.map((handle,i)=><button key={i} style={{left:`${handle.x}%`,top:`${handle.y}%`}} aria-label={`${mode === "space" ? copy.designSpacing : copy.designRadius} ${i+1}`} onPointerDown={e=>startDrag(e,mode === "space"?"space":"radius",handle.sx,handle.sy)} onPointerMove={moveDrag} onPointerUp={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}} onKeyDown={e=>{if(["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"].includes(e.key)){e.preventDefault();edit();const delta=(["ArrowUp","ArrowRight"].includes(e.key)?1:-1)*(e.shiftKey?8:1);if(mode==="space")setGap(value=>Math.max(0,Math.min(maxGap,value+delta)));else setRadius(value=>Math.max(0,Math.min(maxRadius,value+delta)));}}}>{mode === "space" ? "↔" : "◯"}</button>)}</span>}
      </h1>
      <p className="stage-bio">{copy.referenceBio}</p>
      <div className="stage-bar">
        <div className="stage-callout" aria-hidden={mode === "none"}><figure className="stage-code"><div className="stage-code-dots"><i/><i/><i/></div><pre><code>{code}</code></pre><figcaption className="stage-note">{hint}</figcaption>{mode === "opacity" && <label className="stage-opacity-control"><span>{copy.designOpacity}</span><input type="range" min="0.25" max="1" step="0.05" value={opacity} onChange={event=>{edit();setOpacity(Number(event.target.value));}}/></label>}</figure><span className="stage-callout-rule"/></div>
        <div className="stage-toolbar" role="toolbar" aria-label={copy.designControls}>
          {custom && <button className="stage-deselect stage-reset" aria-label={copy.stage.reset} onClick={reset}>↺</button>}
          {mode !== "none" && <button className="stage-deselect" aria-label={copy.stage.deselect} onClick={()=>{root.current?.querySelector<HTMLButtonElement>(`.tool-${mode}`)?.focus();setMode("none");}}>×</button>}
          {modes.map((tool,i)=><button key={tool} className={`stage-tool tool-${tool}`} aria-label={labels[i]} aria-pressed={mode===tool} aria-keyshortcuts={String(i+1)} onClick={()=>{if(tool === "colour") changeColour(); else setMode(current=>current===tool?"none":tool);}}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={iconPaths[i]} fill={i===0||i===4?"currentColor":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>{labels[i]}</span></button>)}
        </div>
      </div>
    </div>
  </section>;
}
