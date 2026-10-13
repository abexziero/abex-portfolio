import {test,expect} from '@playwright/test';

test('cutting-mat themes cover every page with readable text and pastel hero',async({browser})=>{
  test.setTimeout(60000);
  for(const theme of ['dark','light']){
    const context=await browser.newContext({colorScheme:'light',reducedMotion:'reduce'});
    await context.addInitScript(theme=>localStorage.setItem('portfolio-theme',theme),theme);
    const page=await context.newPage();
    for(const route of ['/id','/id/work','/id/experiments','/id/snippets','/id/about','/id/services','/id/projects/jelajanime','/id/projects/aplikasi-kasir','/en/about','/en/projects/jelajanime']){
      await page.goto(route);await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await expect(page.locator('html')).toHaveCSS('background-color',theme==='dark'?'rgb(13, 33, 24)':'rgb(45, 107, 79)');
      for(const card of await page.locator('.work-page .fan-card').all()){
        await expect(card).not.toHaveCSS('background-color','rgba(0, 0, 0, 0)');
        await expect(card).toHaveCSS('color','rgb(13, 33, 24)');
      }
      if(route==='/id'){
        const portals=await page.locator('.stage-portal').evaluateAll(links=>links.map(link=>{
          const style=getComputedStyle(link);
          return{colour:style.color,border:style.borderTopColor};
        }));
        expect(new Set(portals.map(portal=>portal.colour)).size).toBe(5);
        for(const portal of portals)expect(portal.border).toBe(portal.colour);
      }
      const contrast=await page.evaluate(()=>{
        const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;
        const luminance=(colour:string)=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=colour;ctx.fillRect(0,0,1,1);const rgb=Array.from(ctx.getImageData(0,0,1,1).data).slice(0,3).map(v=>{const n=v/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
        const ratio=(a:string,b:string)=>{const first=luminance(a),second=luminance(b);return(Math.max(first,second)+.05)/(Math.min(first,second)+.05);};
        const root=getComputedStyle(document.documentElement),background=root.backgroundColor;
        const visible=(el:Element)=>{const style=getComputedStyle(el);return(el as HTMLElement).offsetHeight>0&&style.visibility!=='hidden';};
        const readings=[ratio(getComputedStyle(document.body).color,background)];
        document.querySelectorAll('.eyebrow,.small-label,.reference-page-heading p,.site-footer,.back-link,.about-highlight,.about-contact a,.stage-portal').forEach(el=>{if(visible(el))readings.push(ratio(getComputedStyle(el).color,background));});
        document.querySelectorAll('.fan-card,.experiment-row,.motion-demo').forEach(el=>{const style=getComputedStyle(el);readings.push(ratio(style.color,style.backgroundColor));});
        const hero=[...document.querySelectorAll('.stage-letter')].map(el=>ratio(getComputedStyle(el).fill,background));
        return{minimum:Math.min(...readings),hero};
      });
      expect(contrast.minimum,`${theme} ${route}`).toBeGreaterThanOrEqual(4.5);
      for(const value of contrast.hero)expect(value).toBeGreaterThanOrEqual(3);
    }
    await context.close();
  }
});
