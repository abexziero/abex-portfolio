import { test, expect } from "@playwright/test";

for (const [route, count] of [["work", 3], ["experiments", 3], ["snippets", 3]] as const) {
  test(`${route}: interacting during entry never leaves cards transparent`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    for (const lang of ["id", "en"]) {
      await page.goto(`/${lang}/${route}`);
      const cards = page.locator(".card-fan > .fan-card");
      await expect(cards).toHaveCount(count);
      // Interrupt the entrance before its staggered opacity tween finishes.
      await expect(cards.first()).toHaveCSS("opacity", "0");
      await cards.first().dispatchEvent("pointerenter");
      await cards.last().focus();
      await page.clock.runFor(100);
      await cards.first().dispatchEvent("pointerleave");
      await cards.last().evaluate(element => (element as HTMLElement).blur());
      await page.clock.runFor(1600);
      for (const card of await cards.all()) await expect(card).toHaveCSS("opacity", "1");
      await page.setViewportSize({ width: 375, height: 812 });
      for (const card of await cards.all()) await expect(card).toHaveCSS("opacity", "1");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 1440, height: 900 });
      for (const card of await cards.all()) await expect(card).toHaveCSS("opacity", "1");
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.clock.runFor(1600);
      for (const card of await cards.all()) await expect(card).toHaveCSS("opacity", "1");
    }
  });
}
