import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allCases} from '../content/cases/index.ts';
import {completed} from './completed-case.ts';
import {initialState,reducer} from '../lib/game/reducer.ts';
import {getDecisionEnding} from '../lib/game/endings.ts';
import {validateSave} from '../lib/game/storage.ts';
import {expectedMilestones,score} from '../lib/game/selectors.ts';
import {validateCase} from '../content/cases/buku-rusak.ts';
import type {CaseDefinition,GameState} from '../lib/game/types.ts';
function decisionState(c:CaseDefinition):GameState{const s={...completed(c),phase:'decision' as const,decisionId:undefined,decisionReasonId:undefined,reflectionAnswerIds:[],reflectionNote:''};return {...s,milestoneIds:expectedMilestones(s,c)};}
test('every solution has a distinct authored ending and invalid phases cannot select one',()=>{
 for(const c of allCases){assert.equal(getDecisionEnding(initialState(c),c),null);assert.equal(new Set(c.decisions.map(d=>d.outcome.id)).size,3);
  for(const d of c.decisions){const s=reducer(decisionState(c),{type:'SELECT_DECISION',decisionId:d.id,reasonId:c.ending.reasonId},c);assert.equal(getDecisionEnding(s,c)?.id,d.outcome.id);assert.equal(d.outcome.beats.length,3);assert.deepEqual(validateCase(c),[]);}
 }
});
test('a fair solution with the wrong reason has a reconsideration ending and cannot finish',()=>{
 for(const c of allCases){const s=reducer(decisionState(c),{type:'SELECT_DECISION',decisionId:c.ending.decisionId,reasonId:c.decisionReasons.find(r=>r.id!==c.ending.reasonId)!.id},c);assert.equal(getDecisionEnding(s,c)?.id,c.reasonEnding.id);assert.equal(s.phase,'decision');assert.equal(reducer(s,{type:'FINISH_CASE'},c),s);assert.equal(score(s),50);}
});
test('rejected endings restore and retry clears only the choice, retaining evidence and milestones',()=>{
 for(const c of allCases){const s=reducer(decisionState(c),{type:'SELECT_DECISION',decisionId:c.decisions.find(d=>d.id!==c.ending.decisionId)!.id,reasonId:c.ending.reasonId},c);const restored=validateSave(s,c)!;assert.ok(restored);assert.equal(getDecisionEnding(restored,c)?.id,getDecisionEnding(s,c)?.id);
 const retry=reducer(restored,{type:'RETRY_DECISION'},c);assert.equal(retry.phase,'decision');assert.equal(retry.decisionId,undefined);assert.equal(getDecisionEnding(retry,c),null);assert.deepEqual(retry.evidenceIds,s.evidenceIds);assert.deepEqual(retry.milestoneIds,s.milestoneIds);
 const correct=reducer(retry,{type:'SELECT_DECISION',decisionId:c.ending.decisionId,reasonId:c.ending.reasonId},c);assert.equal(correct.phase,'reflection');assert.equal(reducer(correct,{type:'RETRY_DECISION'},c),correct);assert.equal(reducer(initialState(c),{type:'RETRY_DECISION'},c).phase,'intro');}
});
test('content validation rejects broken ending speakers and duplicate ending IDs',()=>{
 const c=structuredClone(allCases[0]);c.decisions[0].outcome.beats[0].speakerId='missing';assert.ok(validateCase(c).includes('Invalid ending speaker'));
 c.decisions[0].outcome.id=c.decisions[1].outcome.id;assert.ok(validateCase(c).some(e=>e.includes('Duplicate endings')));
});
