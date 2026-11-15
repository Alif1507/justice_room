import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, reducer } from '../lib/game/reducer.ts';
import { score, canDecide } from '../lib/game/selectors.ts';
import { validateSave, readSave, writeSave, resetSave, SAVE_KEY } from '../lib/game/storage.ts';
import { validateCase, bookCase } from '../content/cases/buku-rusak.ts';
import type { GameState, GameEvent } from '../lib/game/types.ts';
const act = (s: GameState, e: GameEvent) => reducer(s,e);
function investigated(){
 let s=initialState();
 for(let i=0;i<4;i++) s=act(s,{type:'ADVANCE_DIALOGUE'});
 for(const [locationId,evidenceId] of [['meja','E01'],['pojok','E02'],['pojok','E03'],['koridor','E04']]){
 s=act(s,{type:'VISIT_LOCATION',locationId});s=act(s,{type:'COLLECT_EVIDENCE',evidenceId});
 } return s;
}
function ready(){
 let s=act(investigated(),{type:'ENTER_TESTIMONY'});
 s=act(s,{type:'SELECT_STATEMENT',statementId:'S02'});
 s=act(s,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'raka-kering'});
 s=act(s,{type:'SELECT_STATEMENT',statementId:'S03'});
 return act(s,{type:'PRESS_STATEMENT'});
}
test('case references and ending are valid',()=>assert.deepEqual(validateCase(bookCase),[]));
test('phase guards and collection prerequisites reject invalid actions',()=>{
 const s=initialState();assert.equal(act(s,{type:'ENTER_TESTIMONY'}).phase,'intro');
 assert.equal(act(s,{type:'COLLECT_EVIDENCE',evidenceId:'E05'}).evidenceIds.length,0);
 assert.equal(act(investigated(),{type:'ENTER_DECISION'}).phase,'investigation');
});
test('unique evidence scores 20 and enters testimony without E05',()=>{
 const s=investigated();assert.equal(score(s),20);
 assert.equal(score(act(s,{type:'COLLECT_EVIDENCE',evidenceId:'E04'})),20);
 assert.equal(s.evidenceIds.length,4);assert.equal(act(s,{type:'ENTER_TESTIMONY'}).phase,'testimony');
});
test('objections require active statement and correct evidence plus reason; retries are safe',()=>{
 let s=act(investigated(),{type:'ENTER_TESTIMONY'});
 s=act(s,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'raka-kering'});assert.equal(score(s),20);
 s=act(s,{type:'SELECT_STATEMENT',statementId:'S02'});
 s=act(s,{type:'SUBMIT_OBJECTION',evidenceId:'E03',reasonId:'raka-kering'});assert.match(s.feedback,/foto/i);assert.equal(score(s),20);
 s=act(s,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'terakhir-salah'});assert.equal(score(s),20);
 s=act(s,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'raka-kering'});assert.equal(score(s),50);
 assert.equal(score(act(s,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'raka-kering'})),50);
});
test('S03 press acquires E05 once during testimony and unlocks decision',()=>{
 const s=ready();assert.ok(s.evidenceIds.includes('E05'));assert.ok(canDecide(s));
 assert.equal(act(s,{type:'PRESS_STATEMENT'}).evidenceIds.length,5);
 assert.equal(act(s,{type:'ENTER_DECISION'}).phase,'decision');
});
test('wrong decision and reason can be retried through complete reflection and result',()=>{
 let s=act(ready(),{type:'ENTER_DECISION'});
 s=act(s,{type:'SELECT_DECISION',decisionId:'bima',reasonId:'urutan-air'});assert.equal(s.phase,'decision');assert.equal(score(s),50);
 s=act(s,{type:'SELECT_DECISION',decisionId:'bersama',reasonId:'banyak-tuduhan'});assert.equal(s.phase,'decision');
 s=act(s,{type:'SELECT_DECISION',decisionId:'bersama',reasonId:'urutan-air'});assert.equal(s.phase,'reflection');assert.equal(score(s),80);
 assert.equal(act(s,{type:'FINISH_CASE'}).phase,'reflection');
 s=act(s,{type:'SUBMIT_REFLECTION',questionId:'fakta',answerId:'dugaan'});assert.equal(score(s),80);
 s=act(s,{type:'SUBMIT_REFLECTION',questionId:'fakta',answerId:'diamati'});
 s=act(s,{type:'SUBMIT_REFLECTION',questionId:'dengar',answerId:'lengkap'});
 assert.equal(act(s,{type:'FINISH_CASE'}).phase,'reflection');
 s=act(s,{type:'SUBMIT_REFLECTION',questionId:'tindakan',answerId:'pisahkan'});
 s=act(s,{type:'SET_NOTE',note:'Idemu tidak dinilai'});s=act(s,{type:'FINISH_CASE'});
 assert.equal(s.phase,'result');assert.equal(score(s),100);assert.ok(validateSave(s));
});
test('restore rejects invalid versions, IDs, forged phases, milestones and E05 without S03',()=>{
 const s=ready();assert.ok(validateSave(s));
 for(const patch of [{phase:'result'},{caseContentVersion:999},{evidenceIds:['X']},{statementId:'X'},{milestoneIds:['solve']},{dialogueNodeId:'X'},{pressedStatementIds:[]},{schemaVersion:2}]){
 assert.equal(validateSave({...s,...patch}),null,JSON.stringify(patch));}
 assert.equal(validateSave({...s,evidenceIds:[...s.evidenceIds,'E04']}),null);
 assert.equal(act(initialState(),{type:'RESTORE_SAVE',save:{...s,phase:'result'}}).phase,'intro');
});
test('reload investigation and testimony preserves progress and unique scores',()=>{
 for(const s of [investigated(),ready()]){const restored=validateSave(JSON.parse(JSON.stringify(s)));assert.ok(restored);assert.equal(score(restored),score(s));assert.equal(restored.phase,s.phase);}
});
test('storage failures, corruption and case-scoped reset are safe',()=>{
 const map=new Map<string,string>([['unrelated','keep'],['justice-room:settings','keep']]);
 const store={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);},removeItem:(k:string)=>{map.delete(k);}};
 assert.equal(readSave(store).status,'empty');assert.ok(writeSave(store,investigated()));assert.equal(readSave(store).status,'valid');
 store.setItem(SAVE_KEY,'{broken');assert.equal(readSave(store).status,'invalid');assert.ok(map.has(SAVE_KEY));
 resetSave(store);assert.equal(map.get('unrelated'),'keep');assert.equal(map.get('justice-room:settings'),'keep');
 const blocked={getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('quota');},removeItem:()=>{throw Error('blocked');}};
 assert.equal(readSave(blocked).status,'unavailable');assert.equal(writeSave(blocked,initialState()),false);assert.equal(resetSave(blocked),false);
});

test('pressing S03 before correcting S02 also unlocks decision without circular prerequisites',()=>{
 let s=act(investigated(),{type:'ENTER_TESTIMONY'});
 s=act(s,{type:'SELECT_STATEMENT',statementId:'S03'});s=act(s,{type:'PRESS_STATEMENT'});
 assert.ok(s.evidenceIds.includes('E05'));assert.equal(canDecide(s),false);
 s=act(s,{type:'SELECT_STATEMENT',statementId:'S02'});
 s=act(s,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'raka-kering'});
 assert.ok(canDecide(s));
});
test('inventory and phase checks reject unavailable evidence, unknown IDs and post-result actions',()=>{
 let s=initialState();for(let i=0;i<4;i++)s=act(s,{type:'ADVANCE_DIALOGUE'});
 assert.equal(act(s,{type:'COLLECT_EVIDENCE',evidenceId:'E04'}),s);
 assert.equal(act(s,{type:'VISIT_LOCATION',locationId:'secret'}),s);
 assert.equal(act(s,{type:'SUBMIT_REFLECTION',questionId:'fakta',answerId:'diamati'}),s);
 assert.equal(act(s,{type:'SELECT_DECISION',decisionId:'bersama',reasonId:'urutan-air'}),s);
});
test('a wrong reason explains the relationship between the evidence and statement',()=>{
 let s=act(investigated(),{type:'ENTER_TESTIMONY'});s=act(s,{type:'SELECT_STATEMENT',statementId:'S02'});
 s=act(s,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'terakhir-salah'});
 assert.match(s.feedback,/Raka/);assert.match(s.feedback,/alasan/i);assert.equal(score(s),20);
});
test('content validator detects duplicate IDs, invalid references and unreachable endings',()=>{
 const duplicate=structuredClone(bookCase);duplicate.evidence.push(duplicate.evidence[0]);assert.ok(validateCase(duplicate).length);
 const bad=structuredClone(bookCase);bad.statements[0].speakerId='missing';assert.ok(validateCase(bad).length);
 const ending=structuredClone(bookCase);ending.ending.decisionId='missing';assert.ok(validateCase(ending).length);
});

test('successful decision data cannot be restored into an earlier phase',()=>{
 let s=act(ready(),{type:'ENTER_DECISION'});s=act(s,{type:'SELECT_DECISION',decisionId:'bersama',reasonId:'urutan-air'});
 assert.equal(s.phase,'reflection');assert.equal(validateSave({...s,phase:'testimony'}),null);
});
test('case validator rejects an ending when the required objection is unreachable',()=>{
 const c=structuredClone(bookCase);c.statements.find(s=>s.id==='S02')!.acceptedPairs=[];
 assert.ok(validateCase(c).length);
});

test('save enums must be primitive strings, never arrays or coercible objects',()=>{
 for(const phase of [['result'],['investigation'],{toString:()=> 'result'},null,42]){
 assert.equal(validateSave({...initialState(),phase,dialogueNodeId:'investigation-start'}),null);
 }
});
