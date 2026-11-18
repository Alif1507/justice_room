import {test,expect} from '@playwright/test';
import {allCases} from '../../content/cases';
import {completed} from '../completed-case';
import {saveKey,SETTINGS_KEY} from '../../lib/game/storage';

test('three live cards expose confirmed replay without clearing another episode',async({page})=>{
 await page.goto('/kasus');await expect(page.getByRole('article')).toHaveCount(3);
 const saves=allCases.map(c=>({key:saveKey(c.id),value:JSON.stringify(completed(c))}));
 await page.evaluate(({saves,key})=>{for(const s of saves)localStorage.setItem(s.key,s.value);localStorage.setItem(key,JSON.stringify({mute:true,instantText:true,reducedMotion:true}));},{saves,key:SETTINGS_KEY});await page.reload();
 for(const width of [360,768,1440]){await page.setViewportSize({width,height:900});await page.screenshot({path:`test-results/three-episodes-${width}.png`,fullPage:true,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 const selected=allCases[1];const card=page.getByRole('article',{name:`Episode 2: ${selected.title}`});await card.getByRole('button',{name:'Mainkan Ulang',exact:true}).click();await page.getByRole('button',{name:'Batal',exact:true}).click();expect(await page.evaluate(key=>localStorage.getItem(key),saveKey(selected.id))).toBe(saves[1].value);
 await card.getByRole('button',{name:'Mainkan Ulang',exact:true}).click();await page.getByRole('button',{name:'Ya, Mainkan Ulang',exact:true}).click();await expect(page).toHaveURL(/\/kasus\/piket-terlupakan$/);await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveAttribute('data-phase','intro');
 for(const saved of [saves[0],saves[2]])expect(await page.evaluate(key=>localStorage.getItem(key),saved.key)).toBe(saved.value);
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).reducedMotion,SETTINGS_KEY)).toBe(true);
});
