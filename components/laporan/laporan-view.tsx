'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { laporanApi } from '@/lib/penduduk-api';
import { Button } from '@/components/ui/button';
import { RW_OPTIONS } from '@/config/modules';
import {
  Home,
  ChevronRight,
  Printer,
  RefreshCw,
  Loader2,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

// ============================================================================
// Laporan Bulanan Penduduk — format Pemerintah Kota Bandung
// (lembar UMUR / AGAMA / PDMP pada MASTER DATA PENDUDUK.xls)
// ============================================================================

export interface LaporanBaris {
  label: string;
  lk: number;
  pr: number;
  jumlah: number;
}

export interface LaporanData {
  jenis: string;
  rw: string;
  jumlahPenduduk: number;
  total: number;
  baris: LaporanBaris[];
  tidakDiketahui: number;
  belumDiisi: number;
}

const JENIS = [
  { value: 'umur', label: 'Menurut Kelompok Umur' },
  { value: 'agama', label: 'Menurut Golongan Agama' },
  { value: 'pendidikan', label: 'Menurut Pendidikan' },
  { value: 'pekerjaan', label: 'Menurut Mata Pencaharian' },
  { value: 'rw', label: 'Rekapitulasi per RW' },
] as const;

interface LaporanViewProps {
  role: string;
  initialData: LaporanData | null;
  initialJenis: string;
  initialRw: string;
  initialError: string | null;
}

export function LaporanView({
  role,
  initialData,
  initialJenis,
  initialRw,
  initialError,
}: LaporanViewProps) {
  const [jenis, setJenis] = useState(initialJenis);
  const [rw, setRw] = useState(initialRw);
  const [data, setData] = useState<LaporanData | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const judul = useMemo(
    () => JENIS.find((j) => j.value === jenis)?.label || 'Laporan',
    [jenis]
  );

  const muat = useCallback(
    async (j: string, r: string) => {
      setIsLoading(true);
      try {
        const res = (await laporanApi.get(j, r)) as unknown as LaporanData;
        setData(res);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat laporan.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const gantiJenis = (j: string) => {
    setJenis(j);
    void muat(j, rw);
  };

  const gantiRw = (r: string) => {
    setRw(r);
    void muat(jenis, r);
  };

  const totalLk = data?.baris.reduce((a, b) => a + b.lk, 0) ?? 0;
  const totalPr = data?.baris.reduce((a, b) => a + b.pr, 0) ?? 0;

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Link href={`/${role}/beranda`} className="hover:text-[#1E3A8A] flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#0F172A]">Laporan Bulanan Penduduk</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#1E3A8A]" />
            Laporan Bulanan Penduduk
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Rekapitulasi format Pemerintah Kota Bandung — bersumber dari Google Sheets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => muat(jenis, rw)} disabled={isLoading} className="justify-center bg-white">
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Muat Ulang
          </Button>
          <Button variant="primary" onClick={() => window.print()} className="justify-center bg-[#1E3A8A] hover:bg-[#2563EB]">
            <Printer className="w-4 h-4 mr-1.5" />
            Cetak
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white border border-[#E2E8F0] rounded-xl p-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1.5">
            Jenis Laporan
          </label>
          <select
            value={jenis}
            onChange={(e) => gantiJenis(e.target.value)}
            className="w-full min-h-[44px] px-3 rounded-lg border border-[#CBD5E1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          >
            {JENIS.map((j) => (
              <option key={j.value} value={j.value}>{j.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:w-56">
          <label className="block text-xs font-semibold text-[#64748B] uppercase mb-1.5">
            Wilayah
          </label>
          <select
            value={rw}
            onChange={(e) => gantiRw(e.target.value)}
            className="w-full min-h-[44px] px-3 rounded-lg border border-[#CBD5E1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          >
            <option value="">Seluruh Kelurahan</option>
            {RW_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-5 text-center">
          <AlertTriangle className="w-8 h-8 text-[#B91C1C] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#B91C1C]">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#64748B]">
          <Loader2 className="w-7 h-7 animate-spin text-[#1E3A8A]" />
          <p className="mt-3 text-sm font-medium">Menghitung laporan…</p>
        </div>
      ) : data ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          {/* Kepala laporan */}
          <div className="px-4 sm:px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] text-center">
            <p className="text-sm font-bold text-[#0F172A]">PEMERINTAH KOTA BANDUNG</p>
            <p className="text-sm font-bold text-[#0F172A]">KECAMATAN COBLONG</p>
            <p className="text-base font-bold text-[#0F172A]">KELURAHAN LEBAKGEDE</p>
            <p className="mt-2 text-sm font-semibold text-[#1E3A8A]">
              LAPORAN PENDUDUK — {judul.toUpperCase()}
            </p>
            <p className="text-xs text-[#64748B]">
              Wilayah: {data.rw === 'SEMUA' ? 'Seluruh Kelurahan' : data.rw} · {data.jumlahPenduduk} jiwa
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F1F5F9] text-[#0F172A]">
                  <th className="px-4 py-2.5 text-left font-bold border-b border-[#E2E8F0]">No</th>
                  <th className="px-4 py-2.5 text-left font-bold border-b border-[#E2E8F0]">{judul}</th>
                  <th className="px-4 py-2.5 text-right font-bold border-b border-[#E2E8F0]">Lk</th>
                  <th className="px-4 py-2.5 text-right font-bold border-b border-[#E2E8F0]">Pr</th>
                  <th className="px-4 py-2.5 text-right font-bold border-b border-[#E2E8F0]">Lk + Pr</th>
                </tr>
              </thead>
              <tbody>
                {data.baris.map((row, i) => (
                  <tr key={row.label} className={i % 2 ? 'bg-[#FAFBFC]' : 'bg-white'}>
                    <td className="px-4 py-2 text-[#64748B] border-b border-[#F1F5F9]">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-[#0F172A] border-b border-[#F1F5F9]">{row.label}</td>
                    <td className="px-4 py-2 text-right text-[#0F172A] border-b border-[#F1F5F9]">{row.lk || '—'}</td>
                    <td className="px-4 py-2 text-right text-[#0F172A] border-b border-[#F1F5F9]">{row.pr || '—'}</td>
                    <td className="px-4 py-2 text-right font-bold text-[#1E3A8A] border-b border-[#F1F5F9]">{row.jumlah}</td>
                  </tr>
                ))}
                <tr className="bg-[#EFF6FF]">
                  <td className="px-4 py-3 font-bold text-[#1E3A8A]" colSpan={2}>JUMLAH</td>
                  <td className="px-4 py-3 text-right font-bold text-[#1E3A8A]">{totalLk}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#1E3A8A]">{totalPr}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#1E3A8A]">{data.total}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {(data.tidakDiketahui > 0 || data.belumDiisi > 0) && (
            <div className="px-4 sm:px-6 py-3 border-t border-[#E2E8F0] bg-[#FFFBEB] text-xs text-[#92400E]">
              {data.tidakDiketahui > 0 && (
                <p>• {data.tidakDiketahui} baris tidak masuk hitungan karena tanggal lahir tidak terbaca.</p>
              )}
              {data.belumDiisi > 0 && (
                <p>• {data.belumDiisi} baris belum diisi kolomnya (masuk kategori &ldquo;(belum diisi)&rdquo;).</p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
