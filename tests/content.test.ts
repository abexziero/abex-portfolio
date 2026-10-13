import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContent } from "../src/lib/validate-content.ts";

const valid = () => ({
  profile: { name: { id: "Nama", en: "Name" }, email: null, whatsapp: null, domain: null, social: [] },
  ui: { id: { title: "Karya", nested: { label: "Lanjut" } }, en: { title: "Work", nested: { label: "Next" } } },
  projects: [{ slug: "demo", title: { id: "Demo", en: "Demo" }, images: [{ src: "/projects/demo.svg", alt: { id: "Tampilan", en: "Preview" } }], demo: null, code: "https://github.com/example/demo" }],
});
test("accepts complete bilingual content and absent contact placeholders", () => {
  assert.doesNotThrow(() => validateContent(valid(), () => true));
});
test("rejects duplicate and unsafe slugs", () => {
  const data = valid(); data.projects.push(data.projects[0]);
  assert.throws(() => validateContent(data, () => true), /slug/i);
  data.projects.pop(); data.projects[0].slug = "../bad";
  assert.throws(() => validateContent(data, () => true), /slug/i);
});
test("rejects missing and empty translations", () => {
  const data = valid(); data.ui.en.nested.label = "";
  assert.throws(() => validateContent(data, () => true), /translation/i);
  const missing = valid(); delete (missing.ui.en as Partial<typeof missing.ui.en>).nested;
  assert.throws(() => validateContent(missing, () => true), /translation/i);
});
test("rejects absent and traversal assets", () => {
  assert.throws(() => validateContent(valid(), () => false), /asset/i);
  const data = valid(); data.projects[0].images[0].src = "/../secret";
  assert.throws(() => validateContent(data, () => true), /asset/i);
});
test("accepts local project screenshots but rejects unsafe raster paths", () => {
  for (const src of ["/projects/jelajanime.webp", "/projects/aplikasi-kasir.png"]) {
    const data = valid(); data.projects[0].images[0].src = src;
    assert.doesNotThrow(() => validateContent(data, () => true));
  }
  for (const src of ["/projects/../secret.png", "https://example.com/image.png", "/projects/demo.exe"]) {
    const data = valid(); data.projects[0].images[0].src = src;
    assert.throws(() => validateContent(data, () => true), /asset/i);
  }
});
test("rejects unsafe external URLs and invalid contact configuration", () => {
  const data = valid(); data.projects[0].code = "javascript:alert(1)";
  assert.throws(() => validateContent(data, () => true), /url/i);
  for (const profile of [{ email: "invalid" }, { whatsapp: "+62abc" }, { domain: "http://example.com" }]) {
    assert.throws(() => validateContent({ ...valid(), profile: { ...valid().profile, ...profile } }, () => true), /contact|domain/i);
  }
});
