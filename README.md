# 🦁 SakuPelajar - Aplikasi Keuangan Pintar untuk Pelajar

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**SakuPelajar** adalah aplikasi manajemen keuangan modern yang dirancang khusus untuk pelajar dan mahasiswa Gen Z. Tidak hanya mencatat pengeluaran, aplikasi ini mengubah kebiasaan menabung menjadi permainan yang seru (Gamification) dan membantu analisis keuangan yang lebih cerdas menggunakan AI dan metode _Kakeibo_.

---

## ✨ Fitur Unggulan

### 1. 🎮 Gamification Finance (Level Up Your Money)
Ubah kegiatan mencatat keuangan menjadi RPG yang seru!
-   **XP & Level System**: Setiap kali mencatat transaksi atau menabung, kamu dapat XP. Naikkan level dari *Warga Biasa* hingga jadi *Sultan*!
-   **Avatar Shop**: Tukarkan XP yang kamu kumpulkan dengan Avatar keren (Lion, Robot, Ninja, dll) untuk pamer di Leaderboard.
-   **Daily Streaks**: Login setiap hari dan jaga api semangat membaramu untuk bonus XP.
-   **Badges & Achievements**: Buka piala pencapaian seperti "Hemat Pangkal Kaya" atau "Raja Jajan".

### 2. 🤖 AI Receipt Scanner
Malas ketik manual? Foto saja struk belanjamu!
-   Menggunakan teknologi **OCR (Optical Character Recognition)** canggih.
-   Otomatis mendeteksi total belanja dan tanggal transaksi.
-   Langsung masuk ke pencatatan tanpa ribet.

### 3. 🇯🇵 Metode Kakeibo & Weekly Wrapped
Belajar menabung ala orang Jepang yang terbukti ampuh.
-   **4 Pilar Kakeibo**: Kategorikan pengeluaranmu ke *Survival* (Butuh), *Optional* (Ingin), *Culture* (Belajar), dan *Extra* (Dadakan).
-   **Weekly Wrapped**: Dapatkan laporan mingguan ala "Spotify Wrapped" yang menganalisis gaya belanjamu (Hemat/Boros) dengan animasi yang memukau.
-   **Smart Advisor**: AI yang memberikan saran finansial harian berdasarkan sisa uang sakumu.

### 4. 🎯 Wishlist & Savings Goal
Punya impian beli HP baru atau Sepatu?
-   Buat target tabungan (Wishlist).
-   Sistem akan menghitung berapa yang harus kamu tabung setiap hari agar impianmu tercapai tepat waktu.
-   Visualisasi progress bar yang memotivasi.

### 5. ✉️ Amplop Budget
Kontrol pengeluaranmu anti boncos.
-   Atur limit harian atau bulanan untuk kategori tertentu (misal: Jajan Max 20rb/hari).
-   Sistem akan memperingatkan jika kamu hampir melebihi batas.
-   Reset otomatis setiap periode pilihanmu (Harian/Bulanan).

### 6. 📊 Analisis Mendalam
-   **Spending DNA**: Grafik unik yang menunjukkan pola perilaku keuanganmu.
-   **Debt Manager**: Catat utang teman atau utangmu sendiri biar tidak lupa bayar.
-   **Laporan PDF**: Download laporan keuangan bulanan untuk bukti ke orang tua.

---

## 🛠️ Tech Stack (Teknologi yang Digunakan)

Aplikasi ini dibangun menggunakan teknologi web modern terkini untuk performa maksimal dan tampilan yang _smooth_.

-   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (dengan custom glassmorphism design)
-   **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Animation**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://github.com/catdad/canvas-confetti)
-   **AI/OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/)
-   **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Cara Install & Menjalankan (Localhost)

Ikuti langkah ini untuk menjalankan project di komputer kamu:

### 1. Clone Repository
```bash
git clone https://github.com/Stevyussz/sakupelajar.git
cd sakupelajar/saku-pelajar
```
*(Catatan: Source code aplikasi ada di folder `saku-pelajar`)*

### 2. Install Dependencies
Pastikan kamu sudah menginstall **Node.js** (versi 18+ direkomendasikan).
```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment Variable
Buat file `.env.local` di dalam folder `saku-pelajar` dan isi dengan konfigurasi database kamu:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sakuPelajar
NEXTAUTH_SECRET=rahasia_banget_jangan_disebar
NEXTAUTH_URL=http://localhost:3000
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser dan kunjungi `http://localhost:3000`. 🎉

---

## 📂 Struktur Folder

```
saku-pelajar/
├── src/
│   ├── app/              # Halaman Website (Next.js App Router)
│   │   ├── (auth)/       # Halaman Login/Register (Layout khusus)
│   │   ├── api/          # Backend API Routes
│   │   ├── budget/       # Fitur Budget
│   │   ├── kakeibo/      # Fitur Kakeibo Wrapped
│   │   ├── quest/        # Fitur Quest & Shop
│   │   └── ...
│   ├── components/       # Komponen UI Reusable
│   │   ├── Dashboard/    # Widget Dashboard
│   │   ├── Gamification/ # Level, Badge, Shop
│   │   ├── UI/           # Modal, Card, Button cantik
│   │   └── ...
│   ├── lib/              # Konfigurasi DB & Helper Functions
│   └── models/           # Schema Database (User, Transaction, etc)
└── public/               # Aset Gambar & Icon
```

---

## 🤝 Kontribusi

Project ini dibuat dengan ❤️ oleh **Stevyuss**.
Jika kamu menemukan bug atau punya ide fitur baru, silakan buat *Issue* atau *Pull Request* di repository ini.

**Happy Coding & Saving! 💰**
