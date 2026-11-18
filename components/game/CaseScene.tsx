'use client';
import Image from 'next/image';
import {BookOpen,Check,ClipboardList,MessageCircle,Search,ShieldCheck,Star,CheckCheck,Users,Clock3,Flag} from 'lucide-react';
import Character from '../ui/Character';
import {EvidenceIcon} from './EvidenceDrawer';
import {SpillReconstruction} from './StoryMoment';
import {bookCase} from '@/content/cases/buku-rusak';
import type {CaseDefinition,EvidenceId,GameState} from '@/lib/game/types';
import type {ReactNode} from 'react';
import s from './guided.module.css';
export default function CaseScene({endingActive=false,state,speakerId,expression='tenang',location,evidenceId,collected=false,onInspect,reconstruction=false,revelationActive=false,children,caseDefinition=bookCase}:{endingActive?:boolean;caseDefinition?:CaseDefinition;revelationActive?:boolean;state:GameState;speakerId:string;expression?:string;location:string;evidenceId?:EvidenceId;collected?:boolean;onInspect?:()=>void;reconstruction?:boolean;children?:ReactNode}){
 const evidence=caseDefinition.evidence.find(e=>e.id===evidenceId);
 return <div className={s.scene} data-ending={endingActive} data-phase={state.phase} data-evidence={collected?evidenceId:undefined} data-reconstruction={reconstruction||revelationActive}>
 <div className={s.room} key={location}><Image src={caseDefinition.presentation.background} alt="" fill sizes="100vw" priority/><div className={s.sunlight}/><div className={s.sceneVignette}/></div>
 <div className={s.sceneLabel}><span className={s.sceneDot}/>{location}</div>
 {state.phase==='intro'&&<div className={s.openingTitle}><span>EPISODE {String(caseDefinition.presentation.episode).padStart(2,'0')}</span><h2>{caseDefinition.presentation.openingTitle}</h2><small>{caseDefinition.presentation.openingSubtitle}</small></div>}
 <div className={s.actor} data-secondary={Boolean(children)||collected||reconstruction||revelationActive} key={`${speakerId}-${state.statementId}-${state.dialogueNodeId}`}><Character speaking id={speakerId} expression={expression}/><span>{caseDefinition.characters.find(c=>c.id===speakerId)?.name}</span></div>
 {state.phase==='investigation'&&!collected&&evidence&&!children&&<div className={s.focusTarget}><span className={s.targetHalo}/><span className={s.targetHint}>Objek yang Bisa Diperiksa</span><button className={s.targetButton} aria-label={caseDefinition.locations.flatMap(l=>l.hotspots).find(h=>h.evidenceId===evidenceId)?.label} onClick={onInspect}><EvidenceIcon theme={caseDefinition.presentation.theme} id={evidenceId!} size={38}/><Search size={18}/></button><strong>{evidence.title}</strong><small>Pilih objek ini untuk mencari petunjuk.</small></div>}
 {state.phase==='investigation'&&collected&&evidence&&<div className={s.evidenceReveal} key={evidenceId}><span className={s.evidenceStamp}><Check size={13}/> BUKTI {evidence.id} TERSIMPAN</span>{caseDefinition.presentation.theme==='books'?<EvidenceIllustration id={evidence.id}/>:<EpisodeEvidence caseDefinition={caseDefinition} evidenceId={evidence.id}/>}<h2>{evidence.title}</h2><span>{evidence.observedAt}</span></div>}
 {reconstruction&&<div className={s.reconstruction}><span>REKONSTRUKSI BERDASARKAN E05</span><div role="img" aria-label="Rekonstruksi tumpahan berdasarkan keterangan Sari"><SpillReconstruction/></div><div className={s.timeSequence}><span>09.00 · Buku kering</span><i/><span>09.20 · Terkena air</span></div><p>Siapa yang menyenggol belum diketahui.</p></div>}
 {revelationActive&&<div className={`${s.reconstruction} ${s.revelation}`}><span>INFORMASI BARU DALAM MUSYAWARAH</span><h2>{caseDefinition.presentation.revelation.title}</h2><ul>{caseDefinition.presentation.revelation.facts.map(fact=><li key={fact}><Check size={16}/><span>{fact}</span></li>)}</ul></div>}
 {state.phase==='testimony'&&!reconstruction&&!revelationActive&&!children&&<div className={s.statementVisual}><span>CERITA {caseDefinition.characters.find(c=>c.id===caseDefinition.statements.find(t=>t.id===state.statementId)?.speakerId)?.name.toUpperCase()}</span><MessageCircle size={52} strokeWidth={1.1}/><h2>{state.statementId==='S02'&&!state.resolvedStatementIds.includes('S02')?'Fakta atau dugaan?':state.resolvedStatementIds.includes(state.statementId)?'Dugaan sudah diperiksa.':'Dengarkan dulu ceritanya.'}</h2><div className={s.statementDots}>{caseDefinition.statements.map(t=><span key={t.id} data-current={state.statementId===t.id} aria-hidden="true"/>)}</div></div>}
 {children&&<div className={s.sceneContent}>{children}</div>}
 </div>;
}
function EvidenceIllustration({id}:{id:EvidenceId}){
 if(id==='E01')return <div className={s.borrowingNote}><ClipboardList size={32}/><span>CATATAN PEMINJAMAN</span><div><strong>Bima</strong><span>Dikembalikan</span><b>09.00</b></div><i/><i/><i/></div>;
 if(id==='E03')return <div className={s.photoEvidence}><Image src="/assets/reading-room.svg" alt="Foto rak pukul 09.15: botol terbuka dekat buku yang tampak kering" width={900} height={650}/><span>FOTO SARI · 09.15</span><i/></div>;
 if(id==='E04')return <div className={s.witnessNote}><span>YANG RAKA LIHAT</span><BookOpen size={65} strokeWidth={1.2}/><strong>09.00</strong><small>Buku kering dan utuh saat dikembalikan.</small></div>;
 return <div className={s.wetBook}><BookOpen size={98} strokeWidth={1.1}/><span/><i/><small>Ada halaman basah dan bekas air.</small></div>;
}
export function ResultScene({score,endingTitle}:{score:number;endingTitle?:string}){return <div className={s.resultScene}><div className={s.resultMedal}><ShieldCheck size={70} strokeWidth={1.1}/><Star size={21} fill="currentColor"/></div><span>BERKAS SELESAI</span><h2>{endingTitle??'Terima kasih sudah mendengarkan.'}</h2><strong>{score} / 100</strong><div className={s.badges}>{[{name:'Pengamat Teliti',Icon:Search},{name:'Pemeriksa Bukti',Icon:ClipboardList},{name:'Pendengar Adil',Icon:MessageCircle},{name:'Pemecah Masalah',Icon:BookOpen}].map(({name,Icon})=><div key={name}><Icon size={23}/><span>{name}</span></div>)}</div></div>;}

function EpisodeEvidence({caseDefinition,evidenceId}:{caseDefinition:CaseDefinition;evidenceId:EvidenceId}){
 const evidence=caseDefinition.evidence.find(e=>e.id===evidenceId)!;const chores=caseDefinition.presentation.theme==='chores';
 const Icon=evidenceId==='E01'?ClipboardList:evidenceId==='E02'?Clock3:evidenceId==='E03'?Flag:Users;
 return <div className={s.episodeEvidence}><span>{evidence.kind.toUpperCase()}</span><Icon size={58} strokeWidth={1.3}/>{caseDefinition.activity?.evidenceId===evidenceId?<dl>{caseDefinition.activity.displayItems.map(x=><div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl>:<div className={s.evidenceSymbols}>{chores?<><CheckCheck/><Clock3/><Users/></>:<><Users/><Flag/><MessageCircle/></>}</div>}<small>{chores?'Periksa jadwal, waktu, dan pembagian tugas.':'Dengarkan kebutuhan setiap teman.'}</small></div>;
}
