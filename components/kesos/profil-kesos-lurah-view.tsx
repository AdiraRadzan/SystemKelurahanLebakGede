'use client';

import React, { useState, useMemo } from 'react';
import { useKelurahanStore } from '@/lib/store';
import { aggregateProfilKesos, generateProfilKesosCsv } from '@/lib/kesos-calc';
import { triggerOfficialProfilExcelDownload } from '@/lib/download-profil-excel';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import {
  Download,
  Users,
  HeartPulse,
  Landmark,
  Layers,
  Baby,
  Stethoscope,
  School,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { RW_OPTIONS } from '@/config/modules';

export function ProfilKesosLurahView() {
  const { getProfilKesosList, getProfilEkbangList } = useKelurahanStore();
  const allRwList = getProfilKesosList();

  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Filter list
  const activeList = useMemo(() => {
    if (selectedFilter === 'ALL') {
      return allRwList;
    }
    return allRwList.filter((item) => item.rw === selectedFilter);
  }, [allRwList, selectedFilter]);

  // Aggregation
  const agg = useMemo(() => {
    return aggregateProfilKesos(activeList);
  }, [activeList]);

  // Export to CSV/Excel matching sheet PROFIL
  const handleExport = () => {
    const label =
      selectedFilter === 'ALL'
        ? 'Kelurahan Lebakgede (Total 16 RW)'
        : `Wilayah ${selectedFilter} Kelurahan Lebakgede`;

    const csvContent = generateProfilKesosCsv(agg, label);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute(
      'download',
      `Profil-Kesos-Lebakgede-${selectedFilter === 'ALL' ? 'Total-Kelurahan' : selectedFilter}-${dateStr}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      'Unduh Berhasil',
      `Laporan Profil Kesos (${label}) berhasil diekspor format spreadsheet.`
    );
  };

  const k = agg.kelembagaan;
  const kes = agg.kesehatan;
  const sb = agg.sosialBudaya;

  const totalBalita = kes.balitaDitimbang || 1;
  const persenGiziBaik = Math.round((kes.balitaGiziBaik / totalBalita) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-indigo-950 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
              Laporan Eksekutif Pimpinan
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              16 Rukun Warga (RW 01 s/d RW 16)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Rekapitulasi Profil Kesejahteraan Sosial & Kesehatan
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Ringkasan data kelembagaan mitra, prasarana kesehatan & pendidikan, pemantauan stunting 1000 HPK,
            disabilitas PMKS, dan bantuan sosial seluruh wilayah Kelurahan Lebakgede.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <Button
            onClick={() => triggerOfficialProfilExcelDownload(selectedFilter, allRwList, getProfilEkbangList())}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs h-10 px-4 shadow-sm border border-emerald-400"
            title="Unduh file Excel resmi dengan Sheet PROFIL 509 baris dan cover MODEL E standar pemerintah"
          >
            <Download className="w-4 h-4 mr-2" />
            Unduh Excel Resmi (Standar Pemerintah)
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:text-white text-xs h-10 px-3.5"
            title="Unduh ringkasan format CSV"
          >
            CSV Ringkas
          </Button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-[#1E3A8A]" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Lingkup Data Tampilan:
          </span>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#1E3A8A] focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A] cursor-pointer"
          >
            <option value="ALL">Seluruh Wilayah (Total 16 RW Lebakgede)</option>
            {RW_OPTIONS.map((rw) => (
              <option key={rw.value} value={rw.value}>
                Khusus {rw.label} {rw.value === 'RW 16' ? '(Sekeloa)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan: <strong className="text-slate-800">{activeList.length} Rukun Warga</strong>
        </div>
      </div>

      {/* 3. Top Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Posyandu & Kader */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Posyandu & Kader
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {kes.posyandu} <span className="text-xs font-medium text-slate-500">Unit Posyandu</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span><strong>{k.posyanduKaderAktif}</strong> Kader Posyandu Aktif</span>
          </div>
        </div>

        {/* Card 2: Balita & Stunting */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Balita & Tumbuh Kembang
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {kes.balitaDitimbang} <span className="text-xs font-medium text-slate-500">Balita Ditimbang</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span className="text-emerald-700 font-semibold">{persenGiziBaik}% Gizi Baik</span>
            <span className="text-rose-700 font-bold">{kes.balitaStunting} Stunting</span>
          </div>
        </div>

        {/* Card 3: 1000 HPK & Ibu Hamil */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1000 HPK & Ibu Hamil
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {kes.badutaTotal} <span className="text-xs font-medium text-slate-500">Baduta (0-23 Bln)</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span><strong>{kes.ibuHamilTotal}</strong> Ibu Hamil</span>
            <span className="text-rose-600 font-semibold">{kes.ibuHamilResti} Resti</span>
          </div>
        </div>

        {/* Card 4: Perlindungan Bansos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Bantuan Sosial (KPM)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {kes.keluargaPkh + kes.keluargaBpnt} <span className="text-xs font-medium text-slate-500">Keluarga</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>PKH: <strong>{kes.keluargaPkh}</strong> KK</span>
            <span>BPNT: <strong>{kes.keluargaBpnt}</strong> KK</span>
          </div>
        </div>
      </div>

      {/* 4. Detailed Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section A: Pencegahan Stunting & Sasaran Kesehatan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">
                Pencegahan Stunting & Sasaran Kesehatan
              </h2>
            </div>
            <span className="text-2xs font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
              Prioritas Kelurahan
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Balita Ditimbang Rutin (0-59 Bulan)</span>
              <span className="font-bold text-slate-900">{kes.balitaDitimbang} Jiwa</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Balita Status Gizi Baik (Normal)</span>
              <span className="font-bold text-emerald-600">{kes.balitaGiziBaik} Jiwa ({persenGiziBaik}%)</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Balita Gizi Kurang (Perlu Intervensi PMT)</span>
              <span className="font-bold text-amber-600">{kes.balitaGiziKurang} Jiwa</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
              <span className="text-slate-600 font-semibold text-rose-800">Balita Terindikasi Stunting</span>
              <span className="font-extrabold text-rose-600">{kes.balitaStunting} Jiwa</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Baduta Sasaran 1000 HPK (0-23 Bulan)</span>
              <span className="font-bold text-indigo-700">{kes.badutaTotal} Jiwa</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Ibu Hamil Terdata / Risiko Tinggi (Resti)</span>
              <span className="font-bold text-slate-900">
                {kes.ibuHamilTotal} / <span className="text-rose-600">{kes.ibuHamilResti} Resti</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5">
              <span className="text-slate-600">Warga Lansia Terdata / Risti Posbindu</span>
              <span className="font-bold text-slate-900">
                {kes.lansiaTotal} / <span className="text-amber-600">{kes.lansiaRistiPosbindu} Risti</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section B: Prasarana Kesehatan & Kelembagaan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#1E3A8A]" />
              <h2 className="text-base font-bold text-slate-900">
                Prasarana Kesehatan & Lembaga Mitra
              </h2>
            </div>
            <span className="text-2xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              Fasilitas Wilayah
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Posyandu Aktif</span>
              <span className="text-lg font-bold text-slate-900">{kes.posyandu} Unit</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Puskesmas / Pustu</span>
              <span className="text-lg font-bold text-slate-900">{kes.puskesmas + kes.puskesmasPembantu} Unit</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Klinik & Balai Pengobatan</span>
              <span className="text-lg font-bold text-slate-900">{kes.poliklinikKlinik} Unit</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Apotik & Toko Obat</span>
              <span className="text-lg font-bold text-slate-900">{kes.apotik + kes.tokoObat} Unit</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Praktik Dokter / Bidan</span>
              <span className="text-lg font-bold text-slate-900">{kes.praktekDokterBidan} Titik</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Dasawisma PKK Aktif</span>
              <span className="text-lg font-bold text-slate-900">{k.dasawismaAktif} Kelompok</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Karang Taruna: <strong>{k.karangTarunaUnit} Unit ({k.karangTarunaAnggota} Anggota)</strong></span>
            <span>Relawan Sosial: <strong>{k.relawanSosialBencana} Jiwa</strong></span>
          </div>
        </div>

        {/* Section C: Penyandang Disabilitas (PMKS) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Penyandang Disabilitas (Cacat Fisik / Mental)
              </h2>
            </div>
            <span className="text-2xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
              Master Profil III.C
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs mb-1">Tuna Rungu</span>
              <span className="text-base font-bold text-slate-900">{kes.tunaRungu} Jiwa</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs mb-1">Tuna Wicara</span>
              <span className="text-base font-bold text-slate-900">{kes.tunaWicara} Jiwa</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs mb-1">Tuna Netra</span>
              <span className="text-base font-bold text-slate-900">{kes.tunaNetra} Jiwa</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs mb-1">Tuna Daksa</span>
              <span className="text-base font-bold text-slate-900">{kes.tunaDaksa} Jiwa</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs mb-1">Lumpuh</span>
              <span className="text-base font-bold text-slate-900">{kes.lumpuh} Jiwa</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-2xs mb-1">Bibir Sumbing</span>
              <span className="text-base font-bold text-slate-900">{kes.sumbing} Jiwa</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-2">
              <span className="text-slate-500 block text-2xs mb-1">Cacat Mental / Disabilitas Intelektual</span>
              <span className="text-base font-bold text-slate-900">{kes.cacatMental} Jiwa</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-semibold">Penerima Jaminan Kesehatan Gratis (PBI JKN)</span>
            <span className="text-sm font-extrabold text-emerald-800">{kes.keluargaPbiJkn} Jiwa</span>
          </div>
        </div>

        {/* Section D: Lembaga Pendidikan, Ibadah & Olahraga */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#1E3A8A]" />
              <h2 className="text-base font-bold text-slate-900">
                Pendidikan, Ibadah & Olahraga
              </h2>
            </div>
            <span className="text-2xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              Sarana Sosial
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">PAUD / RA / TK / TKQ</span>
              <span className="font-bold text-slate-900">
                {k.paudRa.unit + k.tkq.unit} Unit ({ (k.paudRa.peserta || 0) + (k.tkq.peserta || 0) } Siswa)
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">SD / SLTP / SLTA Sederajat</span>
              <span className="font-bold text-slate-900">
                {k.sdSederajat.unit + k.sltpSederajat.unit + k.sltaSederajat.unit} Sekolah
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Pendidikan Keagamaan (Pesantren / Diniyah)</span>
              <span className="font-bold text-slate-900">{k.pendidikanKeagamaan.unit} Lembaga ({k.pendidikanKeagamaan.peserta || 0} Santri)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Tempat Ibadah (Masjid / Mushola / Gereja)</span>
              <span className="font-bold text-slate-900">
                {sb.masjid} Masjid, {sb.langgarMushola} Mushola, {sb.gerejaKristen + sb.gerejaKatolik} Gereja
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-600">Prasarana Olahraga Lingkungan</span>
              <span className="font-bold text-slate-900">
                {sb.lapanganSepakBola + sb.lapanganBuluTangkis + sb.lapanganVoli + sb.lapanganFutsal} Lapangan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Matrix Table 16 RW */}
      {selectedFilter === 'ALL' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1E3A8A]" />
              <h3 className="text-sm font-bold text-slate-800">
                Matriks Perbandingan Indikator Kesos Antar-RW (RW 01 s/d RW 16)
              </h3>
            </div>
            <span className="text-xs text-slate-500">16 Rukun Warga</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/75 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Wilayah RW</th>
                  <th className="py-3 px-3">Ketua RW</th>
                  <th className="py-3 px-3 text-center">Posyandu</th>
                  <th className="py-3 px-3 text-center">Balita</th>
                  <th className="py-3 px-3 text-center">Gizi Kurang</th>
                  <th className="py-3 px-3 text-center text-rose-700">Stunting</th>
                  <th className="py-3 px-3 text-center">Baduta</th>
                  <th className="py-3 px-3 text-center">Ibu Hamil</th>
                  <th className="py-3 px-3 text-center">Lansia</th>
                  <th className="py-3 px-3 text-center">Bansos (PKH/BPNT)</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allRwList.map((rwData) => {
                  const kesRw = rwData.kesehatan;
                  const isStuntingExist = kesRw.balitaStunting > 0;
                  return (
                    <tr key={rwData.rw} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {rwData.rw} {rwData.rw === 'RW 16' ? '(Sekeloa)' : ''}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{rwData.namaKetuaRw || '-'}</td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">
                        {kesRw.posyandu} Unit
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">
                        {kesRw.balitaDitimbang}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          kesRw.balitaGiziKurang > 0 ? 'bg-amber-100 text-amber-800' : 'text-slate-400'
                        }`}>
                          {kesRw.balitaGiziKurang}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          isStuntingExist ? 'bg-rose-100 text-rose-800' : 'text-emerald-700'
                        }`}>
                          {kesRw.balitaStunting}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {kesRw.badutaTotal}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {kesRw.ibuHamilTotal}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {kesRw.lansiaTotal}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-indigo-800">
                        {kesRw.keluargaPkh + kesRw.keluargaBpnt} KK
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFilter(rwData.rw)}
                          className="text-2xs text-[#1E3A8A] hover:bg-blue-100 h-7 px-2"
                        >
                          Lihat Detail
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
