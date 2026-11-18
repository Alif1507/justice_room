import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialPresentation,presentationReducer} from '../lib/game/presentation.ts';
import {score} from '../lib/game/selectors.ts';
import type {GameEvent} from '../lib/game/types.ts';
const run=(events:GameEvent[])=>events.reduce((p,e)=>presentationReducer(p,e),initialPresentation());
const intro:GameEvent[]=Array.from({length:4},()=>({type:'ADVANCE_DIALOGUE'}));
const investigation:GameEvent[]=[...intro,{type:'COLLECT_EVIDENCE',evidenceId:'E01'},{type:'VISIT_LOCATION',locationId:'pojok'},{type:'COLLECT_EVIDENCE',evidenceId:'E02'},{type:'COLLECT_EVIDENCE',evidenceId:'E03'},{type:'VISIT_LOCATION',locationId:'koridor'},{type:'COLLECT_EVIDENCE',evidenceId:'E04'}];
test('new evidence produces a presentation cue without changing game scoring',()=>{
 const p=run([...intro,{type:'COLLECT_EVIDENCE',evidenceId:'E01'}]);
 assert.equal(p.moment?.kind,'evidence');assert.equal(p.moment?.evidenceId,'E01');assert.equal(score(p.game),5);
 const repeated=presentationReducer(p,{type:'COLLECT_EVIDENCE',evidenceId:'E01'});
 assert.equal(repeated.moment,null);assert.equal(repeated.sequence,p.sequence);assert.equal(score(repeated.game),5);
});
test('invalid actions and restored saves do not fabricate or replay story cues',()=>{
 const p=initialPresentation();assert.equal(presentationReducer(p,{type:'COLLECT_EVIDENCE',evidenceId:'E05'}).moment,null);
 const played=run(investigation);const restored=presentationReducer(p,{type:'RESTORE_SAVE',save:played.game});
 assert.equal(restored.moment,null);assert.deepEqual(restored.game.evidenceIds,played.game.evidenceIds);
});
test('E05 reconstruction appears only on the first valid press of S03',()=>{
 let p=run([...investigation,{type:'ENTER_TESTIMONY'},{type:'SELECT_STATEMENT',statementId:'S03'},{type:'PRESS_STATEMENT'}]);
 assert.equal(p.moment?.kind,'spill');assert.ok(p.game.evidenceIds.includes('E05'));
 p=presentationReducer(p,{type:'PRESS_STATEMENT'});assert.equal(p.moment,null);
});
test('objection cue follows submission and distinguishes supported and unsupported pairs',()=>{
 let p=run([...investigation,{type:'ENTER_TESTIMONY'},{type:'SELECT_STATEMENT',statementId:'S02'}]);
 assert.equal(p.moment,null);
 p=presentationReducer(p,{type:'SUBMIT_OBJECTION',evidenceId:'E03',reasonId:'raka-kering'});
 assert.equal(p.moment?.kind,'objection');assert.equal(p.moment?.supported,false);assert.equal(score(p.game),20);
 p=presentationReducer(p,{type:'SUBMIT_OBJECTION',evidenceId:'E04',reasonId:'raka-kering'});
 assert.equal(p.moment?.supported,true);assert.equal(score(p.game),50);
});
test('skipping a cue leaves progression and score unchanged; stale callbacks cannot dismiss newer cues',()=>{
 const first=run([...intro,{type:'COLLECT_EVIDENCE',evidenceId:'E01'}]);
 const next=presentationReducer(presentationReducer(first,{type:'VISIT_LOCATION',locationId:'pojok'}),{type:'COLLECT_EVIDENCE',evidenceId:'E02'});
 assert.equal(presentationReducer(next,{type:'DISMISS_MOMENT',sequence:first.sequence}),next);
 const dismissed=presentationReducer(next,{type:'DISMISS_MOMENT',sequence:next.sequence});
 assert.equal(dismissed.moment,null);assert.equal(dismissed.game,next.game);assert.equal(score(dismissed.game),10);
});
