'use client';

import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { ModuleConfig } from '@/types/module';
import { formatRupiah, formatIndonesianDate } from '@/lib/utils';
import { Send, FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Record<string, any> | null;
  config: ModuleConfig;
  onEdit?: (item: any) => void;
  onSubmitForApproval?: (item: any) => void;
}

export function DetailModal({
  isOpen,
  onClose,
  item,
  config,
  onEdit,
  onSubmitForApproval,
}: DetailModalProps) {
  if (!item) return null;

  const isApproval = config.isApprovalFlow;
  const canSubmitToLurah =
    isApproval && (item.status === 'Draft' || item.status === 'Ditolak');

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail: ${config.name}`}
      description="Rincian informasi lengkap data terpilih"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Status Header for Approval or General Status */}
        {item.status && (
          <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Status Saat Ini:</span>
              <StatusBadge status={item.status} />
            </div>
            {isApproval && item.status === 'Disetujui' && (
              <span className="text-xs text-[#15803D] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui Lurah
              </span>
            )}
          </div>
        )}

        {/* Catatan dari Lurah jika ada (terutama jika ditolak atau ada arahan) */}
        {item.catatanLurah && (
          <div className={`p-4 rounded-xl border text-sm ${
            item.status === 'Ditolak'
              ? 'bg-[#FEE2E2] border-[#FECACA] text-[#B91C1C]'
              : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Catatan / Arahan dari Lurah Lebakgede:</span>
            </div>
            <p className="text-sm leading-relaxed">{item.catatanLurah}</p>
          </div>
        )}

        {/* Detail Persuratan Disposisi jika ada */}
        {item.statusDisposisi && (
          <div className="p-4 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] text-sm text-[#1E3A8A]">
            <span className="font-bold block mb-1">Status Disposisi Lurah:</span>
            <p className="font-semibold text-base">{item.statusDisposisi}</p>
            {item.instruksiLurah && (
              <div className="mt-2 pt-2 border-t border-[#BFDBFE]/60">
                <span className="text-xs text-[#475569] font-medium">Instruksi Lurah:</span>
                <p className="text-sm text-[#0F172A] mt-0.5">{item.instruksiLurah}</p>
              </div>
            )}
          </div>
        )}

        {/* Grid Informasi Field */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {config.fields.map((field) => {
            if (field.name === 'status') return null; // Status already displayed prominently above
            const rawValue = item[field.name];

            let displayValue = rawValue || '-';
            if (field.type === 'currency' && typeof rawValue === 'number') {
              displayValue = formatRupiah(rawValue);
            } else if (field.type === 'date' && rawValue) {
              displayValue = formatIndonesianDate(rawValue);
            }

            return (
              <div
                key={field.name}
                className="p-3 bg-white border border-[#E2E8F0] rounded-lg"
              >
                <span className="text-xs text-[#64748B] block font-medium">
                  {field.label}
                </span>
                <span className="text-sm font-semibold text-[#0F172A] mt-1 block">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tombol Aksi di Bawah */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-4 border-t border-[#E2E8F0]">
          {canSubmitToLurah && onSubmitForApproval ? (
            <Button
              variant="primary"
              onClick={() => {
                onSubmitForApproval(item);
                onClose();
              }}
              className="w-full sm:w-auto bg-[#1E3A8A] hover:bg-[#2563EB] justify-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Ajukan ke Lurah
            </Button>
          ) : <div className="hidden sm:block" />}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onEdit && (
              <Button
                variant="outline"
                className="flex-1 sm:flex-initial justify-center"
                onClick={() => {
                  onClose();
                  onEdit(item);
                }}
              >
                Ubah Data
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-initial justify-center">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
