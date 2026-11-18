import {test,expect} from '@playwright/test';
import {allCases} from '../../content/cases';
import {saveKey,PROGRESS_KEY} from '../../lib/game/storage';
import {completed} from '../completed-case';
test('fresh campaign locks later cards and direct URLs without creating their saves',async({page})=>{
 await page.goto('/kasus');
 const cards=page.getByRole('article');await expect(cards.nth(0).getByRole('link',{name:'Selidiki Kasus'})).toBeVisible();
 for(const index of [1,2]){await expect(cards.nth(index)).toContainText('TERKUNCI');await expect(cards.nth(index).getByRole('link')).toHaveCount(0);}
 await expect(page.getByText('0 dari 3 episode selesai')).toBeVisible();
 for(const index of [1,2]){
  await page.goto(`/kasus/${allCases[index].id}`);await expect(page.getByRole('heading',{name:`Episode ${index+1} masih terkunci`})).toBeVisible();
  await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveCount(0);expect(await page.evaluate(key=>localStorage.getItem(key),saveKey(allCases[index].id))).toBeNull();
 }
 for(const width of [360,768,1440]){await page.setViewportSize({width,height:800});await page.screenshot({path:`test-results/locked-episode-${width}.png`,fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.getByRole('link',{name:'Mulai dari Episode 1'}).click();await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveAttribute('data-phase','intro');
});
test('completed results unlock the next episode, persist on refresh and survive replay',async({page})=>{
 await page.goto('/kasus');
 await page.evaluate(({key,save})=>localStorage.setItem(key,save),{key:saveKey(allCases[0].id),save:JSON.stringify(completed(allCases[0]))});await page.reload();
 await expect(page.getByText('1 dari 3 episode selesai')).toBeVisible();const cards=page.getByRole('article');await expect(cards.nth(1).getByRole('link',{name:'Selidiki Kasus'})).toBeVisible();await expect(cards.nth(2)).toContainText('TERKUNCI');
 await page.goto(`/kasus/${allCases[2].id}`);await expect(page.getByRole('heading',{name:'Episode 3 masih terkunci'})).toBeVisible();
 await page.goto(`/kasus/${allCases[1].id}`);await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveAttribute('data-phase','intro');
 await page.evaluate(({key,save})=>localStorage.setItem(key,save),{key:saveKey(allCases[1].id),save:JSON.stringify(completed(allCases[1]))});await page.reload();await expect(page.getByText('100 / 100',{exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)??'null')?.completed?.length,PROGRESS_KEY)).toBe(2);
 await page.goto('/kasus');await expect(page.getByText('2 dari 3 episode selesai')).toBeVisible();
 await page.getByRole('article').nth(0).getByRole('button',{name:'Mainkan Ulang',exact:true}).click();await page.getByRole('button',{name:'Ya, Mainkan Ulang'}).click();await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveAttribute('data-phase','intro');
 await page.goto(`/kasus/${allCases[2].id}`);await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveAttribute('data-phase','intro');await page.reload();await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveAttribute('data-phase','intro');
 await page.goto('/kasus');for(const width of [360,768,1440]){await page.setViewportSize({width,height:900});await page.screenshot({path:`test-results/campaign-progress-${width}.png`,fullPage:true,animations:'disabled'});}
});
