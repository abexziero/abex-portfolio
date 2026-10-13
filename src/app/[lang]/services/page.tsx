import { notFound } from "next/navigation";
import { isLocale, ui } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return pageMetadata(lang, undefined, ui[lang].servicesPageTitle, "/services");
}
export default async function Services({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = ui[lang];
  return <article className="reference-page services-page section-space">
    <header className="reference-page-heading"><h1>{copy.servicesPageTitle.toLowerCase()}</h1><p>{copy.servicesPageIntro}</p></header>
    <section aria-label={copy.nav[1]} className="service-grid">
      {copy.services.map((service, i) => <article className="service-card" key={service.title}>
        <span className="service-number" aria-hidden="true">0{i + 1}</span>
        <h2>{service.title}</h2><p>{service.text}</p>
        <div className="tech-tags">{service.tags.split(" / ").map(tag => <span key={tag}>{tag}</span>)}</div>
      </article>)}
    </section>
    <section className="service-process" aria-labelledby="process-title">
      <h2 id="process-title">{copy.approachLabel}</h2>
      <ol>{copy.approach.map((step, i) => <li className="process-step" key={step.title}><span className="process-node" aria-hidden="true">0{i + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
    </section>
  </article>;
}
