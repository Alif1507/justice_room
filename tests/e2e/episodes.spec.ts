import {test,expect,type Page} from '@playwright/test';
import {allCases} from '../../content/cases';
import {initialState} from '../../lib/game/reducer';
import {saveKey,SETTINGS_KEY,PROGRESS_KEY} from '../../lib/game/storage';
import {clickAction} from './helpers';
import type {CaseDefinition} from '../../lib/game/types';
async function fit(page:Page,name:string){
 for(const {width,height} of [{width:360,height:640},{width:768,height:800},{width:1440,height:900}]){
  await page.setViewportSize({width,height});await page.screenshot({path:`test-results/${name}-${width}.png`,animations:'disabled'});
  expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight&&document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const p of await page.locator('[aria-label="Panggung Cerita"] input[type=radio], [aria-label="Panggung Cerita"] dl>div, [aria-label="Panggung Cerita"] li').evaluateAll(radios=>radios.map(r=>{const label=(r.closest('label')??r).getBoundingClientRect();const scene=r.closest('[data-phase]')!.getBoundingClientRect();return {bottom:label.bottom,sceneBottom:scene.bottom,top:label.top,sceneTop:scene.top};}))){expect(p.bottom).toBeLessThanOrEqual(p.sceneBottom);expect(p.top).toBeGreaterThanOrEqual(p.sceneTop);}
 }
}
async function chooseObjection(page:Page,c:CaseDefinition,wrong=false){
 await clickAction(page,wrong?'KEBERATAN!':'Coba Bukti Lain');
 const pair=c.statements.find(t=>t.id==='S02')!.acceptedPairs[0];
 await page.getByLabel(c.evidence.find(e=>e.id===(wrong?'E01':pair.evidenceId))!.title,{exact:true}).check();await clickAction(page,'Pilih Alasan');
 await page.getByLabel(c.objectionReasons.find(r=>r.id===pair.reasonId)!.text,{exact:true}).check();await clickAction(page,'Ajukan Bukti');
}
for(const c of allCases){
 test(`episode ${c.presentation.episode} completes, retries, reloads and replays independently`,async({page})=>{
  // Isolated episode coverage starts with its prerequisite episodes completed.
  await page.addInitScript(({key,completed})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({schemaVersion:1,completed}));},{key:PROGRESS_KEY,completed:allCases.slice(0,c.presentation.episode-1).map(x=>({caseId:x.id,caseContentVersion:x.version}))});
  await page.goto(`/kasus/${c.id}`);await clickAction(page,'Mulai Penyelidikan');
  for(const [i,id] of c.requiredEvidence.entries()){
   const hotspot=c.locations.flatMap(l=>l.hotspots).find(h=>h.evidenceId===id)!;await clickAction(page,hotspot.label);
   if(c.activity?.evidenceId===id){
    const task=c.activity;for(let index=0;index<task.displayItems.length;index++){await fit(page,`${c.id}-source-${index}`);await clickAction(page,index===task.displayItems.length-1?'Mulai Tantangan':'Data Berikutnya');}await page.getByLabel(task.choices.find(x=>x.id!==task.acceptedId)!.text,{exact:true}).check();await clickAction(page,'Periksa Pilihan');await expect(page.getByRole('status')).not.toBeEmpty();await clickAction(page,'Coba Lagi');
    await page.getByLabel(task.choices.find(x=>x.id===task.acceptedId)!.text,{exact:true}).check();await fit(page,`${c.id}-activity`);await clickAction(page,'Periksa Pilihan');await clickAction(page,'Simpan Bukti');
   }
   if(i===1){await page.reload();await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveAttribute('data-phase','investigation');}
   await clickAction(page,i===c.requiredEvidence.length-1?'Masuk Musyawarah':'Petunjuk Berikutnya');
  }
  await clickAction(page,'Lanjutkan Cerita');await chooseObjection(page,c,true);await expect(page.getByRole('status')).not.toBeEmpty();await chooseObjection(page,c);await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Tanya Lagi');await page.reload();
  if(c.id!=='buku-rusak'){await fit(page,`${c.id}-revelation`);await expect(page.getByText(c.presentation.revelation.title,{exact:true})).toBeVisible();await expect(page.getByRole('region',{name:'Panggung Cerita'})).not.toContainText('botol');}
  await clickAction(page,'Lanjutkan Cerita');await clickAction(page,'Susun Penyelesaian');
  const wrong=c.decisions.find(d=>d.id!==c.ending.decisionId)!;
  await page.getByLabel(wrong.text,{exact:true}).check();await clickAction(page,'Pilih Alasan');await page.getByLabel(c.decisionReasons.find(r=>r.id===c.ending.reasonId)!.text,{exact:true}).check();await clickAction(page,'Sampaikan Solusi');await clickAction(page,'Coba Solusi Lain');
  await page.getByLabel(c.decisions.find(d=>d.id===c.ending.decisionId)!.text,{exact:true}).check();await fit(page,`${c.id}-decision`);await clickAction(page,'Pilih Alasan');await page.getByLabel(c.decisionReasons.find(r=>r.id===c.ending.reasonId)!.text,{exact:true}).check();await clickAction(page,'Sampaikan Solusi');
  await clickAction(page,'Mulai Refleksi');
  for(const [i,q] of c.reflections.entries()){
   await page.getByLabel(q.choices.find(x=>x.id===q.acceptedIds[0])!.text,{exact:true}).check();await clickAction(page,i===c.reflections.length-1?'Catat Ide Kecilmu':'Pertanyaan Berikutnya');
  }
  await page.getByLabel('Catatan kecilmu (boleh dikosongkan)').fill('Aku akan mendengarkan dan bekerja sama.');await clickAction(page,'Lihat Hasil Belajar');await expect(page.getByText('100 / 100',{exact:true})).toBeVisible();await fit(page,`${c.id}-result`);
  const other=allCases.find(x=>x.id!==c.id)!;const protectedSave=JSON.stringify(initialState(other));const protectedSettings=JSON.stringify({mute:true,instantText:true,reducedMotion:true});
  await page.evaluate(({key,save,settingsKey,settings})=>{localStorage.setItem(key,save);localStorage.setItem(settingsKey,settings);},{key:saveKey(other.id),save:protectedSave,settingsKey:SETTINGS_KEY,settings:protectedSettings});
  await page.getByRole('button',{name:'Mainkan Ulang Episode',exact:true}).click();await page.getByRole('button',{name:'Batal',exact:true}).click();await expect(page.getByText('100 / 100',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Mainkan Ulang Episode',exact:true}).click();await page.getByRole('button',{name:'Ya, Mulai Ulang',exact:true}).click();await expect(page.getByRole('region',{name:'Panggung Cerita'})).toHaveAttribute('data-phase','intro');
  expect(await page.evaluate(key=>localStorage.getItem(key),saveKey(other.id))).toBe(protectedSave);expect(await page.evaluate(key=>localStorage.getItem(key),SETTINGS_KEY)).toBe(protectedSettings);
  await clickAction(page,'Mulai Penyelidikan');const first=c.locations.flatMap(l=>l.hotspots).find(h=>h.evidenceId===c.requiredEvidence[0])!;await clickAction(page,first.label);
  const replaySave=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),saveKey(c.id));expect(replaySave.caseId).toBe(c.id);expect(replaySave.evidenceIds).toEqual([c.requiredEvidence[0]]);
 });
}
