'use client';

import React, { useState, useMemo } from 'react';
import { TableColumn } from '@/types/module';
import { StatusBadge } from '@/components/ui/badge';
import { formatRupiah, formatIndonesianDate } from '@/lib/utils';
import { Search, Download, Eye, Edit3, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Filter, Inbox, Plus } from 'lucide-react';
import { toast } from '@/lib/toast';

interface DataTableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  onView: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onAddNew?: () => void;
  exportFileName?: string;
}

export function DataTable({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  onAddNew,
  exportFileName = 'data-kelurahan-lebakgede',
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Extract unique statuses for filter dropdown if status column exists
  const hasStatusColumn = columns.some((c) => c.key === 'status' || c.key === 'statusDisposisi' || c.key === 'statusGizi');
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.status) set.add(item.status);
      if (item.statusDisposisi) set.add(item.statusDisposisi);
      if (item.statusGizi) set.add(item.statusGizi);
    });
    return Array.from(set);
  }, [data]);

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (statusFilter !== 'ALL') {
        const itemStatus = item.status || item.statusDisposisi || item.statusGizi;
        if (itemStatus !== statusFilter) return false;
      }

      // Search query across all values
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = Object.values(item).some((val) =>
          String(val).toLowerCase().includes(q)
        );
        if (!matches) return false;
      }

      return true;
    });
  }, [data, searchQuery, statusFilter]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Export to CSV (Excel compatible)
  const handleExportCSV = () => {
    if (sortedData.length === 0) {
      toast.warning('Tidak ada data untuk diunduh');
      return;
    }

    const headers = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`);
    const rows = sortedData.map((item) =>
      columns.map((col) => {
        let val = item[col.key];
        if (val === undefined || val === null) val = '';
        if (col.type === 'currency' && typeof val === 'number') {
          val = formatRupiah(val);
        } else if (col.type === 'date' && val) {
          val = formatIndonesianDate(val);
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${exportFileName}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Unduh Excel Berhasil', 'File laporan CSV berhasil disimpan.');
  };

  // Render cell content based on column type
  const renderCellContent = (item: Record<string, any>, col: TableColumn) => {
    const rawValue = item[col.key];

    if (col.type === 'badge') {
      return <StatusBadge status={rawValue} />;
    }

    if (col.type === 'currency' && typeof rawValue === 'number') {
      return <span className="font-semibold text-[#0F172A]">{formatRupiah(rawValue)}</span>;
    }

    if (col.type === 'date' && rawValue) {
      return <span className="text-[#475569]">{formatIndonesianDate(rawValue)}</span>;
    }

    if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
      return <span className="text-[#94A3B8]">-</span>;
    }

    return <span className="text-[#0F172A]">{String(rawValue)}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Bar Pencarian, Filter & Unduh Excel */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Input Pencarian */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari data di tabel ini..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] min-h-[38px]"
          />
        </div>

        {/* Filter Dropdown & Tombol Unduh Excel */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {hasStatusColumn && statusOptions.length > 0 && (
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-xs sm:text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] min-h-[38px]"
              >
                <option value="ALL">Semua Status</option>
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-[#1E3A8A] transition-colors min-h-[38px] shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Excel</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN MOBILE: KARTU RESPONSIF (HP / LAYAR KECIL)     */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-3">
        {paginatedData.length > 0 ? (
          paginatedData.map((item, rowIndex) => {
            const firstCol = columns[0];
            const otherCols = columns.slice(1);
            const statusCol = columns.find((c) => c.key === 'status' || c.key === 'statusDisposisi' || c.key === 'statusGizi');

            return (
              <div
                key={item.id || rowIndex}
                className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-3"
              >
                {/* Header Kartu: Kolom Utama & Status Badge */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#F1F5F9]">
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider block">
                      {firstCol?.label}
                    </span>
                    <p className="font-bold text-[#0F172A] text-base leading-snug break-words mt-0.5">
                      {item[firstCol?.key] || '-'}
                    </p>
                  </div>
                  {statusCol && item[statusCol.key] && (
                    <div className="flex-shrink-0">
                      <StatusBadge status={item[statusCol.key]} />
                    </div>
                  )}
                </div>

                {/* Kolom Informasi Tambahan */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {otherCols
                    .filter((c) => c.key !== 'status' && c.key !== 'statusDisposisi' && c.key !== 'statusGizi')
                    .slice(0, 4)
                    .map((col) => (
                      <div key={col.key} className="bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9]">
                        <span className="text-[#64748B] block font-medium truncate">
                          {col.label}
                        </span>
                        <div className="font-semibold text-[#0F172A] mt-0.5 truncate">
                          {renderCellContent(item, col)}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Tombol Aksi HP (3 Tombol Penuh & Rapi) */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F1F5F9]">
                  <button
                    onClick={() => onView(item)}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#1E3A8A] hover:bg-[#EFF6FF] transition-colors min-h-[34px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat</span>
                  </button>

                  <button
                    onClick={() => onEdit(item)}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors min-h-[34px]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Ubah</span>
                  </button>

                  <button
                    onClick={() => onDelete(item)}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-[#FECACA] bg-[#FEE2E2]/60 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors min-h-[34px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-[#0F172A]">Belum ada data</p>
            <p className="text-xs text-[#475569] mt-1 mb-4">
              Data masih kosong atau tidak cocok dengan pencarian Anda.
            </p>
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold min-h-[38px] shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Data</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN DESKTOP/TABLET: TABEL KLASIK                    */}
      {/* ======================================================== */}
      <div className="hidden md:block bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-x-auto table-scrollbar">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-3.5 py-3.5 font-bold text-[#0F172A] select-none text-xs sm:text-sm whitespace-nowrap"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1.5 hover:text-[#1E3A8A] focus:outline-none"
                    >
                      <span>{col.label}</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              ))}
              <th
                scope="col"
                className="sticky right-0 z-20 bg-[#F8FAFC] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] border-l border-[#E2E8F0] px-4 py-3.5 font-bold text-[#0F172A] text-right text-xs sm:text-sm whitespace-nowrap w-[200px]"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => {
                return (
                  <tr
                    key={item.id || rowIndex}
                    className="group bg-white hover:bg-[#F8FAFC] transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-3.5 py-3 align-middle text-xs sm:text-sm ${
                          col.type === 'badge' || col.type === 'date' || col.type === 'currency'
                            ? 'whitespace-nowrap'
                            : 'max-w-[240px]'
                        }`}
                      >
                        <div
                          className={col.type === 'badge' ? '' : 'truncate'}
                          title={String(item[col.key] ?? '')}
                        >
                          {renderCellContent(item, col)}
                        </div>
                      </td>
                    ))}

                    {/* Tombol Aksi - Sticky di kanan, selalu terlihat dan tidak pernah terpotong */}
                    <td className="sticky right-0 z-10 bg-white group-hover:bg-[#F8FAFC] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] border-l border-[#E2E8F0] px-4 py-3 text-right align-middle whitespace-nowrap w-[200px]">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => onView(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#CBD5E1] bg-white text-xs font-semibold text-[#1E3A8A] hover:bg-[#EFF6FF] hover:border-[#1E3A8A] transition-colors min-h-[30px]"
                          title="Lihat rincian lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>

                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#CBD5E1] bg-white text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors min-h-[30px]"
                          title="Ubah data"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Ubah</span>
                        </button>

                        <button
                          onClick={() => onDelete(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#FECACA] bg-[#FEE2E2]/60 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors min-h-[30px]"
                          title="Hapus data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* Empty State Ramah */
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] mb-3">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <p className="text-base font-bold text-[#0F172A]">
                      Belum ada data
                    </p>
                    <p className="text-sm text-[#475569] mt-1 mb-4 leading-relaxed">
                      Data masih kosong atau tidak cocok dengan filter pencarian Anda.
                    </p>
                    {onAddNew && (
                      <button
                        onClick={onAddNew}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold transition-colors min-h-[38px] shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Data</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination (Responsif di HP & Desktop) */}
      {sortedData.length > 0 && (
        <div className="px-4 py-3 bg-white md:bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#475569]">
          <div className="text-center sm:text-left">
            Menampilkan{' '}
            <strong className="text-[#0F172A]">
              {Math.min(1 + (currentPage - 1) * pageSize, totalItems)}
            </strong>{' '}
            -{' '}
            <strong className="text-[#0F172A]">
              {Math.min(currentPage * pageSize, totalItems)}
            </strong>{' '}
            dari <strong className="text-[#0F172A]">{totalItems}</strong> data
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed min-h-[38px] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-bold text-[#0F172A] px-2 whitespace-nowrap">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed min-h-[38px] transition-colors"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
