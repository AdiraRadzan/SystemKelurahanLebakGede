// ============================================================================
// Tipe tabel turunan (skema buku resmi Kelurahan)
// ============================================================================
// Setiap tabel punya `ID` (UUID, dibuat backend) + kolom sesuai buku model.
// Nama kunci HARUS sama dengan header di `apps-script/Code.gs` (TABLE_DEFS).

export interface BaseRow {
  ID?: string;
  [key: string]: string | number | undefined;
}

/** MODEL B — Buku Data Pengurus RW/RT/Anggota Linmas */
export interface PengurusModelB extends BaseRow {
  Wilayah?: string;
  Nama?: string;
  JenisKelamin?: string;
  TempatTglLahir?: string;
  Status?: string;
  Agama?: string;
  Pendidikan?: string;
  Pekerjaan?: string;
  Alamat?: string;
  Jabatan?: string;
  MasaBakti?: string;
  Foto?: string;
}

/** MODEL C — Buku Daftar Proyek */
export interface Proyek extends BaseRow {
  No?: string | number;
  Tahun?: string;
  Rt?: string;
  NamaProyek?: string;
  Lokasi?: string;
  Ukuran?: string;
  SifatProyek?: string;
  SumberBiaya?: string;
  JumlahBiaya?: string | number;
  Keterangan?: string;
}

/** MODEL D — Buku Kejadian */
export interface Kejadian extends BaseRow {
  No?: string | number;
  Hari?: string;
  Tanggal?: string;
  Jam?: string;
  Jalan?: string;
  Rt?: string;
  JenisKejadian?: string;
  AsalKejadian?: string;
  KorbanJiwa?: string;
  KorbanKekayaan?: string;
  UpayaPenanggulangan?: string;
}

/** MODEL A.2 — Penduduk Sementara / Musiman */
export interface PendudukSementara extends BaseRow {
  No?: string | number;
  Nama?: string;
  JenisKelamin?: string;
  TempatTglLahir?: string;
  Status?: string;
  Agama?: string;
  Pendidikan?: string;
  Pekerjaan?: string;
  KedudukanKeluarga?: string;
  AlamatAsalDalamKota?: string;
  AlamatAsalLuarKotaJabar?: string;
  AlamatAsalLuarJabar?: string;
  AlamatTujuan?: string;
  TglMulaiTinggal?: string;
  Dokumentasi?: string;
  MaksudTujuan?: string;
}

/** MODEL A.3 — Buku Perubahan Penduduk (LAMPID) */
export interface PerubahanPenduduk extends BaseRow {
  No?: string | number;
  Nama?: string;
  JenisKelamin?: string;
  TempatTglLahir?: string;
  Status?: string;
  Agama?: string;
  Pendidikan?: string;
  Pekerjaan?: string;
  KedudukanKeluarga?: string;
  Alamat?: string;
  TanggalPerubahan?: string;
  SebabPerubahan?: string;
}

/** Sarana & Prasarana (Fasum / Fasos / RTH) */
export interface Fasilitas extends BaseRow {
  NamaFasilitas?: string;
  Jenis?: string;
  Lokasi?: string;
  Kapasitas?: string;
  Kondisi?: string;
  Status?: string;
}

/** Nama tabel yang dikenal backend. */
export type TableName =
  | 'pengurus'
  | 'proyek'
  | 'kejadian'
  | 'pendudukSementara'
  | 'perubahanPenduduk'
  | 'fasilitas';
