import { ProfilEkbangRwData, ProfilSdaRw, ProfilEkonomiRw, ProfilSarprasRw } from '@/types/ekbang';

export function createDefaultSda(): ProfilSdaRw {
  return {
    luasPermukiman: 0,
    luasKuburan: 0,
    luasPertanian: 0,
    luasTaman: 0,
    luasPerkantoran: 0,
    luasPrasaranaLain: 0,
    titikParkir: 0,
    jumlahSungai: 0,
    sungaiPerRt: {
      'RT 01': '',
      'RT 02': '',
      'RT 03': '',
      'RT 04': '',
      'RT 05': '',
      'RT 06': '',
      'RT 07': '',
      'RT 08': '',
      'RT 09': '',
      'RT 10': '',
    },
    rawanBanjirPerRt: {
      'RT 01': 'Tidak',
      'RT 02': 'Tidak',
      'RT 03': 'Tidak',
      'RT 04': 'Tidak',
      'RT 05': 'Tidak',
      'RT 06': 'Tidak',
      'RT 07': 'Tidak',
      'RT 08': 'Tidak',
      'RT 09': 'Tidak',
      'RT 10': 'Tidak',
    },
    bebasBanjirPerRt: {
      'RT 01': 'Ya',
      'RT 02': 'Ya',
      'RT 03': 'Ya',
      'RT 04': 'Ya',
      'RT 05': 'Ya',
      'RT 06': 'Ya',
      'RT 07': 'Ya',
      'RT 08': 'Ya',
      'RT 09': 'Ya',
      'RT 10': 'Ya',
    },
    sumurGaliUnit: 0,
    sumurGaliKk: 0,
    sumurGaliKondisiBaik: 0,
    sumurGaliKondisiKurangBaik: 0,
    sumurPompaUnit: 0,
    sumurPompaKk: 0,
    sumurPompaKondisiBaik: 0,
    sumurPompaKondisiKurangBaik: 0,
    hidranUmumUnit: 0,
    hidranUmumKk: 0,
    hidranUmumKondisiBaik: 0,
    hidranUmumKondisiKurangBaik: 0,
    pdamUnit: 0,
    pdamKk: 0,
    pdamKondisiBaik: 0,
    pdamKondisiKurangBaik: 0,
    sumurResapanPerRt: {
      'RT 01': 0,
      'RT 02': 0,
      'RT 03': 0,
      'RT 04': 0,
      'RT 05': 0,
      'RT 06': 0,
      'RT 07': 0,
      'RT 08': 0,
      'RT 09': 0,
      'RT 10': 0,
    },
    kualitasUdara: 'Sehat',
    tamanPerRt: {
      'RT 01': 0,
      'RT 02': 0,
      'RT 03': 0,
      'RT 04': 0,
      'RT 05': 0,
      'RT 06': 0,
      'RT 07': 0,
      'RT 08': 0,
      'RT 09': 0,
      'RT 10': 0,
    },
  };
}

export function createDefaultEkonomi(): ProfilEkonomiRw {
  return {
    koperasi: { unit: 0, tenagaKerja: 0 },
    industriMakanan: { unit: 0, tenagaKerja: 0 },
    industriMeubel: { unit: 0, tenagaKerja: 0 },
    usahaPerdagangan: { unit: 0, tenagaKerja: 0 },
    warungMakan: { unit: 0, tenagaKerja: 0 },
    kiosKelontong: { unit: 0, tenagaKerja: 0 },
    bengkel: { unit: 0, tenagaKerja: 0 },
    swalayanMinimarket: { unit: 0, tenagaKerja: 0 },
    percetakan: { unit: 0, tenagaKerja: 0 },
    sablon: { unit: 0, tenagaKerja: 0 },
    konveksi: { unit: 0, tenagaKerja: 0 },
    cafe: { unit: 0, tenagaKerja: 0 },
    salon: { unit: 0, tenagaKerja: 0 },
    barbershop: { unit: 0, tenagaKerja: 0 },
    pasarTradisional: { unit: 0 },
    pasarKaget: { unit: 0 },
  };
}

export function createDefaultSarpras(): ProfilSarprasRw {
  return {
    jalanAspalMeter: 0,
    jalanAspalKondisi: 'Baik',
    jalanKonblokMeter: 0,
    jalanKonblokKondisi: 'Baik',
    jalanTanahMeter: 0,
    jalanTanahKondisi: 'Baik',
    jembatanBetonUnit: 0,
    jembatanBetonKondisi: 'Baik',
    jembatanBesiUnit: 0,
    jembatanBesiKondisi: 'Baik',
    jembatanKayuUnit: 0,
    jembatanKayuKondisi: 'Baik',
    dilaluiAngkot: 'Tidak Ada',
    dilaluiBus: 'Tidak Ada',
    dilaluiBecak: 'Tidak Ada',
    dilaluiOjeg: 'Ada',
    dilaluiKeretaApi: 'Tidak Ada',
    lapanganTerbangPerintis: 'Tidak Ada',
    lapanganTerbang: 'Tidak Ada',
    helipad: 'Tidak Ada',
    teleponUmum: 0,
    wartel: 0,
    warnet: 0,
    pelangganTelepon: 0,
    tvUmum: 0,
    jumlahTv: 0,
    jumlahParabola: 0,
    mckUnit: 0,
    mckPenggunaKk: 0,
    mckKondisiBaik: 0,
    saluranDrainaseUnit: 0,
    saluranDrainaseKondisi: 'Baik',
    kantorRwUnit: 1,
    kantorRwKepemilikan: 'Swadaya Masyarakat',
    lampuPeneranganGang: 'Ada',
    lampuKondisi: 'Baik',
    hotelBintang5: 0,
    hotelBintang4: 0,
    hotelBintang3: 0,
    hotelBintang2: 0,
    hotelBintang1: 0,
    hotelMelati: 0,
    diskotik: 0,
    bilyar: 0,
    karaoke: 0,
    museum: 0,
    restoran: 0,
    tpsUmum: 'Ada',
  };
}

export function createDefaultRwProfile(rwNumber: number): ProfilEkbangRwData {
  const rwStr = `RW ${String(rwNumber).padStart(2, '0')}`;
  return {
    id: `profil-${rwStr.toLowerCase().replace(' ', '-')}`,
    rw: rwStr,
    namaKetuaRw: `Ketua ${rwStr}`,
    terakhirDiperbarui: new Date().toISOString().slice(0, 10),
    diperbaruiOleh: 'Bapak Kasi Ekbang',
    sda: createDefaultSda(),
    ekonomi: createDefaultEkonomi(),
    sarpras: createDefaultSarpras(),
  };
}

// 16 RW se-Kelurahan Lebakgede
export const MOCK_PROFIL_EKBANG_RW: ProfilEkbangRwData[] = Array.from({ length: 16 }, (_, i) => {
  const p = createDefaultRwProfile(i + 1);

  // Berikan data realistis untuk RW 01, RW 02, RW 03, dan RW 16 (Sekeloa)
  if (i === 0) { // RW 01
    p.sda.luasPermukiman = 18500;
    p.sda.luasKuburan = 0;
    p.sda.luasPertanian = 0;
    p.sda.luasTaman = 450;
    p.sda.luasPerkantoran = 1200;
    p.sda.luasPrasaranaLain = 800;
    p.sda.titikParkir = 6;
    p.sda.jumlahSungai = 1;
    p.sda.sungaiPerRt['RT 01'] = 'Sungai Cikapundung (Bantaran)';
    p.sda.rawanBanjirPerRt['RT 01'] = 'Ya';
    p.sda.bebasBanjirPerRt['RT 01'] = 'Tidak';
    p.sda.pdamUnit = 145;
    p.sda.pdamKk = 150;
    p.sda.pdamKondisiBaik = 140;
    p.sda.pdamKondisiKurangBaik = 5;
    p.sda.sumurPompaUnit = 25;
    p.sda.sumurPompaKk = 30;
    p.sda.sumurPompaKondisiBaik = 23;
    p.sda.sumurPompaKondisiKurangBaik = 2;
    p.sda.sumurResapanPerRt['RT 01'] = 3;
    p.sda.sumurResapanPerRt['RT 02'] = 2;
    p.sda.sumurResapanPerRt['RT 03'] = 4;

    p.ekonomi.koperasi = { unit: 1, tenagaKerja: 45 };
    p.ekonomi.warungMakan = { unit: 12, tenagaKerja: 24 };
    p.ekonomi.kiosKelontong = { unit: 18, tenagaKerja: 20 };
    p.ekonomi.bengkel = { unit: 3, tenagaKerja: 6 };
    p.ekonomi.cafe = { unit: 4, tenagaKerja: 16 };
    p.ekonomi.konveksi = { unit: 2, tenagaKerja: 10 };
    p.ekonomi.salon = { unit: 2, tenagaKerja: 4 };

    p.sarpras.jalanAspalMeter = 1200;
    p.sarpras.jalanKonblokMeter = 850;
    p.sarpras.jalanTanahMeter = 50;
    p.sarpras.jembatanBetonUnit = 2;
    p.sarpras.dilaluiAngkot = 'Ada';
    p.sarpras.dilaluiOjeg = 'Ada';
    p.sarpras.mckUnit = 3;
    p.sarpras.mckPenggunaKk = 35;
    p.sarpras.saluranDrainaseUnit = 14;
    p.sarpras.saluranDrainaseKondisi = 'Baik';
    p.sarpras.kantorRwUnit = 1;
    p.sarpras.kantorRwKepemilikan = 'Swadaya Masyarakat';
    p.sarpras.lampuPeneranganGang = 'Ada';
    p.sarpras.lampuKondisi = 'Baik';
    p.sarpras.tpsUmum = 'Ada';
  } else if (i === 1) { // RW 02
    p.sda.luasPermukiman = 16200;
    p.sda.luasTaman = 300;
    p.sda.luasPerkantoran = 500;
    p.sda.titikParkir = 4;
    p.ekonomi.warungMakan = { unit: 8, tenagaKerja: 16 };
    p.ekonomi.kiosKelontong = { unit: 14, tenagaKerja: 14 };
    p.ekonomi.swalayanMinimarket = { unit: 1, tenagaKerja: 6 };
    p.sarpras.jalanAspalMeter = 900;
    p.sarpras.jalanKonblokMeter = 600;
  } else if (i === 15) { // RW 16 (Sekeloa)
    p.namaKetuaRw = 'Bapak Ketua RW 16 Sekeloa';
    p.sda.luasPermukiman = 22400;
    p.sda.luasKuburan = 500;
    p.sda.luasTaman = 600;
    p.sda.luasPerkantoran = 800;
    p.sda.luasPrasaranaLain = 1200;
    p.sda.titikParkir = 10;
    p.sda.jumlahSungai = 1;
    p.sda.sungaiPerRt['RT 02'] = 'Saluran Sekeloa';
    p.sda.rawanBanjirPerRt['RT 03'] = 'Ya';
    p.sda.bebasBanjirPerRt['RT 03'] = 'Tidak';
    p.sda.pdamUnit = 210;
    p.sda.pdamKk = 230;
    p.sda.pdamKondisiBaik = 205;
    p.sda.pdamKondisiKurangBaik = 5;

    p.ekonomi.koperasi = { unit: 1, tenagaKerja: 35 };
    p.ekonomi.warungMakan = { unit: 15, tenagaKerja: 30 };
    p.ekonomi.kiosKelontong = { unit: 22, tenagaKerja: 25 };
    p.ekonomi.cafe = { unit: 5, tenagaKerja: 20 };
    p.ekonomi.bengkel = { unit: 4, tenagaKerja: 8 };
    p.ekonomi.sablon = { unit: 2, tenagaKerja: 6 };
    p.ekonomi.konveksi = { unit: 3, tenagaKerja: 15 };

    p.sarpras.jalanAspalMeter = 1600;
    p.sarpras.jalanKonblokMeter = 1100;
    p.sarpras.jembatanBetonUnit = 3;
    p.sarpras.dilaluiAngkot = 'Ada';
    p.sarpras.mckUnit = 4;
    p.sarpras.mckPenggunaKk = 42;
    p.sarpras.saluranDrainaseUnit = 18;
    p.sarpras.saluranDrainaseKondisi = 'Baik';
    p.sarpras.kantorRwUnit = 1;
    p.sarpras.kantorRwKepemilikan = 'Milik Pemerintah';
  }

  return p;
});
