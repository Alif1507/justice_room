# Guided story frame

Permintaan: satukan animasi, tokoh, cerita dan penjelasan seperti subtitle dalam satu frame; kurangi scrolling dan navigasi paralel. Penyelidikan satu petunjuk dulu lalu lanjut secara berurutan.

- [x] Selector fokus investigasi dan pemotongan subtitle tanpa menghilangkan isi; tes transisi berikutnya dan save lama.
- [x] Frame permainan setinggi viewport dengan panggung, subtitle dan satu aksi utama. Menu sekunder untuk bukti, pengaturan, riwayat dan tinjau ulang.
- [x] Investigasi E01 -> E02 -> E03 -> E04; musyawarah S01 -> S02 -> S03 -> S04 dengan prasyarat tetap berlaku.
- [x] Bukti/alasan dan solusi/alasan ditampilkan bertahap dalam panggung. Konsekuensi serta tiga refleksi bergantian, lalu hasil.
- [x] Rekonstruksi E05 menyatu di panggung dan tetap terlihat sepanjang penjelasan; efek singkat tidak mengambil alih subtitle.
- [x] Perbarui E2E alur terpandu, retry, reload, keyboard dan layout 360/768/1440. Jalankan unit, typecheck, lint dan build.

Pertahankan reducer, scoring unik, penyimpanan per kasus dan batas cerita. Pengaturan gerakan/suara dan bukti tetap dapat diakses. Dialog bantuan yang sengaja dibuka boleh discroll; alur utama tidak memerlukan scroll halaman pada viewport pengujian.


Selesai: frame viewport tunggal, subtitle berhalaman, satu target investigasi, musyawarah terpandu, pilihan bukti/alasan dan solusi/alasan bertahap, konsekuensi dan refleksi per pertanyaan. Save schema tetap sama; progres lama didukung. Review independen menemukan kliping opsi pada layar pendek, fokus pilihan yang belum berpindah, dan artefak encoding. Ketiganya diperbaiki; kliping serta fokus direproduksi dengan E2E gagal terlebih dahulu. Pemeriksaan akhir: 26 unit, 15 E2E, typecheck, lint dan build lulus. Visual diperiksa pada 360, 768, 1440 piksel serta 360x640. Menu bantuan/bukti tetap boleh discroll; alur utama tidak memerlukan scroll pada viewport pengujian.
