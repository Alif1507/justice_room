import {bookCase} from '../../content/cases/buku-rusak.ts';
import type {GameState} from './types.ts';
export function getInvestigationFocus(s:GameState){
 const all=bookCase.locations.flatMap(location=>location.hotspots.map(hotspot=>({location,hotspot})));
 const inspected=all.find(item=>item.hotspot.dialogue.id===s.dialogueNodeId&&s.evidenceIds.includes(item.hotspot.evidenceId));
 const pending=bookCase.requiredEvidence.find(id=>!s.evidenceIds.includes(id));
 const focus=inspected??all.find(item=>item.hotspot.evidenceId===pending)??all[all.length-1];
 return {...focus,collected:s.evidenceIds.includes(focus.hotspot.evidenceId),ordinal:bookCase.requiredEvidence.indexOf(focus.hotspot.evidenceId)+1};
}
export function paginateSubtitle(text:string,maxLength=145):string[]{
 const words=text.trim().split(/\s+/).filter(Boolean);if(!words.length)return [''];
 const pages:string[]=[];let current='';
 for(const word of words){
  if(current&&`${current} ${word}`.length>maxLength){pages.push(current);current=word;}else current=current?`${current} ${word}`:word;
 }
 if(current)pages.push(current);return pages;
}
export function getNextStatement(s:GameState):string|null{
 if(s.statementId==='S01')return 'S02';
 if(s.statementId==='S02'&&s.resolvedStatementIds.includes('S02'))return 'S03';
 if(s.statementId==='S03'&&s.evidenceIds.includes('E05'))return 'S04';
 return null;
}
