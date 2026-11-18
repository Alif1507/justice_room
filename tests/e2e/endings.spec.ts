import {test,expect} from '@playwright/test';
import {allCases} from '../../content/cases';
import {completed} from '../completed-case';
import {expectedMilestones} from '../../lib/game/selectors';
import {saveKey,PROGRESS_KEY} from '../../lib/game/storage';
import {clickAction,advanceTo} from './helpers';
for(const c of allCases){
 test(`episode ${c.presentation.episode} shows all distinct choice endings, reason retry and restore`,async({page})=>{
  const finished=completed(c);const base={...finished,phase:'decision' as const,decisionId:undefined,decisionReasonId:undefined,reflectionAnswerIds:[],reflectionNote:''};const save={...base,milestoneIds:expectedMilestones(base,c)};
  await page.addInitScript(({key,save,progressKey,previous})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(save));if(!localStorage.getItem(progressKey))localStorage.setItem(progressKey,JSON.stringify({schemaVersion:1,completed:previous}));},{key:saveKey(c.id),save,progressKey:PROGRESS_KEY,previous:allCases.slice(0,c.presentation.episode-1).map(x=>({caseId:x.id,caseContentVersion:x.version}))});
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`/kasus/${c.id}`);
  const branchChoices=[...c.decisions.filter(d=>d.id!==c.ending.decisionId),c.decisions.find(d=>d.id===c.ending.decisionId)!,c.decisions.find(d=>d.id===c.ending.decisionId)!];
  for(const [index,d] of branchChoices.entries()){
   if(index===3){await page.evaluate(({key,save})=>localStorage.setItem(key,JSON.stringify(save)),{key:saveKey(c.id),save});await page.reload();}
   const wrongReason=index===2;const reason=wrongReason?c.decisionReasons.find(r=>r.id!==c.ending.reasonId)!:c.decisionReasons.find(r=>r.id===c.ending.reasonId)!;
   const ending=wrongReason?c.reasonEnding:d.outcome;
   await page.getByLabel(d.text,{exact:true}).check();await clickAction(page,'Pilih Alasan');await page.getByLabel(reason.text,{exact:true}).check();await clickAction(page,'Sampaikan Solusi');
   const stage=page.getByRole('region',{name:'Panggung Cerita'});await expect(stage).toHaveAttribute('data-ending',ending.id);await expect(page.getByRole('heading',{name:ending.title,exact:true})).toBeVisible();
   expect(await page.getByRole('region',{name:'Adegan akhir pilihanmu'}).evaluate(el=>el.getAnimations({subtree:true}).length)).toBe(0);
   for(const width of [360,768,1440]){await page.setViewportSize({width,height:640});await page.screenshot({path:`test-results/ending-${ending.id}-${width}.png`,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight)).toBe(true);
    const bounds=await page.getByRole('region',{name:'Adegan akhir pilihanmu'}).evaluate(el=>{const p=el.querySelector('p')!.getBoundingClientRect();const r=el.getBoundingClientRect();return {textBottom:p.bottom,frameBottom:r.bottom,textTop:p.top,frameTop:r.top};});expect(bounds.textBottom).toBeLessThanOrEqual(bounds.frameBottom);expect(bounds.textTop).toBeGreaterThanOrEqual(bounds.frameTop);
   }
   if(index===0){await page.reload();await expect(stage).toHaveAttribute('data-ending',ending.id);await expect(stage).toHaveAttribute('data-ending-beat','1');}
   if(index<3){await clickAction(page,'Coba Solusi Lain');await expect(stage).not.toHaveAttribute('data-ending');await expect(page.getByRole('radio')).toHaveCount(3);const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),saveKey(c.id));expect(saved.evidenceIds).toEqual(save.evidenceIds);expect(saved.milestoneIds).toEqual(save.milestoneIds);}
   else{const action=await advanceTo(page,'Mulai Refleksi');await action.focus();await page.keyboard.press('Enter');await expect(page.getByRole('radio')).toHaveCount(c.reflections[0].choices.length);}
  }
 });
}
