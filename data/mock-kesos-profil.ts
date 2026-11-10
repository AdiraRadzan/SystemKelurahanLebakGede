import { ProfilKesosRwData } from '@/types/kesos';

const RW_NAMES = [
  'RW 01', 'RW 02', 'RW 03', 'RW 04',
  'RW 05', 'RW 06', 'RW 07', 'RW 08',
  'RW 09', 'RW 10', 'RW 11', 'RW 12',
  'RW 13', 'RW 14', 'RW 15', 'RW 16',
];

const KETUA_RW_MAP: Record<string, string> = {
  'RW 01': 'Drs. H. Dadang Mulyadi',
  'RW 02': 'Bapak Supardi, S.Sos',
  'RW 03': 'H. Agus Setiawan',
  'RW 04': 'Bapak Kusnadi',
  'RW 05': 'H. Tatang Sunarya',
  'RW 06': 'Bapak Hendra Gunawan',
  'RW 07': 'Ibu Hj. Yanti Suryani',
  'RW 08': 'Bapak Dedi Suhendi',
  'RW 09': 'H. Mamat Rohimat',
  'RW 10': 'Bapak Wawan Kurniawan',
  'RW 11': 'Bapak Cecep Hidayat',
  'RW 12': 'Ibu Dra. Hj. Ratna Ningsih',
  'RW 13': 'Bapak Entis Sutisna',
  'RW 14': 'Bapak Nanang Qosim',
  'RW 15': 'H. Endang Suparman',
  'RW 16': 'Bapak Rustama (Sekeloa)',
};

export const MOCK_PROFIL_KESOS_RW: ProfilKesosRwData[] = RW_NAMES.map((rw, idx) => {
  const seed = idx + 1;

  // Variasi realistis antar-RW
  const isSekeloa = rw === 'RW 16';
  const posyanduCount = isSekeloa ? 2 : 1;
  const kaderCount = posyanduCount * 6;
  const balitaCount = 35 + (seed * 3) % 25;
  const giziKurang = seed % 3 === 0 ? 2 : (seed % 4 === 0 ? 3 : 1);
  const stunting = seed % 5 === 0 ? 1 : 0;
  const giziBaik = balitaCount - giziKurang - stunting;
  const badutaCount = Math.floor(balitaCount * 0.4);
  const ibuHamilCount = 8 + (seed * 2) % 10;
  const ibuHamilResti = seed % 3 === 0 ? 2 : 1;
  const lansiaCount = 40 + (seed * 4) % 30;

  return {
    rw,
    namaKetuaRw: KETUA_RW_MAP[rw] || `Ketua ${rw}`,
    tahun: 2026,
    keadaanBulan: 'November',
    terakhirDiperbarui: '2026-11-01',

    kelembagaan: {
      karangTarunaUnit: 1,
      karangTarunaAnggota: 15 + (seed * 2) % 12,
      posyanduUnit: posyanduCount,
      posyanduKaderAktif: kaderCount,
      kelompokPengajian: 3 + (seed % 4),
      kelompokArisan: 2 + (seed % 3),
      relawanSosialBencana: 5 + (seed % 5),
      pokjaPkkRw: 4,
      dasawismaAktif: 6 + (seed % 6),

      paudRa: { unit: seed % 2 === 0 ? 1 : 0, peserta: seed % 2 === 0 ? 28 : 0 },
      tkq: { unit: 1, peserta: 25 + (seed % 15) },
      sdSederajat: { unit: seed % 4 === 1 ? 1 : 0, peserta: seed % 4 === 1 ? 180 : 0 },
      sltpSederajat: { unit: seed === 3 ? 1 : 0, peserta: seed === 3 ? 240 : 0 },
      sltaSederajat: { unit: seed === 7 ? 1 : 0, peserta: seed === 7 ? 320 : 0 },
      perguruanTinggi: { unit: 0, peserta: 0 },
      pendidikanKeagamaan: { unit: 1 + (seed % 2), peserta: 30 + (seed * 5) },
      kursusBahasa: { unit: 0, peserta: 0 },
      kursusMontir: { unit: 0, peserta: 0 },
      kursusKomputer: { unit: 0, peserta: 0 },
      kursusKecantikan: { unit: 0, peserta: 0 },
      kursusRiasPengantin: { unit: 0, peserta: 0 },
      kursusLas: { unit: 0, peserta: 0 },
    },

    kesehatan: {
      rumahSakitUmum: 0,
      puskesmas: seed === 1 ? 1 : 0, // Puskesmas Coblong terdekat
      puskesmasPembantu: seed === 4 ? 1 : 0,
      poliklinikKlinik: seed % 5 === 0 ? 1 : 0,
      apotik: seed % 3 === 0 ? 1 : 0,
      posyandu: posyanduCount,
      tokoObat: seed % 4 === 0 ? 1 : 0,
      praktekDokterBidan: 1 + (seed % 2),

      balitaDitimbang: balitaCount,
      balitaGiziBaik: giziBaik,
      balitaGiziKurang: giziKurang,
      balitaStunting: stunting,
      badutaTotal: badutaCount,
      ibuHamilTotal: ibuHamilCount,
      ibuHamilResti: ibuHamilResti,
      lansiaTotal: lansiaCount,
      lansiaRistiPosbindu: Math.floor(lansiaCount * 0.25),

      tunaRungu: seed % 4 === 0 ? 1 : 0,
      tunaWicara: seed % 5 === 0 ? 1 : 0,
      tunaNetra: seed % 6 === 0 ? 1 : 0,
      tunaDaksa: seed % 3 === 0 ? 1 : 0,
      lumpuh: seed % 5 === 0 ? 1 : 0,
      sumbing: 0,
      cacatMental: seed % 7 === 0 ? 1 : 0,

      keluargaPkh: 12 + (seed * 2) % 15,
      keluargaBpnt: 18 + (seed * 3) % 20,
      keluargaPbiJkn: 35 + (seed * 4) % 30,
    },

    sosialBudaya: {
      masjid: 1 + (seed % 2),
      langgarMushola: 2 + (seed % 3),
      gerejaKristen: seed === 2 ? 1 : 0,
      gerejaKatolik: 0,
      wihara: 0,
      pura: 0,

      lapanganSepakBola: seed === 5 ? 1 : 0,
      lapanganBuluTangkis: 1 + (seed % 2),
      lapanganVoli: seed % 2 === 0 ? 1 : 0,
      lapanganBasket: seed % 4 === 0 ? 1 : 0,
      lapanganTenisMeja: 1 + (seed % 2),
      lapanganFutsal: seed === 8 ? 1 : 0,
      sanggarSeniBudaya: seed % 3 === 0 ? 1 : 0,
    },
  };
});
