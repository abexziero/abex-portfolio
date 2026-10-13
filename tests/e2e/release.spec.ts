import {test,expect} from '@playwright/test';

test('release export has production SEO, static images and secure responses',async({page,request})=>{
  test.skip(process.env.PORTFOLIO_RELEASE!=='1'||!process.env.SITE_URL,'Requires a release export.');
  const origin=process.env.SITE_URL!;
  for(const lang of ['id','en']) {
    const response=await page.goto(`/${lang}/about`);
    expect(response!.headers()['x-frame-options']).toBe('DENY');
    expect(response!.headers()['x-content-type-options']).toBe('nosniff');
    expect(response!.headers()['x-robots-tag']).toBeUndefined();
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',`${origin}/${lang}/about`);
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','index, follow');
    await expect(page.locator('.preview-note')).not.toContainText(/Pratinjau|preview/);
    const portrait=page.locator('.about-portrait img');
    await expect(portrait).toHaveAttribute('src',/^\/optimized\/images\/abe\.png-\d+\.webp$/);
    await expect.poll(()=>portrait.evaluate(el=>(el as HTMLImageElement).naturalWidth>0)).toBe(true);
  }
  const sitemap=await request.get('/sitemap.xml');
  expect((await sitemap.text()).match(/<url>/g)).toHaveLength(16);
  expect(await (await request.get('/robots.txt')).text()).toContain('Allow: /');
  expect((await request.get('/unknown')).status()).toBe(404);
  const redirect=await request.get('/',{maxRedirects:0});
  expect(redirect.status()).toBe(302);
  expect(redirect.headers().location).toBe('/id');
  const source=await request.get('/motion-source');
  expect(source.headers()['content-type']).toContain('text/plain');
});
