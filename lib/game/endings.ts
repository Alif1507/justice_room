import type {CaseDefinition,GameState,StoryEnding} from './types.ts';
import {canDecide} from './selectors.ts';
export function getDecisionEnding(s:GameState,c:CaseDefinition):StoryEnding|null{
 if(s.caseId!==c.id||!['decision','reflection','result'].includes(s.phase)||!canDecide(s,c)||!c.decisionReasons.some(r=>r.id===s.decisionReasonId))return null;
 const choice=c.decisions.find(d=>d.id===s.decisionId);if(!choice)return null;
 return choice.acceptedReasonId&&choice.acceptedReasonId!==s.decisionReasonId?c.reasonEnding:choice.outcome;
}
