'use client';
import {useEffect,useState} from 'react';
import {ArrowRight} from 'lucide-react';
import Character from '../ui/Character';
import {bookCase} from '@/content/cases/buku-rusak';
import ui from '../ui/ui.module.css';
import s from './game.module.css';
export function DialogueBox({speakerId,text,expression='tenang',instant,onNext,nextLabel='Lanjutkan',disabled=false,hideAvatar=false,className=''}:{speakerId:string;text:string;expression?:string;instant:boolean;onNext?:()=>void;nextLabel?:string;disabled?:boolean;hideAvatar?:boolean;className?:string}){
 const [typing,setTyping]=useState({text:'',count:0});
 useEffect(()=>{if(instant)return;let count=0;const timer=setInterval(()=>{count+=3;setTyping(previous=>({text,count:previous.text===text?Math.max(previous.count,count):count}));if(count>=text.length)clearInterval(timer);},18);return()=>clearInterval(timer);},[text,instant]);
 const complete=instant||(typing.text===text&&typing.count>=text.length);
 const character=bookCase.characters.find(c=>c.id===speakerId)!;
 return <div className={`${s.dialogueBox} ${className}`}>{!hideAvatar&&<div className={s.dialogueAvatar}><Character key={`${speakerId}-${text}`} speaking id={speakerId} expression={expression}/></div>}<div className={s.dialogueContent}><span className={s.speaker}>{character.name}<small>{character.role}</small></span><p key={text}>{complete?text:<><span aria-hidden="true">{text.slice(0,typing.text===text?typing.count:0)}<span className={s.cursor}>▍</span></span><span className={s.srOnly}>{text}</span></>}</p>{!complete&&<button className={ui.secondary} onClick={()=>setTyping({text,count:text.length})}>Tampilkan Semua Teks</button>}</div>{onNext&&<button data-primary-action="true" className={ui.button} disabled={disabled&&complete} onClick={()=>complete?onNext():setTyping({text,count:text.length})}>{complete?nextLabel:'Tampilkan Teks'} <ArrowRight size={18}/></button>}</div>;
}
