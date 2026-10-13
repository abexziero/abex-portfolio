import { test, expect } from "@playwright/test";

test("demo code downloads only when its viewer opens", async ({ page, request }) => {
  const source = await request.get("/motion-source"); expect(source.status()).toBe(200);
  expect(await source.text()).toContain("export function MotionDemo");
  const downloads: string[] = []; page.on("request", r => { if (r.url().endsWith("/motion-source")) downloads.push(r.url()); });
  await page.goto("/en/snippets"); expect(downloads).toHaveLength(0);
  await expect(page.locator(".demo-source code")).not.toContainText("export function MotionDemo");
  await page.locator(".demo-source summary").click();
  await expect(page.locator(".demo-source code")).toContainText("export function MotionDemo");
  expect(downloads).toHaveLength(1);
});

test("new pages preserve metadata, mobile layout and no-JavaScript previews", async ({ page, browser, request }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const lang of ["id", "en"]) for (const route of ["work", "experiments", "snippets"]) {
    expect((await page.goto(`/${lang}/${route}`))?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/${lang}/${route}$`));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect((await request.get("/fr/snippets")).status()).toBe(404);
  const context = await browser.newContext({ javaScriptEnabled: false }); const native = await context.newPage();
  await native.goto("/en/snippets"); await expect(native.locator(".demo-list .demo-static-preview")).toHaveCount(15);
  await expect(native.locator(".demo-list .demo-static-preview").first()).toBeVisible();
  await expect(native.locator("canvas").first()).toBeHidden();
  await native.locator(".demo-index").getByRole("link", { name: "Text scramble", exact: true }).click(); await expect(native).toHaveURL(/#text-scramble$/);
  await context.close();
});

test("each of the fifteen demos animates and pause freezes its output", async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/en/snippets");
  const demos = page.locator(".motion-demo");
  for (let i = 0; i < 15; i++) {
    const demo = demos.nth(i), canvas = demo.locator("canvas");
    const frame = () => canvas.evaluate(el => { const data = (el as HTMLCanvasElement).toDataURL(); let hash = 0; for (let n = 0; n < data.length; n++) hash = ((hash << 5) - hash + data.charCodeAt(n)) | 0; return hash; });
    await demo.scrollIntoViewIfNeeded(); await expect(canvas).toBeVisible(); await canvas.click();
    await canvas.press("ArrowRight"); await canvas.press("ArrowDown");
    const initial = await frame();
    await canvas.press("ArrowLeft"); await canvas.press("Enter");
    await expect.poll(frame, { message: `demo ${i + 1} responds` }).not.toBe(initial);
    await demo.getByRole("button", { name: "Pause", exact: true }).click();
    await expect(demo.getByRole("button", { name: "Resume", exact: true })).toBeVisible();
    const frozen = await frame();
    await page.waitForTimeout(100);
    expect(await frame(), `demo ${i + 1} pauses`).toBe(frozen);
  }
  await page.goto("/en/experiments"); await expect(page.locator(".experiment-row")).toHaveCount(5);
  await page.locator(".experiment-row").first().click(); await expect(page).toHaveURL(/\/en\/snippets#text-scramble$/);
  expect(errors).toEqual([]);
});

test("desktop demo reacts to pointer, pause and reset", async ({ page }) => {
  await page.goto("/en/snippets");
  const demo = page.locator('[data-demo="spring-drag"]');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator("canvas")).toBeVisible();
  const canvas = demo.locator("canvas");
  const before = await canvas.evaluate(el => (el as HTMLCanvasElement).toDataURL());
  await canvas.hover({ position: { x: 80, y: 80 } });
  await page.mouse.down(); await page.mouse.move(220, 180); await page.mouse.up();
  await expect.poll(() => canvas.evaluate(el => (el as HTMLCanvasElement).toDataURL())).not.toBe(before);
  await demo.getByRole("button", { name: "Pause" }).click();
  await expect(demo.getByRole("button", { name: "Resume" })).toHaveAttribute("aria-pressed", "true");
  await demo.getByRole("button", { name: "Reset" }).click();
  await expect(demo.getByRole("button", { name: "Resume" })).toBeVisible();
});

test("touch and reduced motion expose static previews without overflow", async ({ browser }) => {
  for (const width of [375, 768]) {
    const context = await browser.newContext({ viewport: { width, height: 812 }, hasTouch: true, isMobile: true });
    const page = await context.newPage(); await page.goto("/id/snippets");
    await expect(page.locator(".demo-list .demo-controls").first()).toBeHidden();
    await expect(page.locator(".pointer-notice")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await context.close();
  }
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage(); await page.goto("/en/snippets");
  await expect(page.locator(".demo-list .demo-controls").first()).toBeHidden();
  await expect(page.locator(".motion-demo")).toHaveCount(15);
  await context.close();
});
