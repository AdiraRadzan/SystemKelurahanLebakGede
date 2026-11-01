// ============================================================================
// KLIEN GOOGLE SHEETS (via Google Apps Script Web App)
// ============================================================================
// Server-only. Dipakai oleh route handler di `app/api/penduduk/*`.
//
// Backend-nya adalah `dashboard-penduduk/apps-script/Code.gs` yang sudah
// dideploy sebagai Web App. Skema keamanannya: PIN admin -> token sesi
// (masa berlaku 2 jam). Token disimpan di memori proses ini saja; bila
// hilang (server restart) akan otomatis login ulang memakai PIN dari env.
//
// Variabel lingkungan yang WAJIB diset (lihat `.env.example`):
//   PENDUDUK_API_URL  -> URL Web App yang diakhiri `/exec`
//   PENDUDUK_PIN      -> PIN admin yang diatur lewat menu di Google Sheets
//
// JANGAN pernah mengirim PIN ini ke browser. Semua pemanggilan terjadi di
// sisi server; klien hanya bicara ke `/api/penduduk/*` milik Next.js.

// Modul ini hanya boleh diimpor dari kode sisi server (route handler /
// server component). Jangan pernah mengimpor dari komponen ber-'use client'.

import type {
  PendudukRecord,
  PendudukStats,
  PengurusRecord,
} from '@/types/penduduk';

export type { PendudukRecord, PendudukStats, PengurusRecord, ChartPoint } from '@/types/penduduk';

// Alias kompatibilitas: sisi server menyebut baris penduduk sebagai `PendudukRow`.
export type PendudukRow = PendudukRecord;
export type PengurusRow = PengurusRecord;

const API_URL = process.env.PENDUDUK_API_URL || '';
const ADMIN_PIN = process.env.PENDUDUK_PIN || '';

export const PENDUDUK_API_CONFIGURED = Boolean(API_URL && ADMIN_PIN);

type SheetsResponse = Record<string, unknown> & { ok?: boolean; error?: string };

// ----------------------------------------------------------------------------
// Token sesi (cache di memori proses)
// ----------------------------------------------------------------------------
let cachedToken: string | null = null;

function apiConfiguredError(): never {
  throw new Error(
    'Backend data penduduk belum dikonfigurasi. Isi PENDUDUK_API_URL dan PENDUDUK_PIN di .env.local.'
  );
}

async function callRaw(action: string, payload: Record<string, unknown>): Promise<SheetsResponse> {
  if (!PENDUDUK_API_CONFIGURED) apiConfiguredError();

  // Apps Script Web App hanya menerima POST "text/plain" sederhana
  // (menghindari preflight CORS). Body = JSON.
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, token: cachedToken || undefined, ...payload }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Backend data penduduk tidak merespons (HTTP ${res.status}).`);
  }

  const text = await res.text();
  try {
    return JSON.parse(text) as SheetsResponse;
  } catch {
    throw new Error('Jawaban backend data penduduk bukan JSON yang valid.');
  }
}

async function ensureToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await callRaw('adminLogin', { pin: ADMIN_PIN });
  if (!res.ok || typeof res.token !== 'string') {
    cachedToken = null;
    throw new Error(
      `Gagal masuk ke backend data penduduk (${String(res.error || 'unknown')}). Periksa PENDUDUK_PIN.`
    );
  }
  cachedToken = res.token;
  return cachedToken;
}

/**
 * Panggil sebuah action di Apps Script. Login otomatis bila token belum ada
 * atau sudah kedaluwarsa (server membalas `unauthorized`).
 */
export async function callSheets(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<SheetsResponse> {
  await ensureToken();

  let res = await callRaw(action, payload);

  if (!res.ok && res.error === 'unauthorized') {
    // Token kedaluwarsa -> login sekali lagi lalu ulangi.
    cachedToken = null;
    await ensureToken();
    res = await callRaw(action, payload);
  }

  return res;
}

// ----------------------------------------------------------------------------
// Aksi tingkat tinggi (memetakan ke action di Code.gs)
// ----------------------------------------------------------------------------

/** Ambil seluruh baris penduduk. */
export async function listPenduduk(): Promise<PendudukRow[]> {
  const res = await callSheets('adminList', {});
  if (!res.ok) throw new Error(String(res.error || 'Gagal memuat data penduduk.'));
  return (res.items as PendudukRow[]) || [];
}

/** Statistik agregat penduduk (dihitung di backend). */
export async function statsPenduduk(): Promise<PendudukStats> {
  const res = await callSheets('adminStats', {});
  if (!res.ok) throw new Error(String(res.error || 'Gagal memuat statistik penduduk.'));
  return {
    total: Number(res.total || 0),
    totalKK: Number(res.totalKK || 0),
    kkDariNoKK: Boolean(res.kkDariNoKK),
    butuhReview: Number(res.butuhReview || 0),
    belumAdaNama: Number(res.belumAdaNama || 0),
    perRT: (res.perRT as PendudukStats['perRT']) || [],
    perGender: (res.perGender as PendudukStats['perGender']) || [],
    perUsiaGroup: (res.perUsiaGroup as PendudukStats['perUsiaGroup']) || [],
    perPendidikan: (res.perPendidikan as PendudukStats['perPendidikan']) || [],
    perAgama: (res.perAgama as PendudukStats['perAgama']) || [],
    perKedudukan: (res.perKedudukan as PendudukStats['perKedudukan']) || [],
  };
}

/** Tambah satu baris penduduk. */
export async function addPenduduk(item: PendudukRow): Promise<void> {
  const res = await callSheets('adminAdd', { item });
  if (!res.ok) throw new Error(String(res.error || 'Gagal menambah data.'));
}

/** Ubah satu baris penduduk berdasarkan ID. */
export async function updatePenduduk(id: string, item: PendudukRow): Promise<void> {
  const res = await callSheets('adminUpdate', { id, item });
  if (!res.ok) throw new Error(String(res.error || 'Gagal mengubah data.'));
}

/** Hapus satu baris penduduk berdasarkan ID. */
export async function deletePenduduk(id: string): Promise<void> {
  const res = await callSheets('adminDelete', { id });
  if (!res.ok) throw new Error(String(res.error || 'Gagal menghapus data.'));
}

/** Ubah satu kolom untuk banyak baris sekaligus (RT/RW/Agama/... ). */
export async function bulkSetFieldPenduduk(
  ids: string[],
  field: string,
  value: string
): Promise<number> {
  const res = await callSheets('adminBulkSetField', { ids, field, value });
  if (!res.ok) throw new Error(String(res.error || 'Gagal mengubah data massal.'));
  return Number(res.jumlah || 0);
}

/** Impor massal. `replaceAll` menghapus seluruh data lama lebih dulu. */
export async function bulkAddPenduduk(
  items: PendudukRow[],
  replaceAll = false
): Promise<number> {
  const res = await callSheets('adminBulkAdd', { items, replaceAll });
  if (!res.ok) throw new Error(String(res.error || 'Gagal mengimpor data.'));
  return Number(res.jumlah || 0);
}

/** Hapus seluruh data penduduk (hati-hati: tidak bisa dibatalkan). */
export async function clearPenduduk(): Promise<void> {
  const res = await callSheets('adminBulkDeleteAll', {});
  if (!res.ok) throw new Error(String(res.error || 'Gagal menghapus seluruh data.'));
}

// ----------------------------------------------------------------------------
// Pengurus (RW/RT) — sheet `Pengurus`, shape 6 kolom
// ----------------------------------------------------------------------------
export async function listPengurus(): Promise<PengurusRow[]> {
  const res = await callSheets('pengurusList', {});
  if (!res.ok) throw new Error(String(res.error || 'Gagal memuat data pengurus.'));
  return (res.items as PengurusRow[]) || [];
}

export async function savePengurus(id: string | undefined, item: PengurusRow): Promise<string> {
  const res = await callSheets('pengurusSave', { id: id || '', item });
  if (!res.ok) throw new Error(String(res.error || 'Gagal menyimpan pengurus.'));
  return String(res.id || '');
}

export async function deletePengurus(id: string): Promise<void> {
  const res = await callSheets('pengurusDelete', { id });
  if (!res.ok) throw new Error(String(res.error || 'Gagal menghapus pengurus.'));
}

export async function bulkAddPengurus(items: PengurusRow[]): Promise<number> {
  const res = await callSheets('pengurusBulkAdd', { items });
  if (!res.ok) throw new Error(String(res.error || 'Gagal menambah pengurus massal.'));
  return Number(res.jumlah || 0);
}

// ----------------------------------------------------------------------------
// Tabel turunan generik (Pengurus MODEL B, Proyek, Kejadian, PendudukSementara,
// PerubahanPenduduk, Fasilitas). Skema ada di TABLE_DEFS pada Code.gs.
// ----------------------------------------------------------------------------

export const TABLE_NAMES = [
  'pengurus',
  'proyek',
  'kejadian',
  'pendudukSementara',
  'perubahanPenduduk',
  'fasilitas',
] as const;

export type TableName = (typeof TABLE_NAMES)[number];

function assertTable(table: string): TableName {
  if (!(TABLE_NAMES as readonly string[]).includes(table)) {
    throw new Error(`Tabel tidak dikenal: ${table}`);
  }
  return table as TableName;
}

export async function listTable<T = Record<string, unknown>>(table: string): Promise<T[]> {
  const res = await callSheets('tableList', { table: assertTable(table) });
  if (!res.ok) throw new Error(String(res.error || 'Gagal memuat data tabel.'));
  return (res.items as T[]) || [];
}

export async function infoTable(
  table: string
): Promise<{ sheet: string; headers: string[]; jumlah: number }> {
  const res = await callSheets('tableInfo', { table: assertTable(table) });
  if (!res.ok) throw new Error(String(res.error || 'Gagal membaca info tabel.'));
  return {
    sheet: String(res.sheet || ''),
    headers: (res.headers as string[]) || [],
    jumlah: Number(res.jumlah || 0),
  };
}

export async function saveTableRow(
  table: string,
  id: string | undefined,
  item: Record<string, unknown>
): Promise<string> {
  const res = await callSheets('tableSave', { table: assertTable(table), id: id || '', item });
  if (!res.ok) throw new Error(String(res.error || 'Gagal menyimpan data.'));
  return String(res.id || '');
}

export async function deleteTableRow(table: string, id: string): Promise<void> {
  const res = await callSheets('tableDelete', { table: assertTable(table), id });
  if (!res.ok) throw new Error(String(res.error || 'Gagal menghapus data.'));
}

export async function bulkAddTable(
  table: string,
  items: Record<string, unknown>[],
  replaceAll = false
): Promise<number> {
  const res = await callSheets('tableBulkAdd', {
    table: assertTable(table),
    items,
    replaceAll,
  });
  if (!res.ok) throw new Error(String(res.error || 'Gagal mengimpor data.'));
  return Number(res.jumlah || 0);
}

export async function clearTable(table: string): Promise<void> {
  const res = await callSheets('tableClear', { table: assertTable(table) });
  if (!res.ok) throw new Error(String(res.error || 'Gagal mengosongkan tabel.'));
}

// ----------------------------------------------------------------------------
// Laporan bulanan agregat (format Pemerintah Kota Bandung)
// ----------------------------------------------------------------------------

export type JenisLaporan = 'umur' | 'agama' | 'pendidikan' | 'pekerjaan' | 'rw';

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

export async function fetchReport(jenis: string, rw = ''): Promise<LaporanData> {
  const res = await callSheets('report', { jenis, rw });
  if (!res.ok) throw new Error(String(res.error || 'Gagal memuat laporan.'));
  return {
    jenis: String(res.jenis || jenis),
    rw: String(res.rw || 'SEMUA'),
    jumlahPenduduk: Number(res.jumlahPenduduk || 0),
    total: Number(res.total || 0),
    baris: (res.baris as LaporanBaris[]) || [],
    tidakDiketahui: Number(res.tidakDiketahui || 0),
    belumDiisi: Number(res.belumDiisi || 0),
  };
}
