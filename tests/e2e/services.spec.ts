import {test,expect} from '@playwright/test';

test('services replaces writing and owns services and working approach in both locales',async({page,request})=>{
  for(const lang of ['id','en']) {
    await page.goto(`/${lang}`);
    const portal=page.locator(`.stage-portal[href="/${lang}/services"]`);
    await expect(portal).toHaveAccessibleName(lang==='id'?'layanan':'services');
    await portal.click();
    await expect(page).toHaveURL(new RegExp(`/${lang}/services$`));
    await expect(page.locator('main h1')).toHaveText(lang==='id'?'layanan & cara kerja':'services & process');
    await expect(page.locator('.service-card')).toHaveCount(3);
    await expect(page.locator('.service-process li')).toHaveCount(5);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://portfolio.invalid/${lang}/services`);
    const other=lang==='id'?'en':'id';
    await page.locator('.language-switch a').click();
    await expect(page).toHaveURL(new RegExp(`/${other}/services$`));
    const redirect=await request.get(`/${lang}/writing`,{maxRedirects:0});
    expect(redirect.status()).toBe(308);
    expect(redirect.headers().location).toBe(`/${lang}/services`);
    await page.goto(`/${lang}/about`);
    await expect(page.getByRole('heading',{name:lang==='id'?'Pendekatan kerja':'Working approach',exact:true})).toHaveCount(0);
    await expect(page.locator('.about-detail ul')).toHaveCount(0);
    await expect(page.locator('.about-contact')).toBeVisible();
  }
  expect((await request.get('/fr/services')).status()).toBe(404);
  expect((await request.get('/fr/writing')).status()).toBe(404);
});

test('services remains accessible without JavaScript and fits responsive viewports',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  for(const width of [375,768,1024,1440]) {
    await page.setViewportSize({width,height:812});
    await page.goto('/id/services');
    await expect(page.locator('.service-card')).toHaveCount(3);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const cards=await page.locator('.service-card').all();
    for(const card of cards)await expect(card).toBeVisible();
  }
  await page.goto('/en/writing');
  await expect(page).toHaveURL(/\/en\/services$/);
  await context.close();
});

test('menu closes even when reversed before its first animation frame',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.clock.install({time:new Date('2026-10-13T00:00:00Z')});
  await page.goto('/en');
  await page.clock.pauseAt(new Date('2026-10-13T00:00:10Z'));
  await page.getByRole('button',{name:'Menu',exact:true}).click();
  await expect(page.locator('.menu-panel')).toHaveCount(1);
  await page.getByRole('button',{name:'Close menu',exact:true}).evaluate(el=>(el as HTMLButtonElement).click());
  await page.clock.runFor(1000);
  await expect(page.locator('.menu-panel')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeFocused();
});
