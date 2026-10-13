import { test, expect } from "@playwright/test";

test("theme toggle survives repeated language switches on home and project, desktop and mobile", async ({ browser }) => {
  test.setTimeout(60000);
  for (const width of [1440, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const route of ["", "/projects/jelajanime"]) {
      await page.goto(`/id${route}`);
      for (let i = 0; i < 4; i++) {
        if (width < 768) await page.locator(".menu-trigger").click();
        const toggle = page.locator(".theme-toggle:visible");
        await expect(toggle).toBeVisible();
        await expect(toggle).toHaveAttribute("data-ready", "true");
        const before = await page.locator("html").getAttribute("data-theme");
        await toggle.click();
        const selected = before === "dark" ? "light" : "dark";
        await expect(page.locator("html")).toHaveAttribute("data-theme", selected);
        await page.locator(".language-switch a:visible").click();
        await expect(page).toHaveURL(new RegExp(`/${i % 2 ? "id" : "en"}${route}$`));
        await expect(page.locator("html")).toHaveAttribute("data-theme", selected);
        if (width < 768) await page.locator(".menu-trigger").click();
        await expect(page.locator(".theme-toggle:visible")).toBeVisible();
        if (width < 768) await page.keyboard.press("Escape");
      }
    }
    await context.close();
  }
});

test("light hero has stronger colours and theme changes retain the selected toolbar palette", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/id");
  const paths = page.locator(".stage-letter");
  const dark = await paths.evaluateAll(nodes => nodes.map(el => getComputedStyle(el).fill));
  await page.locator(".theme-toggle").click();
  await expect(paths.nth(0)).toHaveCSS("fill", "rgb(255, 250, 234)");
  await expect(paths.nth(1)).toHaveCSS("fill", "rgb(255, 218, 87)");
  await expect(paths.nth(2)).toHaveCSS("fill", "rgb(255, 181, 145)");
  await expect(paths.nth(3)).toHaveCSS("fill", "rgb(141, 229, 243)");
  await page.locator(".theme-toggle").click();
  expect(await paths.evaluateAll(nodes => nodes.map(el => getComputedStyle(el).fill))).toEqual(dark);
  await page.locator(".tool-colour").click();
  await expect(paths.first()).toHaveCSS("fill", "rgb(240, 206, 114)");
  await page.keyboard.press("Escape"); await page.locator(".theme-toggle").click();
  await expect(paths.first()).toHaveCSS("fill", "rgb(255, 218, 87)");
  await expect(page.locator(".hero-stage")).toHaveAttribute("data-custom", "true");
  await page.locator(".theme-toggle").click();
  await expect(paths.first()).toHaveCSS("fill", "rgb(240, 206, 114)");
});
