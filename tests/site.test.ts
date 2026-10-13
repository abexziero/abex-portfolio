import { test } from "node:test";
import assert from "node:assert/strict";
import { siteSettings } from "../src/lib/site.ts";

test("preview stays noindex and release needs a real HTTPS origin", () => {
  assert.deepEqual(siteSettings({}), { url: "https://portfolio.invalid", indexable: false });
  assert.equal(siteSettings({ SITE_URL: "https://abex.pages.dev" }).indexable, false);
  assert.equal(siteSettings({ SITE_URL: "https://abex.pages.dev", PORTFOLIO_RELEASE: "1" }).indexable, true);
  assert.equal(siteSettings({ SITE_URL: "https://abex.pages.dev", PORTFOLIO_RELEASE: "1", CF_PAGES_BRANCH: "feature" }).indexable, false);
  for (const url of ["http://abex.pages.dev", "https://abex.pages.dev/path", "https://user:pass@abex.pages.dev", "https://portfolio.invalid", "https://localhost"]) {
    assert.throws(() => siteSettings({ SITE_URL: url, PORTFOLIO_RELEASE: "1" }), /SITE_URL/);
  }
  assert.throws(() => siteSettings({ PORTFOLIO_RELEASE: "1" }), /SITE_URL/);
});
