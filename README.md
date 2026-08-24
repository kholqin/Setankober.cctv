# Setankober.cctv

Setankober.cctv adalah aplikasi Android defensif untuk **audit jaringan privat dan pemantauan CCTV yang dimiliki atau telah diberi izin**. Aplikasi ini mengambil inspirasi dari dashboard keamanan pada video referensi, tetapi sengaja tidak menyediakan eksploitasi, bypass autentikasi, brute force, credential guessing, atau pemindaian internet publik.

## Fitur

| Fitur | Status |
|---|---|
| Dashboard status otorisasi dan ringkasan aset | Tersedia |
| Audit lokal berizin dan pencatatan scope | Tersedia |
| Penyimpanan kamera lokal | Tersedia |
| Validasi URL host privat | Tersedia |
| Viewer stream menggunakan expo-video | Tersedia; kompatibilitas RTSP bergantung pada device/player |
| Audit log lokal | Tersedia |
| Safety Center dan privacy notice | Tersedia |
| Sinkronisasi cloud | Tidak aktif secara default |

## Batas keamanan

Aplikasi ini hanya boleh digunakan pada jaringan, perangkat, dan kamera yang Anda miliki atau telah diberi otorisasi tertulis. URL yang disimpan divalidasi agar mengarah ke host privat. Jangan memasukkan alamat kamera pihak lain, jangan mencoba kredensial default, dan jangan menggunakan aplikasi untuk mengakses, meretas, mengganggu, atau merugikan pihak lain.

> Tampilan port atau RTSP handshake bukan bukti bahwa akses kamera sah atau berhasil. Selalu verifikasi kepemilikan dan izin secara terpisah.

## Menjalankan proyek

```bash
pnpm install
pnpm check
pnpm lint
pnpm test
pnpm dev:metro
```

## Build APK

Build APK sekarang memakai **native Gradle langsung di GitHub Actions tanpa EAS**. Jalankan workflow **Android APK (Native Gradle)** dari tab Actions. Setelah selesai, buka halaman workflow run dan unduh artifact `Setankober-cctv-debug-apk`. Jika Anda membuat tag `v1.0.1`, workflow juga mengunggah APK sebagai asset pada GitHub Release. APK debug cocok untuk pengujian perangkat; release production memerlukan signing keystore yang disimpan sebagai GitHub Secrets. Build lokal dapat dicoba dengan `cd android && ./gradlew assembleDebug`, tetapi runner GitHub direkomendasikan karena membutuhkan memori lebih besar.

## Struktur singkat

`app/(tabs)/index.tsx` berisi dashboard, `app/(tabs)/cameras.tsx` mengelola kamera yang ditambahkan pengguna, `app/camera-viewer.tsx` menampilkan viewer, sedangkan `lib/cctv-context.tsx` mengelola state dan penyimpanan lokal.

## Lisensi

Kode dirilis di bawah MIT License. Penggunaan aplikasi tetap tunduk pada hukum, privasi, dan kebijakan pemilik jaringan atau perangkat.

## Kontribusi

Pull request harus menyertakan pengujian yang relevan, tidak menambahkan kapabilitas eksploitasi, dan menjelaskan dampak privasi atau keamanan. Fitur jaringan baru harus bersifat non-destruktif, terbatas pada aset berizin, dan memiliki guardrail yang dapat diaudit.

## Release signing melalui GitHub Secrets

Workflow debug tidak membutuhkan signing secret. Untuk APK release, siapkan keystore PKCS12 di komputer pengelola dan tambahkan empat repository secrets berikut melalui **Settings → Secrets and variables → Actions**: `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, dan `ANDROID_KEY_PASSWORD`. Jangan commit file keystore atau mencetak password ke log.

Contoh pembuatan keystore lokal:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore \
  -alias setankober_release -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 release.keystore
```

Masukkan output base64 sebagai `ANDROID_KEYSTORE_B64`. Gunakan password dan alias yang sama pada tiga secret lainnya. Setelah secret tersedia, buat tag `v1.0.1`; workflow akan membangun `app-release.apk` yang signed, mengunggah artifact, dan menerbitkannya sebagai GitHub Release asset. Token integrasi saat ini tidak memiliki permission `Actions secrets: write`, sehingga secret release harus ditambahkan oleh pemilik repository dari halaman Settings GitHub.
