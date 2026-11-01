import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { getModuleConfig } from '@/config/modules';
import { RW_OPTIONS } from '@/config/modules';
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
    pengurus: 'pengurus',
    trantibum: 'kejadian',
    'penduduk-sementara': 'pendudukSementara',
    'perubahan-penduduk': 'perubahanPenduduk',
  },
  ekbang: {
    infrastruktur: 'proyek',
    'fasilitas-sarpras': 'fasilitas',
  },
};

// Modul dengan tampilan berkelompok (bukan tabel datar).
// Pengurus digabung jadi satu menu, dikelompokkan per RW.
const GROUPED_MODULES: Record<string, { groupBy: string; groupLabel: string }> = {
  pengurus: { groupBy: 'Wilayah', groupLabel: 'RW' },
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

  // Menu lama "Data Pengurus RW" dan "Data Pengurus RT" kini digabung.
  if (moduleSlug === 'pengurus-rw' || moduleSlug === 'pengurus-rt') {
    redirect(`/${role}/pengurus`);
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

    const grouped = GROUPED_MODULES[moduleSlug];

    return (
      <TabelView
        table={sheetsTable}
        config={config}
        role={role}
        initialItems={rows}
        initialError={error}
        groupBy={grouped?.groupBy}
        groupLabel={grouped?.groupLabel}
        groupOptions={grouped ? RW_OPTIONS : undefined}
      />
    );
  }

  return <ModuleView config={config} role={role} />;
}
