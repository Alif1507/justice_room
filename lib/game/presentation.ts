import {bookCase} from '../../content/cases/buku-rusak.ts';
import {initialState,reducer} from './reducer.ts';
import type {CaseDefinition,EvidenceId,GameEvent,GameState} from './types.ts';

export type StoryMoment = {
 sequence:number;
 kind:'evidence'|'spill'|'objection'|'chapter'|'resolution';
 title:string;
 subtitle:string;
 duration:number;
 evidenceId?:EvidenceId;
 supported?:boolean;
};
export type PresentationState = {game:GameState;moment:StoryMoment|null;sequence:number};
export type PresentationEvent = GameEvent|{type:'DISMISS_MOMENT';sequence:number};
export const initialPresentation=(c:CaseDefinition=bookCase):PresentationState=>({game:initialState(c),moment:null,sequence:0});

// Presentation cues are transient. Only `game` is passed to storage.
export function presentationReducer(previous:PresentationState,event:PresentationEvent,c:CaseDefinition=bookCase):PresentationState{
 if(event.type==='DISMISS_MOMENT')return event.sequence===previous.sequence?{...previous,moment:null}:previous;
 const game=reducer(previous.game,event,c);
 if(event.type==='RESTORE_SAVE'||event.type==='RESET_CASE'||event.type==='START_CASE')return {...previous,game,moment:null};
 if(game===previous.game)return previous;
 let cue:Omit<StoryMoment,'sequence'>|null=null;
 const newEvidence=game.evidenceIds.find(id=>!previous.game.evidenceIds.includes(id));
 if(newEvidence){
  const evidence=c.evidence.find(e=>e.id===newEvidence)!;
  cue=newEvidence==='E05'&&c.id==='buku-rusak'
   ?{kind:'spill',evidenceId:newEvidence,title:'Cerita Sari menjadi lebih jelas.',subtitle:'Rekonstruksi berdasarkan keterangan E05',duration:4500}
   :{kind:'evidence',evidenceId:newEvidence,title:evidence.title,subtitle:`Petunjuk baru · ${newEvidence} · ${evidence.observedAt}`,duration:2800};
 }else if(event.type==='SUBMIT_OBJECTION'){
  const supported=c.statements.find(s=>s.id===previous.game.statementId)?.acceptedPairs.some(p=>p.evidenceId===event.evidenceId&&p.reasonId===event.reasonId)??false;
  cue={kind:'objection',title:supported?'Mari pertimbangkan bukti ini!':'Mari periksa hubungannya.',subtitle:supported?'Bukti dan alasan membantu meluruskan dugaan.':'Bukti perlu disertai alasan yang sesuai.',supported,duration:850};
 }else if(game.phase==='reflection'&&previous.game.phase==='decision'){
  cue={kind:'resolution',title:'Didengarkan. Dirawat. Diselesaikan bersama.',subtitle:'Musyawarah membantu kita melangkah lebih adil.',duration:3000};
 }else if(game.phase!==previous.game.phase&&['investigation','testimony','decision'].includes(game.phase)){
  const titles={investigation:'Setiap petunjuk punya cerita.',testimony:'Kini, dengarkan semua sisi.',decision:'Saatnya menyatukan pikiran.'};
  cue={kind:'chapter',title:titles[game.phase as keyof typeof titles],subtitle:c.title.toUpperCase(),duration:1800};
 }
 const sequence=previous.sequence+(cue?1:0);
 return {game,sequence,moment:cue?{...cue,sequence}:null};
}
