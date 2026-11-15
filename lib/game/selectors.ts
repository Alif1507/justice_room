import { bookCase } from '../../content/cases/buku-rusak.ts';
import type { GameState } from './types.ts';
export const hasInvestigation = (s:GameState) => bookCase.requiredEvidence.every(id=>s.evidenceIds.includes(id));
export const canDecide = (s:GameState) => hasInvestigation(s)&&bookCase.decisionRequirements.statementIds.every(id=>s.resolvedStatementIds.includes(id))&&bookCase.decisionRequirements.evidenceIds.every(id=>s.evidenceIds.includes(id));
export const hasSolution = (s:GameState) => canDecide(s)&&s.decisionId===bookCase.ending.decisionId&&s.decisionReasonId===bookCase.ending.reasonId;
export const reflectionsComplete = (s:GameState) => bookCase.reflections.every(q=>q.acceptedIds.some(id=>s.reflectionAnswerIds.includes(`${q.id}:${id}`)));
export function expectedMilestones(s:GameState):string[]{
 const ids=bookCase.requiredEvidence.filter(id=>s.evidenceIds.includes(id)).map(id=>`evidence:${id}`);
 if(s.resolvedStatementIds.includes('S02'))ids.push('objection:S02');
 if(hasSolution(s)) ids.push('solution');
 for(const q of bookCase.reflections.slice(0,2))if(q.acceptedIds.some(id=>s.reflectionAnswerIds.includes(`${q.id}:${id}`)))ids.push(`reflection:${q.id}`);
 return ids;
}
export function score(s:GameState):number {
 return [...new Set(s.milestoneIds)].reduce((sum,id)=>sum+(id.startsWith('evidence:')?5:id==='objection:S02'||id==='solution'?30:id==='reflection:fakta'||id==='reflection:dengar'?10:0),0);
}
export const phaseLabels = {intro:'Pengantar',investigation:'Investigasi',testimony:'Musyawarah',decision:'Penyelesaian',reflection:'Refleksi',result:'Hasil Belajar'};
export const phaseOrder = ['intro','investigation','testimony','decision','reflection','result'] as const;
