import { profile, type Copy } from "@/lib/content";
import { Arrow } from "@/components/arrow";
export function Contact({ copy }: { copy: Copy }) {
  return <section id="contact" className="contact-section section-space">
    <p className="eyebrow">{copy.contactEyebrow}</p>
    <div className="contact-grid"><h2>{copy.contactTitle}<br /><span className="text-primary">{copy.contactAccent}</span><Arrow diagonal /></h2><div className="contact-details"><p>{copy.contactText}</p>
      {([{ label: copy.email, href: profile.email ? `mailto:${encodeURIComponent(profile.email)}` : null, value: profile.email }, { label: copy.whatsapp, href: profile.whatsapp ? `https://wa.me/${profile.whatsapp}` : null, value: profile.whatsapp }, { label: "GitHub", href: profile.social.find(link => link.label === "GitHub")?.url ?? null, value: "github.com/abexziero" }] as const).map(item => <div className="contact-row" key={item.label}><span>{item.label}</span>{item.href ? <a href={item.href} {...(item.href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{item.value}<Arrow diagonal /></a> : <span className="contact-placeholder">{copy.unavailable}</span>}</div>)}
    </div></div>
  </section>;
}
