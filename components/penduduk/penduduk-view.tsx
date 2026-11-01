'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  pendudukApi,
  PendudukRecord,
  PendudukStats,
} from '@/lib/penduduk-api';
import { PendudukFormModal } from '@/components/penduduk/penduduk-form-modal';
import { DataTable } from '@/components/data-table/data-table';
import { DetailModal } from '@/components/data-table/detail-modal';
import { DeleteModal } from '@/components/data-table/delete-modal';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { ModuleConfig, TableColumn, FormField } from '@/types/module';
import {
  Plus,
  Home,
  ChevronRight,
  Users,
  House,
  UserCheck,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Upload,
  Database,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// ============================================================================
// Data Penduduk — tabel warga lengkap, bersumber dari Google Sheets
// (via API internal Next.js `/api/penduduk`). Bukan data mock.
// ============================================================================

const PIE_COLORS = ['#1E3A8A', '#2563EB', '#0EA5E9', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

// Kolom tabel mengikuti HEADERS_PENDUDUK di Code.gs.
const COLUMNS: TableColumn[] = [
  { key: 'NIK', label: 'NIK' },
  { key: 'Nama', label: 'Nama Lengkap' },
  { key: 'JenisKelamin', label: 'L/P' },
  { key: 'RT', label: 'RT' },
  { key: 'RW', label: 'RW' },
  { key: 'Agama', label: 'Agama' },
  { key: 'KedudukanKeluarga', label: 'Kedudukan' },
  { key: 'Alamat', label: 'Alamat' },
];

interface PendudukViewProps {
  config: ModuleConfig;
  role: string;
  initialItems?: PendudukRecord[];
  initialStats?: PendudukStats | null;
  initialError?: string | null;
}

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  warn?: boolean;
}

function StatCard({ label, value, hint, icon, warn }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{label}</p>
          <p className={`mt-1.5 text-2xl font-bold ${warn ? 'text-[#B45309]' : 'text-[#0F172A]'}`}>
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-[#64748B]">{hint}</p>}
        </div>
        <div
          className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
            warn ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-[#EFF6FF] text-[#1E3A8A]'
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs">
      <h3 className="text-sm font-bold text-[#0F172A] mb-3">{title}</h3>
      <div className="h-56">{children}</div>
    </div>
  );
}

export function PendudukView({
  config,
  role,
  initialItems = [],
  initialStats = null,
  initialError = null,
}: PendudukViewProps) {
  const [items, setItems] = useState<PendudukRecord[]>(initialItems);
  const [stats, setStats] = useState<PendudukStats | null>(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(initialError);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PendudukRecord | null>(null);
  const [viewingItem, setViewingItem] = useState<PendudukRecord | null>(null);
  const [deletingItem, setDeletingItem] = useState<PendudukRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Penyegaran data dari server (dipakai tombol "Muat Ulang" dan setelah
  // tambah/ubah/hapus). Tidak dipanggil otomatis dari efek.
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rows, stat] = await Promise.all([pendudukApi.list(), pendudukApi.stats()]);
      setItems(rows);
      setStats(stat);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Gagal memuat data penduduk.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleView = (item: PendudukRecord) => setViewingItem(item);

  const handleEdit = (item: PendudukRecord) => {
    setEditingItem(item);
    setViewingItem(null);
    setIsFormOpen(true);
  };

  const handleSave = async (data: PendudukRecord) => {
    try {
      if (editingItem?.ID) {
        await pendudukApi.update(String(editingItem.ID), data);
        toast.success('Data Diperbarui', 'Perubahan tersimpan ke Google Sheets.');
      } else {
        await pendudukApi.add(data);
        toast.success('Data Ditambahkan', 'Data baru tersimpan ke Google Sheets.');
      }
      await load();
    } catch (err) {
      toast.error('Gagal Menyimpan', err instanceof Error ? err.message : undefined);
      throw err;
    }
  };

  const handleDeletePrompt = (item: PendudukRecord) => setDeletingItem(item);

  const handleConfirmDelete = async () => {
    if (!deletingItem?.ID) return;
    setIsDeleting(true);
    try {
      await pendudukApi.remove(String(deletingItem.ID));
      toast.success('Data Dihapus', 'Data telah dikeluarkan dari sistem.');
      setDeletingItem(null);
      await load();
    } catch (err) {
      toast.error('Gagal Menghapus', err instanceof Error ? err.message : undefined);
    } finally {
      setIsDeleting(false);
    }
  };

  const itemName = useMemo(
    () => deletingItem?.Nama || deletingItem?.NIK || undefined,
    [deletingItem]
  );

  // Kolom untuk modal detail (label panjang + urutan enak dibaca)
  const detailColumns = useMemo<TableColumn[]>(
    () => [
      { key: 'Nama', label: 'Nama Lengkap' },
      { key: 'NIK', label: 'NIK' },
      { key: 'NoKK', label: 'Nomor KK' },
      { key: 'NoUrtKeluarga', label: 'No. Urut Keluarga' },
      { key: 'NamaKepalaKeluarga', label: 'Nama Kepala Keluarga' },
      { key: 'TglKK', label: 'Tanggal KK' },
      { key: 'JenisKelamin', label: 'Jenis Kelamin' },
      { key: 'TempatLahir', label: 'Tempat Lahir' },
      { key: 'TanggalLahir', label: 'Tanggal Lahir' },
      { key: 'Agama', label: 'Agama' },
      { key: 'StatusPerkawinan', label: 'Status Perkawinan' },
      { key: 'KedudukanKeluarga', label: 'Kedudukan Keluarga' },
      { key: 'Pendidikan', label: 'Pendidikan' },
      { key: 'Pekerjaan', label: 'Pekerjaan' },
      { key: 'GolonganDarah', label: 'Golongan Darah' },
      { key: 'Kewarganegaraan', label: 'Kewarganegaraan' },
      { key: 'Suku', label: 'Suku' },
      { key: 'NamaAyah', label: 'Nama Ayah' },
      { key: 'NamaIbu', label: 'Nama Ibu' },
      { key: 'RT', label: 'RT' },
      { key: 'RW', label: 'RW' },
      { key: 'Alamat', label: 'Alamat' },
      { key: 'CatatanImpor', label: 'Catatan' },
    ],
    []
  );

  // Config untuk modal detail (DetailModal membaca `config.fields`)
  const detailConfig = useMemo<ModuleConfig>(
    () => ({
      ...config,
      columns: detailColumns,
      fields: detailColumns.map((col) => ({
        name: col.key,
        label: col.label,
        type: (col.type === 'date' ? 'date' : 'text') as FormField['type'],
      })),
    }),
    [config, detailColumns]
  );

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Link href={`/${role}/beranda`} className="hover:text-[#1E3A8A] flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#0F172A]">Data Penduduk</span>
      </nav>

      {/* 2. Judul + aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Database className="w-6 h-6 text-[#1E3A8A]" />
            Data Penduduk
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">{config.description}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={load}
            disabled={isLoading}
            className="justify-center bg-white"
            title="Muat ulang dari Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Muat Ulang</span>
          </Button>
          <Button
            variant="primary"
            onClick={handleAddNew}
            className="justify-center bg-[#1E3A8A] hover:bg-[#2563EB]"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tambah Data</span>
          </Button>
        </div>
      </div>

      {/* 3. Kondisi: error / loading / konten */}
      {loadError ? (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-5 sm:p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-[#B91C1C] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#B91C1C]">{loadError}</p>
          <p className="mt-1 text-xs text-[#B91C1C]/80">
            Pastikan <code className="font-mono">PENDUDUK_API_URL</code> dan{' '}
            <code className="font-mono">PENDUDUK_PIN</code> sudah diisi di{' '}
            <code className="font-mono">.env.local</code>, lalu jalankan ulang server.
          </p>
          <Button variant="outline" onClick={load} className="mt-4 mx-auto bg-white">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Coba Lagi
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#64748B]">
          <Loader2 className="w-7 h-7 animate-spin text-[#1E3A8A]" />
          <p className="mt-3 text-sm font-medium">Memuat data dari Google Sheets…</p>
        </div>
      ) : (
        <>
          {/* Kartu statistik */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Total Penduduk"
              value={(stats?.total ?? items.length).toLocaleString('id-ID')}
              hint="jiwa tercatat"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="Total KK"
              value={(stats?.totalKK ?? 0).toLocaleString('id-ID')}
              hint={stats?.kkDariNoKK ? 'dari kolom No. KK' : 'perkiraan dari data'}
              icon={<House className="w-5 h-5" />}
            />
            <StatCard
              label="Nama Belum Diisi"
              value={(stats?.belumAdaNama ?? 0).toLocaleString('id-ID')}
              hint="perlu dilengkapi"
              icon={<UserCheck className="w-5 h-5" />}
              warn={(stats?.belumAdaNama ?? 0) > 0}
            />
            <StatCard
              label="Perlu Review"
              value={(stats?.butuhReview ?? 0).toLocaleString('id-ID')}
              hint="ada catatan impor"
              icon={<AlertTriangle className="w-5 h-5" />}
              warn={(stats?.butuhReview ?? 0) > 0}
            />
          </div>

          {/* Grafik */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              <ChartCard title="Jumlah per RT">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.perRT} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={48} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="jumlah" name="Jiwa" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Komposisi Jenis Kelamin">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.perGender}
                      dataKey="jumlah"
                      nameKey="label"
                      innerRadius="50%"
                      outerRadius="80%"
                      paddingAngle={2}
                    >
                      {stats.perGender.map((entry, i) => (
                        <Cell key={entry.label} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Kelompok Usia">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.perUsiaGroup} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={48} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="jumlah" name="Jiwa" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {/* Tabel data */}
          <DataTable
            columns={COLUMNS}
            data={items}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeletePrompt}
            onAddNew={handleAddNew}
            exportFileName="data-penduduk-kelurahan-lebakgede"
          />

          {/* Petunjuk impor massal (fitur lanjutan) */}
          <div className="flex items-start gap-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
            <Upload className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5" />
            <div className="text-sm text-[#1E3A8A]">
              <p className="font-semibold">Impor data massal</p>
              <p className="mt-0.5 text-[#1E3A8A]/80">
                Untuk memasukkan ratusan baris sekaligus, gunakan menu{' '}
                <span className="font-semibold">Impor Data</span> pada dashboard penduduk, atau
                tempel langsung ke sheet <span className="font-mono">Penduduk</span> di Google
                Sheets — data akan langsung muncul di sini.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Modal Formulir */}
      <PendudukFormModal
        key={isFormOpen ? editingItem?.ID || 'baru' : 'tutup'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingItem}
        onSave={handleSave}
      />

      {/* Modal Detail */}
      <DetailModal
        isOpen={Boolean(viewingItem)}
        onClose={() => setViewingItem(null)}
        item={viewingItem}
        config={detailConfig}
        onEdit={handleEdit}
      />

      {/* Modal Konfirmasi Hapus */}
      <DeleteModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemName}
        isLoading={isDeleting}
      />
    </div>
  );
}
