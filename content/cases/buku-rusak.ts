import {bookEndings} from '../endings.ts';
import type { CaseDefinition } from '../../lib/game/types.ts';
export const bookCase: CaseDefinition = {
 id:'buku-rusak',version:1,title:'Misteri Buku Kelas yang Rusak',
 presentation:{
  episode:1,theme:'books',background:'/assets/reading-room.svg',
  summary:'Bima dituduh merusak buku kelas. Apakah menjadi peminjam terakhir berarti ia bersalah?',topics:['Fakta & dugaan','Musyawarah'],
  openingTitle:'Sebuah cerita yang belum lengkap.',openingSubtitle:'Sebuah buku rusak. Kita cari tahu bersama.',
  decisionPrompt:'Apa usulmu agar buku terawat dan setiap teman diperlakukan adil? Pilih satu penyelesaian.',
  resolutionTitle:'Kita rawat bukunya. Kita jaga pertemanannya.',
  learningText:'Kemanusiaan berarti menghargai teman. Musyawarah berarti mendengarkan semua pihak. Hak membaca disertai kewajiban merawat buku bersama.',
  reflectionPrompt:'Ada ide untuk menjaga buku kelas? Kamu boleh menuliskannya tanpa nama atau sekolahmu.',
  completionText:'Kamu sudah mendengar semua cerita, memeriksa bukti, dan memilih merawat buku bersama. Kita tetap belum tahu siapa yang menyenggol botol. Kita tidak menuduh tanpa bukti. Salah memilih lalu mencoba lagi adalah bagian dari belajar.',
  revelation:{title:'Cerita Sari menjadi lebih jelas.',facts:['09.00: buku dikembalikan dalam keadaan kering.','09.20: Sari melihat air mengenai buku.','Siapa yang menyenggol botol belum diketahui.']},
  hints:['Perhatikan pernyataan kedua. Apakah peminjam terakhir membuktikan kondisi buku saat dikembalikan?','Cari orang yang melihat buku pukul 09.00. Tanya Lagi pada pernyataan ketiga juga membantu.','Pada S02, ajukan E04 dengan alasan Raka melihat buku kering. Pada S03, pilih Tanya Lagi untuk memperoleh E05.']
 },
 characters:[
 {id:'nara',name:'Nara',role:'Teman detektifmu',color:'#147D78'},
 {id:'bima',name:'Bima',role:'Peminjam terakhir',color:'#527393'},
 {id:'sari',name:'Sari',role:'Petugas pojok baca',color:'#BC3544'},
 {id:'raka',name:'Raka',role:'Teman yang melihat buku',color:'#C48C2D'},
 {id:'bu-lila',name:'Bu Lila',role:'Pendamping musyawarah',color:'#79628D'}],
 nodes:[
 {id:'intro-lila',speakerId:'bu-lila',expression:'tenang',text:'Buku kelas kita rusak. Sebelum menyimpulkan, mari dengarkan semua cerita. Di sini kita bermusyawarah untuk mencari penyelesaian yang adil.'},
 {id:'intro-sari',speakerId:'sari',expression:'khawatir',text:'Bima yang terakhir meminjamnya. Aku pikir buku itu sudah rusak saat dikembalikan.'},
 {id:'intro-bima',speakerId:'bima',expression:'khawatir',text:'Aku mengembalikannya setelah membaca. Saat itu bukunya masih baik. Aku ingin teman-teman mendengarkan ceritaku juga.'},
 {id:'intro-nara',speakerId:'nara',expression:'penasaran',text:'Mana yang sudah kita ketahui, dan mana yang masih dugaan? Yuk, cari petunjuknya. Periksa objek, baca batas buktinya, lalu dengarkan semua pihak. Tidak ada batas waktu!'}],
 requiredEvidence:['E01','E02','E03','E04'],
 decisionRequirements:{statementIds:['S02'],evidenceIds:['E05']},
 evidence:[
 {id:'E01',title:'Catatan Peminjaman',kind:'Catatan',description:'Pada Senin, Bima mengembalikan buku kelas pukul 09.00. Namanya tercatat sebagai peminjam terakhir.',source:'Buku catatan di meja peminjaman',observedAt:'Senin, 09.00',limitation:'Menunjukkan waktu pengembalian dan peminjam terakhir, bukan penyebab kerusakan.'},
 {id:'E02',title:'Buku yang Basah',kind:'Pengamatan',description:'Halaman buku basah dan ada bekas air. Sari melaporkan kerusakan pukul 09.25.',source:'Buku di pojok baca',observedAt:'Senin, 09.25',limitation:'Menunjukkan kondisi buku. Tidak menunjukkan siapa yang menyebabkan kerusakan.'},
 {id:'E03',title:'Foto Rak Buku',kind:'Foto',description:'Dalam foto pukul 09.15, ada botol tanpa tutup di sebelah buku. Buku tampak masih kering.',source:'Foto rak untuk tugas kelas, diminta dari Sari',observedAt:'Senin, 09.15',limitation:'Membantu menyusun urutan waktu. Botol di dekat buku tidak membuktikan siapa yang menumpahkannya.'},
 {id:'E04',title:'Keterangan Raka',kind:'Kesaksian',description:'Raka melihat halaman buku kering dan utuh saat Bima mengembalikannya pukul 09.00.',source:'Wawancara dengan Raka di koridor',observedAt:'Senin, 09.00',limitation:'Ini keterangan saksi yang perlu diperiksa bersama bukti lain. Raka tidak melihat kejadian setelahnya.'},
 {id:'E05',title:'Keterangan Lanjutan Sari',kind:'Kesaksian',description:'Pukul 09.20, Sari melihat botol terguling dan air mengenai buku. Ia memindahkan buku, lalu melapor pukul 09.25.',source:'Tanya Lagi kepada Sari pada pernyataan S03',observedAt:'Senin, 09.20',limitation:'Sari tidak melihat siapa yang menyenggol botol. Keterangan ini tidak menunjuk pelaku.'}],
 locations:[
 {id:'meja',name:'Meja Peminjaman',description:'Mulai dari catatan. Apa yang benar-benar tertulis di sini?',hotspots:[{id:'catatan',label:'Periksa catatan peminjaman',evidenceId:'E01',dialogue:{id:'lihat-catatan',speakerId:'nara',expression:'penasaran',text:'Bima mengembalikan buku pukul 09.00. Catatan ini memberi tahu waktu pengembalian, tetapi tidak memberi tahu penyebab buku basah.'}}]},
 {id:'pojok',name:'Pojok Baca',description:'Perhatikan buku dan dengarkan cerita Sari tentang foto rak.',hotspots:[
 {id:'buku',label:'Periksa buku yang basah',evidenceId:'E02',dialogue:{id:'lihat-buku',speakerId:'nara',expression:'khawatir',text:'Ada bekas air di halaman buku. Ini pengamatan tentang kondisi buku, bukan bukti siapa yang merusaknya.'}},
 {id:'foto',label:'Minta foto rak kepada Sari',evidenceId:'E03',dialogue:{id:'minta-foto',speakerId:'sari',expression:'tenang',text:'Ini foto rak untuk tugas kelas, kuambil pukul 09.15 dari mejaku. Ada botol terbuka di dekat buku. Di foto ini, bukunya tampak masih kering.'}}]},
 {id:'koridor',name:'Koridor Kelas',description:'Raka berada di dekat kelas saat buku dikembalikan. Dengarkan pengamatannya.',hotspots:[{id:'raka',label:'Wawancarai Raka',evidenceId:'E04',dialogue:{id:'dengar-raka',speakerId:'raka',expression:'tenang',text:'Aku melihat Bima mengembalikan buku pukul 09.00. Halamannya kering dan utuh. Setelah itu aku pergi, jadi aku tidak melihat kejadian berikutnya.'}}]}],
 statements:[
 {id:'S01',speakerId:'sari',text:'Bima adalah peminjam terakhir.',pressText:'Namanya ada di catatan peminjaman. Itu yang aku ketahui dari catatan, bukan berarti ia menyebabkan kerusakan.',acceptedPairs:[],incorrectFeedback:'Catatan E01 memang mendukung pernyataan ini. Menjadi peminjam terakhir tidak sama dengan menjadi penyebab kerusakan.'},
 {id:'S02',speakerId:'sari',text:'Karena itu, buku pasti sudah basah saat Bima mengembalikannya.',pressText:'Sebenarnya aku tidak melihat langsung saat Bima mengembalikan buku. Aku menyimpulkannya karena ia peminjam terakhir.',acceptedPairs:[{evidenceId:'E04',reasonId:'raka-kering',feedback:'Tepat! Raka melihat buku kering saat dikembalikan pukul 09.00. Pernyataan bahwa buku pasti sudah basah adalah dugaan yang belum terbukti. Sari dapat keliru tanpa berbohong.'}],incorrectFeedback:'Coba hubungkan bukti dengan keadaan buku saat dikembalikan. Siapa yang melihatnya langsung?'},
 {id:'S03',speakerId:'sari',text:'Aku menemukan buku basah setelah istirahat.',pressText:'Pukul 09.20 aku melihat botol terguling dan air mengenai buku. Aku memindahkan bukunya, lalu melapor pukul 09.25. Aku tidak melihat siapa yang menyenggol botol.',unlockEvidenceId:'E05',acceptedPairs:[],incorrectFeedback:'Keterangan ini perlu diperjelas. Gunakan Tanya Lagi untuk mengetahui apa yang Sari lihat dan kapan.'},
 {id:'S04',speakerId:'sari',text:'Kita belum tahu siapa yang menyenggol botol.',pressText:'Benar, aku tidak melihat siapa yang menyenggolnya. Aku juga ingin kita merawat buku dan mencegah kejadian serupa.',acceptedPairs:[],incorrectFeedback:'Pernyataan ini sesuai batas bukti kita. Mengakui hal yang belum diketahui adalah sikap jujur dan adil.'}],
 objectionReasons:[{id:'raka-kering',text:'Raka melihat buku kering saat dikembalikan pukul 09.00.'},{id:'terakhir-salah',text:'Peminjam terakhir pasti menyebabkan semua kerusakan.'},{id:'foto-pelaku',text:'Foto botol menunjukkan siapa yang menumpahkannya.'}],
 decisions:[
 {id:'bima',outcome:bookEndings['bima'],text:'Bima harus bertanggung jawab karena ia peminjam terakhir.',consequence:'Bima merasa tidak didengarkan. Catatan peminjaman tidak membuktikan penyebab kerusakan. Mari tinjau bukti lagi.'},
 {id:'sari',outcome:bookEndings['sari'],text:'Sari harus disalahkan karena botol ada di dekatnya.',consequence:'Tuduhan baru muncul tanpa bukti pelaku. Posisi benda tidak cukup untuk memastikan siapa yang menjatuhkan botol.'},
 {id:'bersama',outcome:bookEndings['bersama'],text:'Akui pelaku belum diketahui. Rawat buku bersama dengan bantuan guru dan pisahkan minuman dari rak.',acceptedReasonId:'urutan-air',consequence:'Teman-teman merasa didengarkan. Bu Lila membantu merawat buku, dan kelas menyiapkan tempat minuman jauh dari rak. Tidak ada yang dipaksa mengaku.'}],
 reasonEnding:bookEndings.reconsider,
 decisionReasons:[{id:'urutan-air',text:'Bukti menunjukkan buku terkena air setelah dikembalikan, tetapi belum menunjukkan siapa yang menjatuhkan botol.'},{id:'banyak-tuduhan',text:'Yang paling banyak dituduh pasti salah.'},{id:'tidak-dengar',text:'Tidak perlu mendengarkan semua pihak.'}],
 reflections:[
 {id:'fakta',question:'Apa perbedaan fakta dan dugaan?',choices:[{id:'diamati',text:'Fakta didukung pengamatan atau bukti; dugaan masih perlu diperiksa.'},{id:'dugaan',text:'Dugaan menjadi fakta kalau banyak orang mengatakannya.'}],acceptedIds:['diamati'],explanation:'Keterangan Raka tentang buku kering adalah pengamatan saksi. Menyalahkan Bima hanya karena terakhir meminjam adalah dugaan.'},
 {id:'dengar',question:'Mengapa semua pihak perlu didengarkan?',choices:[{id:'cepat',text:'Supaya kita cepat memilih siapa yang salah.'},{id:'lengkap',text:'Supaya informasi lebih lengkap dan setiap orang diperlakukan adil.'}],acceptedIds:['lengkap'],explanation:'Mendengarkan Bima, Raka, dan Sari membantu kita memeriksa urutan kejadian. Ini melatih kemanusiaan dan musyawarah.'},
 {id:'tindakan',question:'Apa tindakanmu untuk menjaga buku kelas?',choices:[{id:'pisahkan',text:'Letakkan minuman jauh dari rak buku.'},{id:'rawat',text:'Rawat buku bersama dan laporkan kerusakan kepada guru.'}],acceptedIds:['pisahkan','rawat'],explanation:'Keduanya langkah baik. Hak membaca buku berjalan bersama kewajiban merawat barang bersama.'}],
 ending:{decisionId:'bersama',reasonId:'urutan-air'}
};
export function validateCase(c:CaseDefinition):string[]{
 const errors:string[]=[];
 const unique=(name:string,ids:string[])=>{if(new Set(ids).size!==ids.length) errors.push(`Duplicate ${name}`);};
 const has=(ids:string[],id:string)=>ids.includes(id);
 unique('evidence',c.evidence.map(x=>x.id));unique('characters',c.characters.map(x=>x.id));
 unique('nodes',[...c.nodes,...c.locations.flatMap(l=>l.hotspots.map(h=>h.dialogue))].map(x=>x.id));
 unique('locations',c.locations.map(x=>x.id));unique('hotspots',c.locations.flatMap(l=>l.hotspots.map(h=>h.id)));
 unique('statements',c.statements.map(x=>x.id));unique('decisions',c.decisions.map(x=>x.id));
 unique('reasons',[...c.objectionReasons,...c.decisionReasons].map(x=>x.id));
 unique('reflections',c.reflections.map(x=>x.id));
 const endings=[...c.decisions.map(d=>d.outcome),c.reasonEnding];
 unique('endings',endings.map(e=>e.id));unique('ending nodes',endings.flatMap(e=>e.beats.map(b=>b.id)));
 for(const ending of endings){
  if(!ending.title||!ending.takeaway||ending.beats.length!==3)errors.push('Invalid ending');
  for(const beat of ending.beats)if(!c.characters.some(p=>p.id===beat.speakerId))errors.push('Invalid ending speaker');
  if(ending.cast.some(id=>!c.characters.some(p=>p.id===id)))errors.push('Invalid ending cast');
 }
 for(const d of c.decisions)if(d.outcome.mood!==(d.id===c.ending.decisionId?'hopeful':'unresolved'))errors.push('Invalid ending mood');
 if(c.reasonEnding.mood!=='rethink')errors.push('Invalid reason ending');
 const e=c.evidence.map(x=>x.id),p=c.characters.map(x=>x.id);
 for(const n of [...c.nodes,...c.locations.flatMap(l=>l.hotspots.map(h=>h.dialogue))]) if(!has(p,n.speakerId)) errors.push('Invalid speaker');
 for(const l of c.locations)for(const h of l.hotspots)if(!has(e,h.evidenceId))errors.push('Invalid hotspot');
 for(const s of c.statements){if(!has(p,s.speakerId))errors.push('Invalid witness');if(s.unlockEvidenceId&&!has(e,s.unlockEvidenceId))errors.push('Invalid unlock');for(const a of s.acceptedPairs)if(!has(e,a.evidenceId)||!has(c.objectionReasons.map(r=>r.id),a.reasonId))errors.push('Invalid pair');}
 for(const r of c.reflections){unique('answers',r.choices.map(x=>x.id));if(!r.acceptedIds.length||r.acceptedIds.some(id=>!r.choices.some(x=>x.id===id))) errors.push('Invalid reflection');}
 for(const id of c.requiredEvidence)if(!has(e,id)||!c.locations.some(l=>l.hotspots.some(h=>h.evidenceId===id)))errors.push('Unreachable evidence');
 if(!c.decisions.some(d=>d.id===c.ending.decisionId&&d.acceptedReasonId===c.ending.reasonId)||!c.decisionReasons.some(r=>r.id===c.ending.reasonId))errors.push('Unreachable ending');
 const obtainableEvidence=new Set([
  ...c.locations.flatMap(l=>l.hotspots.map(h=>h.evidenceId)),
  ...c.statements.flatMap(s=>s.unlockEvidenceId?[s.unlockEvidenceId]:[])
 ]);
 for(const id of c.decisionRequirements.evidenceIds)if(!obtainableEvidence.has(id))errors.push('Unreachable decision evidence');
 for(const id of c.decisionRequirements.statementIds){
  const statement=c.statements.find(s=>s.id===id);
  if(!statement?.acceptedPairs.some(pair=>obtainableEvidence.has(pair.evidenceId)&&c.objectionReasons.some(r=>r.id===pair.reasonId)))errors.push('Unreachable objection');
 }
 if(!Number.isInteger(c.presentation.episode)||c.presentation.episode<1||!c.presentation.background.startsWith('/assets/'))errors.push('Invalid presentation');
 if(c.activity){
  unique('activity choices',c.activity.choices.map(x=>x.id));
  if(!c.requiredEvidence.includes(c.activity.evidenceId)||!c.activity.choices.some(x=>x.id===c.activity!.acceptedId)||!c.activity.displayItems.length)errors.push('Invalid activity');
 }
 return errors;
}
