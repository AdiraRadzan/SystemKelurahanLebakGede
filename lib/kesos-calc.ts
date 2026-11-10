import {
  ProfilKesosRwData,
  ProfilKesosAggregate,
  ProfilKelembagaanKesosRw,
  ProfilKesehatanPmksRw,
  ProfilSosialBudayaRw,
} from '@/types/kesos';

export function createEmptyProfilKesos(rw: string): ProfilKesosRwData {
  return {
    rw,
    namaKetuaRw: '',
    tahun: 2026,
    keadaanBulan: 'November',
    terakhirDiperbarui: new Date().toISOString().slice(0, 10),

    kelembagaan: {
      karangTarunaUnit: 1,
      karangTarunaAnggota: 0,
      posyanduUnit: 1,
      posyanduKaderAktif: 0,
      kelompokPengajian: 0,
      kelompokArisan: 0,
      relawanSosialBencana: 0,
      pokjaPkkRw: 4,
      dasawismaAktif: 0,
      paudRa: { unit: 0, peserta: 0 },
      tkq: { unit: 0, peserta: 0 },
      sdSederajat: { unit: 0, peserta: 0 },
      sltpSederajat: { unit: 0, peserta: 0 },
      sltaSederajat: { unit: 0, peserta: 0 },
      perguruanTinggi: { unit: 0, peserta: 0 },
      pendidikanKeagamaan: { unit: 0, peserta: 0 },
      kursusBahasa: { unit: 0, peserta: 0 },
      kursusMontir: { unit: 0, peserta: 0 },
      kursusKomputer: { unit: 0, peserta: 0 },
      kursusKecantikan: { unit: 0, peserta: 0 },
      kursusRiasPengantin: { unit: 0, peserta: 0 },
      kursusLas: { unit: 0, peserta: 0 },
    },

    kesehatan: {
      rumahSakitUmum: 0,
      puskesmas: 0,
      puskesmasPembantu: 0,
      poliklinikKlinik: 0,
      apotik: 0,
      posyandu: 1,
      tokoObat: 0,
      praktekDokterBidan: 0,
      balitaDitimbang: 0,
      balitaGiziBaik: 0,
      balitaGiziKurang: 0,
      balitaStunting: 0,
      badutaTotal: 0,
      ibuHamilTotal: 0,
      ibuHamilResti: 0,
      lansiaTotal: 0,
      lansiaRistiPosbindu: 0,
      tunaRungu: 0,
      tunaWicara: 0,
      tunaNetra: 0,
      tunaDaksa: 0,
      lumpuh: 0,
      sumbing: 0,
      cacatMental: 0,
      keluargaPkh: 0,
      keluargaBpnt: 0,
      keluargaPbiJkn: 0,
    },

    sosialBudaya: {
      masjid: 0,
      langgarMushola: 0,
      gerejaKristen: 0,
      gerejaKatolik: 0,
      wihara: 0,
      pura: 0,
      lapanganSepakBola: 0,
      lapanganBuluTangkis: 0,
      lapanganVoli: 0,
      lapanganBasket: 0,
      lapanganTenisMeja: 0,
      lapanganFutsal: 0,
      sanggarSeniBudaya: 0,
    },
  };
}

export function aggregateProfilKesos(items: ProfilKesosRwData[]): ProfilKesosAggregate {
  const result: ProfilKesosAggregate = {
    totalRw: items.length,
    kelembagaan: {
      karangTarunaUnit: 0,
      karangTarunaAnggota: 0,
      posyanduUnit: 0,
      posyanduKaderAktif: 0,
      kelompokPengajian: 0,
      kelompokArisan: 0,
      relawanSosialBencana: 0,
      pokjaPkkRw: 0,
      dasawismaAktif: 0,
      paudRa: { unit: 0, peserta: 0 },
      tkq: { unit: 0, peserta: 0 },
      sdSederajat: { unit: 0, peserta: 0 },
      sltpSederajat: { unit: 0, peserta: 0 },
      sltaSederajat: { unit: 0, peserta: 0 },
      perguruanTinggi: { unit: 0, peserta: 0 },
      pendidikanKeagamaan: { unit: 0, peserta: 0 },
      kursusBahasa: { unit: 0, peserta: 0 },
      kursusMontir: { unit: 0, peserta: 0 },
      kursusKomputer: { unit: 0, peserta: 0 },
      kursusKecantikan: { unit: 0, peserta: 0 },
      kursusRiasPengantin: { unit: 0, peserta: 0 },
      kursusLas: { unit: 0, peserta: 0 },
    },
    kesehatan: {
      rumahSakitUmum: 0,
      puskesmas: 0,
      puskesmasPembantu: 0,
      poliklinikKlinik: 0,
      apotik: 0,
      posyandu: 0,
      tokoObat: 0,
      praktekDokterBidan: 0,
      balitaDitimbang: 0,
      balitaGiziBaik: 0,
      balitaGiziKurang: 0,
      balitaStunting: 0,
      badutaTotal: 0,
      ibuHamilTotal: 0,
      ibuHamilResti: 0,
      lansiaTotal: 0,
      lansiaRistiPosbindu: 0,
      tunaRungu: 0,
      tunaWicara: 0,
      tunaNetra: 0,
      tunaDaksa: 0,
      lumpuh: 0,
      sumbing: 0,
      cacatMental: 0,
      keluargaPkh: 0,
      keluargaBpnt: 0,
      keluargaPbiJkn: 0,
    },
    sosialBudaya: {
      masjid: 0,
      langgarMushola: 0,
      gerejaKristen: 0,
      gerejaKatolik: 0,
      wihara: 0,
      pura: 0,
      lapanganSepakBola: 0,
      lapanganBuluTangkis: 0,
      lapanganVoli: 0,
      lapanganBasket: 0,
      lapanganTenisMeja: 0,
      lapanganFutsal: 0,
      sanggarSeniBudaya: 0,
    },
  };

  for (const item of items) {
    const k = item.kelembagaan;
    const kes = item.kesehatan;
    const sb = item.sosialBudaya;

    // Kelembagaan
    result.kelembagaan.karangTarunaUnit += k.karangTarunaUnit || 0;
    result.kelembagaan.karangTarunaAnggota += k.karangTarunaAnggota || 0;
    result.kelembagaan.posyanduUnit += k.posyanduUnit || 0;
    result.kelembagaan.posyanduKaderAktif += k.posyanduKaderAktif || 0;
    result.kelembagaan.kelompokPengajian += k.kelompokPengajian || 0;
    result.kelembagaan.kelompokArisan += k.kelompokArisan || 0;
    result.kelembagaan.relawanSosialBencana += k.relawanSosialBencana || 0;
    result.kelembagaan.pokjaPkkRw += k.pokjaPkkRw || 0;
    result.kelembagaan.dasawismaAktif += k.dasawismaAktif || 0;

    // Pendidikan
    result.kelembagaan.paudRa.unit += k.paudRa?.unit || 0;
    result.kelembagaan.paudRa.peserta = (result.kelembagaan.paudRa.peserta || 0) + (k.paudRa?.peserta || 0);
    result.kelembagaan.tkq.unit += k.tkq?.unit || 0;
    result.kelembagaan.tkq.peserta = (result.kelembagaan.tkq.peserta || 0) + (k.tkq?.peserta || 0);
    result.kelembagaan.sdSederajat.unit += k.sdSederajat?.unit || 0;
    result.kelembagaan.sdSederajat.peserta = (result.kelembagaan.sdSederajat.peserta || 0) + (k.sdSederajat?.peserta || 0);
    result.kelembagaan.sltpSederajat.unit += k.sltpSederajat?.unit || 0;
    result.kelembagaan.sltpSederajat.peserta = (result.kelembagaan.sltpSederajat.peserta || 0) + (k.sltpSederajat?.peserta || 0);
    result.kelembagaan.sltaSederajat.unit += k.sltaSederajat?.unit || 0;
    result.kelembagaan.sltaSederajat.peserta = (result.kelembagaan.sltaSederajat.peserta || 0) + (k.sltaSederajat?.peserta || 0);
    result.kelembagaan.perguruanTinggi.unit += k.perguruanTinggi?.unit || 0;
    result.kelembagaan.perguruanTinggi.peserta = (result.kelembagaan.perguruanTinggi.peserta || 0) + (k.perguruanTinggi?.peserta || 0);
    result.kelembagaan.pendidikanKeagamaan.unit += k.pendidikanKeagamaan?.unit || 0;
    result.kelembagaan.pendidikanKeagamaan.peserta = (result.kelembagaan.pendidikanKeagamaan.peserta || 0) + (k.pendidikanKeagamaan?.peserta || 0);
    result.kelembagaan.kursusBahasa.unit += k.kursusBahasa?.unit || 0;
    result.kelembagaan.kursusBahasa.peserta = (result.kelembagaan.kursusBahasa.peserta || 0) + (k.kursusBahasa?.peserta || 0);
    result.kelembagaan.kursusMontir.unit += k.kursusMontir?.unit || 0;
    result.kelembagaan.kursusMontir.peserta = (result.kelembagaan.kursusMontir.peserta || 0) + (k.kursusMontir?.peserta || 0);
    result.kelembagaan.kursusKomputer.unit += k.kursusKomputer?.unit || 0;
    result.kelembagaan.kursusKomputer.peserta = (result.kelembagaan.kursusKomputer.peserta || 0) + (k.kursusKomputer?.peserta || 0);
    result.kelembagaan.kursusKecantikan.unit += k.kursusKecantikan?.unit || 0;
    result.kelembagaan.kursusKecantikan.peserta = (result.kelembagaan.kursusKecantikan.peserta || 0) + (k.kursusKecantikan?.peserta || 0);
    result.kelembagaan.kursusRiasPengantin.unit += k.kursusRiasPengantin?.unit || 0;
    result.kelembagaan.kursusRiasPengantin.peserta = (result.kelembagaan.kursusRiasPengantin.peserta || 0) + (k.kursusRiasPengantin?.peserta || 0);
    result.kelembagaan.kursusLas.unit += k.kursusLas?.unit || 0;
    result.kelembagaan.kursusLas.peserta = (result.kelembagaan.kursusLas.peserta || 0) + (k.kursusLas?.peserta || 0);

    // Fasilitas Kesehatan
    result.kesehatan.rumahSakitUmum += kes.rumahSakitUmum || 0;
    result.kesehatan.puskesmas += kes.puskesmas || 0;
    result.kesehatan.puskesmasPembantu += kes.puskesmasPembantu || 0;
    result.kesehatan.poliklinikKlinik += kes.poliklinikKlinik || 0;
    result.kesehatan.apotik += kes.apotik || 0;
    result.kesehatan.posyandu += kes.posyandu || 0;
    result.kesehatan.tokoObat += kes.tokoObat || 0;
    result.kesehatan.praktekDokterBidan += kes.praktekDokterBidan || 0;

    // Gizi & Stunting
    result.kesehatan.balitaDitimbang += kes.balitaDitimbang || 0;
    result.kesehatan.balitaGiziBaik += kes.balitaGiziBaik || 0;
    result.kesehatan.balitaGiziKurang += kes.balitaGiziKurang || 0;
    result.kesehatan.balitaStunting += kes.balitaStunting || 0;
    result.kesehatan.badutaTotal += kes.badutaTotal || 0;
    result.kesehatan.ibuHamilTotal += kes.ibuHamilTotal || 0;
    result.kesehatan.ibuHamilResti += kes.ibuHamilResti || 0;
    result.kesehatan.lansiaTotal += kes.lansiaTotal || 0;
    result.kesehatan.lansiaRistiPosbindu += kes.lansiaRistiPosbindu || 0;

    // Disabilitas
    result.kesehatan.tunaRungu += kes.tunaRungu || 0;
    result.kesehatan.tunaWicara += kes.tunaWicara || 0;
    result.kesehatan.tunaNetra += kes.tunaNetra || 0;
    result.kesehatan.tunaDaksa += kes.tunaDaksa || 0;
    result.kesehatan.lumpuh += kes.lumpuh || 0;
    result.kesehatan.sumbing += kes.sumbing || 0;
    result.kesehatan.cacatMental += kes.cacatMental || 0;

    // Bansos
    result.kesehatan.keluargaPkh += kes.keluargaPkh || 0;
    result.kesehatan.keluargaBpnt += kes.keluargaBpnt || 0;
    result.kesehatan.keluargaPbiJkn += kes.keluargaPbiJkn || 0;

    // Sosial Budaya
    result.sosialBudaya.masjid += sb.masjid || 0;
    result.sosialBudaya.langgarMushola += sb.langgarMushola || 0;
    result.sosialBudaya.gerejaKristen += sb.gerejaKristen || 0;
    result.sosialBudaya.gerejaKatolik += sb.gerejaKatolik || 0;
    result.sosialBudaya.wihara += sb.wihara || 0;
    result.sosialBudaya.pura += sb.pura || 0;

    result.sosialBudaya.lapanganSepakBola += sb.lapanganSepakBola || 0;
    result.sosialBudaya.lapanganBuluTangkis += sb.lapanganBuluTangkis || 0;
    result.sosialBudaya.lapanganVoli += sb.lapanganVoli || 0;
    result.sosialBudaya.lapanganBasket += sb.lapanganBasket || 0;
    result.sosialBudaya.lapanganTenisMeja += sb.lapanganTenisMeja || 0;
    result.sosialBudaya.lapanganFutsal += sb.lapanganFutsal || 0;
    result.sosialBudaya.sanggarSeniBudaya += sb.sanggarSeniBudaya || 0;
  }

  return result;
}

export function generateProfilKesosCsv(
  agg: ProfilKesosAggregate,
  titleLabel: string = 'Kelurahan Lebakgede'
): string {
  const k = agg.kelembagaan;
  const kes = agg.kesehatan;
  const sb = agg.sosialBudaya;

  const lines: string[] = [
    'PROFIL KESEJAHTERAAN SOSIAL, KESEHATAN DAN KELEMBAGAAN',
    `WILAYAH: ${titleLabel.toUpperCase()}`,
    'KECAMATAN COBLONG - KOTA BANDUNG',
    `TAHUN ANGGARAN: 2026`,
    `TANGGAL UNDUH: ${new Date().toLocaleDateString('id-ID')}`,
    '',
    'NO,KATEGORI / VARIABEL INDIKATOR,JUMLAH / UNIT,KETERANGAN / SASARAN',
    '',
    'I. KELEMBAGAAN SOSIAL & KEMASYARAKATAN,,,',
    `1,Karang Taruna RW,${k.karangTarunaUnit} Unit,${k.karangTarunaAnggota} Orang Anggota Aktif`,
    `2,Pos Pelayanan Terpadu (Posyandu),${k.posyanduUnit} Unit,${k.posyanduKaderAktif} Orang Kader Aktif`,
    `3,Kelompok Pengajian Warga,${k.kelompokPengajian} Kelompok,Majelis Taklim & Pengajian Rutin`,
    `4,Kelompok Arisan Warga,${k.kelompokArisan} Kelompok,Kelompok Swadaya RT/RW`,
    `5,Relawan Sosial & Siaga Bencana,${k.relawanSosialBencana} Orang,Satgas Bencana / Relawan Sosial`,
    `6,Kelompok Kerja (Pokja) PKK RW,${k.pokjaPkkRw} Pokja,TP PKK Tingkat RW`,
    `7,Dasawisma PKK Aktif,${k.dasawismaAktif} Kelompok,Pemberdayaan Dasawisma`,
    '',
    'II. LEMBAGA PENDIDIKAN DI WILAYAH,,,',
    `1,PAUD / Raudhatul Athfal (RA),${k.paudRa.unit} Unit,${k.paudRa.peserta || 0} Siswa`,
    `2,Taman Kanak-Kanak / TKQ,${k.tkq.unit} Unit,${k.tkq.peserta || 0} Siswa`,
    `3,Sekolah Dasar (SD) / Sederajat,${k.sdSederajat.unit} Unit,${k.sdSederajat.peserta || 0} Siswa`,
    `4,SLTP / SMP / MTs,${k.sltpSederajat.unit} Unit,${k.sltpSederajat.peserta || 0} Siswa`,
    `5,SLTA / SMA / SMK / MA,${k.sltaSederajat.unit} Unit,${k.sltaSederajat.peserta || 0} Siswa`,
    `6,Perguruan Tinggi / Akademi,${k.perguruanTinggi.unit} Unit,${k.perguruanTinggi.peserta || 0} Mahasiswa`,
    `7,Pendidikan Keagamaan / Pesantren,${k.pendidikanKeagamaan.unit} Unit,${k.pendidikanKeagamaan.peserta || 0} Santri`,
    `8,Kursus Bahasa,${k.kursusBahasa?.unit || 0} Unit,${k.kursusBahasa?.peserta || 0} Pengajar`,
    `9,Kursus Montir,${k.kursusMontir?.unit || 0} Unit,${k.kursusMontir?.peserta || 0} Pengajar`,
    `10,Kursus Komputer,${k.kursusKomputer?.unit || 0} Unit,${k.kursusKomputer?.peserta || 0} Pengajar`,
    `11,Kursus Kecantikan,${k.kursusKecantikan?.unit || 0} Unit,${k.kursusKecantikan?.peserta || 0} Pengajar`,
    `12,Kursus Rias Pengantin,${k.kursusRiasPengantin?.unit || 0} Unit,${k.kursusRiasPengantin?.peserta || 0} Pengajar`,
    `13,Kursus Las,${k.kursusLas?.unit || 0} Unit,${k.kursusLas?.peserta || 0} Pengajar`,
    '',
    'III. PRASARANA FASILITAS KESEHATAN,,,',
    `1,Rumah Sakit Umum,${kes.rumahSakitUmum} Unit,-`,
    `2,Puskesmas Induk,${kes.puskesmas} Unit,-`,
    `3,Puskesmas Pembantu (Pustu),${kes.puskesmasPembantu} Unit,-`,
    `4,Poliklinik / Balai Pengobatan,${kes.poliklinikKlinik} Unit,-`,
    `5,Apotik,${kes.apotik} Unit,-`,
    `6,Posyandu Balita & Lansia,${kes.posyandu} Unit,-`,
    `7,Toko Obat Berizin,${kes.tokoObat} Unit,-`,
    `8,Praktek Dokter / Bidan Mandiri,${kes.praktekDokterBidan} Titik,-`,
    '',
    'IV. SASARAN PRIORITAS GIZI & PENCEGAHAN STUNTING (1000 HPK),,,',
    `1,Balita Ditimbang Rutin (0-59 Bln),${kes.balitaDitimbang} Jiwa,Sasaran Posyandu`,
    `2,Balita Gizi Baik (Normal),${kes.balitaGiziBaik} Jiwa,Tumbuh Kembang Baik`,
    `3,Balita Gizi Kurang (Pantau PMT),${kes.balitaGiziKurang} Jiwa,Penerima PMT Pemulihan`,
    `4,Balita Terindikasi Stunting,${kes.balitaStunting} Jiwa,Rujukan UPT Puskesmas`,
    `5,Baduta (0-23 Bulan - 1000 HPK),${kes.badutaTotal} Jiwa,Sasaran Intervensi Spesifik`,
    `6,Ibu Hamil Terdata,${kes.ibuHamilTotal} Jiwa,Pemeriksaan Rutin KIA`,
    `7,Ibu Hamil Risiko Tinggi (Resti/KEK),${kes.ibuHamilResti} Jiwa,Pantauan Bidan Kelurahan`,
    `8,Warga Lanjut Usia (Lansia),${kes.lansiaTotal} Jiwa,Peserta Posbindu PTM`,
    `9,Lansia Risti / Penyakit Kronis,${kes.lansiaRistiPosbindu} Jiwa,Perawatan Berkelanjutan`,
    '',
    'V. PENYANDANG DISABILITAS (CACAT FISIK / MENTAL),,,',
    `1,Tuna Rungu (Tuli),${kes.tunaRungu} Jiwa,-`,
    `2,Tuna Wicara (Bisu),${kes.tunaWicara} Jiwa,-`,
    `3,Tuna Netra (Buta),${kes.tunaNetra} Jiwa,-`,
    `4,Tuna Daksa (Cacat Tubuh),${kes.tunaDaksa} Jiwa,-`,
    `5,Lumpuh,${kes.lumpuh} Jiwa,-`,
    `6,Bibir Sumbing,${kes.sumbing} Jiwa,-`,
    `7,Cacat Mental / Disabilitas Intelektual,${kes.cacatMental} Jiwa,-`,
    '',
    'VI. PERLINDUNGAN SOSIAL & BANTUAN PEMERINTAH,,,',
    `1,Keluarga Penerima Manfaat PKH,${kes.keluargaPkh} KK,Program Keluarga Harapan`,
    `2,Keluarga Penerima BPNT / Sembako,${kes.keluargaBpnt} KK,Bantuan Pangan Non Tunai`,
    `3,Penerima Bantuan Iuran JKN (PBI-JK),${kes.keluargaPbiJkn} Jiwa,Jaminan Kesehatan Gratis`,
    '',
    'VII. PRASARANA PERIBADATAN,,,',
    `1,Masjid Jami,${sb.masjid} Unit,-`,
    `2,Langgar / Mushola,${sb.langgarMushola} Unit,-`,
    `3,Gereja Kristen Protestan,${sb.gerejaKristen} Unit,-`,
    `4,Gereja Katolik,${sb.gerejaKatolik} Unit,-`,
    `5,Wihara / Kelenteng,${sb.wihara} Unit,-`,
    `6,Pura,${sb.pura} Unit,-`,
    '',
    'VIII. PRASARANA OLAHRAGA & SENI BUDAYA,,,',
    `1,Lapangan Sepak Bola,${sb.lapanganSepakBola} Unit,-`,
    `2,Lapangan Bulu Tangkis,${sb.lapanganBuluTangkis} Unit,-`,
    `3,Lapangan Bola Voli,${sb.lapanganVoli} Unit,-`,
    `4,Lapangan Bola Basket,${sb.lapanganBasket} Unit,-`,
    `5,Meja Tenis Meja Warga,${sb.lapanganTenisMeja} Unit,-`,
    `6,Lapangan Futsal,${sb.lapanganFutsal} Unit,-`,
    `7,Sanggar Seni & Budaya,${sb.sanggarSeniBudaya} Kelompok,-`,
  ];

  return lines.join('\n');
}
