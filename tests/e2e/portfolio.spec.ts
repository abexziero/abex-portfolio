import { test, expect } from "@playwright/test";

test("theme stays usable with blocked storage and without JavaScript", async ({ page, browser }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked"); } });
  });
  await page.emulateMedia({ colorScheme: "light" }); await page.goto("/id");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator(".theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" }); await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: "light" });
  const native = await context.newPage(); await native.goto("/id");
  await expect(native.locator(".theme-toggle")).toBeHidden();
  expect(await native.locator("html").evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(13, 33, 24)");
  await native.getByRole("link", { name: "EN", exact: true }).click();
  await expect(native).toHaveURL(/\/en$/);
  await context.close();
});

test("forest theme is default, persists selection and adapts mobile controls", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  await page.emulateMedia({ colorScheme: "light" }); await page.goto("/id");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const toggle = page.locator(".theme-toggle");
  await toggle.focus(); await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-label", "Aktifkan mode gelap");
  await page.reload(); await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page.locator(".theme-toggle")).toHaveAttribute("aria-label", "Switch to dark mode");
  await page.goto("/en/projects/jelajanime"); await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.locator(".theme-toggle").click(); await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" }); await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto("/id");
    if (width < 768) await page.locator(".menu-trigger").click();
    const box = await page.locator(".theme-toggle").boundingBox();
    // Transformed menu bounds may differ by a floating-point fraction of a pixel.
    expect(box!.width).toBeGreaterThanOrEqual(43.99); expect(box!.height).toBeGreaterThanOrEqual(43.99);
    await expect(page.locator(".theme-toggle")).toHaveCSS("height", "44px");
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator(".theme-toggle").click();
    await page.goto("/en/projects/jelajanime");
    const badge = await page.locator(".case-title [data-slot=badge]").boundingBox();
    expect(badge!.x + badge!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const otherTab = await page.context().newPage(); await otherTab.goto("/en");
  const current = await page.locator("html").getAttribute("data-theme");
  await otherTab.locator(".theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", current === "dark" ? "light" : "dark");
  await otherTab.evaluate(() => localStorage.removeItem("portfolio-theme"));
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await otherTab.close();
  await page.evaluate(() => localStorage.setItem("portfolio-theme", "invalid")); await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goto("/fr"); await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(errors).toEqual([]);
});

test("invalid locale and slug return 404", async ({ request }) => {
  for (const route of ["/fr", "/id/projects/missing", "/en/projects/missing", "/fr/projects/jelajanime"]) {
    expect((await request.get(route)).status()).toBe(404);
  }
});

test("menu reverses mid-animation, traps focus, closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/en"); const trigger = page.getByRole("button", { name: "Menu", exact: true });
  await trigger.click();
  const menu = page.getByRole("dialog"); await expect(menu).toBeVisible();
  const close = page.getByRole("button", { name: "Close menu" });
  await close.evaluate(button => (button as HTMLButtonElement).click());
  await expect(menu).toHaveAttribute("data-state", "closing");
  await close.evaluate(button => (button as HTMLButtonElement).click());
  await expect(menu).toHaveAttribute("data-state", "open");
  expect(await page.evaluate(() => getComputedStyle(document.body).overflowY)).toBe("hidden");
  await page.keyboard.press("Tab");
  expect(await menu.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape"); await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflowY)).not.toBe("hidden");
});

test("all project routes render with Abex's real contact links", async ({ page }) => {
  for (const locale of ["id", "en"]) {
    for (const slug of ["jelajanime", "aplikasi-kasir"]) {
      await page.goto(`/${locale}/projects/${slug}`);
      await expect(page.locator("main h1")).toContainText(slug === "jelajanime" ? "Jelajanime" : "Ralunio Community");
      await expect(page.locator('main a[href^="mailto:"]')).toHaveAttribute("href", "mailto:abexziero%40gmail.com");
      await expect(page.locator('a[href^="https://wa.me/"]')).toHaveAttribute("href", "https://wa.me/628125569833");
    }
  }
});

test("case gallery shows its original screenshot without redundant controls", async ({page})=> {await page.goto('/en/projects/jelajanime');const carousel=page.getByRole('region',{name:'Project gallery'});await expect(carousel.locator('img')).toHaveAttribute('alt',/Original Jelajanime/);await expect(carousel.locator('.slide-counter')).toHaveText('1 / 1');await expect(carousel.getByRole('button')).toHaveCount(0);await carousel.focus();await page.keyboard.press('ArrowRight');await expect(carousel.locator('.slide-counter')).toHaveText('1 / 1');});

test("basic routes work without JavaScript", async ({browser})=>{const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('/en');await page.locator('.stage-portal[href="/en/work"]').click();await page.locator('.fan-card').first().click();await expect(page).toHaveURL(/\/en\/projects\/jelajanime$/);await page.getByRole('link',{name:'ID',exact:true}).click();await expect(page).toHaveURL(/\/id\/projects\/jelajanime$/);await context.close();});
