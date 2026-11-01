import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { getModuleConfig } from '@/config/modules';
import { PendudukView } from '@/components/penduduk/penduduk-view';
import {
  PENDUDUK_API_CONFIGURED,
  listPenduduk,
  statsPenduduk,
  type PendudukRow,
  type PendudukStats,
} from '@/lib/sheets';
// ============================================================================
// /[role]/data-penduduk
// Halaman khusus: data warga per-jiwa dari Google Sheets (dashboard penduduk).
// Data awal diambil di sisi server supaya halaman langsung terisi (tanpa
// efek pengambilan data di klien). Penyegaran & mutasi lewat /api/penduduk.
// ============================================================================

const ALLOWED_ROLES = ['pemerintahan', 'lurah', 'sekel'];

interface DataPendudukPageProps {
  params: Promise<{ role: string }>;
}

export default async function DataPendudukPage({ params }: DataPendudukPageProps) {
  const { role } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  if (session.role !== role) {
    redirect('/akses-ditolak');
  }

  if (!ALLOWED_ROLES.includes(role)) {
    redirect('/akses-ditolak');
  }

  const config = getModuleConfig('pemerintahan', 'data-penduduk');

  if (!config) {
    notFound();
  }

  // Ambil data awal. Bila backend belum dikonfigurasi atau gagal, halaman
  // tetap tampil dengan pesan yang jelas (aplikasi tidak ikut mati).
  let rows: PendudukRow[] = [];
  let stats: PendudukStats | null = null;
  let error: string | null = null;

  if (!PENDUDUK_API_CONFIGURED) {
    error =
      'Basis data Google Sheets belum tersambung. Isi PENDUDUK_API_URL dan PENDUDUK_PIN di .env.local, lalu jalankan ulang server.';
  } else {
    try {
      const [r, s] = await Promise.all([listPenduduk(), statsPenduduk()]);
      rows = r;
      stats = s;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Gagal memuat data penduduk.';
    }
  }

  return (
    <PendudukView
      config={config}
      role={role}
      initialItems={rows}
      initialStats={stats}
      initialError={error}
    />
  );
}
