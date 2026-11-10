'use client';

import React, { useState, useMemo } from 'react';
import { useKelurahanStore } from '@/lib/store';
import { aggregateProfilEkbang, generateProfilEkbangCsv } from '@/lib/ekbang-calc';
import { triggerOfficialProfilExcelDownload } from '@/lib/download-profil-excel';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import {
  Download,
  Building,
  Trees,
  Store,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Users,
  Compass,
  ArrowRight,
  ShieldAlert,
  Droplets,
} from 'lucide-react';
import { RW_OPTIONS } from '@/config/modules';

export function ProfilEkbangLurahView() {
  const { getProfilEkbangList, getProfilKesosList } = useKelurahanStore();
  const allRwList = getProfilEkbangList();

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
    return aggregateProfilEkbang(activeList);
  }, [activeList]);

  // Export to CSV/Excel matching sheet PROFIL
  const handleExport = () => {
    const label =
      selectedFilter === 'ALL'
        ? 'Kelurahan Lebakgede (Total 16 RW)'
        : `Wilayah ${selectedFilter} Kelurahan Lebakgede`;

    const csvContent = generateProfilEkbangCsv(agg, label);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute(
      'download',
      `Profil-Ekbang-Lebakgede-${selectedFilter === 'ALL' ? 'Total-Kelurahan' : selectedFilter}-${dateStr}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      'Unduh Profil Berhasil',
      `File Profil Ekbang (${label}) format Excel/CSV berhasil disimpan.`
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white rounded-xl p-6 shadow-md border border-blue-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-1">
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Profil Kelurahan Lebakgede</span>
              <span>•</span>
              <span>Seksi Ekonomi & Pembangunan</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Rekapitulasi Profil Ekbang Kelurahan
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Angka-angka di bawah ini dihitung otomatis dari data yang diinput oleh Seksi Ekbang pada 16 RW.
              Bapak Lurah dapat meninjau rekapitulasi menyeluruh dan mengunduh berkas laporan profil resmi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => triggerOfficialProfilExcelDownload(selectedFilter, getProfilKesosList(), allRwList)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow-md flex items-center gap-2 px-5 py-2.5 h-auto text-sm border border-emerald-400"
              title="Unduh file Excel resmi dengan Sheet PROFIL 509 baris dan cover MODEL E standar pemerintah"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Excel Resmi (Standar Pemerintah)</span>
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white px-4 py-2.5 h-auto text-sm"
              title="Unduh ringkasan format CSV"
            >
              CSV Ringkas
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-blue-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-200 font-medium">Tampilkan Data:</span>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-white/10 text-white border border-blue-300/40 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-white"
            >
              <option value="ALL" className="text-slate-900">
                Semua RW (Total Kelurahan Lebakgede - 16 RW)
              </option>
              {RW_OPTIONS.map((rw) => (
                <option key={rw.value} value={rw.value} className="text-slate-900">
                  {rw.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-blue-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>
              {selectedFilter === 'ALL'
                ? `Akumulasi 16 RW terdata (${agg.rwTerdataCount} RW aktif)`
                : `Menampilkan rincian tunggal ${selectedFilter}`}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Luas Wilayah */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Luas Wilayah
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <Trees className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {agg.totalLuasWilayah.toLocaleString('id-ID')}{' '}
            <span className="text-sm font-normal text-slate-500">m²</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Permukiman:</span>
            <span className="font-semibold text-slate-700">
              {agg.totalLuasPermukiman.toLocaleString('id-ID')} m²
            </span>
          </div>
        </div>

        {/* Card 2: Usaha Ekonomi */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Usaha Ekonomi (16 Jenis)
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {agg.ekonomi.totalUnitUsaha.toLocaleString('id-ID')}{' '}
            <span className="text-sm font-normal text-slate-500">Unit Usaha</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Tenaga Kerja / Anggota:</span>
            <span className="font-semibold text-slate-700">
              {agg.ekonomi.totalTenagaKerja.toLocaleString('id-ID')} Orang
            </span>
          </div>
        </div>

        {/* Card 3: Jalan Lingkungan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jalan Lingkungan
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {agg.sarpras.totalPanjangJalan.toLocaleString('id-ID')}{' '}
            <span className="text-sm font-normal text-slate-500">Meter</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Aspal / Konblok:</span>
            <span className="font-semibold text-slate-700">
              {agg.sarpras.jalanAspalMeter} m / {agg.sarpras.jalanKonblokMeter} m
            </span>
          </div>
        </div>

        {/* Card 4: Titik Banjir & Drainase */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kerawanan Banjir
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {agg.daftarRtRawanBanjir.length}{' '}
            <span className="text-sm font-normal text-slate-500">RT Rawan Banjir</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Saluran Drainase:</span>
            <span className="font-semibold text-slate-700">
              {agg.sarpras.saluranDrainaseUnit} Segmen / Unit
            </span>
          </div>
        </div>
      </div>

      {/* Main Official Profile Preview Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pratinjau Format Resmi Sheet PROFIL Master Data (Seksi Ekbang)
            </h2>
            <p className="text-xs text-slate-500">
              Format baris dan angka di bawah ini persis sama dengan berkas Excel resmi yang diunduh.
            </p>
          </div>

          <Button
            onClick={handleExport}
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5 text-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas Excel</span>
          </Button>
        </div>

        <div className="divide-y divide-slate-200">
          {/* SECTION 1: I.F KELEMBAGAAN EKONOMI */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold text-xs">
                I.F
              </span>
              <h3 className="font-bold text-slate-900 text-base">KELEMBAGAAN EKONOMI (ekbang)</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
                  <tr>
                    <th className="py-2 px-3 w-12 text-center">No</th>
                    <th className="py-2 px-4">Jenis Lembaga / Usaha</th>
                    <th className="py-2 px-4 text-center">Jumlah Unit</th>
                    <th className="py-2 px-4 text-center">Jumlah Tenaga Kerja / Anggota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">1</td>
                    <td className="py-2 px-4 font-medium">Jumlah Koperasi</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.koperasi.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.koperasi.anggota} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">2</td>
                    <td className="py-2 px-4 font-medium">Industri Makanan</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.industriMakanan.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.industriMakanan.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">3</td>
                    <td className="py-2 px-4 font-medium">Industri Meubeul</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.industriMeubel.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.industriMeubel.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">4</td>
                    <td className="py-2 px-4 font-medium">Usaha Perdagangan</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.usahaPerdagangan.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.usahaPerdagangan.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">5</td>
                    <td className="py-2 px-4 font-medium">Warung Makan</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.warungMakan.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.warungMakan.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">6</td>
                    <td className="py-2 px-4 font-medium">Kios / Kelontong</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.kiosKelontong.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.kiosKelontong.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">7</td>
                    <td className="py-2 px-4 font-medium">Bengkel</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.bengkel.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.bengkel.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">8</td>
                    <td className="py-2 px-4 font-medium">Swalayan / Minimarket</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.swalayanMinimarket.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.swalayanMinimarket.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">9</td>
                    <td className="py-2 px-4 font-medium">Percetakan</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.percetakan.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.percetakan.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">10</td>
                    <td className="py-2 px-4 font-medium">Sablon</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.sablon.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.sablon.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">11</td>
                    <td className="py-2 px-4 font-medium">Konveksi</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.konveksi.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.konveksi.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">12</td>
                    <td className="py-2 px-4 font-medium">Cafe</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.cafe.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.cafe.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">13</td>
                    <td className="py-2 px-4 font-medium">Salon</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.salon.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.salon.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">14</td>
                    <td className="py-2 px-4 font-medium">Barbershop</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.barbershop.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-700">{agg.ekonomi.barbershop.tenagaKerja} Orang</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">15</td>
                    <td className="py-2 px-4 font-medium">Pasar Tradisional</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.pasarTradisional.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-400">-</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center text-slate-500">16</td>
                    <td className="py-2 px-4 font-medium">Pasar Kaget</td>
                    <td className="py-2 px-4 text-center font-bold text-blue-900">{agg.ekonomi.pasarKaget.unit} Unit</td>
                    <td className="py-2 px-4 text-center text-slate-400">-</td>
                  </tr>
                  <tr className="bg-amber-50/70 font-bold">
                    <td className="py-2.5 px-3 text-center">∑</td>
                    <td className="py-2.5 px-4 text-amber-900">TOTAL UNIT USAHA EKONOMI</td>
                    <td className="py-2.5 px-4 text-center text-amber-900">{agg.ekonomi.totalUnitUsaha} Unit</td>
                    <td className="py-2.5 px-4 text-center text-amber-900">{agg.ekonomi.totalTenagaKerja} Orang</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 2: II SUMBER DAYA ALAM (PERSIS GAMBAR) */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                II
              </span>
              <h3 className="font-bold text-slate-900 text-base">SUMBER DAYA ALAM (ekbang)</h3>
            </div>

            <div className="space-y-4">
              {/* II.A */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-sm text-[#1E3A8A] mb-2">A. Luas Daerah</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 block">1. Permukiman:</span>
                    <strong className="text-slate-900">{agg.totalLuasPermukiman.toLocaleString('id-ID')} m²</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">2. Kuburan:</span>
                    <strong className="text-slate-900">{agg.totalLuasKuburan.toLocaleString('id-ID')} m²</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">3. Pertanian:</span>
                    <strong className="text-slate-900">{agg.totalLuasPertanian.toLocaleString('id-ID')} m²</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">4. Taman:</span>
                    <strong className="text-slate-900">{agg.totalLuasTaman.toLocaleString('id-ID')} m²</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">5. Perkantoran:</span>
                    <strong className="text-slate-900">{agg.totalLuasPerkantoran.toLocaleString('id-ID')} m²</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">6. Prasarana Lainnya:</span>
                    <strong className="text-slate-900">{agg.totalLuasPrasaranaLain.toLocaleString('id-ID')} m²</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">7. Jumlah Titik Parkir:</span>
                    <strong className="text-slate-900">{agg.totalTitikParkir} Titik</strong>
                  </div>
                  <div className="bg-emerald-100/60 p-2 rounded">
                    <span className="text-xs text-emerald-800 block font-semibold">Total Luas Wilayah:</span>
                    <strong className="text-emerald-950">{agg.totalLuasWilayah.toLocaleString('id-ID')} m²</strong>
                  </div>
                </div>
              </div>

              {/* II.B Orbitas & Banjir */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-sm text-[#1E3A8A] mb-2">B. ORBITAS</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span>1. Jumlah Sungai/kali yang melalui wilayah: </span>
                    <strong className="text-slate-900">{agg.totalSungai} buah</strong>
                  </div>
                  <div>
                    <span>2. Titik Rawan Banjir: </span>
                    {agg.daftarRtRawanBanjir.length > 0 ? (
                      <span className="inline-flex flex-wrap gap-1 mt-1">
                        {agg.daftarRtRawanBanjir.map((r, i) => (
                          <span
                            key={i}
                            className="bg-rose-100 text-rose-800 text-xs px-2 py-0.5 rounded font-semibold"
                          >
                            {r.rw} ({r.rt})
                          </span>
                        ))}
                      </span>
                    ) : (
                      <strong className="text-emerald-700">Nihil / Tidak ada titik rawan banjir terdata</strong>
                    )}
                  </div>
                  <div>
                    <span>3. Bebas Banjir: </span>
                    <strong className="text-slate-900">{agg.daftarRtBebasBanjirCount} RT Terdata Aman</strong>
                  </div>
                </div>
              </div>

              {/* II.C Air */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-sm text-[#1E3A8A] mb-2">C. Sumber Daya Air</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block">Sumur Gali:</span>
                    <strong>{agg.sumurGaliUnit} Unit</strong>
                    <div className="text-xs text-slate-500 mt-1">Pengguna: {agg.sumurGaliKk} KK</div>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block">Sumur Pompa:</span>
                    <strong>{agg.sumurPompaUnit} Unit</strong>
                    <div className="text-xs text-slate-500 mt-1">Pengguna: {agg.sumurPompaKk} KK</div>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block">Hidran Umum:</span>
                    <strong>{agg.hidranUmumUnit} Unit</strong>
                    <div className="text-xs text-slate-500 mt-1">Pengguna: {agg.hidranUmumKk} KK</div>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block">Sambungan PDAM:</span>
                    <strong>{agg.pdamUnit} Sambungan</strong>
                    <div className="text-xs text-slate-500 mt-1">Pengguna: {agg.pdamKk} KK</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: IV POTENSI PRASARANA DAN SARANA */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                IV
              </span>
              <h3 className="font-bold text-slate-900 text-base">POTENSI PRASARANA DAN SARANA (ekbang)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-sm text-[#1E3A8A]">A. Transportasi Darat</h4>
                <div>Jalan di Aspal: <strong>{agg.sarpras.jalanAspalMeter} meter</strong></div>
                <div>Jalan Konblok: <strong>{agg.sarpras.jalanKonblokMeter} meter</strong></div>
                <div>Jalan Tanah: <strong>{agg.sarpras.jalanTanahMeter} meter</strong></div>
                <div className="pt-1 font-semibold text-emerald-800">
                  Total Jalan: {agg.sarpras.totalPanjangJalan} meter
                </div>
                <div className="pt-2 text-xs text-slate-600">
                  Jembatan Beton: {agg.sarpras.jembatanBetonUnit} | Jembatan Besi: {agg.sarpras.jembatanBesiUnit}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-sm text-[#1E3A8A]">C & D. Sanitasi & Drainase</h4>
                <div>MCK Umum: <strong>{agg.sarpras.mckUnit} unit</strong> (Pengguna: {agg.sarpras.mckPenggunaKk} KK)</div>
                <div>Saluran Drainase: <strong>{agg.sarpras.saluranDrainaseUnit} segmen</strong></div>
                <div>Balai RW: <strong>{agg.sarpras.kantorRwUnit} unit</strong></div>
                <div>TPS Sampah Umum: <strong>{agg.sarpras.tpsUmumCount} lokasi terdata</strong></div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-sm text-[#1E3A8A]">K. Hiburan & Pariwisata</h4>
                <div>Total Hotel: <strong>{agg.sarpras.totalHotel} unit</strong></div>
                <div className="text-xs text-slate-600">
                  (Bintang 5: {agg.sarpras.hotelBintang5}, Bintang 4: {agg.sarpras.hotelBintang4}, Melati: {agg.sarpras.hotelMelati})
                </div>
                <div>Restoran / Kuliner Besar: <strong>{agg.sarpras.restoran} unit</strong></div>
                <div>Hiburan Lain: <strong>{agg.sarpras.bilyar + agg.sarpras.karaoke} unit</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
