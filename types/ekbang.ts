export interface RtItem {
  rt: string;
  nama?: string;
  status?: string;
  nilai?: number | string;
}

export interface ProfilSdaRw {
  // A. Luas Daerah RW (m2)
  luasPermukiman: number;
  luasKuburan: number;
  luasPertanian: number;
  luasTaman: number;
  luasPerkantoran: number;
  luasPrasaranaLain: number;
  titikParkir: number;

  // B. Orbitas
  jumlahSungai: number;
  sungaiPerRt: Record<string, string>; // RT 01..10 -> nama sungai/kali
  rawanBanjirPerRt: Record<string, 'Ya' | 'Tidak'>; // RT 01..10
  bebasBanjirPerRt: Record<string, 'Ya' | 'Tidak'>; // RT 01..10

  // C. Sumber Daya Air
  sumurGaliUnit: number;
  sumurGaliKk: number;
  sumurGaliKondisiBaik: number;
  sumurGaliKondisiKurangBaik: number;

  sumurPompaUnit: number;
  sumurPompaKk: number;
  sumurPompaKondisiBaik: number;
  sumurPompaKondisiKurangBaik: number;

  hidranUmumUnit: number;
  hidranUmumKk: number;
  hidranUmumKondisiBaik: number;
  hidranUmumKondisiKurangBaik: number;

  pdamUnit: number;
  pdamKk: number;
  pdamKondisiBaik: number;
  pdamKondisiKurangBaik: number;

  sumurResapanPerRt: Record<string, number>; // RT 01..10 -> unit
  kualitasUdara: 'Sehat' | 'Kurang Sehat';
  tamanPerRt: Record<string, number>; // RT 01..10 -> unit
}

export interface UsahaEkonomiItem {
  unit: number;
  tenagaKerja?: number;
}

export interface ProfilEkonomiRw {
  koperasi: UsahaEkonomiItem; // Unit, Jumlah Anggota
  industriMakanan: UsahaEkonomiItem; // Unit, Jumlah Tenaga Kerja
  industriMeubel: UsahaEkonomiItem;
  usahaPerdagangan: UsahaEkonomiItem;
  warungMakan: UsahaEkonomiItem;
  kiosKelontong: UsahaEkonomiItem;
  bengkel: UsahaEkonomiItem;
  swalayanMinimarket: UsahaEkonomiItem;
  percetakan: UsahaEkonomiItem;
  sablon: UsahaEkonomiItem;
  konveksi: UsahaEkonomiItem;
  cafe: UsahaEkonomiItem;
  salon: UsahaEkonomiItem;
  barbershop: UsahaEkonomiItem;
  pasarTradisional: { unit: number };
  pasarKaget: { unit: number };
}

export interface ProfilSarprasRw {
  // A. Transportasi
  jalanAspalMeter: number;
  jalanAspalKondisi: 'Baik' | 'Rusak' | 'Sedang';
  jalanKonblokMeter: number;
  jalanKonblokKondisi: 'Baik' | 'Rusak' | 'Sedang';
  jalanTanahMeter: number;
  jalanTanahKondisi: 'Baik' | 'Rusak' | 'Sedang';

  jembatanBetonUnit: number;
  jembatanBetonKondisi: 'Baik' | 'Rusak';
  jembatanBesiUnit: number;
  jembatanBesiKondisi: 'Baik' | 'Rusak';
  jembatanKayuUnit: number;
  jembatanKayuKondisi: 'Baik' | 'Rusak';

  dilaluiAngkot: 'Ada' | 'Tidak Ada';
  dilaluiBus: 'Ada' | 'Tidak Ada';
  dilaluiBecak: 'Ada' | 'Tidak Ada';
  dilaluiOjeg: 'Ada' | 'Tidak Ada';
  dilaluiKeretaApi: 'Ada' | 'Tidak Ada';

  lapanganTerbangPerintis: 'Ada' | 'Tidak Ada';
  lapanganTerbang: 'Ada' | 'Tidak Ada';
  helipad: 'Ada' | 'Tidak Ada';

  // B. Komunikasi
  teleponUmum: number;
  wartel: number;
  warnet: number;
  pelangganTelepon: number;
  tvUmum: number;
  jumlahTv: number;
  jumlahParabola: number;

  // C. Prasarana Air Bersih
  mckUnit: number;
  mckPenggunaKk: number;
  mckKondisiBaik: number;

  // D. Drainase
  saluranDrainaseUnit: number;
  saluranDrainaseKondisi: 'Baik' | 'Rusak' | 'Kurang Memadai';

  // E. Pemerintahan
  kantorRwUnit: number;
  kantorRwKepemilikan: 'Milik Pemerintah' | 'Swadaya Masyarakat';

  // J. Penerangan
  lampuPeneranganGang: 'Ada' | 'Tidak Ada';
  lampuKondisi: 'Baik' | 'Mati' | 'Rusak';

  // K. Hiburan & Pariwisata
  hotelBintang5: number;
  hotelBintang4: number;
  hotelBintang3: number;
  hotelBintang2: number;
  hotelBintang1: number;
  hotelMelati: number;
  diskotik: number;
  bilyar: number;
  karaoke: number;
  museum: number;
  restoran: number;

  // L. Kebersihan
  tpsUmum: 'Ada' | 'Tidak Ada';
}

export interface ProfilEkbangRwData {
  id: string;
  rw: string; // contoh: 'RW 01', 'RW 16'
  namaKetuaRw?: string;
  terakhirDiperbarui: string;
  diperbaruiOleh: string;
  sda: ProfilSdaRw;
  ekonomi: ProfilEkonomiRw;
  sarpras: ProfilSarprasRw;
}
