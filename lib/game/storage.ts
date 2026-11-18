import {allCases,getCase} from '../../content/cases/index.ts';
import { bookCase } from '../../content/cases/buku-rusak.ts';
import type { CaseDefinition, GameState, Settings } from './types.ts';
import { hasInvestigation, canDecide, hasSolution, reflectionsComplete, expectedMilestones } from './selectors.ts';
export const saveKey=(caseId:string)=>`justice-room:save:${caseId}`;
export const SAVE_KEY='justice-room:save:buku-rusak';
export const SETTINGS_KEY='justice-room:settings';
export const defaultSettings:Settings={mute:true,instantText:true,reducedMotion:false};
export type StorageLike=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
const isRecord=(x:unknown):x is Record<string,unknown>=>typeof x==='object'&&x!==null&&!Array.isArray(x);
const stringArray=(x:unknown):x is string[]=>Array.isArray(x)&&x.every(v=>typeof v==='string')&&new Set(x).size===x.length;
export function validateSave(value:unknown,c:CaseDefinition=bookCase):GameState|null{
 if(!isRecord(value))return null;
 const v=value;
 if(v.schemaVersion!==1||v.caseContentVersion!==c.version||v.caseId!==c.id)return null;
 if(typeof v.phase!=='string'||!['intro','investigation','testimony','decision','reflection','result'].includes(v.phase))return null;
 for(const key of ['evidenceIds','resolvedStatementIds','pressedStatementIds','milestoneIds','reflectionAnswerIds','historyIds'])if(!stringArray(v[key]))return null;
 if(typeof v.dialogueNodeId!=='string'||typeof v.locationId!=='string'||typeof v.statementId!=='string'||typeof v.feedback!=='string'||typeof v.reflectionNote!=='string'||v.reflectionNote.length>2000||v.feedback.length>2000)return null;
 if(typeof v.updatedAt!=='string'||!Number.isFinite(Date.parse(v.updatedAt))||!Number.isInteger(v.hintLevel)||Number(v.hintLevel)<0||Number(v.hintLevel)>3)return null;
 const nodes=[...c.nodes,...c.locations.flatMap(l=>l.hotspots.map(h=>h.dialogue))];
 const dialogueIds=[...nodes.map(n=>n.id),'investigation-start',...c.statements.map(s=>`press:${s.id}`)];
 if(!dialogueIds.includes(v.dialogueNodeId)||!c.locations.some(l=>l.id===v.locationId)||!c.statements.some(s=>s.id===v.statementId))return null;
 if(v.activityAnswerIds!==undefined&&!stringArray(v.activityAnswerIds))return null;
 const activityAnswerIds=(v.activityAnswerIds??[]) as string[];
 if(activityAnswerIds.length>1||activityAnswerIds.some(id=>!c.activity||id!==`${c.activity.id}:${c.activity.acceptedId}`))return null;
 const s={...v,activityAnswerIds} as unknown as GameState;
 if(c.activity){
  const earned=activityAnswerIds.includes(`${c.activity.id}:${c.activity.acceptedId}`);
  if(s.evidenceIds.includes(c.activity.evidenceId)&&!earned)return null;
  if(earned&&(s.phase==='intro'||c.requiredEvidence.slice(0,c.requiredEvidence.indexOf(c.activity.evidenceId)).some(id=>!s.evidenceIds.includes(id))))return null;
 }

 if(s.evidenceIds.some(id=>!c.evidence.some(e=>e.id===id)))return null;
 if(s.resolvedStatementIds.some(id=>!c.decisionRequirements.statementIds.includes(id))||s.pressedStatementIds.some(id=>!c.statements.some(t=>t.id===id)))return null;
 if(s.historyIds.some(id=>!dialogueIds.includes(id)))return null;
 for(const t of c.statements)if(t.unlockEvidenceId&&s.evidenceIds.includes(t.unlockEvidenceId)!==s.pressedStatementIds.includes(t.id))return null;
 if((s.resolvedStatementIds.length||s.pressedStatementIds.length)&&!hasInvestigation(s,c))return null;
 if(s.reflectionAnswerIds.some(id=>!c.reflections.some(q=>q.acceptedIds.some(a=>`${q.id}:${a}`===id))))return null;
 if(c.reflections.some(q=>s.reflectionAnswerIds.filter(a=>a.startsWith(`${q.id}:`)).length>1))return null;
 if(s.decisionId!==undefined&&!c.decisions.some(d=>d.id===s.decisionId))return null;
 if(s.decisionReasonId!==undefined&&!c.decisionReasons.some(d=>d.id===s.decisionReasonId))return null;
 if(Boolean(s.decisionId)!==Boolean(s.decisionReasonId))return null;
 if((s.decisionId||s.reflectionAnswerIds.length||s.reflectionNote)&&!canDecide(s,c))return null;
 if((s.reflectionAnswerIds.length||s.reflectionNote)&&!hasSolution(s,c))return null;
 if(hasSolution(s,c)&&!['reflection','result'].includes(s.phase))return null;
 if(s.phase==='intro'&&(s.evidenceIds.length||!c.nodes.some(n=>n.id===s.dialogueNodeId)))return null;
 if(s.phase!=='intro'&&c.nodes.some(n=>n.id===s.dialogueNodeId))return null;
 if(['testimony','decision','reflection','result'].includes(s.phase)&&!hasInvestigation(s,c))return null;
 if(['decision','reflection','result'].includes(s.phase)&&!canDecide(s,c))return null;
 if(['reflection','result'].includes(s.phase)&&!hasSolution(s,c))return null;
 if(s.phase==='result'&&!reflectionsComplete(s,c))return null;
 const milestones=expectedMilestones(s,c);
 if(s.milestoneIds.length!==milestones.length||s.milestoneIds.some(id=>!milestones.includes(id)))return null;
 // Return only whitelisted fields, never foreign fields from storage.
 return {schemaVersion:1,caseContentVersion:s.caseContentVersion,caseId:s.caseId,phase:s.phase,dialogueNodeId:s.dialogueNodeId,locationId:s.locationId,statementId:s.statementId,evidenceIds:[...s.evidenceIds],resolvedStatementIds:[...s.resolvedStatementIds],pressedStatementIds:[...s.pressedStatementIds],milestoneIds:[...s.milestoneIds],decisionId:s.decisionId,decisionReasonId:s.decisionReasonId,reflectionAnswerIds:[...s.reflectionAnswerIds],reflectionNote:s.reflectionNote,historyIds:[...s.historyIds],feedback:'',hintLevel:s.hintLevel,updatedAt:s.updatedAt,activityAnswerIds:[...s.activityAnswerIds]};
}
export type LoadResult={status:'valid';save:GameState}|{status:'empty'|'invalid'|'unavailable'};
export function readSave(storage:StorageLike,c:CaseDefinition=bookCase):LoadResult{
 try{const raw=storage.getItem(saveKey(c.id));if(raw===null)return {status:'empty'};const save=validateSave(JSON.parse(raw),c);return save?{status:'valid',save}:{status:'invalid'};}catch(e){return {status:e instanceof SyntaxError?'invalid':'unavailable'};}
}
// A completion record survives replay, while each episode keeps its own current save.
export const PROGRESS_KEY='justice-room:progress';
export type Progress={completedIds:string[];unavailable:boolean};
export function readProgress(storage:StorageLike):Progress{
 const recorded=new Set<string>();let unavailable=false;
 try{
  const raw=storage.getItem(PROGRESS_KEY);
  if(raw){try{
   const value:unknown=JSON.parse(raw);
   if(isRecord(value)&&value.schemaVersion===1&&Array.isArray(value.completed)){
    for(const item of value.completed)if(isRecord(item)&&allCases.some(c=>c.id===item.caseId&&c.version===item.caseContentVersion))recorded.add(String(item.caseId));
   }
  }catch{/* Invalid completion data never grants access. */}}
 }catch{unavailable=true;}
 // Existing valid result saves migrate without losing earlier achievements.
 for(const c of allCases){const r=readSave(storage,c);if(r.status==='valid'&&r.save.phase==='result')recorded.add(c.id);if(r.status==='unavailable')unavailable=true;}
 const completedIds:string[]=[];
 for(const c of allCases){if(!recorded.has(c.id))break;completedIds.push(c.id);}
 return {completedIds,unavailable};
}
export function isEpisodeUnlocked(caseId:string,completedIds:readonly string[]):boolean{
 const index=allCases.findIndex(c=>c.id===caseId);
 return index>=0&&allCases.slice(0,index).every(c=>completedIds.includes(c.id));
}
function persistProgress(storage:StorageLike,progress:Progress):void{
 storage.setItem(PROGRESS_KEY,JSON.stringify({schemaVersion:1,completed:allCases.filter(c=>progress.completedIds.includes(c.id)).map(c=>({caseId:c.id,caseContentVersion:c.version}))}));
}
export function writeSave(storage:StorageLike,s:GameState):boolean{
 try{
  storage.setItem(saveKey(s.caseId),JSON.stringify({...s,updatedAt:new Date().toISOString()}));
  const c=getCase(s.caseId);
  if(s.phase==='result'&&c&&validateSave(s,c))persistProgress(storage,readProgress(storage));
  return true;
 }catch{return false;}
}
export function resetSave(storage:StorageLike,c:CaseDefinition=bookCase):boolean{
 try{
  const progress=readProgress(storage);
  if(progress.unavailable)return false;
  // Preserve legacy completion before removing its only result save.
  if(progress.completedIds.length)persistProgress(storage,progress);
  storage.removeItem(saveKey(c.id));return true;
 }catch{return false;}
}
export function readSettings(storage:StorageLike):Settings{try{const s:unknown=JSON.parse(storage.getItem(SETTINGS_KEY)??'null');return isRecord(s)&&typeof s.mute==='boolean'&&typeof s.instantText==='boolean'&&typeof s.reducedMotion==='boolean'?{mute:s.mute,instantText:s.instantText,reducedMotion:s.reducedMotion}:defaultSettings;}catch{return defaultSettings;}}
export function writeSettings(storage:StorageLike,s:Settings):boolean{try{storage.setItem(SETTINGS_KEY,JSON.stringify(s));return true;}catch{return false;}}
