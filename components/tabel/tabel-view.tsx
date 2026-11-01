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
import { Home, ChevronRight, Plus, Loader2, RefreshCw, AlertTriangle, Database } from 'lucide-react';

// ============================================================================
// TabelView — tabel CRUD generik yang sumbernya Google Sheets.
// Dipakai modul: Pengurus RW/RT (MODEL B), Proyek (MODEL C), Kejadian (MODEL D),
// Penduduk Sementara, Perubahan Penduduk, Fasilitas.
// ============================================================================

export interface TabelViewProps {
  /** Nama tabel di backend (TABLE_DEFS Code.gs), mis. 'pengurus'. */
  table: string;
  config: ModuleConfig;
  role: string;
  initialItems?: Record<string, unknown>[];
  initialError?: string | null;
  /** Sembunyikan kolom ID dari tabel & form. */
  hidden?: string[];
}

function buildFields(config: ModuleConfig, hidden: string[]): FormField[] {
  return config.fields.filter((f) => !hidden.includes(f.name));
}

export function TabelView({
  table,
  config,
  role,
  initialItems = [],
  initialError = null,
  hidden = [],
}: TabelViewProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(initialError);

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
