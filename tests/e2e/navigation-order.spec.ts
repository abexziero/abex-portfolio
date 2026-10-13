import {test,expect} from '@playwright/test';

const routes=['about','work','services','experiments','snippets'];
test('navigation order agrees across portals, desktop, mobile and no-JavaScript',async({page,browser})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const lang of ['id','en']) {
    await page.setViewportSize({width:1440,height:900});
    await page.goto('/'+lang);
    expect(await page.locator('.stage-portal').evaluateAll(links=>links.map(link=>link.getAttribute('href')!.split('/').pop()))).toEqual(routes);
    await page.goto('/'+lang+'/about');
    expect(await page.locator('.desktop-nav a').evaluateAll(links=>links.map(link=>link.getAttribute('href')!.split('/').pop()))).toEqual(routes);
    await expect(page.locator('.desktop-nav a').first()).toHaveAttribute('aria-current','page');
    await expect(page.locator('.desktop-nav a').first().locator('sup')).toHaveCount(0);
    for(const width of [1024,1200,1280,1440]) {
      await page.setViewportSize({width,height:900});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      const controls=await page.locator('.header-inner').evaluate(el=>{
        const logo=el.querySelector('.wordmark')!.getBoundingClientRect(),nav=el.querySelector('.desktop-nav')!.getBoundingClientRect(),actions=el.querySelector('.header-actions')!.getBoundingClientRect();
        return logo.right<=nav.left&&nav.right<=actions.left;
      });
      expect(controls).toBe(true);
    }
    await page.setViewportSize({width:375,height:812});
    await page.getByRole('button',{name:'Menu',exact:true}).click();
    expect(await page.locator('.menu-links a').evaluateAll(links=>links.map(link=>link.getAttribute('href')!.split('/').pop()))).toEqual(routes);
    await expect(page.locator(`.menu-panel a[href="/${lang}/about"]`)).toHaveCount(1);
    await page.keyboard.press('Escape');
    await page.goto('/'+lang);
    const visible=await page.locator('.stage-portal').evaluateAll(links=>links.filter(el=>el.getBoundingClientRect().width>0).map(el=>el.getAttribute('href')!.split('/').pop()));
    expect(visible).toEqual(['about','work']);
  }
  const context=await browser.newContext({javaScriptEnabled:false});
  const native=await context.newPage();await native.goto('/en/services');
  expect(await native.locator('.no-js-navigation a:not(.no-js-locale)').evaluateAll(links=>links.map(link=>link.getAttribute('href')!.split('/').pop()))).toEqual(routes);
  await context.close();
});
