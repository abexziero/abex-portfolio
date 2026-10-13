import { notFound } from "next/navigation";
import { isLocale, ui } from "@/lib/content";
import { motionCatalog, demoDescription } from "@/lib/motion-catalog";
import { pageMetadata } from "@/lib/metadata";
import { MotionDemo } from "@/components/motion-demo";
import { MotionSource } from "@/components/motion-source";
import { CardFan } from "@/components/card-fan";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) { const { lang } = await params; if (!isLocale(lang)) notFound(); return pageMetadata(lang, undefined, ui[lang].motionTitle, "/snippets"); }
export default async function Snippets({ params }: Props) {
  const { lang } = await params; if (!isLocale(lang)) notFound(); const copy = ui[lang];
  return <div className="reference-page snippets-page section-space"><CardFan>{(["path-editor", "shape-pit", "text-scramble"] as const).map(slug=><a href={`#${slug}`} key={slug} className="fan-card fan-demo"><h2>{motionCatalog.find(d=>d.slug===slug)!.title}</h2><div inert aria-hidden="true"><MotionDemo slug={slug} copy={copy}/></div></a>)}</CardFan><header className="reference-page-heading"><h1>{copy.motionTitle}</h1><p>{copy.motionIntro}</p><p className="pointer-notice">{copy.pointerNotice}</p></header><nav className="demo-index" aria-label={copy.snippets}>{motionCatalog.map(demo => <a key={demo.slug} href={`#${demo.slug}`}>{demo.title}</a>)}</nav><div className="demo-list">{motionCatalog.map((demo, i) => <section id={demo.slug} data-demo={demo.slug} className="motion-demo" key={demo.slug}><div className="demo-description"><p className="eyebrow">{String(i + 1).padStart(2, "0")} / {copy.experiments}</p><h2>{demo.title}</h2><p>{demoDescription(demo, lang)}</p><p className="demo-instructions">{copy.motionHint}</p><a className="text-link" href="#engine-source">{copy.demoCode}<span aria-hidden="true">↗</span></a></div><MotionDemo slug={demo.slug} copy={copy} /></section>)}</div><MotionSource copy={copy} /></div>;
}
