// ============================================================================
// Tipe bersama Data Penduduk
// ============================================================================
// Dipakai oleh sisi server (`lib/sheets.ts`, route handler) DAN sisi browser
// (`lib/penduduk-api.ts`, komponen). Satu sumber kebenaran supaya bentuk data
// tidak pernah berbeda antara server dan klien.
//
// Nama kolom mengikuti HEADERS_PENDUDUK di `apps-script/Code.gs`.

export interface PendudukRecord {
  ID?: string;
  No?: string | number;
  NIK?: string;
  Nama?: string;
  RT?: string;
  RW?: string;
  JenisKelamin?: string;
  TempatLahir?: string;
  TanggalLahir?: string;
  StatusPerkawinan?: string;
  Agama?: string;
  Pendidikan?: string;
  Pekerjaan?: string;
  KedudukanKeluarga?: string;
  GolonganDarah?: string;
  Kewarganegaraan?: string;
  Alamat?: string;
  NamaAyah?: string;
  NamaIbu?: string;
  NoKK?: string;
  NoUrtKeluarga?: string;
  NamaKepalaKeluarga?: string;
  TglKK?: string;
  Suku?: string;
  TglKawin?: string;
  CatatanImpor?: string;
  DiperbaruiPada?: string;
  [key: string]: string | number | undefined;
}

export interface ChartPoint {
  label: string;
  jumlah: number;
}

export interface PendudukStats {
  total: number;
  totalKK: number;
  kkDariNoKK: boolean;
  butuhReview: number;
  belumAdaNama: number;
  perRT: ChartPoint[];
  perGender: ChartPoint[];
  perUsiaGroup: ChartPoint[];
  perPendidikan: ChartPoint[];
  perAgama: ChartPoint[];
  perKedudukan: ChartPoint[];
}

export interface PengurusRecord {
  ID?: string;
  Unit?: string;
  Jabatan?: string;
  Nama?: string;
  Kontak?: string;
  Periode?: string;
  [key: string]: string | undefined;
}
