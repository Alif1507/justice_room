import type {StoryEnding} from '../lib/game/types.ts';
export const bookEndings={
 bima:{id:'book-unheard',title:'Suara Bima Terlewat',mood:'unresolved',motif:'blame',cast:['bima','raka'],takeaway:'Peminjam terakhir belum tentu penyebab kerusakan.',beats:[
  {id:'book-unheard-1',speakerId:'nara',expression:'khawatir',text:'Bayangkan jika Bima langsung disalahkan. Bima merasa tidak didengarkan, padahal ia sudah menceritakan keadaan buku saat dikembalikan.'},
  {id:'book-unheard-2',speakerId:'raka',expression:'khawatir',text:'Aku melihat buku itu kering pukul 09.00. Kalau keteranganku diabaikan, kita melewatkan petunjuk penting.'},
  {id:'book-unheard-3',speakerId:'bu-lila',expression:'tenang',text:'Buku masih perlu dirawat. Kita belum tahu siapa yang menyenggol botol. Mari tinjau lagi pilihan kita tanpa menuduh teman.'}]},
 sari:{id:'book-new-accusation',title:'Pertanyaan Berganti Tuduhan',mood:'unresolved',motif:'doubt',cast:['sari','bima'],takeaway:'Letak benda tidak membuktikan siapa pelakunya.',beats:[
  {id:'book-new-accusation-1',speakerId:'nara',expression:'khawatir',text:'Bayangkan jika tuduhan beralih kepada Sari hanya karena botol berada di dekatnya. Cerita tentang tumpahan justru berubah menjadi tuduhan baru.'},
  {id:'book-new-accusation-2',speakerId:'sari',expression:'khawatir',text:'Aku melihat air mengenai buku, tetapi tidak melihat siapa yang menyenggol botol. Aku ingin keteranganku didengar dengan lengkap.'},
  {id:'book-new-accusation-3',speakerId:'bu-lila',expression:'tenang',text:'Mengganti orang yang dituduh tidak menambah bukti. Kita bisa merawat buku dan mencegah tumpahan sambil mengakui hal yang belum diketahui.'}]},
 bersama:{id:'book-new-shelf',title:'Rak Buku, Harapan Baru',mood:'hopeful',motif:'care',cast:['bima','sari'],takeaway:'Bukti didengar, buku dirawat bersama.',beats:[
  {id:'book-new-shelf-1',speakerId:'bima',expression:'tenang',text:'Terima kasih sudah mendengarkanku. Kita belum tahu siapa yang menyenggol botol, jadi tidak ada yang dipaksa mengaku.'},
  {id:'book-new-shelf-2',speakerId:'sari',expression:'tenang',text:'Bu Lila membantu kita merawat buku. Kita juga menyiapkan tempat minuman yang jauh dari rak agar buku lebih aman.'},
  {id:'book-new-shelf-3',speakerId:'bu-lila',expression:'tenang',text:'Kita memilih berdasarkan bukti dan tetap peduli kepada teman. Buku dirawat, dan semua orang mendapat kesempatan didengar.'}]},
 reconsider:{id:'book-check-reason',title:'Musyawarah Belum Selesai',mood:'rethink',motif:'rethink',cast:['nara','bu-lila'],takeaway:'Solusi peduli perlu alasan yang sesuai bukti.',beats:[
  {id:'book-check-reason-1',speakerId:'nara',expression:'penasaran',text:'Usul merawat buku bersama sudah menunjukkan kepedulian. Namun, alasan yang dipilih belum menjelaskan urutan kejadian.'},
  {id:'book-check-reason-2',speakerId:'raka',expression:'tenang',text:'Buku masih kering saat dikembalikan. Keterangan Sari menjelaskan tumpahan setelah itu, tanpa menunjukkan siapa yang menyenggol botol.'},
  {id:'book-check-reason-3',speakerId:'bu-lila',expression:'tenang',text:'Mari pilih alasan yang menghargai bukti itu. Banyaknya tuduhan bukan bukti, dan semua pihak tetap perlu didengar.'}]}
} satisfies Record<string,StoryEnding>;
export const choreEndings={
 'bima-sendiri':{id:'chores-alone',title:'Bima Bekerja Sendiri',mood:'unresolved',motif:'solo',cast:['bima','sari'],takeaway:'Jadwal lama membuat beban tidak seimbang.',beats:[
  {id:'chores-alone-1',speakerId:'nara',expression:'khawatir',text:'Bayangkan jika semua tugas diberikan kepada Bima berdasarkan jadwal lama. Bima harus mengerjakan papan, lantai, dan sampah sendirian.'},
  {id:'chores-alone-2',speakerId:'sari',expression:'khawatir',text:'Padahal jadwal terbaru membagi tugas kami. Aku mendapat bagian lantai, dan Raka mendapat bagian sampah setelah kembali pukul 12.20.'},
  {id:'chores-alone-3',speakerId:'bu-lila',expression:'tenang',text:'Bima tetap perlu menuntaskan papan yang terlupa. Namun, tugas teman lain tidak otomatis menjadi bebannya. Kita bisa membagi tanggung jawab dengan jelas.'}]},
 'abaikan-piket':{id:'chores-waiting',title:'Kelas Menunggu Dirawat',mood:'unresolved',motif:'neglect',cast:['raka','sari'],takeaway:'Istirahat perlu, tanggung jawab tetap dituntaskan.',beats:[
  {id:'chores-waiting-1',speakerId:'nara',expression:'khawatir',text:'Bayangkan jika piket dibatalkan begitu saja. Sisa sapuan dan sampah tetap ada, sementara papan belum selesai dibersihkan.'},
  {id:'chores-waiting-2',speakerId:'raka',expression:'tenang',text:'Aku baru kembali pukul 12.20 sesuai kesepakatan. Sesudah itu, aku bisa menuntaskan bagianku. Tidak perlu membatalkan seluruh tugas.'},
  {id:'chores-waiting-3',speakerId:'bu-lila',expression:'tenang',text:'Kebutuhan istirahat boleh dibicarakan. Mari sepakati waktu dan bantuan agar kelas nyaman tanpa meninggalkan kewajiban.'}]},
 'rencana-bersama':{id:'chores-clear-roster',title:'Jadwal Jelas, Kerja Tuntas',mood:'hopeful',motif:'team',cast:['bima','raka'],takeaway:'Tugas jelas, saling bantu, lalu cek bersama.',beats:[
  {id:'chores-clear-roster-1',speakerId:'bima',expression:'tenang',text:'Aku menuntaskan papan yang tadi terlupa. Sari merapikan hasil sapuan. Nara menawarkan bantuan tanpa mengambil alih tanggung jawab kami.'},
  {id:'chores-clear-roster-2',speakerId:'raka',expression:'tenang',text:'Setelah kembali pukul 12.20, aku membuang sampah sesuai jadwal. Sesudah semua bagian selesai, kita cek kelas bersama Bu Lila.'},
  {id:'chores-clear-roster-3',speakerId:'bu-lila',expression:'tenang',text:'Jadwal lama masuk arsip dan satu jadwal terbaru ditandai jelas. Kelas lebih rapi, dan teman belajar bertanggung jawab tanpa dipermalukan.'}]},
 reconsider:{id:'chores-check-reason',title:'Rencana Perlu Alasan',mood:'rethink',motif:'rethink',cast:['nara','bima'],takeaway:'Bantuan berjalan bersama kewajiban sendiri.',beats:[
  {id:'chores-check-reason-1',speakerId:'nara',expression:'penasaran',text:'Rencana bekerja sama sudah baik. Namun, alasannya perlu menjelaskan pembagian tugas terbaru dan waktu yang telah disepakati.'},
  {id:'chores-check-reason-2',speakerId:'bima',expression:'tenang',text:'Mendapat bantuan tidak menghapus tugasku membersihkan papan. Namaku di jadwal lama juga tidak berarti semua pekerjaan menjadi tugasku.'},
  {id:'chores-check-reason-3',speakerId:'bu-lila',expression:'tenang',text:'Mari pilih alasan yang menjaga kerja sama sekaligus tanggung jawab. Jadwal terbaru dan kesepakatan waktu membantu kita menilai dengan adil.'}]}
} satisfies Record<string,StoryEnding>;
export const playEndings={
 'wajib-bola':{id:'play-one-choice',title:'Satu Permainan Tanpa Pilihan',mood:'unresolved',motif:'forced',cast:['sari','bima'],takeaway:'Berteman tidak berarti harus menyukai hal yang sama.',beats:[
  {id:'play-one-choice-1',speakerId:'nara',expression:'khawatir',text:'Bayangkan jika semua teman wajib bermain bola sepanjang istirahat. Sari ingin bermain bersama, tetapi pilihan permainan tenangnya tidak mendapat tempat.'},
  {id:'play-one-choice-2',speakerId:'sari',expression:'khawatir',text:'Aku tetap ingin berteman. Aku hanya memilih permainan yang lebih tenang. Bolehkah kita punya pilihan kegiatan?'},
  {id:'play-one-choice-3',speakerId:'bu-lila',expression:'tenang',text:'Memaksa satu permainan membuat sebagian kebutuhan terlewat. Mari cari aturan yang memberi kesempatan bergerak dan menghormati pilihan teman.'}]},
 'larang-bola':{id:'play-no-movement',title:'Lapangan Kehilangan Tawa',mood:'unresolved',motif:'empty',cast:['bima','sari'],takeaway:'Ketenangan dan kesempatan bergerak sama-sama perlu.',beats:[
  {id:'play-no-movement-1',speakerId:'nara',expression:'khawatir',text:'Bayangkan jika bola dilarang sepanjang istirahat. Lapangan menjadi tenang, tetapi teman yang ingin bergerak kehilangan kesempatan bermain bola.'},
  {id:'play-no-movement-2',speakerId:'bima',expression:'khawatir',text:'Aku ingin bergerak dan bermain bersama. Aku juga bisa belajar berbagi waktu dan menjaga batas aman.'},
  {id:'play-no-movement-3',speakerId:'bu-lila',expression:'tenang',text:'Mendengar Sari tidak berarti mengabaikan Bima. Mari bicarakan giliran dan ruang agar kedua kebutuhan mendapat kesempatan.'}]},
 'giliran-adil':{id:'play-many-ways',title:'Berbeda Permainan, Tetap Berteman',mood:'hopeful',motif:'choice',cast:['bima','sari'],takeaway:'Berbagi giliran sambil menghargai pilihan.',beats:[
  {id:'play-many-ways-1',speakerId:'bima',expression:'tenang',text:'Bola mendapat giliran sepuluh menit dengan batas aman. Sesudah itu, lapangan dipakai untuk permainan tenang selama sepuluh menit.'},
  {id:'play-many-ways-2',speakerId:'sari',expression:'tenang',text:'Bangku tetap terbuka. Kita boleh memilih kegiatan atau berganti permainan. Aku merasa diajak berteman tanpa dipaksa menyukai bola.'},
  {id:'play-many-ways-3',speakerId:'bu-lila',expression:'tenang',text:'Kita meninjau aturan setelah mencoba. Kebutuhan berbeda didengar, waktu dibagi, dan teman tetap punya pilihan.'}]},
 reconsider:{id:'play-check-reason',title:'Aturan Perlu Didengar',mood:'rethink',motif:'rethink',cast:['nara','sari'],takeaway:'Musyawarah menghargai kebutuhan yang berbeda.',beats:[
  {id:'play-check-reason-1',speakerId:'nara',expression:'penasaran',text:'Membagi giliran dan memberi pilihan adalah usul baik. Namun, alasan yang dipilih belum menjelaskan mengapa aturan itu adil.'},
  {id:'play-check-reason-2',speakerId:'sari',expression:'tenang',text:'Suara paling keras tidak harus selalu menang. Berteman juga tidak mengharuskan semua orang menyukai permainan yang sama.'},
  {id:'play-check-reason-3',speakerId:'bu-lila',expression:'tenang',text:'Mari pilih alasan yang mendengar kebutuhan bergerak dan kebutuhan bermain tenang, sambil menjaga kebebasan memilih.'}]}
} satisfies Record<string,StoryEnding>;
