# Changelog

Semua perubahan penting pada proyek ini dicatat di file ini.

## [1.0.0] — 2026-08-24

### Added

Dashboard keamanan dengan indikator otorisasi, ringkasan kamera, ringkasan audit, dan quick actions. Ditambahkan alur audit lokal yang bersifat non-destruktif serta pencatatan scope dan waktu audit. Ditambahkan penyimpanan kamera lokal dengan validasi host privat, daftar perangkat, penghapusan kamera, dan viewer berbasis `expo-video`.

Ditambahkan Safety Center, privacy notice, MIT License, README, dan workflow GitHub Actions untuk typecheck, lint, test, serta build APK melalui EAS.

### Security

Tidak ada brute force, credential guessing, bypass autentikasi, pemindaian internet publik, eksploitasi, atau pengumpulan kredensial. URL kamera dan metadata disimpan lokal secara default.

### Known limitations

Dukungan RTSP bergantung pada codec dan kemampuan native player pada perangkat Android. Jika RTSP tidak dapat diputar di perangkat tertentu, gunakan player RTSP eksternal tepercaya pada jaringan yang sama atau integrasikan native module resmi pada rilis berikutnya.
