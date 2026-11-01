import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { LaporanView, LaporanData } from '@/components/laporan/laporan-view';
import { PENDUDUK_API_CONFIGURED, fetchReport } from '@/lib/sheets';

// ============================================================================
// /[role]/laporan-penduduk
// Laporan bulanan agregat (UMUR / AGAMA / PDMP) format Pemerintah Kota Bandung.
// ============================================================================

const ALLOWED_ROLES = ['pemerintahan', 'lurah', 'sekel'];

interface LaporanPendudukPageProps {
  params: Promise<{ role: string }>;
}

export default async function LaporanPendudukPage({ params }: LaporanPendudukPageProps) {
  const { role } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  if (session.role !== role || !ALLOWED_ROLES.includes(role)) {
    redirect('/akses-ditolak');
  }

  const jenis = 'umur';
  const rw = '';
  let data: LaporanData | null = null;
  let error: string | null = null;

  if (!PENDUDUK_API_CONFIGURED) {
    error =
      'Basis data Google Sheets belum tersambung. Isi PENDUDUK_API_URL dan PENDUDUK_PIN di .env.local.';
  } else {
    try {
      data = await fetchReport(jenis, rw);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Gagal memuat laporan.';
    }
  }

  return (
    <LaporanView
      role={role}
      initialData={data}
      initialJenis={jenis}
      initialRw={rw}
      initialError={error}
    />
  );
}
