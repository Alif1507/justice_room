# Justice Room

Petualangan cerita 2D berbahasa Indonesia untuk belajar PPKn kelas 4–6 SD. Satu episode lengkap: **Misteri Buku Kelas yang Rusak**. Spesifikasi produk berada di [JUSTICE_ROOM_SPEC.md](JUSTICE_ROOM_SPEC.md); instruksi proyek di [AGENTS.md](AGENTS.md).

## Menjalankan

Gunakan **Node.js 24 atau lebih baru** dan npm. Dependensi dipatok di `package.json` dan `package-lock.json`.

```sh
npm ci
npm run dev
```

Buka http://localhost:3000. Instalasi baru memerlukan akses registry npm. Pada lingkungan pengembangan awal yang memblokir unduhan, dependensi yang sudah tersedia secara lokal dipakai untuk menjalankan pemeriksaan; lockfile kemudian dinormalisasi dengan npm secara offline. Instalasi bersih dari internet belum diuji di lingkungan ini.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm test` memakai test runner Node dengan TypeScript stripping, tanpa layanan eksternal. `npm run build` membuat produksi Next.js, dan `npm start` menjalankannya.

## Bermain

- `/`: beranda, mulai bermain, lanjutkan bila ada progres, cara bermain, dan pengaturan.
- `/kasus`: satu kasus tersedia; episode berikutnya diberi label **Segera hadir**.
- `/kasus/buku-rusak`: pengantar dan tutorial, investigasi, musyawarah, keputusan beralasan, refleksi, dan hasil.
- `/panduan`: tujuan belajar, panduan pendamping, pembahasan, penilaian, dan privasi.

Empat bukti awal membuka musyawarah. E05 hanya diperoleh melalui **Tanya Lagi pada S03**. S02 dapat diuji menggunakan **E04 + alasan Raka melihat buku kering pukul 09.00**. E05 dan penyelesaian S02 membuka keputusan. Solusi bersama dengan alasan urutan tumpahan membuka refleksi; tiga refleksi wajib membuka hasil. Catatan bebas bersifat opsional dan tidak dinilai.

Tidak ada nyawa atau penghitung waktu. Pilihan salah mendapat pembahasan dan dapat diperbaiki. Skor berasal dari milestone unik, maksimal 100; pengulangan tidak menambah poin. Cerita tidak mengungkap siapa yang menyenggol botol, karena bukti tidak mengidentifikasinya. Materi merupakan usulan yang belum memperoleh validasi kurikulum dari guru.

## Pengujian browser

```sh
npm run test:e2e
```

Konfigurasi Windows menggunakan Chrome di `C:/Program Files/Google/Chrome/Application/chrome.exe`. Untuk lokasi lain, set `CHROME_PATH` ke executable browser. Pada Linux/macOS, gunakan Chromium Playwright (`npx playwright install chromium`) atau set `CHROME_PATH`. Server pengembangan dimulai otomatis jika belum ada pada port 3000.

Tes mencakup permainan lengkap, keberatan salah dan perbaikannya, keputusan salah dan perbaikannya, reload investigasi/musyawarah, hasil 100, reset terkonfirmasi, data lain dan pengaturan tetap tersimpan, save rusak, localStorage diblokir, navigasi keyboard/fokus dialog, pengaturan gerakan/suara, dan melewati animasi teks. Pemeriksaan lebar 360, 768, dan 1440 piksel mencakup investigasi, musyawarah, dialog keberatan, keputusan, refleksi, hasil, dan beranda. Screenshot dihasilkan ke `test-results/`; direktori ini diabaikan Git.

## Arsitektur

- `content/cases/buku-rusak.ts`: tokoh, dialog, lokasi, bukti, pernyataan, pilihan, refleksi, dan validator referensi.
- `lib/game/types.ts`: kontrak state, konten, settings, dan event.
- `lib/game/reducer.ts`: transisi deterministik dengan pemeriksaan prasyarat setiap event.
- `lib/game/selectors.ts`: prasyarat dan penilaian milestone unik.
- `lib/game/storage.ts`: validasi, whitelist data, penyimpanan, reset per kasus, dan settings terpisah.
- `components/game/`: interaksi, presentasi adegan, frame cerita, pilihan beralasan, subtitle, dialog, dan hydration penyimpanan.
- `components/ui/`: dialog dengan focus trap/focus return, settings, identitas visual, ilustrasi karakter original.
- `app/`: halaman App Router; halaman statis memakai Server Components dan interaksi dibatasi ke komponen client.

CSS Modules untuk tampilan komponen dan satu stylesheet global untuk token/reset. Font sistem; tidak ada permintaan font pihak ketiga. Ilustrasi SVG, ikon, dan bunyi sintetis dicatat di [ASSETS.md](ASSETS.md).

## Penyimpanan dan privasi

Hanya localStorage: `justice-room:save:buku-rusak` dan `justice-room:settings`. Save mencakup `schemaVersion` dan `caseContentVersion`. Data dibaca setelah mount; autosave menunggu hydration. Restore memvalidasi enum, ID, versi, milestone, dan prasyarat fase. Save rusak tidak ditimpa sebelum konfirmasi reset. Reset hanya menghapus progres/catatan kasus terkait; settings dan data browser lain tetap tersimpan.

Jika penyimpanan penuh/diblokir, permainan tetap berjalan dalam memori dan memberi pemberitahuan. Progres hanya tersedia pada browser/perangkat yang sama. Tidak ada akun, server data, analytics, sinkronisasi antarperangkat, atau pengiriman catatan. Jangan memasukkan informasi pribadi ke catatan. Penghapusan data browser dapat menghapus progres. Tidak ada service worker; **dukungan luring penuh tidak dijanjikan**.

## Aksesibilitas

Gunakan Tab/Shift+Tab, Enter/Spasi, dan Escape. Hotspot berupa tombol dan memiliki alternatif daftar. Dialog menjaga fokus di dalam serta mengembalikannya ke pemicu. Pengaturan menyediakan teks langsung, gerakan minimal, dan mute; preferensi reduced motion sistem dihormati. Bunyi pendek bersifat tambahan, nonaktif secara default dan hanya dimainkan setelah aksi pemain. Tidak ada rekaman suara atau musik latar.

## Alur cerita terpandu

Permainan utama memakai satu frame setinggi viewport: panggung animasi, tokoh, subtitle dan tombol aksi utama. Tidak ada panel samping atau deretan tombol lokasi pada alur utama. Tombol Berkas Bukti dan Menu Kasus menyediakan akses sekunder ke pengaturan, riwayat, petunjuk, panduan dan tinjauan bukti.

Investigasi berurutan: E01 catatan peminjaman -> E02 buku basah -> E03 foto Sari -> E04 keterangan Raka. Setelah memeriksa satu objek, pemain membaca penjelasan dan batas bukti pada subtitle, lalu memilih Petunjuk Berikutnya. Penemuan tidak otomatis melewati penjelasan. Tinjau Petunjuk pada menu membuka kembali petunjuk yang telah dimiliki tanpa menambah nilai. Save lama tetap dapat dipulihkan; fokus dikembalikan ke petunjuk yang sedang dibaca atau yang belum ditemukan.

Musyawarah menampilkan S01 -> S02 -> S03 -> S04. Dugaan S02 perlu diperiksa dengan bukti dan alasan; S03 perlu diperjelas melalui Tanya Lagi untuk memperoleh E05. Pilihan bukti dan alasan muncul bergantian dalam panggung, demikian juga solusi dan alasannya. Konsekuensi dibaca dulu, kemudian refleksi ditampilkan satu pertanyaan per langkah. Jawaban salah tetap dapat diperbaiki.

`lib/game/guided.ts` memilih fokus dan membagi teks menjadi halaman subtitle pendek tanpa menghapus kata. `StoryCaption.tsx` menjaga tombol Lanjutkan sampai halaman penjelasan selesai. `CaseScene.tsx`, `ChoiceStage.tsx` dan `guided.module.css` membentuk frame. Fokus keyboard berpindah ke pilihan baru saat tahap pertanyaan berubah. Permainan diuji pada lebar 360, 768 dan 1440 piksel; opsi solusi juga diuji pada ponsel 360?640. Dialog bantuan/bukti yang sengaja dibuka tetap dapat discroll.

## Animasi cerita

Kamera adegan, gerak bicara, kedipan tokoh, bukti yang diperbesar dan perayaan capaian menggunakan CSS/SVG lokal. Rekonstruksi E05 sekarang menjadi bagian panggung yang sama dengan subtitle, dan tetap terlihat sampai pemain melanjutkan cerita. Rekonstruksi hanya menunjukkan botol terguling, air, dan buku; tidak menunjukkan siapa yang menyenggolnya.

Efek singkat dapat dilewati dengan Lewati Animasi. Pengaturan Kurangi gerakan dan preferensi sistem mematikan gerakan dekoratif, sementara gambar serta teks cerita tetap tersedia. Tidak ada timer membaca wajib, kilatan, atau guncangan layar.

`lib/game/presentation.ts` menyimpan cue sementara terpisah dari state kasus. Cue mengikuti hasil reducer yang sah; bukti ulang tidak memutar ulang temuan. Cue tidak masuk localStorage dan tidak diputar ulang saat restore. Tidak ada dependensi atau layanan tambahan.

## Menambahkan kasus

1. Buat data kasus dengan `CaseDefinition`: ID stabil, versi, tokoh original, dialog, tiga atau lebih lokasi bila diperlukan, sumber dan batas bukti, pernyataan, pasangan bukti–alasan, solusi, dan refleksi.
2. Jalankan `validateCase` dan tambahkan tes untuk ID/referensi/ending serta perjalanan lengkap kasus itu.
3. Definisikan prasyarat dan event reducer sesuai konflik kasus. Engine saat ini sengaja berfokus pada satu kasus; jangan sekadar mengganti nama dan menganggap kasus baru sudah didukung.
4. Tambahkan selector, validator save, key storage per kasus, dan versi konten. Tambahkan uji restore serta migrasi bila diperlukan.
5. Daftarkan route/loader dan kartu aktif hanya setelah kasus lengkap lolos pengujian. Pertahankan label Segera hadir selama belum selesai.
6. Catat sumber/lisensi aset dan minta guru meninjau materi sebelum mengklaim kesesuaian kurikulum.

## Batas versi ini

Hanya episode pertama dapat dimainkan. Narasi rekaman, profil multipemain, panel guru berakun, dan empat episode lanjutan belum diimplementasikan. Pengujian browser lokal menggunakan Chrome; browser/perangkat fisik lain belum diuji. Hasil pemeriksaan aktual dicatat di [docs/VERIFICATION.md](docs/VERIFICATION.md). Aplikasi disiapkan untuk dijalankan lokal, belum dideploy.
