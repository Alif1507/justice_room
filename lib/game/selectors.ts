import { bookCase } from '../../content/cases/buku-rusak.ts';
import type { CaseDefinition, GameState } from './types.ts';
export const hasInvestigation = (s:GameState,c:CaseDefinition=bookCase) => c.requiredEvidence.every(id=>s.evidenceIds.includes(id));
export const canDecide = (s:GameState,c:CaseDefinition=bookCase) => hasInvestigation(s,c)&&c.decisionRequirements.statementIds.every(id=>s.resolvedStatementIds.includes(id))&&c.decisionRequirements.evidenceIds.every(id=>s.evidenceIds.includes(id));
export const hasSolution = (s:GameState,c:CaseDefinition=bookCase) => canDecide(s,c)&&s.decisionId===c.ending.decisionId&&s.decisionReasonId===c.ending.reasonId;
export const reflectionsComplete = (s:GameState,c:CaseDefinition=bookCase) => c.reflections.every(q=>q.acceptedIds.some(id=>s.reflectionAnswerIds.includes(`${q.id}:${id}`)));
export function expectedMilestones(s:GameState,c:CaseDefinition=bookCase):string[]{
 const ids=c.requiredEvidence.filter(id=>s.evidenceIds.includes(id)).map(id=>`evidence:${id}`);
 for(const id of c.decisionRequirements.statementIds)if(s.resolvedStatementIds.includes(id))ids.push(`objection:${id}`);
 if(hasSolution(s,c)) ids.push('solution');
 for(const q of c.reflections.slice(0,2))if(q.acceptedIds.some(id=>s.reflectionAnswerIds.includes(`${q.id}:${id}`)))ids.push(`reflection:${q.id}`);
 return ids;
}
export function score(s:GameState):number {
 return [...new Set(s.milestoneIds)].reduce((sum,id)=>sum+(id.startsWith('evidence:')?5:id.startsWith('objection:')||id==='solution'?30:id.startsWith('reflection:')?10:0),0);
}
export const phaseLabels = {intro:'Pengantar',investigation:'Investigasi',testimony:'Musyawarah',decision:'Penyelesaian',reflection:'Refleksi',result:'Hasil Belajar'};
export const phaseOrder = ['intro','investigation','testimony','decision','reflection','result'] as const;
