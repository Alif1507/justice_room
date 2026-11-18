import type { CaseDefinition } from '../../lib/game/types.ts';

export const choreCase: CaseDefinition = {
 id:'piket-terlupakan',version:1,title:'Giliran Piket yang Terlupakan',
 presentation:{
  episode:2,theme:'chores',background:'/assets/chores-room.svg',
  summary:'Dua jadwal, tugas yang tertunda. Bantu teman menyepakati waktu dan bekerja sama.',
  topics:['Kewajiban','Kerja sama'],
  openingTitle:'Satu kelas, tanggung jawab bersama',
  openingSubtitle:'Cocokkan jadwal, dengarkan kebutuhan teman, lalu susun rencana piket yang adil.',
  decisionPrompt:'Bagaimana piket hari ini bisa selesai dengan pembagian tugas yang adil?',
  resolutionTitle:'Tugas jelas, teman saling membantu',
  learningText:'Hak belajar di kelas yang bersih berjalan bersama kewajiban merawatnya. Musyawarah membantu kita membagi tugas, memeriksa waktu, dan menawarkan bantuan tanpa mempermalukan teman.',
  reflectionPrompt:'Apa yang kamu pelajari tentang jadwal dan kerja sama?',
  completionText:'Kamu membantu kelas menyelesaikan tugas dan membuat kesepakatan yang lebih jelas.',
  revelation:{title:'Waktu mulai bukan waktu selesai',facts:[
   'Bima: papan. Sari: lantai. Raka: sampah.',
   'Piket mulai 12.10. Raka mengurus sampah setelah kembali 12.20.',
   'Bima lupa melanjutkan papan dan bersedia menuntaskannya.'
  ]},
  hints:[
   'Periksa S02. Apakah waktu mulai piket sama dengan waktu semua tugas harus selesai?',
   'Cari keterangan tentang kesepakatan waktu Raka bersama Bu Lila.',
   'Ajukan E04 pada S02: tugas perpustakaan membuat Raka baru kembali pukul 12.20.'
  ]
 },
 activity:{
  id:'cocok-jadwal',evidenceId:'E02',title:'Cocokkan jadwal terbaru',
  instruction:'Baca jadwal Selasa ini. Pilih pembagian yang sama. Boleh melihat jadwal sambil menjawab!',
  displayItems:[{label:'Bima',value:'Papan tulis'},{label:'Sari',value:'Lantai'},{label:'Raka',value:'Sampah setelah kembali 12.20'}],
  choices:[
   {id:'jadwal-lama',text:'Bima mengerjakan semua tugas; Sari dan Raka tidak mendapat tugas.'},
   {id:'jadwal-baru',text:'Bima: papan. Sari: lantai. Raka: sampah setelah kembali 12.20.'},
   {id:'jadwal-tertukar',text:'Bima: sampah. Sari: papan. Raka: lantai sebelum 12.10.'}
  ],acceptedId:'jadwal-baru',
  feedback:'Cocok! Jadwal terbaru membagi tugas. Waktu Raka juga perlu dibaca, bukan hanya namanya.',
  incorrectFeedback:'Belum cocok. Lihat jadwal: Bima mengurus papan, Sari lantai, Raka sampah setelah kembali 12.20. Cocokkan tugas dan waktunya, lalu coba lagi.'
 },
 characters:[
  {id:'nara',name:'Nara',role:'Teman detektifmu',color:'#147D78'},
  {id:'bima',name:'Bima',role:'Petugas papan tulis',color:'#527393'},
  {id:'sari',name:'Sari',role:'Petugas lantai',color:'#BC3544'},
  {id:'raka',name:'Raka',role:'Petugas sampah dan perpustakaan',color:'#C48C2D'},
  {id:'bu-lila',name:'Bu Lila',role:'Pendamping musyawarah',color:'#79628D'}
 ],
 nodes:[
  {id:'piket-intro-lila',speakerId:'bu-lila',expression:'tenang',text:'Selasa ini, pukul 12.15, piket kelas belum selesai. Kita punya jadwal lama dan jadwal baru. Mari periksa pembagian tugas sebelum mencari jalan keluarnya.'},
  {id:'piket-intro-sari',speakerId:'sari',expression:'khawatir',text:'Aku sudah menyapu, tetapi sampah belum dibuang dan papan belum bersih. Kukira semua tugas harus selesai pukul 12.10. Aku juga ingin segera beristirahat.'},
  {id:'piket-intro-bima',speakerId:'bima',expression:'khawatir',text:'Aku tadi memindahkan meja agar Sari bisa menyapu. Tugasku di papan belum tuntas. Kita perlu memeriksa jadwal dan mendengar cerita Raka juga.'},
  {id:'piket-intro-nara',speakerId:'nara',expression:'penasaran',text:'Yuk, lihat jadwal yang berlaku dan cocokkan tugas teman. Bedakan waktu mulai dengan waktu selesai. Kita boleh memperbaiki kesalahan tanpa mempermalukan siapa pun.'}
 ],
 requiredEvidence:['E01','E02','E03','E04'],
 decisionRequirements:{statementIds:['S02'],evidenceIds:['E05']},
 evidence:[
  {id:'E01',title:'Jadwal Lama',kind:'Catatan',description:'Jadwal minggu lalu menulis Bima sebagai petugas Selasa. Ada tanda: diganti mulai Selasa pekan ini.',source:'Map arsip di meja kelas',observedAt:'Dibuat minggu lalu; tidak berlaku Selasa ini',limitation:'Menunjukkan tugas pada jadwal lama. Tidak boleh dipakai sebagai pembagian tugas hari ini.'},
  {id:'E02',title:'Jadwal Piket Terbaru',kind:'Kesepakatan tertulis',description:'Disepakati Senin pukul 13.00 untuk Selasa: mulai piket 12.10. Bima mengurus papan, Sari lantai, Raka sampah setelah kembali dari perpustakaan pukul 12.20.',source:'Papan jadwal yang disetujui kelas dan Bu Lila',observedAt:'Berlaku Selasa pekan ini',limitation:'Menunjukkan pembagian dan rencana waktu. Jadwal saja belum membuktikan tugas sudah dikerjakan.'},
  {id:'E03',title:'Keadaan Kelas 12.15',kind:'Pengamatan',description:'Pada Selasa pukul 12.15, sampah hasil sapuan terkumpul dan sebagian papan masih berkapur. Sapu tersandar di dekat meja.',source:'Pengamatan langsung di ruang kelas',observedAt:'Selasa, 12.15',limitation:'Menunjukkan pekerjaan yang tersisa saat diamati. Tidak membuktikan teman sengaja mengabaikan kewajiban.'},
  {id:'E04',title:'Kesepakatan Waktu Raka',kind:'Keterangan yang dikonfirmasi',description:'Raka bertugas mengantar buku ke perpustakaan sampai 12.20. Bu Lila mengonfirmasi kesepakatan Senin: Raka menangani sampah setelah kembali, bukan selesai pada 12.10.',source:'Percakapan Raka bersama Bu Lila di depan perpustakaan',observedAt:'Kesepakatan Senin 13.00; dikonfirmasi Selasa 12.15',limitation:'Menjelaskan waktu tugas Raka. Belum membuktikan sampah sudah dibuang setelah ia kembali.'},
  {id:'E05',title:'Tugas Bima yang Tertunda',kind:'Kesaksian',description:'Bima menjelaskan bahwa ia memindahkan meja agar lantai bisa disapu, lalu lupa melanjutkan membersihkan papan. Ia bersedia menuntaskannya dan meminta teman mengecek bersama.',source:'Tanya Lagi kepada Bima pada pernyataan S03',observedAt:'Dijelaskan dalam musyawarah Selasa',limitation:'Ini penjelasan Bima tentang tugasnya. Bantuan kepada teman tidak otomatis menghapus tugas yang belum selesai.'}
 ],
 locations:[
  {id:'arsip-piket',name:'Meja Kelas',description:'Bandingkan jadwal lama dan jadwal yang berlaku hari ini.',hotspots:[
   {id:'arsip-lama',label:'Buka map jadwal lama',evidenceId:'E01',dialogue:{id:'piket-lihat-lama',speakerId:'nara',expression:'penasaran',text:'Nama Bima ada di jadwal lama. Ada tanda bahwa jadwal ini sudah diganti. Kita perlu memakai jadwal yang berlaku hari ini.'}},
   {id:'papan-jadwal',label:'Cocokkan jadwal terbaru',evidenceId:'E02',dialogue:{id:'piket-lihat-baru',speakerId:'nara',expression:'tenang',text:'Jadwal baru disepakati Senin untuk Selasa. Cocokkan nama, tugas, dan waktunya. Pukul 12.10 adalah awal piket, sedangkan Raka kembali pukul 12.20.'}}
  ]},
  {id:'ruang-piket',name:'Ruang Kelas',description:'Amati pekerjaan yang tersisa. Keadaan ruangan belum menjelaskan alasan teman.',hotspots:[
   {id:'cek-ruang',label:'Amati papan dan hasil sapuan',evidenceId:'E03',dialogue:{id:'piket-lihat-ruang',speakerId:'sari',expression:'khawatir',text:'Sekarang 12.15. Sampah sudah kukumpulkan, tetapi belum dibuang. Papan juga belum selesai dibersihkan. Aku ingin tahu kapan kita bisa merapikan sisanya bersama.'}}
  ]},
  {id:'depan-perpustakaan',name:'Depan Perpustakaan',description:'Dengarkan Raka dan konfirmasi kesepakatan waktu kepada Bu Lila.',hotspots:[
   {id:'waktu-raka',label:'Periksa waktu tugas Raka',evidenceId:'E04',dialogue:{id:'piket-dengar-waktu',speakerId:'bu-lila',expression:'tenang',text:'Benar, kemarin kita sepakat Raka mengantar buku sampai 12.20, lalu mengurus sampah. Piket mulai 12.10 bukan berarti semua tugas selesai pada 12.10. Waktu berbeda ini perlu kita ingat bersama.'}}
  ]}
 ],
 statements:[
  {id:'S01',speakerId:'sari',text:'Jadwal baru membagi tugas kepada Bima, aku, dan Raka.',pressText:'Bima mengurus papan, aku lantai, dan Raka sampah. Jadwal lama memang berbeda, tetapi yang berlaku adalah kesepakatan baru.',acceptedPairs:[],incorrectFeedback:'E02 mendukung pembagian ini. Jadwal lama E01 sudah diganti. Periksa tugas dan waktu pada jadwal terbaru.'},
  {id:'S02',speakerId:'sari',text:'Karena piket mulai 12.10, Raka seharusnya sudah selesai membuang sampah pada 12.10.',pressText:'Aku menyamakan waktu mulai dengan waktu selesai. Aku belum memperhatikan kesepakatan tugas perpustakaan Raka.',acceptedPairs:[{evidenceId:'E04',reasonId:'waktu-disepakati',feedback:'Tepat! Bu Lila mengonfirmasi Raka baru kembali 12.20, lalu mengurus sampah. Waktu mulai bukan batas selesai semua tugas. Sari keliru membaca waktu dan boleh memperbaikinya.'},{evidenceId:'E02',reasonId:'waktu-disepakati',feedback:'Tepat! Jadwal terbaru juga menulis bahwa Raka mengurus sampah setelah kembali pukul 12.20. Waktu mulai 12.10 tidak berarti semua tugas harus sudah selesai. Jadwal dan keterangan Bu Lila saling mendukung.'}],incorrectFeedback:'Hubungkan bukti dengan waktu Raka. E02 dan E04 menjelaskan kesepakatan bersama Bu Lila: Raka kembali 12.20, lalu menangani sampah. Keadaan kelas 12.15 saja belum membuktikan ia melupakan tugas.'},
  {id:'S03',speakerId:'bima',text:'Aku memindahkan meja, tetapi papan belum selesai kubersihkan.',pressText:'Sesudah membantu memindahkan meja, aku lupa melanjutkan papan. Aku akan menuntaskannya. Bolehkah kita mengecek hasil piket bersama agar tidak ada tugas yang terlewat?',unlockEvidenceId:'E05',acceptedPairs:[],incorrectFeedback:'Bima belum menjelaskan mengapa papannya tertunda. Gunakan Tanya Lagi untuk mendengar ceritanya dan rencana memperbaikinya.'},
  {id:'S04',speakerId:'raka',text:'Setelah kembali pukul 12.20, aku tetap bertugas membuang sampah.',pressText:'Tugas perpustakaan tidak menghapus tugasku di kelas. Setelah kembali, aku akan mengurus sampah. Jika butuh bantuan, aku akan meminta dan menyepakatinya.',acceptedPairs:[],incorrectFeedback:'Ini sesuai jadwal terbaru dan kesepakatan waktu. Bantuan bisa ditawarkan, sementara tanggung jawab tetap jelas.'}
 ],
 objectionReasons:[
  {id:'waktu-disepakati',text:'Bu Lila mengonfirmasi Raka kembali 12.20, lalu mengurus sampah.'},
  {id:'awal-sama-akhir',text:'Waktu mulai selalu berarti semua pekerjaan harus sudah selesai.'},
  {id:'lama-berlaku',text:'Jadwal lama tetap berlaku meskipun sudah diganti.'}
 ],
 decisions:[
  {id:'bima-sendiri',text:'Minta Bima piket sendiri berdasarkan jadwal lama.',consequence:'Pembagian terbaru diabaikan dan beban Bima bertambah. Jadwal lama sudah diganti. Periksa lagi tanggung jawab setiap teman.'},
  {id:'abaikan-piket',text:'Batalkan piket dan biarkan kelas tetap kotor.',consequence:'Kelas tetap kotor dan tugas belum selesai. Kebutuhan istirahat perlu didengar, lalu disepakati waktu dan bantuan untuk menuntaskan pekerjaan.'},
  {id:'rencana-bersama',text:'Tuntaskan tugas sesuai jadwal, saling bantu, cek bersama, dan pasang satu jadwal terbaru.',acceptedReasonId:'tugas-dan-waktu',consequence:'Bima menuntaskan papan, Sari merapikan hasil sapuan, dan Raka membuang sampah setelah kembali 12.20. Nara menawarkan bantuan. Bu Lila mendampingi cek akhir yang disepakati. Jadwal lama disimpan di arsip, dan jadwal terbaru ditandai jelas. Teman tetap bertanggung jawab tanpa dipermalukan.'}
 ],
 decisionReasons:[
  {id:'tugas-dan-waktu',text:'Jadwal terbaru membagi kewajiban; waktu Raka disepakati. Tugas tertunda perlu dituntaskan dengan kerja sama.'},
  {id:'nama-lama',text:'Satu nama di jadwal lama berarti ia harus mengerjakan semua tugas selamanya.'},
  {id:'bantuan-hapus',text:'Membantu sekali membuat semua kewajiban sendiri otomatis hilang.'}
 ],
 reflections:[
  {id:'fakta',question:'Apa yang bisa disimpulkan saat sampah masih ada pada 12.15?',choices:[{id:'sisa-teramati',text:'Sampah belum dibuang saat itu; kita perlu memeriksa jadwal dan waktunya.'},{id:'pasti-malas',text:'Semua petugas pasti sengaja mengabaikan kewajiban.'}],acceptedIds:['sisa-teramati'],explanation:'Sampah yang terlihat adalah pengamatan. Jadwal dan keterangan Bu Lila menjelaskan Raka baru kembali 12.20. Keadaan ruangan saja tidak menjelaskan niat teman.'},
  {id:'dengar',question:'Mengapa cerita setiap petugas perlu didengar?',choices:[{id:'pahami-kebutuhan',text:'Agar tugas, waktu, dan kebutuhan bantuan jelas sebelum kita menyepakati rencana.'},{id:'hapus-tugas',text:'Agar siapa pun yang punya alasan boleh meninggalkan semua tugas.'}],acceptedIds:['pahami-kebutuhan'],explanation:'Mendengarkan memberi ruang untuk menjelaskan kesalahan dan kebutuhan. Bima tetap menuntaskan papan; waktu Raka diperhitungkan. Kerja sama berjalan bersama tanggung jawab.'},
  {id:'tindakan',question:'Apa yang bisa membantu piket berikutnya?',choices:[{id:'cek-jadwal',text:'Baca satu jadwal terbaru dan sepakati waktu cek akhir.'},{id:'tawarkan-bantuan',text:'Tuntaskan tugas sendiri dan tawarkan bantuan kepada teman.'}],acceptedIds:['cek-jadwal','tawarkan-bantuan'],explanation:'Keduanya membantu. Jadwal yang jelas mencegah salah paham, sementara bantuan yang disepakati menjaga kerja sama tanpa menghilangkan tanggung jawab.'}
 ],
 ending:{decisionId:'rencana-bersama',reasonId:'tugas-dan-waktu'}
};
