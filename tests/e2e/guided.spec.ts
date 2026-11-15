import {test,expect} from '@playwright/test';
import {startGuided,collectGuided,clickAction,objection} from './helpers';
test('guided story keeps subtitles and a single investigation target in the scene frame',async({page})=>{
 await startGuided(page);
 const frame=page.getByRole('region',{name:'Panggung Cerita'});await expect(frame.getByRole('region',{name:'Dialog Cerita'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Pojok Baca',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Wawancarai Raka',exact:true})).toHaveCount(0);
 await clickAction(page,'Periksa catatan peminjaman');await page.reload();
 await expect(frame).toContainText('Bima');await clickAction(page,'Petunjuk Berikutnya');await expect(frame).toContainText('Pojok Baca');
 await expect(page.getByRole('button',{name:'Minta foto rak kepada Sari',exact:true})).toHaveCount(0);
 for(const width of [360,768,1440]){await page.setViewportSize({width,height:800});await page.screenshot({path:`test-results/guided-${width}.png`,animations:'disabled'});const fits=await frame.evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight;});expect(fits).toBe(true);}
});
test('guided testimony requires solving the current focus before moving to the next',async({page})=>{
 await startGuided(page);await collectGuided(page);await clickAction(page,'Lanjutkan Cerita');
 await expect(page.getByRole('button',{name:'Lanjutkan Cerita',exact:true})).toHaveCount(0);
 await objection(page);await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Tanya Lagi');
 await expect(page.getByRole('region',{name:'Panggung Cerita'}).getByRole('img',{name:'Rekonstruksi tumpahan berdasarkan keterangan Sari'})).toBeVisible();
 await page.reload();await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Susun Penyelesaian');
 await expect(page.getByRole('heading',{name:'Apa penyelesaian yang adil?'})).toBeVisible();
});
