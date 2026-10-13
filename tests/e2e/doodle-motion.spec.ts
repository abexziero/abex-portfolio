import { test, expect } from "@playwright/test";

test("doodle parallax is bounded, resets and stays static on mobile or reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/id");
  await page.locator(".theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const offset = () => page.evaluate(() => {
    const right = new DOMMatrix(getComputedStyle(document.body, "::before").transform);
    const left = new DOMMatrix(getComputedStyle(document.body, "::after").transform);
    return { x: right.e, y: right.f, left: left.e };
  });
  await page.mouse.move(1200, 800);
  await expect.poll(async () => (await offset()).x).toBeGreaterThan(2);
  const moved = await offset();
  expect(Math.abs(moved.x)).toBeLessThanOrEqual(5);
  expect(Math.abs(moved.y)).toBeLessThanOrEqual(4);
  expect(moved.left).toBeLessThan(0);
  await page.evaluate(() => document.documentElement.dispatchEvent(new PointerEvent("pointerleave")));
  await expect.poll(async () => Math.abs((await offset()).x)).toBeLessThan(.01);
  await page.mouse.move(1300, 900);
  await expect.poll(async () => (await offset()).x).toBeGreaterThan(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(async () => (await offset()).x).toBe(0);
  await page.mouse.move(1100, 700);
  expect((await offset()).x).toBe(0);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(350, 700);
  expect((await offset()).x).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("right doodle leaves room around the bio across languages and viewports", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const lang of ["id", "en"]) {
    for (const [width, height] of [[375, 812], [768, 900], [1024, 900], [1440, 1000], [1024, 600]]) {
      await page.setViewportSize({ width, height }); await page.goto(`/${lang}`);
      await page.evaluate(() => document.fonts.ready);
      const clearance = await page.evaluate(async () => {
        const image = new Image(); image.src = "/images/pt-doodle.webp"; await image.decode();
        const style = getComputedStyle(document.body, "::before");
        const aspect = image.naturalWidth / image.naturalHeight;
        const artWidth = Math.min(parseFloat(style.width), parseFloat(style.height) * aspect);
        const artHeight = artWidth / aspect;
        const bio = document.querySelector(".stage-bio")!.getBoundingClientRect();
        return Math.max(innerWidth - parseFloat(style.right) - artWidth - bio.right,
          innerHeight - parseFloat(style.bottom) - artHeight - bio.bottom);
      });
      expect(clearance, `${lang} ${width}x${height}`).toBeGreaterThanOrEqual(20);
    }
  }
});
