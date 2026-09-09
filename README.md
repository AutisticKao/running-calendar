# 🏃 Kalender Lari Indonesia (Running Calendar Indonesia)

Aplikasi web modern untuk menyorot (**highlight**) jadwal dan kalender event lari di Indonesia sepanjang tahun 2026, 2025, hingga arsip lengkap 2018.

Dibangun dengan arsitektur **Vue 3 (Frontend) + Express.js (Backend Netlify Function) + PostgreSQL via Supabase + Cheerio Scraper Terjadwal 48 Jam**.

---

## 🌟 Fitur Utama

1. **Highlight Race & Live Countdown**:
   - Hitung mundur hari, jam, menit, dan detik ke event lari besar nasional berikutnya (e.g. Borobudur Marathon, Maybank Marathon, Pocari Sweat Run, dsb.).
2. **Katalog Lengkap 2018 - 2026**:
   - Menyajikan lebih dari **2.900+ event lari** terverifikasi di seluruh nusantara.
3. **Filter Interaktif & Pencarian Cepat**:
   - Pilihan Tahun: **2026**, **2025**, sampai **2018**.
   - Filter Kategori: **5K**, **10K**, **Half Marathon (21K)**, **Full Marathon (42K)**, **Trail Run**, **Ultra**.
   - Filter Bulan & Pencarian Nama Event / Kota.
   - Mode Tampilan: **Grid Kartu Visual** atau **Tabel Kompak**.
4. **Detail Race & Integrasi Kalender**:
   - Navigasi rute langsung ke **Google Maps**.
   - Tambah jadwal ke **Google Calendar** dengan 1-klik.
   - Tautan langsung ke website sumber resmi kalenderlari.com.
5. **Target Race / Wishlist**:
   - Simpan lomba impian Anda menggunakan tombol Bookmark (tersimpan rapi di browser).
6. **Validasi Anti-Duplikasi (100% Aman Data Ganda)**:
   - Menggunakan constraint PostgreSQL `UNIQUE(detail_url)` dan metode **`UPSERT`**.
7. **Otomasi Scraping Tiap 48 Jam**:
   - Dijalankan otomatis di cloud tanpa biaya menggunakan **GitHub Actions** (`.github/workflows/scrape-cron.yml`).

---

## 🚀 Panduan Menjalankan di Lokal (Local Development)

### 1. Masuk ke Direktori Proyek
```bash
cd C:\Users\User\running-calendar
# atau
cd C:\Users\User\.gemini\antigravity-ide\scratch\running-calendar
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Ekstrak Data Lari (Scraping 2018 - 2026)
Jalankan skrip harvester untuk mengambil data dari kalenderlari.com:
```bash
npm run scrape
```
> Data akan diekstrak dan disimpan ke `data/seed.json` (dan ke Supabase jika kredensial sudah diisi).

### 4. Jalankan Aplikasi
Jalankan backend server dan frontend client sekaligus dengan satu perintah:
```bash
npm run dev
```
- **Frontend Web**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Setup Database Supabase (PostgreSQL)

Aplikasi memiliki fitur **Dual-Fallback**: Anda bisa langsung mencoba web di lokal tanpa Supabase (karena otomatis membaca `data/seed.json`). Namun untuk live deployment di cloud, ikuti langkah mudah berikut:

1. Buat project baru di [Supabase Dashboard](https://supabase.com/).
2. Buka menu **SQL Editor** di dashboard Supabase.
3. Buka file `supabase/schema.sql` di proyek ini, copy seluruh kodenya, lalu paste dan klik **Run**.
4. Buka menu **Project Settings -> API** di Supabase, lalu salin:
   - `Project URL`
   - `anon` / `public` API key (atau `service_role` secret untuk scraper)
5. Salin file `.env.example` menjadi `.env`, lalu isi:
   ```env
   SUPABASE_URL=https://proyek-anda.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
   PORT=3000
   CRON_SECRET=running_secret_key_2026
   ```
6. Jalankan kembali `npm run scrape` untuk menyinkronkan seluruh 2.900+ data ke database PostgreSQL Supabase Anda.

---

## ☁️ Panduan Deploy ke Netlify (Live)

Proyek ini telah dikonfigurasi secara lengkap dan siap dideploy ke Netlify dengan 1-klik (`netlify.toml` sudah tersedia).

### Metode 1: Deploy via GitHub (Sangat Disarankan)
1. Buat repository baru di akun GitHub Anda (misal `running-calendar-indonesia`).
2. Push proyek ini ke repository GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release kalender lari indonesia"
   git branch -M main
   git remote add origin https://github.com/USERNAME/running-calendar-indonesia.git
   git push -u origin main
   ```
3. Buka [Netlify Dashboard](https://app.netlify.com/) -> **Add new site** -> **Import an existing project** -> Pilih **GitHub**.
4. Pilih repository `running-calendar-indonesia`.
5. Netlify akan otomatis mendeteksi pengaturan dari `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
6. Masukkan **Environment Variables** di Netlify (Site Configuration -> Environment variables):
   - `SUPABASE_URL` = URL Supabase Anda
   - `SUPABASE_KEY` = Public anon key Anda
   - `SUPABASE_SERVICE_ROLE_KEY` = Service role key Anda
   - `CRON_SECRET` = Password rahasia trigger cron
7. Klik **Deploy site**. Web Anda akan langsung aktif dan live!

---

## ⏰ Konfigurasi Otomasi 48 Jam (GitHub Actions)

Aplikasi sudah memiliki workflow di `.github/workflows/scrape-cron.yml` yang berjalan setiap 48 jam:
1. Di repository GitHub Anda, buka menu **Settings** -> **Secrets and variables** -> **Actions**.
2. Tambahkan dua Repository Secret:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. GitHub Actions akan secara otomatis menjalankan scraper tiap 48 jam di background tanpa perlu komputer Anda menyala, melakukan validasi anti-duplikasi, dan meng-update database Supabase Anda secara gratis!

---

## 📁 Struktur Direktori
```
running-calendar/
├── .github/workflows/scrape-cron.yml # Cron job scraping tiap 48 jam
├── data/seed.json                    # Backup data 2018-2026
├── netlify/functions/api.js          # Express wrapper untuk Netlify Function
├── scripts/scraper.js                # Harvester & anti-duplikasi logic
├── server/
│   ├── app.js                        # Express API endpoints
│   ├── local.js                      # Local dev server (port 3000)
│   └── supabase.js                   # Supabase client & fallback helper
├── src/
│   ├── assets/main.css               # Athletic theme design system
│   ├── components/                   # Vue components
│   ├── App.vue                       # Root component
│   └── main.js
├── supabase/schema.sql               # PostgreSQL schema & anti-duplikasi constraint
├── netlify.toml                      # Netlify build & rewrite config
├── package.json
└── README.md
```
