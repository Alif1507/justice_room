'use client';
import {useEffect,useReducer,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft,BookOpen,Check,ClipboardList,Compass,History,Lightbulb,Menu,Settings,ShieldCheck} from 'lucide-react';
import {bookCase} from '@/content/cases/buku-rusak';
import {canDecide,hasInvestigation,phaseLabels,phaseOrder,reflectionsComplete,score} from '@/lib/game/selectors';
import EndingScene from './EndingScene';
import {getDecisionEnding} from '@/lib/game/endings';
import {getInvestigationFocus,getNextStatement} from '@/lib/game/guided';
import type {CaseDefinition,GameEvent} from '@/lib/game/types';
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
type View={endingStep:number;activity:boolean;activityReading:boolean;referenceIndex:number;activityFeedback:boolean;challenge:boolean;decisionFeedback:boolean;reflection:'auto'|'intro'|'question'|'notes';questionId:string|null;answeredQuestionId:string|null;answerId:string};
type ViewEvent={type:'ACTIVITY';open:boolean}|{type:'ACTIVITY_FEEDBACK';open:boolean}|{type:'CHALLENGE';open:boolean}|{type:'DECISION_FEEDBACK';open:boolean}|{type:'QUESTION';id:string}|{type:'ANSWER';id:string;answerId:string}|{type:'NEXT_ENDING'|'RESET_ENDING'|'NEXT_SOURCE'|'ACTIVITY_QUESTION'|'ACTIVITY_REFERENCE'|'NOTES'|'RESET'};
const initialView:View={endingStep:0,activity:false,activityReading:true,referenceIndex:0,activityFeedback:false,challenge:false,decisionFeedback:false,reflection:'auto',questionId:null,answeredQuestionId:null,answerId:''};
function viewReducer(state:View,event:ViewEvent):View{
 switch(event.type){
  case 'NEXT_ENDING':return {...state,endingStep:Math.min(2,state.endingStep+1)};
  case 'RESET_ENDING':return {...state,endingStep:0};
  case 'ACTIVITY':return {...state,activity:event.open,activityReading:true,referenceIndex:0,activityFeedback:false};
  case 'ACTIVITY_FEEDBACK':return {...state,activityFeedback:event.open};
  case 'NEXT_SOURCE':return {...state,referenceIndex:state.referenceIndex+1};
  case 'ACTIVITY_QUESTION':return {...state,activityReading:false};
  case 'ACTIVITY_REFERENCE':return {...state,activityReading:true,referenceIndex:0};
  case 'CHALLENGE':return {...state,challenge:event.open};
  case 'DECISION_FEEDBACK':return {...state,decisionFeedback:event.open,endingStep:0};
  case 'QUESTION':return {...state,reflection:'question',questionId:event.id,answeredQuestionId:null,answerId:''};
  case 'ANSWER':return {...state,answeredQuestionId:event.id,answerId:event.answerId};
  case 'NOTES':return {...state,reflection:'notes'};
  case 'RESET':return initialView;
 }
}
export default function GameShell({caseDefinition=bookCase}:{caseDefinition?:CaseDefinition}){
 const {state,dispatch,ready,invalid,storageError,reset,moment,dismissMoment}=useGame(caseDefinition);
 const {settings,change,error:settingsError}=useSettings();const reducedBySystem=useReducedMotion();
 const [modal,setModal]=useState<ModalName>(null);const [view,viewDispatch]=useReducer(viewReducer,initialView);
 const [objection,objectionDispatch]=useChoiceFlow();const [decision,decisionDispatch]=useChoiceFlow();const [activityChoice,activityDispatch]=useChoiceFlow();
 const heading=useRef<HTMLHeadingElement>(null);const frame=useRef<HTMLElement>(null);const router=useRouter();
 const motionEnabled=!settings.reducedMotion&&!reducedBySystem;const instant=settings.instantText||!motionEnabled;
 const focus=getInvestigationFocus(state,caseDefinition);const currentStatement=caseDefinition.statements.find(t=>t.id===state.statementId)!;
 const intro=caseDefinition.nodes.find(n=>n.id===state.dialogueNodeId)??caseDefinition.nodes[0];
 useEffect(()=>{if(ready)heading.current?.focus();},[ready,state.phase]);
 useEffect(()=>{
  if(!moment)return;
  if(!motionEnabled){queueMicrotask(()=>dismissMoment(moment.sequence));return;}
  const timer=setTimeout(()=>{if(!(document.activeElement instanceof HTMLElement)||document.activeElement.dataset.skipStory!=='true')dismissMoment(moment.sequence);},moment.duration);
  return()=>clearTimeout(timer);
 },[moment,motionEnabled,dismissMoment]);
 function send(event:GameEvent){dispatch(event);if(settings.mute)return;try{const ctx=new AudioContext();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);gain.gain.setValueAtTime(.025,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.16);osc.frequency.value=620;osc.start();osc.stop(ctx.currentTime+.16);osc.onended=()=>{void ctx.close();};}catch{}}
 function resetInterface(){viewDispatch({type:'RESET'});objectionDispatch({type:'RESET'});decisionDispatch({type:'RESET'});activityDispatch({type:'RESET'});}
 function skipAnimation(){if(moment)dismissMoment(moment.sequence);frame.current?.querySelector<HTMLButtonElement>('[data-primary-action]')?.focus();}
 const question=caseDefinition.reflections.find(q=>q.id===view.questionId)??caseDefinition.reflections.find(q=>!q.acceptedIds.some(a=>state.reflectionAnswerIds.includes(`${q.id}:${a}`)))??caseDefinition.reflections[2];
 const questionDone=question.acceptedIds.some(a=>state.reflectionAnswerIds.includes(`${question.id}:${a}`));
 const reflectionView=view.reflection==='auto'?(reflectionsComplete(state,caseDefinition)?'notes':state.reflectionAnswerIds.length?'question':'intro'):view.reflection;
 const choiceFocusKey=state.phase==='investigation'&&view.activity?(view.activityReading?'activity-reference':view.activityFeedback?'activity-feedback':'activity'):state.phase==='testimony'&&view.challenge?`objection:${objection.step}`:state.phase==='decision'&&!view.decisionFeedback?`decision:${decision.step}`:state.phase==='reflection'&&reflectionView==='question'?`reflection:${question.id}`:null;
 useEffect(()=>{
  if(!ready||invalid||!choiceFocusKey)return;
  const ticket=requestAnimationFrame(()=>{if(choiceFocusKey==='activity-reference'){frame.current?.querySelector<HTMLElement>('[data-activity-source]')?.focus();return;}if(choiceFocusKey==='activity-feedback'){frame.current?.querySelector<HTMLButtonElement>('[data-primary-action]')?.focus();return;}const selected=frame.current?.querySelector<HTMLInputElement>('input[type=radio]:checked');const first=frame.current?.querySelector<HTMLInputElement>('input[type=radio]');(selected??first)?.focus();});
  return()=>cancelAnimationFrame(ticket);
 },[ready,invalid,choiceFocusKey]);
 const chosenEnding=getDecisionEnding(state,caseDefinition);
 const inEnding=Boolean(chosenEnding&&(state.phase==='decision'||state.phase==='reflection'&&reflectionView==='intro'));
 const endingBeat=chosenEnding?.beats[view.endingStep];
 let speech:StorySpeech={speakerId:'nara',text:''};let action:StoryAction={label:'Lanjutkan',onClick:()=>{}};
 let sceneContent:React.ReactNode=null;let location=caseDefinition.locations[0].name;let feedback=false;
 const contextRevealed=state.phase==='testimony'&&Boolean(currentStatement.unlockEvidenceId&&state.evidenceIds.includes(currentStatement.unlockEvidenceId))&&!view.challenge;
 function inspectCurrent(){
  const task=caseDefinition.activity;
  if(task?.evidenceId===focus.hotspot.evidenceId&&!state.activityAnswerIds.includes(`${task.id}:${task.acceptedId}`)){activityDispatch({type:'RESET'});viewDispatch({type:'ACTIVITY',open:true});}
  else send({type:'COLLECT_EVIDENCE',evidenceId:focus.hotspot.evidenceId});
 }
 const reconstruction=caseDefinition.id==='buku-rusak'&&state.phase==='testimony'&&state.statementId==='S03'&&state.evidenceIds.includes('E05')&&!view.challenge;
 if(state.phase==='intro'){
  speech=intro;action={label:state.dialogueNodeId===caseDefinition.nodes[caseDefinition.nodes.length-1].id?'Mulai Penyelidikan':'Lanjutkan',onClick:()=>send({type:'ADVANCE_DIALOGUE'})};
 }else if(state.phase==='investigation'){
  location=focus.location.name;
  const evidence=caseDefinition.evidence.find(e=>e.id===focus.hotspot.evidenceId)!;
  speech=focus.collected?{speakerId:focus.hotspot.dialogue.speakerId,text:`${focus.hotspot.dialogue.text} ${evidence.limitation}`,expression:focus.hotspot.dialogue.expression}:{speakerId:'nara',text:`${focus.location.description} Kita periksa ${evidence.title.toLowerCase()} terlebih dahulu.`,expression:'penasaran'};
  feedback=focus.collected;
  action=focus.collected?{label:hasInvestigation(state,caseDefinition)?'Masuk Musyawarah':'Petunjuk Berikutnya',onClick:()=>send({type:hasInvestigation(state,caseDefinition)?'ENTER_TESTIMONY':'NEXT_INVESTIGATION'})}:{label:focus.hotspot.label,onClick:inspectCurrent};
  if(view.activity&&caseDefinition.activity){
   const task=caseDefinition.activity;const solved=state.activityAnswerIds.includes(`${task.id}:${task.acceptedId}`);
   const sourceIndex=Math.min(view.referenceIndex,task.displayItems.length-1);const source=task.displayItems[sourceIndex];const reference=`${source.label}: ${source.value}.`;
   speech={speakerId:'nara',text:view.activityReading?`${task.instruction} ${reference}`:solved?task.feedback:view.activityFeedback?task.incorrectFeedback:'Pilih satu jawaban berdasarkan petunjuk. Kamu boleh membuka Lihat Petunjuk kapan saja.'};feedback=!view.activityReading&&(solved||view.activityFeedback);
   sceneContent=view.activityReading?<div className={s.activityPanel}><h2 data-activity-source tabIndex={-1} className={s.activityTitle}>Baca Petunjuknya Dulu</h2><span className={s.sourceStep}>DATA {sourceIndex+1} / {task.displayItems.length}</span><dl className={`${s.activityReference} ${s.activityReading}`}><div key={source.label}><dt>{source.label}</dt><dd>{source.value}</dd></div></dl></div>:solved||view.activityFeedback?<div className={s.storyPrompt}><Lightbulb size={43}/><h2>{solved?'Cocok, petunjuk siap disimpan.':'Mari cocokkan sekali lagi.'}</h2><p>{solved?'Kamu sudah memeriksa sumber dan pilihanmu.':'Baca penjelasannya, lalu coba lagi.'}</p></div>:<ChoiceStage title={task.title} choices={task.choices} value={solved?task.acceptedId:activityChoice.choiceId} onChange={id=>!solved&&activityDispatch({type:'CHOOSE',id})}/>;
   action=view.activityReading?{label:sourceIndex<task.displayItems.length-1?'Data Berikutnya':'Mulai Tantangan',onClick:()=>viewDispatch({type:sourceIndex<task.displayItems.length-1?'NEXT_SOURCE':'ACTIVITY_QUESTION'})}:view.activityFeedback?{label:'Coba Lagi',onClick:()=>viewDispatch({type:'ACTIVITY_FEEDBACK',open:false})}:solved?{label:'Simpan Bukti',onClick:()=>{send({type:'COLLECT_EVIDENCE',evidenceId:task.evidenceId});viewDispatch({type:'ACTIVITY',open:false});}}:{label:'Periksa Pilihan',disabled:!activityChoice.choiceId,onClick:()=>{send({type:'SUBMIT_ACTIVITY',answerId:activityChoice.choiceId});viewDispatch({type:'ACTIVITY_FEEDBACK',open:activityChoice.choiceId!==task.acceptedId});}};
  }
 }else if(state.phase==='testimony'){
  location='Ruang Musyawarah';
  const resolved=state.resolvedStatementIds.includes('S02');
  const explanation=state.feedback&&!state.feedback.startsWith('Dengarkan setiap')?state.feedback.replace(`${caseDefinition.characters.find(c=>c.id===currentStatement.speakerId)!.name}: `,''):state.statementId==='S02'&&resolved?currentStatement.acceptedPairs[0].feedback:state.statementId==='S03'&&state.evidenceIds.includes('E05')?currentStatement.pressText:'';
  speech={speakerId:state.statementId==='S02'&&explanation?'nara':currentStatement.speakerId,text:explanation||(state.statementId==='S01'||state.statementId==='S04'?`${currentStatement.text} ${currentStatement.pressText}`:currentStatement.text),expression:resolved?'tenang':'khawatir'};
  feedback=Boolean(explanation);
  if(view.challenge){
   const choosingEvidence=objection.step==='choice';
   speech={speakerId:'nara',text:choosingEvidence?'Aku punya bukti yang perlu kita pertimbangkan. Pilih satu bukti yang berhubungan dengan pernyataan teman.':'Sekarang pilih alasan: bagaimana bukti itu membantu memeriksa pernyataan teman?'};
   sceneContent=<ChoiceStage title={choosingEvidence?'Bukti mana yang kamu ajukan?':'Mengapa bukti itu sesuai?'} choices={choosingEvidence?caseDefinition.evidence.filter(e=>state.evidenceIds.includes(e.id)).map(e=>({id:e.id,text:e.title})):caseDefinition.objectionReasons} value={choosingEvidence?objection.choiceId:objection.reasonId} onChange={id=>objectionDispatch({type:choosingEvidence?'CHOOSE':'REASON',id})}/>;
   action=choosingEvidence?{label:'Pilih Alasan',disabled:!objection.choiceId,onClick:()=>objectionDispatch({type:'NEXT'})}:{label:'Ajukan Bukti',disabled:!objection.reasonId,onClick:()=>{send({type:'SUBMIT_OBJECTION',evidenceId:objection.choiceId,reasonId:objection.reasonId});viewDispatch({type:'CHALLENGE',open:false});}};
  }else if(state.statementId==='S02'&&!resolved){
   action={label:explanation?'Coba Bukti Lain':'KEBERATAN!',onClick:()=>{objectionDispatch({type:'RESET'});viewDispatch({type:'CHALLENGE',open:true});}};
  }else if(state.statementId==='S03'&&!state.evidenceIds.includes('E05')){
   action={label:'Tanya Lagi',onClick:()=>send({type:'PRESS_STATEMENT'})};
  }else if(state.statementId==='S04'){
   action=canDecide(state,caseDefinition)?{label:'Susun Penyelesaian',onClick:()=>{decisionDispatch({type:'RESET'});send({type:'ENTER_DECISION'});}}:{label:'Periksa Cerita yang Belum Lengkap',onClick:()=>send({type:'SELECT_STATEMENT',statementId:resolved?'S03':'S02'})};
  }else action={label:'Lanjutkan Cerita',onClick:()=>{const next=getNextStatement(state,caseDefinition);if(next)send({type:'SELECT_STATEMENT',statementId:next});}};
 }else if(state.phase==='decision'){
  location='Ruang Musyawarah · Menyusun solusi';
  if(chosenEnding&&endingBeat){
   speech=endingBeat;feedback=true;
   sceneContent=<EndingScene ending={chosenEnding} step={view.endingStep}/>;
   action=view.endingStep<chosenEnding.beats.length-1?{label:'Lanjutkan',onClick:()=>viewDispatch({type:'NEXT_ENDING'})}:{label:'Coba Solusi Lain',onClick:()=>{send({type:'RETRY_DECISION'});decisionDispatch({type:'RESET'});viewDispatch({type:'DECISION_FEEDBACK',open:false});}};
  }else{
   const choosing=decision.step==='choice';
   speech={speakerId:'bu-lila',text:choosing?caseDefinition.presentation.decisionPrompt:'Solusi perlu alasan yang sesuai dengan bukti. Mengapa kamu memilih penyelesaian itu?'};
   sceneContent=<ChoiceStage title={choosing?'Apa usul penyelesaianmu?':'Apa alasanmu?'} choices={choosing?caseDefinition.decisions:caseDefinition.decisionReasons} value={choosing?decision.choiceId:decision.reasonId} onChange={id=>decisionDispatch({type:choosing?'CHOOSE':'REASON',id})}/>;
   action=choosing?{label:'Pilih Alasan',disabled:!decision.choiceId,onClick:()=>decisionDispatch({type:'NEXT'})}:{label:'Sampaikan Solusi',disabled:!decision.reasonId,onClick:()=>{const correct=caseDefinition.decisions.find(d=>d.id===decision.choiceId)?.acceptedReasonId===decision.reasonId;viewDispatch({type:'RESET_ENDING'});send({type:'SELECT_DECISION',decisionId:decision.choiceId,reasonId:decision.reasonId});if(!correct)viewDispatch({type:'DECISION_FEEDBACK',open:true});}};
  }
 }else if(state.phase==='reflection'){
  location='Kelas Kita · Sesudah musyawarah';
  if(reflectionView==='intro'){
   if(chosenEnding&&endingBeat){
    speech={...endingBeat,text:endingBeat.text+(view.endingStep===chosenEnding.beats.length-1?` ${caseDefinition.presentation.learningText}`:'')};
    sceneContent=<EndingScene ending={chosenEnding} step={view.endingStep}/>;
    action=view.endingStep<chosenEnding.beats.length-1?{label:'Lanjutkan',onClick:()=>viewDispatch({type:'NEXT_ENDING'})}:{label:'Mulai Refleksi',onClick:()=>viewDispatch({type:'QUESTION',id:caseDefinition.reflections[0].id})};
   }
  }else if(reflectionView==='notes'){
   speech={speakerId:'nara',text:`${caseDefinition.presentation.reflectionPrompt} Catatan tidak dinilai dan hanya tersimpan di perangkatmu.`};
   sceneContent=<div className={s.notes}><label htmlFor="reflection-note">Catatan kecilmu (boleh dikosongkan)</label><textarea id="reflection-note" maxLength={2000} value={state.reflectionNote} onChange={e=>dispatch({type:'SET_NOTE',note:e.target.value})} placeholder="Tulis idemu tanpa nama atau sekolahmu."/><small>Tidak dinilai. Tidak diunggah.</small></div>;
   action={label:'Lihat Hasil Belajar',disabled:!reflectionsComplete(state,caseDefinition),onClick:()=>send({type:'FINISH_CASE'})};
  }else{
   speech={speakerId:'nara',text:questionDone?question.explanation:view.answeredQuestionId===question.id?state.feedback:question.question};feedback=questionDone||view.answeredQuestionId===question.id;
   sceneContent=<ChoiceStage title={question.question} choices={question.choices} value={view.answeredQuestionId===question.id?view.answerId:state.reflectionAnswerIds.find(id=>id.startsWith(`${question.id}:`))?.split(':')[1]??''} onChange={id=>{viewDispatch({type:'ANSWER',id:question.id,answerId:id});send({type:'SUBMIT_REFLECTION',questionId:question.id,answerId:id});}}/>;
   action={label:questionDone?(question.id===caseDefinition.reflections[caseDefinition.reflections.length-1].id?'Catat Ide Kecilmu':'Pertanyaan Berikutnya'):'Pilih Jawaban di Atas',disabled:!questionDone,onClick:()=>{const next=caseDefinition.reflections[caseDefinition.reflections.indexOf(question)+1];if(next)viewDispatch({type:'QUESTION',id:next.id});else viewDispatch({type:'NOTES'});}};
  }
 }else{
  location=`Episode ${String(caseDefinition.presentation.episode).padStart(2,'0')} · Selesai`;
  speech={speakerId:'nara',text:caseDefinition.presentation.completionText};
  sceneContent=<ResultScene score={score(state)} endingTitle={chosenEnding?.title}/>;
  action={label:'Kembali ke Papan Kasus',onClick:()=>router.push('/kasus')};
 }
 const phaseTitle=({intro:'Sebelum menyimpulkan, dengarkan.',investigation:'Satu petunjuk, satu langkah.',testimony:'Dengarkan semua sisi.',decision:'Apa penyelesaian yang adil?',reflection:'Apa yang kita pelajari?',result:'Keadilan dimulai dari mendengarkan.'})[state.phase];
 if(!ready)return <main className={s.loading}><Compass size={38}/><h1>Membuka berkas petualangan…</h1></main>;
 return <div className={s.app} data-reduced-motion={!motionEnabled}>
  <header className={s.header}><Logo/><div className={s.caseTitle}><span>EPISODE {String(caseDefinition.presentation.episode).padStart(2,'0')}</span><strong>{caseDefinition.title}</strong></div><div className={s.tools}><button aria-label="Berkas Bukti" className={s.toolButton} onClick={()=>setModal('evidence')}><ClipboardList size={20}/><span>{state.evidenceIds.length}/5</span></button><button aria-label="Menu Kasus" className={s.toolButton} onClick={()=>setModal('menu')}><Menu size={22}/></button></div></header>
  <div className={s.progress}><span>{phaseLabels[state.phase]}</span><div aria-label="Tahap petualangan">{phaseOrder.map((p,i)=><span key={p} aria-current={state.phase===p?'step':undefined} title={phaseLabels[p]} data-complete={i<phaseOrder.indexOf(state.phase)}/>)}</div><span>{state.phase==='investigation'?`Petunjuk ${focus.ordinal} / 4`:state.phase==='testimony'?`Cerita ${caseDefinition.statements.indexOf(currentStatement)+1} / 4`:'Pelan-pelan, tanpa batas waktu'}</span></div>
  {(storageError||settingsError)&&<p role="alert" className={s.storageWarning}>Penyimpanan browser tidak tersedia. Kamu tetap bisa bermain, tetapi progres sesi ini mungkin tidak tersimpan.</p>}
  {invalid?<main className={s.invalid}><ShieldCheck size={44}/><h1>Progres belum bisa dibuka.</h1><p>Data tersimpan rusak atau memakai versi berbeda. Data lama belum dihapus.</p><button className={ui.dangerButton} onClick={()=>setModal('reset')}>Mulai Ulang Kasus</button><Link className={ui.secondary} href="/">Kembali ke Beranda</Link></main>:
   <main ref={frame} className={s.theater} role="region" aria-label="Panggung Cerita" data-phase={state.phase} data-ending={chosenEnding?.id} data-ending-beat={inEnding?view.endingStep+1:undefined}>
    <h1 ref={heading} tabIndex={-1} className={s.screenTitle}>{inEnding?'Akhir cerita pilihanmu.':phaseTitle}</h1>
    <CaseScene endingActive={inEnding} caseDefinition={caseDefinition} revelationActive={contextRevealed&&!reconstruction} state={state} location={location} speakerId={speech.speakerId} expression={speech.expression} evidenceId={state.phase==='investigation'?focus.hotspot.evidenceId:undefined} collected={state.phase==='investigation'&&focus.collected} onInspect={inspectCurrent} reconstruction={reconstruction}>
     {sceneContent}
    </CaseScene>
    {moment?.kind==='objection'&&motionEnabled&&<div className={s.objectionCue} key={moment.sequence} aria-hidden="true">{moment.title}</div>}
    {moment&&motionEnabled&&<button data-skip-story="true" className={s.skipAnimation} onClick={skipAnimation}>Lewati Animasi</button>}
    {view.activity&&!view.activityReading&&!view.activityFeedback&&!state.activityAnswerIds.length&&<button className={s.backChoice} onClick={()=>viewDispatch({type:'ACTIVITY_REFERENCE'})}><ArrowLeft size={13}/> Lihat Petunjuk</button>}
    {view.challenge&&objection.step==='reason'&&<button className={s.backChoice} onClick={()=>objectionDispatch({type:'BACK'})}><ArrowLeft size={13}/> Ubah Bukti</button>}
    {state.phase==='decision'&&decision.step==='reason'&&!view.decisionFeedback&&<button className={s.backChoice} onClick={()=>decisionDispatch({type:'BACK'})}><ArrowLeft size={13}/> Ubah Solusi</button>}
    {state.phase==='result'&&<button className={s.replayResult} onClick={()=>setModal('reset')}><History size={15}/> Mainkan Ulang Episode</button>}
    <StoryCaption caseDefinition={caseDefinition} speech={speech} action={action} instant={instant} feedback={feedback} chapterLabel={inEnding?`AKHIR CERITA | ${view.endingStep+1} / 3`:undefined}/>
   </main>}
  {modal&&<Modal title={modal==='menu'?'Menu Kasus':modal==='evidence'?'Berkas Bukti':modal==='history'?'Riwayat Percakapan':modal==='settings'?'Pengaturan':modal==='review'?'Tinjau Petunjuk':'Mulai ulang petualangan?'} onClose={()=>setModal(null)}>
   {modal==='menu'&&<div className={s.menuList}><button onClick={()=>setModal('reset')}><History size={20}/> Mainkan Ulang Episode</button><button onClick={()=>setModal('settings')}><Settings size={20}/> Pengaturan</button><button onClick={()=>setModal('history')}><History size={20}/> Riwayat Percakapan</button>{state.phase==='testimony'&&<button onClick={()=>{send({type:'HINT'});setModal(null);}}><Lightbulb size={20}/> Petunjuk</button>}{(state.phase==='testimony'||state.phase==='decision')&&<button onClick={()=>{send({type:'BACK_INVESTIGATION'});resetInterface();setModal(null);}}><SearchIcon/> Kembali Investigasi</button>}{state.phase==='investigation'&&state.evidenceIds.length>0&&<button onClick={()=>setModal('review')}><ClipboardList size={20}/> Tinjau Petunjuk</button>}<Link href="/panduan"><BookOpen size={20}/> Panduan & Tujuan Belajar</Link><Link href="/kasus"><ArrowLeft size={20}/> Papan Kasus</Link><p>Musyawarah pendidikan di sekolah fiktif. Progres hanya tersimpan di browser ini.</p></div>}
   {modal==='settings'&&<SettingsPanel settings={settings} change={change} onReset={()=>setModal('reset')}/>}
   {modal==='evidence'&&<EvidenceDrawer caseDefinition={caseDefinition} evidenceIds={state.evidenceIds}/>}
   {modal==='history'&&<div className={s.history}>{state.historyIds.map(id=>{const n=[...caseDefinition.nodes,...caseDefinition.locations.flatMap(l=>l.hotspots.map(h=>h.dialogue))].find(n=>n.id===id);const t=caseDefinition.statements.find(t=>`press:${t.id}`===id);return <article key={id}><strong>{n?caseDefinition.characters.find(c=>c.id===n.speakerId)?.name:caseDefinition.characters.find(c=>c.id===t?.speakerId)?.name??'Nara'}</strong><p>{n?.text??t?.pressText}</p></article>;})}</div>}
   {modal==='review'&&<div className={s.menuList}>{caseDefinition.locations.flatMap(l=>l.hotspots.filter(h=>state.evidenceIds.includes(h.evidenceId)).map(h=><button key={h.id} onClick={()=>{send({type:'VISIT_LOCATION',locationId:l.id});send({type:'COLLECT_EVIDENCE',evidenceId:h.evidenceId});setModal(null);}}><Check size={18}/>{caseDefinition.evidence.find(e=>e.id===h.evidenceId)?.title}</button>))}</div>}
   {modal==='reset'&&<><p>Mainkan ulang <strong>{caseDefinition.title}</strong> dari awal? Hanya progres dan catatan episode ini yang dihapus. Episode lain serta pengaturan tetap tersimpan.</p><div className={s.resetActions}><button className={ui.secondary} onClick={()=>setModal(null)}>Batal</button><button className={ui.dangerButton} onClick={()=>{reset();resetInterface();setModal(null);}}>Ya, Mulai Ulang</button></div></>}
  </Modal>}
 </div>;
}
function SearchIcon(){return <Compass size={20}/>;}
