import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allCases} from '../content/cases/index.ts';
import {readProgress,PROGRESS_KEY,resetSave,saveKey,writeSave} from '../lib/game/storage.ts';
import {initialState,reducer} from '../lib/game/reducer.ts';
import type {CaseDefinition} from '../lib/game/types.ts';
function completed(c:CaseDefinition){
 let s=initialState(c);for(const n of c.nodes){void n;s=reducer(s,{type:'ADVANCE_DIALOGUE'},c);}
 for(const id of c.requiredEvidence){if(c.activity?.evidenceId===id)s=reducer(s,{type:'SUBMIT_ACTIVITY',answerId:c.activity.acceptedId},c);s=reducer(s,{type:'COLLECT_EVIDENCE',evidenceId:id},c);s=reducer(s,{type:'NEXT_INVESTIGATION'},c);}
 s=reducer(s,{type:'ENTER_TESTIMONY'},c);s=reducer(s,{type:'SELECT_STATEMENT',statementId:'S02'},c);s=reducer(s,{type:'SUBMIT_OBJECTION',...c.statements.find(t=>t.id==='S02')!.acceptedPairs[0]},c);s=reducer(s,{type:'SELECT_STATEMENT',statementId:'S03'},c);s=reducer(s,{type:'PRESS_STATEMENT'},c);s=reducer(s,{type:'ENTER_DECISION'},c);s=reducer(s,{type:'SELECT_DECISION',decisionId:c.ending.decisionId,reasonId:c.ending.reasonId},c);for(const q of c.reflections)s=reducer(s,{type:'SUBMIT_REFLECTION',questionId:q.id,answerId:q.acceptedIds[0]},c);return reducer(s,{type:'FINISH_CASE'},c);
}
function memory(){const map=new Map<string,string>();return {map,getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);},removeItem:(k:string)=>{map.delete(k);}};}
test('campaign starts at episode one and unlocks only after results, in order',()=>{
 const store=memory();assert.deepEqual(readProgress(store).completedIds,[]);
 writeSave(store,initialState(allCases[0]));assert.deepEqual(readProgress(store).completedIds,[]);
 writeSave(store,completed(allCases[1]));assert.deepEqual(readProgress(store).completedIds,[]);
 writeSave(store,completed(allCases[0]));assert.deepEqual(readProgress(store).completedIds,allCases.slice(0,2).map(c=>c.id));
 writeSave(store,completed(allCases[2]));assert.deepEqual(readProgress(store).completedIds,allCases.map(c=>c.id));
});
test('legacy completed saves retain unlocks after a confirmed replay reset',()=>{
 const store=memory();store.setItem(saveKey(allCases[0].id),JSON.stringify(completed(allCases[0])));
 assert.deepEqual(readProgress(store).completedIds,[allCases[0].id]);assert.ok(resetSave(store,allCases[0]));
 assert.equal(store.getItem(saveKey(allCases[0].id)),null);assert.deepEqual(readProgress(store).completedIds,[allCases[0].id]);
 writeSave(store,initialState(allCases[0]));assert.deepEqual(readProgress(store).completedIds,[allCases[0].id]);
});
test('malformed, stale and nonsequential completion records cannot skip episodes',()=>{
 const store=memory();for(const value of ['{',JSON.stringify({schemaVersion:2,completed:[]}),JSON.stringify({schemaVersion:1,completed:[{caseId:allCases[1].id,caseContentVersion:allCases[1].version}]}),JSON.stringify({schemaVersion:1,completed:[{caseId:allCases[0].id,caseContentVersion:-1}]})]){store.setItem(PROGRESS_KEY,value);assert.deepEqual(readProgress(store).completedIds,[]);}
 store.setItem(saveKey(allCases[0].id),JSON.stringify({...initialState(allCases[0]),phase:'result'}));assert.deepEqual(readProgress(store).completedIds,[]);
});
test('unavailable storage stays safe and a failed unlock save prevents destructive replay',()=>{
 const store=memory();store.setItem(saveKey(allCases[0].id),JSON.stringify(completed(allCases[0])));
 const blocked={...store,setItem:()=>{throw Error('quota');}};assert.equal(resetSave(blocked,allCases[0]),false);assert.notEqual(store.getItem(saveKey(allCases[0].id)),null);
 assert.equal(readProgress({...store,getItem:()=>{throw Error('blocked');}}).unavailable,true);
});
