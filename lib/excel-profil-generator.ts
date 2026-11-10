import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { ProfilKesosRwData, ProfilKesosAggregate } from '@/types/kesos';
import { ProfilEkbangRwData, ProfilEkonomiRw } from '@/types/ekbang';

interface GenerateOptions {
  rw: string; // 'ALL' or 'RW 01' .. 'RW 16'
  kesosData: ProfilKesosRwData[];
  ekbangData: ProfilEkbangRwData[];
  aggKesos: ProfilKesosAggregate;
  aggEkbang: any;
  namaKetuaRw?: string;
  bulan?: string;
  tahun?: number;
}

export async function generateOfficialProfilExcel(options: GenerateOptions): Promise<Buffer> {
  const {
    rw,
    kesosData,
    ekbangData,
    aggKesos,
    aggEkbang,
    namaKetuaRw,
    bulan = 'November',
    tahun = 2026,
  } = options;

  // Robust path resolution for template file
  const candidatePaths = [
    path.join(process.cwd(), 'data', 'template_master.xlsx'),
    path.join(process.cwd(), 'data', 'template_profil.xlsx'),
  ];

  let templatePath = '';
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      templatePath = p;
      break;
    }
  }

  if (!templatePath) {
    throw new Error(
      `Master template data/template_master.xlsx tidak ditemukan. Lokasi dicari: ${candidatePaths[0]}`
    );
  }

  // Baca template .xlsx dengan ExcelJS agar border/style/merge tetap persis
  const outWb = new ExcelJS.Workbook();
  await outWb.xlsx.readFile(templatePath);

  const modelESheet = outWb.getWorksheet('MODEL E');
  const profilSheet = outWb.getWorksheet('PROFIL');

  if (!profilSheet) {
    throw new Error('Sheet PROFIL tidak ditemukan di master template.');
  }

  // Isi nilai sel tanpa mengubah style (border, font, alignment tetap dari template)
  const setCell = (sheet: ExcelJS.Worksheet, col: string, row: number, val: any) => {
    sheet.getCell(`${col}${row}`).value = val;
  };

  // Determine active dataset (single RW or aggregate)
  const isAll = rw === 'ALL';
  const targetKesosRw = isAll ? null : kesosData.find((k) => k.rw.toLowerCase() === rw.toLowerCase());
  const targetEkbangRw = isAll ? null : ekbangData.find((e) => e.rw.toLowerCase() === rw.toLowerCase());

  const kKesos = isAll ? aggKesos.kelembagaan : targetKesosRw?.kelembagaan;
  const kesHealth = isAll ? aggKesos.kesehatan : targetKesosRw?.kesehatan;
  const sbKesos = isAll ? aggKesos.sosialBudaya : targetKesosRw?.sosialBudaya;

  // 1. POPULATE SHEET: MODEL E (COVER PROFIL)
  if (modelESheet) {
    const clonedModelE = modelESheet;

    const rwLabel = isAll ? 'SELURUH RW (16 RW)' : rw.replace('RW ', '');
    setCell(clonedModelE, 'C', 11, rwLabel); // Row 11: RUKUN WARGA : 16
    setCell(clonedModelE, 'C', 12, 'LEBAKGEDE'); // KELURAHAN
    setCell(clonedModelE, 'C', 13, 'COBLONG'); // KECAMATAN
    setCell(clonedModelE, 'C', 14, 'BANDUNG'); // KOTA
    setCell(clonedModelE, 'C', 15, bulan.toUpperCase()); // BULAN
    setCell(clonedModelE, 'C', 16, tahun); // TAHUN

    const signName = isAll
      ? 'Bapak Lurah Lebakgede'
      : (namaKetuaRw || targetKesosRw?.namaKetuaRw || `Ketua ${rw}`);
    setCell(clonedModelE, 'E', 27, signName);

  }

  // 2. POPULATE SHEET: PROFIL (MAIN 509-ROW OFFICIAL SHEET)
  const clonedProfil = profilSheet;

  // --- I. POTENSI KELEMBAGAAN ---
  // Ormas RW (Rows 125-128)
  if (kKesos) {
    setCell(clonedProfil, 'L', 125, kKesos.karangTarunaUnit || 1);
    setCell(clonedProfil, 'O', 125, kKesos.karangTarunaAnggota || 0);

    setCell(clonedProfil, 'L', 126, kKesos.posyanduUnit || 1);
    setCell(clonedProfil, 'O', 126, kKesos.posyanduKaderAktif || 0);

    setCell(clonedProfil, 'L', 127, kKesos.kelompokPengajian || 0);
    setCell(clonedProfil, 'L', 128, kKesos.kelompokArisan || 0);

    // Lembaga Pendidikan (Rows 155-166)
    setCell(clonedProfil, 'I', 155, kKesos.paudRa?.unit || 0);
    setCell(clonedProfil, 'M', 155, kKesos.paudRa?.peserta || 0);

    setCell(clonedProfil, 'I', 156, kKesos.tkq?.unit || 0);
    setCell(clonedProfil, 'M', 156, kKesos.tkq?.peserta || 0);

    setCell(clonedProfil, 'I', 157, kKesos.sdSederajat?.unit || 0);
    setCell(clonedProfil, 'M', 157, kKesos.sdSederajat?.peserta || 0);

    setCell(clonedProfil, 'I', 158, kKesos.sltpSederajat?.unit || 0);
    setCell(clonedProfil, 'M', 158, kKesos.sltpSederajat?.peserta || 0);

    setCell(clonedProfil, 'I', 159, kKesos.sltaSederajat?.unit || 0);
    setCell(clonedProfil, 'M', 159, kKesos.sltaSederajat?.peserta || 0);

    setCell(clonedProfil, 'I', 160, kKesos.perguruanTinggi?.unit || 0);
    setCell(clonedProfil, 'M', 160, kKesos.perguruanTinggi?.peserta || 0);

    setCell(clonedProfil, 'I', 161, kKesos.pendidikanKeagamaan?.unit || 0);
    setCell(clonedProfil, 'M', 161, kKesos.pendidikanKeagamaan?.peserta || 0);

    setCell(clonedProfil, 'I', 162, kKesos.kursusBahasa?.unit || 0);
    setCell(clonedProfil, 'M', 162, kKesos.kursusBahasa?.peserta || 0);
    setCell(clonedProfil, 'I', 163, kKesos.kursusMontir?.unit || 0);
    setCell(clonedProfil, 'M', 163, kKesos.kursusMontir?.peserta || 0);
    setCell(clonedProfil, 'I', 164, kKesos.kursusKomputer?.unit || 0);
    setCell(clonedProfil, 'M', 164, kKesos.kursusKomputer?.peserta || 0);
    setCell(clonedProfil, 'I', 165, kKesos.kursusKecantikan?.unit || 0);
    setCell(clonedProfil, 'M', 165, kKesos.kursusKecantikan?.peserta || 0);
    setCell(clonedProfil, 'I', 166, kKesos.kursusRiasPengantin?.unit || 0);
    setCell(clonedProfil, 'M', 166, kKesos.kursusRiasPengantin?.peserta || 0);
    setCell(clonedProfil, 'I', 167, kKesos.kursusLas?.unit || 0);
    setCell(clonedProfil, 'M', 167, kKesos.kursusLas?.peserta || 0);
  }

  // Kelembagaan Ekonomi (Rows 137-151)
  const getEko = (key: string) => {
    if (isAll) {
      const item = aggEkbang?.ekonomi?.[key];
      return { unit: item?.unit || 0, tenagaKerja: item?.tenagaKerja || item?.anggota || 0 };
    }
    const item = targetEkbangRw?.ekonomi?.[key as keyof ProfilEkonomiRw];
    return { unit: item?.unit || 0, tenagaKerja: (item as any)?.tenagaKerja || 0 };
  };

  const ekoKoperasi = getEko('koperasi');
  setCell(clonedProfil, 'H', 137, ekoKoperasi.unit);
  setCell(clonedProfil, 'L', 137, ekoKoperasi.tenagaKerja);

  const ekoMakanan = getEko('industriMakanan');
  setCell(clonedProfil, 'H', 138, ekoMakanan.unit);
  setCell(clonedProfil, 'L', 138, ekoMakanan.tenagaKerja);

  const ekoMeubel = getEko('industriMeubel');
  setCell(clonedProfil, 'H', 139, ekoMeubel.unit);
  setCell(clonedProfil, 'L', 139, ekoMeubel.tenagaKerja);

  const ekoDagang = getEko('usahaPerdagangan');
  setCell(clonedProfil, 'H', 140, ekoDagang.unit);
  setCell(clonedProfil, 'L', 140, ekoDagang.tenagaKerja);

  const ekoWarung = getEko('warungMakan');
  setCell(clonedProfil, 'H', 141, ekoWarung.unit);
  setCell(clonedProfil, 'L', 141, ekoWarung.tenagaKerja);

  const ekoKios = getEko('kiosKelontong');
  setCell(clonedProfil, 'H', 142, ekoKios.unit);
  setCell(clonedProfil, 'L', 142, ekoKios.tenagaKerja);

  const ekoBengkel = getEko('bengkel');
  setCell(clonedProfil, 'H', 143, ekoBengkel.unit);
  setCell(clonedProfil, 'L', 143, ekoBengkel.tenagaKerja);

  const ekoSwalayan = getEko('swalayanMinimarket');
  setCell(clonedProfil, 'H', 144, ekoSwalayan.unit);
  setCell(clonedProfil, 'L', 144, ekoSwalayan.tenagaKerja);

  const ekoCetak = getEko('percetakan');
  setCell(clonedProfil, 'H', 145, ekoCetak.unit);
  setCell(clonedProfil, 'L', 145, ekoCetak.tenagaKerja);

  const ekoSablon = getEko('sablon');
  setCell(clonedProfil, 'H', 146, ekoSablon.unit);
  setCell(clonedProfil, 'L', 146, ekoSablon.tenagaKerja);

  const ekoKonveksi = getEko('konveksi');
  setCell(clonedProfil, 'H', 147, ekoKonveksi.unit);
  setCell(clonedProfil, 'L', 147, ekoKonveksi.tenagaKerja);

  const ekoCafe = getEko('cafe');
  setCell(clonedProfil, 'H', 148, ekoCafe.unit);
  setCell(clonedProfil, 'L', 148, ekoCafe.tenagaKerja);

  const ekoSalon = getEko('salon');
  setCell(clonedProfil, 'H', 149, ekoSalon.unit);
  setCell(clonedProfil, 'L', 149, ekoSalon.tenagaKerja);

  const ekoBarber = getEko('barbershop');
  setCell(clonedProfil, 'H', 150, ekoBarber.unit);
  setCell(clonedProfil, 'L', 150, ekoBarber.tenagaKerja);

  const ekoPasar = getEko('pasarTradisional');
  setCell(clonedProfil, 'H', 151, ekoPasar.unit);

  // --- II. SUMBER DAYA ALAM ---
  // Luas Wilayah (Rows 182-187)
  const luasPermukiman = isAll ? aggEkbang?.totalLuasPermukiman : targetEkbangRw?.sda?.luasPermukiman;
  const luasKuburan = isAll ? aggEkbang?.totalLuasKuburan : targetEkbangRw?.sda?.luasKuburan;
  const luasPertanian = isAll ? aggEkbang?.totalLuasPertanian : targetEkbangRw?.sda?.luasPertanian;
  const luasTaman = isAll ? aggEkbang?.totalLuasTaman : targetEkbangRw?.sda?.luasTaman;
  const luasPerkantoran = isAll ? aggEkbang?.totalLuasPerkantoran : targetEkbangRw?.sda?.luasPerkantoran;
  const luasPrasaranaLain = isAll ? aggEkbang?.totalLuasPrasaranaLain : targetEkbangRw?.sda?.luasPrasaranaLain;

  setCell(clonedProfil, 'I', 182, luasPermukiman || 0);
  setCell(clonedProfil, 'I', 183, luasKuburan || 0);
  setCell(clonedProfil, 'I', 184, luasPertanian || 0);
  setCell(clonedProfil, 'I', 185, luasTaman || 0);
  setCell(clonedProfil, 'I', 186, luasPerkantoran || 0);
  setCell(clonedProfil, 'I', 187, luasPrasaranaLain || 0);

  // Sumber Daya Air (Rows 230-234)
  const sumurGaliUnit = isAll ? aggEkbang?.sumurGaliUnit : targetEkbangRw?.sda?.sumurGaliUnit;
  const sumurGaliKk = isAll ? aggEkbang?.sumurGaliKk : targetEkbangRw?.sda?.sumurGaliKk;
  const sumurPompaUnit = isAll ? aggEkbang?.sumurPompaUnit : targetEkbangRw?.sda?.sumurPompaUnit;
  const sumurPompaKk = isAll ? aggEkbang?.sumurPompaKk : targetEkbangRw?.sda?.sumurPompaKk;
  const hidranUmumUnit = isAll ? aggEkbang?.hidranUmumUnit : targetEkbangRw?.sda?.hidranUmumUnit;
  const hidranUmumKk = isAll ? aggEkbang?.hidranUmumKk : targetEkbangRw?.sda?.hidranUmumKk;
  const pdamUnit = isAll ? aggEkbang?.pdamUnit : targetEkbangRw?.sda?.pdamUnit;
  const pdamKk = isAll ? aggEkbang?.pdamKk : targetEkbangRw?.sda?.pdamKk;

  setCell(clonedProfil, 'G', 230, sumurGaliUnit || 0);
  setCell(clonedProfil, 'J', 230, sumurGaliKk || 0);

  setCell(clonedProfil, 'G', 231, sumurPompaUnit || 0);
  setCell(clonedProfil, 'J', 231, sumurPompaKk || 0);

  setCell(clonedProfil, 'G', 232, hidranUmumUnit || 0);
  setCell(clonedProfil, 'J', 232, hidranUmumKk || 0);

  setCell(clonedProfil, 'G', 234, pdamUnit || 0);
  setCell(clonedProfil, 'J', 234, pdamKk || 0);

  // --- III. POTENSI SUMBER DAYA MANUSIA: Cacat Mental Fisik (Rows 338-347) ---
  if (kesHealth) {
    setCell(clonedProfil, 'I', 338, kesHealth.tunaRungu || 0);
    setCell(clonedProfil, 'I', 339, kesHealth.tunaWicara || 0);
    setCell(clonedProfil, 'I', 340, kesHealth.tunaNetra || 0);
    setCell(clonedProfil, 'I', 341, kesHealth.tunaDaksa || 0);
    setCell(clonedProfil, 'I', 342, kesHealth.lumpuh || 0);

    setCell(clonedProfil, 'I', 346, kesHealth.cacatMental || 0);
    setCell(clonedProfil, 'I', 347, 0); // Stres
  }

  // --- IV. POTENSI PRASARANA DAN SARANA ---
  // Transportasi (Rows 396-412)
  const jalanAspal = isAll ? aggEkbang?.sarpras?.jalanAspalMeter : targetEkbangRw?.sarpras?.jalanAspalMeter;
  const jalanKonblok = isAll ? aggEkbang?.sarpras?.jalanKonblokMeter : targetEkbangRw?.sarpras?.jalanKonblokMeter;
  const jalanTanah = isAll ? aggEkbang?.sarpras?.jalanTanahMeter : targetEkbangRw?.sarpras?.jalanTanahMeter;

  const jembatanBeton = isAll ? aggEkbang?.sarpras?.jembatanBetonUnit : targetEkbangRw?.sarpras?.jembatanBetonUnit;
  const jembatanBesi = isAll ? aggEkbang?.sarpras?.jembatanBesiUnit : targetEkbangRw?.sarpras?.jembatanBesiUnit;
  const jembatanKayu = isAll ? aggEkbang?.sarpras?.jembatanKayuUnit : targetEkbangRw?.sarpras?.jembatanKayuUnit;

  setCell(clonedProfil, 'I', 396, jalanAspal || 0);
  setCell(clonedProfil, 'I', 397, jalanKonblok || 0);
  setCell(clonedProfil, 'I', 398, jalanTanah || 0);

  setCell(clonedProfil, 'I', 403, jembatanBeton || 0);
  setCell(clonedProfil, 'I', 404, jembatanBesi || 0);
  setCell(clonedProfil, 'I', 405, jembatanKayu || 0);

  // Peribadatan (Rows 452-456)
  if (sbKesos) {
    setCell(clonedProfil, 'I', 452, sbKesos.masjid || 0);
    setCell(clonedProfil, 'I', 453, sbKesos.langgarMushola || 0);
    setCell(clonedProfil, 'I', 454, sbKesos.gerejaKristen || 0);
    setCell(clonedProfil, 'I', 455, sbKesos.gerejaKatolik || 0);
    setCell(clonedProfil, 'I', 456, sbKesos.wihara || 0);
    setCell(clonedProfil, 'I', 457, sbKesos.pura || 0);

    // Olahraga (Rows 460-468)
    setCell(clonedProfil, 'I', 460, sbKesos.lapanganSepakBola || 0);
    setCell(clonedProfil, 'I', 461, sbKesos.lapanganBuluTangkis || 0);
    setCell(clonedProfil, 'I', 462, sbKesos.lapanganVoli || 0);
    setCell(clonedProfil, 'I', 465, sbKesos.lapanganBasket || 0);
    setCell(clonedProfil, 'I', 467, sbKesos.lapanganTenisMeja || 0);
    setCell(clonedProfil, 'I', 468, sbKesos.lapanganFutsal || 0);
  }

  // Kesehatan (Rows 471-479)
  if (kesHealth) {
    setCell(clonedProfil, 'I', 471, kesHealth.rumahSakitUmum || 0);
    setCell(clonedProfil, 'I', 472, kesHealth.puskesmas || 0);
    setCell(clonedProfil, 'I', 473, kesHealth.puskesmasPembantu || 0);
    setCell(clonedProfil, 'I', 474, kesHealth.poliklinikKlinik || 0);
    setCell(clonedProfil, 'I', 475, kesHealth.apotik || 0);
    setCell(clonedProfil, 'I', 476, kesHealth.posyandu || 0);
    setCell(clonedProfil, 'I', 477, kesHealth.tokoObat || 0);
    setCell(clonedProfil, 'I', 478, kesHealth.praktekDokterBidan || 0);
  }

  // Hitung ulang rumus (COUNTIFS dsb.) saat file dibuka di Excel
  outWb.calcProperties.fullCalcOnLoad = true;

  const arr = await outWb.xlsx.writeBuffer();
  return Buffer.from(arr as ArrayBuffer);
}
