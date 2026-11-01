'use client';

import React, { useState, useEffect } from 'react';
import { useKelurahanStore } from '@/lib/store';
import { ProfilEkbangRwData, ProfilSdaRw, ProfilEkonomiRw, ProfilSarprasRw } from '@/types/ekbang';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import {
  Trees,
  Store,
  Building2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  Droplets,
  HelpCircle,
} from 'lucide-react';
import { RW_OPTIONS } from '@/config/modules';

export function ProfilEkbangCrudView() {
  const { getProfilEkbangList, updateProfilEkbangByRw, getProfilEkbangByRw } = useKelurahanStore();

  const [selectedRw, setSelectedRw] = useState<string>('RW 01');
  const [activeTab, setActiveTab] = useState<'sda' | 'ekonomi' | 'sarpras'>('sda');
  const [formData, setFormData] = useState<ProfilEkbangRwData | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Load selected RW data
  useEffect(() => {
    const rwData = getProfilEkbangByRw(selectedRw);
    if (rwData) {
      // deep copy
      setFormData(JSON.parse(JSON.stringify(rwData)));
      setIsSaved(true);
    }
  }, [selectedRw, getProfilEkbangByRw]);

  if (!formData) {
    return (
      <div className="p-8 text-center text-slate-500">
        Memuat data profil kewilayahan...
      </div>
    );
  }

  const allRwList = getProfilEkbangList();

  // Helper updates
  const updateSda = <K extends keyof ProfilSdaRw>(field: K, value: ProfilSdaRw[K]) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sda: {
          ...prev.sda,
          [field]: value,
        },
      };
    });
    setIsSaved(false);
  };

  const updateEkonomi = <K extends keyof ProfilEkonomiRw>(field: K, subField: 'unit' | 'tenagaKerja', value: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const current = prev.ekonomi[field] as any;
      return {
        ...prev,
        ekonomi: {
          ...prev.ekonomi,
          [field]: {
            ...current,
            [subField]: value,
          },
        },
      };
    });
    setIsSaved(false);
  };

  const updateSarpras = <K extends keyof ProfilSarprasRw>(field: K, value: ProfilSarprasRw[K]) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sarpras: {
          ...prev.sarpras,
          [field]: value,
        },
      };
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!formData) return;
    updateProfilEkbangByRw(selectedRw, formData);
    setIsSaved(true);
    toast.success(
      `Data ${selectedRw} Tersimpan`,
      `Perubahan data profil Sumber Daya Alam, Ekonomi, dan Sarpras ${selectedRw} berhasil diperbarui.`
    );
  };

  const handleReset = () => {
    const rwData = getProfilEkbangByRw(selectedRw);
    if (rwData) {
      setFormData(JSON.parse(JSON.stringify(rwData)));
      setIsSaved(true);
      toast.info('Form Direset', `Data dikembalikan ke kondisi terakhir tersimpan.`);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] text-white rounded-xl p-6 shadow-md border border-blue-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-1">
              <Trees className="w-4 h-4" />
              <span>Seksi Ekonomi & Pembangunan (Ekbang)</span>
              <ChevronRight className="w-3 h-3" />
              <span>Manajemen Data Profil</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Kelola Profil Kewilayahan Ekbang
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Input dan pemutakhiran data profil per Rukun Warga (RW). Angka yang disimpan akan otomatis
              terakumulasi pada lembar Profil Kelurahan resmi yang diekspor oleh Bapak Lurah.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md flex items-center gap-2 px-5 py-2.5 h-auto text-base"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Data {selectedRw}</span>
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-4 pt-4 border-t border-blue-400/30 flex flex-wrap items-center justify-between text-xs text-blue-100 gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-300" />
            <span>
              Peran Anda (Sie Ekbang): <strong>Fokus Input & CRUD</strong> data. Fungsi ekspor resmi tingkat kelurahan disediakan pada akun <strong>Lurah</strong>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>Terakhir dimutakhirkan: {formData.terakhirDiperbarui || '-'}</span>
          </div>
        </div>
      </div>

      {/* RW Selector & Status Strip */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <label className="block text-sm font-bold text-slate-800 mb-2">
          PILIH RUKUN WARGA (RW) YANG DIKELOLA:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-2">
          {allRwList.map((rwItem) => {
            const isSelected = rwItem.rw === selectedRw;
            const hasData = rwItem.sda.luasPermukiman > 0 || rwItem.sarpras.jalanAspalMeter > 0;
            return (
              <button
                key={rwItem.rw}
                type="button"
                onClick={() => setSelectedRw(rwItem.rw)}
                className={`py-2 px-1 text-center rounded-lg border text-sm font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md ring-2 ring-blue-300'
                    : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>{rwItem.rw}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasData ? (isSelected ? 'bg-emerald-300' : 'bg-emerald-500') : 'bg-slate-300'
                  }`}
                  title={hasData ? 'Data Terisi' : 'Data Kosong / Default'}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('sda')}
            className={`flex-1 py-4 px-4 text-center font-bold text-sm sm:text-base flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'sda'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Trees className="w-5 h-5 text-emerald-600" />
            <span>II. Sumber Daya Alam & Orbitas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ekonomi')}
            className={`flex-1 py-4 px-4 text-center font-bold text-sm sm:text-base flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'ekonomi'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Store className="w-5 h-5 text-amber-600" />
            <span>I.F Kelembagaan Ekonomi (16 Usaha)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sarpras')}
            className={`flex-1 py-4 px-4 text-center font-bold text-sm sm:text-base flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'sarpras'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>IV. Potensi Prasarana & Sarana Fisik</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* ======================================================== */}
          {/* TAB 1: SUMBER DAYA ALAM & ORBITAS                       */}
          {/* ======================================================== */}
          {activeTab === 'sda' && (
            <div className="space-y-8">
              {/* Bagian A: Luas Daerah */}
              <div>
                <div className="border-b border-slate-200 pb-2 mb-4">
                  <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-[#1E3A8A] inline-flex items-center justify-center text-sm">
                      A
                    </span>
                    Luas Daerah {selectedRw} (dalam Meter Persegi / m²)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mengisi bagian II.A Luas Daerah RW pada lembar Profil.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      1. Luas Permukiman (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sda.luasPermukiman}
                      onChange={(e) => updateSda('luasPermukiman', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      2. Luas Kuburan (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sda.luasKuburan}
                      onChange={(e) => updateSda('luasKuburan', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      3. Luas Pertanian / Kebun (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sda.luasPertanian}
                      onChange={(e) => updateSda('luasPertanian', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      4. Luas Taman Lingkungan (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sda.luasTaman}
                      onChange={(e) => updateSda('luasTaman', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      5. Luas Perkantoran (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sda.luasPerkantoran}
                      onChange={(e) => updateSda('luasPerkantoran', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      6. Luas Prasarana Umum Lainnya (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sda.luasPrasaranaLain}
                      onChange={(e) => updateSda('luasPrasaranaLain', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900"
                      placeholder="0"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      7. Jumlah Titik Parkir Resmi / Fasum (Titik)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sda.titikParkir}
                      onChange={(e) => updateSda('titikParkir', Number(e.target.value))}
                      className="w-full max-w-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian B: Orbitas & Banjir */}
              <div>
                <div className="border-b border-slate-200 pb-2 mb-4">
                  <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-[#1E3A8A] inline-flex items-center justify-center text-sm">
                      B
                    </span>
                    ORBITAS, Sungai & Pemetaan Rawan Banjir
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data keberadaan aliran sungai/kali dan status rawan banjir per RT (RT 01 s/d RT 10).
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Jumlah Sungai / Kali yang Melalui {selectedRw} (Buah)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sda.jumlahSungai}
                    onChange={(e) => updateSda('jumlahSungai', Number(e.target.value))}
                    className="w-48 px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 font-medium text-slate-900"
                    placeholder="0"
                  />
                </div>

                {/* Grid Rawan Banjir RT 01 - RT 10 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">
                    Status Rawan Banjir & Nama Aliran Sungai per RT (RT 01 - RT 10):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {Array.from({ length: 10 }, (_, idx) => {
                      const rtKey = `RT ${String(idx + 1).padStart(2, '0')}`;
                      const isRawan = formData.sda.rawanBanjirPerRt[rtKey] === 'Ya';
                      return (
                        <div key={rtKey} className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                          <span className="font-bold text-sm text-[#1E3A8A] block mb-1.5">{rtKey}</span>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-slate-500 block mb-1">Status Banjir:</span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextRawan = { ...formData.sda.rawanBanjirPerRt, [rtKey]: 'Ya' as const };
                                    const nextBebas = { ...formData.sda.bebasBanjirPerRt, [rtKey]: 'Tidak' as const };
                                    setFormData((prev) => prev ? {
                                      ...prev,
                                      sda: { ...prev.sda, rawanBanjirPerRt: nextRawan, bebasBanjirPerRt: nextBebas }
                                    } : prev);
                                    setIsSaved(false);
                                  }}
                                  className={`text-xs px-2 py-1 rounded font-semibold transition-all ${
                                    isRawan ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  Rawan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextRawan = { ...formData.sda.rawanBanjirPerRt, [rtKey]: 'Tidak' as const };
                                    const nextBebas = { ...formData.sda.bebasBanjirPerRt, [rtKey]: 'Ya' as const };
                                    setFormData((prev) => prev ? {
                                      ...prev,
                                      sda: { ...prev.sda, rawanBanjirPerRt: nextRawan, bebasBanjirPerRt: nextBebas }
                                    } : prev);
                                    setIsSaved(false);
                                  }}
                                  className={`text-xs px-2 py-1 rounded font-semibold transition-all ${
                                    !isRawan ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  Bebas
                                </button>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block mb-0.5">Nama Sungai/Saluran:</span>
                              <input
                                type="text"
                                value={formData.sda.sungaiPerRt[rtKey] || ''}
                                onChange={(e) => {
                                  const nextSungai = { ...formData.sda.sungaiPerRt, [rtKey]: e.target.value };
                                  setFormData((prev) => prev ? {
                                    ...prev,
                                    sda: { ...prev.sda, sungaiPerRt: nextSungai }
                                  } : prev);
                                  setIsSaved(false);
                                }}
                                placeholder="Misal: Cikapundung"
                                className="w-full text-xs px-2 py-1 rounded border border-slate-200"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bagian C: Sumber Daya Air */}
              <div>
                <div className="border-b border-slate-200 pb-2 mb-4">
                  <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-[#1E3A8A] inline-flex items-center justify-center text-sm">
                      C
                    </span>
                    Sumber Daya Air Minum & Sanitasi
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mencatat prasarana air bersih, unit, jumlah KK pengguna, dan kualitas air.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Sumur Gali */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 text-sm block">1. Sumur Gali</span>
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Jumlah (Unit):</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sda.sumurGaliUnit}
                        onChange={(e) => updateSda('sumurGaliUnit', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Pengguna (KK):</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sda.sumurGaliKk}
                        onChange={(e) => updateSda('sumurGaliKk', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span>Kondisi Baik:</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sda.sumurGaliKondisiBaik}
                          onChange={(e) => updateSda('sumurGaliKondisiBaik', Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <span>Kurang Baik:</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sda.sumurGaliKondisiKurangBaik}
                          onChange={(e) => updateSda('sumurGaliKondisiKurangBaik', Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sumur Pompa */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 text-sm block">2. Sumur Pompa</span>
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Jumlah (Unit):</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sda.sumurPompaUnit}
                        onChange={(e) => updateSda('sumurPompaUnit', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Pengguna (KK):</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sda.sumurPompaKk}
                        onChange={(e) => updateSda('sumurPompaKk', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span>Kondisi Baik:</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sda.sumurPompaKondisiBaik}
                          onChange={(e) => updateSda('sumurPompaKondisiBaik', Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <span>Kurang Baik:</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sda.sumurPompaKondisiKurangBaik}
                          onChange={(e) => updateSda('sumurPompaKondisiKurangBaik', Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hidran Umum */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 text-sm block">3. Hidran Umum</span>
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Jumlah (Unit):</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sda.hidranUmumUnit}
                        onChange={(e) => updateSda('hidranUmumUnit', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Pengguna (KK):</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sda.hidranUmumKk}
                        onChange={(e) => updateSda('hidranUmumKk', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span>Kondisi Baik:</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sda.hidranUmumKondisiBaik}
                          onChange={(e) => updateSda('hidranUmumKondisiBaik', Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <span>Kurang Baik:</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sda.hidranUmumKondisiKurangBaik}
                          onChange={(e) => updateSda('hidranUmumKondisiKurangBaik', Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PDAM */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 text-sm block">4. Sambungan PDAM</span>
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Jumlah (Unit):</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sda.pdamUnit}
                        onChange={(e) => updateSda('pdamUnit', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-600 block mb-1">Pengguna (KK):</span>
                      <input
                        type="number"
                        min="0"
                        value={formData.sda.pdamKk}
                        onChange={(e) => updateSda('pdamKk', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span>Kondisi Baik:</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sda.pdamKondisiBaik}
                          onChange={(e) => updateSda('pdamKondisiBaik', Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <span>Kurang Baik:</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.sda.pdamKondisiKurangBaik}
                          onChange={(e) => updateSda('pdamKondisiKurangBaik', Number(e.target.value))}
                          className="w-full px-2 py-1 rounded border border-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: KELEMBAGAAN EKONOMI (16 ITEM)                     */}
          {/* ======================================================== */}
          {activeTab === 'ekonomi' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-600" />
                  Bagian I.F Kelembagaan Ekonomi & UMKM di {selectedRw}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mencatat 16 jenis unit usaha ekonomi masyarakat beserta jumlah tenaga kerja / anggotanya.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'koperasi', label: '1. Jumlah Koperasi', subLabel: 'Anggota' },
                  { key: 'industriMakanan', label: '2. Industri Makanan', subLabel: 'Tenaga Kerja' },
                  { key: 'industriMeubel', label: '3. Industri Meubeul', subLabel: 'Tenaga Kerja' },
                  { key: 'usahaPerdagangan', label: '4. Usaha Perdagangan', subLabel: 'Tenaga Kerja' },
                  { key: 'warungMakan', label: '5. Warung Makan', subLabel: 'Tenaga Kerja' },
                  { key: 'kiosKelontong', label: '6. Kios / Kelontong', subLabel: 'Tenaga Kerja' },
                  { key: 'bengkel', label: '7. Bengkel Motor / Mobil', subLabel: 'Tenaga Kerja' },
                  { key: 'swalayanMinimarket', label: '8. Swalayan / Minimarket', subLabel: 'Tenaga Kerja' },
                  { key: 'percetakan', label: '9. Percetakan', subLabel: 'Tenaga Kerja' },
                  { key: 'sablon', label: '10. Sablon Kaos / Konveksi', subLabel: 'Tenaga Kerja' },
                  { key: 'konveksi', label: '11. Konveksi Busana', subLabel: 'Tenaga Kerja' },
                  { key: 'cafe', label: '12. Cafe & Kedai Kopi', subLabel: 'Tenaga Kerja' },
                  { key: 'salon', label: '13. Salon Kecantikan', subLabel: 'Tenaga Kerja' },
                  { key: 'barbershop', label: '14. Barbershop / Pangkas', subLabel: 'Tenaga Kerja' },
                ].map((item) => {
                  const val = formData.ekonomi[item.key as keyof ProfilEkonomiRw] as any;
                  return (
                    <div key={item.key} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 text-sm block mb-2">{item.label}</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-600 block mb-1">Unit:</label>
                          <input
                            type="number"
                            min="0"
                            value={val?.unit ?? 0}
                            onChange={(e) => updateEkonomi(item.key as any, 'unit', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600 block mb-1">{item.subLabel}:</label>
                          <input
                            type="number"
                            min="0"
                            value={val?.tenagaKerja ?? val?.anggota ?? 0}
                            onChange={(e) => updateEkonomi(item.key as any, 'tenagaKerja', Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pasar Tradisional & Pasar Kaget */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-sm block mb-2">15. Pasar Tradisional</span>
                  <label className="text-xs text-slate-600 block mb-1">Jumlah Unit Pasar:</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ekonomi.pasarTradisional.unit}
                    onChange={(e) => updateEkonomi('pasarTradisional', 'unit', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm font-medium"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-sm block mb-2">16. Pasar Kaget</span>
                  <label className="text-xs text-slate-600 block mb-1">Jumlah Lokasi / Unit:</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ekonomi.pasarKaget.unit}
                    onChange={(e) => updateEkonomi('pasarKaget', 'unit', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: SARANA & PRASARANA FISIK                          */}
          {/* ======================================================== */}
          {activeTab === 'sarpras' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Bagian IV. Potensi Prasarana & Sarana Fisik di {selectedRw}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mencatat jalan lingkungan, jembatan, sarana angkutan, MCK, saluran drainase, penerangan jalan, dan TPS.
                </p>
              </div>

              {/* 1. Jalan & Jembatan */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-800">1. Prasarana Jalan Lingkungan & Jembatan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jalan di Aspal (meter):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.jalanAspalMeter}
                      onChange={(e) => updateSarpras('jalanAspalMeter', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jalan Konblok / Paving (meter):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.jalanKonblokMeter}
                      onChange={(e) => updateSarpras('jalanKonblokMeter', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jalan Tanah (meter):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.jalanTanahMeter}
                      onChange={(e) => updateSarpras('jalanTanahMeter', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jembatan Beton (unit):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.jembatanBetonUnit}
                      onChange={(e) => updateSarpras('jembatanBetonUnit', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jembatan Besi (unit):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.jembatanBesiUnit}
                      onChange={(e) => updateSarpras('jembatanBesiUnit', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jembatan Kayu (unit):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.jembatanKayuUnit}
                      onChange={(e) => updateSarpras('jembatanKayuUnit', Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Drainase, MCK, Kantor RW, Penerangan & TPS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-sm text-slate-800 block">Saluran Drainase / Limbah</span>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Jumlah Unit/Segmen:</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.saluranDrainaseUnit}
                      onChange={(e) => updateSarpras('saluranDrainaseUnit', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Kondisi Drainase:</label>
                    <select
                      value={formData.sarpras.saluranDrainaseKondisi}
                      onChange={(e) => updateSarpras('saluranDrainaseKondisi', e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    >
                      <option value="Baik">Baik</option>
                      <option value="Rusak">Rusak</option>
                      <option value="Kurang Memadai">Kurang Memadai</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-sm text-slate-800 block">MCK Umum Lingkungan</span>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Jumlah Unit MCK:</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.mckUnit}
                      onChange={(e) => updateSarpras('mckUnit', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Pengguna (KK):</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.mckPenggunaKk}
                      onChange={(e) => updateSarpras('mckPenggunaKk', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-sm text-slate-800 block">Kantor Balai RW</span>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Jumlah Unit:</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sarpras.kantorRwUnit}
                      onChange={(e) => updateSarpras('kantorRwUnit', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Status Kepemilikan:</label>
                    <select
                      value={formData.sarpras.kantorRwKepemilikan}
                      onChange={(e) => updateSarpras('kantorRwKepemilikan', e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    >
                      <option value="Swadaya Masyarakat">Swadaya Masyarakat</option>
                      <option value="Milik Pemerintah">Milik Pemerintah</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-sm text-slate-800 block">Lampu Penerangan Gang</span>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Ketersediaan:</label>
                    <select
                      value={formData.sarpras.lampuPeneranganGang}
                      onChange={(e) => updateSarpras('lampuPeneranganGang', e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    >
                      <option value="Ada">Ada</option>
                      <option value="Tidak Ada">Tidak Ada</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Kondisi Lampu:</label>
                    <select
                      value={formData.sarpras.lampuKondisi}
                      onChange={(e) => updateSarpras('lampuKondisi', e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    >
                      <option value="Baik">Baik</option>
                      <option value="Mati">Mati</option>
                      <option value="Rusak">Rusak</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-sm text-slate-800 block">TPS Sampah Umum</span>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Prasarana TPS Umum:</label>
                    <select
                      value={formData.sarpras.tpsUmum}
                      onChange={(e) => updateSarpras('tpsUmum', e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    >
                      <option value="Ada">Ada</option>
                      <option value="Tidak Ada">Tidak Ada</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-sm text-slate-800 block">Akses Angkutan Umum</span>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Dilalui Angkot:</label>
                    <select
                      value={formData.sarpras.dilaluiAngkot}
                      onChange={(e) => updateSarpras('dilaluiAngkot', e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-sm"
                    >
                      <option value="Ada">Ada</option>
                      <option value="Tidak Ada">Tidak Ada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="text-slate-600 border-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kembalikan Nilai</span>
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 px-6 py-2.5 h-auto"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan {selectedRw}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
