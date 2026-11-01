'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useKelurahanStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { formatRupiah, formatIndonesianDate } from '@/lib/utils';
import { toast } from '@/lib/toast';
import {
  CheckSquare,
  Home,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Send,
  Calendar,
  Building,
} from 'lucide-react';

export default function LurahPersetujuanPage() {
  const { data, approveItem, rejectItem } = useKelurahanStore();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Diajukan' | 'Disetujui' | 'Ditolak'>('ALL');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Combine all Program Kerja & Rencana Giat from all 4 roles
  const allSubmissions = useMemo(() => {
    const roles = ['sekel', 'pemerintahan', 'ekbang', 'kesos'];
    const list: any[] = [];

    roles.forEach((r) => {
      const progs = data[`${r}_rencana-program-kerja`] || [];
      progs.forEach((p: any) => {
        list.push({
          ...p,
          itemType: 'Rencana Program Kerja',
          storeKey: `${r}_rencana-program-kerja`,
          title: p.namaProgram,
        });
      });

      const giats = data[`${r}_rencana-giat`] || [];
      giats.forEach((g: any) => {
        list.push({
          ...g,
          itemType: 'Rencana Giat',
          storeKey: `${r}_rencana-giat`,
          title: g.namaKegiatan,
        });
      });
    });

    return list;
  }, [data]);

  const filteredSubmissions = useMemo(() => {
    if (activeFilter === 'ALL') return allSubmissions;
    return allSubmissions.filter((item) => item.status === activeFilter);
  }, [allSubmissions, activeFilter]);

  const handleOpenDetail = (item: any) => {
    setSelectedItem(item);
    setCatatan(item.catatanLurah || '');
    setDetailModalOpen(true);
  };

  const handleApprove = () => {
    if (!selectedItem) return;
    setIsProcessing(true);
    setTimeout(() => {
      const note = catatan.trim() || 'Disetujui oleh Lurah Lebakgede.';
      approveItem(selectedItem.storeKey, selectedItem.id, note);
      toast.success('Pengajuan Disetujui', `Pengajuan "${selectedItem.title}" telah disetujui.`);
      setIsProcessing(false);
      setDetailModalOpen(false);
    }, 300);
  };

  const handleReject = () => {
    if (!selectedItem) return;
    if (!catatan.trim()) {
      toast.warning('Catatan Wajib Diisi', 'Silakan tuliskan alasan penolakan untuk perbaikan.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      rejectItem(selectedItem.storeKey, selectedItem.id, catatan.trim());
      toast.error('Pengajuan Ditolak', `Pengajuan "${selectedItem.title}" ditolak dengan catatan.`);
      setIsProcessing(false);
      setDetailModalOpen(false);
    }, 300);
  };

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
        <span className="font-bold text-[#0F172A]">Persetujuan Program & Giat</span>
      </nav>

      {/* Header Halaman */}
      <div className="pb-2 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-extrabold text-[#0F172A] leading-tight">
          Persetujuan Rencana Program Kerja & Giat
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Tinjau usulan program kerja tahunan dan rencana giat mingguan dari seluruh seksi kelurahan
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'ALL'
              ? 'bg-[#1E3A8A] text-white shadow-2xs'
              : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          Semua ({allSubmissions.length})
        </button>
        <button
          onClick={() => setActiveFilter('Diajukan')}
          className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Diajukan'
              ? 'bg-[#B45309] text-white shadow-2xs'
              : 'bg-white border border-[#CBD5E1] text-[#B45309] hover:bg-[#FEF3C7]'
          }`}
        >
          Menunggu ({allSubmissions.filter((i) => i.status === 'Diajukan').length})
        </button>
        <button
          onClick={() => setActiveFilter('Disetujui')}
          className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Disetujui'
              ? 'bg-[#15803D] text-white shadow-2xs'
              : 'bg-white border border-[#CBD5E1] text-[#15803D] hover:bg-[#DCFCE7]'
          }`}
        >
          Disetujui ({allSubmissions.filter((i) => i.status === 'Disetujui').length})
        </button>
        <button
          onClick={() => setActiveFilter('Ditolak')}
          className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[34px] whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Ditolak'
              ? 'bg-[#B91C1C] text-white shadow-2xs'
              : 'bg-white border border-[#CBD5E1] text-[#B91C1C] hover:bg-[#FEE2E2]'
          }`}
        >
          Ditolak ({allSubmissions.filter((i) => i.status === 'Ditolak').length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN MOBILE: KARTU USULAN (HP)                       */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-3">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#F1F5F9]">
                <div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E3A8A] border border-blue-200">
                    {item.itemType}
                  </span>
                  <p className="font-bold text-[#0F172A] text-sm mt-1.5">{item.title}</p>
                  <p className="text-xs text-[#64748B]">Bidang: {item.bidang}</p>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={item.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC] p-2.5 rounded-lg border border-[#F1F5F9]">
                <div>
                  <span className="text-[#64748B] block font-medium">PJ & Lokasi:</span>
                  <p className="font-semibold text-[#0F172A] truncate">{item.penanggungJawab} • {item.lokasi}</p>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Anggaran:</span>
                  <p className="font-bold text-[#0F172A]">
                    {item.anggaran ? formatRupiah(item.anggaran) : '-'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOpenDetail(item)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-semibold transition-colors min-h-[36px] shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tinjau & Setujui</span>
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center text-[#64748B] text-xs">
            Tidak ada pengajuan pada filter ini.
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN DESKTOP/TABLET: TABEL PENGAJUAN                 */}
      {/* ======================================================== */}
      <div className="hidden md:block bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-x-auto table-scrollbar">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]">
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[130px]">Jenis Usulan</th>
              <th className="px-3.5 py-3.5 font-bold min-w-[200px]">Nama Program / Kegiatan</th>
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[160px]">Bidang Pelaksana</th>
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[140px]">Pagu Anggaran</th>
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[130px]">Status</th>
              <th className="sticky right-0 z-20 bg-[#F8FAFC] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] border-l border-[#E2E8F0] px-4 py-3.5 font-bold whitespace-nowrap text-right w-[160px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="group bg-white hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-3.5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#1E3A8A] border border-blue-200">
                      {item.itemType}
                    </span>
                  </td>
                  <td className="px-3.5 py-3.5 max-w-[280px]">
                    <p className="font-bold text-[#0F172A] truncate" title={item.title}>{item.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 truncate">
                      PJ: {item.penanggungJawab}
                    </p>
                  </td>
                  <td className="px-3.5 py-3.5 font-medium text-[#475569] whitespace-nowrap">
                    {item.bidang}
                  </td>
                  <td className="px-3.5 py-3.5 font-semibold text-[#0F172A] whitespace-nowrap">
                    {item.anggaran ? formatRupiah(item.anggaran) : '-'}
                  </td>
                  <td className="px-3.5 py-3.5 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="sticky right-0 z-10 bg-white group-hover:bg-[#F8FAFC] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] border-l border-[#E2E8F0] px-4 py-3.5 text-right whitespace-nowrap w-[160px]">
                    <button
                      onClick={() => handleOpenDetail(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#1E3A8A] hover:bg-[#EFF6FF] hover:border-[#1E3A8A] transition-colors min-h-[32px] shadow-2xs whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Tinjau &amp; Setujui</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#64748B]">
                  Tidak ada pengajuan pada filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tinjau & Beri Persetujuan */}
      <Dialog
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Tinjauan Persetujuan Pengajuan"
        description="Pelajari rincian usulan dan putuskan persetujuan atau arahan revisi"
        maxWidth="lg"
      >
        {selectedItem && (
          <div className="space-y-5">
            {/* Rincian Usulan */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E3A8A] uppercase">
                  {selectedItem.itemType}
                </span>
                <StatusBadge status={selectedItem.status} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {selectedItem.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#475569] pt-2 border-t border-[#E2E8F0]">
                <p>Bidang: <strong className="text-[#0F172A]">{selectedItem.bidang}</strong></p>
                <p>PJ: <strong className="text-[#0F172A]">{selectedItem.penanggungJawab}</strong></p>
                <p>Lokasi: <strong className="text-[#0F172A]">{selectedItem.lokasi}</strong></p>
                <p>Pagu: <strong className="text-[#0F172A]">{selectedItem.anggaran ? formatRupiah(selectedItem.anggaran) : '-'}</strong></p>
                {selectedItem.tanggal && (
                  <p>Tanggal Giat: <strong className="text-[#0F172A]">{formatIndonesianDate(selectedItem.tanggal)}</strong></p>
                )}
                {selectedItem.tanggalMulai && (
                  <p>Periode: <strong className="text-[#0F172A]">{formatIndonesianDate(selectedItem.tanggalMulai)} s/d {formatIndonesianDate(selectedItem.tanggalSelesai)}</strong></p>
                )}
              </div>
            </div>

            {/* Form Catatan / Arahan Lurah */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                Catatan / Arahan Lurah
              </label>
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tuliskan arahan persetujuan atau rincian perbaikan jika ditolak..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
              <p className="text-xs text-[#64748B] mt-1">
                Catatan ini akan langsung terbaca oleh bidang pembuat usulan.
              </p>
            </div>

            {/* Tombol Keputusan (Responsif HP & Desktop) */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-4 border-t border-[#E2E8F0]">
              <Button
                variant="outline"
                onClick={() => setDetailModalOpen(false)}
                disabled={isProcessing}
                className="w-full sm:w-auto justify-center"
              >
                Tutup
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="danger"
                  onClick={handleReject}
                  isLoading={isProcessing}
                  className="flex-1 sm:flex-initial justify-center"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Tolak Usulan
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApprove}
                  isLoading={isProcessing}
                  className="flex-1 sm:flex-initial bg-[#15803D] hover:bg-[#166534] justify-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Setujui Usulan
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
