// ============================================================================
// KLIEN DATA PENDUDUK (sisi browser)
// ============================================================================
// Pembungkus tipis di atas route `/api/penduduk`. Komponen klien TIDAK pernah
// menyentuh Google Apps Script langsung — semua lewat server Next.js.

import type { PendudukRecord, PendudukStats, PengurusRecord } from '@/types/penduduk';

export type { PendudukRecord, PendudukStats, PengurusRecord } from '@/types/penduduk';

interface ApiResult {
  ok: boolean;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

async function callApi(payload: Record<string, unknown>): Promise<ApiResult> {
  const res = await fetch('/api/penduduk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  let data: ApiResult;
  try {
    data = (await res.json()) as ApiResult;
  } catch {
    throw new Error('Server tidak memberi jawaban yang bisa dibaca.');
  }

  if (!res.ok || !data.ok) {
    if (data.error === 'unauthorized') {
      throw new Error('Sesi Anda berakhir. Silakan masuk kembali.');
    }
    if (data.error === 'not_configured') {
      throw new Error(
        'Basis data Google Sheets belum tersambung. Hubungi pengelola sistem.'
      );
    }
    throw new Error(data.message || data.error || 'Terjadi kesalahan sistem.');
  }

  return data;
}

export const pendudukApi = {
  list: async (): Promise<PendudukRecord[]> => {
    const res = await callApi({ action: 'list' });
    return (res.items as PendudukRecord[]) || [];
  },

  stats: async (): Promise<PendudukStats> => {
    const res = await callApi({ action: 'stats' });
    return res as unknown as PendudukStats;
  },

  add: (item: PendudukRecord) => callApi({ action: 'add', item }),

  update: (id: string, item: PendudukRecord) => callApi({ action: 'update', id, item }),

  remove: (id: string) => callApi({ action: 'delete', id }),

  bulkSetField: (ids: string[], field: string, value: string) =>
    callApi({ action: 'bulkSetField', ids, field, value }),

  bulkAdd: (items: PendudukRecord[], replaceAll = false) =>
    callApi({ action: 'bulkAdd', items, replaceAll }),

  clear: () => callApi({ action: 'clear' }),
};

export const pengurusApi = {
  list: async (): Promise<PengurusRecord[]> => {
    const res = await callApi({ action: 'pengurusList' });
    return (res.items as PengurusRecord[]) || [];
  },

  save: (id: string | undefined, item: PengurusRecord) =>
    callApi({ action: 'pengurusSave', id: id || '', item }),

  remove: (id: string) => callApi({ action: 'pengurusDelete', id }),

  bulkAdd: (items: PengurusRecord[]) => callApi({ action: 'pengurusBulkAdd', items }),
};

// ----------------------------------------------------------------------------
// Tabel turunan generik (Pengurus MODEL B, Proyek, Kejadian, dst.)
// ----------------------------------------------------------------------------
export const tabelApi = {
  list: async <T = Record<string, unknown>>(table: string): Promise<T[]> => {
    const res = await callApi({ action: 'tableList', table });
    return (res.items as T[]) || [];
  },

  info: (table: string) => callApi({ action: 'tableInfo', table }),

  save: (table: string, id: string | undefined, item: Record<string, unknown>) =>
    callApi({ action: 'tableSave', table, id: id || '', item }),

  remove: (table: string, id: string) => callApi({ action: 'tableDelete', table, id }),

  bulkAdd: (table: string, items: Record<string, unknown>[], replaceAll = false) =>
    callApi({ action: 'tableBulkAdd', table, items, replaceAll }),

  clear: (table: string) => callApi({ action: 'tableClear', table }),
};

// ----------------------------------------------------------------------------
// Laporan bulanan agregat
// ----------------------------------------------------------------------------
export const laporanApi = {
  get: (jenis: string, rw = '') => callApi({ action: 'report', jenis, rw }),
};
