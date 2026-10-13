type Profile = { email: string | null; whatsapp: string | null; domain: string | null; social: { url: string }[] };
type Content = { profile: Profile; ui: { id: unknown; en: unknown }; projects: { slug: string; images: { src: string }[]; demo: string | null; code: string | null }[] };

function translatedPair(id: unknown, en: unknown, path: string) {
  if (typeof id === "string" && typeof en === "string" && id.trim() && en.trim()) return;
  if (id && en && typeof id === "object" && typeof en === "object") {
    const a = id as Record<string, unknown>, b = en as Record<string, unknown>;
    if (Object.keys(a).length !== Object.keys(b).length) throw new Error(`Missing translation: ${path}`);
    for (const key of Object.keys(a)) translatedPair(a[key], b[key], `${path}.${key}`);
    return;
  }
  throw new Error(`Missing translation: ${path}`);
}

export function validateContent(data: Content, assetExists: (path: string) => boolean) {
  translatedPair(data.ui.id, data.ui.en, "ui");
  function walk(value: unknown, path: string) {
    if (!value || typeof value !== "object") return;
    const object = value as Record<string, unknown>;
    if ("id" in object || "en" in object) translatedPair(object.id, object.en, path);
    else for (const [key, item] of Object.entries(object)) walk(item, `${path}.${key}`);
  }
  walk(data.profile, "profile");
  const slugs = new Set<string>();
  const safeUrl = (value: string) => {
    try {
      const url = new URL(value);
      if (url.protocol === "https:" && !url.username && !url.password && url.hostname) return;
    } catch { /* Fall through to a readable build error. */ }
    throw new Error(`Invalid HTTPS URL: ${value}`);
  };
  for (const project of data.projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) || slugs.has(project.slug)) throw new Error(`Invalid/duplicate slug: ${project.slug}`);
    slugs.add(project.slug); walk(project, project.slug);
    if (!project.images.length) throw new Error(`Missing asset: ${project.slug}`);
    for (const image of project.images) {
      if (!/^\/projects\/[a-z0-9-]+\.(?:svg|png|jpg|webp)$/.test(image.src) || !assetExists(image.src)) throw new Error(`Invalid/missing asset: ${image.src}`);
    }
    for (const url of [project.demo, project.code]) if (url !== null) safeUrl(url);
  }
  const { email, whatsapp, domain, social } = data.profile;
  if (email !== null && !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email)) throw new Error("Invalid email contact");
  if (whatsapp !== null && !/^[1-9]\d{7,14}$/.test(whatsapp)) throw new Error("Invalid WhatsApp contact (international digits only)");
  if (domain !== null) {
    try { safeUrl(domain); } catch { throw new Error("Invalid domain"); }
    const url = new URL(domain);
    if (url.pathname !== "/" || url.search || url.hash) throw new Error("Invalid domain: use an HTTPS origin");
  }
  for (const link of social) safeUrl(link.url);
}
