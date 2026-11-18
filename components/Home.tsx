'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {allCases} from '@/content/cases';
import type {CaseDefinition,GameState} from '@/lib/game/types';
import Image from 'next/image';
import {ArrowRight,BookOpen,ChevronRight,Compass,Footprints,Heart,Lightbulb,Lock,Play,Settings,ShieldCheck,VolumeX,Search,MessageCircle,Scale,Clock3,CalendarDays,Users} from 'lucide-react';
import {Logo,Footer} from './ui/Brand';
import {Modal} from './ui/Modal';
import SettingsPanel from './ui/SettingsPanel';
import {useSettings} from './ui/useSettings';
import Character from './ui/Character';
import {readSave,resetSave,readProgress,isEpisodeUnlocked} from '@/lib/game/storage';
import ui from './ui/ui.module.css';
import s from './home.module.css';
export default function Home({casesOnly=false}:{casesOnly?:boolean}){
 const [completedIds,setCompletedIds]=useState<string[]>([]);const [progressReady,setProgressReady]=useState(false);
 const [modal,setModal]=useState<'settings'|'how'|'replay'|null>(null);const [saves,setSaves]=useState<Record<string,GameState>>({});const [replayId,setReplayId]=useState<string|null>(null);const [replayError,setReplayError]=useState('');const router=useRouter();
 const resume=Object.values(saves).filter(s=>s.phase!=='result'&&isEpisodeUnlocked(s.caseId,completedIds)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];const saved=Boolean(resume);
 const {settings,change}=useSettings();
 useEffect(()=>{const found:Record<string,GameState>={};try{for(const c of allCases){const result=readSave(localStorage,c);if(result.status==='valid')found[c.id]=result.save;}}catch{}queueMicrotask(()=>{setSaves(found);try{setCompletedIds(readProgress(localStorage).completedIds);}catch{}setProgressReady(true);});},[]);
 function requestReplay(c:CaseDefinition){setReplayId(c.id);setReplayError('');setModal('replay');}
 function confirmReplay(){const c=allCases.find(c=>c.id===replayId);if(!c)return;let cleared=false;try{cleared=resetSave(localStorage,c);}catch{}if(!cleared){setReplayError('Progres belum bisa dihapus dari browser. Buka episode dan coba Mainkan Ulang lewat Menu Kasus.');return;}setSaves(previous=>Object.fromEntries(Object.entries(previous).filter(([id])=>id!==c.id)));setModal(null);router.push(`/kasus/${c.id}`);}

 return <div className={s.page} data-reduced-motion={settings.reducedMotion}>
 <header className={s.header}><Logo/><nav aria-label="Navigasi utama"><Link href="/" aria-current={!casesOnly?'page':undefined}>Beranda</Link><Link href="/kasus" aria-current={casesOnly?'page':undefined}>Pilih Kasus</Link><button onClick={()=>setModal('how')}>Cara Bermain</button></nav><div className={s.headerTools}><button className={ui.iconButton} aria-label="Pengaturan suara" onClick={()=>setModal('settings')}><VolumeX size={19}/></button><button className={ui.iconButton} aria-label="Pengaturan" onClick={()=>setModal('settings')}><Settings size={20}/></button><span className={s.classTag}>KELAS 4–6 SD</span></div></header>
 <main>
 {!casesOnly?<section className={s.hero}>
 <div className={s.heroCopy}><span className={s.heroLabel}><span/> PETUALANGAN KECIL, MAKNA BESAR</span>
 <h1>Jadi detektif.<br/>Dengarkan cerita.<br/><em>Temukan keadilan.</em></h1>
 <p>Tidak semua yang terlihat adalah seluruh cerita.<br className={s.desktopBreak}/> Cari petunjuk, dengarkan teman, dan buat<br className={s.desktopBreak}/> keputusan yang adil. Siap memulai?</p>
 <div className={s.heroActions}><Link className={s.startButton} href="/kasus"><Play size={18} fill="currentColor"/> Mulai Bermain <ArrowRight size={20}/></Link><button onClick={()=>setModal('how')} className={s.howButton}><BookOpen size={19}/> Cara Bermain</button></div>
 {saved?<Link href={`/kasus/${resume?.caseId}`} className={s.resume}>Lanjutkan petualanganmu <ArrowRight size={16}/></Link>:<div className={s.heroNotes}><span><ShieldCheck size={14}/> Tanpa akun</span><span><Heart size={14}/> Bebas mencoba lagi</span><span><Clock3 size={14}/> Tanpa batas waktu</span></div>}
 </div>
 <div className={s.heroVisual}><span className={s.sun}/><div className={s.sceneFrame}><div className={s.frameBar}><span/><span/><span/><small>SEKOLAH KITA · SENIN PAGI</small></div><Image src="/assets/reading-room.svg" alt="Ilustrasi original pojok baca kelas dengan buku, catatan peminjaman, dan botol di rak" width={900} height={650} priority className={s.roomImage}/><div className={s.sceneCaption}><span><span className={s.liveDot}/> Ada cerita yang perlu didengar…</span><Compass size={18}/></div></div><div className={s.heroNara}><Character id="nara" expression="penasaran"/></div><div className={s.clueNote}><Search size={22}/><div><strong>Petunjuk pertama:</strong><span>Jangan buru-buru menyimpulkan!</span></div></div><div className={s.starOne}>&#10022;</div><div className={s.starTwo}>&#10023;</div><span className={s.sceneSticker}>SETIAP BUKTI<br/>PUNYA CERITA</span></div>
 </section>:<section className={s.caseIntro}><span className={ui.eyebrow}><Compass size={15}/> BERKAS PETUALANGAN</span><h1>Kasus kecil. Pelajaran besar.</h1><p>Pilih satu cerita, lalu dengarkan dari semua sisi.</p></section>}
 {!casesOnly&&<div className={s.values}><div><Search size={22}/><span><strong>Amati dengan teliti</strong><small>Pisahkan fakta dari dugaan</small></span></div><span className={s.valueLine}/><div><MessageCircle size={22}/><span><strong>Dengarkan semua pihak</strong><small>Setiap teman punya cerita</small></span></div><span className={s.valueLine}/><div><Scale size={23}/><span><strong>Putuskan dengan adil</strong><small>Gunakan bukti dan hati</small></span></div></div>}
 <section className={s.cases} id="kasus"><div className={s.sectionHeading}><div><span className={ui.eyebrow}>PAPAN KASUS</span><h2>Petualanganmu dimulai di sini<span>.</span></h2></div><div className={s.campaignProgress}><span className={s.caseCount}><span/> {completedIds.length} dari {allCases.length} episode selesai</span><progress aria-label="Progres episode" value={completedIds.length} max={allCases.length}/></div></div>
 <div className={s.episodeGrid}>{allCases.map(c=><EpisodeCard key={c.id} definition={c} save={saves[c.id]} unlocked={progressReady&&isEpisodeUnlocked(c.id,completedIds)} ready={progressReady} completed={completedIds.includes(c.id)} onReplay={()=>requestReplay(c)}/>)}</div>
 <div className={s.moreCases}><Lock size={14}/><span><strong>Masih ada cerita lainnya.</strong> Suara untuk Ketua Kelas dan Antrean Kantin sedang disiapkan.</span></div>
 </section>
 <section className={s.naraStrip}><div className={s.naraMini}><Character id="nara"/></div><div><span className={ui.eyebrow}>KENALAN DENGAN NARA</span><h2>Tenang, kita cari tahu bersama.</h2><p>Aku akan menemanimu mencari petunjuk. Salah memilih? Tidak apa-apa.<br/>Kita selalu bisa mendengarkan lagi dan mencoba cara lain.</p></div><button className={ui.secondary} onClick={()=>setModal('how')}>Kenali Permainannya <ChevronRight size={18}/></button></section>
 <section className={s.teacherNote}><ShieldCheck size={18}/><p>Ruang aman untuk belajar bersikap adil. Materi PPKn berupa usulan pembelajaran dan memerlukan tinjauan guru.</p><Link href="/panduan">Panduan guru <ArrowRight size={16}/></Link></section>
 </main><Footer/>
 {modal==='replay'&&<Modal title="Mainkan ulang episode?" onClose={()=>setModal(null)}><p>Mulai <strong>{allCases.find(c=>c.id===replayId)?.title}</strong> dari awal? Progres episode lain dan pengaturan tetap tersimpan.</p>{replayError&&<p role="alert">{replayError}</p>}<div className={s.replayActions}><button className={ui.secondary} onClick={()=>setModal(null)}>Batal</button><button className={ui.button} onClick={confirmReplay}>Ya, Mainkan Ulang</button></div></Modal>}
 {modal==='settings'&&<Modal title="Pengaturan" onClose={()=>setModal(null)}><SettingsPanel settings={settings} change={change}/></Modal>}
 {modal==='how'&&<Modal title="Cara Bermain" onClose={()=>setModal(null)}><p>Kamu adalah <strong>Detektif Keadilan Cilik</strong>. Misi kita mencari penyelesaian, bukan menghukum teman.</p><ol className={s.instructions}><li><strong>Selidiki tiga lokasi.</strong> Ikuti satu petunjuk setiap langkah. Episode 2 punya tantangan jadwal, dan Episode 3 punya tantangan aturan bermain.</li><li><strong>Dengarkan pernyataan.</strong> Pilih Tanya Lagi untuk memperjelas cerita.</li><li><strong>Uji dengan bukti.</strong> Tekan KEBERATAN!, lalu pilih bukti dan alasan yang sesuai.</li><li><strong>Bermusyawarah.</strong> Pilih solusi beserta alasan, lalu isi refleksi.</li></ol><p className={ui.note}>Gunakan Tab untuk berpindah dan Enter atau Spasi untuk memilih. Escape menutup dialog. Tidak ada nyawa atau batas waktu; kamu boleh mencoba lagi.</p><Link className={ui.button} href="/kasus">Pilih Kasus <ArrowRight size={17}/></Link></Modal>}
 </div>;
}
function EpisodeCard({definition:c,save,onReplay,unlocked,ready,completed}:{definition:CaseDefinition;save?:GameState;onReplay:()=>void;unlocked:boolean;ready:boolean;completed:boolean}){
 const finished=save?.phase==='result';const Icons={books:BookOpen,chores:ClipboardIcon,play:UsersIcon};const Icon=Icons[c.presentation.theme];
 return <article className={`${s.episodeCard} ${!unlocked?s.lockedCard:''}`} aria-label={`Episode ${c.presentation.episode}: ${c.title}`}>
  <div className={s.episodeArt}><Image src={c.presentation.background} alt={`Ilustrasi ${c.title}`} width={900} height={650}/><span className={s.episodeTag}>EPISODE {String(c.presentation.episode).padStart(2,'0')}</span><span className={s.episodeStatus}>{!ready?'MEMUAT PROGRES':!unlocked?'TERKUNCI':completed?'SELESAI':save?'SEDANG DIMAINKAN':'SIAP DIMAINKAN'}</span><span className={s.episodeSymbol}>{unlocked?<Icon size={43}/>:<Lock size={38}/>}</span></div>
  <div className={s.episodeBody}><div className={s.tags}>{c.presentation.topics.map(topic=><span key={topic}>{topic.toUpperCase()}</span>)}</div><h3>{c.title}</h3><p>{c.presentation.summary}</p><div className={s.caseMeta}><span><Clock3 size={14}/> 10–15 menit</span><span><Footprints size={15}/> {c.locations.length} lokasi</span><span><Lightbulb size={14}/> {c.evidence.length} bukti</span></div><div className={s.episodeActions}>{!unlocked?<p className={s.lockReason}>{ready?`Selesaikan Episode ${c.presentation.episode-1} untuk membuka cerita ini.`:'Sedang membaca progresmu...'}</p>:finished?<><button className={ui.button} onClick={onReplay}>Mainkan Ulang <ArrowRight size={17}/></button><Link href={`/kasus/${c.id}`} className={s.resultLink}>Lihat Hasil</Link></>:<Link href={`/kasus/${c.id}`} className={ui.button}>{save?'Lanjutkan Kasus':'Selidiki Kasus'} <ArrowRight size={17}/></Link>}</div></div>
 </article>;
}
function ClipboardIcon({size}:{size:number}){return <CalendarDays size={size}/>;}
function UsersIcon({size}:{size:number}){return <Users size={size}/>;}
