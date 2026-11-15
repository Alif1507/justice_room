import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getInvestigationFocus,paginateSubtitle,getNextStatement} from '../lib/game/guided.ts';
import {initialState,reducer} from '../lib/game/reducer.ts';
import type {GameState} from '../lib/game/types.ts';
const begin=()=>{let s=initialState();for(let i=0;i<4;i++)s=reducer(s,{type:'ADVANCE_DIALOGUE'});return s;};
test('one investigation focus stays on the discovery until the player continues',()=>{
 let s=begin();assert.equal(getInvestigationFocus(s).hotspot.evidenceId,'E01');
 s=reducer(s,{type:'COLLECT_EVIDENCE',evidenceId:'E01'});assert.equal(getInvestigationFocus(s).hotspot.evidenceId,'E01');assert.equal(getInvestigationFocus(s).collected,true);
 s=reducer(s,{type:'NEXT_INVESTIGATION'});assert.equal(s.locationId,'pojok');assert.equal(getInvestigationFocus(s).hotspot.evidenceId,'E02');assert.equal(getInvestigationFocus(s).collected,false);
 s=reducer(s,{type:'COLLECT_EVIDENCE',evidenceId:'E02'});s=reducer(s,{type:'NEXT_INVESTIGATION'});assert.equal(getInvestigationFocus(s).hotspot.evidenceId,'E03');
 s=reducer(s,{type:'COLLECT_EVIDENCE',evidenceId:'E03'});s=reducer(s,{type:'NEXT_INVESTIGATION'});assert.equal(s.locationId,'koridor');assert.equal(getInvestigationFocus(s).hotspot.evidenceId,'E04');
});
test('next investigation cannot skip an uncollected clue or change another phase',()=>{
 const s=begin();assert.equal(reducer(s,{type:'NEXT_INVESTIGATION'}),s);assert.equal(reducer(initialState(),{type:'NEXT_INVESTIGATION'}).phase,'intro');
 const remote=reducer(s,{type:'VISIT_LOCATION',locationId:'koridor'});assert.equal(reducer(remote,{type:'COLLECT_EVIDENCE',evidenceId:'E04'}).evidenceIds.length,0);
});
test('legacy unordered progress focuses an inspected clue then returns to the first missing clue',()=>{
 const s:GameState={...begin(),locationId:'koridor',evidenceIds:['E04'],milestoneIds:['evidence:E04'],dialogueNodeId:'dengar-raka'};
 assert.equal(getInvestigationFocus(s).collected,true);
 const next=reducer(s,{type:'NEXT_INVESTIGATION'});assert.equal(next.locationId,'meja');assert.equal(getInvestigationFocus(next).hotspot.evidenceId,'E01');
});
test('subtitle pagination preserves every word and limits each page',()=>{
 const text='Raka melihat buku kering pukul 09.00. Kita perlu mendengarkan semua pihak sebelum menyimpulkan. '+ 'Bukti perlu diperiksa bersama. '.repeat(8);
 const pages=paginateSubtitle(text,130);assert.ok(pages.length>1);assert.ok(pages.every(p=>p.length<=130));assert.equal(pages.join(' '),text.trim().replace(/\s+/g,' '));
 assert.deepEqual(paginateSubtitle(''),['']);
});
test('guided statements do not pass S02 or S03 before their prerequisites',()=>{
 const s=begin();assert.equal(getNextStatement({...s,statementId:'S01'}),'S02');assert.equal(getNextStatement({...s,statementId:'S02'}),null);
 assert.equal(getNextStatement({...s,statementId:'S02',resolvedStatementIds:['S02']}),'S03');assert.equal(getNextStatement({...s,statementId:'S03'}),null);
 assert.equal(getNextStatement({...s,statementId:'S03',evidenceIds:['E05']}),'S04');
});
