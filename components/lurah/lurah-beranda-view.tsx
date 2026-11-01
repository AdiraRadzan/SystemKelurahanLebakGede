'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKelurahanStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRupiah, formatIndonesianDate, getTimeGreeting } from '@/lib/utils';
import { toast } from '@/lib/toast';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Send,
  BarChart3,
  CheckSquare,
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
} from 'recharts';

export function LurahBerandaView() {
  const { data, approveItem, rejectItem } = useKelurahanStore();
  const [quickNotes, setQuickNotes] = useState<Record<string, string>>({});

  // Collect all programs and activities across all 4 sections
  const allPrograms = [
    ...(data['sekel_rencana-program-kerja'] || []),
    ...(data['pemerintahan_rencana-program-kerja'] || []),
    ...(data['ekbang_rencana-program-kerja'] || []),
    ...(data['kesos_rencana-program-kerja'] || []),
  ];

  const allActivities = [
    ...(data['sekel_rencana-giat'] || []),
    ...(data['pemerintahan_rencana-giat'] || []),
    ...(data['ekbang_rencana-giat'] || []),
    ...(data['kesos_rencana-giat'] || []),
  ];

  const pendingPrograms = allPrograms.filter((p) => p.status === 'Diajukan');
  const pendingActivities = allActivities.filter((g) => g.status === 'Diajukan');
  const combinedPending = [
    ...pendingPrograms.map((p) => ({ ...p, type: 'Program Kerja', storeKey: `${p.role}_rencana-program-kerja` })),
    ...pendingActivities.map((g) => ({ ...g, type: 'Rencana Giat', storeKey: `${g.role}_rencana-giat` })),
  ].slice(0, 5); // Maksimal 5 item

  const suratMasukList = data['sekel_surat-masuk'] || [];
  const pendingDisposisi = suratMasukList.filter((s) => s.statusDisposisi === 'Menunggu Disposisi');

  const handleQuickApprove = (item: any) => {
    const note = quickNotes[item.id] || 'Disetujui oleh Lurah Lebakgede.';
    approveItem(item.storeKey, item.id, note);
    toast.success('Pengajuan Disetujui', `Pengajuan "${item.namaProgram || item.namaKegiatan}" telah disetujui.`);
    setQuickNotes((prev) => {
      const copy = { ...prev };
      delete copy[item.id];
      return copy;
    });
  };

  const handleQuickReject = (item: any) => {
    const note = quickNotes[item.id];
    if (!note || note.trim() === '') {
      toast.warning('Catatan Wajib Diisi', 'Silakan tuliskan alasan penolakan pada kolom catatan singkat.');
      return;
    }
    rejectItem(item.storeKey, item.id, note);
    toast.error('Pengajuan Ditolak', `Pengajuan telah dikembalikan dengan catatan: "${note}"`);
    setQuickNotes((prev) => {
      const copy = { ...prev };
      delete copy[item.id];
      return copy;
    });
  };

  // Chart data: Program count by Bidang
  const chartBidangData = [
    { name: 'Sekretariat', count: (data['sekel_rencana-program-kerja'] || []).length },
    { name: 'Pemerintahan', count: (data['pemerintahan_rencana-program-kerja'] || []).length },
    { name: 'Ekbang', count: (data['ekbang_rencana-program-kerja'] || []).length },
    { name: 'Kesos', count: (data['kesos_rencana-program-kerja'] || []).length },
  ];

  // Chart data: Status breakdown
  const approvedCount = allPrograms.filter((p) => p.status === 'Disetujui').length;
  const pendingCount = allPrograms.filter((p) => p.status === 'Diajukan').length;
  const draftOrRejectedCount = allPrograms.filter((p) => p.status === 'Draft' || p.status === 'Ditolak').length;

  const pieStatusData = [
    { name: 'Disetujui', value: approvedCount, color: '#15803D' },
    { name: 'Menunggu', value: pendingCount, color: '#B45309' },
    { name: 'Draft / Ditolak', value: draftOrRejectedCount, color: '#475569' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Sapaan & Tanggal */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            {getTimeGreeting()}, Bapak Lurah
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            Pantau kinerja program, persetujuan rencana giat, dan arahan disposisi surat kelurahan.
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1E3A8A]">
          <Calendar className="w-4 h-4 text-[#1E3A8A]" />
          <span>{formatIndonesianDate()}</span>
        </div>
      </div>

      {/* 2. 4 Kartu Ringkasan Angka Besar */}
      <div>
        <h2 className="text-base font-bold text-[#0F172A] mb-3">
          Ringkasan Pengawasan Pimpinan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Menunggu Persetujuan
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#B45309]">
                {pendingPrograms.length + pendingActivities.length}
              </span>
              <span className="text-xs font-semibold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                Perlu Tindakan
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Program kerja & giat seksi
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Surat Butuh Disposisi
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#1E3A8A]">
                {pendingDisposisi.length}
              </span>
              <span className="text-xs font-semibold text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                Surat Masuk
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Belum diteruskan ke seksi
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Program Disetujui
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#15803D]">
                {approvedCount}
              </span>
              <span className="text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                Aktif 2026
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              DIPA / Anggaran berjalan
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Wilayah Kelurahan
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">5 RW</span>
              <span className="text-xs font-semibold text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                48 RT
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Kelurahan Lebakgede
            </p>
          </div>
        </div>
      </div>

      {/* 3. Daftar Menunggu Persetujuan Anda (Maksimal 5 item + Tombol Setujui/Tolak + Catatan) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Menunggu Persetujuan Anda
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Tinjau pengajuan dari Sekretaris dan para Kepala Seksi
            </p>
          </div>
          <Link
            href="/lurah/persetujuan"
            className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1"
          >
            <span>Buka Semua Pengajuan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {combinedPending.length > 0 ? (
          <div className="space-y-4">
            {combinedPending.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#1E3A8A]">
                      {item.type}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">
                      Bidang: {item.bidang}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {item.namaProgram || item.namaKegiatan}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] mt-1.5">
                    <span>Penanggung Jawab: <strong className="text-[#0F172A]">{item.penanggungJawab}</strong></span>
                    {item.anggaran && (
                      <span>Anggaran: <strong className="text-[#0F172A]">{formatRupiah(item.anggaran)}</strong></span>
                    )}
                    <span>Lokasi: {item.lokasi}</span>
                  </div>
                </div>

                {/* Kolom Catatan Singkat & Tombol Aksi */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="text"
                    value={quickNotes[item.id] || ''}
                    onChange={(e) =>
                      setQuickNotes({ ...quickNotes, [item.id]: e.target.value })
                    }
                    placeholder="Catatan arahan / revisi..."
                    className="px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] min-w-[200px]"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleQuickApprove(item)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold transition-colors min-h-[32px] sm:min-h-[34px] shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                    <button
                      onClick={() => handleQuickReject(item)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FECACA] bg-[#FEE2E2] hover:bg-[#FCA5A5]/60 text-[#B91C1C] text-xs font-semibold transition-colors min-h-[32px] sm:min-h-[34px]"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
            <CheckCircle2 className="w-8 h-8 text-[#15803D] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0F172A]">
              Semua Pengajuan Telah Ditinjau
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Saat ini tidak ada program atau rencana giat yang menunggu persetujuan Anda.
            </p>
          </div>
        )}
      </div>

      {/* 4. 2 Grafik Sederhana dengan Judul Jelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik 1: Program Kerja per Bidang */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <h2 className="text-base font-bold text-[#0F172A] mb-1">
            Distribusi Program Kerja per Bidang
          </h2>
          <p className="text-xs text-[#64748B] mb-4">
            Jumlah program yang direncanakan tahun 2026
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartBidangData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="count" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Jumlah Program" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik 2: Status Persetujuan Program */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] mb-1">
              Status Keseluruhan Program Kerja
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              Perbandingan program disetujui, diajukan, dan draft
            </p>
          </div>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-[#475569] pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#15803D]" />
              <span>Disetujui ({approvedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#B45309]" />
              <span>Menunggu ({pendingCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#475569]" />
              <span>Draft ({draftOrRejectedCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Kegiatan Minggu Ini */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <h2 className="text-base font-bold text-[#0F172A] mb-4">
          Agenda Kegiatan Kelurahan Minggu Ini
        </h2>
        <div className="divide-y divide-[#E2E8F0]">
          {allActivities.slice(0, 4).map((giat) => (
            <div key={giat.id} className="py-3.5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {giat.namaKegiatan}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Bidang: {giat.bidang} • Penanggung Jawab: {giat.penanggungJawab}
                  </p>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Lokasi: {giat.lokasi}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={giat.status} />
                <p className="text-xs text-[#64748B] mt-1 font-semibold">
                  {formatIndonesianDate(giat.tanggal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
