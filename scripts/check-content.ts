import { existsSync } from "node:fs";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { heroArtwork, technologyIcons, socialIcons, locales, profile, projects, ui } from "../src/lib/content.ts";
import { validateContent } from "../src/lib/validate-content.ts";
import { motionCatalog } from "../src/lib/motion-catalog.ts";
import { siteSettings } from "../src/lib/site.ts";
const site = siteSettings();
validateContent({ profile, projects, ui }, (path) => existsSync(resolve("public", `.${path}`)));
assert(/^\/images\/[a-z0-9-]+\.(?:jpg|png)$/.test(heroArtwork.src) && existsSync(resolve("public", `.${heroArtwork.src}`)), "Missing/unsafe hero artwork");
assert(locales.every(locale => heroArtwork.alt[locale]?.trim()), "Missing hero artwork translation");
assert(heroArtwork.width > 0 && heroArtwork.height > 0, "Invalid portrait dimensions");
for (const slug of Object.values(socialIcons)) assert(/^[a-z0-9]+$/.test(slug) && existsSync(resolve(`public/icons/social/${slug}.svg`)), `Missing/unsafe social icon: ${slug}`);
for (const lang of locales) for (const group of ui[lang].skillGroups) for (const skill of group.items) {
  const slug = technologyIcons[skill];
  assert(slug && /^[a-z0-9]+$/.test(slug) && existsSync(resolve(`public/icons/technology/${slug}.svg`)), `Missing/unsafe technology icon: ${skill}`);
}
assert(existsSync(resolve("public/images/pt-doodle.webp")), "Missing decorative background artwork");
assert(existsSync(resolve("public/images/developer-doodle-hand.webp")), "Missing developer background artwork");
assert(existsSync(resolve("public/images/cursor-butter.svg")), "Missing custom cursor artwork");
assert.equal(motionCatalog.length, 15, "Expected 15 motion demos");
assert.equal(new Set(motionCatalog.map(demo => demo.slug)).size, motionCatalog.length, "Duplicate motion slug");
assert(motionCatalog.every(demo => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(demo.slug) && demo.title.trim() && locales.every(locale => demo[locale].trim())), "Missing/invalid motion content");
if (process.argv.includes("--release") && (!profile.verified || site.url === "https://portfolio.invalid" || (!profile.email && !profile.whatsapp) || projects.some(project => project.placeholder))) {
  throw new Error("Publication blocked: verify identity, real project materials, contacts and HTTPS domain first.");
}
console.log(`Content OK: ${projects.length} projects, ID/EN, assets and URLs validated.`);
