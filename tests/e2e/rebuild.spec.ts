import { test, expect } from "@playwright/test";

test("home is a centered stage rather than a scrolling portfolio", async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto("/en");
    await expect(page.getByRole("heading", { name: "Abex", exact: true })).toBeVisible();
    await expect(page.locator(".hero-stage")).toBeVisible();
    await expect(page.locator("#work,#services,#about,#contact,.footer-wave")).toHaveCount(0);
    const bounds = await page.locator(".stage-wordmark").boundingBox();
    expect(Math.abs(bounds!.x + bounds!.width / 2 - width / 2)).toBeLessThan(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1)).toBe(true);
  }
});

test("navigation opens separate pages and preserves language", async ({ page }) => {
  await page.goto("/en");
  await page.locator('.stage-portal[href="/en/work"]').click(); await expect(page).toHaveURL(/\/en\/work$/);
  await page.locator('.language-switch a[lang="id"]').click(); await expect(page).toHaveURL(/\/id\/work$/);
  await page.goto("/en/about"); await expect(page.getByRole("heading", { name: "Abex", exact: true })).toBeVisible();
  await expect(page.locator('.about-contact a[href="mailto:abexziero@gmail.com"]')).toBeVisible();
});

test("five design tools operate on the central specimen", async ({ page }) => {
  await page.goto("/en");
  for (const [label, mode] of [["Colour", "colour"], ["Type", "type"], ["Spacing", "space"], ["Radius", "radius"], ["Opacity", "opacity"]]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(page.locator(".hero-stage")).toHaveAttribute("data-tool", mode);
    await expect(page.getByRole("button", { name: label, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".stage-code")).toBeVisible();
  }
  await page.getByRole("button", { name: "Close controls", exact: true }).click();
  await expect(page.locator(".hero-stage")).toHaveAttribute("data-tool", "none");
});

test("hero intro releases its edge filter and reduced motion skips it", async ({ page }) => {
  await page.goto("/en");
  const group = page.locator(".stage-letter-group");
  await expect(group).toHaveCSS("filter", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(group).toHaveCSS("filter", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(group).toHaveCSS("filter", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(group).toHaveCSS("filter", "none");
});

test("specimen morph, keyboard sizing and reduced motion stay usable", async ({ page }) => {
  await page.setViewportSize({width:1024,height:768}); await page.goto("/en");
  const initial = await page.locator(".stage-letter").first().getAttribute("d");
  const initialBounds = await page.locator(".stage-letter").first().evaluate(el => { const bounds=(el as SVGPathElement).getBBox(); return {x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height}; });
  await page.getByRole("button",{name:"Spacing",exact:true}).click();
  await page.getByRole("button",{name:"Spacing 1",exact:true}).focus(); await page.keyboard.press("ArrowRight");
  await expect(page.locator(".stage-code code")).toHaveText("letter-spacing: 1px;");
  await page.getByRole("button",{name:"Type",exact:true}).click();
  const before = (await page.locator(".stage-wordmark").boundingBox())!.width;
  await page.locator(".stage-handle").first().focus(); await page.keyboard.press("ArrowUp");
  await expect.poll(async()=> (await page.locator(".stage-wordmark").boundingBox())!.width).toBeGreaterThan(before);
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.getByRole("button",{name:"Radius",exact:true}).click();
  await page.getByRole("button",{name:"Radius 1",exact:true}).focus();
  for(let i=0;i<3;i++) await page.keyboard.press("ArrowRight");
  await expect(page.locator(".stage-code code")).toHaveText("border-radius: 3px;");
  await expect.poll(()=>page.locator(".stage-letter").first().getAttribute("d")).not.toBe(initial);
  await expect(page.locator(".intro-blur")).toHaveAttribute("stdDeviation","0");
  await page.getByRole("button",{name:"Close controls",exact:true}).click();
  const finalBounds = await page.locator(".stage-letter").first().evaluate(el => { const bounds=(el as SVGPathElement).getBBox(); return {x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height}; });
  for (const key of ["x","y","width","height"] as const) expect(finalBounds[key]).toBeCloseTo(initialBounds[key],1);
});

test("contact bar copies configured email and Escape restores focus", async ({page})=> {
  await page.addInitScript(()=>Object.defineProperty(navigator,"clipboard",{value:{writeText:async(text:string)=>{(window as unknown as {copied:string}).copied=text;}}}));
  await page.goto("/en"); const trigger=page.getByRole("button",{name:"Hire me",exact:false}); await trigger.click();
  await expect(page.locator("#hire-contact")).toBeVisible();
  await page.getByRole("button",{name:"Copy address",exact:true}).click();
  await expect(page.locator(".hire-feedback")).toHaveText("Address copied");
  expect(await page.evaluate(()=>(window as unknown as {copied:string}).copied)).toBe("abexziero@gmail.com");
  await page.keyboard.press("Escape"); await expect(page.locator("#hire-contact")).toBeHidden(); await expect(trigger).toBeFocused();
});

test("mobile specimen automatically demonstrates all five tokens", async ({page})=> {
  await page.setViewportSize({width:375,height:812}); await page.clock.install(); await page.goto("/en");
  const fills = () => page.locator(".stage-letter").evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).fill));
  const initialColours = await fills();
  const code=page.locator(".stage-mobile-code");
  await page.clock.runFor(5000); await expect(code).toContainText("fill:");
  await page.clock.runFor(2200); await expect(code).toContainText("font-size:");
  await page.clock.runFor(4400); await expect(code).toContainText("opacity:");
  await page.clock.runFor(3000); await expect(code).toContainText("gap:");
  await page.clock.runFor(3600); await expect(code).toContainText("border-radius:");
  expect(await fills()).toEqual(initialColours);
  await page.clock.runFor(8000);
  expect(await fills()).toEqual(initialColours);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollHeight <= innerHeight+1)).toBe(true);
});

test("hero palette changes only through Colour and resets through Reset", async ({page})=> {
  await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/en");
  const letters=page.locator(".stage-letter"),colour=page.getByRole("button",{name:"Colour",exact:true});
  const initial=await letters.evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).fill));
  await colour.click();await expect(letters.first()).toHaveCSS("fill","rgb(240, 206, 114)");
  await page.locator(".stage-svg").hover();await expect(letters.first()).toHaveCSS("fill","rgb(240, 206, 114)");
  await colour.click();await expect(letters.first()).toHaveCSS("fill","rgb(188, 220, 221)");
  await page.keyboard.press("Escape");
  await expect(letters.first()).toHaveCSS("fill","rgb(188, 220, 221)");
  await page.keyboard.press("1");await expect(letters.first()).toHaveCSS("fill","rgb(235, 165, 128)");
  await page.getByRole("button",{name:"Reset",exact:true}).click();
  expect(await letters.evaluateAll(nodes=>nodes.map(node=>getComputedStyle(node).fill))).toEqual(initial);
});

test('hero portal rows and connector paths stay clear in both languages', async ({page})=> {
  test.setTimeout(60000);
  for(const lang of ['id','en'])for(const viewport of [{width:768,height:900},{width:1024,height:900},{width:1440,height:900},{width:1024,height:600}]) {
    await page.setViewportSize(viewport);await page.goto(`/${lang}`);await page.waitForTimeout(2400);
    const geometry=await page.evaluate(()=>{
      const rect=(el:Element)=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
      const cards=[...document.querySelectorAll('.stage-portal')].map(rect);
      const paths=[...document.querySelectorAll<SVGPathElement>('.stage-leader')];
      const clear=paths.every((path,i)=>{
        const matrix=path.getScreenCTM()!,length=path.getTotalLength();
        for(let at=0;at<=length;at+=2){const local=path.getPointAtLength(at),point=new DOMPoint(local.x,local.y).matrixTransform(matrix);
          if(cards.some((r,j)=>j!==i&&point.x>r.x+1&&point.x<r.right-1&&point.y>r.y+1&&point.y<r.bottom-1))return false;}
        return true;
      });
      const samples=paths.map(path=>{const matrix=path.getScreenCTM()!,points=[];for(let at=0;at<=path.getTotalLength();at+=4){const p=path.getPointAtLength(at);points.push(new DOMPoint(p.x,p.y).matrixTransform(matrix));}return points;});
      const cross=(a:DOMPoint,b:DOMPoint,c:DOMPoint)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
      let intersects=false;
      for(let i=0;i<samples.length;i++)for(let j=i+1;j<samples.length;j++)for(let a=1;a<samples[i].length;a++)for(let b=1;b<samples[j].length;b++){
        const p=samples[i][a-1],q=samples[i][a],r=samples[j][b-1],s=samples[j][b];
        if(Math.max(p.x,q.x)<Math.min(r.x,s.x)||Math.max(r.x,s.x)<Math.min(p.x,q.x)||Math.max(p.y,q.y)<Math.min(r.y,s.y)||Math.max(r.y,s.y)<Math.min(p.y,q.y))continue;
        if(cross(p,q,r)*cross(p,q,s)<=0&&cross(r,s,p)*cross(r,s,q)<=0)intersects=true;
      }
      const letters=[...document.querySelectorAll<SVGPathElement>('.stage-letter')];
      const endpoints=[...document.querySelectorAll<SVGCircleElement>('.stage-connections circle')].every((circle,i)=>{
        const point=new DOMPoint(circle.cx.baseVal.value,circle.cy.baseVal.value).matrixTransform(circle.getScreenCTM()!);
        const letter=letters[[0,1,3,2,3][i]],local=point.matrixTransform(letter.getScreenCTM()!.inverse());
        return letter.isPointInFill(new DOMPoint(local.x,local.y+.1))&&!letter.isPointInFill(new DOMPoint(local.x,local.y-.1));
      });return{cards,clear,intersects,endpoints};
    });
    const r=geometry.cards;expect(geometry.clear).toBe(true);
    expect(geometry.intersects).toBe(false);expect(geometry.endpoints).toBe(true);
    expect(Math.abs(r[0].y-r[1].y)).toBeLessThan(1);expect(Math.abs(r[1].y-r[2].y)).toBeLessThan(1);
    expect(Math.abs(r[3].y-r[4].y)).toBeLessThan(1);expect(r[3].y-r[0].bottom).toBeGreaterThanOrEqual(23);
    expect(r[0].x<r[1].x&&r[1].x<r[2].x&&r[3].x<r[4].x).toBe(true);
    expect(r.every(card=>card.height>=44)).toBe(true);
    for(let i=0;i<5;i++){
      await page.locator('.stage-portal').nth(i).focus();
      const result=await page.locator('.stage-portal-slot').nth(i).locator('.stage-portal-note').evaluate(el=>{
        const r=el.getBoundingClientRect(),stage=document.querySelector('.hero-stage')!.getBoundingClientRect();
        const overlap=[...document.querySelectorAll('.stage-portal')].some(card=>{const b=card.getBoundingClientRect();return r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top;});
        return{within:r.left>=stage.left&&r.right<=stage.right&&r.top>=stage.top&&r.bottom<=stage.bottom,overlap};
      });expect(result.within).toBe(true);expect(result.overlap).toBe(false);
    }
  }
});

for (const motion of ['reduce','no-preference'] as const) test(`hero keeps every toolbar setting after close (${motion})`, async ({page})=> {
  await page.emulateMedia({reducedMotion:motion});await page.clock.install();await page.goto('/en');
  await expect(page.locator('.stage-letter').first()).toHaveAttribute('style',/opacity/);await page.clock.runFor(2400);
  const stage=page.locator('.hero-stage'),paths=page.locator('.stage-letter'),word=page.locator('.stage-wordmark');
  await page.getByRole('button',{name:'Colour',exact:true}).click();await expect(stage).toHaveAttribute('data-custom','true');await page.clock.runFor(700);
  await page.getByRole('button',{name:'Type',exact:true}).click();await expect(stage).toHaveAttribute('data-tool','type');await page.locator('.stage-handle').first().focus();await page.keyboard.press('ArrowUp');
  await page.getByRole('button',{name:'Spacing',exact:true}).click();await page.getByRole('button',{name:'Spacing 1',exact:true}).focus();
  for(let n=0;n<7;n++)await page.keyboard.press('ArrowRight');
  await expect(page.locator('.stage-code code')).toHaveText('letter-spacing: 7px;');
  await page.getByRole('button',{name:'Radius',exact:true}).click();await page.getByRole('button',{name:'Radius 1',exact:true}).focus();
  for(let n=0;n<3;n++)await page.keyboard.press('ArrowRight');
  await page.getByRole('button',{name:'Opacity',exact:true}).click();await page.getByRole('slider',{name:'Opacity',exact:true}).fill('0.55');
  await page.clock.runFor(700);await expect(stage).toHaveAttribute('data-custom','true');
  const saved=await paths.evaluateAll(nodes=>nodes.map(el=>({fill:getComputedStyle(el).fill,opacity:getComputedStyle(el).opacity,d:el.getAttribute('d'),transform:getComputedStyle(el).transform})));
  const size=(await word.boundingBox())!.width;
  await page.getByRole('button',{name:'Close controls',exact:true}).click();await page.clock.runFor(700);
  await expect(stage).toHaveAttribute('data-tool','none');await expect(page.locator('.stage-callout')).toBeHidden();
  await page.locator('.stage-svg').hover();await page.mouse.move(0,900);await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
  await page.clock.runFor(25000);
  expect(await paths.evaluateAll(nodes=>nodes.map(el=>({fill:getComputedStyle(el).fill,opacity:getComputedStyle(el).opacity,d:el.getAttribute('d'),transform:getComputedStyle(el).transform})))).toEqual(saved);
  expect((await word.boundingBox())!.width).toBeCloseTo(size,1);
  await page.getByRole('button',{name:'Spacing',exact:true}).click();await expect(page.locator('.stage-code code')).toHaveText('letter-spacing: 7px;');
  await page.keyboard.press('Escape');await expect(paths.first()).toHaveCSS('opacity','0.55');
  await page.getByRole('button',{name:'Reset',exact:true}).click();await page.clock.runFor(700);
  await expect(stage).toHaveAttribute('data-custom','false');await expect(paths.first()).toHaveCSS('fill','rgb(246, 241, 220)');await expect(paths.first()).toHaveCSS('opacity','1');
  expect((await word.boundingBox())!.width).toBeLessThan(size);
});

test('an edit during the intro survives its completion', async ({page})=> {
  await page.clock.install();await page.goto('/en');await expect(page.locator('.stage-letter').first()).toHaveAttribute('style',/opacity/);
  await page.clock.runFor(50);await page.keyboard.press('3');await page.getByRole('button',{name:'Spacing 1',exact:true}).focus();await page.keyboard.press('Shift+ArrowRight');
  const position=()=>page.locator('.stage-letter').nth(1).evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41);
  const before=await position();expect(before).toBeGreaterThan(0);await page.keyboard.press('Escape');await page.clock.runFor(1600);
  expect(await position()).toBeCloseTo(before,2);await expect(page.locator('.hero-stage')).toHaveAttribute('data-custom','true');
});
