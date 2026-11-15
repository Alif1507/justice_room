import {test,expect} from '@playwright/test';
import {startGuided,collectGuided,clickAction,objection} from './helpers';
test('short phone exposes every full decision option without scrolling',async({page})=>{
 await page.setViewportSize({width:360,height:640});await startGuided(page);await collectGuided(page);await clickAction(page,'Lanjutkan Cerita');await objection(page);await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Tanya Lagi');await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Susun Penyelesaian');
 await page.screenshot({path:'test-results/short-phone-decision.png',animations:'disabled'});
 const positions=await page.getByRole('radio').evaluateAll(radios=>radios.map(r=>{const label=r.closest('label')!.getBoundingClientRect();const scene=r.closest('[data-phase]')!.getBoundingClientRect();return {bottom:label.bottom,sceneBottom:scene.bottom,top:label.top,sceneTop:scene.top};}));
 for(const p of positions){expect(p.bottom).toBeLessThanOrEqual(p.sceneBottom);expect(p.top).toBeGreaterThanOrEqual(p.sceneTop);}
 expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight)).toBe(true);
});
