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

Build release direkomendasikan melalui GitHub Actions dengan EAS Build. Tambahkan secret repository `EXPO_TOKEN` dari akun Expo yang memiliki izin membuat atau mengakses project EAS, tautkan project dengan `pnpm dlx eas-cli@latest init --account <akun-anda>`, lalu jalankan workflow **Android APK** dari tab Actions. Workflow akan menghasilkan artifact APK yang dapat diunduh dari halaman run. Token yang tersedia saat pengembangan ini berhasil diautentikasi, tetapi akun team yang terhubung hanya memiliki role Viewer sehingga project EAS baru belum dapat dibuat otomatis. Untuk build lokal pengembangan, jalankan `pnpm android` dengan emulator atau perangkat Android yang terhubung.

## Struktur singkat

`app/(tabs)/index.tsx` berisi dashboard, `app/(tabs)/cameras.tsx` mengelola kamera yang ditambahkan pengguna, `app/camera-viewer.tsx` menampilkan viewer, sedangkan `lib/cctv-context.tsx` mengelola state dan penyimpanan lokal.

## Lisensi

Kode dirilis di bawah MIT License. Penggunaan aplikasi tetap tunduk pada hukum, privasi, dan kebijakan pemilik jaringan atau perangkat.

## Kontribusi

Pull request harus menyertakan pengujian yang relevan, tidak menambahkan kapabilitas eksploitasi, dan menjelaskan dampak privasi atau keamanan. Fitur jaringan baru harus bersifat non-destruktif, terbatas pada aset berizin, dan memiliki guardrail yang dapat diaudit.
