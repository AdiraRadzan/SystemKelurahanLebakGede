import React from 'react';
import { CheckCircle2, Clock, XCircle, FileEdit, HelpCircle } from 'lucide-react';

export type StatusType = 'disetujui' | 'selesai' | 'diajukan' | 'menunggu' | 'ditolak' | 'draft' | string;

interface BadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = '' }: BadgeProps) {
  const normalized = (status || '').toLowerCase().trim();

  if (normalized === 'disetujui' || normalized === 'selesai' || normalized === 'aktif' || normalized === 'sesuai') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{label || (normalized === 'aktif' ? 'Aktif' : normalized === 'selesai' ? 'Selesai' : 'Disetujui')}</span>
      </span>
    );
  }

  if (normalized === 'diajukan' || normalized === 'menunggu' || normalized === 'proses' || normalized === 'dalam proses') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] ${className}`}>
        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{label || (normalized === 'diajukan' ? 'Diajukan' : 'Menunggu')}</span>
      </span>
    );
  }

  if (normalized === 'ditolak' || normalized === 'tidak aktif' || normalized === 'rusak berat' || normalized === 'stunting') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] ${className}`}>
        <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{label || (normalized === 'ditolak' ? 'Ditolak' : normalized === 'tidak aktif' ? 'Tidak Aktif' : label || 'Ditolak')}</span>
      </span>
    );
  }

  if (normalized === 'draft' || normalized === 'konsep') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] ${className}`}>
        <FileEdit className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{label || 'Draft'}</span>
      </span>
    );
  }

  // Fallback
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] ${className}`}>
      <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{label || status}</span>
    </span>
  );
}
