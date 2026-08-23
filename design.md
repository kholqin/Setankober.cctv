# Design Plan — Setankober.cctv

## Product direction

Setankober.cctv adalah aplikasi Android untuk **audit jaringan dan pemantauan kamera yang dimiliki atau telah diotorisasi**. Pengalaman visualnya mengikuti pola aplikasi iOS modern: hierarki tipografi jelas, kartu ringkas, kontrol satu tangan, status yang mudah dipahami, dan peringatan izin yang selalu terlihat sebelum operasi jaringan.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Dashboard | Ringkasan jaringan aktif, jumlah kamera tersimpan, status audit terakhir, tombol mulai audit berizin, dan banner keselamatan. |
| Authorized Audit | Form rentang jaringan milik pengguna, pilihan mode aman, checkbox konfirmasi otorisasi, progres audit terbatas, dan hasil perangkat yang ditemukan tanpa eksploitasi atau credential guessing. |
| Devices | Daftar perangkat hasil audit dengan IP, vendor bila tersedia, status port yang diuji, tag kamera, dan filter status. |
| Camera Detail | Nama kamera, URL RTSP milik pengguna, status koneksi, tombol uji koneksi, catatan, dan akses ke viewer. Kredensial disimpan lokal secara aman dan tidak dikirim ke server secara default. |
| Live Viewer | Pemutar stream kamera yang sudah dikonfigurasi pengguna, indikator koneksi, reconnect manual, snapshot lokal opsional, serta tombol berhenti yang selalu terlihat. |
| Audit Log | Riwayat audit lokal dengan waktu, cakupan, hasil, dan ekspor ringkas. |
| Settings & Safety | Pengaturan tema, retensi log, kunci biometrik opsional, kebijakan privasi, batasan fitur, dan informasi lisensi. |
| Onboarding / Authorization | Penjelasan singkat penggunaan yang sah, persetujuan otorisasi, dan contoh jaringan yang boleh diuji. |

## Key user flows

1. Pengguna membuka aplikasi → membaca batasan penggunaan → mengonfirmasi bahwa jaringan dan kamera adalah miliknya atau telah diberi izin → masuk ke Dashboard.
2. Pengguna menekan **Mulai audit** → memilih rentang jaringan privat milik sendiri → mengonfirmasi otorisasi → aplikasi menjalankan pemeriksaan terbatas dan non-destruktif → hasil muncul di Devices → pengguna dapat menandai perangkat sebagai kamera.
3. Pengguna menambahkan kamera → memasukkan nama dan URL RTSP yang dimiliki → menyimpan kredensial ke secure storage lokal → menekan **Uji koneksi** → jika berhasil, pengguna membuka Live Viewer.
4. Pengguna melihat riwayat → membuka detail audit → meninjau perangkat yang ditemukan → menghapus log sesuai retensi yang dipilih.

## Color choices

| Token | Color | Intended use |
|---|---|---|
| Primary | `#18C29C` | Aksi utama, status aman, accent brand. |
| Background | `#071411` | Latar gelap utama untuk nuansa security dashboard. |
| Surface | `#10231E` | Kartu dan panel elevated. |
| Foreground | `#F3FFF9` | Teks utama kontras tinggi. |
| Muted | `#9CB8AE` | Metadata dan bantuan. |
| Warning | `#F6B73C` | Peringatan otorisasi dan koneksi. |
| Error | `#FF6B6B` | Kegagalan koneksi atau validasi. |
| Info | `#67B7FF` | Status pemeriksaan dan jaringan. |

## Interaction principles

Semua layar memakai safe area, FlatList untuk daftar, tombol dengan feedback tekan dan haptic ringan, dialog konfirmasi untuk audit, serta empty states yang menjelaskan langkah berikutnya. Tidak ada tombol eksploitasi, brute force, bypass autentikasi, atau pemindaian internet publik.
