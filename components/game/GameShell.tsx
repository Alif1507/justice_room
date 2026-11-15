'use client';
import {useEffect,useReducer,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft,BookOpen,Check,ClipboardList,Compass,Heart,History,Lightbulb,Menu,Settings,ShieldCheck} from 'lucide-react';
import {bookCase} from '@/content/cases/buku-rusak';
import {canDecide,hasInvestigation,phaseLabels,phaseOrder,reflectionsComplete,score} from '@/lib/game/selectors';
import {getInvestigationFocus,getNextStatement} from '@/lib/game/guided';
import type {GameEvent} from '@/lib/game/types';
import {Logo} from '../ui/Brand';
import {Modal} from '../ui/Modal';
import SettingsPanel from '../ui/SettingsPanel';
import {useSettings} from '../ui/useSettings';
import {useReducedMotion} from '../ui/useReducedMotion';
import {useGame} from './useGame';
import {EvidenceDrawer} from './EvidenceDrawer';
import CaseScene,{ResultScene} from './CaseScene';
import StoryCaption,{type StoryAction,type StorySpeech} from './StoryCaption';
import ChoiceStage,{useChoiceFlow} from './ChoiceStage';
import s from './guided.module.css';
import ui from '../ui/ui.module.css';

type ModalName='menu'|'evidence'|'history'|'settings'|'reset'|'review'|null;
type View={challenge:boolean;decisionFeedback:boolean;reflection:'auto'|'intro'|'question'|'notes';questionId:string|null;answeredQuestionId:string|null;answerId:string};
type ViewEvent={type:'CHALLENGE';open:boolean}|{type:'DECISION_FEEDBACK';open:boolean}|{type:'QUESTION';id:string}|{type:'ANSWER';id:string;answerId:string}|{type:'NOTES'|'RESET'};
const initialView:View={challenge:false,decisionFeedback:false,reflection:'auto',questionId:null,answeredQuestionId:null,answerId:''};
function viewReducer(state:View,event:ViewEvent):View{
 switch(event.type){
  case 'CHALLENGE':return {...state,challenge:event.open};
  case 'DECISION_FEEDBACK':return {...state,decisionFeedback:event.open};
  case 'QUESTION':return {...state,reflection:'question',questionId:event.id,answeredQuestionId:null,answerId:''};
  case 'ANSWER':return {...state,answeredQuestionId:event.id,answerId:event.answerId};
  case 'NOTES':return {...state,reflection:'notes'};
  case 'RESET':return initialView;
 }
}
export default function GameShell(){
 const {state,dispatch,ready,invalid,storageError,reset,moment,dismissMoment}=useGame();
 const {settings,change,error:settingsError}=useSettings();const reducedBySystem=useReducedMotion();
 const [modal,setModal]=useState<ModalName>(null);const [view,viewDispatch]=useReducer(viewReducer,initialView);
 const [objection,objectionDispatch]=useChoiceFlow();const [decision,decisionDispatch]=useChoiceFlow();
 const heading=useRef<HTMLHeadingElement>(null);const frame=useRef<HTMLElement>(null);const router=useRouter();
 const motionEnabled=!settings.reducedMotion&&!reducedBySystem;const instant=settings.instantText||!motionEnabled;
 const focus=getInvestigationFocus(state);const currentStatement=bookCase.statements.find(t=>t.id===state.statementId)!;
 const intro=bookCase.nodes.find(n=>n.id===state.dialogueNodeId)??bookCase.nodes[0];
 useEffect(()=>{if(ready)heading.current?.focus();},[ready,state.phase]);
 useEffect(()=>{
  if(!moment)return;
  if(!motionEnabled){queueMicrotask(()=>dismissMoment(moment.sequence));return;}
  const timer=setTimeout(()=>{if(!(document.activeElement instanceof HTMLElement)||document.activeElement.dataset.skipStory!=='true')dismissMoment(moment.sequence);},moment.duration);
  return()=>clearTimeout(timer);
 },[moment,motionEnabled,dismissMoment]);
 function send(event:GameEvent){dispatch(event);if(settings.mute)return;try{const ctx=new AudioContext();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);gain.gain.setValueAtTime(.025,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.16);osc.frequency.value=620;osc.start();osc.stop(ctx.currentTime+.16);osc.onended=()=>{void ctx.close();};}catch{}}
 function resetInterface(){viewDispatch({type:'RESET'});objectionDispatch({type:'RESET'});decisionDispatch({type:'RESET'});}
 function skipAnimation(){if(moment)dismissMoment(moment.sequence);frame.current?.querySelector<HTMLButtonElement>('[data-primary-action]')?.focus();}
 const question=bookCase.reflections.find(q=>q.id===view.questionId)??bookCase.reflections.find(q=>!q.acceptedIds.some(a=>state.reflectionAnswerIds.includes(`${q.id}:${a}`)))??bookCase.reflections[2];
 const questionDone=question.acceptedIds.some(a=>state.reflectionAnswerIds.includes(`${question.id}:${a}`));
 const reflectionView=view.reflection==='auto'?(reflectionsComplete(state)?'notes':state.reflectionAnswerIds.length?'question':'intro'):view.reflection;
 const choiceFocusKey=state.phase==='testimony'&&view.challenge?`objection:${objection.step}`:state.phase==='decision'&&!view.decisionFeedback?`decision:${decision.step}`:state.phase==='reflection'&&reflectionView==='question'?`reflection:${question.id}`:null;
 useEffect(()=>{
  if(!ready||invalid||!choiceFocusKey)return;
  const ticket=requestAnimationFrame(()=>{const selected=frame.current?.querySelector<HTMLInputElement>('input[type=radio]:checked');const first=frame.current?.querySelector<HTMLInputElement>('input[type=radio]');(selected??first)?.focus();});
  return()=>cancelAnimationFrame(ticket);
 },[ready,invalid,choiceFocusKey]);
 const resolution=bookCase.decisions.find(d=>d.id==='bersama')!;
 let speech:StorySpeech={speakerId:'nara',text:''};let action:StoryAction={label:'Lanjutkan',onClick:()=>{}};
 let sceneContent:React.ReactNode=null;let location='Pojok Baca · Senin pagi';let feedback=false;
 const reconstruction=state.phase==='testimony'&&state.statementId==='S03'&&state.evidenceIds.includes('E05')&&!view.challenge;
 if(state.phase==='intro'){
  speech=intro;action={label:state.dialogueNodeId===bookCase.nodes[3].id?'Mulai Penyelidikan':'Lanjutkan',onClick:()=>send({type:'ADVANCE_DIALOGUE'})};
 }else if(state.phase==='investigation'){
  location=focus.location.name;
  const evidence=bookCase.evidence.find(e=>e.id===focus.hotspot.evidenceId)!;
  speech=focus.collected?{speakerId:focus.hotspot.dialogue.speakerId,text:`${focus.hotspot.dialogue.text} ${evidence.limitation}`,expression:focus.hotspot.dialogue.expression}:{speakerId:'nara',text:`${focus.location.description} Kita periksa ${evidence.title.toLowerCase()} terlebih dahulu.`,expression:'penasaran'};
  feedback=focus.collected;
  action=focus.collected?{label:hasInvestigation(state)?'Masuk Musyawarah':'Petunjuk Berikutnya',onClick:()=>send({type:hasInvestigation(state)?'ENTER_TESTIMONY':'NEXT_INVESTIGATION'})}:{label:focus.hotspot.label,onClick:()=>send({type:'COLLECT_EVIDENCE',evidenceId:focus.hotspot.evidenceId})};
 }else if(state.phase==='testimony'){
  location='Ruang Musyawarah';
  const resolved=state.resolvedStatementIds.includes('S02');
  const explanation=state.feedback&&!state.feedback.startsWith('Dengarkan setiap')?state.feedback.replace(/^Sari:\s*/,''):state.statementId==='S02'&&resolved?currentStatement.acceptedPairs[0].feedback:state.statementId==='S03'&&state.evidenceIds.includes('E05')?currentStatement.pressText:'';
  speech={speakerId:state.statementId==='S02'&&explanation?'nara':'sari',text:explanation||(state.statementId==='S01'||state.statementId==='S04'?`${currentStatement.text} ${currentStatement.pressText}`:currentStatement.text),expression:resolved?'tenang':'khawatir'};
  feedback=Boolean(explanation);
  if(view.challenge){
   const choosingEvidence=objection.step==='choice';
   speech={speakerId:'nara',text:choosingEvidence?'Aku punya bukti yang perlu kita pertimbangkan. Pilih satu bukti yang berhubungan dengan pernyataan Sari.':'Sekarang pilih alasan: bagaimana bukti itu membantu memeriksa pernyataan Sari?'};
   sceneContent=<ChoiceStage title={choosingEvidence?'Bukti mana yang kamu ajukan?':'Mengapa bukti itu sesuai?'} choices={choosingEvidence?bookCase.evidence.filter(e=>state.evidenceIds.includes(e.id)).map(e=>({id:e.id,text:e.title})):bookCase.objectionReasons} value={choosingEvidence?objection.choiceId:objection.reasonId} onChange={id=>objectionDispatch({type:choosingEvidence?'CHOOSE':'REASON',id})}/>;
   action=choosingEvidence?{label:'Pilih Alasan',disabled:!objection.choiceId,onClick:()=>objectionDispatch({type:'NEXT'})}:{label:'Ajukan Bukti',disabled:!objection.reasonId,onClick:()=>{send({type:'SUBMIT_OBJECTION',evidenceId:objection.choiceId,reasonId:objection.reasonId});viewDispatch({type:'CHALLENGE',open:false});}};
  }else if(state.statementId==='S02'&&!resolved){
   action={label:explanation?'Coba Bukti Lain':'KEBERATAN!',onClick:()=>{objectionDispatch({type:'RESET'});viewDispatch({type:'CHALLENGE',open:true});}};
  }else if(state.statementId==='S03'&&!state.evidenceIds.includes('E05')){
   action={label:'Tanya Lagi',onClick:()=>send({type:'PRESS_STATEMENT'})};
  }else if(state.statementId==='S04'){
   action=canDecide(state)?{label:'Susun Penyelesaian',onClick:()=>{decisionDispatch({type:'RESET'});send({type:'ENTER_DECISION'});}}:{label:'Periksa Cerita yang Belum Lengkap',onClick:()=>send({type:'SELECT_STATEMENT',statementId:resolved?'S03':'S02'})};
  }else action={label:'Lanjutkan Cerita',onClick:()=>{const next=getNextStatement(state);if(next)send({type:'SELECT_STATEMENT',statementId:next});}};
 }else if(state.phase==='decision'){
  location='Ruang Musyawarah · Menyusun solusi';
  if(view.decisionFeedback){
   speech={speakerId:'nara',text:state.feedback||'Mari tinjau lagi solusi dan alasan kita.'};feedback=true;
   sceneContent=<div className={s.storyPrompt}><Heart size={45}/><h2>Setiap teman perlu didengarkan.</h2><p>Kita masih bisa memilih solusi lain.</p></div>;
   action={label:'Coba Solusi Lain',onClick:()=>{decisionDispatch({type:'RESET'});viewDispatch({type:'DECISION_FEEDBACK',open:false});}};
  }else{
   const choosing=decision.step==='choice';
   speech={speakerId:'bu-lila',text:choosing?'Apa usulmu agar buku terawat dan setiap teman diperlakukan adil? Pilih satu penyelesaian.':'Solusi perlu alasan yang sesuai dengan bukti. Mengapa kamu memilih penyelesaian itu?'};
   sceneContent=<ChoiceStage title={choosing?'Apa usul penyelesaianmu?':'Apa alasanmu?'} choices={choosing?bookCase.decisions:bookCase.decisionReasons} value={choosing?decision.choiceId:decision.reasonId} onChange={id=>decisionDispatch({type:choosing?'CHOOSE':'REASON',id})}/>;
   action=choosing?{label:'Pilih Alasan',disabled:!decision.choiceId,onClick:()=>decisionDispatch({type:'NEXT'})}:{label:'Sampaikan Solusi',disabled:!decision.reasonId,onClick:()=>{const correct=bookCase.decisions.find(d=>d.id===decision.choiceId)?.acceptedReasonId===decision.reasonId;send({type:'SELECT_DECISION',decisionId:decision.choiceId,reasonId:decision.reasonId});if(!correct)viewDispatch({type:'DECISION_FEEDBACK',open:true});}};
  }
 }else if(state.phase==='reflection'){
  location='Kelas Kita · Sesudah musyawarah';
  if(reflectionView==='intro'){
   speech={speakerId:'bu-lila',text:`${resolution.consequence} Kemanusiaan berarti menghargai teman. Musyawarah berarti mendengarkan semua pihak. Hak membaca disertai kewajiban merawat buku bersama.`};
   sceneContent=<div className={s.storyPrompt}><ShieldCheck size={50}/><h2>Kita rawat bukunya.<br/>Kita jaga pertemanannya.</h2><div className={s.sharedBooks}><BookOpen/><Heart/><BookOpen/></div></div>;
   action={label:'Mulai Refleksi',onClick:()=>viewDispatch({type:'QUESTION',id:bookCase.reflections[0].id})};
  }else if(reflectionView==='notes'){
   speech={speakerId:'nara',text:'Ada ide untuk menjaga buku kelas? Kamu boleh menuliskannya. Catatan ini tidak dinilai dan hanya tersimpan di perangkatmu.'};
   sceneContent=<div className={s.notes}><label htmlFor="reflection-note">Catatan kecilmu (boleh dikosongkan)</label><textarea id="reflection-note" maxLength={2000} value={state.reflectionNote} onChange={e=>dispatch({type:'SET_NOTE',note:e.target.value})} placeholder="Tulis idemu tanpa nama atau sekolahmu."/><small>Tidak dinilai. Tidak diunggah.</small></div>;
   action={label:'Lihat Hasil Belajar',disabled:!reflectionsComplete(state),onClick:()=>send({type:'FINISH_CASE'})};
  }else{
   speech={speakerId:'nara',text:questionDone?question.explanation:view.answeredQuestionId===question.id?state.feedback:question.question};feedback=questionDone||view.answeredQuestionId===question.id;
   sceneContent=<ChoiceStage title={question.question} choices={question.choices} value={view.answeredQuestionId===question.id?view.answerId:state.reflectionAnswerIds.find(id=>id.startsWith(`${question.id}:`))?.split(':')[1]??''} onChange={id=>{viewDispatch({type:'ANSWER',id:question.id,answerId:id});send({type:'SUBMIT_REFLECTION',questionId:question.id,answerId:id});}}/>;
   action={label:questionDone?(question.id==='tindakan'?'Catat Ide Kecilmu':'Pertanyaan Berikutnya'):'Pilih Jawaban di Atas',disabled:!questionDone,onClick:()=>{const next=bookCase.reflections[bookCase.reflections.indexOf(question)+1];if(next)viewDispatch({type:'QUESTION',id:next.id});else viewDispatch({type:'NOTES'});}};
  }
 }else{
  location='Berkas 001 · Selesai';
  speech={speakerId:'nara',text:'Kamu sudah mendengar semua cerita, memeriksa bukti, dan memilih merawat buku bersama. Kita tetap belum tahu siapa yang menyenggol botol. Kita tidak menuduh tanpa bukti. Salah memilih lalu mencoba lagi adalah bagian dari belajar.'};
  sceneContent=<ResultScene score={score(state)}/>;
  action={label:'Kembali ke Papan Kasus',onClick:()=>router.push('/kasus')};
 }
 const phaseTitle=({intro:'Sebelum menyimpulkan, dengarkan.',investigation:'Satu petunjuk, satu langkah.',testimony:'Dengarkan semua sisi.',decision:'Apa penyelesaian yang adil?',reflection:'Apa yang kita pelajari?',result:'Keadilan dimulai dari mendengarkan.'})[state.phase];
 if(!ready)return <main className={s.loading}><Compass size={38}/><h1>Membuka berkas petualangan…</h1></main>;
 return <div className={s.app} data-reduced-motion={!motionEnabled}>
  <header className={s.header}><Logo/><div className={s.caseTitle}><span>BERKAS 001</span><strong>Misteri Buku Kelas yang Rusak</strong></div><div className={s.tools}><button aria-label="Berkas Bukti" className={s.toolButton} onClick={()=>setModal('evidence')}><ClipboardList size={20}/><span>{state.evidenceIds.length}/5</span></button><button aria-label="Menu Kasus" className={s.toolButton} onClick={()=>setModal('menu')}><Menu size={22}/></button></div></header>
  <div className={s.progress}><span>{phaseLabels[state.phase]}</span><div aria-label="Tahap petualangan">{phaseOrder.map((p,i)=><span key={p} aria-current={state.phase===p?'step':undefined} title={phaseLabels[p]} data-complete={i<phaseOrder.indexOf(state.phase)}/>)}</div><span>{state.phase==='investigation'?`Petunjuk ${focus.ordinal} / 4`:state.phase==='testimony'?`Cerita ${bookCase.statements.indexOf(currentStatement)+1} / 4`:'Pelan-pelan, tanpa batas waktu'}</span></div>
  {(storageError||settingsError)&&<p role="alert" className={s.storageWarning}>Penyimpanan browser tidak tersedia. Kamu tetap bisa bermain, tetapi progres sesi ini mungkin tidak tersimpan.</p>}
  {invalid?<main className={s.invalid}><ShieldCheck size={44}/><h1>Progres belum bisa dibuka.</h1><p>Data tersimpan rusak atau memakai versi berbeda. Data lama belum dihapus.</p><button className={ui.dangerButton} onClick={()=>setModal('reset')}>Mulai Ulang Kasus</button><Link className={ui.secondary} href="/">Kembali ke Beranda</Link></main>:
   <main ref={frame} className={s.theater} role="region" aria-label="Panggung Cerita" data-phase={state.phase}>
    <h1 ref={heading} tabIndex={-1} className={s.screenTitle}>{phaseTitle}</h1>
    <CaseScene state={state} location={location} speakerId={speech.speakerId} expression={speech.expression} evidenceId={state.phase==='investigation'?focus.hotspot.evidenceId:undefined} collected={state.phase==='investigation'&&focus.collected} onInspect={()=>send({type:'COLLECT_EVIDENCE',evidenceId:focus.hotspot.evidenceId})} reconstruction={reconstruction}>
     {sceneContent}
    </CaseScene>
    {moment?.kind==='objection'&&motionEnabled&&<div className={s.objectionCue} key={moment.sequence} aria-hidden="true">{moment.title}</div>}
    {moment&&motionEnabled&&<button data-skip-story="true" className={s.skipAnimation} onClick={skipAnimation}>Lewati Animasi</button>}
    {view.challenge&&objection.step==='reason'&&<button className={s.backChoice} onClick={()=>objectionDispatch({type:'BACK'})}><ArrowLeft size={13}/> Ubah Bukti</button>}
    {state.phase==='decision'&&decision.step==='reason'&&!view.decisionFeedback&&<button className={s.backChoice} onClick={()=>decisionDispatch({type:'BACK'})}><ArrowLeft size={13}/> Ubah Solusi</button>}
    <StoryCaption speech={speech} action={action} instant={instant} feedback={feedback}/>
   </main>}
  {modal&&<Modal title={modal==='menu'?'Menu Kasus':modal==='evidence'?'Berkas Bukti':modal==='history'?'Riwayat Percakapan':modal==='settings'?'Pengaturan':modal==='review'?'Tinjau Petunjuk':'Mulai ulang petualangan?'} onClose={()=>setModal(null)}>
   {modal==='menu'&&<div className={s.menuList}><button onClick={()=>setModal('settings')}><Settings size={20}/> Pengaturan</button><button onClick={()=>setModal('history')}><History size={20}/> Riwayat Percakapan</button>{state.phase==='testimony'&&<button onClick={()=>{send({type:'HINT'});setModal(null);}}><Lightbulb size={20}/> Petunjuk</button>}{(state.phase==='testimony'||state.phase==='decision')&&<button onClick={()=>{send({type:'BACK_INVESTIGATION'});resetInterface();setModal(null);}}><SearchIcon/> Kembali Investigasi</button>}{state.phase==='investigation'&&state.evidenceIds.length>0&&<button onClick={()=>setModal('review')}><ClipboardList size={20}/> Tinjau Petunjuk</button>}<Link href="/panduan"><BookOpen size={20}/> Panduan & Tujuan Belajar</Link><Link href="/kasus"><ArrowLeft size={20}/> Papan Kasus</Link><p>Musyawarah pendidikan di sekolah fiktif. Progres hanya tersimpan di browser ini.</p></div>}
   {modal==='settings'&&<SettingsPanel settings={settings} change={change} onReset={()=>setModal('reset')}/>}
   {modal==='evidence'&&<EvidenceDrawer evidenceIds={state.evidenceIds}/>}
   {modal==='history'&&<div className={s.history}>{state.historyIds.map(id=>{const n=[...bookCase.nodes,...bookCase.locations.flatMap(l=>l.hotspots.map(h=>h.dialogue))].find(n=>n.id===id);const t=bookCase.statements.find(t=>`press:${t.id}`===id);return <article key={id}><strong>{n?bookCase.characters.find(c=>c.id===n.speakerId)?.name:'Sari'}</strong><p>{n?.text??t?.pressText}</p></article>;})}</div>}
   {modal==='review'&&<div className={s.menuList}>{bookCase.locations.flatMap(l=>l.hotspots.filter(h=>state.evidenceIds.includes(h.evidenceId)).map(h=><button key={h.id} onClick={()=>{send({type:'VISIT_LOCATION',locationId:l.id});send({type:'COLLECT_EVIDENCE',evidenceId:h.evidenceId});setModal(null);}}><Check size={18}/>{bookCase.evidence.find(e=>e.id===h.evidenceId)?.title}</button>))}</div>}
   {modal==='reset'&&<><p>Progres dan catatan kasus ini akan dihapus. Pengaturanmu dan data browser lainnya tetap tersimpan.</p><div className={s.resetActions}><button className={ui.secondary} onClick={()=>setModal(null)}>Batal</button><button className={ui.dangerButton} onClick={()=>{reset();resetInterface();setModal(null);}}>Ya, Mulai Ulang</button></div></>}
  </Modal>}
 </div>;
}
function SearchIcon(){return <Compass size={20}/>;}
