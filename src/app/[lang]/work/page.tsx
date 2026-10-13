import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, projects, ui } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { CardFan } from "@/components/card-fan";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) { const { lang } = await params; if (!isLocale(lang)) notFound(); return pageMetadata(lang, undefined, ui[lang].nav[0], "/work"); }
export default async function Work({ params }: Props) {
  const { lang } = await params; if (!isLocale(lang)) notFound(); const copy = ui[lang];
  return <div className="reference-page work-page section-space"><CardFan>{projects.map((project,i)=><Link href={`/${lang}/projects/${project.slug}`} className={`fan-card fan-colour-${i}`} key={project.slug}><span className="fan-status">{project.status[lang]}</span><div className="fan-content"><h2>{project.title.toLowerCase()}</h2><p>{project.summary[lang]}</p><div className="tech-tags">{project.tech.map(tech=><span key={tech}>{tech}</span>)}</div></div></Link>)}</CardFan><header className="reference-page-heading"><h1>{lang === "id" ? "karya terpilih" : "selected work"}</h1><p>{copy.workText}</p></header></div>;
}
