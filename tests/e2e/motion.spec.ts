import {test,expect} from '@playwright/test';
import {startGuided,collectGuided,clickAction,objection} from './helpers';
test('in-frame discoveries can be skipped and presentation is excluded from saves',async({page})=>{
 await startGuided(page);await clickAction(page,'Periksa catatan peminjaman');
 const frame=page.getByRole('region',{name:'Panggung Cerita'});await expect(frame.getByRole('heading',{name:'Catatan Peminjaman',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Lewati Animasi'}).click();await expect(page.locator('[data-primary-action]')).toBeFocused();await expect(frame.getByRole('heading',{name:'Catatan Peminjaman',exact:true})).toBeVisible();
 await page.reload();await expect(page.getByRole('button',{name:'Lewati Animasi'})).toHaveCount(0);const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('justice-room:save:buku-rusak')!));expect(save.evidenceIds).toEqual(['E01']);expect(save).not.toHaveProperty('moment');
});
test('Sari reconstruction stays in the same frame as subtitles until the player continues',async({page})=>{
 await page.setViewportSize({width:360,height:800});await startGuided(page);await collectGuided(page);await clickAction(page,'Lanjutkan Cerita');await objection(page);await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Tanya Lagi');
 const frame=page.getByRole('region',{name:'Panggung Cerita'});const reconstruction=frame.getByRole('img',{name:'Rekonstruksi tumpahan berdasarkan keterangan Sari'});await expect(reconstruction).toBeVisible();await expect(frame).toContainText('Siapa yang menyenggol belum diketahui.');await expect(frame.getByRole('region',{name:'Dialog Cerita'})).toContainText('09.20');
 await page.waitForTimeout(4700);await expect(reconstruction).toBeVisible();
 for(const width of [360,768,1440]){await page.setViewportSize({width,height:800});await page.screenshot({path:`test-results/story-spill-${width}.png`,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight&&document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('system and app reduced motion suppress decorative animations while the story stays readable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await startGuided(page);await clickAction(page,'Periksa catatan peminjaman');await expect(page.getByRole('button',{name:'Lewati Animasi'})).toHaveCount(0);expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('button',{name:'Menu Kasus'}).click();await page.getByRole('button',{name:'Pengaturan',exact:true}).click();await page.getByLabel('Kurangi gerakan').check();await page.keyboard.press('Escape');await clickAction(page,'Petunjuk Berikutnya');await clickAction(page,'Periksa buku yang basah');expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);await expect(page.getByRole('region',{name:'Dialog Cerita'})).toBeVisible();
});
test('objection cue stays inside the frame and its skip control works with keyboard',async({page})=>{
 await startGuided(page);await collectGuided(page);await clickAction(page,'Lanjutkan Cerita');await objection(page);const skip=page.getByRole('button',{name:'Lewati Animasi'});await expect(skip).toBeVisible();await skip.focus();await page.keyboard.press('Enter');await expect(skip).toHaveCount(0);await expect(page.locator('[data-primary-action]')).toBeFocused();await expect(page.getByRole('region',{name:'Panggung Cerita'}).getByRole('status')).toContainText('Raka');
});
