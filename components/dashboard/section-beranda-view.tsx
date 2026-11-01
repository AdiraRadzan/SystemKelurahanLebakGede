'use client';

import React from 'react';
import Link from 'next/link';
import { UserRole, User } from '@/types';
import { ROLE_NAVIGATION } from '@/config/navigation';
import { useKelurahanStore } from '@/lib/store';
import { formatIndonesianDate, getTimeGreeting } from '@/lib/utils';
import { IconRenderer } from '@/components/ui/icon-renderer';
import {
  Calendar,
  ArrowRight,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface SectionBerandaViewProps {
  user: User;
  role: UserRole;
}

export function SectionBerandaView({ user, role }: SectionBerandaViewProps) {
  const { data } = useKelurahanStore();

  const menuGroups = ROLE_NAVIGATION[role] || [];
  const allSubModules = menuGroups.flatMap((group) =>
    group.items.filter((item) => !item.href.endsWith('/beranda'))
  );

  // Check if any surat masuk was dispositioned to this role by Lurah
  const suratMasukList = data['sekel_surat-masuk'] || [];
  const disposisiUntukRole = suratMasukList.filter((s) => s.disposisiKe === role);

  // Dynamic counts for summary cards
  const programKerja = data[`${role}_rencana-program-kerja`] || [];
  const rencanaGiat = data[`${role}_rencana-giat`] || [];
  const disetujuiCount = programKerja.filter((p) => p.status === 'Disetujui').length;
  const diajukanCount = programKerja.filter((p) => p.status === 'Diajukan').length;

  const greeting = getTimeGreeting();
  const todayDate = formatIndonesianDate();

  // Simple chart data tailored to the role
  let chartData: { name: string; total: number }[] = [];
  let chartTitle = 'Status Program Kerja 2026';

  if (role === 'pemerintahan') {
    chartTitle = 'Rekapitulasi Administrasi Kependudukan';
    chartData = [
      { name: 'KTP-el', total: 42 },
      { name: 'KK', total: 38 },
      { name: 'Akta Lahir', total: 19 },
      { name: 'Pindah/Datang', total: 15 },
      { name: 'Pertanahan', total: 8 },
    ];
  } else if (role === 'ekbang') {
    chartTitle = 'Progres Fisik Infrastruktur & Sarpras (%)';
    chartData = [
      { name: 'Gg. Hegarmanah', total: 100 },
      { name: 'Drainase RW 03', total: 75 },
      { name: 'Rutilahu RW 04', total: 40 },
      { name: 'Buruan SAE', total: 85 },
    ];
  } else if (role === 'kesos') {
    chartTitle = 'Pemantauan Sasaran Gizi & Kesehatan';
    chartData = [
      { name: 'Balita Normal', total: 32 },
      { name: 'Gizi Kurang', total: 4 },
      { name: 'Baduta 1000 HPK', total: 18 },
      { name: 'Ibu Hamil', total: 12 },
      { name: 'Lansia Posbindu', total: 45 },
    ];
  } else {
    // Sekel
    chartTitle = 'Volume Administrasi & Pelayanan Surat';
    chartData = [
      { name: 'Surat Masuk', total: (data['sekel_surat-masuk'] || []).length },
      { name: 'Surat Keluar', total: (data['sekel_surat-keluar'] || []).length },
      { name: 'Pegawai ASN', total: (data['sekel_kepegawaian'] || []).length },
      { name: 'Aset BMD', total: (data['sekel_bmd'] || []).length },
    ];
  }

  return (
    <div className="space-y-8">
      {/* 1. Sapaan & Tanggal */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            {greeting}, {user.name}
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Selamat datang di Sistem Aplikasi Satu Data Kelurahan Lebakgede.
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1E3A8A]">
          <Calendar className="w-4 h-4 text-[#1E3A8A]" />
          <span>{todayDate}</span>
        </div>
      </div>

      {/* Disposisi Masuk dari Lurah (Khusus Bidang Tujuan) */}
      {disposisiUntukRole.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/40 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#0F172A] leading-tight">
                  Disposisi Surat Masuk dari Lurah
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Terdapat {disposisiUntukRole.length} surat yang memerlukan tindak lanjut bidang Anda
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#B45309] text-xs font-semibold self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5" />
              Perlu Tindak Lanjut
            </span>
          </div>

          {/* List Surat Masuk */}
          <div className="p-4 sm:p-5 space-y-3">
            {disposisiUntukRole.map((surat) => (
              <div
                key={surat.id}
                className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-blue-300 transition-colors space-y-3"
              >
                {/* Baris Atas: Nomor Surat, Pengirim, & Sifat */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E2E8F0]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#1E3A8A] px-2 py-0.5 rounded bg-blue-100/70">
                      Agenda {surat.nomorAgenda || 'AG/2026'}
                    </span>
                    <strong className="text-sm text-[#0F172A] font-bold">
                      {surat.nomorSurat}
                    </strong>
                    <span className="text-xs text-[#64748B]">
                      • {surat.asalSurat}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    {surat.sifat && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-[#B45309] border border-amber-200">
                        {surat.sifat}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#15803D] border border-emerald-200">
                      Didisposisikan ke Bidang Anda
                    </span>
                  </div>
                </div>

                {/* Perihal */}
                <div>
                  <span className="text-xs text-[#64748B] block font-medium">Perihal Surat:</span>
                  <p className="text-sm font-semibold text-[#0F172A] mt-0.5 leading-snug">
                    {surat.perihal}
                  </p>
                </div>

                {/* Instruksi Arahan Lurah */}
                {surat.instruksiLurah && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border-l-4 border-l-[#1E3A8A] border-y border-r border-blue-100 text-xs">
                    <span className="font-bold text-[#1E3A8A] block mb-1">
                      Instruksi / Arahan Lurah:
                    </span>
                    <p className="text-[#1E3A8A] leading-relaxed italic">
                      &ldquo;{surat.instruksiLurah}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 4 Kartu Ringkasan Angka Besar */}
      <div>
        <h2 className="text-base font-bold text-[#0F172A] mb-3">
          Ringkasan Indikator Bidang
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Program Kerja
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">
                {programKerja.length}
              </span>
              <span className="text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                {disetujuiCount} Disetujui
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              {diajukanCount} Menunggu persetujuan
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Rencana Giat
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">
                {rencanaGiat.length}
              </span>
              <span className="text-xs font-semibold text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                Agenda Terjadwal
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Pelayanan & giat kewilayahan
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Modul Bidang Aktif
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">
                {allSubModules.length}
              </span>
              <span className="text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                Lengkap
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Dapat diakses langsung
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Wilayah Kerja
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">5 RW</span>
              <span className="text-xs font-semibold text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                48 RT
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Kelurahan Lebakgede, Coblong
            </p>
          </div>
        </div>
      </div>

      {/* 3. MENU UTAMA: Grid Kartu Besar (3 Kolom) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#0F172A]">
            Menu Utama Bidang {user.roleTitle}
          </h2>
          <span className="text-xs text-[#64748B]">
            Klik salah satu modul untuk mengelola data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSubModules.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white p-5 rounded-xl border border-[#E2E8F0] hover:border-[#1E3A8A] hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] text-[#1E3A8A] group-hover:bg-[#1E3A8A] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  <IconRenderer name={item.iconName} className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-[#475569] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#1E3A8A]">
                <span>Buka Modul</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Grafik & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Sederhana */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <h2 className="text-base font-bold text-[#0F172A] mb-1">
            {chartTitle}
          </h2>
          <p className="text-xs text-[#64748B] mb-4">
            Grafik data terpadu seksi Kelurahan Lebakgede
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="total" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Jumlah Data" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] mb-1">
              Aktivitas Terbaru di Kelurahan
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              Pembaruan data dan persetujuan terkini
            </p>
            <div className="divide-y divide-[#E2E8F0]">
              <div className="py-2.5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-[#0F172A]">
                    Persetujuan Rencana Program Kerja Kelurahan 2026
                  </p>
                  <p className="text-[#64748B] mt-0.5">Oleh Lurah • Hari ini</p>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-3">
                <FileText className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-[#0F172A]">
                    Pencatatan Surat Masuk dari Kecamatan Coblong
                  </p>
                  <p className="text-[#64748B] mt-0.5">Sekretariat • Hari ini</p>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-[#0F172A]">
                    Verifikasi Administrasi Kependudukan RW 02
                  </p>
                  <p className="text-[#64748B] mt-0.5">Sie Pemerintahan • Kemarin</p>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-3">
                <FileText className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-[#0F172A]">
                    Pembaruan Data Balita & Baduta Posyandu Anggrek
                  </p>
                  <p className="text-[#64748B] mt-0.5">Sie Kesos • Kemarin</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] text-center">
            <span className="text-xs text-[#64748B]">
              Data diperbarui secara real-time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
