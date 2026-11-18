import {playEndings} from '../endings.ts';
import type { CaseDefinition } from '../../lib/game/types.ts';

export const playCase: CaseDefinition = {
 id:'semua-boleh-bermain',version:1,title:'Semua Boleh Bermain',
 presentation:{
  episode:3,theme:'play',background:'/assets/playground.svg',
  summary:'Satu lapangan, beragam pilihan bermain. Bisakah semua kebutuhan didengar?',
  topics:['Toleransi','Persatuan'],openingTitle:'Satu halaman untuk semua',
  openingSubtitle:'Dengarkan kebutuhan teman dan susun aturan bermain yang adil.',
  decisionPrompt:'Aturan apa yang memberi kesempatan tanpa memaksa pilihan permainan teman?',
  resolutionTitle:'Berbeda pilihan, tetap berteman',
  learningText:'Kebutuhan teman bisa berbeda. Musyawarah membantu membagi ruang dan waktu dengan adil. Persatuan tidak mengharuskan semua orang menyukai permainan yang sama. Materi ini merupakan usulan pembelajaran untuk ditinjau guru.',
  reflectionPrompt:'Bagaimana kita bermain sambil menghargai perbedaan?',
  completionText:'Kamu mendengarkan dua kebutuhan, memeriksa dugaan, dan memilih aturan yang adil.',
  revelation:{title:'Yang kita ketahui tentang pilihan teman',facts:[
   '20 menit, satu lapangan, dan bangku di luar batas bola.',
   'Bima ingin bola. Sari ingin bermain dengan suasana tenang.',
   'Tidak ikut bola bukan berarti tidak ingin berteman.'
  ]},
  hints:['Periksa S02. Apakah pilihan permainan membuktikan keinginan berteman?',
   'Baca E04: apa yang Raka dengar dari Sari? Tanya Lagi pada S03 juga.',
   'Ajukan E04 dengan alasan Sari ingin bermain bersama tetapi memilih suasana tenang.']
 },
 characters:[
  {id:'nara',name:'Nara',role:'Teman detektifmu',color:'#147D78'},
  {id:'bima',name:'Bima',role:'Ingin bermain bola',color:'#527393'},
  {id:'sari',name:'Sari',role:'Ingin permainan tenang',color:'#BC3544'},
  {id:'raka',name:'Raka',role:'Mendengarkan pilihan teman',color:'#C48C2D'},
  {id:'bu-lila',name:'Bu Lila',role:'Pendamping musyawarah',color:'#79628D'}],
 nodes:[
  {id:'main-intro-lila',speakerId:'bu-lila',expression:'tenang',text:'Lapangan kita dipakai bersama. Bima ingin bermain bola, sedangkan Sari ingin permainan lebih tenang. Mari dengarkan keduanya sebelum menyusun aturan.'},
  {id:'main-intro-bima',speakerId:'bima',expression:'khawatir',text:'Aku ingin berlari dan bermain bola. Aku mengira teman yang tidak ikut bola tidak ingin bermain bersama.'},
  {id:'main-intro-sari',speakerId:'sari',expression:'tenang',text:'Aku juga ingin bermain bersama teman. Tapi hari ini aku ingin suasana lebih tenang. Bolehkah kita punya pilihan permainan?'},
  {id:'main-intro-nara',speakerId:'nara',expression:'penasaran',text:'Kebutuhan keduanya masuk akal. Periksa waktu dan tempat, dengarkan teman, lalu coba susun aturan. Kita mencari kesempatan yang adil. Tidak ada batas waktu menjawab!'}],
 requiredEvidence:['E01','E02','E03','E04'],
 decisionRequirements:{statementIds:['S02'],evidenceIds:['E05']},
 activity:{id:'aturan-giliran',evidenceId:'E03',title:'Coba susun aturan bermain',
  instruction:'Aturan mana memberi dua kelompok kesempatan memakai lapangan?',
  displayItems:[
   {label:'Waktu',value:'20 menit: dua giliran masing-masing 10 menit.'},
   {label:'Tempat',value:'Satu lapangan; bangku tenang di luar batas bola.'},
   {label:'Kebutuhan',value:'Ada yang ingin bola; ada yang ingin permainan tenang.'}],
  choices:[
   {id:'giliran-pilihan',text:'Bola 10 menit, permainan tenang 10 menit; bangku tetap terbuka. Teman bebas memilih.'},
   {id:'bola-semua',text:'Bola memakai lapangan 20 menit. Semua teman wajib ikut bola.'},
   {id:'tenang-semua',text:'Hanya permainan tenang selama 20 menit. Bola tidak boleh dimainkan.'}],
  acceptedId:'giliran-pilihan',
  feedback:'Dua giliran memberi kesempatan memakai lapangan. Bangku tetap menjadi pilihan tenang. Teman bebas memilih. Simpan catatan ini sebagai bukti.',
  incorrectFeedback:'Kedua kebutuhan perlu kesempatan. Coba bagi 20 menit menjadi dua giliran, dengan tempat tenang dan kebebasan memilih.'},
 evidence:[
  {id:'E01',title:'Waktu Istirahat',kind:'Catatan',description:'Jadwal mencatat istirahat pukul 09.30–09.50, selama 20 menit. Lapangan tersedia bagi kelas ini pada waktu tersebut.',source:'Jadwal di pintu kelas',observedAt:'Selasa, sebelum istirahat',limitation:'Menunjukkan waktu yang tersedia, bukan permainan yang harus disukai teman.'},
  {id:'E02',title:'Denah Halaman',kind:'Pengamatan',description:'Ada satu lapangan. Bangku dengan meja kecil berada di luar batas permainan bola dan bisa dipakai untuk permainan tenang.',source:'Pengamatan halaman bersama Bu Lila',observedAt:'Selasa, sebelum istirahat',limitation:'Menunjukkan tempat yang tersedia. Batas aman tetap perlu dijaga saat bermain.'},
  {id:'E03',title:'Catatan Kebutuhan Bermain',kind:'Catatan diskusi',description:'Bima ingin bola dan Sari ingin permainan lebih tenang. Waktu 20 menit bisa dibagi menjadi dua giliran 10 menit. Bangku tenang tetap tersedia di luar batas bola.',source:'Pengamatan dan diskusi di halaman saat latihan aturan',observedAt:'Selasa, saat investigasi',limitation:'Ini catatan kebutuhan dan kemungkinan pembagian waktu, bukan aturan yang sudah disepakati semua teman. Aturan akhir masih perlu dimusyawarahkan.'},
  {id:'E04',title:'Keterangan Raka',kind:'Kesaksian',description:'Raka mendengar Sari berkata, “Aku ingin bermain bersama teman, tetapi hari ini memilih permainan yang lebih tenang.”',source:'Percakapan dengan Raka di teras',observedAt:'Selasa, sebelum musyawarah',limitation:'Raka menyampaikan ucapan yang didengarnya. Tanyakan juga kepada Sari langsung. Pilihan satu anak tidak mewakili semua anak.'},
  {id:'E05',title:'Pilihan Sari',kind:'Keterangan langsung',description:'Sari ingin bermain congklak bersama teman hari ini. Hari lain ia mungkin mencoba bola jika ingin. Ia ingin tetap diajak, tanpa wajib mengikuti satu permainan.',source:'Tanya Lagi kepada Sari pada S03',observedAt:'Selasa, saat musyawarah',limitation:'Ini pilihan Sari hari ini. Pilihan teman dapat berbeda dan berubah.'}],
 locations:[
  {id:'pintu-kelas',name:'Pintu Kelas',description:'Cari tahu waktu bermain yang tersedia.',hotspots:[
   {id:'jadwal-istirahat',label:'Baca jadwal istirahat',evidenceId:'E01',dialogue:{id:'main-lihat-jadwal',speakerId:'nara',expression:'penasaran',text:'Ada 20 menit istirahat. Kita bisa membicarakan pembagian waktu. Tidak perlu terburu-buru menjawab permainan ini.'}}]},
  {id:'halaman',name:'Halaman Bermain',description:'Periksa tempat dan coba aturan yang menghargai dua kebutuhan.',hotspots:[
   {id:'denah-halaman',label:'Periksa lapangan dan bangku',evidenceId:'E02',dialogue:{id:'main-lihat-denah',speakerId:'bu-lila',expression:'tenang',text:'Bola dimainkan di dalam batas lapangan. Bangku berada di luarnya. Jaga bola tetap di lapangan agar teman di bangku dapat bermain dengan tenang.'}},
   {id:'catatan-kebutuhan',label:'Susun aturan dari kebutuhan teman',evidenceId:'E03',dialogue:{id:'main-catat-kebutuhan',speakerId:'nara',expression:'penasaran',text:'Bima ingin bola dan Sari ingin permainan tenang. Keduanya boleh menyampaikan kebutuhan. Coba gunakan waktu dan tempat ini untuk menyusun usulan.'}}]},
  {id:'teras',name:'Teras Kelas',description:'Apa tepatnya yang Raka dengar?',hotspots:[
   {id:'wawancara-raka',label:'Dengarkan Raka',evidenceId:'E04',dialogue:{id:'main-dengar-raka',speakerId:'raka',expression:'tenang',text:'Sari berkata ingin bermain bersama, tetapi memilih permainan lebih tenang hari ini. Tidak ikut bola bukan berarti tidak ingin berteman. Dengarkan Sari langsung juga.'}}]}],
 statements:[
  {id:'S01',speakerId:'bima',text:'Aku ingin memakai waktu istirahat untuk bergerak dan bermain bola.',pressText:'Aku senang berlari setelah belajar. Aku berharap ada kesempatan bola, walaupun tidak harus sepanjang istirahat.',acceptedPairs:[],incorrectFeedback:'Bima menjelaskan kebutuhannya sendiri. Keinginan bergerak boleh didengar bersama kebutuhan teman lain.'},
  {id:'S02',speakerId:'bima',text:'Teman yang tidak ikut bola berarti tidak ingin bermain bersama kami.',pressText:'Aku belum menanyakan alasannya kepada semua teman. Aku menyamakan tidak memilih bola dengan tidak mau berteman.',acceptedPairs:[{evidenceId:'E04',reasonId:'ingin-bersama',feedback:'Tepat! Raka mendengar Sari ingin bermain bersama dengan pilihan lebih tenang. Tidak ikut bola tidak membuktikan penolakan berteman. Bima dapat memperbaiki dugaan tanpa dipermalukan.'}],incorrectFeedback:'Periksa apa yang Raka dengar tentang keinginan Sari. Waktu atau denah saja tidak menjelaskan alasan memilih permainan lain.'},
  {id:'S03',speakerId:'sari',text:'Aku ingin tetap diajak bermain, dengan pilihan yang lebih tenang.',pressText:'Hari ini aku ingin congklak bersama teman. Hari lain mungkin aku ingin mencoba bola. Tolong tetap ajak aku, lalu izinkan aku memilih. Teman lain tetap boleh menyukai bola.',unlockEvidenceId:'E05',acceptedPairs:[],incorrectFeedback:'Ini keinginan Sari sendiri. Gunakan Tanya Lagi untuk mendengarkan pilihannya lebih lengkap.'},
  {id:'S04',speakerId:'bu-lila',text:'Kita bisa membagi giliran dan tetap memberi pilihan permainan.',pressText:'Bicarakan dua giliran sama panjang. Bangku tetap tersedia. Teman boleh memilih, berganti kegiatan, atau beristirahat tanpa diejek. Setelah dicoba, tinjau lagi bersama.',acceptedPairs:[],incorrectFeedback:'Ini usulan untuk dibicarakan bersama. Berbeda permainan tetap bisa berjalan dengan saling menghargai dan menjaga batas aman.'}],
 objectionReasons:[
  {id:'ingin-bersama',text:'Raka mendengar Sari ingin bermain bersama, tetapi memilih suasana tenang.'},
  {id:'semua-bola',text:'Semua teman pasti menyukai bola kalau diminta ikut.'},
  {id:'waktu-membuktikan',text:'Jadwal 20 menit membuktikan siapa yang ingin berteman.'}],
 decisions:[
  {id:'wajib-bola',outcome:playEndings['wajib-bola'],text:'Wajibkan semua teman ikut bola sepanjang istirahat.',consequence:'Kebutuhan bergerak didengar, tetapi pilihan Sari diabaikan. Berteman tidak harus melalui satu permainan. Coba aturan yang memberi pilihan.'},
  {id:'larang-bola',outcome:playEndings['larang-bola'],text:'Larang bola sepanjang istirahat agar semua bermain tenang.',consequence:'Tempat menjadi tenang, tetapi kebutuhan Bima untuk bergerak tidak mendapat kesempatan. Dua kebutuhan dapat dibicarakan tanpa melarang salah satunya sepanjang waktu.'},
  {id:'giliran-adil',outcome:playEndings['giliran-adil'],text:'Bola 10 menit, permainan tenang 10 menit. Bangku tetap terbuka; teman bebas memilih.',acceptedReasonId:'dua-kebutuhan',consequence:'Bu Lila membantu menjaga batas aman. Bola mendapat giliran, lalu lapangan dipakai permainan tenang. Bangku tetap terbuka. Teman boleh memilih atau berganti kegiatan. Kelas meninjau aturan setelah mencoba.'}],
 reasonEnding:playEndings.reconsider,
 decisionReasons:[
  {id:'dua-kebutuhan',text:'Kebutuhan berbeda sama-sama didengar; waktu dibagi dan teman tetap boleh memilih.'},
  {id:'suara-terkeras',text:'Permainan pilihan teman yang bersuara paling keras harus selalu menang.'},
  {id:'harus-sama',text:'Persatuan berarti semua teman wajib menyukai permainan yang sama.'}],
 reflections:[
  {id:'fakta',question:'Apa yang didukung keterangan Raka?',choices:[
   {id:'pilihan-tenang',text:'Sari ingin bermain bersama, tetapi memilih permainan lebih tenang.'},
   {id:'menolak-teman',text:'Semua teman yang tidak ikut bola pasti menolak berteman.'}],acceptedIds:['pilihan-tenang'],explanation:'Raka melaporkan ucapan yang didengarnya. Kesimpulan tentang semua teman melampaui bukti. Keterangan langsung Sari memperjelas pilihannya.'},
  {id:'dengar',question:'Mengapa kebutuhan Bima dan Sari perlu didengar?',choices:[
   {id:'sama-pilihan',text:'Agar salah satu dipaksa menyukai permainan yang sama.'},
   {id:'hargai-berbeda',text:'Agar aturan memberi kesempatan adil sambil menghargai perbedaan.'}],acceptedIds:['hargai-berbeda'],explanation:'Musyawarah memberi ruang bagi kebutuhan berbeda. Persatuan tumbuh dari saling menghargai, bukan memaksa semua orang menyukai hal yang sama.'},
  {id:'tindakan',question:'Apa yang bisa kamu lakukan saat bermain?',choices:[
   {id:'ajak-pilih',text:'Ajak teman dan dengarkan pilihannya tanpa mengejek.'},
   {id:'jaga-giliran',text:'Patuhi giliran dan batas aman, lalu tinjau aturan bersama.'}],acceptedIds:['ajak-pilih','jaga-giliran'],explanation:'Keduanya membantu teman merasa diterima. Hak bermain berjalan bersama tanggung jawab berbagi ruang dan menghormati pilihan.'}],
 ending:{decisionId:'giliran-adil',reasonId:'dua-kebutuhan'}
};