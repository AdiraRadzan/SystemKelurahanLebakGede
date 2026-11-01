import { ProfilEkbangRwData, ProfilEkonomiRw } from '@/types/ekbang';

export interface EkbangAggregationResult {
  totalRw: number;
  rwTerdataCount: number;

  // SDA
  totalLuasPermukiman: number;
  totalLuasKuburan: number;
  totalLuasPertanian: number;
  totalLuasTaman: number;
  totalLuasPerkantoran: number;
  totalLuasPrasaranaLain: number;
  totalTitikParkir: number;
  totalLuasWilayah: number;

  totalSungai: number;
  daftarRtRawanBanjir: { rw: string; rt: string }[];
  daftarRtBebasBanjirCount: number;

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

  totalSumurResapan: number;
  totalTaman: number;

  // EKONOMI (16 item)
  ekonomi: {
    koperasi: { unit: number; anggota: number };
    industriMakanan: { unit: number; tenagaKerja: number };
    industriMeubel: { unit: number; tenagaKerja: number };
    usahaPerdagangan: { unit: number; tenagaKerja: number };
    warungMakan: { unit: number; tenagaKerja: number };
    kiosKelontong: { unit: number; tenagaKerja: number };
    bengkel: { unit: number; tenagaKerja: number };
    swalayanMinimarket: { unit: number; tenagaKerja: number };
    percetakan: { unit: number; tenagaKerja: number };
    sablon: { unit: number; tenagaKerja: number };
    konveksi: { unit: number; tenagaKerja: number };
    cafe: { unit: number; tenagaKerja: number };
    salon: { unit: number; tenagaKerja: number };
    barbershop: { unit: number; tenagaKerja: number };
    pasarTradisional: { unit: number };
    pasarKaget: { unit: number };
    totalUnitUsaha: number;
    totalTenagaKerja: number;
  };

  // SARPRAS
  sarpras: {
    jalanAspalMeter: number;
    jalanKonblokMeter: number;
    jalanTanahMeter: number;
    totalPanjangJalan: number;

    jembatanBetonUnit: number;
    jembatanBesiUnit: number;
    jembatanKayuUnit: number;
    totalJembatan: number;

    mckUnit: number;
    mckPenggunaKk: number;
    mckKondisiBaik: number;

    saluranDrainaseUnit: number;
    kantorRwUnit: number;
    teleponUmum: number;
    wartel: number;
    warnet: number;
    pelangganTelepon: number;
    tvUmum: number;
    jumlahTv: number;
    jumlahParabola: number;

    hotelBintang5: number;
    hotelBintang4: number;
    hotelBintang3: number;
    hotelBintang2: number;
    hotelBintang1: number;
    hotelMelati: number;
    totalHotel: number;

    restoran: number;
    karaoke: number;
    bilyar: number;
    diskotik: number;
    museum: number;
    tpsUmumCount: number;
  };
}

export function aggregateProfilEkbang(list: ProfilEkbangRwData[]): EkbangAggregationResult {
  const result: EkbangAggregationResult = {
    totalRw: list.length,
    rwTerdataCount: list.filter((r) => r.sda.luasPermukiman > 0 || r.sarpras.jalanAspalMeter > 0).length,

    totalLuasPermukiman: 0,
    totalLuasKuburan: 0,
    totalLuasPertanian: 0,
    totalLuasTaman: 0,
    totalLuasPerkantoran: 0,
    totalLuasPrasaranaLain: 0,
    totalTitikParkir: 0,
    totalLuasWilayah: 0,

    totalSungai: 0,
    daftarRtRawanBanjir: [],
    daftarRtBebasBanjirCount: 0,

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

    totalSumurResapan: 0,
    totalTaman: 0,

    ekonomi: {
      koperasi: { unit: 0, anggota: 0 },
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
      totalUnitUsaha: 0,
      totalTenagaKerja: 0,
    },

    sarpras: {
      jalanAspalMeter: 0,
      jalanKonblokMeter: 0,
      jalanTanahMeter: 0,
      totalPanjangJalan: 0,

      jembatanBetonUnit: 0,
      jembatanBesiUnit: 0,
      jembatanKayuUnit: 0,
      totalJembatan: 0,

      mckUnit: 0,
      mckPenggunaKk: 0,
      mckKondisiBaik: 0,

      saluranDrainaseUnit: 0,
      kantorRwUnit: 0,
      teleponUmum: 0,
      wartel: 0,
      warnet: 0,
      pelangganTelepon: 0,
      tvUmum: 0,
      jumlahTv: 0,
      jumlahParabola: 0,

      hotelBintang5: 0,
      hotelBintang4: 0,
      hotelBintang3: 0,
      hotelBintang2: 0,
      hotelBintang1: 0,
      hotelMelati: 0,
      totalHotel: 0,

      restoran: 0,
      karaoke: 0,
      bilyar: 0,
      diskotik: 0,
      museum: 0,
      tpsUmumCount: 0,
    },
  };

  list.forEach((item) => {
    const s = item.sda;
    const e = item.ekonomi;
    const sp = item.sarpras;

    // SDA Luas
    result.totalLuasPermukiman += Number(s.luasPermukiman || 0);
    result.totalLuasKuburan += Number(s.luasKuburan || 0);
    result.totalLuasPertanian += Number(s.luasPertanian || 0);
    result.totalLuasTaman += Number(s.luasTaman || 0);
    result.totalLuasPerkantoran += Number(s.luasPerkantoran || 0);
    result.totalLuasPrasaranaLain += Number(s.luasPrasaranaLain || 0);
    result.totalTitikParkir += Number(s.titikParkir || 0);

    result.totalSungai += Number(s.jumlahSungai || 0);

    // Banjir per RT
    if (s.rawanBanjirPerRt) {
      Object.entries(s.rawanBanjirPerRt).forEach(([rt, val]) => {
        if (val === 'Ya') {
          result.daftarRtRawanBanjir.push({ rw: item.rw, rt });
        }
      });
    }

    if (s.bebasBanjirPerRt) {
      Object.values(s.bebasBanjirPerRt).forEach((val) => {
        if (val === 'Ya') result.daftarRtBebasBanjirCount++;
      });
    }

    // Sumber Daya Air
    result.sumurGaliUnit += Number(s.sumurGaliUnit || 0);
    result.sumurGaliKk += Number(s.sumurGaliKk || 0);
    result.sumurGaliKondisiBaik += Number(s.sumurGaliKondisiBaik || 0);
    result.sumurGaliKondisiKurangBaik += Number(s.sumurGaliKondisiKurangBaik || 0);

    result.sumurPompaUnit += Number(s.sumurPompaUnit || 0);
    result.sumurPompaKk += Number(s.sumurPompaKk || 0);
    result.sumurPompaKondisiBaik += Number(s.sumurPompaKondisiBaik || 0);
    result.sumurPompaKondisiKurangBaik += Number(s.sumurPompaKondisiKurangBaik || 0);

    result.hidranUmumUnit += Number(s.hidranUmumUnit || 0);
    result.hidranUmumKk += Number(s.hidranUmumKk || 0);
    result.hidranUmumKondisiBaik += Number(s.hidranUmumKondisiBaik || 0);
    result.hidranUmumKondisiKurangBaik += Number(s.hidranUmumKondisiKurangBaik || 0);

    result.pdamUnit += Number(s.pdamUnit || 0);
    result.pdamKk += Number(s.pdamKk || 0);
    result.pdamKondisiBaik += Number(s.pdamKondisiBaik || 0);
    result.pdamKondisiKurangBaik += Number(s.pdamKondisiKurangBaik || 0);

    if (s.sumurResapanPerRt) {
      Object.values(s.sumurResapanPerRt).forEach((v) => {
        result.totalSumurResapan += Number(v || 0);
      });
    }

    if (s.tamanPerRt) {
      Object.values(s.tamanPerRt).forEach((v) => {
        result.totalTaman += Number(v || 0);
      });
    }

    // EKONOMI
    const addEkonomi = (key: keyof ProfilEkonomiRw, targetKey: keyof typeof result.ekonomi) => {
      const src = e[key] as { unit?: number; tenagaKerja?: number; anggota?: number } | undefined;
      const tgt = result.ekonomi[targetKey] as { unit: number; tenagaKerja?: number; anggota?: number };
      if (src && tgt) {
        tgt.unit += Number(src.unit || 0);
        result.ekonomi.totalUnitUsaha += Number(src.unit || 0);
        if ('tenagaKerja' in tgt && src.tenagaKerja) {
          tgt.tenagaKerja = (tgt.tenagaKerja || 0) + Number(src.tenagaKerja || 0);
          result.ekonomi.totalTenagaKerja += Number(src.tenagaKerja || 0);
        }
        if ('anggota' in tgt && src.anggota) {
          tgt.anggota = (tgt.anggota || 0) + Number(src.anggota || 0);
          result.ekonomi.totalTenagaKerja += Number(src.anggota || 0);
        }
      }
    };

    addEkonomi('koperasi', 'koperasi');
    addEkonomi('industriMakanan', 'industriMakanan');
    addEkonomi('industriMeubel', 'industriMeubel');
    addEkonomi('usahaPerdagangan', 'usahaPerdagangan');
    addEkonomi('warungMakan', 'warungMakan');
    addEkonomi('kiosKelontong', 'kiosKelontong');
    addEkonomi('bengkel', 'bengkel');
    addEkonomi('swalayanMinimarket', 'swalayanMinimarket');
    addEkonomi('percetakan', 'percetakan');
    addEkonomi('sablon', 'sablon');
    addEkonomi('konveksi', 'konveksi');
    addEkonomi('cafe', 'cafe');
    addEkonomi('salon', 'salon');
    addEkonomi('barbershop', 'barbershop');
    addEkonomi('pasarTradisional', 'pasarTradisional');
    addEkonomi('pasarKaget', 'pasarKaget');

    // SARPRAS
    result.sarpras.jalanAspalMeter += Number(sp.jalanAspalMeter || 0);
    result.sarpras.jalanKonblokMeter += Number(sp.jalanKonblokMeter || 0);
    result.sarpras.jalanTanahMeter += Number(sp.jalanTanahMeter || 0);

    result.sarpras.jembatanBetonUnit += Number(sp.jembatanBetonUnit || 0);
    result.sarpras.jembatanBesiUnit += Number(sp.jembatanBesiUnit || 0);
    result.sarpras.jembatanKayuUnit += Number(sp.jembatanKayuUnit || 0);

    result.sarpras.mckUnit += Number(sp.mckUnit || 0);
    result.sarpras.mckPenggunaKk += Number(sp.mckPenggunaKk || 0);
    result.sarpras.mckKondisiBaik += Number(sp.mckKondisiBaik || 0);

    result.sarpras.saluranDrainaseUnit += Number(sp.saluranDrainaseUnit || 0);
    result.sarpras.kantorRwUnit += Number(sp.kantorRwUnit || 0);

    result.sarpras.teleponUmum += Number(sp.teleponUmum || 0);
    result.sarpras.wartel += Number(sp.wartel || 0);
    result.sarpras.warnet += Number(sp.warnet || 0);
    result.sarpras.pelangganTelepon += Number(sp.pelangganTelepon || 0);
    result.sarpras.tvUmum += Number(sp.tvUmum || 0);
    result.sarpras.jumlahTv += Number(sp.jumlahTv || 0);
    result.sarpras.jumlahParabola += Number(sp.jumlahParabola || 0);

    result.sarpras.hotelBintang5 += Number(sp.hotelBintang5 || 0);
    result.sarpras.hotelBintang4 += Number(sp.hotelBintang4 || 0);
    result.sarpras.hotelBintang3 += Number(sp.hotelBintang3 || 0);
    result.sarpras.hotelBintang2 += Number(sp.hotelBintang2 || 0);
    result.sarpras.hotelBintang1 += Number(sp.hotelBintang1 || 0);
    result.sarpras.hotelMelati += Number(sp.hotelMelati || 0);

    result.sarpras.restoran += Number(sp.restoran || 0);
    result.sarpras.karaoke += Number(sp.karaoke || 0);
    result.sarpras.bilyar += Number(sp.bilyar || 0);
    result.sarpras.diskotik += Number(sp.diskotik || 0);
    result.sarpras.museum += Number(sp.museum || 0);

    if (sp.tpsUmum === 'Ada') result.sarpras.tpsUmumCount++;
  });

  result.totalLuasWilayah =
    result.totalLuasPermukiman +
    result.totalLuasKuburan +
    result.totalLuasPertanian +
    result.totalLuasTaman +
    result.totalLuasPerkantoran +
    result.totalLuasPrasaranaLain;

  result.sarpras.totalPanjangJalan =
    result.sarpras.jalanAspalMeter +
    result.sarpras.jalanKonblokMeter +
    result.sarpras.jalanTanahMeter;

  result.sarpras.totalJembatan =
    result.sarpras.jembatanBetonUnit +
    result.sarpras.jembatanBesiUnit +
    result.sarpras.jembatanKayuUnit;

  result.sarpras.totalHotel =
    result.sarpras.hotelBintang5 +
    result.sarpras.hotelBintang4 +
    result.sarpras.hotelBintang3 +
    result.sarpras.hotelBintang2 +
    result.sarpras.hotelBintang1 +
    result.sarpras.hotelMelati;

  return result;
}

/**
 * Format CSV resmi meniru susunan sheet PROFIL MASTER DATA PENDUDUK.xls (bagian Ekbang).
 * Angka-angka otomatis terisi dari hasil agregasi atau RW spesifik.
 */
export function generateProfilEkbangCsv(
  agg: EkbangAggregationResult,
  selectedRwLabel: string = 'Kelurahan Lebakgede (Total 16 RW)'
): string {
  const lines: string[] = [];

  const add = (colA: string, colB: string, colC: string = '', colD: string = '', colE: string = '') => {
    const esc = (v: string | number) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    lines.push([esc(colA), esc(colB), esc(colC), esc(colD), esc(colE)].join(','));
  };

  add('REKAPITULASI PROFIL KEWILAYAHAN SEKSI EKONOMI DAN PEMBANGUNAN (EKBANG)', '', '', '', '');
  add('KELURAHAN LEBAKGEDE - KECAMATAN COBLONG - KOTA BANDUNG', '', '', '', '');
  add(`Cakupan Data: ${selectedRwLabel}`, '', `Waktu Ekspor: ${new Date().toLocaleDateString('id-ID')}`, '', '');
  add('', '', '', '', '');

  // 1. I.F KELEMBAGAAN EKONOMI
  add('I. POTENSI KELEMBAGAAN', '', '', '', '');
  add('F.', 'Kelembagaan Ekonomi', '', '', '');
  add('', '1. Jumlah Koperasi', ':', `${agg.ekonomi.koperasi.unit} Unit`, `Jumlah Anggota: ${agg.ekonomi.koperasi.anggota} Orang`);
  add('', '2. Industri Makanan', ':', `${agg.ekonomi.industriMakanan.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.industriMakanan.tenagaKerja} Orang`);
  add('', '3. Industri Meubeul', ':', `${agg.ekonomi.industriMeubel.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.industriMeubel.tenagaKerja} Orang`);
  add('', '4. Usaha Perdagangan', ':', `${agg.ekonomi.usahaPerdagangan.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.usahaPerdagangan.tenagaKerja} Orang`);
  add('', '5. Warung Makan', ':', `${agg.ekonomi.warungMakan.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.warungMakan.tenagaKerja} Orang`);
  add('', '6. Kios / Kelontong', ':', `${agg.ekonomi.kiosKelontong.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.kiosKelontong.tenagaKerja} Orang`);
  add('', '7. Bengkel', ':', `${agg.ekonomi.bengkel.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.bengkel.tenagaKerja} Orang`);
  add('', '8. Swalayan / Minimarket', ':', `${agg.ekonomi.swalayanMinimarket.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.swalayanMinimarket.tenagaKerja} Orang`);
  add('', '9. Percetakan', ':', `${agg.ekonomi.percetakan.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.percetakan.tenagaKerja} Orang`);
  add('', '10. Sablon', ':', `${agg.ekonomi.sablon.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.sablon.tenagaKerja} Orang`);
  add('', '11. Konveksi', ':', `${agg.ekonomi.konveksi.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.konveksi.tenagaKerja} Orang`);
  add('', '12. Cafe', ':', `${agg.ekonomi.cafe.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.cafe.tenagaKerja} Orang`);
  add('', '13. Salon', ':', `${agg.ekonomi.salon.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.salon.tenagaKerja} Orang`);
  add('', '14. Barbershop', ':', `${agg.ekonomi.barbershop.unit} Unit`, `Jumlah Tenaga Kerja: ${agg.ekonomi.barbershop.tenagaKerja} Orang`);
  add('', '15. Pasar Tradisional', ':', `${agg.ekonomi.pasarTradisional.unit} Unit`, '');
  add('', '16. Pasar Kaget', ':', `${agg.ekonomi.pasarKaget.unit} Unit`, '');
  add('', 'TOTAL UNIT USAHA EKONOMI', ':', `${agg.ekonomi.totalUnitUsaha} Unit`, `Total Tenaga Kerja/Anggota: ${agg.ekonomi.totalTenagaKerja} Orang`);
  add('', '', '', '', '');

  // 2. II. SUMBER DAYA ALAM (PERSIS TAMPILAN DI EXCEL & GAMBAR USER)
  add('II', 'SUMBER DAYA ALAM', '', '', '');
  add('A.', 'Luas Daerah', ':', `${agg.totalLuasWilayah} m2`, '');
  add('', '1. Luas Permukiman', ':', `${agg.totalLuasPermukiman} m2`, '');
  add('', '2. Luas Kuburan', ':', `${agg.totalLuasKuburan} m2`, '');
  add('', '3. Luas Pertanian', ':', `${agg.totalLuasPertanian} m2`, '');
  add('', '4. Luas Taman', ':', `${agg.totalLuasTaman} m2`, '');
  add('', '5. Luas Perkantoran', ':', `${agg.totalLuasPerkantoran} m2`, '');
  add('', '6. Luas Prasarana Umum Lainnya', ':', `${agg.totalLuasPrasaranaLain} m2`, '');
  add('', '7. Jumlah Titik Parkir', ':', `${agg.totalTitikParkir} Titik`, '');
  add('', '', '', '', '');

  add('B.', 'ORBITAS', '', '', '');
  add('', '1. Jumlah Sungai/kali yang melalui wilayah', ':', `${agg.totalSungai} buah`, '');
  add('', '2. Rawan Banjir', ':', `${agg.daftarRtRawanBanjir.length} Titik RT Rawan Banjir`, agg.daftarRtRawanBanjir.map((r) => `${r.rw} (${r.rt})`).join('; ') || 'Nihil');
  add('', '3. Bebas Banjir', ':', `${agg.daftarRtBebasBanjirCount} RT Terdata Bebas Banjir`, '');
  add('', '', '', '', '');

  add('C.', 'Sumber Daya Air & Sanitasi', '', '', '');
  add('', '1. Air Minum Sumur Gali', ':', `${agg.sumurGaliUnit} Unit`, `Pengguna: ${agg.sumurGaliKk} KK (Baik: ${agg.sumurGaliKondisiBaik}, Kurang: ${agg.sumurGaliKondisiKurangBaik})`);
  add('', '2. Air Minum Sumur Pompa', ':', `${agg.sumurPompaUnit} Unit`, `Pengguna: ${agg.sumurPompaKk} KK (Baik: ${agg.sumurPompaKondisiBaik}, Kurang: ${agg.sumurPompaKondisiKurangBaik})`);
  add('', '3. Air Minum Hidran Umum', ':', `${agg.hidranUmumUnit} Unit`, `Pengguna: ${agg.hidranUmumKk} KK (Baik: ${agg.hidranUmumKondisiBaik}, Kurang: ${agg.hidranUmumKondisiKurangBaik})`);
  add('', '4. Air Minum PDAM', ':', `${agg.pdamUnit} Unit / Sambungan`, `Pengguna: ${agg.pdamKk} KK (Baik: ${agg.pdamKondisiBaik}, Kurang: ${agg.pdamKondisiKurangBaik})`);
  add('', '5. Sumur Resapan', ':', `${agg.totalSumurResapan} Unit Tersebar`, '');
  add('', '6. Jumlah Taman Lingkungan', ':', `${agg.totalTaman} Lokasi Taman`, '');
  add('', '', '', '', '');

  // 3. IV. POTENSI PRASARANA DAN SARANA (BAGIAN EKBANG)
  add('IV', 'POTENSI PRASARANA DAN SARANA (EKBANG)', '', '', '');
  add('A.', 'Prasarana dan Sarana Transportasi Darat', '', '', '');
  add('', '- Jalan di Aspal', '=', `${agg.sarpras.jalanAspalMeter} meter`, '');
  add('', '- Jalan Konblok', '=', `${agg.sarpras.jalanKonblokMeter} meter`, '');
  add('', '- Jalan Tanah', '=', `${agg.sarpras.jalanTanahMeter} meter`, '');
  add('', 'Total Panjang Jalan Lingkungan', '=', `${agg.sarpras.totalPanjangJalan} meter`, '');
  add('', '- Jembatan Beton', '=', `${agg.sarpras.jembatanBetonUnit} unit`, '');
  add('', '- Jembatan Besi', '=', `${agg.sarpras.jembatanBesiUnit} unit`, '');
  add('', '- Jembatan Kayu', '=', `${agg.sarpras.jembatanKayuUnit} unit`, '');
  add('', '', '', '', '');

  add('B.', 'Prasarana Komunikasi', '', '', '');
  add('', '- Telepon Umum', '=', `${agg.sarpras.teleponUmum} unit`, '');
  add('', '- Wartel', '=', `${agg.sarpras.wartel} unit`, '');
  add('', '- Warnet', '=', `${agg.sarpras.warnet} unit`, '');
  add('', '- Jumlah Pelanggan Telepon', '=', `${agg.sarpras.pelangganTelepon} Pelanggan`, '');
  add('', '- TV Umum & Komunal', '=', `${agg.sarpras.tvUmum} unit`, '');
  add('', '- Jumlah Parabola', '=', `${agg.sarpras.jumlahParabola} unit`, '');
  add('', '', '', '', '');

  add('C.', 'Prasarana Air Bersih & MCK', '', '', '');
  add('', '- MCK Umum', '=', `${agg.sarpras.mckUnit} unit`, `Pengguna: ${agg.sarpras.mckPenggunaKk} KK`);
  add('', '- Saluran Drainase / Limbah', '=', `${agg.sarpras.saluranDrainaseUnit} unit / segmen`, '');
  add('', '', '', '', '');

  add('E.', 'Prasarana Pemerintahan', '', '', '');
  add('', '- Kantor Balai RW', '=', `${agg.sarpras.kantorRwUnit} unit`, '');
  add('', '', '', '', '');

  add('J.', 'Prasarana Penerangan', '', '', '');
  add('', '- Lampu Penerangan Gang', '=', `${agg.sarpras.kantorRwUnit > 0 ? 'Ada' : 'Sebagian'}`, '');
  add('', '', '', '', '');

  add('K.', 'Prasarana Hiburan & Pariwisata', '', '', '');
  add('', '- Hotel (Semua Bintang & Melati)', '=', `${agg.sarpras.totalHotel} buah`, `B5: ${agg.sarpras.hotelBintang5}, B4: ${agg.sarpras.hotelBintang4}, Melati: ${agg.sarpras.hotelMelati}`);
  add('', '- Restoran / Rumah Makan Besar', '=', `${agg.sarpras.restoran} buah`, '');
  add('', '- Sarana Hiburan Lain (Bilyar/Karaoke/Museum)', '=', `${agg.sarpras.bilyar + agg.sarpras.karaoke + agg.sarpras.museum} buah`, '');
  add('', '', '', '', '');

  add('L.', 'Prasarana Kebersihan & TPS Umum', '', '', '');
  add('', '- TPS Umum Lingkungan', '=', `${agg.sarpras.tpsUmumCount} Titik TPS Terdata`, '');

  return '\uFEFF' + lines.join('\r\n');
}
