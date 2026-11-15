# JUSTICE ROOM — The Decision Maker

> Spesifikasi pembangunan website game pembelajaran PPKn kelas 4–6 SD.
> Status: rancangan siap implementasi. Pilihan teknis dan cakupan di bawah merupakan rekomendasi pembangunan, bukan aplikasi yang sudah selesai.

## 1. Ringkasan produk

Bangun website menggunakan Next.js dan TypeScript berupa petualangan cerita 2D. Anak berperan sebagai Detektif Keadilan Cilik: menyelidiki konflik sekolah, mendengarkan semua pihak, menguji pernyataan dengan bukti, dan mengusulkan penyelesaian melalui musyawarah.

Inspirasi mekanik: investigasi, pemeriksaan kesaksian, dan presentasi bukti dari Phoenix Wright: Ace Attorney. Gunakan nama, karakter, ilustrasi, musik, dialog, serta identitas visual original. Jangan mengambil aset dari game referensi. Screenshot referensi hanya menjadi inspirasi interaksi, bukan aset produk.

Ruang musyawarah memiliki suasana panggung debat yang ramah anak. Ini simulasi pendidikan, bukan representasi prosedur pengadilan Indonesia. Anak bukan hakim yang memberikan hukuman kepada teman. Jangan menyamakan kesalahan ingatan dengan kebohongan.

## 2. Sasaran dan keberhasilan

- Pengguna utama: siswa kelas 4–6 SD, bermain mandiri atau didampingi guru.
- Sasaran: membedakan fakta dan dugaan, menghargai pendapat, menghubungkan hak dengan kewajiban, menerapkan nilai Pancasila, dan membuat keputusan beralasan.
- Satu episode sekitar 10–15 menit; tanpa batas waktu wajib.
- Anak menyelesaikan satu kasus dari awal sampai refleksi tanpa bantuan pengembang.
- Setiap jawaban salah memperoleh penjelasan spesifik dan kesempatan mencoba kembali.
- Materi merupakan usulan pembelajaran; jangan mengklaim kesesuaian CP/kurikulum tertentu sebelum guru memvalidasinya.

## 3. Cakupan versi pertama

### Wajib selesai

1. Beranda dengan Mulai Bermain, Lanjutkan, Cara Bermain, dan Pengaturan.
2. Daftar kasus dengan satu episode lengkap yang dapat dimainkan.
3. Tutorial singkat dalam permainan.
4. Investigasi tiga lokasi dengan hotspot yang dapat diklik.
5. Dialog karakter, ekspresi, dan riwayat percakapan.
6. Koleksi bukti dengan informasi sumber, waktu, dan keterbatasan bukti.
7. Pemeriksaan pernyataan, Tanya Lagi, dan KEberatan melalui tombol berlabel `KEBERATAN!`.
8. Pilihan bukti dan alasan, bukan sekadar menekan tombol.
9. Penyelesaian, konsekuensi, penjelasan PPKn, dan refleksi.
10. Penyimpanan progres lokal, pengaturan suara/gerakan, dan mulai ulang.
11. Tampilan responsif serta navigasi keyboard.

### Pengembangan berikutnya

Empat episode tambahan, narasi suara rekaman, profil lokal multipemain, dan panel guru dengan akun. Jangan menampilkan tombol aktif menuju fitur yang belum tersedia. Kartu episode mendatang boleh muncul dengan label `Segera hadir` dan tidak dapat dimainkan.

### Di luar versi pertama

Login, database cloud, multiplayer daring, chatbot AI, penilaian otomatis teks bebas, leaderboard publik, pembayaran, dan simulasi hukum pidana.

## 4. Alur pemain

Beranda → pilih kasus → pengantar dan tujuan belajar → investigasi → berkas bukti → ruang musyawarah → uji pernyataan → pilih solusi dan alasan → dampak keputusan → refleksi dan hasil.

Pemain dapat kembali membuka bukti kapan saja. Setelah investigasi selesai, lokasi masih dapat dikunjungi melalui tombol Kembali Investigasi sebelum keputusan akhir. Akses langsung ke URL tahap lanjut harus memulihkan progres yang sah atau mengarahkan ke tahap awal; jangan melewati prasyarat.

## 5. Episode pertama: Misteri Buku Kelas yang Rusak

### Tujuan belajar

- Tidak menyalahkan orang hanya karena ia terakhir meminjam barang.
- Membedakan pengamatan langsung, ingatan, dan dugaan.
- Mendengarkan pihak yang dituduh dan memperbaiki kesalahan bersama.
- Mengaitkan sikap adil dengan nilai kemanusiaan, musyawarah, dan tanggung jawab.

### Tokoh original

| ID | Tokoh | Peran |
|---|---|---|
| nara | Nara | Pendamping pemain; bertanya tanpa langsung membocorkan jawaban |
| bima | Bima | Peminjam terakhir; mengaku mengembalikan buku dalam keadaan baik |
| sari | Sari | Petugas pojok baca; menemukan buku basah |
| raka | Raka | Melihat buku saat dikembalikan |
| bu-lila | Bu Lila | Fasilitator musyawarah; membantu anak merumuskan solusi |

### Fakta cerita yang tetap

Pada Senin, Bima mengembalikan buku pukul 09.00. Raka melihat halaman buku kering dan utuh saat itu. Pukul 09.15, Sari memotret rak untuk tugas kelas; terlihat botol tanpa tutup di sebelah buku dan buku tampak masih kering. Pukul 09.20, Sari melihat botol terguling dan air mengenai buku, tetapi tidak melihat siapa yang menyenggolnya. Sari memindahkan buku lalu melaporkan kerusakan pukul 09.25. Karena Bima adalah peminjam terakhir, ia sempat dianggap bertanggung jawab.

Kesimpulan terbatas: bukti tidak cukup untuk menyalahkan Bima; buku terkena tumpahan di rak setelah pengembalian. Tidak ada bukti yang memastikan siapa yang menjatuhkan botol. Jangan menciptakan pelaku di akhir cerita.

### Lokasi dan bukti

| ID bukti | Lokasi / cara memperoleh | Isi yang terlihat | Batas kesimpulan |
|---|---|---|---|
| E01 | Meja peminjaman; klik buku catatan | Bima mengembalikan buku pukul 09.00 | Menunjukkan peminjam terakhir, bukan penyebab kerusakan |
| E02 | Pojok baca; klik buku rusak | Halaman basah dan bekas air | Menunjukkan kondisi buku, bukan pelaku |
| E03 | Meja Sari; minta foto rak | Foto pukul 09.15: botol terbuka di dekat buku | Keberadaan botol belum membuktikan siapa yang menumpahkan |
| E04 | Koridor; wawancarai Raka | Raka melihat buku kering dan utuh saat dikembalikan pukul 09.00 | Keterangan saksi; harus diperiksa bersama bukti lain |
| E05 | Ruang musyawarah; Tanya Lagi pada Sari | Sari melihat botol terguling dan air mengenai buku pukul 09.20; tidak melihat penyebab botol jatuh | Mendukung urutan kejadian, tidak menunjuk pelaku |

E01–E04 wajib diperoleh untuk masuk musyawarah. E05 diperoleh melalui pemeriksaan pernyataan, bukan hotspot investigasi. Jangan mengunci musyawarah dengan syarat E05 karena akan menciptakan kebuntuan.

### Dialog pembuka

Bu Lila: “Buku kelas kita rusak. Sebelum menyimpulkan, mari dengarkan semua cerita.”
Sari: “Bima yang terakhir meminjamnya. Aku pikir buku itu sudah rusak saat dikembalikan.”
Bima: “Aku mengembalikannya setelah membaca. Saat itu bukunya masih baik.”
Nara: “Mana yang sudah kita ketahui, dan mana yang masih dugaan? Yuk, cari petunjuknya.”

### Pemeriksaan pernyataan

| ID | Pernyataan Sari | Aksi dan hasil |
|---|---|---|
| S01 | “Bima adalah peminjam terakhir.” | E01 mendukung. Tidak perlu keberatan; lanjutkan. |
| S02 | “Karena itu, buku pasti sudah basah saat Bima mengembalikannya.” | Ajukan E04, alasan: Raka melihat buku kering saat pengembalian. Status berubah menjadi dugaan yang belum terbukti. |
| S03 | “Aku menemukan buku basah setelah istirahat.” | Tanya Lagi membuka E05 dan penjelasan pukul 09.20. |
| S04 | “Kita belum tahu siapa yang menyenggol botol.” | Pernyataan sesuai informasi. Pemain mengakui batas bukti, bukan mencari kambing hitam. |

S02 menerima E04 sebagai bukti utama. E03 saja mendapat umpan balik bahwa foto membantu urutan waktu tetapi tidak sendirian menjawab semua kejadian. Bukti yang tidak cocok tidak menghapus progres. Setelah S02 terselesaikan dan E05 didapat, tahap keputusan terbuka.

### Keberatan yang ramah

Tombol `KEBERATAN!` membuka dialog pilihan bukti, lalu pilihan alasan. Animasi baru dimainkan setelah bukti dan alasan dikirim. Nara mencontohkan: “Aku punya bukti yang perlu kita pertimbangkan.” Jangan menampilkan hinaan, ancaman, atau mempermalukan saksi.

### Keputusan dan cabang akhir

| Pilihan | Dampak | Umpan balik |
|---|---|---|
| Menyalahkan Bima karena terakhir meminjam | Bima merasa tidak didengarkan | Catatan peminjaman tidak membuktikan penyebab kerusakan. Ajak meninjau bukti kembali. |
| Menyalahkan Sari karena botol ada di dekatnya | Tuduhan baru muncul tanpa bukti pelaku | Posisi benda tidak cukup untuk memastikan siapa yang menjatuhkan. |
| Mengakui pelaku belum diketahui, merawat buku bersama dengan bantuan guru, dan memisahkan minuman dari rak | Teman merasa didengarkan dan ada langkah pencegahan | Penyelesaian bertumpu pada bukti, kepedulian, dan tanggung jawab bersama tanpa memaksa pengakuan. |

Setelah memilih solusi, pemain wajib memilih alasan. Alasan tepat: “Bukti menunjukkan buku terkena air setelah dikembalikan, tetapi belum menunjukkan siapa yang menjatuhkan botol.” Alasan pengecoh: “Yang paling banyak dituduh pasti salah” dan “Tidak perlu mendengarkan semua pihak.”

Pilihan yang kurang tepat menampilkan konsekuensi singkat dan tombol Coba Solusi Lain. Akhir pembelajaran tetap dapat diselesaikan setelah perbaikan, tanpa label anak nakal atau gagal.

### Refleksi

Tiga pertanyaan: apa perbedaan fakta dan dugaan; mengapa semua pihak perlu didengar; tindakan apa yang bisa menjaga buku kelas. Dua pertama pilihan ganda dengan pembahasan; terakhir pilihan tindakan dan catatan opsional. Catatan teks bebas tidak dinilai otomatis dan tidak diunggah.

## 6. Episode lanjutan yang direncanakan

| Kasus | Materi | Interaksi khas |
|---|---|---|
| Giliran Piket yang Terlupakan | Kewajiban, kerja sama | Cocokkan jadwal dan keterangan teman |
| Semua Boleh Bermain | Toleransi, persatuan | Dengarkan sudut pandang dan susun aturan bermain adil |
| Suara untuk Ketua Kelas | Musyawarah, kejujuran | Periksa aturan dan hitung ulang suara fiktif |
| Antrean Kantin | Aturan, hak orang lain | Susun urutan kejadian dan pilih penyelesaian |

Jangan membuat semua episode hanya reskin tuduhan. Konflik dapat berupa perbedaan kebutuhan yang sama-sama masuk akal. Materi tidak boleh mendiskriminasi identitas atau menjadikan anak tertentu stereotip pelaku.

## 7. Desain tampilan

### Arah visual

Ilustrasi kartun 2D original, lingkungan sekolah Indonesia yang hangat, warna navy–krem–emas, aksen teal untuk interaksi dan merah untuk keberatan. Hindari nuansa penjara, kekerasan, serta ruang sidang yang menakutkan. Jangan menjadikan beranda dashboard statistik korporat.

Token awal: navy `#17324D`, krem `#FFF8E8`, emas `#F4C95D`, teal `#147D78`, merah `#BC3544`, teks `#172B3A`. Warna akhir harus diuji kontras; jangan memakai teks putih kecil di atas emas. Gunakan font sans-serif yang mudah dibaca dan berlisensi sesuai, font lokal atau fallback sistem. Teks utama minimal 18px dan jarak baris sekitar 1.6.

### Layar permainan desktop

Header ringkas berisi judul kasus, tahap, progres, dan pengaturan. Area adegan utama menampilkan latar dan karakter. Dialog berada di bawah adegan dengan nama pembicara dan tombol lanjut. Panel bukti dapat dibuka di sisi kanan. Tombol aksi selalu jelas: Tanya Lagi, Lihat Bukti, Keberatan, Lanjutkan.

### Ponsel dan tablet

Jangan memaksa orientasi landscape. Gunakan susunan vertikal: adegan, dialog, aksi. Berkas bukti terbuka sebagai drawer atau dialog layar penuh. Pada layar sempit, hotspot memiliki alternatif daftar `Objek yang Bisa Diperiksa` agar mudah diakses.

### Gerakan dan audio

Efek ketik dapat dilewati satu klik; klik pertama menyelesaikan teks, klik berikutnya melanjutkan. Sediakan pilihan teks instan. Animasi keberatan maksimal sekitar satu detik, tanpa kilatan cepat. Hormati prefers-reduced-motion. Audio nonaktif sebelum interaksi pengguna dan tersedia tombol mute. Suara tidak boleh menjadi satu-satunya sumber informasi.

## 8. Mekanik dan penilaian

- Pilihan dialog deterministik, bukan hasil model AI.
- Setiap pernyataan memiliki daftar pasangan bukti–alasan yang diterima serta umpan balik untuk pilihan lain.
- Bukti hanya masuk inventori sekali, walaupun objek diklik berulang.
- Petunjuk tiga tingkat: arahkan ke pernyataan; arahkan ke jenis bukti; jelaskan hubungan. Tidak mengurangi skor.
- Tanpa nyawa, game over, timer wajib, dan leaderboard publik.
- Tampilkan empat capaian: Pengamat Teliti, Pemeriksa Bukti, Pendengar Adil, dan Pemecah Masalah.
- Jika perlu skor internal: bukti wajib 4 × 5 = 20, pasangan keberatan tepat = 30, solusi dan alasan tepat = 30, dua refleksi pilihan ganda 2 × 10 = 20. Total maksimum 100.
- Skor adalah capaian setelah belajar; percobaan ulang tidak memberi poin tambahan. Hitung dari himpunan milestone unik, jangan memakai increment setiap klik.
- Tidak ada poin untuk panjang jawaban teks bebas. Riwayat percobaan hanya lokal dan bukan ukuran kecerdasan anak.

## 9. Arsitektur teknis yang diusulkan

Next.js App Router + TypeScript strict. Gunakan rilis stabil yang kompatibel saat implementasi, tetapkan versi aktual di package.json dan lockfile; jangan mengandalkan nomor versi dari dokumen ini. Gunakan CSS Modules atau Tailwind secara konsisten, bukan campuran tanpa kebutuhan. Animasi CSS cukup untuk MVP; pustaka animasi opsional setelah kebutuhan nyata.

Server Components untuk struktur halaman statis; Client Components hanya untuk engine permainan, dialog, interaksi, dan penyimpanan browser. Gunakan useReducer untuk state machine dan context terlokalisasi bila perlu. Tidak perlu backend untuk MVP.

Struktur yang disarankan:

```text
app/
  page.tsx
  kasus/page.tsx
  kasus/[caseId]/page.tsx
  panduan/page.tsx
components/
  game/GameShell.tsx
  game/Scene.tsx
  game/DialogueBox.tsx
  game/EvidenceDrawer.tsx
  game/TestimonyPanel.tsx
  game/ObjectionDialog.tsx
  game/DecisionPanel.tsx
  game/ReflectionPanel.tsx
  ui/
content/cases/buku-rusak.ts
lib/game/types.ts
lib/game/reducer.ts
lib/game/selectors.ts
lib/game/scoring.ts
lib/game/storage.ts
public/assets/characters/
public/assets/backgrounds/
public/assets/evidence/
tests/
AGENTS.md
JUSTICE_ROOM_SPEC.md
README.md
```

Pisahkan data cerita dari komponen. Aset harus lokal, berlisensi jelas, dan memiliki fallback. Hindari hotlink yang mudah rusak. Catat asal serta lisensi aset dalam ASSETS.md saat aset ditambahkan.

## 10. Kontrak data dan state

```ts
type Phase = 'intro' | 'investigation' | 'testimony' | 'decision' | 'reflection' | 'result';
type Evidence = {
  id: string;
  title: string;
  description: string;
  source: string;
  observedAt?: string;
  limitation: string;
  image?: string;
};
type Testimony = {
  id: string;
  speakerId: string;
  text: string;
  pressDialogueId?: string;
  unlockEvidenceId?: string;
  acceptedPairs: { evidenceId: string; reasonId: string; feedback: string }[];
  incorrectFeedback: string;
};
type SaveData = {
  schemaVersion: number;
  caseContentVersion: number;
  caseId: string;
  phase: Phase;
  dialogueNodeId: string;
  evidenceIds: string[];
  resolvedStatementIds: string[];
  pressedStatementIds: string[];
  milestoneIds: string[];
  decisionId?: string;
  decisionReasonId?: string;
  reflectionAnswerIds: string[];
  reflectionNote?: string;
  updatedAt: string;
};
```

Tambahkan CaseDefinition dengan tokoh, lokasi, hotspot, nodes dialog, bukti, pernyataan, alasan, keputusan, refleksi, dan syarat transisi. Validator memeriksa ID unik, referensi node/bukti valid, serta keberadaan ending yang dapat dicapai. Semua ID stabil; jangan gunakan indeks array sebagai identitas konten.

Event reducer: START_CASE, ADVANCE_DIALOGUE, VISIT_LOCATION, COLLECT_EVIDENCE, ENTER_TESTIMONY, PRESS_STATEMENT, SUBMIT_OBJECTION, SELECT_DECISION, SUBMIT_REFLECTION, FINISH_CASE, RESTORE_SAVE, RESET_CASE. Event harus memvalidasi prasyarat; UI yang menyembunyikan tombol saja tidak cukup.

Transisi penting:

- intro → investigation: pengantar selesai.
- investigation → testimony: E01–E04 terkumpul.
- testimony → decision: S02 terselesaikan dan E05 terbuka.
- decision → reflection: solusi dan alasan yang diterima sudah dipilih, termasuk setelah mencoba ulang.
- reflection → result: pertanyaan wajib selesai; catatan bebas opsional.

## 11. Penyimpanan, privasi, dan pemulihan

Simpan progres dengan key bernamespace `justice-room:save:<caseId>` dan settings terpisah. Baca localStorage hanya di client setelah mount; gunakan status loading agar tidak ada hydration mismatch atau save kosong yang menimpa save lama.

Validasi save: schemaVersion, versi konten, caseId, enum phase, semua referensi ID, serta prasyarat fase. Jika rusak, jangan crash atau langsung menghapus: beri pilihan Mulai Ulang dengan penjelasan. Jika versi tidak didukung, tawarkan reset atau migrasi yang diuji.

Saat penyimpanan tidak tersedia atau kuota penuh, permainan tetap berjalan dalam memori dan tampilkan pemberitahuan bahwa progres sesi tidak tersimpan. Reset hanya menghapus key aplikasi/case terkait, bukan seluruh localStorage. Konfirmasi sebelum mereset progres.

MVP tidak mengumpulkan nama asli, email, lokasi, foto, atau data sekolah. Tidak memasang analytics/tracker pihak ketiga. Jelaskan bahwa progres hanya tersedia di browser/perangkat yang sama.

## 12. Aksesibilitas dan kualitas

Semua hotspot adalah button berlabel, bukan area gambar tanpa akses keyboard. Urutan Tab logis, fokus terlihat, Escape menutup dialog, fokus kembali ke pemicu, dan dialog mengelola fokus. Jangan mengunci aksi ke drag-and-drop atau hover saja. Ukuran target sentuh minimal 44 × 44px.

Gunakan aria-live secara hemat untuk pemberitahuan bukti baru; jangan membacakan animasi ketik per karakter. Ilustrasi informatif diberi alt, dekoratif alt kosong. Jangan mengandalkan warna untuk menandai benar/salah. Uji lebar 360px, 768px, dan 1440px, termasuk teks panjang.

Optimalkan gambar, muat aset kasus saat dibutuhkan, dan hindari library 3D untuk petualangan 2D ini. Setelah route/aset dimuat, engine tidak memerlukan API; jangan mengklaim dukungan offline penuh tanpa service worker dan pengujian terpisah.

## 13. Tahapan pembangunan

1. Baca spesifikasi dan AGENTS.md; periksa repo yang sudah ada sebelum membuat proyek.
2. Susun model konten dan state machine; buat data episode pertama lengkap.
3. Bangun vertical slice: intro → satu bukti → keberatan → keputusan → hasil.
4. Lengkapi seluruh lokasi, bukti, dialog, tutorial, dan cabang umpan balik.
5. Tambahkan tampilan ilustratif, ekspresi, transisi, dan responsivitas.
6. Tambahkan penyimpanan, pemulihan, aksesibilitas, dan pengaturan.
7. Uji mekanik, walkthrough, build, lalu dokumentasikan cara menjalankan.

Selesaikan satu episode sungguhan sebelum menambah episode baru. Jangan menyerahkan landing page dengan tombol permainan palsu.

## 14. Kriteria penerimaan

- [ ] Next.js berjalan dan production build berhasil.
- [ ] Episode buku rusak dapat diselesaikan dari awal sampai hasil.
- [ ] Hotspot, dialog, bukti, Tanya Lagi, keberatan, dan keputusan berfungsi.
- [ ] E05 tidak diwajibkan sebelum masuk musyawarah.
- [ ] Bukti/alasan salah memberikan umpan balik dan tidak menaikkan skor.
- [ ] Klik ulang, refresh, dan membuka ulang modal tidak menggandakan poin.
- [ ] Pilihan salah dapat diperbaiki tanpa mengulang seluruh kasus.
- [ ] Pelaku tidak dikarang dan batas kesimpulan bukti dijelaskan.
- [ ] Reload memulihkan fase, bukti, dan dialog yang valid.
- [ ] Save rusak/versi lama serta localStorage gagal ditangani.
- [ ] Reset satu kasus tidak menghapus data lain.
- [ ] Keyboard, ponsel, reduced motion, teks instan, dan mute bekerja.
- [ ] Tidak ada link/tombol aktif yang tidak memiliki fungsi.
- [ ] Guru dapat membaca tujuan, materi, dan pembahasan melalui panduan.
- [ ] Tidak ada klaim validasi kurikulum atau fitur selesai tanpa bukti.

## 15. Pengujian yang dibutuhkan

Unit test untuk transisi reducer, prasyarat fase, kombinasi bukti–alasan, deduplikasi skor, dan validasi save. Integration test untuk membuka E05 melalui Tanya Lagi. E2E untuk alur benar, bukti salah lalu diperbaiki, solusi salah lalu diperbaiki, reload pertengahan kasus, reset, dan akses keyboard ke dialog bukti.

Sediakan scripts lint, typecheck, test, dan build yang benar-benar tersedia. Gunakan Playwright untuk E2E bila dipasang. Dokumentasikan perintah aktual dan hasil aktual; pemeriksaan visual manual tidak boleh disebut tes otomatis.

## 16. Cara menggunakan dokumen

Letakkan file ini dan AGENTS.md di root proyek. Instruksi awal ke AI coding:

> Baca AGENTS.md dan JUSTICE_ROOM_SPEC.md. Bangun Justice Room menggunakan Next.js sesuai spesifikasi. Prioritaskan satu episode Misteri Buku Kelas yang Rusak yang dapat dimainkan sampai selesai. Pisahkan konten dari engine, gunakan aset original, dan uji alur serta penyimpanan. Jelaskan bagian selesai, pengujian yang dilakukan, dan keterbatasan yang masih ada.
