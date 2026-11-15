# Asal aset Justice Room

- `public/assets/reading-room.svg`: ilustrasi vektor original yang dibuat khusus untuk proyek ini, menggambarkan pojok baca sekolah fiktif. Tidak menggunakan foto, logo, tangkapan layar, atau aset permainan lain. Dapat dibaca langsung di sumber SVG.
- `components/ui/Character.tsx`: ilustrasi SVG original Nara, Bima, Sari, Raka, dan Bu Lila, dibuat dengan bentuk vektor di proyek ini. Ekspresi tenang, khawatir, dan penasaran mengikuti dialog. Tokoh fiktif, tanpa referensi foto anak nyata.
- Ilustrasi jadwal piket, lapangan bermain, buku misteri, pola kertas, dan dekorasi: bentuk CSS/ikon yang dirangkai khusus untuk proyek ini di `components/home.module.css` dan `components/Home.tsx`.
- Ikon antarmuka: `lucide-react` 0.562.0, lisensi ISC, disertakan sebagai dependensi lokal. Lihat `node_modules/lucide-react/LICENSE`.
- Bunyi petunjuk: nada osilator original menggunakan Web Audio API dalam `GameShell.tsx`, bukan berkas musik eksternal. Mute aktif secara default; bunyi hanya mengikuti interaksi pemain.
- Font: fallback sistem (`Trebuchet MS`, Arial, sans-serif untuk teks; Georgia/Times New Roman untuk judul). Tidak ada berkas font yang disalin atau layanan font eksternal.

Semua aset visual original merupakan aset implementasi versi ini, bukan placeholder. Tidak ada aset Ace Attorney, aset yang di-hotlink, wajah/foto asli, atau musik pihak ketiga.

- `components/game/StoryMoment.tsx`: rekonstruksi SVG original botol terguling, aliran air, dan buku berdasarkan E05. Animasi garis air, bekas basah, kartu temuan, transisi, dan penghargaan dibuat dengan CSS lokal. Tidak menggunakan video atau aset permainan lain.
- `components/ui/character.module.css`: gerak bicara, kedipan, napas ringan, dan anggukan tokoh original. Tidak memerlukan pustaka animasi atau rekaman suara tambahan.

- `components/game/CaseScene.tsx` dan `guided.module.css`: catatan peminjaman, buku basah, bingkai foto, kartu keterangan Raka, cahaya kelas dan panggung cerita dibuat khusus dalam SVG/CSS/komposisi ikon lokal. Rekonstruksi E05 digunakan di dalam panggung yang sama, bukan sebagai kartu mengambang. Tidak menambah aset pihak ketiga.
