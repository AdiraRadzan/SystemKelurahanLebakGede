'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKelurahanStore } from '@/lib/store';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { formatIndonesianDate } from '@/lib/utils';
import { toast } from '@/lib/toast';
import {
  Send,
  Home,
  ChevronRight,
  Inbox,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react';

const SEKSI_DISPOSISI = [
  { role: 'sekel', title: 'Sekretaris Kelurahan' },
  { role: 'pemerintahan', title: 'Sie Pemerintahan' },
  { role: 'ekbang', title: 'Sie Ekonomi dan Pembangunan' },
  { role: 'kesos', title: 'Sie Kesejahteraan Sosial' },
];

export default function LurahDisposisiPage() {
  const { data, disposisiSurat } = useKelurahanStore();
  const suratMasukList = data['sekel_surat-masuk'] || [];

  const [selectedSurat, setSelectedSurat] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('pemerintahan');
  const [instruksi, setInstruksi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDisposisi = (surat: any) => {
    setSelectedSurat(surat);
    setTargetRole(surat.disposisiKe || 'pemerintahan');
    setInstruksi(surat.instruksiLurah || '');
    setModalOpen(true);
  };

  const handleKirimDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurat) return;

    if (!instruksi.trim()) {
      toast.warning('Instruksi Wajib Diisi', 'Silakan tulis instruksi atau arahan pimpinan untuk seksi terkait.');
      return;
    }

    const seksiObj = SEKSI_DISPOSISI.find((s) => s.role === targetRole);
    const targetTitle = seksiObj ? seksiObj.title : 'Seksi Terkait';

    setIsSubmitting(true);
    setTimeout(() => {
      disposisiSurat(selectedSurat.id, targetRole, targetTitle, instruksi.trim());
      toast.success(
        'Disposisi Berhasil Dikirim',
        `Surat nomor ${selectedSurat.nomorSurat} telah didisposisikan ke ${targetTitle}.`
      );
      setIsSubmitting(false);
      setModalOpen(false);
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
        <span className="font-bold text-[#0F172A]">Disposisi Surat Masuk</span>
      </nav>

      {/* Header Halaman */}
      <div className="pb-2 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-extrabold text-[#0F172A] leading-tight">
          Disposisi Surat Masuk
        </h1>
        <p className="text-sm text-[#475569] mt-1">
          Teruskan surat masuk kepada Sekretaris atau Kepala Seksi terkait disertai instruksi pimpinan
        </p>
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN MOBILE: KARTU SURAT MASUK (HP)                  */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-3">
        {suratMasukList.map((surat, idx) => (
          <div
            key={surat.id || idx}
            className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#F1F5F9]">
              <div>
                <span className="text-[11px] font-bold text-[#1E3A8A] px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
                  Agenda {surat.nomorAgenda}
                </span>
                <p className="font-bold text-[#0F172A] text-sm mt-1.5">{surat.nomorSurat}</p>
                <p className="text-xs text-[#64748B]">{formatIndonesianDate(surat.tanggalSurat)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={surat.statusDisposisi} />
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-[#B45309] border border-amber-200">
                  {surat.sifat}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-[#64748B]">Asal Pengirim:</span>
                <p className="font-semibold text-[#0F172A]">{surat.asalSurat}</p>
              </div>
              <div>
                <span className="text-[#64748B]">Perihal:</span>
                <p className="font-medium text-[#334155]">{surat.perihal}</p>
              </div>
              {surat.disposisiKeTitle && (
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-[#1E3A8A]">
                  <span className="font-bold block">Tujuan: {surat.disposisiKeTitle}</span>
                  {surat.instruksiLurah && (
                    <p className="mt-0.5 text-[11px] italic">&ldquo;{surat.instruksiLurah}&rdquo;</p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => handleOpenDisposisi(surat)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-semibold transition-colors min-h-[36px] shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{surat.statusDisposisi === 'Menunggu Disposisi' ? 'Beri Disposisi' : 'Ubah Disposisi'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN DESKTOP/TABLET: TABEL SURAT MASUK               */}
      {/* ======================================================== */}
      <div className="hidden md:block bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-x-auto table-scrollbar">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]">
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[110px]">No. Agenda</th>
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[170px]">Nomor &amp; Tanggal</th>
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[160px]">Asal Instansi</th>
              <th className="px-3.5 py-3.5 font-bold min-w-[200px]">Perihal Surat</th>
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[90px]">Sifat</th>
              <th className="px-3.5 py-3.5 font-bold whitespace-nowrap w-[160px]">Status Disposisi</th>
              <th className="sticky right-0 z-20 bg-[#F8FAFC] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] border-l border-[#E2E8F0] px-4 py-3.5 font-bold whitespace-nowrap text-right w-[150px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {suratMasukList.map((surat, idx) => (
              <tr key={surat.id || idx} className="group bg-white hover:bg-[#F8FAFC] transition-colors">
                <td className="px-3.5 py-3.5 font-semibold text-[#1E3A8A] whitespace-nowrap">
                  {surat.nomorAgenda}
                </td>
                <td className="px-3.5 py-3.5 whitespace-nowrap">
                  <p className="font-bold text-[#0F172A]">{surat.nomorSurat}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {formatIndonesianDate(surat.tanggalSurat)}
                  </p>
                </td>
                <td className="px-3.5 py-3.5 font-medium text-[#475569] max-w-[180px]">
                  <p className="truncate" title={surat.asalSurat}>{surat.asalSurat}</p>
                </td>
                <td className="px-3.5 py-3.5 text-sm text-[#0F172A] max-w-[260px]">
                  <p className="line-clamp-2 leading-relaxed" title={surat.perihal}>{surat.perihal}</p>
                  {surat.disposisiKeTitle && (
                    <span className="inline-block mt-1 text-[11px] font-semibold text-[#1E3A8A]">
                      ↳ Tujuan: {surat.disposisiKeTitle}
                    </span>
                  )}
                </td>
                <td className="px-3.5 py-3.5 whitespace-nowrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-[#B45309] border border-amber-200">
                    {surat.sifat}
                  </span>
                </td>
                <td className="px-3.5 py-3.5 whitespace-nowrap">
                  <StatusBadge status={surat.statusDisposisi} />
                </td>
                <td className="sticky right-0 z-10 bg-white group-hover:bg-[#F8FAFC] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] border-l border-[#E2E8F0] px-4 py-3.5 text-right whitespace-nowrap w-[150px]">
                  <button
                    onClick={() => handleOpenDisposisi(surat)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-semibold transition-colors min-h-[32px] shadow-2xs whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{surat.statusDisposisi === 'Menunggu Disposisi' ? 'Beri Disposisi' : 'Ubah Disposisi'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Disposisi Surat */}
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Formulir Disposisi Surat"
        description="Tentukan bidang pelaksana dan tuliskan instruksi arahan"
        maxWidth="lg"
      >
        {selectedSurat && (
          <form onSubmit={handleKirimDisposisi} className="space-y-4">
            {/* Info Surat Terpilih */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
              <p className="text-[#64748B]">
                Nomor Surat: <strong className="text-[#0F172A]">{selectedSurat.nomorSurat}</strong>
              </p>
              <p className="text-[#64748B]">
                Asal Pengirim: <strong className="text-[#0F172A]">{selectedSurat.asalSurat}</strong>
              </p>
              <p className="text-[#64748B]">
                Perihal: <strong className="text-[#0F172A]">{selectedSurat.perihal}</strong>
              </p>
            </div>

            {/* Pilihan Tujuan Disposisi */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                Tujuan Disposisi (Pilih Bidang / Seksi) <span className="text-[#B91C1C]">*</span>
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] min-h-[44px]"
              >
                {SEKSI_DISPOSISI.map((s) => (
                  <option key={s.role} value={s.role}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Instruksi Singkat */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                Instruksi / Catatan Arahan Pimpinan <span className="text-[#B91C1C]">*</span>
              </label>
              <textarea
                rows={4}
                value={instruksi}
                onChange={(e) => setInstruksi(e.target.value)}
                placeholder="Contoh: Pelajari dan tindaklanjuti, siapkan bahan laporan, atau hadiri undangan mewakili kelurahan..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
              <p className="text-xs text-[#64748B] mt-1">
                Instruksi akan langsung terdistribusi ke akun seksi yang dituju.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 border-t border-[#E2E8F0]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto justify-center"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full sm:w-auto bg-[#1E3A8A] hover:bg-[#2563EB] justify-center"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Kirim Disposisi
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
