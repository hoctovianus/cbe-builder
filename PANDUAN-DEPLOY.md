# Panduan Deploy — CBE Builder (Edisi AI)

Panduan ini ditulis untuk **orang non-programmer**. Semua langkah dilakukan lewat
**browser biasa** (Chrome) — tidak perlu menginstal apa pun, tidak perlu mengetik
perintah di terminal. Ikuti berurutan dari atas.

Estimasi waktu: sekitar **20–30 menit** untuk pertama kali.

---

## 1. Isi paket ini

Folder paket berisi 3 hal:

| File | Fungsi |
|---|---|
| `index.html` | Tampilan aplikasi (yang dibuka pengguna di browser). |
| `api/extract.mjs` | "Backend" — program kecil di server yang menyimpan API key dan menghubungi AI. |
| `PANDUAN-DEPLOY.md` | File panduan ini. |

> **Penting soal struktur folder:** file `extract.mjs` HARUS berada di dalam
> sub-folder bernama `api`. Jangan dipindah ke luar. Vercel mengenali folder
> `api` secara otomatis sebagai tempat backend.

---

## 2. Yang perlu disiapkan

Anda akan membuat **tiga akun** — semuanya gratis didaftarkan:

1. **Anthropic** (penyedia AI) — di sinilah satu-satunya biaya muncul, yaitu
   saldo pemakaian AI. Hosting tetap gratis.
2. **GitHub** — tempat menyimpan file aplikasi. (Anda sudah punya akun ini.)
3. **Vercel** — tempat aplikasi "tinggal" dan dijalankan. Gratis.

---

## LANGKAH 1 — Dapatkan API Key Anthropic & isi saldo

API key adalah "kunci" yang dipakai aplikasi untuk memakai AI. Berbayar sesuai
pemakaian, tetapi sangat murah (lihat bagian **Biaya** di bawah).

1. Buka **https://console.anthropic.com** lalu daftar / masuk.
2. Masuk ke menu **Billing** (Penagihan). Tambahkan saldo — mulai dari **$5**
   sudah cukup untuk banyak sekali ekstraksi.
3. Masuk ke menu **API Keys**. Klik **Create Key** (Buat Kunci).
4. Beri nama bebas, misalnya `cbe-builder`. Klik buat.
5. **Salin kunci yang muncul dan simpan baik-baik** (mis. di Notepad sementara).
   Kunci ini diawali `sk-ant-...` dan hanya ditampilkan **satu kali**.

> Jangan tutup catatan kunci ini — akan dipakai di LANGKAH 4.

---

## LANGKAH 2 — Unggah paket ke GitHub

1. Buka **https://github.com** dan masuk ke akun Anda.
2. Klik tombol **+** di kanan atas, pilih **New repository**.
3. Isi **Repository name**, misalnya `cbe-builder`.
4. Pilih **Private** (disarankan — aplikasi ini tidak perlu publik).
   Aman saja: API key TIDAK ada di dalam file, jadi tidak ada yang bocor.
5. Klik **Create repository**.
6. Di halaman repository yang baru, cari tautan **"uploading an existing file"**
   (atau tombol **Add file → Upload files**).
7. **Buka folder paket di komputer Anda**, lalu seret (drag-and-drop) **isi
   folder** ke halaman GitHub: file `index.html`, `PANDUAN-DEPLOY.md`, dan
   **folder `api`** beserta isinya.
   - Pastikan folder `api` ikut terunggah dengan `extract.mjs` di dalamnya.
8. Klik tombol hijau **Commit changes**.

Setelah ini, ketiga file Anda sudah tersimpan di GitHub.

---

## LANGKAH 3 — Hubungkan ke Vercel & deploy

1. Buka **https://vercel.com**. Klik **Sign Up** dan pilih **Continue with
   GitHub** — ini menghubungkan Vercel ke akun GitHub Anda sekaligus.
2. Setelah masuk, klik **Add New… → Project**.
3. Vercel menampilkan daftar repository GitHub Anda. Cari `cbe-builder`,
   klik **Import**.
4. Akan muncul halaman konfigurasi. Biarkan semua pengaturan apa adanya
   (Vercel mengenali ini otomatis sebagai situs statis + backend).
5. **JANGAN klik Deploy dulu.** Lanjut ke LANGKAH 4 di halaman yang sama.

---

## LANGKAH 4 — Masukkan API Key (LANGKAH PALING PENTING)

Masih di halaman konfigurasi Vercel sebelum menekan Deploy:

1. Cari bagian bernama **Environment Variables** (Variabel Lingkungan).
   Klik untuk membukanya bila terlipat.
2. Isi **dua kolom**:
   - **Key / Name** (nama): ketik persis — `ANTHROPIC_API_KEY`
     (huruf besar semua, pakai garis bawah, tanpa spasi).
   - **Value / Nilai**: tempel **API key Anthropic** Anda dari LANGKAH 1
     (yang diawali `sk-ant-...`).
3. Klik **Add** untuk menyimpannya.
4. Sekarang klik tombol **Deploy**.
5. Tunggu 1–2 menit. Bila selesai, Vercel menampilkan ucapan selamat dan
   sebuah **alamat web** untuk aplikasi Anda, contoh:
   `https://cbe-builder.vercel.app`

> **Nama harus tepat.** Bila ditulis salah (misalnya `ANTHROPIC_APIKEY` atau
> ada spasi), backend tidak akan menemukan kunci dan ekstraksi akan gagal
> dengan pesan "Server belum dikonfigurasi".

---

## LANGKAH 5 — Buka & pakai aplikasi

1. Buka alamat Vercel Anda (`https://....vercel.app`) di browser mana pun —
   laptop pribadi, laptop kantor, atau ponsel. Tidak perlu instalasi.
2. Klik **"Coba dengan data contoh"** untuk memastikan tampilan & perhitungan
   berjalan.
3. Untuk ekstraksi sungguhan: pada kotak **Quotation Vendor**, unggah file PDF
   quotation, lalu klik **"Ekstrak dengan AI"**.
4. Periksa hasil di tabel, lengkapi sel-sel **biru** (penilaian Buyer), lalu
   **Ekspor ke Excel**.

Aplikasi sekarang berfungsi penuh.

---

## Cara memperbarui aplikasi nanti

Bila suatu saat ada perbaikan pada file aplikasi:

1. Buka repository di GitHub.
2. **Add file → Upload files**, unggah file versi baru (menimpa yang lama),
   lalu **Commit changes**.
3. Vercel otomatis mendeteksi perubahan dan menerbitkan ulang dalam 1–2 menit.
   Tidak ada langkah lain.

**Mengubah API key di kemudian hari:** buka proyek di Vercel → **Settings →
Environment Variables** → ubah nilai `ANTHROPIC_API_KEY`. Setelah itu **wajib
deploy ulang** (menu **Deployments → ⋯ → Redeploy**) agar nilai baru dipakai.

---

## Biaya — apa yang gratis, apa yang berbayar

| Komponen | Biaya |
|---|---|
| Hosting di Vercel (paket Hobby) | **Gratis** — cukup untuk pemakaian pribadi. |
| Penyimpanan di GitHub | **Gratis.** |
| Pemakaian AI (API Anthropic) | **Berbayar sesuai pakai.** |

**Perkiraan biaya AI:** sekitar **Rp 2.000–7.000 per quotation** yang diekstrak,
tergantung jumlah halaman PDF. Bila aplikasi tidak dipakai, biaya **Rp 0**.
Anda hanya membayar dari saldo yang sudah diisi di akun Anthropic.

**Tips hemat:** untuk biaya lebih rendah, buka file `api/extract.mjs`, cari baris
`model: 'claude-sonnet-4-6'` dan ganti menjadi `model: 'claude-haiku-4-5-20251001'`.
Model Haiku lebih murah, dengan ketelitian sedikit di bawah Sonnet.

---

## Keamanan API key

- API key **tidak pernah ditulis di dalam file** mana pun. Ia hanya disimpan
  di Environment Variable Vercel, di sisi server.
- API key **tidak ikut terkirim ke browser** pengguna. Pengguna aplikasi tidak
  bisa melihatnya.
- Karena itu, repository GitHub boleh saja Private maupun Public — kunci tetap
  aman. (Private tetap disarankan, sekadar kerapian.)
- Jangan pernah menempelkan API key ke dalam `index.html` atau `extract.mjs`.

---

## Batasan & tips

- **Ukuran PDF:** backend membatasi sekitar **3 MB per file**. Quotation EPC bisa
  tebal karena lampiran teknis. Untuk CBE, cukup unggah **bagian komersialnya**
  saja (surat penawaran, tabel harga, term pembayaran, bond, LD, garansi).
  Datasheet teknis tidak diperlukan untuk evaluasi komersial.
- **Jumlah halaman:** API membatasi maksimum **100 halaman per PDF**; untuk
  hasil andal, usahakan **di bawah ~50 halaman**.
- **Sel biru** di tabel (Status TBE, AVL/AML, HSE, freight, loading) memang
  bukan tugas AI — itu penilaian Buyer; isi sendiri.
- Selalu **verifikasi** hasil ekstraksi AI terhadap dokumen quotation asli
  sebelum dipakai sebagai dasar keputusan.

---

## Masalah umum & solusinya

**"Server belum dikonfigurasi: ANTHROPIC_API_KEY..."**
Environment Variable belum ada atau namanya salah ketik. Ulangi LANGKAH 4,
pastikan namanya persis `ANTHROPIC_API_KEY`, lalu deploy ulang.

**"Anthropic API menolak permintaan (kode 401)"**
API key salah atau sudah dihapus. Buat key baru di console.anthropic.com dan
perbarui nilainya di Vercel, lalu deploy ulang.

**"Anthropic API menolak permintaan (kode 400)" saat PDF besar**
PDF melebihi batas halaman/ukuran. Pisahkan dan unggah bagian komersialnya saja.

**"Tidak dapat menghubungi backend"**
Aplikasi sedang dibuka dari file lokal, bukan dari alamat Vercel. Selalu buka
lewat alamat `https://....vercel.app`.

**Ekstraksi lama lalu gagal (timeout)**
PDF terlalu padat. Kurangi jumlah halaman / unggah bagian komersial saja.

---

*CBE Builder — Edisi Deploy v1.0. Paket ini adalah prototipe kerja; untuk
pemakaian skala perusahaan (banyak pengguna, audit trail, integrasi ERP/SAP)
diperlukan pengembangan lanjutan.*
