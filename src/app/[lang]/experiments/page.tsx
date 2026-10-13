import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, ui } from "@/lib/content";
import { motionCatalog, demoDescription } from "@/lib/motion-catalog";
import { pageMetadata } from "@/lib/metadata";
import { CardFan } from "@/components/card-fan";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) { const { lang } = await params; if (!isLocale(lang)) notFound(); return pageMetadata(lang, undefined, ui[lang].experiments, "/experiments"); }
export default async function Experiments({ params }: Props) {
  const { lang } = await params; if (!isLocale(lang)) notFound(); const copy = ui[lang];
  const selected = ["text-scramble", "path-editor", "text-pressure", "cloth-pluck", "metaballs"].map(slug=>motionCatalog.find(d=>d.slug===slug)!);
  return <div className="reference-page experiments-page section-space"><CardFan>{selected.slice(0,3).map((demo,i)=><Link key={demo.slug} href={`/${lang}/snippets#${demo.slug}`} className={`fan-card fan-warm-${i}`}><span className="fan-status">{copy.projectType}</span><div className="fan-content"><h2>{demo.title.toLowerCase()}</h2><p>{demoDescription(demo,lang)}</p><div className="tech-tags"><span>GSAP</span><span>TypeScript</span><span>Canvas</span></div></div></Link>)}</CardFan><header className="reference-page-heading"><h1>{copy.experiments.toLowerCase()}</h1><p>{copy.experimentsIntro}</p></header><div className="experiment-list">{selected.map((demo,i)=><Link className="experiment-row" key={demo.slug} href={`/${lang}/snippets#${demo.slug}`}><span className="experiment-glyph" aria-hidden="true">{["Aa","∿","↔","⠿","●"][i]}</span><div><h2>{demo.title}</h2><p>{demoDescription(demo,lang)}</p></div><span aria-hidden="true">↗</span></Link>)}</div></div>;
}
