'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight,BookOpen,ChevronRight,Compass,Footprints,Heart,Lightbulb,Lock,Play,Settings,ShieldCheck,VolumeX,Search,MessageCircle,Scale,Clock3} from 'lucide-react';
import {Logo,Footer} from './ui/Brand';
import {Modal} from './ui/Modal';
import SettingsPanel from './ui/SettingsPanel';
import {useSettings} from './ui/useSettings';
import Character from './ui/Character';
import {readSave} from '@/lib/game/storage';
import ui from './ui/ui.module.css';
import s from './home.module.css';
export default function Home({casesOnly=false}:{casesOnly?:boolean}){
 const [modal,setModal]=useState<'settings'|'how'|null>(null);const [saved,setSaved]=useState(false);
 const {settings,change}=useSettings();
 useEffect(()=>{try{const r=readSave(localStorage);queueMicrotask(()=>setSaved(r.status==='valid'));}catch{}},[]);
 return <div className={s.page} data-reduced-motion={settings.reducedMotion}>
 <header className={s.header}><Logo/><nav aria-label="Navigasi utama"><Link href="/" aria-current={!casesOnly?'page':undefined}>Beranda</Link><Link href="/kasus" aria-current={casesOnly?'page':undefined}>Pilih Kasus</Link><button onClick={()=>setModal('how')}>Cara Bermain</button></nav><div className={s.headerTools}><button className={ui.iconButton} aria-label="Pengaturan suara" onClick={()=>setModal('settings')}><VolumeX size={19}/></button><button className={ui.iconButton} aria-label="Pengaturan" onClick={()=>setModal('settings')}><Settings size={20}/></button><span className={s.classTag}>KELAS 4–6 SD</span></div></header>
 <main>
 {!casesOnly?<section className={s.hero}>
 <div className={s.heroCopy}><span className={s.heroLabel}><span/> PETUALANGAN KECIL, MAKNA BESAR</span>
 <h1>Jadi detektif.<br/>Dengarkan cerita.<br/><em>Temukan keadilan.</em></h1>
 <p>Tidak semua yang terlihat adalah seluruh cerita.<br className={s.desktopBreak}/> Cari petunjuk, dengarkan teman, dan buat<br className={s.desktopBreak}/> keputusan yang adil. Siap memulai?</p>
 <div className={s.heroActions}><Link className={s.startButton} href="/kasus"><Play size={18} fill="currentColor"/> Mulai Bermain <ArrowRight size={20}/></Link><button onClick={()=>setModal('how')} className={s.howButton}><BookOpen size={19}/> Cara Bermain</button></div>
 {saved?<Link href="/kasus/buku-rusak" className={s.resume}>Lanjutkan petualanganmu <ArrowRight size={16}/></Link>:<div className={s.heroNotes}><span><ShieldCheck size={14}/> Tanpa akun</span><span><Heart size={14}/> Bebas mencoba lagi</span><span><Clock3 size={14}/> Tanpa batas waktu</span></div>}
 </div>
 <div className={s.heroVisual}><span className={s.sun}/><div className={s.sceneFrame}><div className={s.frameBar}><span/><span/><span/><small>SEKOLAH KITA · SENIN PAGI</small></div><Image src="/assets/reading-room.svg" alt="Ilustrasi original pojok baca kelas dengan buku, catatan peminjaman, dan botol di rak" width={900} height={650} priority className={s.roomImage}/><div className={s.sceneCaption}><span><span className={s.liveDot}/> Ada cerita yang perlu didengar…</span><Compass size={18}/></div></div><div className={s.heroNara}><Character id="nara" expression="penasaran"/></div><div className={s.clueNote}><Search size={22}/><div><strong>Petunjuk pertama:</strong><span>Jangan buru-buru menyimpulkan!</span></div></div><div className={s.starOne}>&#10022;</div><div className={s.starTwo}>&#10023;</div><span className={s.sceneSticker}>SETIAP BUKTI<br/>PUNYA CERITA</span></div>
 </section>:<section className={s.caseIntro}><span className={ui.eyebrow}><Compass size={15}/> BERKAS PETUALANGAN</span><h1>Kasus kecil. Pelajaran besar.</h1><p>Pilih satu cerita, lalu dengarkan dari semua sisi.</p></section>}
 {!casesOnly&&<div className={s.values}><div><Search size={22}/><span><strong>Amati dengan teliti</strong><small>Pisahkan fakta dari dugaan</small></span></div><span className={s.valueLine}/><div><MessageCircle size={22}/><span><strong>Dengarkan semua pihak</strong><small>Setiap teman punya cerita</small></span></div><span className={s.valueLine}/><div><Scale size={23}/><span><strong>Putuskan dengan adil</strong><small>Gunakan bukti dan hati</small></span></div></div>}
 <section className={s.cases} id="kasus"><div className={s.sectionHeading}><div><span className={ui.eyebrow}>PAPAN KASUS</span><h2>Petualanganmu dimulai di sini<span>.</span></h2></div><span className={s.caseCount}><span/> 1 kasus siap diselidiki</span></div>
 <div className={s.caseGrid}><article className={s.featuredCase}><div className={s.caseArt}><Image src="/assets/reading-room.svg" alt="Pojok baca, tempat misteri buku kelas bermula" width={900} height={650}/><span className={s.episodeTag}>EPISODE 01</span><span className={s.readyTag}><span/> SIAP DIMAINKAN</span><div className={s.artBook}><BookOpen size={57} strokeWidth={1.3}/><span>?</span></div><div className={s.artLabel}>Sebuah buku rusak.<br/><em>Sebuah cerita yang belum lengkap.</em></div></div><div className={s.caseContent}><div className={s.tags}><span>FAKTA & DUGAAN</span><span>MUSYAWARAH</span></div><h3>Misteri Buku Kelas<br/>yang Rusak</h3><p>Bima dituduh merusak buku kelas. Tapi, apakah menjadi peminjam terakhir berarti ia bersalah?</p><div className={s.caseMeta}><span><Clock3 size={15}/> 10–15 menit</span><span><Footprints size={16}/> 3 lokasi</span><span><Lightbulb size={15}/> 5 bukti</span></div><Link href="/kasus/buku-rusak" className={ui.button}>{saved?'Lanjutkan Kasus':'Selidiki Kasus'} <ArrowRight size={18}/></Link></div></article>
 <div className={s.upcoming}><LockedCase title="Giliran Piket yang Terlupakan" topic="Kewajiban & kerja sama" icon="piket" episode="02"/><LockedCase title="Semua Boleh Bermain" topic="Toleransi & persatuan" icon="main" episode="03"/></div></div>
 <div className={s.moreCases}><Lock size={14}/><span><strong>Masih ada cerita lainnya.</strong> Suara untuk Ketua Kelas dan Antrean Kantin sedang disiapkan.</span></div>
 </section>
 <section className={s.naraStrip}><div className={s.naraMini}><Character id="nara"/></div><div><span className={ui.eyebrow}>KENALAN DENGAN NARA</span><h2>Tenang, kita cari tahu bersama.</h2><p>Aku akan menemanimu mencari petunjuk. Salah memilih? Tidak apa-apa.<br/>Kita selalu bisa mendengarkan lagi dan mencoba cara lain.</p></div><button className={ui.secondary} onClick={()=>setModal('how')}>Kenali Permainannya <ChevronRight size={18}/></button></section>
 <section className={s.teacherNote}><ShieldCheck size={18}/><p>Ruang aman untuk belajar bersikap adil. Materi PPKn berupa usulan pembelajaran dan memerlukan tinjauan guru.</p><Link href="/panduan">Panduan guru <ArrowRight size={16}/></Link></section>
 </main><Footer/>
 {modal==='settings'&&<Modal title="Pengaturan" onClose={()=>setModal(null)}><SettingsPanel settings={settings} change={change}/></Modal>}
 {modal==='how'&&<Modal title="Cara Bermain" onClose={()=>setModal(null)}><p>Kamu adalah <strong>Detektif Keadilan Cilik</strong>. Misi kita mencari penyelesaian, bukan menghukum teman.</p><ol className={s.instructions}><li><strong>Selidiki tiga lokasi.</strong> Periksa objek dan kumpulkan empat bukti awal.</li><li><strong>Dengarkan pernyataan.</strong> Pilih Tanya Lagi untuk memperjelas cerita.</li><li><strong>Uji dengan bukti.</strong> Tekan KEBERATAN!, lalu pilih bukti dan alasan yang sesuai.</li><li><strong>Bermusyawarah.</strong> Pilih solusi beserta alasan, lalu isi refleksi.</li></ol><p className={ui.note}>Gunakan Tab untuk berpindah dan Enter atau Spasi untuk memilih. Escape menutup dialog. Tidak ada nyawa atau batas waktu; kamu boleh mencoba lagi.</p><Link className={ui.button} href="/kasus">Pilih Kasus <ArrowRight size={17}/></Link></Modal>}
 </div>;
}
function LockedCase({title,topic,icon,episode}:{title:string;topic:string;icon:string;episode:string}){return <article className={s.lockedCase} aria-label={`${title}, segera hadir`}><div className={`${s.lockedArt} ${icon==='main'?s.playArt:''}`}>{icon==='piket'?<><span className={s.broom}>&#9585;</span><div className={s.piketBoard}><span>JADWAL PIKET</span><i/><i/><i/><i/><i/><i/></div></>:<><span className={s.ball}>&#10022;</span><div className={s.playGround}/><span className={s.tree}>&#9827;</span></>}<span className={s.lockBadge}><Lock size={12}/> SEGERA HADIR</span></div><div className={s.lockedContent}><span>EPISODE {episode}</span><h3>{title}</h3><p>{topic}</p></div></article>;}
