export interface LembagaPendidikanItem {
  unit: number;
  peserta?: number; // Siswa / Mahasiswa / Santri
}

export interface ProfilKelembagaanKesosRw {
  // A. Organisasi Kemasyarakatan di RW
  karangTarunaUnit: number;
  karangTarunaAnggota: number;
  posyanduUnit: number;
  posyanduKaderAktif: number;
  kelompokPengajian: number;
  kelompokArisan: number;
  relawanSosialBencana: number;
  pokjaPkkRw: number;
  dasawismaAktif: number;

  // B. Lembaga Pendidikan di RW
  paudRa: LembagaPendidikanItem;
  tkq: LembagaPendidikanItem;
  sdSederajat: LembagaPendidikanItem;
  sltpSederajat: LembagaPendidikanItem;
  sltaSederajat: LembagaPendidikanItem;
  perguruanTinggi: LembagaPendidikanItem;
  pendidikanKeagamaan: LembagaPendidikanItem; // Pesantren / Madrasah Diniyah
  kursusPelatihan: LembagaPendidikanItem; // Pelatihan Kerja / Keterampilan
}

export interface ProfilKesehatanPmksRw {
  // A. Prasarana Fasilitas Kesehatan
  rumahSakitUmum: number;
  puskesmas: number;
  puskesmasPembantu: number;
  poliklinikKlinik: number;
  apotik: number;
  posyandu: number;
  tokoObat: number;
  praktekDokterBidan: number;

  // B. Sasaran Prioritas Gizi & Stunting (1000 HPK)
  balitaDitimbang: number;
  balitaGiziBaik: number;
  balitaGiziKurang: number;
  balitaStunting: number;
  badutaTotal: number;
  ibuHamilTotal: number;
  ibuHamilResti: number; // Risiko Tinggi / KEK / Anemia
  lansiaTotal: number;
  lansiaRistiPosbindu: number;

  // C. Penyandang Disabilitas / Cacat Mental & Fisik
  tunaRungu: number;
  tunaWicara: number;
  tunaNetra: number;
  tunaDaksa: number;
  lumpuh: number;
  sumbing: number;
  cacatMental: number;

  // D. Perlindungan & Bantuan Sosial
  keluargaPkh: number;
  keluargaBpnt: number;
  keluargaPbiJkn: number;
}

export interface ProfilSosialBudayaRw {
  // A. Prasarana Peribadatan
  masjid: number;
  langgarMushola: number;
  gerejaKristen: number;
  gerejaKatolik: number;
  wihara: number;
  pura: number;

  // B. Prasarana Olahraga & Seni Budaya
  lapanganSepakBola: number;
  lapanganBuluTangkis: number;
  lapanganVoli: number;
  lapanganBasket: number;
  lapanganTenisMeja: number;
  lapanganFutsal: number;
  sanggarSeniBudaya: number;
}

export interface ProfilKesosRwData {
  rw: string; // "RW 01" .. "RW 16"
  namaKetuaRw?: string;
  tahun: number;
  keadaanBulan: string;
  terakhirDiperbarui: string;

  kelembagaan: ProfilKelembagaanKesosRw;
  kesehatan: ProfilKesehatanPmksRw;
  sosialBudaya: ProfilSosialBudayaRw;
}

export interface ProfilKesosAggregate {
  totalRw: number;
  kelembagaan: ProfilKelembagaanKesosRw;
  kesehatan: ProfilKesehatanPmksRw;
  sosialBudaya: ProfilSosialBudayaRw;
}
