'use client';
import {useEffect,useState} from 'react';
import {ArrowRight} from 'lucide-react';
import Character from '../ui/Character';
import {bookCase} from '@/content/cases/buku-rusak';
import ui from '../ui/ui.module.css';
import s from './game.module.css';
export function DialogueBox({speakerId,text,expression='tenang',instant,onNext}:{speakerId:string;text:string;expression?:string;instant:boolean;onNext?:()=>void}){
 const [typing,setTyping]=useState({text:'',count:0});
 useEffect(()=>{if(instant)return;let count=0;const timer=setInterval(()=>{count+=3;setTyping(previous=>({text,count:previous.text===text?Math.max(previous.count,count):count}));if(count>=text.length)clearInterval(timer);},18);return()=>clearInterval(timer);},[text,instant]);
 const complete=instant||(typing.text===text&&typing.count>=text.length);
 const character=bookCase.characters.find(c=>c.id===speakerId)!;
 return <div className={s.dialogueBox}><div className={s.dialogueAvatar}><Character id={speakerId} expression={expression}/></div><div className={s.dialogueContent}><span className={s.speaker}>{character.name}<small>{character.role}</small></span><p>{complete?text:<><span aria-hidden="true">{text.slice(0,typing.text===text?typing.count:0)}<span className={s.cursor}>▍</span></span><span className={s.srOnly}>{text}</span></>}</p>{!complete&&<button className={ui.secondary} onClick={()=>setTyping({text,count:text.length})}>Tampilkan Semua Teks</button>}</div>{onNext&&<button className={ui.button} onClick={()=>complete?onNext():setTyping({text,count:text.length})}>Lanjutkan <ArrowRight size={18}/></button>}</div>;
}
