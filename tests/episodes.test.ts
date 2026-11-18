import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allCases} from '../content/cases/index.ts';
import {validateCase} from '../content/cases/buku-rusak.ts';
import {initialState,reducer} from '../lib/game/reducer.ts';
import {score} from '../lib/game/selectors.ts';
import {readSave,writeSave,resetSave,validateSave,saveKey,SETTINGS_KEY} from '../lib/game/storage.ts';
import type {CaseDefinition,GameState} from '../lib/game/types.ts';
function investigate(c:CaseDefinition){
 let s=initialState(c);for(const node of c.nodes){void node;s=reducer(s,{type:'ADVANCE_DIALOGUE'},c);}
 for(const id of c.requiredEvidence){
  if(c.activity?.evidenceId===id){
   const blocked=reducer(s,{type:'COLLECT_EVIDENCE',evidenceId:id},c);assert.equal(blocked.evidenceIds.includes(id),false);
   s=reducer(s,{type:'SUBMIT_ACTIVITY',answerId:c.activity.choices.find(x=>x.id!==c.activity!.acceptedId)!.id},c);assert.equal(s.activityAnswerIds.length,0);
   s=reducer(s,{type:'SUBMIT_ACTIVITY',answerId:c.activity.acceptedId},c);
  }
  s=reducer(s,{type:'COLLECT_EVIDENCE',evidenceId:id},c);s=reducer(s,{type:'NEXT_INVESTIGATION'},c);
 }
 return s;
}
function finish(c:CaseDefinition):GameState{
 let s=reducer(investigate(c),{type:'ENTER_TESTIMONY'},c);
 s=reducer(s,{type:'SELECT_STATEMENT',statementId:'S02'},c);
 const pair=c.statements.find(t=>t.id==='S02')!.acceptedPairs[0];
 s=reducer(s,{type:'SUBMIT_OBJECTION',evidenceId:pair.evidenceId,reasonId:pair.reasonId},c);
 s=reducer(s,{type:'SELECT_STATEMENT',statementId:'S03'},c);s=reducer(s,{type:'PRESS_STATEMENT'},c);s=reducer(s,{type:'ENTER_DECISION'},c);
 const wrong=c.decisions.find(d=>d.id!==c.ending.decisionId)!;s=reducer(s,{type:'SELECT_DECISION',decisionId:wrong.id,reasonId:c.ending.reasonId},c);assert.equal(s.phase,'decision');
 s=reducer(s,{type:'SELECT_DECISION',decisionId:c.ending.decisionId,reasonId:c.ending.reasonId},c);assert.equal(s.phase,'reflection');
 for(const q of c.reflections)s=reducer(s,{type:'SUBMIT_REFLECTION',questionId:q.id,answerId:q.acceptedIds[0]},c);
 return reducer(s,{type:'FINISH_CASE'},c);
}
test('three real, distinct episode definitions validate and finish through all prerequisites',()=>{
 assert.equal(allCases.length,3);assert.equal(new Set(allCases.map(c=>c.id)).size,3);
 for(const c of allCases){assert.deepEqual(validateCase(c),[],c.id);const s=finish(c);assert.equal(s.phase,'result',c.id);assert.equal(score(s),100,c.id);assert.ok(validateSave(s,c));assert.equal(score(reducer(s,{type:'FINISH_CASE'},c)),100);}
 for(const c of allCases.slice(1)){assert.ok(c.activity);assert.equal(JSON.stringify(c).includes('botol'),false);}
});
test('activity completion cannot be forged or collected before the current investigation step',()=>{
 for(const c of allCases.slice(1)){
  let s=initialState(c);assert.equal(reducer(s,{type:'SUBMIT_ACTIVITY',answerId:c.activity!.acceptedId},c),s);
  s=investigate(c);assert.equal(s.activityAnswerIds.length,1);
  assert.equal(validateSave({...s,activityAnswerIds:[]},c),null);
  assert.equal(validateSave({...s,activityAnswerIds:['unknown']},c),null);
 }
});
test('replay resets only the selected episode, preserving other progress and settings',()=>{
 const map=new Map<string,string>([[SETTINGS_KEY,'keep'],['unrelated','keep']]);const storage={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);},removeItem:(k:string)=>{map.delete(k);}};
 for(const c of allCases)assert.ok(writeSave(storage,finish(c)));
 const protectedKeys=allCases.slice(1).map(c=>[saveKey(c.id),storage.getItem(saveKey(c.id))]);
 assert.ok(resetSave(storage,allCases[0]));assert.equal(readSave(storage,allCases[0]).status,'empty');
 for(const [key,value] of protectedKeys)assert.equal(storage.getItem(key!),value);
 assert.equal(storage.getItem(SETTINGS_KEY),'keep');assert.equal(storage.getItem('unrelated'),'keep');
 for(const c of allCases){const replay=reducer(finish(c),{type:'RESET_CASE'},c);assert.equal(replay.caseId,c.id);assert.equal(replay.phase,'intro');assert.equal(score(replay),0);assert.equal(replay.activityAnswerIds.length,0);}
});
test('cross-episode saves cannot be restored; original saves without activity field stay compatible',()=>{
 for(const c of allCases)for(const other of allCases.filter(x=>x.id!==c.id))assert.equal(validateSave(finish(c),other),null);
 const original={...finish(allCases[0])} as Partial<GameState>;delete original.activityAnswerIds;assert.ok(validateSave(original,allCases[0]));
});

test('updated roster itself supports the agreed-time objection in Episode 2',()=>{
 const c=allCases[1];let s=reducer(investigate(c),{type:'ENTER_TESTIMONY'},c);s=reducer(s,{type:'SELECT_STATEMENT',statementId:'S02'},c);
 s=reducer(s,{type:'SUBMIT_OBJECTION',evidenceId:'E02',reasonId:'waktu-disepakati'},c);assert.ok(s.resolvedStatementIds.includes('S02'));assert.equal(score(s),50);
 s=reducer(s,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'waktu-disepakati'},c);assert.equal(score(s),50);
});
