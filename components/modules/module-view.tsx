'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleConfig } from '@/types/module';
import { useKelurahanStore } from '@/lib/store';
import { DataTable } from '@/components/data-table/data-table';
import { DetailModal } from '@/components/data-table/detail-modal';
import { DeleteModal } from '@/components/data-table/delete-modal';
import { ModuleFormModal } from '@/components/form/module-form-modal';
import { MonthCalendar } from '@/components/calendar/month-calendar';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { Plus, ChevronRight, Home, Table, Calendar, Send } from 'lucide-react';

interface ModuleViewProps {
  config: ModuleConfig;
  role: string;
}

export function ModuleView({ config, role }: ModuleViewProps) {
  const storeKey = `${role}_${config.slug}`;
  const {
    getItems,
    addItem,
    updateItem,
    deleteItem,
    submitForApproval,
  } = useKelurahanStore();

  const data = getItems(storeKey);

  // View mode for modules with calendar capability (e.g. Rencana Giat)
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, any> | null>(null);
  const [viewingItem, setViewingItem] = useState<Record<string, any> | null>(null);
  const [deletingItem, setDeletingItem] = useState<Record<string, any> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Actions
  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleView = (item: any) => {
    setViewingItem(item);
  };

  const handleDeletePrompt = (item: any) => {
    setDeletingItem(item);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    setTimeout(() => {
      deleteItem(storeKey, deletingItem.id);
      toast.success('Data Berhasil Dihapus', 'Data telah dikeluarkan dari sistem.');
      setIsDeleting(false);
      setDeletingItem(null);
    }, 300);
  };

  const handleSaveForm = (formData: Record<string, any>) => {
    if (editingItem && editingItem.id) {
      updateItem(storeKey, editingItem.id, formData);
      toast.success('Data Berhasil Diperbarui', 'Perubahan telah disimpan ke sistem.');
    } else {
      addItem(storeKey, formData);
      toast.success('Data Berhasil Disimpan', 'Data baru telah berhasil ditambahkan.');
    }
  };

  const handleSubmitForApproval = (item: any) => {
    submitForApproval(storeKey, item.id);
    toast.success('Pengajuan Terkirim', 'Rencana telah diajukan ke Lurah untuk mendapatkan persetujuan.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb Navigasi */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Link href={`/${role}/beranda`} className="hover:text-[#1E3A8A] flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-medium text-[#475569]">{config.group}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-[#0F172A]">{config.name}</span>
      </nav>

      {/* 2. Header Halaman + 1 Tombol Utama di Kanan Sesuai Aturan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] leading-tight">
            {config.name}
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            {config.description}
          </p>
        </div>

        {/* Hanya SATU tombol utama berwarna solid di kanan */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {config.hasCalendarView && (
            <div className="flex items-center rounded-lg border border-[#CBD5E1] bg-white p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Tabel</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Kalender</span>
              </button>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleAddNew}
            className="flex-1 sm:flex-initial justify-center bg-[#1E3A8A] hover:bg-[#2563EB] shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tambah Data</span>
          </Button>
        </div>
      </div>

      {/* 3. Konten Utama: Tabel atau Kalender */}
      {viewMode === 'table' ? (
        <DataTable
          columns={config.columns}
          data={data}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeletePrompt}
          onAddNew={handleAddNew}
          exportFileName={config.slug}
        />
      ) : (
        <MonthCalendar
          events={data}
          onSelectEvent={handleView}
        />
      )}

      {/* Modal Formulir Tambah / Ubah */}
      <ModuleFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        config={config}
        initialData={editingItem}
        onSave={handleSaveForm}
      />

      {/* Modal Detail Item */}
      <DetailModal
        isOpen={Boolean(viewingItem)}
        onClose={() => setViewingItem(null)}
        item={viewingItem}
        config={config}
        onEdit={handleEdit}
        onSubmitForApproval={handleSubmitForApproval}
      />

      {/* Modal Konfirmasi Hapus */}
      <DeleteModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        itemName={deletingItem?.nama || deletingItem?.namaProgram || deletingItem?.namaKegiatan || deletingItem?.nomorSurat || deletingItem?.kodeBarang || deletingItem?.usulan}
        isLoading={isDeleting}
      />
    </div>
  );
}
