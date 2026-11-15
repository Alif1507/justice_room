# Animasi cerita Justice Room

Mengikuti desain dan batas cerita dalam JUSTICE_ROOM_SPEC.md. Implementasi langsung pada komponen yang tersedia; tanpa library animasi atau layanan baru.

- [x] Uji pemicu momen presentasi: bukti baru, pasangan keberatan, E05, restore, dan deduplikasi.
- [x] Pisahkan state animasi sementara dari progres permainan tersimpan.
- [x] Tambahkan kartu temuan, rekonstruksi E05, transisi bab, ekspresi tokoh, kamera adegan, dan perayaan capaian.
- [x] Sediakan Lewati Animasi; reduced motion aplikasi dan sistem meniadakan efek dekoratif. Tidak ada kilatan atau guncangan.
- [x] Jalankan unit, E2E, typecheck, lint, build; periksa desktop/ponsel dan dokumentasikan.

Pertimbangan: animasi tidak boleh membuka fase, mengubah nilai, memutar ulang penemuan setelah reload, mengambil fokus, atau menghalangi tombol permainan. Keberatan maksimal sekitar satu detik dan hanya terjadi setelah mengirim bukti serta alasan. Rekonstruksi tidak mengarang pelaku.


Catatan penyelesaian: state presentasi sementara terpisah dari save, dengan nomor urut untuk menolak callback lama. Lima unit test tambahan memeriksa pemicu, deduplikasi, restore, batas E05, dan skip. Review independen tidak menemukan regresi penting; tombol lewati pada animasi keberatan yang semula tersembunyi sudah diperbaiki dengan tes browser reproduksi. Preferensi gerakan sistem diamati secara langsung, bukan hanya saat mount. Tidak ada dependensi, suara, pelaku cerita, atau format save baru.
