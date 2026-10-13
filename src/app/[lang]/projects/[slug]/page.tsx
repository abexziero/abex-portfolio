import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, projects, ui } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Arrow } from "@/components/arrow";
import { Contact } from "@/components/contact";
type Props = { params: Promise<{ lang: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params; const project = projects.find(p => p.slug === slug);
  if (!isLocale(lang) || !project) notFound(); return pageMetadata(lang, slug, project.title);
}
export default async function CaseStudy({ params }: Props) {
  const { lang, slug } = await params; const project = projects.find(p => p.slug === slug);
  if (!isLocale(lang) || !project) notFound(); const copy = ui[lang]; const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <><section className="case-hero section-space"><Link className="back-link" href={`/${lang}/work`}><span aria-hidden="true">←</span>{copy.back}</Link><div className="case-title"><div><p className="eyebrow">{project.category[lang]} / {project.year}</p><h1>{project.title}<span className="text-primary">.</span></h1></div><Badge>{project.status[lang]}</Badge></div><p className="case-summary">{project.summary[lang]}</p><p className="small-label">{copy.demoNotice}</p><div className="case-facts"><div><span className="eyebrow">{copy.role}</span><p>{project.role[lang]}</p></div><div><span className="eyebrow">{copy.stack}</span><div className="tech-badges">{project.tech.map(tech => <Badge key={tech}>{tech}</Badge>)}</div></div><div><span className="eyebrow">{copy.year}</span><p>{project.year} / {copy.projectType}</p></div></div></section>
    <section className="case-gallery section-space"><h2 className="eyebrow">{copy.gallery}</h2><Carousel copy={copy} count={project.images.length}>{project.images.map((image, i) => <div key={image.src} className="carousel-slide" role="group" aria-roledescription="slide" aria-label={`${copy.slide} ${i + 1} ${copy.of} ${project.images.length}`}><div><Image src={image.src} alt={image.alt[lang]} width={image.width} height={image.height} priority={i === 0} sizes="(max-width: 768px) 92vw, 85vw" /></div></div>)}</Carousel></section>
    <section className="case-body section-space">{([{ title: copy.overview, text: project.summary[lang] }, { title: copy.problem, text: project.problem[lang] }, { title: copy.approachHeading, text: project.approach[lang] }, { title: copy.results, text: project.results[lang] }]).map((section, i) => <div className="case-text-row" key={section.title}><h2><span>0{i + 1}</span>{section.title}</h2><p>{section.text}</p></div>)}<div className="case-external">{project.demo && <Button asChild><a href={project.demo} target="_blank" rel="noopener noreferrer">{copy.demoLink}<Arrow diagonal /></a></Button>}{project.code && <Button asChild variant="outline"><a href={project.code} target="_blank" rel="noopener noreferrer">{copy.codeLink}<Arrow diagonal /></a></Button>}{!project.demo && !project.code && <p className="text-muted-foreground">{copy.noLinks}</p>}</div></section>
    <section className="next-project section-space"><span className="eyebrow">{copy.nextProject}</span><Link href={`/${lang}/projects/${next.slug}`}>{next.title}<Arrow diagonal /></Link></section><Contact copy={copy} /></>;
}
