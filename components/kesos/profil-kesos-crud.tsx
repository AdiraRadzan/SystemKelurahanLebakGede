'use client';

import React, { useState, useEffect } from 'react';
import { useKelurahanStore } from '@/lib/store';
import {
  ProfilKesosRwData,
  ProfilKelembagaanKesosRw,
  ProfilKesehatanPmksRw,
  ProfilSosialBudayaRw,
} from '@/types/kesos';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import {
  Users,
  HeartPulse,
  Landmark,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Baby,
  Stethoscope,
  School,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import { RW_OPTIONS } from '@/config/modules';

export function ProfilKesosCrudView() {
  const { getProfilKesosList, getProfilEkbangList, updateProfilKesosByRw, getProfilKesosByRw } =
    useKelurahanStore();

  const [selectedRw, setSelectedRw] = useState<string>('RW 01');
  const [activeTab, setActiveTab] = useState<'kelembagaan' | 'kesehatan' | 'sosialBudaya'>('kelembagaan');
  const [formData, setFormData] = useState<ProfilKesosRwData | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Load selected RW data
  useEffect(() => {
    const rwData = getProfilKesosByRw(selectedRw);
    if (rwData) {
      setFormData(JSON.parse(JSON.stringify(rwData)));
      setIsSaved(true);
    }
  }, [selectedRw, getProfilKesosByRw]);

  if (!formData) {
    return (
      <div className="p-8 text-center text-slate-500">
        Memuat data profil kesejahteraan sosial...
      </div>
    );
  }

  const allRwList = getProfilKesosList();

  // Helper updates
  const updateKelembagaan = <K extends keyof ProfilKelembagaanKesosRw>(
    field: K,
    value: ProfilKelembagaanKesosRw[K]
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        kelembagaan: {
          ...prev.kelembagaan,
          [field]: value,
        },
      };
    });
    setIsSaved(false);
  };

  const updateKesehatan = <K extends keyof ProfilKesehatanPmksRw>(
    field: K,
    value: ProfilKesehatanPmksRw[K]
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        kesehatan: {
          ...prev.kesehatan,
          [field]: value,
        },
      };
    });
    setIsSaved(false);
  };

  const updateSosialBudaya = <K extends keyof ProfilSosialBudayaRw>(
    field: K,
    value: ProfilSosialBudayaRw[K]
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sosialBudaya: {
          ...prev.sosialBudaya,
          [field]: value,
        },
      };
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!formData) return;
    updateProfilKesosByRw(selectedRw, formData);
    setIsSaved(true);
    toast.success(
      `Data ${selectedRw} Tersimpan`,
      'Perubahan profil kesejahteraan sosial & kelembagaan berhasil diperbarui ke sistem.'
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
              Modul Kedinasan Seksi Kesos
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              Sinkron Format Master Profil
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Profil Kewilayahan Kesejahteraan Sosial (Kesos)
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Input dan pemutakhiran data Kelembagaan Sosial, Sarana Pendidikan, Sarana Fasilitas Kesehatan,
            Pemantauan Stunting & 1000 HPK, PMKS / Disabilitas, serta Sarana Ibadah & Olahraga tingkat RW se-Kelurahan Lebakgede.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <Button
            onClick={handleSave}
            disabled={isSaved}
            className={`text-xs h-10 px-4 font-semibold shadow-md transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white opacity-90 cursor-default'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-900 animate-pulse'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-white" />
                Data Tersimpan
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2. Selector RW & Quick Meta */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#1E3A8A]" />
            Pilih Wilayah Rukun Warga:
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedRw}
              onChange={(e) => setSelectedRw(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-[#1E3A8A] focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A] cursor-pointer"
            >
              {RW_OPTIONS.map((rw) => (
                <option key={rw.value} value={rw.value}>
                  {rw.label} {rw.value === 'RW 16' ? '(Sekeloa)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status RW Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-400">Ketua RW:</span>
            <span className="font-semibold text-slate-800">{formData.namaKetuaRw || '-'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Pemutakhiran:</span>
            <span className="font-semibold text-slate-800">{formData.terakhirDiperbarui}</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-3 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('kelembagaan')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'kelembagaan'
              ? 'border-[#1E3A8A] text-[#1E3A8A]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>I. Kelembagaan & Pendidikan</span>
          <span className="px-2 py-0.5 rounded-full text-2xs bg-blue-100 text-blue-800 font-bold">
            {formData.kelembagaan.karangTarunaUnit + formData.kelembagaan.posyanduUnit} Lembaga
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kesehatan')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'kesehatan'
              ? 'border-[#1E3A8A] text-[#1E3A8A]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>II. Kesehatan & PMKS / Stunting</span>
          <span className="px-2 py-0.5 rounded-full text-2xs bg-rose-100 text-rose-800 font-bold">
            {formData.kesehatan.balitaDitimbang} Balita
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sosialBudaya')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'sosialBudaya'
              ? 'border-[#1E3A8A] text-[#1E3A8A]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>III. Sosial Budaya & Olahraga</span>
          <span className="px-2 py-0.5 rounded-full text-2xs bg-emerald-100 text-emerald-800 font-bold">
            {formData.sosialBudaya.masjid + formData.sosialBudaya.langgarMushola} Tempat Ibadah
          </span>
        </button>
      </div>

      {/* 4. Tab Content */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-6 space-y-8">
        {/* ========================================================== */}
        {/* TAB 1: KELEMBAGAAN & PENDIDIKAN */}
        {/* ========================================================== */}
        {activeTab === 'kelembagaan' && (
          <div className="space-y-8">
            {/* Bagian A: Organisasi Kemasyarakatan */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Users className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-base font-bold text-slate-900">
                  A. Organisasi Kemasyarakatan & Kemitraan RW
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Sesuai Bagian I.D Formulir Master Profil — Karang Taruna, Posyandu, Pengajian, Arisan, dan Kelompok Dasawisma PKK.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Karang Taruna RW</span>
                    <span className="text-2xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-semibold">Pemuda</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Jumlah Unit</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.kelembagaan.karangTarunaUnit}
                        onChange={(e) => updateKelembagaan('karangTarunaUnit', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Anggota Aktif</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.kelembagaan.karangTarunaAnggota}
                        onChange={(e) => updateKelembagaan('karangTarunaAnggota', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Posyandu Binaan</span>
                    <span className="text-2xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-semibold">Kader</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Unit Posyandu</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.kelembagaan.posyanduUnit}
                        onChange={(e) => updateKelembagaan('posyanduUnit', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Kader Aktif</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.kelembagaan.posyanduKaderAktif}
                        onChange={(e) => updateKelembagaan('posyanduKaderAktif', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Kelompok Pengajian & Majelis Taklim</span>
                  <div className="text-xs">
                    <label className="text-slate-500 block mb-1">Jumlah Kelompok</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.kelembagaan.kelompokPengajian}
                      onChange={(e) => updateKelembagaan('kelompokPengajian', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Kelompok Arisan Warga</span>
                  <div className="text-xs">
                    <label className="text-slate-500 block mb-1">Jumlah Kelompok</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.kelembagaan.kelompokArisan}
                      onChange={(e) => updateKelembagaan('kelompokArisan', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Relawan Sosial & Siaga Bencana</span>
                  <div className="text-xs">
                    <label className="text-slate-500 block mb-1">Jumlah Relawan (Jiwa)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.kelembagaan.relawanSosialBencana}
                      onChange={(e) => updateKelembagaan('relawanSosialBencana', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">PKK & Dasawisma</span>
                    <span className="text-2xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">Keluarga</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-slate-500 block mb-1">Pokja PKK</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.kelembagaan.pokjaPkkRw}
                        onChange={(e) => updateKelembagaan('pokjaPkkRw', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">Dasawisma Aktif</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.kelembagaan.dasawismaAktif}
                        onChange={(e) => updateKelembagaan('dasawismaAktif', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian B: Lembaga Pendidikan */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <School className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-base font-bold text-slate-900">
                  B. Lembaga Pendidikan di Wilayah RW
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Sesuai Bagian I.G Formulir Master Profil — PAUD, TKQ, SD, SMP, SMA, Perguruan Tinggi, Lembaga Keagamaan, & Kursus.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'paudRa', label: 'PAUD / RA', desc: 'Pendidikan Anak Usia Dini' },
                  { key: 'tkq', label: 'Taman Kanak-Kanak / TKQ', desc: 'TK / TK Al-Quran' },
                  { key: 'sdSederajat', label: 'SD / MI / Sederajat', desc: 'Sekolah Dasar' },
                  { key: 'sltpSederajat', label: 'SLTP / SMP / MTs', desc: 'Sekolah Menengah Pertama' },
                  { key: 'sltaSederajat', label: 'SLTA / SMA / SMK / MA', desc: 'Sekolah Menengah Atas' },
                  { key: 'perguruanTinggi', label: 'Perguruan Tinggi / Akademi', desc: 'Kampus / Akademi' },
                  { key: 'pendidikanKeagamaan', label: 'Pendidikan Keagamaan', desc: 'Pesantren / Diniyah' },
                  { key: 'kursusBahasa', label: 'Kursus Bahasa', desc: 'Jumlah Staf Pengajar' },
                  { key: 'kursusMontir', label: 'Kursus Montir', desc: 'Jumlah Staf Pengajar' },
                  { key: 'kursusKomputer', label: 'Kursus Komputer', desc: 'Jumlah Staf Pengajar' },
                  { key: 'kursusKecantikan', label: 'Kursus Kecantikan', desc: 'Jumlah Staf Pengajar' },
                  { key: 'kursusRiasPengantin', label: 'Kursus Rias Pengantin', desc: 'Jumlah Staf Pengajar' },
                  { key: 'kursusLas', label: 'Kursus Las', desc: 'Jumlah Staf Pengajar' },
                ].map(({ key, label, desc }) => {
                  const item = formData.kelembagaan[key as keyof ProfilKelembagaanKesosRw] as any;
                  return (
                    <div key={key} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1" title={label}>
                        {label}
                      </span>
                      <p className="text-2xs text-slate-500">{desc}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-slate-500 block mb-0.5">Unit</label>
                          <input
                            type="number"
                            min="0"
                            value={item?.unit || 0}
                            onChange={(e) =>
                              updateKelembagaan(key as any, {
                                ...item,
                                unit: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block mb-0.5">Siswa/Peserta</label>
                          <input
                            type="number"
                            min="0"
                            value={item?.peserta || 0}
                            onChange={(e) =>
                              updateKelembagaan(key as any, {
                                ...item,
                                peserta: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: KESEHATAN & PMKS / STUNTING */}
        {/* ========================================================== */}
        {activeTab === 'kesehatan' && (
          <div className="space-y-8">
            {/* Bagian A: Prasarana Fasilitas Kesehatan */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Stethoscope className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-base font-bold text-slate-900">
                  A. Prasarana Sarana Kesehatan
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Sesuai Bagian IV.H Formulir Master Profil — Ketersediaan fasilitas kesehatan di lingkungan RW.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
                {[
                  { key: 'rumahSakitUmum', label: 'Rumah Sakit Umum' },
                  { key: 'puskesmas', label: 'Puskesmas' },
                  { key: 'puskesmasPembantu', label: 'Puskesmas Pembantu (Pustu)' },
                  { key: 'poliklinikKlinik', label: 'Poliklinik / Balai Pengobatan' },
                  { key: 'apotik', label: 'Apotik' },
                  { key: 'posyandu', label: 'Posyandu Terdaftar' },
                  { key: 'tokoObat', label: 'Toko Obat' },
                  { key: 'praktekDokterBidan', label: 'Praktek Dokter / Bidan' },
                ].map(({ key, label }) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1 line-clamp-1" title={label}>
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={formData.kesehatan[key as keyof ProfilKesehatanPmksRw] as number}
                        onChange={(e) => updateKesehatan(key as any, Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                      />
                      <span className="text-xs text-slate-400">Unit</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bagian B: Pemantauan Gizi & Stunting (1000 HPK) */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Baby className="w-5 h-5 text-rose-600" />
                <h2 className="text-base font-bold text-slate-900">
                  B. Sasaran Prioritas Gizi & Pencegahan Stunting (1000 HPK)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Data terpadu penimbangan bulanan Posyandu untuk percepatan penurunan stunting dan perlindungan ibu-anak.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-900 block">Balita Ditimbang (0-59 Bln)</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.kesehatan.balitaDitimbang}
                    onChange={(e) => updateKesehatan('balitaDitimbang', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-sm font-bold text-blue-900"
                  />
                  <span className="text-2xs text-blue-700 block">Total sasaran penimbangan aktif</span>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 block">Balita Gizi Baik (Normal)</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.kesehatan.balitaGiziBaik}
                    onChange={(e) => updateKesehatan('balitaGiziBaik', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-sm font-bold text-emerald-900"
                  />
                  <span className="text-2xs text-emerald-700 block">Status tumbuh kembang optimal</span>
                </div>

                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 block">Balita Gizi Kurang</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.kesehatan.balitaGiziKurang}
                    onChange={(e) => updateKesehatan('balitaGiziKurang', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-sm font-bold text-amber-900"
                  />
                  <span className="text-2xs text-amber-700 block">Sasaran Pemberian Makanan Tambahan (PMT)</span>
                </div>

                <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-300 space-y-2">
                  <span className="text-xs font-bold text-rose-900 block">Balita Terindikasi Stunting</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.kesehatan.balitaStunting}
                    onChange={(e) => updateKesehatan('balitaStunting', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-rose-300 rounded-lg text-sm font-bold text-rose-900"
                  />
                  <span className="text-2xs text-rose-700 block">Rujukan intervensi UPT Puskesmas</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Baduta (0-23 Bulan)</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.kesehatan.badutaTotal}
                    onChange={(e) => updateKesehatan('badutaTotal', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                  />
                  <span className="text-2xs text-slate-500 block">Krusial 1000 Hari Pertama Kehidupan</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Ibu Hamil Terdata</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.kesehatan.ibuHamilTotal}
                    onChange={(e) => updateKesehatan('ibuHamilTotal', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                  />
                  <span className="text-2xs text-slate-500 block">Pemeriksaan antenatal rutin</span>
                </div>

                <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-200 space-y-2">
                  <span className="text-xs font-bold text-rose-800 block">Ibu Hamil Resti (Risiko Tinggi)</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.kesehatan.ibuHamilResti}
                    onChange={(e) => updateKesehatan('ibuHamilResti', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-rose-300 rounded-lg text-sm font-bold text-rose-800"
                  />
                  <span className="text-2xs text-rose-600 block">Anemia / KEK / Hipertensi</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Warga Lansia (Posbindu)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-2xs text-slate-400 block mb-0.5">Total</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.kesehatan.lansiaTotal}
                        onChange={(e) => updateKesehatan('lansiaTotal', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-2xs text-slate-400 block mb-0.5">Risti</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.kesehatan.lansiaRistiPosbindu}
                        onChange={(e) => updateKesehatan('lansiaRistiPosbindu', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-rose-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian C: Penyandang Disabilitas (Cacat Fisik / Mental PMKS) */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <HeartHandshake className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-base font-bold text-slate-900">
                  C. Penyandang Disabilitas & PMKS (Buku Master Profil III.C)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Pencatatan resmi warga penyandang disabilitas (tuna netra, tuna rungu, tuna daksa, cacat mental) dan bantuan sosial.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { key: 'tunaRungu', label: 'Tuna Rungu' },
                  { key: 'tunaWicara', label: 'Tuna Wicara' },
                  { key: 'tunaNetra', label: 'Tuna Netra' },
                  { key: 'tunaDaksa', label: 'Tuna Daksa' },
                  { key: 'lumpuh', label: 'Lumpuh' },
                  { key: 'sumbing', label: 'Bibir Sumbing' },
                  { key: 'cacatMental', label: 'Cacat Mental' },
                ].map(({ key, label }) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <label className="text-2xs font-semibold text-slate-600 block mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.kesehatan[key as keyof ProfilKesehatanPmksRw] as number}
                      onChange={(e) => updateKesehatan(key as any, Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-center text-sm font-bold text-slate-800"
                    />
                    <span className="text-2xs text-slate-400 mt-1 block">Jiwa</span>
                  </div>
                ))}
              </div>

              {/* Bantuan Sosial */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-3">
                  Penerima Manfaat Bantuan Sosial di RW:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-900 block">Keluarga PKH</span>
                      <span className="text-2xs text-indigo-700">Program Keluarga Harapan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={formData.kesehatan.keluargaPkh}
                        onChange={(e) => updateKesehatan('keluargaPkh', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-indigo-300 rounded text-center font-bold text-indigo-900"
                      />
                      <span className="text-xs text-indigo-800 font-semibold">KK</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">Keluarga BPNT</span>
                      <span className="text-2xs text-amber-700">Bantuan Pangan Non Tunai</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={formData.kesehatan.keluargaBpnt}
                        onChange={(e) => updateKesehatan('keluargaBpnt', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-amber-300 rounded text-center font-bold text-amber-900"
                      />
                      <span className="text-xs text-amber-800 font-semibold">KK</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">Penerima PBI JKN</span>
                      <span className="text-2xs text-emerald-700">Jaminan Kesehatan Gratis</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={formData.kesehatan.keluargaPbiJkn}
                        onChange={(e) => updateKesehatan('keluargaPbiJkn', Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-emerald-300 rounded text-center font-bold text-emerald-900"
                      />
                      <span className="text-xs text-emerald-800 font-semibold">Jiwa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: SOSIAL BUDAYA & OLAHRAGA */}
        {/* ========================================================== */}
        {activeTab === 'sosialBudaya' && (
          <div className="space-y-8">
            {/* Bagian A: Prasarana Peribadatan */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Landmark className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-base font-bold text-slate-900">
                  A. Prasarana Sarana Peribadatan
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Sesuai Bagian IV.F Formulir Master Profil — Masjid, Mushola/Langgar, Gereja, Pura, dan Vihara di wilayah RW.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {[
                  { key: 'masjid', label: 'Masjid Jami' },
                  { key: 'langgarMushola', label: 'Mushola / Surau' },
                  { key: 'gerejaKristen', label: 'Gereja Kristen' },
                  { key: 'gerejaKatolik', label: 'Gereja Katolik' },
                  { key: 'wihara', label: 'Vihara / Kelenteng' },
                  { key: 'pura', label: 'Pura' },
                ].map(({ key, label }) => (
                  <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sosialBudaya[key as keyof ProfilSosialBudayaRw] as number}
                      onChange={(e) => updateSosialBudaya(key as any, Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-center text-sm font-bold text-slate-800"
                    />
                    <span className="text-2xs text-slate-400 mt-1 block">Unit</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bagian B: Prasarana Olahraga & Seni Budaya */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
                <h2 className="text-base font-bold text-slate-900">
                  B. Prasarana Olahraga & Sanggar Seni Budaya
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Sesuai Bagian IV.G Formulir Master Profil — Fasilitas olahraga warga dan pelestarian kesenian di lingkungan RW.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {[
                  { key: 'lapanganSepakBola', label: 'Lapangan Sepak Bola' },
                  { key: 'lapanganBuluTangkis', label: 'Lapangan Bulu Tangkis' },
                  { key: 'lapanganVoli', label: 'Lapangan Bola Voli' },
                  { key: 'lapanganBasket', label: 'Lapangan Bola Basket' },
                  { key: 'lapanganTenisMeja', label: 'Meja Tenis Meja' },
                  { key: 'lapanganFutsal', label: 'Lapangan Futsal' },
                  { key: 'sanggarSeniBudaya', label: 'Sanggar Seni & Budaya' },
                ].map(({ key, label }) => (
                  <div key={key} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={formData.sosialBudaya[key as keyof ProfilSosialBudayaRw] as number}
                        onChange={(e) => updateSosialBudaya(key as any, Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-sm font-bold text-slate-800"
                      />
                      <span className="text-xs text-slate-400">Unit</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Save Reminder */}
      {!isSaved && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-700 animate-bounce">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Ada perubahan profil {selectedRw} yang belum disimpan!</span>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs h-8 px-3"
          >
            Simpan Sekarang
          </Button>
        </div>
      )}
    </div>
  );
}
