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
- [x] Simpan checkpoint akhir dan serahkan tautan repo serta APK — checkpoint proyek dibuat setelah pembaruan polling

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

## Requested update — audit and professional hardening

- [x] Audit GitHub Actions terbaru, status artifact APK, dan error lokal
- [x] Tambahkan health/status panel untuk build dan perangkat
- [x] Tambahkan export audit log yang aman dan dapat dibagikan tanpa kredensial
- [x] Tambahkan filter, severity, dan detail hasil scan yang lebih profesional
- [x] Tambahkan error boundary, empty/loading states, dan retry yang jelas
- [x] Perbarui README, CHANGELOG, dan workflow bila diperlukan
- [x] Jalankan seluruh validasi dan commit/push perubahan ke GitHub

## Requested update — build status polling and retry

- [x] Tambahkan kontrak pembacaan status workflow GitHub Actions publik melalui helper aplikasi
- [x] Tambahkan polling terkontrol dengan interval, backoff, batas percobaan, dan cleanup saat unmount
- [x] Tambahkan kartu Dashboard build status dengan state queued, in progress, success, failure, cancelled, dan unknown
- [x] Tambahkan tombol refresh manual dan retry yang tidak memicu build baru
- [x] Tambahkan test untuk normalisasi status, backoff, polling stop condition, dan error handling
- [x] Jalankan typecheck, lint, test, screenshot, commit, push, dan checkpoint

## Requested update — public repository for build polling

- [x] Audit working tree dan riwayat untuk token/password/keystore sebelum repo dipublikasi
- [x] Ubah repository GitHub menjadi publik atas permintaan pengguna dan verifikasi metadata
- [x] Lepaskan ketergantungan token dari status polling dengan GitHub API publik
- [x] Implementasikan polling build dan retry interaktif di Dashboard
- [x] Jalankan validasi, commit, push, dan checkpoint

## Requested update — reliable APK pipeline and release signing

- [x] Audit log kegagalan Gradle terbaru dan perbaiki penyebab build/cancel
- [x] Tambahkan tombol membuka halaman run GitHub dari Build Monitor
- [x] Tambahkan jalur release signing berbasis GitHub Secrets tanpa menyimpan keystore di repo — workflow siap; secrets belum dapat dibuat oleh token integrasi
- [x] Validasi debug APK, release workflow, test, commit, push, dan checkpoint — debug workflow berhasil; release menunggu secrets

## Requested update — cyber polling loading animation

- [x] Tambahkan indikator loading cyber dark saat status build diperiksa atau aktif dipolling
- [x] Hentikan animasi otomatis saat status build selesai, gagal, dibatalkan, atau layar ditutup
- [x] Tambahkan test perilaku state loading dan verifikasi visual responsif
- [x] Commit, push, dan checkpoint perubahan

## Requested update — workflow build progress percentage

- [x] Perluas helper GitHub Actions untuk mengambil job dan langkah workflow terbaru
- [x] Hitung persentase progres dari langkah completed/in progress secara bounded dan deterministik
- [x] Tampilkan progress bar, persentase, langkah aktif, serta completed/total pada Build Monitor
- [x] Tambahkan test untuk progres kosong, queued, aktif, sukses, gagal, dan dibatalkan
- [x] Validasi responsif, commit, push, dan checkpoint

## Requested update — job detail bottom sheet

- [x] Perluas model status dengan daftar job, langkah, status, dan ringkasan log aman
- [x] Tambahkan modal/bottom sheet detail yang bisa dibuka dari Build Monitor
- [x] Tampilkan job aktif, langkah selesai, langkah pending, dan error ringkas tanpa secret
- [x] Tambahkan test normalisasi detail job serta empty/loading/error state
- [x] Validasi responsif, commit, push, dan checkpoint

## Requested update — commit semua dan APK unduh dari GitHub

- [ ] Audit perubahan lokal, workflow Android, dan konfigurasi artifact APK
- [ ] Commit dan push seluruh perubahan terbaru ke repository GitHub publik
- [ ] Jalankan workflow native Gradle dan pastikan debug APK terunggah sebagai artifact
- [ ] Verifikasi tautan halaman Actions/run dan instruksi unduh APK
- [ ] Simpan checkpoint final dan laporkan status build
- [ ] Publikasikan debug APK sebagai asset rolling GitHub Release agar dapat diunduh langsung sebagai file .apk
