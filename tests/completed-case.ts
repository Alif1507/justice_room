import {initialState,reducer} from '../lib/game/reducer.ts';
import type {CaseDefinition} from '../lib/game/types.ts';
export function completed(c:CaseDefinition){
 let s=initialState(c);for(const n of c.nodes){void n;s=reducer(s,{type:'ADVANCE_DIALOGUE'},c);}
 for(const id of c.requiredEvidence){if(c.activity?.evidenceId===id)s=reducer(s,{type:'SUBMIT_ACTIVITY',answerId:c.activity.acceptedId},c);s=reducer(s,{type:'COLLECT_EVIDENCE',evidenceId:id},c);s=reducer(s,{type:'NEXT_INVESTIGATION'},c);}
 s=reducer(s,{type:'ENTER_TESTIMONY'},c);s=reducer(s,{type:'SELECT_STATEMENT',statementId:'S02'},c);const pair=c.statements.find(t=>t.id==='S02')!.acceptedPairs[0];s=reducer(s,{type:'SUBMIT_OBJECTION',...pair},c);s=reducer(s,{type:'SELECT_STATEMENT',statementId:'S03'},c);s=reducer(s,{type:'PRESS_STATEMENT'},c);s=reducer(s,{type:'ENTER_DECISION'},c);s=reducer(s,{type:'SELECT_DECISION',decisionId:c.ending.decisionId,reasonId:c.ending.reasonId},c);for(const q of c.reflections)s=reducer(s,{type:'SUBMIT_REFLECTION',questionId:q.id,answerId:q.acceptedIds[0]},c);return reducer(s,{type:'FINISH_CASE'},c);
}
