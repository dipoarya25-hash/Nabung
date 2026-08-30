# Cara Pasang PWA — Kas Jajan

Struktur folder project Vite kamu (setelah `npm create vite@latest`) harus jadi begini:

```
kas-jajan/
├── public/
│   ├── manifest.json      ← taruh di sini
│   ├── sw.js               ← taruh di sini
│   └── icons/
│       ├── icon-192.png    ← taruh di sini
│       └── icon-512.png    ← taruh di sini
├── index.html               ← ganti dengan yang ini (atau tambahkan bagian <head> & script-nya)
└── src/
    └── App.jsx              ← file kas-jajan-2-1.jsx (sudah pakai localStorage)
```

## Langkah-langkah

1. Semua file di folder `public/` **tidak diproses** Vite — dicopy apa adanya ke hasil build, jadi path-nya (`/manifest.json`, `/icons/icon-192.png`, dst) langsung bisa diakses.
2. Ganti isi `index.html` di root project dengan file `index.html` ini (sesuaikan path script `src="/src/main.jsx"` kalau nama file entry-mu beda).
3. Build project:
   ```bash
   npm run build
   ```
4. Deploy folder `dist/` ke Vercel/Netlify (harus HTTPS, wajib untuk PWA & service worker).
5. Masukkan URL hasil deploy ke [pwabuilder.com](https://www.pwabuilder.com) → generate APK Android.

## Catatan
- Ikon `icon-192.png` dan `icon-512.png` yang saya buatkan pakai logo "K" senada dengan navbar app. Kalau mau ganti desain ikon, tinggal replace file PNG-nya (ukuran tetap 192x192 dan 512x512).
- `sw.js` di sini cuma service worker minimal (cache dasar) — cukup untuk syarat PWABuilder, tidak bikin app kamu offline-first sepenuhnya. Kalau transaksi kamu tetap tersimpan offline karena pakai `localStorage`, bukan dari service worker ini.
