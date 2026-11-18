'use client';
import {useMemo,useState} from 'react';
import type {CaseDefinition} from '@/lib/game/types';
import {paginateSubtitle} from '@/lib/game/guided';
import {DialogueBox} from './DialogueBox';
import s from './guided.module.css';
export type StorySpeech={speakerId:string;text:string;expression?:string};
export type StoryAction={label:string;onClick:()=>void;disabled?:boolean};
export default function StoryCaption({speech,action,instant,feedback=false,caseDefinition}:{caseDefinition?:CaseDefinition;speech:StorySpeech;action:StoryAction;instant:boolean;feedback?:boolean}){
 const pages=useMemo(()=>paginateSubtitle(speech.text),[speech.text]);
 const [cursor,setCursor]=useState({text:'',index:0});
 const index=cursor.text===speech.text?Math.min(cursor.index,pages.length-1):0;
 const more=index<pages.length-1;
 return <section className={s.caption} role="region" aria-label="Dialog Cerita" data-feedback={feedback}>
 <div className={s.captionMeta}><span>{feedback?'BUKTI & PENJELASAN':'DENGARKAN CERITANYA'}</span><span>{index+1} / {pages.length}</span></div>
 <div role={feedback?'status':undefined}><DialogueBox caseDefinition={caseDefinition} className={s.subtitleBox} hideAvatar speakerId={speech.speakerId} expression={speech.expression} text={pages[index]} instant={instant} nextLabel={more?'Lanjutkan':action.label} disabled={!more&&action.disabled} onNext={()=>{if(more)setCursor({text:speech.text,index:index+1});else action.onClick();}}/></div>
 </section>;
}
