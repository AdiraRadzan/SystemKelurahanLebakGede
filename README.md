# Sistem Aplikasi Satu Data Kelurahan Lebakgede (Kota Bandung)

Prototype aplikasi web kedinasan untuk kerja praktek dan demo ke pihak Kelurahan Lebakgede, Kecamatan Coblong, Kota Bandung. Dibangun menggunakan Next.js App Router, TypeScript, dan Tailwind CSS dengan prinsip desain yang ramah, sederhana, kontras tinggi, dan mudah dipahami oleh aparatur kelurahan.

---

## 1. Daftar Akun Demo (Untuk Presentasi)

Pada halaman masuk (`/login`), tersedia tombol cepat **"Akun Demo (Untuk Presentasi)"** yang dapat diklik untuk mengisi nama pengguna dan kata sandi secara otomatis.

| No | Nama Pengguna | Kata Sandi | Nama Pejabat / Staf | Peran Kedinasan | Wilayah / Hak Akses |
|:--:|:--------------|:-----------|:--------------------|:----------------|:--------------------|
| 1 | `lurah` | `lurah123` | Bapak Lurah | Lurah | Pengawasan, Persetujuan, Disposisi & Laporan Ringkas |
| 2 | `sekel` | `sekel123` | Ibu Sekretaris | Sekretaris Kelurahan | Perencanaan, Tata Usaha Persuratan, Kepegawaian & BMD |
| 3 | `pemerintahan`| `pem123` | Bapak Kasi Pemerintahan | Sie Pemerintahan | Adminduk, Pencatatan Sipil, Pertanahan, Trantibum, RW/RT |
| 4 | `ekbang` | `ekbang123`| Bapak Kasi Ekbang | Sie Ekonomi & Pembangunan | Musrenbang, Sarpras Fisik, Infrastruktur, UMKM, Kebersihan |
| 5 | `kesos` | `kesos123` | Ibu Kasi Kesos | Sie Kesejahteraan Sosial | PSKS, Posyandu, Karang Taruna, PKK, Balita, Baduta, Lansia |

---

## 2. Cara Menjalankan Aplikasi

Pastikan Node.js (v18 ke atas) telah terpasang di komputer Anda.

```bash
# 1. Pindah ke direktori proyek
cd c:\Code\Typescript\Prototype\system-kelurahan

# 2. Instal seluruh dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan
npm run dev
```

Buka peramban (browser) dan akses: **`http://localhost:3000`**

Untuk menguji build versi produksi:
```bash
npm run build
npm start
```

---

## 3. Skenario & Alur Demo Utama

### Skenario A: Alur Pengajuan dan Persetujuan (Workflow Rencana Giat)
1. Buka halaman login dan klik akun **Sekretaris Kelurahan** (`sekel` / `sekel123`).
2. Pada sidebar, buka menu **Rencana Giat** (tersedia opsi tampilan *Tabel* dan *Kalender*).
3. Klik tombol biru **"+ Tambah Data"** di kanan atas, isi formulir kegiatan, lalu klik **"Simpan Data"**.
4. Klik tombol **"Lihat"** pada baris kegiatan baru tersebut, lalu klik tombol **"Ajukan ke Lurah"**. Status berubah menjadi `Diajukan`.
5. Keluar dari akun melalui menu avatar di pojok kanan atas -> pilih **"Keluar"**.
6. Masuk dengan akun **Lurah** (`lurah` / `lurah123`).
7. Pada Beranda Lurah (atau menu **"Persetujuan"**), usulan kegiatan tersebut langsung muncul pada daftar **"Menunggu Persetujuan Anda"**.
8. Ketikkan catatan arahan singkat (opsional) lalu klik tombol hijau **"Setujui"**.
9. Keluar dan masuk kembali sebagai Sekretaris -> status kegiatan kini telah resmi berubah menjadi hijau: **`Disetujui`**.

### Skenario B: Alur Disposisi Surat Masuk
1. Masuk sebagai **Sekretaris Kelurahan** (`sekel`), buka **"Administrasi Surat Masuk"**. Klik **"+ Tambah Data"** untuk mencatat surat dinas masuk baru.
2. Keluar dan masuk sebagai **Lurah** (`lurah`), buka menu **"Disposisi Surat"**.
3. Klik tombol **"Beri Disposisi"** pada surat yang belum didisposisikan.
4. Pilih seksi tujuan (contoh: **Sie Pemerintahan**), ketikkan instruksi pimpinan, lalu klik **"Kirim Disposisi"**.
5. Keluar dan masuk sebagai **Sie Pemerintahan** (`pemerintahan`).
6. Pada Beranda Sie Pemerintahan, surat tersebut **langsung tampil pada kartu khusus disposisi masuk dari Lurah** lengkap dengan nomor surat dan arahan pimpinan.

### Skenario C: Perlindungan Hak Akses Antar-Peran
1. Masuk sebagai staf bidang (misal: `kesos`).
2. Coba ubah URL secara manual ke modul peran lain (misal: `http://localhost:3000/lurah/beranda` atau `http://localhost:3000/sekel/surat-masuk`).
3. Sistem secara otomatis menolak akses dan mengarahkan ke halaman ramah **"Akses Ditolak"** dengan tombol untuk kembali ke beranda tugas milik pengguna.

---

## 4. Fitur-Fitur Unggulan

- **Desain Khusus Aparatur Usia 40–55 Tahun**:
  - Palet warna resmi biru tua kedinasan (`#1E3A8A`) dengan kontras tinggi.
  - Font Inter ukuran dasar 16px, tabel 15px, serta tinggi area sentuh tombol minimal 44px (`min-h-[44px]`).
  - Maksimal 1 tombol utama berwarna solid per halaman.
  - Status menggunakan kombinasi warna, teks Bahasa Indonesia, dan ikon (`StatusBadge`).
- **Pencarian, Filter, & Unduh Excel**:
  - Seluruh tabel dilengkapi pencarian instan dan filter status.
  - Tombol **"Unduh Excel"** mengekspor data ke file format CSV yang dapat dibuka langsung di Microsoft Excel.
- **Tampilan Kalender Bulanan**:
  - Modul *Rencana Giat* memiliki fitur toggle *Tabel* dan *Kalender* bulanan dengan penanda agenda interaktif.
- **Penyimpanan Lokal (localStorage Persistence)**:
  - Penambahan, pengubahan, persetujuan, dan penghapusan data tersimpan di peramban sehingga tidak hilang saat halaman di-refresh.
- **Bantuan & Panduan Terpadu**:
  - Tombol **Bantuan** di bagian bawah sidebar menyediakan panduan langkah 1-2-3 serta kontak teknis sekretariat.
  - Tur pengenalan otomatis bagi pengguna yang baru pertama kali masuk.

---

## 5. Integrasi Data Penduduk (Google Sheets)

Menu **Data Penduduk** (peran `pemerintahan`, `lurah`, `sekel`) menampilkan data
warga per jiwa langsung dari **Google Sheets**, memakai backend Google Apps Script
milik proyek dashboard penduduk.

### Arsitektur

```
Browser  →  Next.js /api/penduduk  →  Google Apps Script  →  Google Sheets
           (sesi cookie login)        (PIN + token, server)
```

PIN dan token Apps Script **hanya** berada di sisi server (variabel lingkungan).
Browser tidak pernah menerimanya.

### Langkah menyambungkan

1. Deploy backend `dashboard-penduduk/apps-script/Code.gs` sebagai Web App
   (Extensions > Apps Script, lalu Deploy > New deployment > Web app,
   Execute as: **Me**, Who has access: **Anyone**). Salin URL yang diakhiri `/exec`.
2. Di Google Sheets, atur PIN admin lewat menu **Data Penduduk > Atur / ganti PIN admin…**.
3. Isi `.env.local` (salin dari `.env.example`):
   ```env
   PENDUDUK_API_URL=https://script.google.com/macros/s/XXXX/exec
   PENDUDUK_PIN=pin_rahasia_anda
   ```
4. Jalankan ulang `npm run dev`.

Bila belum diisi, halaman menampilkan pesan bahwa basis data belum tersambung —
aplikasi tetap berjalan normal untuk modul lain.

### Berkas terkait

| Berkas | Peran |
|:--|:--|
| `lib/sheets.ts` | Klien sisi server ke Apps Script (login otomatis + CRUD) |
| `lib/penduduk-api.ts` | Pembungkus fetch sisi browser ke `/api/penduduk` |
| `app/api/penduduk/route.ts` | Route handler internal (wajib sesi login) |
| `components/penduduk/penduduk-view.tsx` | Halaman Data Penduduk (statistik, filter, tabel, CRUD) |
| `components/penduduk/penduduk-form-modal.tsx` | Formulir tambah/ubah data warga |
| `app/(dashboard)/[role]/data-penduduk/page.tsx` | Route `/pemerintahan/data-penduduk` |

> Skema kolom mengikuti `HEADERS_PENDUDUK` di `Code.gs`: `NIK, Nama, RT, RW,
> JenisKelamin, TempatLahir, TanggalLahir, StatusPerkawinan, Agama, Pendidikan,
> Pekerjaan, KedudukanKeluarga, GolonganDarah, Kewarganegaraan, Alamat,
> NamaAyah, NamaIbu, NoKK, Suku, TglKawin, CatatanImpor` — ditambah kolom v2
> `NoUrtKeluarga, NamaKepalaKeluarga, TglKK`.

### Modul lain yang kini bersumber Google Sheets

| Modul | Sheet | Skema acuan |
|:--|:--|:--|
| Data Pengurus RW / RT | `Pengurus` | MODEL B — Buku Data Pengurus RW-RT-Linmas |
| Administrasi Ketentraman (Trantibum) | `Kejadian` | MODEL D — Buku Kejadian |
| Pekerjaan Infrastruktur | `Proyek` | MODEL C — Buku Daftar Proyek |
| Fasilitasi Sarpras | `Fasilitas` | Fasum / Fasos / RTH |
| Penduduk Sementara / Musiman | `PendudukSementara` | MODEL A.2 |
| Buku Perubahan Penduduk (LAMPID) | `PerubahanPenduduk` | MODEL A.3 |
| Laporan Bulanan Penduduk | `Penduduk` (agregat) | Lembar UMUR / AGAMA / PDMP |

Modul di atas memakai `components/tabel/tabel-view.tsx` (CRUD generik) dan
`components/laporan/laporan-view.tsx` (laporan agregat). Pemetaan slug → tabel
ada di `app/(dashboard)/[role]/[module]/page.tsx`.

### Menambah/mengubah skema sheet

1. Ubah `TABLE_DEFS` di `apps-script/Code.gs` (nama sheet + daftar header).
2. Tempel ulang ke Apps Script, lalu **Deploy > Manage deployments > New version**.
3. Sesuaikan `columns` + `fields` modul di `config/modules/index.ts`.

Panduan lengkap: `apps-script/DEPLOY.md`.

### Wilayah

Kelurahan Lebakgede terdiri atas **16 RW** (RW 01–RW 16). Wilayah **Sekeloa**
berada di RW 16. Daftar RW/RT ada di `config/modules/index.ts`
(`RW_OPTIONS`, `RT_OPTIONS`).
