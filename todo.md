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

- [x] Audit perubahan lokal, workflow Android, dan konfigurasi artifact APK
- [x] Commit dan push seluruh perubahan terbaru ke repository GitHub publik
- [x] Jalankan workflow native Gradle dan pastikan debug APK terunggah sebagai artifact
- [x] Verifikasi tautan halaman Actions/run dan instruksi unduh APK
- [x] Simpan checkpoint final dan laporkan status build
- [x] Publikasikan debug APK sebagai asset rolling GitHub Release agar dapat diunduh langsung sebagai file .apk

## Requested update — checksum, version tag, dan changelog release

- [x] Audit workflow signing, release asset, dan status GitHub Secrets — daftar secret ditolak API integrasi; log run mengonfirmasi secret kosong
- [x] Tambahkan SHA-256 checksum untuk debug dan signed release APK
- [x] Tambahkan changelog otomatis dari commit/tag ke GitHub Release melalui generate_release_notes
- [x] Commit perubahan pipeline dan buat tag v1.0.0
- [x] Jalankan serta verifikasi release signed atau laporkan prasyarat secret yang belum tersedia — run v1.0.0 berhenti pada Prepare release signing karena secret belum diisi
- [x] Simpan checkpoint final dan laporkan tautan release/checksum

## Requested update — isi signing secrets dan signed APK v1.0.0

- [x] Sediakan input aman untuk ANDROID_KEYSTORE_B64, ANDROID_KEYSTORE_PASSWORD, ANDROID_KEY_ALIAS, dan ANDROID_KEY_PASSWORD — dibatalkan atas permintaan pengguna
- [x] Konfigurasikan empat secrets pada pipeline release GitHub tanpa mengekspos nilainya — tidak dilakukan karena signing tidak digunakan
- [x] Re-run workflow tag v1.0.0 setelah secrets tersedia — diganti dengan re-run unsigned tanpa secrets
- [x] Unduh signed APK dan file checksum dari release/artifact — signed APK tidak dibuat; diganti APK unsigned
- [x] Jalankan sha256sum -c terhadap signed APK dan laporkan hasilnya — checksum APK unsigned terverifikasi OK
- [x] Simpan checkpoint final

## Requested update — rilis unsigned tanpa signing

- [x] Lewati konfigurasi signing pada workflow tag dan gunakan APK debug/unsigned
- [x] Publikasikan APK unsigned v1.0.0 beserta checksum dan changelog otomatis
- [x] Verifikasi unduhan dan checksum APK unsigned
- [x] Simpan checkpoint final

## Reported bug — APK debug tidak merespons saat dibuka

- [x] Audit root layout, provider, konfigurasi Android, dan modul yang diinisialisasi saat startup
- [x] Reproduksi atau isolasi crash/ANR dari bundle dan log build — indikasi utama: APK debug sebelumnya masih menunggu Metro/dev server
- [x] Terapkan perbaikan startup yang aman tanpa mengurangi guardrail aplikasi
- [x] Tambahkan validasi regresi startup dan build APK baru
- [x] Verifikasi artifact/checksum dan laporkan instruksi instalasi ulang — `app-debug.apk: OK`

## Reported bug — audit full-stack dan debug APK baru

- [x] Audit startup Android, root layout, provider, storage, dan native configuration
- [x] Audit dashboard, polling GitHub, scanner lokal, kamera, dan viewer
- [x] Audit server/API, konfigurasi environment, dan error handling
- [x] Jalankan typecheck, lint, unit test, bundle validation, dan pemeriksaan workflow
- [x] Perbaiki semua bug yang ditemukan dan tambahkan regresi test
- [x] Build debug APK baru melalui GitHub Actions tanpa signing secrets
- [x] Verifikasi artifact, checksum, dan jalur instalasi APK baru
- [x] Simpan checkpoint final dan laporkan hasil audit

## Requested update — alert gagal memuat data

- [ ] Petakan sumber data dan kategori error yang perlu ditampilkan
- [ ] Buat komponen alert dark cyber dengan severity, pesan, dan tombol retry
- [ ] Integrasikan alert ke polling build, storage, scanner, kamera, dan perangkat
- [ ] Tambahkan state offline/data kosong tanpa pesan error yang menyesatkan
- [ ] Tambahkan test dan validasi visual/responsif
- [ ] Simpan checkpoint dan laporkan perubahan
