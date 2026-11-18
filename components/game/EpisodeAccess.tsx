'use client';
import {useEffect,useState,type ReactNode} from 'react';
import Link from 'next/link';
import {Lock} from 'lucide-react';
import {allCases} from '@/content/cases';
import {isEpisodeUnlocked,readProgress,type Progress} from '@/lib/game/storage';
import ui from '../ui/ui.module.css';
import s from './access.module.css';
export default function EpisodeAccess({caseId,children}:{caseId:string;children:ReactNode}){
 const [progress,setProgress]=useState<Progress|null>(null);
 useEffect(()=>{const refresh=()=>{let next:Progress;try{next=readProgress(localStorage);}catch{next={completedIds:[],unavailable:true};}queueMicrotask(()=>setProgress(next));};refresh();window.addEventListener('storage',refresh);window.addEventListener('pageshow',refresh);return()=>{window.removeEventListener('storage',refresh);window.removeEventListener('pageshow',refresh);};},[]);
 if(!progress)return <main className={s.page}><p role="status">Membaca progres petualangan...</p></main>;
 if(isEpisodeUnlocked(caseId,progress.completedIds))return children;
 const next=allCases.find(c=>!progress.completedIds.includes(c.id))??allCases[0];
 const current=allCases.find(c=>c.id===caseId)!;
 return <main className={s.page}><section className={s.card}><Lock size={44} aria-hidden="true"/><p className={ui.eyebrow}>PETUALANGAN BERURUTAN</p><h1>Episode {current.presentation.episode} masih terkunci</h1><p>Selesaikan Episode {current.presentation.episode-1} sampai hasil belajar untuk membuka cerita ini.</p>{progress.unavailable&&<p role="alert">Progres browser belum bisa dibaca. Izinkan penyimpanan browser agar episode berikutnya dapat terbuka.</p>}<Link className={ui.button} href={`/kasus/${next.id}`}>Mulai dari Episode {next.presentation.episode}</Link><Link className={ui.secondary} href="/kasus">Kembali ke Papan Kasus</Link></section></main>;
}
