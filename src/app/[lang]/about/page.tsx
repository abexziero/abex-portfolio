import Image from "next/image";
import { notFound } from "next/navigation";
import { heroArtwork, technologyIcons, socialIcons, isLocale, profile, ui } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) { const { lang } = await params; if (!isLocale(lang)) notFound(); return pageMetadata(lang, undefined, ui[lang].stage.about, "/about"); }
export default async function About({ params }: Props) {
  const { lang } = await params; if (!isLocale(lang)) notFound(); const copy = ui[lang];
  const contacts = [
    { label: copy.email, value: profile.email, href: profile.email ? `mailto:${profile.email}` : null },
    { label: copy.whatsapp, value: profile.whatsapp ? `+${profile.whatsapp}` : null, href: profile.whatsapp ? `https://wa.me/${profile.whatsapp}` : null },
    { label: "GitHub", value: "abexziero", href: profile.social.find(link => link.label === "GitHub")?.url },
  ];
  return <article className="about-page section-space">
    <header><p className="about-pill"><span aria-hidden="true"/>{copy.aboutLabel}</p><h1 aria-label="Abex">{"Abex".split("").map((letter,i)=><span aria-hidden="true" key={i}>{letter}</span>)}</h1></header>
    <div className="about-detail">
      <figure className="about-portrait"><Image src={heroArtwork.src} alt={heroArtwork.alt[lang]} width={heroArtwork.width} height={heroArtwork.height} sizes="(max-width: 1023px) 320px, (max-width: 1440px) 28vw, 400px"/></figure>
      <div className="about-profile">
        <div className="about-bio">{profile.bio[lang].split(/ (?=Menggunakan|Using)/).map(paragraph=><p key={paragraph}>{paragraph.split(/(Fullstack Developer|React|Next\.js|Flutter|API)/g).map((text,i)=>/^(Fullstack Developer|React|Next\.js|Flutter|API)$/.test(text)?<span className="about-highlight" key={i}>{text}</span>:text)}</p>)}</div>
        <p className="about-location">{profile.location[lang]}</p><p className="about-learning">{profile.learning[lang]}</p>
        <section className="about-skills" aria-labelledby="skills-title"><h2 id="skills-title">{copy.skillLabel}</h2><div className="about-skill-groups">{copy.skillGroups.map(group=><div className="about-skill-group" key={group.title}><h3>{group.title}</h3><div className="tech-badges">{group.items.map(skill=><span className="about-skill" key={skill}><span className="about-skill-icon"><Image src={`/icons/technology/${technologyIcons[skill]}.svg`} width={24} height={24} alt="" aria-hidden="true" unoptimized/></span><span>{skill}</span></span>)}</div></div>)}</div></section>
        <section className="about-contact" aria-labelledby="about-contact-title"><h2 id="about-contact-title">{copy.contact}</h2><div className="about-primary-links">{contacts.map(link=>link.href?<a key={link.label} href={link.href} {...(link.href.startsWith("https://")?{target:"_blank",rel:"noopener noreferrer"}:{})}><span>{link.label}<small>{link.value}</small></span><span aria-hidden="true">↗</span></a>:null)}</div><p className="about-social-label">{copy.socialLabel}</p><nav className="about-social-links" aria-label={copy.socialLabel}>{profile.social.filter(link=>link.label!=="GitHub").map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"><span className="about-social-icon"><Image src={`/icons/social/${socialIcons[link.label]}.svg`} width={18} height={18} alt="" aria-hidden="true" unoptimized/></span><span>{link.label}</span></a>)}</nav></section>
      </div>
    </div>
  </article>;
}
