'use client';
import {useEffect,useRef} from 'react';
import {BookOpen,Check,Compass,Heart,MessageCircle,ShieldCheck,Sparkles} from 'lucide-react';
import type {StoryMoment as Moment} from '@/lib/game/presentation';
import {bookCase} from '@/content/cases/buku-rusak';
import {EvidenceIcon} from './EvidenceDrawer';
import s from './motion.module.css';

export default function StoryMoment({moment,onEnd,onSkip}:{moment:Moment;onEnd:(sequence:number)=>void;onSkip:()=>void}){
 const region=useRef<HTMLElement>(null);
 useEffect(()=>{
  const timer=setTimeout(()=>{if(!region.current?.contains(document.activeElement))onEnd(moment.sequence);},moment.duration);
  return()=>clearTimeout(timer);
 },[moment,onEnd]);
 const evidence=bookCase.evidence.find(e=>e.id===moment.evidenceId);
 return <section ref={region} className={`${s.moment} ${s[moment.kind]}`} role="region" aria-label="Momen cerita" data-kind={moment.kind} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))onEnd(moment.sequence);}}>
  <div className={s.card}>
   <div className={s.grain} aria-hidden="true"/>
   <div className={s.topline}><span>{moment.kind==='spill'?'INGATAN SARI · 09.20':moment.kind==='objection'?'RUANG MUSYAWARAH':moment.kind==='evidence'?'CATATAN DETEKTIF':'SEBUAH LANGKAH BARU'}</span><button className={s.skip} onClick={onSkip}>Lewati Animasi <span aria-hidden="true">↗</span></button></div>
   {moment.kind==='spill'?<><span className={s.eyebrow}>{moment.subtitle}</span><SpillReconstruction/><h2>{moment.title}</h2><p className={s.limitation}>Siapa yang menyenggol belum diketahui.</p><div className={s.timeline}><span>09.00 · Buku kering</span><i/><span>09.20 · Terkena air</span></div></>:
    moment.kind==='objection'?<div className={s.objectionContent}><span className={s.objectionMark}>{moment.supported?<ShieldCheck size={37}/>:<MessageCircle size={37}/>}</span><div><h2>{moment.title}</h2><p>{moment.subtitle}</p></div></div>:
    <><div className={s.emblem}>{moment.kind==='evidence'?<EvidenceIcon id={moment.evidenceId!} size={43}/>:moment.kind==='resolution'?<Heart size={43}/>:<Compass size={43}/>}<span className={s.orbitOne}/><span className={s.orbitTwo}/><Sparkles size={18} className={s.spark}/></div><span className={s.eyebrow}>{moment.subtitle}</span><h2>{moment.title}</h2>{evidence&&<><p className={s.evidenceLine}>{evidence.description}</p><span className={s.filed}><Check size={14}/> Tersimpan di Berkas Bukti</span></>}{moment.kind==='resolution'&&<div className={s.resolutionIcons}><MessageCircle/><ShieldCheck/><BookOpen/></div>}</>}
  </div>
 </section>;
}
export function SpillReconstruction(){return <svg className={s.reconstruction} viewBox="0 0 400 165" aria-hidden="true">
 <defs><linearGradient id="memory-light" x2="0" y2="1"><stop stopColor="#E4EEE7"/><stop offset="1" stopColor="#F7EBD0"/></linearGradient></defs>
 <rect x="1" y="1" width="398" height="163" rx="13" fill="url(#memory-light)"/>
 <path d="M22 132h356" stroke="#AB8A5B" strokeWidth="7" strokeLinecap="round"/>
 <g transform="translate(106 76) rotate(77)" stroke="#17324D" strokeWidth="3"><path d="M-20-33h40v61q0 9-10 9h-20q-10 0-10-9z" fill="#B3D5D0"/><path d="M-13-44h26v11h-26z" fill="#ECEDCD"/><path d="M-12 8h24" stroke="#E6F0DE" strokeWidth="6"/></g>
 <path className={s.waterStream} d="M145 104q19-8 39 7t48 9" fill="none" stroke="#5FABA6" strokeWidth="7" strokeLinecap="round"/>
 <ellipse className={s.puddle} cx="218" cy="129" rx="53" ry="5" fill="#82BDB2" opacity=".7"/>
 <g stroke="#17324D" strokeWidth="3" strokeLinejoin="round"><path d="m244 83 59-10 60 14-8 40-58-8-54 11z" fill="#FFF8E8"/><path d="m303 73-6 46m-48-29 36-6m-37 18 33-6m29-11 41 9m-41 2 37 8" fill="none" strokeWidth="2"/></g>
 <path className={s.bookStain} d="M246 107q28-10 43 5l8 7-54 11z" fill="#7AB5AB" opacity=".65"/>
 <g className={s.memoryRings} fill="none" stroke="#F4C95D" strokeWidth="2"><circle cx="235" cy="111" r="12"/><circle cx="235" cy="111" r="23"/></g>
 </svg>;}
