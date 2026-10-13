import {test,expect} from '@playwright/test';

test('professional process and grouped profile remain readable across layouts and themes',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const theme of ['dark','light'])for(const lang of ['id','en']) {
    await page.goto(`/${lang}/services`);
    await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
    await expect(page.locator('.process-step')).toHaveCount(5);
    await expect(page.locator('.process-step h3').first()).toHaveText(lang==='id'?'Analisis kebutuhan':'Requirements analysis');
    for(const width of [375,768,1024,1440]) {
      await page.setViewportSize({width,height:812});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      const steps=await page.locator('.process-step').all();
      const first=(await steps[0].boundingBox())!,second=(await steps[1].boundingBox())!;
      expect(width>=1024?Math.abs(first.y-second.y)<1:second.y>first.y).toBe(true);
    }
    await page.goto(`/${lang}/about`);
    await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
    await expect(page.locator('.about-bio p')).toHaveCount(2);
    await expect(page.locator('.about-skill-group')).toHaveCount(3);
    await expect(page.locator('.about-skill img')).toHaveCount(15);
    await expect(page.locator('.about-skill-group h3').last()).toHaveText('Backend & Data');
    await expect(page.locator('.about-portrait img')).toHaveAttribute('alt',lang==='id'?'Foto Abex':'Portrait of Abex');
    await expect(page.locator('.about-portrait img')).toHaveAttribute('src',/abe\.png/);
    for(const icon of await page.locator('.about-skill img').all()) {
      await expect(icon).toHaveAttribute('alt','');
      await expect(icon).toHaveCSS('width','24px');
      await expect.poll(()=>icon.evaluate(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0)).toBe(true);
    }
    await expect(page.locator('.about-primary-links a')).toHaveCount(3);
    await expect(page.locator('.about-social-links a')).toHaveCount(3);
    for(const icon of await page.locator('.about-social-links img').all()) {
      await expect(icon).toHaveAttribute('alt','');
      await expect.poll(()=>icon.evaluate(el=>(el as HTMLImageElement).naturalWidth>0)).toBe(true);
    }
    await expect(page.locator('.about-social-links img')).toHaveCount(3);
    for(const width of [375,768,1024,1440]) {
      await page.setViewportSize({width,height:812});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      const bio=page.locator('.about-bio p').first();
      expect(parseFloat(await bio.evaluate(el=>getComputedStyle(el).fontSize))).toBeLessThanOrEqual(22);
      await expect(page.locator('.about-contact')).toBeVisible();
    }
  }
});
