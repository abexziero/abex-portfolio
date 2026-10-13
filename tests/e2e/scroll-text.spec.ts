import {test,expect} from '@playwright/test';

test('responsive line reveals settle after scroll, resize and route changes',async({page})=>{
  await page.goto('/en/services');
  const intro=page.locator('.reference-page-heading p');
  const original=await intro.textContent();
  await expect(intro.locator('.scroll-line')).not.toHaveCount(0);
  await expect(intro).not.toHaveAttribute('aria-label');
  await expect(intro.locator('.scroll-line').first()).not.toHaveAttribute('aria-hidden');
  await intro.scrollIntoViewIfNeeded();
  await expect.poll(()=>intro.locator('.scroll-line').evaluateAll(lines=>lines.every(el=>getComputedStyle(el).transform==='matrix(1, 0, 0, 1, 0, 0)'))).toBe(true);
  for(const width of [375,768,1440]) {
    await page.setViewportSize({width,height:812});
    await expect(intro).toHaveText(original!);
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  const process=page.locator('.process-step p').last();
  await process.scrollIntoViewIfNeeded();
  await expect.poll(()=>process.locator('.scroll-line').evaluateAll(lines=>lines.length>0&&lines.every(el=>getComputedStyle(el).transform==='matrix(1, 0, 0, 1, 0, 0)'))).toBe(true);
  for(const route of ['about','work','experiments','snippets','projects/jelajanime']) {
    await page.goto('/en/'+route);
    await expect(page.locator('#main .scroll-line').first()).toBeAttached();
    expect(await page.locator('.desktop-nav .scroll-line').count()).toBe(0);
  }
  await page.locator('.wordmark').first().click();
  await expect(page.locator('.stage-bio')).toBeVisible();
  await expect(page.locator('.stage-bio .scroll-line')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.scroll-line')).toHaveCount(0);
  await expect(page.locator('.stage-bio')).toBeVisible();
});

test('sticky navbar stays opaque in both themes while scrolling',async({page})=>{
  await page.goto('/en/about');
  for(const theme of ['dark','light']) {
    await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
    await page.evaluate(()=>scrollTo(0,450));
    const header=page.locator('.site-header');
    await expect(header).toHaveAttribute('data-scrolled','true');
    expect(await header.evaluate(el=>({top:el.getBoundingClientRect().top,bg:getComputedStyle(el).backgroundColor}))).toEqual({top:0,bg:theme==='dark'?'rgb(13, 33, 24)':'rgb(45, 107, 79)'});
  }
});
