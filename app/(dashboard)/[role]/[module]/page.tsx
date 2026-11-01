import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { getModuleConfig } from '@/config/modules';
import { ModuleView } from '@/components/modules/module-view';
import { TabelView } from '@/components/tabel/tabel-view';
import { PENDUDUK_API_CONFIGURED, listTable } from '@/lib/sheets';

interface ModulePageProps {
  params: Promise<{ role: string; module: string }>;
}

// ============================================================================
// Pemetaan modul -> tabel Google Sheets.
// Modul di sini TIDAK memakai data mock (store lokal), melainkan membaca/menulis
// sheet melalui /api/penduduk. Slug -> nama tabel di TABLE_DEFS (Code.gs).
// ============================================================================
const SHEETS_MODULES: Record<string, Record<string, string>> = {
  pemerintahan: {
    'pengurus-rw': 'pengurus',
    'pengurus-rt': 'pengurus',
    trantibum: 'kejadian',
    'penduduk-sementara': 'pendudukSementara',
    'perubahan-penduduk': 'perubahanPenduduk',
  },
  ekbang: {
    infrastruktur: 'proyek',
    'fasilitas-sarpras': 'fasilitas',
  },
};

export default async function ModulePage({ params }: ModulePageProps) {
  const { role, module: moduleSlug } = await params;

  // Authorization check
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  if (session.role !== role) {
    redirect('/akses-ditolak');
  }

  const config = getModuleConfig(role, moduleSlug);

  if (!config) {
    notFound();
  }

  const sheetsTable = SHEETS_MODULES[role]?.[moduleSlug];

  if (sheetsTable) {
    let rows: Record<string, unknown>[] = [];
    let error: string | null = null;

    if (!PENDUDUK_API_CONFIGURED) {
      error =
        'Basis data Google Sheets belum tersambung. Isi PENDUDUK_API_URL dan PENDUDUK_PIN di .env.local.';
    } else {
      try {
        rows = await listTable(sheetsTable);
      } catch (err) {
        error = err instanceof Error ? err.message : 'Gagal memuat data.';
      }
    }

    // Modul RW dan RT berbagi satu sheet `pengurus`; saring sesuai jabatan.
    if (moduleSlug === 'pengurus-rw') {
      rows = rows.filter((r) => String(r.Jabatan ?? '').includes('Rukun Warga'));
    } else if (moduleSlug === 'pengurus-rt') {
      rows = rows.filter((r) => String(r.Jabatan ?? '').includes('Rukun Tetangga'));
    }

    // Kolom internal yang tidak perlu ditampilkan di form.
    const hidden = moduleSlug.startsWith('pengurus') ? ['Wilayah'] : [];

    return (
      <TabelView
        table={sheetsTable}
        config={config}
        role={role}
        initialItems={rows}
        initialError={error}
        hidden={hidden}
      />
    );
  }

  return <ModuleView config={config} role={role} />;
}
