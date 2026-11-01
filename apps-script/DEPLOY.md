# Panduan Deploy Backend Google Sheets (v2)

Backend `apps-script/Code.gs` di proyek ini sudah **diperbarui** dengan skema
buku resmi Kelurahan. Perubahan ini **belum aktif** sampai Anda menempelkannya
ke Google Apps Script dan membuat versi deployment baru.

---

## Ringkasan perubahan

| Perubahan | Detail |
|:--|:--|
| Kolom Penduduk | +3 kolom di akhir: `NoUrtKeluarga`, `NamaKepalaKeluarga`, `TglKK` |
| Sheet baru | `Proyek`, `Kejadian`, `PendudukSementara`, `PerubahanPenduduk`, `Fasilitas` |
| Sheet `Pengurus` | Skema diganti ke MODEL B (13 kolom), 18 pengurus RW 16 dimuat |
| Aksi API baru | `tableList/tableSave/tableDelete/tableBulkAdd/tableClear/tableInfo`, `report` |
| Laporan | Agregat umur, agama, pendidikan, pekerjaan, per RW |

Semua perubahan **tidak menghapus** 511 baris penduduk yang sudah ada.

---

## Langkah 1 — Tempel kode baru

1. Buka Google Sheets basis data penduduk (yang URL-nya ada di `.env.local`).
2. Menu **Extensions > Apps Script**.
3. Hapus seluruh isi `Code.gs` di editor.
4. Buka `apps-script/Code.gs` dari proyek ini, **salin seluruh isinya**, tempel.
5. Simpan (Ctrl+S).

## Langkah 2 — Siapkan sheet turunan

1. Kembali ke tab Google Sheets, **reload halaman**.
2. Menu **Data Penduduk** sekarang berisi item baru.
3. Klik **"Siapkan semua sheet turunan"** → membuat 6 sheet baru dengan header benar.
4. Klik **"Migrasi ulang Pengurus (MODEL B)"** → mengganti isi sheet `Pengurus`
   dengan 18 pengurus RW 16 (RUSTAMA, MUJIANO, dst).

> Tombol nomor 4 hanya perlu sekali. **Jangan** diklik ulang setelah Anda
> menambah pengurus sendiri — akan menimpa dengan data awal.

## Langkah 3 — Kolom penduduk

Buka sheet `Penduduk`. Tiga kolom baru muncul di kanan:

- `NoUrtKeluarga`
- `NamaKepalaKeluarga`
- `TglKK`

Isinya kosong untuk 511 baris lama. Itu normal — silakan isi bertahap.

## Langkah 4 — Deploy versi baru (WAJIB)

Menyimpan di editor **tidak cukup**. Web App tetap menjalankan versi lama.

1. **Deploy > Manage deployments**.
2. Klik ikon pensil pada deployment yang aktif.
3. **Version: New version**.
4. **Deploy**.

URL `/exec` tidak berubah, jadi `.env.local` tidak perlu diubah.

## Langkah 5 — Uji

```powershell
cd "D:\PROJECT MAGANG\master-kelurahan"
npm run dev
```

Masuk sebagai `pemerintahan` / `pem123`, lalu cek:

| Menu | Yang harus terlihat |
|:--|:--|
| Data Penduduk | 511 warga + 4 kartu + 3 grafik |
| Data Pengurus RW | 3 baris (RUSTAMA, MUJIANO, LILIS) |
| Data Pengurus RT | 15 baris (RT 01–RT 05) |
| Trantibum | tabel kosong, tombol Tambah Data berfungsi |
| Penduduk Sementara | tabel kosong, siap diisi |
| Perubahan Penduduk | tabel kosong, siap diisi |
| Laporan Bulanan | tabel kelompok umur dengan angka nyata |

Coba **Tambah Data** di salah satu tabel → baris harus muncul di sheet yang sesuai.

---

## Rollback

Bila ada masalah, di **Manage deployments** pilih versi sebelumnya
(**Version: 1** atau versi lama lain) lalu Deploy. Kode lama tidak lagi
memakai 3 kolom baru, tapi **tidak merusak data** — kolom itu hanya diabaikan.

---

## Catatan keamanan

- PIN dan token tetap hanya di server Next.js (`.env.local`).
- `.env.local` tidak ikut ter-commit (sudah ada di `.gitignore`).
- Sheet berisi NIK — jangan ubah akses sheet jadi "Anyone".
