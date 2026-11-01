'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { tabelApi } from '@/lib/penduduk-api';
import { DataTable } from '@/components/data-table/data-table';
import { DetailModal } from '@/components/data-table/detail-modal';
import { DeleteModal } from '@/components/data-table/delete-modal';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { ModuleConfig, TableColumn, FormField } from '@/types/module';
import {
  Home,
  ChevronRight,
  Plus,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Database,
  Search,
  Eye,
  Pencil,
  Trash2,
  Users,
  ChevronDown,
  Layers,
} from 'lucide-react';

// ============================================================================
// TabelView — tabel CRUD generik yang sumbernya Google Sheets.
// Dipakai modul: Pengurus RW & RT (MODEL B), Proyek (MODEL C), Kejadian
// (MODEL D), Penduduk Sementara, Perubahan Penduduk, Fasilitas.
//
// Bila `groupBy` diisi (mis. 'Wilayah'), data ditampilkan sebagai beberapa
// tabel terpisah per kelompok — satu kartu per RW, berisi anggotanya.
// ============================================================================

export interface TabelViewProps {
  /** Nama tabel di backend (TABLE_DEFS Code.gs), mis. 'pengurus'. */
  table: string;
  config: ModuleConfig;
  role: string;
  initialItems?: Record<string, unknown>[];
  initialError?: string | null;
  /** Sembunyikan kolom dari tabel & form. */
  hidden?: string[];
  /** Nama kolom untuk pengelompokan (mis. 'Wilayah'). Kosong = tabel biasa. */
  groupBy?: string;
  /** Label kartu kelompok (mis. 'RW'). */
  groupLabel?: string;
  /** Urutan kelompok yang diinginkan (mis. RW_OPTIONS). */
  groupOptions?: { label: string; value: string }[];
}

function buildFields(config: ModuleConfig, hidden: string[]): FormField[] {
  return config.fields.filter((f) => !hidden.includes(f.name));
}

// Pengurus tingkat RW: jabatannya menyebut "warga" tetapi bukan "tetangga".
function isRwLevel(row: Record<string, unknown>): boolean {
  const j = String(row.Jabatan ?? '').toLowerCase();
  return j.includes('warga') && !j.includes('tetangga');
}

// Nomor RT diambil dari jabatan, mis. "Ketua Rukun Tetangga 03" / "Ketua RT 3" -> "RT 03".
function rtNumberOf(row: Record<string, unknown>): string {
  const j = String(row.Jabatan ?? '');
  const m = j.match(/tetangga\s*(\d+)/i) ?? j.match(/\brt\s*(\d+)/i);
  if (!m) return '';
  return `RT ${String(Number(m[1])).padStart(2, '0')}`;
}

// "16" -> "RW 16", "RW 16" -> "RW 16", "RW16" -> "RW 16".
function formatGroupLabel(raw: string, groupLabel: string): string {
  const s = raw.trim();
  if (!s) return `${groupLabel} (belum diisi)`;
  if (/^\d+$/.test(s)) return `${groupLabel} ${String(Number(s)).padStart(2, '0')}`;
  const m = s.match(/^([A-Za-z]+)\s*(\d+)$/);
  if (m && m[1].toLowerCase() === groupLabel.toLowerCase()) {
    return `${groupLabel} ${String(Number(m[2])).padStart(2, '0')}`;
  }
  if (s.toLowerCase().startsWith(groupLabel.toLowerCase())) return s;
  return `${groupLabel} ${s}`;
}

export function TabelView({
  table,
  config,
  role,
  initialItems = [],
  initialError = null,
  hidden = [],
  groupBy,
  groupLabel = 'Kelompok',
  groupOptions,
}: TabelViewProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(initialError);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  // Tingkat 1: kartu RW (default terbuka). Tingkat 2: kartu RT (default tertutup).
  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({});
  const [openRts, setOpenRts] = useState<Record<string, boolean>>({});

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [viewingItem, setViewingItem] = useState<Record<string, unknown> | null>(null);
  const [deletingItem, setDeletingItem] = useState<Record<string, unknown> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fields = useMemo(() => buildFields(config, hidden), [config, hidden]);

  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await tabelApi.list(table);
      setItems(rows);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Gagal memuat data.');
    } finally {
      setIsLoading(false);
    }
  }, [table]);

  const openAdd = () => {
    const seed: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) seed[f.name] = String(f.defaultValue);
    });
    // Saat sedang memfilter satu RW, anggota baru otomatis masuk RW itu.
    if (groupBy && groupFilter) seed[groupBy] = groupFilter;
    setFormValues(seed);
    setEditingItem(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    const seed: Record<string, string> = {};
    fields.forEach((f) => {
      seed[f.name] = String(item[f.name] ?? '');
    });
    setFormValues(seed);
    setEditingItem(item);
    setViewingItem(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing = fields.find((f) => f.required && !String(formValues[f.name] ?? '').trim());
    if (missing) {
      setFormError(`${missing.label} wajib diisi.`);
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      const payload: Record<string, unknown> = {};
      Object.entries(formValues).forEach(([k, v]) => {
        const t = String(v ?? '').trim();
        if (t !== '') payload[k] = t;
      });
      const id = editingItem?.ID ? String(editingItem.ID) : undefined;
      await tabelApi.save(table, id, payload);
      toast.success(
        id ? 'Data Diperbarui' : 'Data Disimpan',
        'Perubahan tersimpan ke Google Sheets.'
      );
      setIsFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem?.ID) return;
    setIsDeleting(true);
    try {
      await tabelApi.remove(table, String(deletingItem.ID));
      toast.success('Data Dihapus', 'Data telah dikeluarkan dari sistem.');
      setDeletingItem(null);
      await reload();
    } catch (err) {
      toast.error('Gagal Menghapus', err instanceof Error ? err.message : undefined);
    } finally {
      setIsDeleting(false);
    }
  };

  const detailConfig = useMemo<ModuleConfig>(
    () => ({
      ...config,
      fields: fields.map((f) => ({ ...f, required: false })),
    }),
    [config, fields]
  );

  const deletingName = String(
    deletingItem?.Nama ??
      deletingItem?.NamaProyek ??
      deletingItem?.NamaFasilitas ??
      deletingItem?.JenisKejadian ??
      deletingItem?.ID ??
      ''
  );

  // --- Pengelompokan (mis. per RW) -------------------------------------------
  const filtered = useMemo(() => {
    let rows = items;
    if (groupBy && groupFilter) {
      rows = rows.filter((r) => String(r[groupBy] ?? '').trim() === groupFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) =>
        Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(q))
      );
    }
    return rows;
  }, [items, groupBy, groupFilter, search]);

  const groups = useMemo<[string, Record<string, unknown>[]][]>(() => {
    if (!groupBy) return [];
    const map = new Map<string, Record<string, unknown>[]>();
    filtered.forEach((row) => {
      const key = String(row[groupBy] ?? '').trim() || '(belum diisi)';
      const list = map.get(key);
      if (list) list.push(row);
      else map.set(key, [row]);
    });

    const order = groupOptions?.map((o) => o.value) ?? [];
    return Array.from(map.entries()).sort((a, b) => {
      // Kelompok "belum diisi" selalu paling bawah.
      const aEmpty = a[0].startsWith('(');
      const bEmpty = b[0].startsWith('(');
      if (aEmpty !== bEmpty) return aEmpty ? 1 : -1;

      const ia = order.indexOf(a[0]);
      const ib = order.indexOf(b[0]);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a[0].localeCompare(b[0], 'id', { numeric: true });
    });
  }, [filtered, groupBy, groupOptions]);

  // Daftar pilihan filter: gabungan opsi baku + nilai yang benar-benar ada.
  const groupChoices = useMemo(() => {
    if (!groupBy) return [];
    const found = new Set(items.map((r) => String(r[groupBy] ?? '').trim()).filter(Boolean));
    const base = (groupOptions ?? []).map((o) => o.value);
    const extras = Array.from(found).filter((v) => !base.includes(v));
    return [...base, ...extras.sort((a, b) => a.localeCompare(b, 'id', { numeric: true }))];
  }, [items, groupBy, groupOptions]);

  const groupColumns = useMemo(
    () => (config.columns as TableColumn[]).filter((c) => c.key !== groupBy),
    [config.columns, groupBy]
  );

  const openAddInGroup = (groupName: string) => {
    const seed: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) seed[f.name] = String(f.defaultValue);
    });
    if (groupBy && groupName !== '(belum diisi)') seed[groupBy] = groupName;
    setFormValues(seed);
    setEditingItem(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  // Tambah anggota RT tertentu: RW + jabatan RT otomatis terisi.
  const openAddInRt = (groupName: string, rtName: string) => {
    const seed: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) seed[f.name] = String(f.defaultValue);
    });
    if (groupBy && groupName !== '(belum diisi)') seed[groupBy] = groupName;
    if (rtName.startsWith('RT ')) seed.Jabatan = `Ketua Rukun Tetangga ${rtName.slice(3)}`;
    setFormValues(seed);
    setEditingItem(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  // Tabel anggota (dipakai untuk tingkat RW maupun RT).
  const renderMemberTable = (rows: Record<string, unknown>[]) => (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F8FAFC] text-[#475569]">
            <th className="px-3 sm:px-4 py-2 text-left text-[11px] font-bold uppercase tracking-wide border-b border-[#E2E8F0]">No</th>
            {groupColumns.map((col) => (
              <th
                key={col.key}
                className="px-3 sm:px-4 py-2 text-left text-[11px] font-bold uppercase tracking-wide border-b border-[#E2E8F0] whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
            <th className="px-3 sm:px-4 py-2 text-right text-[11px] font-bold uppercase tracking-wide border-b border-[#E2E8F0]">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={String(row.ID ?? idx)} className="hover:bg-[#F8FAFC]">
              <td className="px-3 sm:px-4 py-2 text-[#64748B] border-b border-[#F1F5F9]">{idx + 1}</td>
              {groupColumns.map((col) => (
                <td
                  key={col.key}
                  className={`px-3 sm:px-4 py-2 border-b border-[#F1F5F9] ${
                    col.key === 'Nama' ? 'font-semibold text-[#0F172A]' : 'text-[#475569]'
                  }`}
                >
                  {cellValue(row, col)}
                </td>
              ))}
              <td className="px-3 sm:px-4 py-2 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => setViewingItem(row)}
                    title="Lihat detail"
                    className="p-1.5 rounded-md text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E3A8A] min-h-[32px] min-w-[32px] flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    title="Ubah"
                    className="p-1.5 rounded-md text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E3A8A] min-h-[32px] min-w-[32px] flex items-center justify-center"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(row)}
                    title="Hapus"
                    className="p-1.5 rounded-md text-[#B91C1C] hover:bg-[#FEF2F2] min-h-[32px] min-w-[32px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const cellValue = (row: Record<string, unknown>, col: TableColumn) => {
    const raw = row[col.key];
    const text = String(raw ?? '').trim();
    if (!text) return '—';
    if (col.key === 'JenisKelamin') {
      if (text === 'Laki-laki') return 'L';
      if (text === 'Perempuan') return 'P';
    }
    return text;
  };

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Link href={`/${role}/beranda`} className="hover:text-[#1E3A8A] flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#0F172A]">{config.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Database className="w-6 h-6 text-[#1E3A8A]" />
            {config.name}
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">{config.description}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" onClick={reload} disabled={isLoading} className="justify-center bg-white">
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Muat Ulang</span>
          </Button>
          <Button variant="primary" onClick={openAdd} className="justify-center bg-[#1E3A8A] hover:bg-[#2563EB]">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tambah Data</span>
          </Button>
        </div>
      </div>

      {loadError ? (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-5 text-center">
          <AlertTriangle className="w-8 h-8 text-[#B91C1C] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#B91C1C]">{loadError}</p>
          <Button variant="outline" onClick={reload} className="mt-4 mx-auto bg-white">
            <RefreshCw className="w-4 h-4 mr-1.5" /> Coba Lagi
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#64748B]">
          <Loader2 className="w-7 h-7 animate-spin text-[#1E3A8A]" />
          <p className="mt-3 text-sm font-medium">Memuat data dari Google Sheets…</p>
        </div>
      ) : groupBy ? (
        <>
          {/* Pencarian + filter kelompok */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, jabatan, atau alamat…"
                className="w-full min-h-[44px] pl-9 pr-3 rounded-lg border border-[#CBD5E1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="sm:w-56 min-h-[44px] px-3 rounded-lg border border-[#CBD5E1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="">Semua {groupLabel}</option>
              {groupChoices.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {groups.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl py-14 text-center">
              <Users className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#475569]">Belum ada data yang cocok.</p>
              <Button variant="outline" onClick={openAdd} className="mt-4 mx-auto bg-white">
                <Plus className="w-4 h-4 mr-1.5" /> Tambah Data
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {groups.map(([groupName, groupRows]) => {
                const rwRows = groupRows.filter(isRwLevel);
                const rtMap = new Map<string, Record<string, unknown>[]>();
                groupRows.filter((r) => !isRwLevel(r)).forEach((r) => {
                  const key = rtNumberOf(r) || '(RT belum diisi)';
                  const list = rtMap.get(key);
                  if (list) list.push(r);
                  else rtMap.set(key, [r]);
                });
                const rtEntries = Array.from(rtMap.entries()).sort((a, b) =>
                  a[0].localeCompare(b[0], 'id', { numeric: true })
                );

                const rwOpen = !closedGroups[groupName];
                const label = formatGroupLabel(groupName, groupLabel);

                return (
                  <section
                    key={groupName}
                    className="bg-white border-2 border-[#CBD5E1] rounded-xl overflow-hidden"
                  >
                    {/* ── Tingkat 1: RW ─────────────────────────────── */}
                    <button
                      type="button"
                      onClick={() =>
                        setClosedGroups((prev) => ({ ...prev, [groupName]: rwOpen }))
                      }
                      aria-expanded={rwOpen}
                      className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-left transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-10 h-10 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-base font-bold text-[#0F172A] leading-tight truncate">
                            {label}
                          </h2>
                          <p className="text-xs text-[#64748B]">
                            {rwRows.length} pengurus RW · {rtEntries.length} RT · {groupRows.length} orang
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[#64748B] flex-shrink-0 transition-transform duration-200 ${
                          rwOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {rwOpen && (
                      <div className="p-4 sm:p-5 space-y-5">
                        {/* A. Pengurus tingkat RW */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-[#0F172A]">
                              Pengurus {label}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openAddInGroup(groupName)}
                              className="justify-center"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              Anggota RW
                            </Button>
                          </div>
                          {rwRows.length ? (
                            renderMemberTable(rwRows)
                          ) : (
                            <p className="text-xs text-[#64748B] py-3 text-center border border-dashed border-[#E2E8F0] rounded-lg">
                              Belum ada pengurus tingkat RW.
                            </p>
                          )}
                        </div>

                        {/* B. Tingkat 2: RT di dalam RW */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Layers className="w-4 h-4 text-[#1E3A8A]" />
                            <h3 className="text-sm font-bold text-[#0F172A]">
                              Rukun Tetangga di {label}
                            </h3>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#475569]">
                              {rtEntries.length}
                            </span>
                          </div>

                          {rtEntries.length === 0 ? (
                            <p className="text-xs text-[#64748B] py-3 text-center border border-dashed border-[#E2E8F0] rounded-lg">
                              Belum ada data RT pada {label}.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {rtEntries.map(([rtName, rtRows]) => {
                                const rtKey = `${groupName}|${rtName}`;
                                const rtOpen = Boolean(openRts[rtKey]);
                                return (
                                  <div
                                    key={rtKey}
                                    className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-[#FCFDFE]"
                                  >
                                    {/* Header RT — klik untuk buka isinya */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenRts((prev) => ({ ...prev, [rtKey]: !rtOpen }))
                                      }
                                      aria-expanded={rtOpen}
                                      className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#F1F5F9] text-left transition-colors"
                                    >
                                      <span className="flex items-center gap-2 min-w-0">
                                        <span className="w-7 h-7 rounded-md bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                                          {rtName.replace(/[^0-9]/g, '').slice(-2) || 'RT'}
                                        </span>
                                        <span className="text-sm font-semibold text-[#0F172A] truncate">
                                          {rtName}
                                        </span>
                                        <span className="text-xs text-[#64748B]">
                                          {rtRows.length} orang
                                        </span>
                                      </span>
                                      <span className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="text-[11px] font-semibold text-[#1E3A8A] hidden sm:inline">
                                          {rtOpen ? 'Tutup' : 'Lihat isi'}
                                        </span>
                                        <ChevronDown
                                          className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                                            rtOpen ? 'rotate-180' : ''
                                          }`}
                                        />
                                      </span>
                                    </button>

                                    {rtOpen && (
                                      <div className="border-t border-[#E2E8F0] bg-white">
                                        <div className="flex justify-end px-3 pt-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openAddInRt(groupName, rtName)}
                                            className="justify-center"
                                          >
                                            <Plus className="w-3.5 h-3.5 mr-1" />
                                            Anggota {rtName}
                                          </Button>
                                        </div>
                                        {renderMemberTable(rtRows)}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <DataTable
          columns={config.columns as TableColumn[]}
          data={items}
          onView={setViewingItem}
          onEdit={openEdit}
          onDelete={setDeletingItem}
          onAddNew={openAdd}
          exportFileName={config.slug}
        />
      )}

      {/* Formulir tambah/ubah */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? `Ubah: ${config.name}` : `Tambah: ${config.name}`}
        description="Perubahan langsung tersimpan ke Google Sheets."
        maxWidth="lg"
      >
        <form onSubmit={submitForm} className="flex flex-col min-h-0">
          <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 overflow-y-auto">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  {field.label}
                  {field.required && <span className="text-[#DC2626]"> *</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formValues[field.name] ?? ''}
                    onChange={(e) => setFormValues((p) => ({ ...p, [field.name]: e.target.value }))}
                    className="w-full min-h-[44px] px-3 rounded-lg border border-[#CBD5E1] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  >
                    <option value="">— Pilih —</option>
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    rows={2}
                    value={formValues[field.name] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => setFormValues((p) => ({ ...p, [field.name]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                ) : (
                  <input
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={formValues[field.name] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => setFormValues((p) => ({ ...p, [field.name]: e.target.value }))}
                    className="w-full min-h-[44px] px-3 rounded-lg border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                )}
                {field.helperText && (
                  <p className="mt-1 text-xs text-[#64748B]">{field.helperText}</p>
                )}
              </div>
            ))}
          </div>

          {formError && (
            <p className="px-4 sm:px-6 pb-2 text-sm font-medium text-[#DC2626]">{formError}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)} disabled={isSaving} className="w-full sm:w-auto justify-center">
              Batal
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving} className="w-full sm:w-auto justify-center bg-[#1E3A8A] hover:bg-[#2563EB]">
              {editingItem ? 'Simpan Perubahan' : 'Simpan Data'}
            </Button>
          </div>
        </form>
      </Dialog>

      <DetailModal
        isOpen={Boolean(viewingItem)}
        onClose={() => setViewingItem(null)}
        item={viewingItem}
        config={detailConfig}
        onEdit={openEdit}
      />

      <DeleteModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        itemName={deletingName || undefined}
        isLoading={isDeleting}
      />
    </div>
  );
}
