"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Sheet, SheetTrigger, SheetPortal, SheetOverlay, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { projects, profile, type Copy, type Locale } from "@/lib/content";
gsap.registerPlugin(CustomEase);
CustomEase.create("nav-colour", ".45,0,.55,1");
CustomEase.create("nav-count", "0,0,.2,1");

function Vitals({ lang }: { lang: Locale }) {
  const [values, setValues] = useState<{ lcp: number | null; slow: number; wire: number } | null>(null);
  useEffect(() => {
    const data = { lcp: null as number | null, slow: 0, wire: 0 }, observers: PerformanceObserver[] = [];
    const update = () => { data.wire = [...performance.getEntriesByType("resource"), ...performance.getEntriesByType("navigation")].reduce((bytes,entry)=>bytes+((entry as PerformanceResourceTiming).transferSize||0),0); setValues({...data}); };
    for (const type of ["largest-contentful-paint", "longtask", "resource"]) {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
      const observer = new PerformanceObserver(entries => {
        for (const entry of entries.getEntries()) { if (type === "largest-contentful-paint") data.lcp = entry.startTime; if (type === "longtask") data.slow += Math.max(0,entry.duration-50); }
        update();
      });
      observer.observe({ type, buffered: true }); observers.push(observer);
    }
    update(); return () => observers.forEach(observer=>observer.disconnect());
  }, []);
  return <aside className="nav-vitals" aria-label={lang === "id" ? "Performa halaman ini" : "This page's measured performance"}><span>LCP <b>{values?.lcp == null ? "—" : `${Math.round(values.lcp)}ms`}</b></span><span>SLOW <b>{values == null ? "—" : `${Math.round(values.slow)}ms`}</b></span><span>WIRE <b>{values == null ? "—" : `${Math.round(values.wire/1024)}kB`}</b></span></aside>;
}

export function Header({ lang, copy }: { lang: Locale; copy: Copy }) {
  const pathname = usePathname(), [mounted, setMounted] = useState(false), [ready, setReady] = useState(false), [phase, setPhase] = useState("closed");
  const [contact, setContact] = useState(false), [status, setStatus] = useState("");
  const intent = useRef(false), timeline = useRef<gsap.core.Timeline | null>(null), panel = useRef<HTMLDivElement>(null), overlay = useRef<HTMLDivElement>(null);
  const emailButton = useRef<HTMLButtonElement>(null), pendingContact = useRef(false);
  const desktopNav = useRef<HTMLElement>(null);
  const logo = useRef<HTMLAnchorElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () => { if (header.current) header.current.dataset.scrolled = String(window.scrollY > 8); };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);
  const attach = useCallback((node: HTMLDivElement | null) => { panel.current = node; setReady(Boolean(node)); }, []);
  const finishClosing = useCallback(() => { setPhase("closed"); setMounted(false); if (pendingContact.current) setContact(true); }, []);
  const links = [{ route: "about", label: copy.stage.about }, { route: "work", label: copy.nav[0], count: projects.length }, { route: "services", label: copy.stage.services, count: copy.services.length }, { route: "experiments", label: copy.experiments, count: 5 }, { route: "snippets", label: copy.snippets, count: 15 }];
  const other = lang === "id" ? "en" : "id", switchPath = pathname.replace(/^\/(id|en)(?=\/|$)/, `/${other}`);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add({ reduced: "(prefers-reduced-motion: reduce)", all: "all" }, context => {
      const link = logo.current!, letters = link.querySelectorAll("span");
      let hovered = link.matches(":hover") && matchMedia("(hover: hover) and (pointer: fine)").matches;
      let focused = link === document.activeElement, engaged = hovered || focused;
      let bounce: gsap.core.Tween | undefined;
      let colour: gsap.core.Tween | undefined;
      const reduced = context.conditions?.reduced;
      gsap.set(letters, { y: 0, "--logo-progress": engaged ? "100%" : "0%" });
      const update = () => context.add(() => {
        const next = hovered || focused;
        if (next === engaged) return;
        engaged = next;
        bounce?.kill();
        colour?.kill();
        gsap.killTweensOf(letters);
        colour = gsap.to(letters, { "--logo-progress": next ? "100%" : "0%", duration: reduced ? 0 : .3, stagger: next && !reduced ? .06 : 0, ease: "nav-colour" });
        if (next && !reduced) bounce = gsap.to(letters, { keyframes: [{ y: -6, duration: .18 }, { y: 2, duration: .12 }, { y: -2, duration: .1 }, { y: 0, duration: .15 }], stagger: .06, ease: "power2.inOut" });
        else gsap.to(letters, { y: 0, duration: reduced ? 0 : .18, ease: "power2.out" });
      });
      const enter = () => { if (matchMedia("(hover: hover) and (pointer: fine)").matches) { hovered = true; update(); } };
      const leave = () => { hovered = false; update(); };
      const focus = () => { focused = true; update(); };
      const blur = () => { focused = false; update(); };
      link.addEventListener("pointerenter", enter); link.addEventListener("pointerleave", leave);
      link.addEventListener("focus", focus); link.addEventListener("blur", blur);
      return () => { link.removeEventListener("pointerenter", enter); link.removeEventListener("pointerleave", leave); link.removeEventListener("focus", focus); link.removeEventListener("blur", blur); };
    }, logo);
    return () => mm.revert();
  }, [pathname]);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add({ reduced: "(prefers-reduced-motion: reduce)", all: "all" }, context => {
      const listeners: (() => void)[] = [];
      desktopNav.current!.querySelectorAll<HTMLAnchorElement>("a").forEach(link => {
        const count = link.querySelector("sup"), active = link.getAttribute("aria-current") === "page";
        let hovered = link.matches(":hover") && matchMedia("(hover: hover) and (pointer: fine)").matches;
        let focused = link === document.activeElement;
        const duration = context.conditions?.reduced ? 0 : .3;
        gsap.set(link, { "--nav-progress": active || hovered || focused ? "100%" : "0%" });
        if (count) gsap.set(count, { opacity: active || hovered || focused ? 1 : 0, y: active || hovered || focused ? 0 : 4 });
        const update = () => context.add(() => {
          const visible = active || hovered || focused;
          gsap.to(link, { "--nav-progress": visible ? "100%" : "0%", duration, ease: "nav-colour", overwrite: true });
          if (count) gsap.to(count, { opacity: visible ? 1 : 0, y: visible ? 0 : 4, duration: visible ? duration : 0, ease: "nav-count", overwrite: true });
        });
        const enter = () => { if (matchMedia("(hover: hover) and (pointer: fine)").matches) { hovered = true; update(); } };
        const leave = () => { hovered = false; update(); };
        const focus = () => { focused = true; update(); };
        const blur = () => { focused = false; update(); };
        link.addEventListener("pointerenter", enter); link.addEventListener("pointerleave", leave);
        link.addEventListener("focus", focus); link.addEventListener("blur", blur);
        listeners.push(() => { link.removeEventListener("pointerenter", enter); link.removeEventListener("pointerleave", leave); link.removeEventListener("focus", focus); link.removeEventListener("blur", blur); });
      });
      return () => listeners.forEach(remove => remove());
    }, desktopNav);
    return () => mm.revert();
  }, [pathname]);
  function request(open: boolean) {
    intent.current = open;
    if (open && !mounted) { setPhase("opening"); setMounted(true); return; }
    if (!open && (!timeline.current || timeline.current.progress() === 0)) { finishClosing(); return; }
    setPhase(open ? "opening" : "closing");
    if (open) timeline.current?.play(); else timeline.current?.reverse();
  }
  useLayoutEffect(() => {
    if (!mounted || !ready) return;
    const ctx = gsap.context(() => {
      const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? .001 : .45;
      timeline.current = gsap.timeline({ paused: true, onComplete: () => setPhase("open"), onReverseComplete: finishClosing })
        .fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration }, 0)
        .fromTo(panel.current, { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration, ease: "power3.out" }, 0);
      if (intent.current) timeline.current.play(); else finishClosing();
    });
    return () => { timeline.current = null; ctx.revert(); };
  }, [mounted, ready, finishClosing]);
  useLayoutEffect(() => {
    const media = matchMedia("(min-width: 1024px)");
    const change = () => { if (media.matches) request(false); };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  });
  function openContact() {
    setStatus("");
    if (mounted) { pendingContact.current = true; request(false); }
    else setContact(true);
  }
  async function copyEmail() {
    try { if (profile.email) { await navigator.clipboard.writeText(profile.email); setStatus(copy.stage.copied); } }
    catch { setStatus(copy.stage.copyError); }
  }
  const navigation = (mobile = false) => <nav ref={mobile ? undefined : desktopNav} className={mobile ? "menu-links" : "desktop-nav"} aria-label={copy.navLabel}>{links.map(link => <Link key={link.route} data-route={link.route} href={`/${lang}/${link.route}`} aria-current={pathname === `/${lang}/${link.route}` ? "page" : undefined} onClick={() => { if (mobile) request(false); }}>{link.label.toLowerCase()}{link.count !== undefined && <sup>{link.count}</sup>}</Link>)}</nav>;
  return <header ref={header} className={`site-header${pathname === `/${lang}` ? " is-home" : ""}`}><div className="header-inner">
    <Link ref={logo} className="wordmark" href={`/${lang}`} aria-label={`Abex — ${copy.stage.home}`}>{[..."abex"].map((letter,i)=><span key={i} aria-hidden="true">{letter}</span>)}</Link>
    <Vitals lang={lang}/>
    {navigation()}
    <div className="header-actions">{!mounted&&<><ThemeToggle copy={copy}/><nav className="language-switch" aria-label={copy.language}><span aria-current="page">{lang.toUpperCase()}</span><Link href={switchPath} lang={other} hrefLang={other}>{other.toUpperCase()}</Link></nav></>}<button ref={emailButton} className="hire-button" aria-haspopup="dialog" aria-expanded={contact} aria-controls="hire-contact" onClick={openContact}>{copy.hire}<span aria-hidden="true">&#8599;</span></button><noscript><a className="hire-button" href={`mailto:${profile.email}`}>{copy.hire}</a></noscript>
    <Sheet open={mounted} onOpenChange={request}><SheetTrigger asChild><button className="menu-trigger icon-control" aria-label={copy.menu}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button></SheetTrigger><SheetPortal><SheetOverlay ref={overlay} className="menu-overlay"/><SheetContent ref={attach} className="menu-panel" data-state={phase} aria-describedby="menu-description" onEscapeKeyDown={e=>{e.preventDefault();request(false);}} onPointerDownOutside={e=>{e.preventDefault();request(false);}} onCloseAutoFocus={e=>{if(pendingContact.current){e.preventDefault();}else if(matchMedia("(min-width: 1024px)").matches){e.preventDefault();document.querySelector<HTMLAnchorElement>(pathname === `/${lang}` ? ".site-header .wordmark" : ".desktop-nav a")?.focus();}}}><div className="menu-top"><SheetTitle>{copy.menu}</SheetTitle><button className="icon-control" aria-label={copy.close} onClick={()=>request(!intent.current)}>×</button></div><SheetDescription id="menu-description" className="sr-only">{copy.navLabel}</SheetDescription><Link className="menu-home" href={`/${lang}`} onClick={()=>request(false)}>{copy.stage.home.toLowerCase()}<sup>hi</sup></Link>{navigation(true)}<div className="menu-settings"><ThemeToggle copy={copy}/><nav className="language-switch" aria-label={copy.language}><span aria-current="page">{lang.toUpperCase()}</span><Link href={switchPath} lang={other} hrefLang={other} onClick={()=>request(false)}>{other.toUpperCase()}</Link></nav></div><div className="menu-contact"><button className="hire-button" onClick={openContact}>{copy.hire}<span aria-hidden="true">&#8599;</span></button></div></SheetContent></SheetPortal></Sheet>
    </div>
    <Sheet open={contact} onOpenChange={setContact}><SheetPortal><SheetOverlay className="hire-overlay"/><SheetContent id="hire-contact" className="hire-panel" aria-describedby="hire-description" onCloseAutoFocus={event=>{event.preventDefault(); const fromMenu = pendingContact.current; pendingContact.current = false; if(fromMenu && matchMedia("(max-width: 1023px)").matches) document.querySelector<HTMLButtonElement>(".menu-trigger")?.focus(); else emailButton.current?.focus();}}>
      <button className="icon-control hire-close" aria-label={copy.closeContact} onClick={()=>setContact(false)}>&#215;</button>
      <SheetTitle>{copy.hireTitle}</SheetTitle><SheetDescription id="hire-description">{copy.hireDescription}</SheetDescription>
      <div className="hire-options">
        {profile.whatsapp && <a className="hire-option hire-primary" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer"><span className="hire-icon"><Image src="/icons/social/whatsapp.svg" width={24} height={24} alt="" unoptimized/></span><span className="hire-details">{copy.whatsapp}<small>+{profile.whatsapp}</small></span><span aria-hidden="true">&#8599;</span></a>}
        {profile.email && <div className="hire-email"><a className="hire-option" href={`mailto:${profile.email}`}><span className="hire-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="m3 6 9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg></span><span className="hire-details">{copy.email}<small>{profile.email}</small></span><span aria-hidden="true">&#8599;</span></a><button className="icon-control" aria-label={copy.stage.copy} onClick={copyEmail}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h12v13H8ZM4 17H3V3h13v1" fill="none" stroke="currentColor" strokeWidth="2"/></svg></button></div>}
        {profile.social.filter(link=>link.label === "GitHub").map(link=><a key={link.url} className="hire-option" href={link.url} target="_blank" rel="noopener noreferrer"><span className="hire-icon"><Image src="/icons/social/github.svg" width={24} height={24} alt="" unoptimized/></span><span className="hire-details">{link.label}<small>{link.url.split("/").pop()}</small></span><span aria-hidden="true">&#8599;</span></a>)}
      </div>{status&&<p className="hire-feedback" role="status">{status}</p>}
    </SheetContent></SheetPortal></Sheet>
    <div id="contact-bar" className="contact-bar"><a href={profile.email?`mailto:${profile.email}`:undefined}>{profile.email??copy.unavailable}</a><button className="icon-control" aria-label={copy.stage.copy} onClick={copyEmail}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h12v13H8ZM4 17H3V3h13v1" fill="none" stroke="currentColor" strokeWidth="2"/></svg></button>{status&&!contact&&<span className="contact-feedback" role="status">{status}</span>}</div>
    <noscript><style>{`.menu-trigger,.contact-bar button,button.hire-button{display:none}.stage-portal:hover,.stage-portal:focus-visible{background:var(--portal-colour)}`}</style><nav className="no-js-navigation">{links.map(link=><a key={link.route} href={`/${lang}/${link.route}`}>{link.label}</a>)}<a className="no-js-locale" href={switchPath} lang={other}>{other.toUpperCase()}</a></nav></noscript>
  </div></header>;
}
