import {BookOpen,Heart,Search,Droplets,ClipboardList,Clock3,Trash2,CheckCheck,Flag,Ban,LockKeyhole,MessageCircle,Volleyball} from 'lucide-react';
import Character from '../ui/Character';
import type {StoryEnding} from '@/lib/game/types';
import s from './ending.module.css';
const motifs={care:[BookOpen,Heart],blame:[BookOpen,MessageCircle],doubt:[Droplets,Search],solo:[ClipboardList,Clock3],neglect:[Trash2,Clock3],team:[ClipboardList,CheckCheck],forced:[Volleyball,LockKeyhole],empty:[Volleyball,Ban],choice:[Flag,Heart],rethink:[MessageCircle,Search]} as const;
export default function EndingScene({ending,step}:{ending:StoryEnding;step:number}){
 const [Main,Detail]=motifs[ending.motif];
 return <section className={s.ending} data-mood={ending.mood} data-motif={ending.motif} aria-label="Adegan akhir pilihanmu">
  <span className={s.label}>{ending.mood==='hopeful'?'AKHIR CERITA':ending.mood==='rethink'?'MUSYAWARAH DILANJUTKAN':'KEMUNGKINAN AKHIR'} <span aria-hidden="true">{step+1} / {ending.beats.length}</span></span>
  <h2>{ending.title}</h2>
  <div className={s.illustration} key={`${ending.id}:${step}`} aria-hidden="true">
   <div className={s.person}><Character id={ending.cast[0]} expression={ending.mood==='hopeful'?'tenang':'khawatir'}/></div>
   <div className={s.symbol}><Main strokeWidth={1.4}/><Detail className={s.detail}/><span className={s.path}/></div>
   <div className={s.person}><Character id={ending.cast[1]} expression={ending.mood==='hopeful'?'tenang':'penasaran'}/></div>
  </div>
  <p>{ending.takeaway}</p>
 </section>;
}
