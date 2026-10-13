import { test, expect } from '@playwright/test';

const dark = [[211,188,232],[246,241,220],[235,165,128],[240,206,114],[188,220,221]];
const light = [[236,212,255],[255,250,234],[255,212,176],[255,218,87],[154,234,246]];

test('desktop navbar matches per-item colours and count motion in both themes', async ({page}) => {
  await page.goto('/en/projects/jelajanime');
  const links = page.locator('.desktop-nav a');
  await expect(links.first()).toHaveCSS('font-size','15px');
  await expect(links.first()).toHaveCSS('font-weight','500');
  for (const [theme,colours] of [['dark',dark],['light',light]] as const) {
    await page.evaluate(theme => document.documentElement.dataset.theme=theme,theme);
    for(let i=0;i<5;i++) {
      const link=links.nth(i),count=link.locator('sup');
      await link.hover();
      await expect.poll(()=>link.evaluate(el=>parseFloat((el as HTMLElement).style.getPropertyValue('--nav-progress')))).toBe(100);
      await expect.poll(()=>link.evaluate(el=>{const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;ctx.fillStyle=getComputedStyle(el).color;ctx.fillRect(0,0,1,1);return Array.from(ctx.getImageData(0,0,1,1).data).slice(0,3);})).toEqual([...colours[i]]);
      if(await count.count()) {
        await expect(count).toHaveCSS('opacity','1');
        await expect.poll(()=>count.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42)).toBe(0);
      }
      await page.mouse.move(0,900);
      if(await count.count()) await expect(count).toHaveCSS('opacity','0');
      await expect.poll(()=>link.evaluate(el=>parseFloat((el as HTMLElement).style.getPropertyValue('--nav-progress')))).toBe(0);
    }
  }
});

test('navbar handles rapid hover, keyboard focus, active routes and reduced motion', async ({page}) => {
  await page.goto('/en/projects/jelajanime');const links=page.locator('.desktop-nav a');
  for(let n=0;n<3;n++)for(let i=0;i<5;i++)await links.nth(i).hover();
  await page.mouse.move(0,900);
  await links.nth(2).focus();
  await expect(links.nth(2).locator('sup')).toHaveCSS('opacity','1');
  await links.nth(1).focus();
  await expect(links.nth(2).locator('sup')).toHaveCSS('opacity','0');
  await links.nth(1).click();await expect(page).toHaveURL(/\/en\/work$/);
  await page.mouse.move(0,900);await page.locator('.site-header .wordmark').focus();
  await expect(links.nth(1)).toHaveAttribute('aria-current','page');
  await expect(links.nth(1).locator('sup')).toHaveCSS('opacity','1');
  await page.emulateMedia({reducedMotion:'reduce'});
  await links.nth(4).hover();
  expect(await links.nth(4).evaluate(el=>(el as HTMLElement).style.getPropertyValue('--nav-progress'))).toBe('100%');
  await page.mouse.move(0,900);
  expect(await links.nth(4).evaluate(el=>(el as HTMLElement).style.getPropertyValue('--nav-progress'))).toBe('0%');
  await expect(links.nth(1).locator('sup')).toHaveCSS('opacity','1');
  await page.goto('/en/about');await expect(links.nth(1).locator('sup')).toHaveCSS('opacity','0');
  await expect(links.nth(0)).toHaveAttribute('aria-current','page');
});

test('navbar logo bounces in order, changes colour and resets after hover or focus', async ({page}) => {
  await page.clock.install();await page.goto('/en/about');await page.clock.runFor(2400);
  const logo=page.locator('.site-header .wordmark'),letters=logo.locator('span');
  const positions=()=>letters.evaluateAll(nodes=>nodes.map(el=>new DOMMatrix(getComputedStyle(el).transform).m42));
  await expect(logo).toHaveAccessibleName('Abex — Home');
  await logo.hover();await page.clock.runFor(100);
  const early=await positions();expect(early[0]).toBeLessThan(0);expect(early[3]).toBe(0);
  await page.clock.runFor(750);expect(await positions()).toEqual([0,0,0,0]);
  for(let i=0;i<4;i++)await expect(letters.nth(i)).toHaveCSS('--logo-progress','100%');
  const colours=await letters.evaluateAll(nodes=>nodes.map(el=>getComputedStyle(el).color));expect(new Set(colours).size).toBe(4);
  await page.mouse.move(0,900);await page.clock.runFor(400);
  for(let i=0;i<4;i++)await expect(letters.nth(i)).toHaveCSS('--logo-progress','0%');
  await logo.focus();await page.clock.runFor(100);expect((await positions())[0]).toBeLessThan(0);
  await page.clock.runFor(750);expect(await positions()).toEqual([0,0,0,0]);
  await page.locator('.desktop-nav a').first().focus();await page.clock.runFor(400);
  for(let n=0;n<3;n++){await logo.hover();await page.clock.runFor(80);await page.mouse.move(0,900);await page.clock.runFor(40);}
  await page.clock.runFor(400);expect(await positions()).toEqual([0,0,0,0]);
  for(let i=0;i<4;i++)await expect(letters.nth(i)).toHaveCSS('--logo-progress','0%');
  await page.emulateMedia({reducedMotion:'reduce'});await logo.hover();expect(await positions()).toEqual([0,0,0,0]);
  for(let i=0;i<4;i++)await expect(letters.nth(i)).toHaveCSS('--logo-progress','100%');
  await page.mouse.move(0,900);for(let i=0;i<4;i++)await expect(letters.nth(i)).toHaveCSS('--logo-progress','0%');
});
