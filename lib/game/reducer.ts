import { bookCase } from '../../content/cases/buku-rusak.ts';
import type { CaseDefinition, GameState, GameEvent } from './types.ts';
import { hasInvestigation, canDecide, reflectionsComplete, expectedMilestones } from './selectors.ts';
import { getInvestigationFocus } from './guided.ts';
import { validateSave } from './storage.ts';
const unique=(ids:string[],id:string)=>ids.includes(id)?ids:[...ids,id];
export function initialState(c:CaseDefinition=bookCase):GameState{return {
 schemaVersion:1,caseContentVersion:c.version,caseId:c.id,phase:'intro',dialogueNodeId:c.nodes[0].id,locationId:c.locations[0].id,statementId:c.statements[0].id,evidenceIds:[],resolvedStatementIds:[],pressedStatementIds:[],milestoneIds:[],reflectionAnswerIds:[],reflectionNote:'',historyIds:[c.nodes[0].id],feedback:'',hintLevel:0,activityAnswerIds:[],updatedAt:'2026-01-01T00:00:00.000Z'
};}
export function reducer(s:GameState,e:GameEvent,c:CaseDefinition=bookCase):GameState{
 if(s.caseId!==c.id&&e.type!=='RESTORE_SAVE')return s;
 const update=(state:GameState,patch:Partial<GameState>):GameState=>{const next={...state,...patch};return {...next,milestoneIds:expectedMilestones(next,c)};};
 switch(e.type){
 case 'RESET_CASE':case 'START_CASE':return initialState(c);
 case 'RESTORE_SAVE':{const restored=validateSave(e.save,c);return restored?restored.phase==='investigation'?{...restored,locationId:getInvestigationFocus(restored,c).location.id}:restored:s;}
 case 'ADVANCE_DIALOGUE':{
 if(s.phase!=='intro')return s;
 const i=c.nodes.findIndex(n=>n.id===s.dialogueNodeId);
 if(i===c.nodes.length-1)return update(s,{phase:'investigation',dialogueNodeId:'investigation-start',feedback:'Cari empat bukti di tiga lokasi. Pilih objek yang ingin kamu periksa.'});
 const node=c.nodes[i+1];return update(s,{dialogueNodeId:node.id,historyIds:unique(s.historyIds,node.id)});}
 case 'VISIT_LOCATION':return s.phase==='investigation'&&c.locations.some(l=>l.id===e.locationId)?update(s,{locationId:e.locationId,dialogueNodeId:'investigation-start',feedback:''}):s;
 case 'NEXT_INVESTIGATION':{
 if(s.phase!=='investigation'||!getInvestigationFocus(s,c).collected)return s;
 const next=c.requiredEvidence.find(id=>!s.evidenceIds.includes(id));if(!next)return s;
 const location=c.locations.find(l=>l.hotspots.some(h=>h.evidenceId===next))!;
 return update(s,{locationId:location.id,dialogueNodeId:'investigation-start',feedback:''});}
 case 'SUBMIT_ACTIVITY':{
 const activity=c.activity;if(!activity||s.phase!=='investigation'||getInvestigationFocus(s,c).hotspot.evidenceId!==activity.evidenceId||s.evidenceIds.includes(activity.evidenceId)||!activity.choices.some(x=>x.id===e.answerId))return s;
 const correct=e.answerId===activity.acceptedId;
 return update(s,{activityAnswerIds:correct?unique(s.activityAnswerIds,`${activity.id}:${e.answerId}`):s.activityAnswerIds,feedback:correct?activity.feedback:activity.incorrectFeedback});}
 case 'COLLECT_EVIDENCE':{
 if(s.phase!=='investigation')return s;
 if(c.activity?.evidenceId===e.evidenceId&&!s.activityAnswerIds.includes(`${c.activity.id}:${c.activity.acceptedId}`))return s;
 const next=c.requiredEvidence.find(id=>!s.evidenceIds.includes(id));
 if(e.evidenceId!==next&&!s.evidenceIds.some(id=>id===e.evidenceId))return s;
 const h=c.locations.find(l=>l.id===s.locationId)?.hotspots.find(h=>h.evidenceId===e.evidenceId);
 if(!h)return s;
 return update(s,{evidenceIds:s.evidenceIds.includes(h.evidenceId)?s.evidenceIds:[...s.evidenceIds,h.evidenceId],dialogueNodeId:h.dialogue.id,historyIds:unique(s.historyIds,h.dialogue.id),feedback:`${h.dialogue.text} Bukti ${h.evidenceId} sudah disimpan di Berkas Bukti.`});}
 case 'ENTER_TESTIMONY':return s.phase==='investigation'&&hasInvestigation(s,c)?update(s,{phase:'testimony',feedback:'Dengarkan setiap pernyataan. Tanya Lagi untuk memperjelas. Jika ada dugaan yang belum didukung, ajukan bukti beserta alasan.'}):s;
 case 'BACK_INVESTIGATION':return s.phase==='testimony'||s.phase==='decision'?update(s,{phase:'investigation',feedback:'Kamu boleh memeriksa kembali bukti yang sudah ditemukan.'}):s;
 case 'SELECT_STATEMENT':return s.phase==='testimony'&&c.statements.some(t=>t.id===e.statementId)?update(s,{statementId:e.statementId,feedback:''}):s;
 case 'PRESS_STATEMENT':{
 if(s.phase!=='testimony')return s;
 const t=c.statements.find(t=>t.id===s.statementId)!;
 return update(s,{pressedStatementIds:unique(s.pressedStatementIds,t.id),evidenceIds:t.unlockEvidenceId&&!s.evidenceIds.includes(t.unlockEvidenceId)?[...s.evidenceIds,t.unlockEvidenceId]:s.evidenceIds,dialogueNodeId:`press:${t.id}`,historyIds:unique(s.historyIds,`press:${t.id}`),feedback:`${c.characters.find(x=>x.id===t.speakerId)!.name}: ${t.pressText}${t.unlockEvidenceId?' Bukti E05 ditambahkan ke berkasmu.':''}`});}
 case 'SUBMIT_OBJECTION':{
 if(s.phase!=='testimony'||!s.evidenceIds.some(id=>id===e.evidenceId)||!c.objectionReasons.some(r=>r.id===e.reasonId))return s;
 const t=c.statements.find(t=>t.id===s.statementId)!;
 const pair=t.acceptedPairs.find(p=>p.evidenceId===e.evidenceId&&p.reasonId===e.reasonId);
 return pair?update(s,{resolvedStatementIds:unique(s.resolvedStatementIds,t.id),feedback:pair.feedback}):update(s,{feedback:c.id==='buku-rusak'&&t.id==='S02'?({E01:'Catatan peminjaman menunjukkan waktu pengembalian, tetapi tidak mencatat apakah buku basah. Menjadi peminjam terakhir belum membuktikan penyebab kerusakan.',E02:'Buku basah menunjukkan kondisi saat ditemukan, bukan kondisinya pukul 09.00. Cari pengamatan saat buku dikembalikan.',E03:'Foto membantu urutan waktu, tetapi gunakan keterangan orang yang melihat buku saat dikembalikan. Coba bukti lain beserta alasan yang sesuai.',E04:'Keterangan Raka menyebut buku kering saat dikembalikan. Pilih alasan yang menjelaskan pengamatan itu. Peminjam terakhir bukan bukti siapa yang menyebabkan kerusakan.',E05:'Keterangan Sari menjelaskan tumpahan pukul 09.20. Untuk menguji keadaan buku saat pengembalian, pertimbangkan orang yang melihatnya pukul 09.00.'}[e.evidenceId]??t.incorrectFeedback):t.incorrectFeedback});}
 case 'ENTER_DECISION':return s.phase==='testimony'&&canDecide(s,c)?update(s,{phase:'decision',feedback:''}):s;
 case 'SELECT_DECISION':{
 if(s.phase!=='decision'||!canDecide(s,c))return s;
 const d=c.decisions.find(d=>d.id===e.decisionId);
 if(!d||!c.decisionReasons.some(r=>r.id===e.reasonId))return s;
 const correct=d.acceptedReasonId===e.reasonId;
 return update(s,{decisionId:d.id,decisionReasonId:e.reasonId,phase:correct?'reflection':'decision',feedback:correct?d.consequence:d.acceptedReasonId?'Solusinya peduli kepada teman. Namun, alasanmu perlu sesuai bukti dan menghargai semua pihak. Coba solusi dan alasan lagi.':d.consequence});}
 case 'SUBMIT_REFLECTION':{
 if(s.phase!=='reflection')return s;
 const q=c.reflections.find(q=>q.id===e.questionId);
 if(!q||!q.choices.some(a=>a.id===e.answerId))return s;
 const correct=q.acceptedIds.includes(e.answerId);
 return update(s,{reflectionAnswerIds:correct?[...s.reflectionAnswerIds.filter(id=>!id.startsWith(`${q.id}:`)),`${q.id}:${e.answerId}`]:s.reflectionAnswerIds,feedback:`${correct?'Tepat!':'Mari pikirkan lagi.'} ${q.explanation}`});}
 case 'SET_NOTE':return s.phase==='reflection'?update(s,{reflectionNote:e.note.slice(0,2000)}):s;
 case 'FINISH_CASE':return s.phase==='reflection'&&reflectionsComplete(s,c)?update(s,{phase:'result',feedback:''}):s;
 case 'HINT':return s.phase==='testimony'?update(s,{hintLevel:Math.min(3,s.hintLevel+1),feedback:c.presentation.hints[Math.min(2,s.hintLevel)]}):s;
 default:return s;
 }
}
