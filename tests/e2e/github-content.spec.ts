import {test,expect} from '@playwright/test';

test('real GitHub projects have original images, honest statuses and bilingual routes',async({page,request})=>{
  for(const lang of ['id','en']) {
    await page.goto(`/${lang}/work`);
    await expect(page.locator('.fan-card')).toHaveCount(2);
    await expect(page.locator('.fan-card')).not.toContainText(['Placeholder']);
    for(const slug of ['jelajanime','aplikasi-kasir']) {
      await page.goto(`/${lang}/projects/${slug}`);
      const screenshot=page.locator('.case-gallery img');
      await expect(screenshot).toHaveAttribute('src',new RegExp(slug));
      await expect.poll(()=>screenshot.evaluate(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0)).toBe(true);
      await expect(page.locator(`.case-external a[href="https://github.com/abexziero/${slug}"]`)).toBeVisible();
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',slug==='jelajanime'?/anime/:/Android/);
      await page.locator('.language-switch a').click();
      await expect(page).toHaveURL(new RegExp(`/${lang==='id'?'en':'id'}/projects/${slug}$`));
    }
  }
  for(const slug of ['forma','orbit','mono'])expect((await request.get(`/id/projects/${slug}`)).status()).toBe(404);
});

test('GitHub profile content and screenshots fit mobile, tablet and desktop',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [375,768,1024,1440]) {
    await page.setViewportSize({width,height:812});
    for(const route of ['/id','/id/work','/id/about','/id/projects/jelajanime','/id/projects/aplikasi-kasir']) {
      await page.goto(route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(route.endsWith('/about')) {
        await expect(page.locator('.about-location')).toHaveText('Kalimantan Timur, Indonesia');
        await expect(page.locator('.about-learning')).toContainText('frontend, backend');
        for(const label of ['GitHub','X','Instagram','Threads'])await expect(page.locator('.about-contact').getByRole('link',{name:new RegExp('^'+label+'(?:\\s|$)')})).toBeVisible();
      }
      if(route==='/id')expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
      if(route.includes('/projects/')) {
        const image=page.locator('.case-gallery img');
        await image.scrollIntoViewIfNeeded();
        expect((await image.boundingBox())!.height).toBeLessThanOrEqual(812*.75+1);
      }
    }
  }
});
