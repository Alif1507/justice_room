import {bookCase} from '../../content/cases/buku-rusak.ts';
import type {CaseDefinition,GameState} from './types.ts';
export function getInvestigationFocus(s:GameState,c:CaseDefinition=bookCase){
 const all=c.locations.flatMap(location=>location.hotspots.map(hotspot=>({location,hotspot})));
 const inspected=all.find(item=>item.hotspot.dialogue.id===s.dialogueNodeId&&s.evidenceIds.includes(item.hotspot.evidenceId));
 const pending=c.requiredEvidence.find(id=>!s.evidenceIds.includes(id));
 const focus=inspected??all.find(item=>item.hotspot.evidenceId===pending)??all[all.length-1];
 return {...focus,collected:s.evidenceIds.includes(focus.hotspot.evidenceId),ordinal:c.requiredEvidence.indexOf(focus.hotspot.evidenceId)+1};
}
export function paginateSubtitle(text:string,maxLength=145):string[]{
 const words=text.trim().split(/\s+/).filter(Boolean);if(!words.length)return [''];
 const pages:string[]=[];let current='';
 for(const word of words){
  if(current&&`${current} ${word}`.length>maxLength){pages.push(current);current=word;}else current=current?`${current} ${word}`:word;
 }
 if(current)pages.push(current);return pages;
}
export function getNextStatement(s:GameState,c:CaseDefinition=bookCase):string|null{
 const current=c.statements.find(t=>t.id===s.statementId);
 if(!current)return null;
 if(c.decisionRequirements.statementIds.includes(current.id)&&!s.resolvedStatementIds.includes(current.id))return null;
 if(current.unlockEvidenceId&&!s.evidenceIds.includes(current.unlockEvidenceId))return null;
 return c.statements[c.statements.indexOf(current)+1]?.id??null;
}
