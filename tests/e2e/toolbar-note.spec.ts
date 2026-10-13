import {test,expect} from '@playwright/test';

test('toolbar instructions stay inside the control panel in both languages',async({page})=>{
  test.setTimeout(60000);await page.emulateMedia({reducedMotion:'reduce'});
  for(const lang of ['id','en'])for(const viewport of [{width:1440,height:900},{width:1024,height:600},{width:768,height:900}]){
    await page.setViewportSize(viewport);await page.emulateMedia({colorScheme:lang==='id'?'dark':'light'});await page.goto(`/${lang}`);
    await expect(page.locator('.stage-letter').first()).toHaveAttribute('style',/opacity/);
    for(const tool of ['colour','type','space','radius','opacity']){
      await page.locator(`.tool-${tool}`).click();await expect(page.locator('.hero-stage')).toHaveAttribute('data-tool',tool);
      const note=page.locator('.stage-code > figcaption.stage-note');await expect(note).toBeVisible();await expect(note.locator('svg')).toHaveCount(0);
      if(tool==='colour')await expect(note).toContainText(lang==='id'?'Klik tombol Warna':'Click Colour');
      else await expect(note).not.toContainText('Colour');
      const layout=await note.evaluate(el=>{const r=el.getBoundingClientRect(),panel=el.parentElement!.getBoundingClientRect(),value=el.parentElement!.querySelector('pre')!.getBoundingClientRect();return{inside:r.left>=panel.left&&r.right<=panel.right&&r.top>=value.bottom&&r.bottom<=panel.bottom,panelVisible:panel.left>=0&&panel.right<=innerWidth&&panel.top>=0&&panel.bottom<=innerHeight};});
      expect(layout.inside).toBe(true);expect(layout.panelVisible).toBe(true);
      if(tool==='opacity')await expect(page.getByRole('slider')).toBeInViewport();
    }
    await page.keyboard.press('Escape');await expect(page.locator('.stage-code')).toBeHidden();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
