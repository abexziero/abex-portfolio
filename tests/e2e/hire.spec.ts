import { test, expect } from '@playwright/test';

test('home has stage navigation and a contact dialog with verified links', async ({page}) => {
  await page.goto('/en');
  await expect(page.locator('.desktop-nav')).toBeHidden();
  await expect(page.locator('.stage-portals')).toBeVisible();
  await page.getByRole('button',{name:'Hire me'}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toHaveAccessibleName('Tell me about your project');
  await expect(dialog.getByRole('link',{name:/^WhatsApp/})).toHaveAttribute('href','https://wa.me/628125569833');
  await expect(dialog.getByRole('link',{name:/Email/})).toHaveAttribute('href','mailto:abexziero@gmail.com');
  await expect(dialog.getByRole('link',{name:/^GitHub/})).toHaveAttribute('href','https://github.com/abexziero');
  await expect(dialog.getByText('+628125569833')).toBeVisible();
  await expect(dialog.getByText('abexziero',{exact:true})).toBeVisible();
  await expect(dialog.locator('.hire-icon')).toHaveCount(3);
  await expect(dialog.locator('.hire-email').getByRole('button',{name:'Copy address'})).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button',{name:'Hire me'})).toBeFocused();
  await page.goto('/id/about');
  await page.setViewportSize({width:1024,height:768});
  await expect(page.locator('.desktop-nav')).toBeVisible();
  await expect(page.getByRole('button',{name:'Mari bekerja sama'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('mobile menu hands focus to contacts and restores the trigger', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto('/en');
  await expect(page.locator('.header-actions>.hire-button')).toBeHidden();
  await page.getByRole('button',{name:'Menu',exact:true}).click();
  await page.locator('.menu-contact').getByRole('button',{name:'Hire me'}).click();
  const dialog=page.locator('#hire-contact');
  await expect(dialog).toBeVisible();
  await expect(page.locator('.menu-panel')).toHaveCount(0);
  expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeFocused();
  await expect(dialog).toBeHidden();
  const decoration=await page.evaluate(()=>({left:getComputedStyle(document.body,'::after').display,opacity:getComputedStyle(document.body,'::before').opacity}));
  expect(decoration).toEqual({left:'none',opacity:'0.2'});
  await page.evaluate(()=>document.documentElement.dataset.theme='light');
  expect(await page.evaluate(()=>getComputedStyle(document.body,'::before').opacity)).toBe('0.14');
});

