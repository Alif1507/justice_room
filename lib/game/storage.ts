import { bookCase } from '../../content/cases/buku-rusak.ts';
import type { GameState, Settings } from './types.ts';
import { hasInvestigation, canDecide, hasSolution, reflectionsComplete, expectedMilestones } from './selectors.ts';
export const SAVE_KEY='justice-room:save:buku-rusak';
export const SETTINGS_KEY='justice-room:settings';
export const defaultSettings:Settings={mute:true,instantText:true,reducedMotion:false};
export type StorageLike=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
const isRecord=(x:unknown):x is Record<string,unknown>=>typeof x==='object'&&x!==null&&!Array.isArray(x);
const stringArray=(x:unknown):x is string[]=>Array.isArray(x)&&x.every(v=>typeof v==='string')&&new Set(x).size===x.length;
export function validateSave(value:unknown):GameState|null{
 if(!isRecord(value))return null;
 const v=value;
 if(v.schemaVersion!==1||v.caseContentVersion!==bookCase.version||v.caseId!==bookCase.id)return null;
 if(typeof v.phase!=='string'||!['intro','investigation','testimony','decision','reflection','result'].includes(v.phase))return null;
 for(const key of ['evidenceIds','resolvedStatementIds','pressedStatementIds','milestoneIds','reflectionAnswerIds','historyIds'])if(!stringArray(v[key]))return null;
 if(typeof v.dialogueNodeId!=='string'||typeof v.locationId!=='string'||typeof v.statementId!=='string'||typeof v.feedback!=='string'||typeof v.reflectionNote!=='string'||v.reflectionNote.length>2000||v.feedback.length>2000)return null;
 if(typeof v.updatedAt!=='string'||!Number.isFinite(Date.parse(v.updatedAt))||!Number.isInteger(v.hintLevel)||Number(v.hintLevel)<0||Number(v.hintLevel)>3)return null;
 const nodes=[...bookCase.nodes,...bookCase.locations.flatMap(l=>l.hotspots.map(h=>h.dialogue))];
 const dialogueIds=[...nodes.map(n=>n.id),'investigation-start',...bookCase.statements.map(s=>`press:${s.id}`)];
 if(!dialogueIds.includes(v.dialogueNodeId)||!bookCase.locations.some(l=>l.id===v.locationId)||!bookCase.statements.some(s=>s.id===v.statementId))return null;
 const s=v as unknown as GameState;
 if(s.evidenceIds.some(id=>!bookCase.evidence.some(e=>e.id===id)))return null;
 if(s.resolvedStatementIds.some(id=>id!=='S02')||s.pressedStatementIds.some(id=>!bookCase.statements.some(t=>t.id===id)))return null;
 if(s.historyIds.some(id=>!dialogueIds.includes(id)))return null;
 if(s.evidenceIds.includes('E05')!==s.pressedStatementIds.includes('S03'))return null;
 if((s.resolvedStatementIds.length||s.pressedStatementIds.length)&&!hasInvestigation(s))return null;
 if(s.reflectionAnswerIds.some(id=>!bookCase.reflections.some(q=>q.acceptedIds.some(a=>`${q.id}:${a}`===id))))return null;
 if(bookCase.reflections.some(q=>s.reflectionAnswerIds.filter(a=>a.startsWith(`${q.id}:`)).length>1))return null;
 if(s.decisionId!==undefined&&!bookCase.decisions.some(d=>d.id===s.decisionId))return null;
 if(s.decisionReasonId!==undefined&&!bookCase.decisionReasons.some(d=>d.id===s.decisionReasonId))return null;
 if(Boolean(s.decisionId)!==Boolean(s.decisionReasonId))return null;
 if((s.decisionId||s.reflectionAnswerIds.length||s.reflectionNote)&&!canDecide(s))return null;
 if((s.reflectionAnswerIds.length||s.reflectionNote)&&!hasSolution(s))return null;
 if(hasSolution(s)&&!['reflection','result'].includes(s.phase))return null;
 if(s.phase==='intro'&&(s.evidenceIds.length||!bookCase.nodes.some(n=>n.id===s.dialogueNodeId)))return null;
 if(s.phase!=='intro'&&bookCase.nodes.some(n=>n.id===s.dialogueNodeId))return null;
 if(['testimony','decision','reflection','result'].includes(s.phase)&&!hasInvestigation(s))return null;
 if(['decision','reflection','result'].includes(s.phase)&&!canDecide(s))return null;
 if(['reflection','result'].includes(s.phase)&&!hasSolution(s))return null;
 if(s.phase==='result'&&!reflectionsComplete(s))return null;
 const milestones=expectedMilestones(s);
 if(s.milestoneIds.length!==milestones.length||s.milestoneIds.some(id=>!milestones.includes(id)))return null;
 // Return only whitelisted fields, never foreign fields from storage.
 return {schemaVersion:1,caseContentVersion:s.caseContentVersion,caseId:s.caseId,phase:s.phase,dialogueNodeId:s.dialogueNodeId,locationId:s.locationId,statementId:s.statementId,evidenceIds:[...s.evidenceIds],resolvedStatementIds:[...s.resolvedStatementIds],pressedStatementIds:[...s.pressedStatementIds],milestoneIds:[...s.milestoneIds],decisionId:s.decisionId,decisionReasonId:s.decisionReasonId,reflectionAnswerIds:[...s.reflectionAnswerIds],reflectionNote:s.reflectionNote,historyIds:[...s.historyIds],feedback:'',hintLevel:s.hintLevel,updatedAt:s.updatedAt};
}
export type LoadResult={status:'valid';save:GameState}|{status:'empty'|'invalid'|'unavailable'};
export function readSave(storage:StorageLike):LoadResult{
 try{const raw=storage.getItem(SAVE_KEY);if(raw===null)return {status:'empty'};const save=validateSave(JSON.parse(raw));return save?{status:'valid',save}:{status:'invalid'};}catch(e){return {status:e instanceof SyntaxError?'invalid':'unavailable'};}
}
export function writeSave(storage:StorageLike,s:GameState):boolean{try{storage.setItem(SAVE_KEY,JSON.stringify({...s,updatedAt:new Date().toISOString()}));return true;}catch{return false;}}
export function resetSave(storage:StorageLike):boolean{try{storage.removeItem(SAVE_KEY);return true;}catch{return false;}}
export function readSettings(storage:StorageLike):Settings{try{const s:unknown=JSON.parse(storage.getItem(SETTINGS_KEY)??'null');return isRecord(s)&&typeof s.mute==='boolean'&&typeof s.instantText==='boolean'&&typeof s.reducedMotion==='boolean'?{mute:s.mute,instantText:s.instantText,reducedMotion:s.reducedMotion}:defaultSettings;}catch{return defaultSettings;}}
export function writeSettings(storage:StorageLike,s:Settings):boolean{try{storage.setItem(SETTINGS_KEY,JSON.stringify(s));return true;}catch{return false;}}
