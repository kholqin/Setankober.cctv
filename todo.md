# Project TODO

- [x] Inisialisasi proyek Expo mobile Setankober.cctv
- [x] Tetapkan batas penggunaan defensif dan larangan eksploitasi
- [x] Tulis rencana desain portrait satu tangan di design.md
- [x] Buat logo aplikasi Setankober.cctv dan sinkronkan konfigurasi branding
- [x] Bangun Dashboard ringkasan jaringan dan kamera
- [x] Bangun onboarding persetujuan otorisasi
- [x] Bangun audit jaringan lokal terbatas tanpa eksploitasi
- [x] Bangun daftar perangkat dan filter hasil audit
- [x] Bangun CRUD kamera milik pengguna dengan secure storage
- [x] Bangun pengujian koneksi RTSP yang hanya memakai URL/kredensial pengguna
- [x] Bangun Live Viewer dengan status koneksi dan kontrol berhenti
- [x] Bangun Audit Log dan retensi lokal
- [x] Bangun Settings, Safety Center, Privacy, dan License screen
- [x] Tambahkan server API defensif untuk sinkronisasi opsional dan health check
- [x] Tambahkan LICENSE
- [x] Tambahkan CHANGELOG.md
- [x] Tulis README.md dan panduan instalasi APK
- [x] Tambahkan workflow GitHub Actions untuk lint, typecheck, test, dan build APK
- [x] Jalankan lint, typecheck, unit test, dan validasi bundle
- [ ] Build APK release yang dapat diunduh — menunggu akun EAS dengan izin membuat atau mengakses project
- [x] Buat repo GitHub privat Setankober.cctv
- [x] Unggah source code, dokumentasi, dan workflow ke GitHub — APK menunggu build EAS
- [ ] Simpan checkpoint akhir dan serahkan tautan repo serta APK

## Requested update — dark cyber, responsive, scanning

- [x] Redesign theme menjadi dark cyber yang terbaca dan konsisten di Android portrait, landscape, dan web preview
- [x] Perbaiki layout responsif untuk dashboard, devices, cameras, settings, dan viewer
- [x] Tambahkan pemindaian jaringan lokal berizin yang non-destruktif dan memiliki guardrail otorisasi
- [x] Tampilkan progres, perangkat ditemukan, status port terbatas, cancel, timeout, dan audit log hasil scan
- [x] Tambahkan unit test untuk validasi scope jaringan, batas concurrency, dan penolakan host publik
- [x] Jalankan verifikasi screenshot responsif dan regresi build APK

## Requested update — native GitHub APK build without EAS

- [x] Generate/configure native Android Gradle project for Expo SDK 54
- [x] Replace EAS-dependent workflow with native Gradle APK workflow
- [x] Upload debug APK as GitHub Actions artifact and optional Release asset
- [x] Document APK download and release signing prerequisites
- [ ] Run local Gradle/debug APK validation and update checkpoint — local sandbox kehabisan memori; validasi utama dilakukan di GitHub runner
