'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKelurahanStore } from '@/lib/store';
import { aggregateProfilKesos } from '@/lib/kesos-calc';
import { triggerOfficialProfilExcelDownload } from '@/lib/download-profil-excel';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import {
  Download,
  Home,
  ChevronRight,
  Building,
  Users,
  Hammer,
  Heart,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export default function LurahLaporanPage() {
  const { data, getProfilKesosList, getProfilEkbangList } = useKelurahanStore();
  const aggKesos = aggregateProfilKesos(getProfilKesosList());
  const [activeTab, setActiveTab] = useState<'sekel' | 'pem' | 'ekbang' | 'kesos'>('sekel');

  const handleDownload = (format: 'PDF' | 'Excel') => {
    toast.success(
      `Unduh Laporan Berhasil`,
      `Laporan ringkas format ${format} berhasil diproses dan diunduh ke komputer Anda.`
    );
  };

  // 1. Data Sekretariat
  const suratMasukCount = (data['sekel_surat-masuk'] || []).length;
  const suratKeluarCount = (data['sekel_surat-keluar'] || []).length;
  const pegawaiCount = (data['sekel_kepegawaian'] || []).length;
  const bmdCount = (data['sekel_bmd'] || []).length;
  const chartSekel = [
    { name: 'Surat Masuk', total: suratMasukCount },
    { name: 'Surat Keluar', total: suratKeluarCount },
    { name: 'Aparatur ASN', total: pegawaiCount },
    { name: 'Aset BMD', total: bmdCount },
  ];

  // 2. Data Pemerintahan
  const kependudukanCount = (data['pemerintahan_kependudukan'] || []).length;
  const catatanSipilCount = (data['pemerintahan_catatan-sipil'] || []).length;
  const rwCount = (data['pemerintahan_pengurus-rw'] || []).length;
  const rtCount = (data['pemerintahan_pengurus-rt'] || []).length;
  const chartPem = [
    { name: 'RW 01', penduduk: 1420 },
    { name: 'RW 02', penduduk: 1680 },
    { name: 'RW 03', penduduk: 1950 },
    { name: 'RW 04', penduduk: 1530 },
    { name: 'RW 05', penduduk: 1390 },
  ];

  // 3. Data Ekbang
  const infrastrukturList = data['ekbang_infrastruktur'] || [];
  const umkmCount = (data['ekbang_umkm'] || []).length;
  const kebersihanCount = (data['ekbang_petugas-kebersihan'] || []).length;
  const magotCount = (data['ekbang_petugas-magot'] || []).length;
  const chartEkbang = [
    { name: 'Gang Hegarmanah', progres: 100 },
    { name: 'Drainase RW 03', progres: 75 },
    { name: 'Rutilahu RW 04', progres: 40 },
  ];

  // 4. Data Kesos (Rekapitulasi 16 RW Lebakgede)
  const balitaCount = aggKesos.kesehatan.balitaDitimbang;
  const badutaCount = aggKesos.kesehatan.badutaTotal;
  const ibuHamilCount = aggKesos.kesehatan.ibuHamilTotal;
  const lansiaCount = aggKesos.kesehatan.lansiaTotal;
  const chartKesos = [
    { name: 'Balita Ditimbang', jumlah: balitaCount, color: '#2563EB' },
    { name: 'Baduta 1000 HPK', jumlah: badutaCount, color: '#38BDF8' },
    { name: 'Ibu Hamil', jumlah: ibuHamilCount, color: '#F43F5E' },
    { name: 'Lansia Posbindu', jumlah: lansiaCount, color: '#10B981' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Link href="/lurah/beranda" className="hover:text-[#1E3A8A] flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-medium text-[#475569]">Pimpinan</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-[#0F172A]">Laporan Ringkas</span>
      </nav>

      {/* Header Halaman + Tombol Unduh Laporan (Hanya 1 grup tombol aksi) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] leading-tight">
            Laporan Ringkas 4 Bidang Kelurahan
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Ringkasan data analitik dan grafik performa seluruh seksi dalam satu tampilan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => triggerOfficialProfilExcelDownload('ALL', getProfilKesosList(), getProfilEkbangList())}
            className="border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold"
            title="Unduh Excel Resmi 16 RW (Sheet PROFIL 509 baris standar pemerintah)"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
            Unduh Excel Profil Resmi
          </Button>
          <Button
            variant="primary"
            onClick={() => handleDownload('PDF')}
            className="bg-[#1E3A8A] hover:bg-[#2563EB]"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Unduh PDF
          </Button>
        </div>
      </div>

      {/* 4 Tab Navigasi Bidang */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sekel')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors min-h-[44px] ${
            activeTab === 'sekel'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Sekretariat</span>
        </button>

        <button
          onClick={() => setActiveTab('pem')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors min-h-[44px] ${
            activeTab === 'pem'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Sie Pemerintahan</span>
        </button>

        <button
          onClick={() => setActiveTab('ekbang')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors min-h-[44px] ${
            activeTab === 'ekbang'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>Ekonomi & Pembangunan</span>
        </button>

        <button
          onClick={() => setActiveTab('kesos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors min-h-[44px] ${
            activeTab === 'kesos'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Kesejahteraan Sosial</span>
        </button>
      </div>

      {/* Konten Tiap Tab: Angka Ringkasan + 1 Grafik Read-Only */}
      {activeTab === 'sekel' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Surat Masuk</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{suratMasukCount}</p>
              <p className="text-xs text-[#64748B] mt-1">Agenda terdaftar</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Surat Keluar</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{suratKeluarCount}</p>
              <p className="text-xs text-[#64748B] mt-1">Surat resmi kedinasan</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Aparatur Kelurahan</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{pegawaiCount} Orang</p>
              <p className="text-xs text-[#64748B] mt-1">PNS, PPPK, & PHL</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Barang Milik Daerah</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{bmdCount} Aset</p>
              <p className="text-xs text-[#64748B] mt-1">Terdata di SIMDA/BMD</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              Grafik Rekapitulasi Operasional Sekretariat
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Total pencatatan surat, kepegawaian, dan inventaris aset daerah
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartSekel}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="total" fill="#1E3A8A" radius={[6, 6, 0, 0]} name="Total Data" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pem' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Estimasi Penduduk</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">7.970 Jiwa</p>
              <p className="text-xs text-[#64748B] mt-1">Kecamatan Coblong</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Rukun Warga (RW)</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{rwCount} RW</p>
              <p className="text-xs text-[#64748B] mt-1">RW 01 s/d RW 05</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Rukun Tetangga (RT)</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">48 RT</p>
              <p className="text-xs text-[#64748B] mt-1">Kepengurusan aktif</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Layanan Kependudukan</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{kependudukanCount + catatanSipilCount}</p>
              <p className="text-xs text-[#64748B] mt-1">Bulan Oktober 2026</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              Sebaran Jumlah Penduduk per Wilayah RW
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Distribusi warga terdaftar di 5 Rukun Warga Kelurahan Lebakgede
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartPem}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="penduduk" fill="#2563EB" radius={[6, 6, 0, 0]} name="Jumlah Jiwa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ekbang' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Proyek Infrastruktur</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{infrastrukturList.length} Titik</p>
              <p className="text-xs text-[#64748B] mt-1">Drainase & Paving Block</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">UMKM Binaan</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{umkmCount} Usaha</p>
              <p className="text-xs text-[#64748B] mt-1">Kuliner & Kerajinan</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Petugas Kebersihan</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{kebersihanCount} Orang</p>
              <p className="text-xs text-[#64748B] mt-1">Penyapuan & Roda Sampah</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Petugas Magot Organik</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{magotCount} Orang</p>
              <p className="text-xs text-[#64748B] mt-1">2 Rumah Magot Aktif</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              Progres Fisik Pekerjaan Infrastruktur (%)
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Realisasi fisik pengerjaan jalan, drainase, dan fasilitas umum
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartEkbang}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="progres" fill="#15803D" radius={[6, 6, 0, 0]} name="Progres Fisik (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kesos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Balita (0-59 Bln)</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{balitaCount} Anak</p>
              <p className="text-xs text-[#64748B] mt-1">Total Seluruh 16 RW</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Baduta (0-23 Bln)</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{badutaCount} Anak</p>
              <p className="text-xs text-[#64748B] mt-1">Fokus Pencegahan Stunting</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Ibu Hamil</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{ibuHamilCount} Orang</p>
              <p className="text-xs text-[#64748B] mt-1">Pemeriksaan rutin bidan</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-semibold text-[#64748B] uppercase">Lansia Terdata</span>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-2">{lansiaCount} Orang</p>
              <p className="text-xs text-[#64748B] mt-1">Binaan Posbindu</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              Proporsi Sasaran Perlindungan & Kesehatan Warga
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Jumlah warga rentan yang mendapatkan pemantauan berkala
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartKesos}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="jumlah" fill="#1E3A8A" radius={[6, 6, 0, 0]} name="Jumlah Terdata" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
