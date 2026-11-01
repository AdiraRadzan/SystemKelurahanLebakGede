'use client';

import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: DeleteModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Hapus Data"
      description="Tindakan ini akan menghapus data terpilih dari sistem"
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="p-3.5 bg-[#FEE2E2] border border-[#FECACA] rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#B91C1C] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#B91C1C]">
            <p className="font-semibold">Yakin ingin menghapus data ini?</p>
            {itemName && (
              <p className="text-xs text-[#991B1B] mt-1 line-clamp-2">
                &ldquo;{itemName}&rdquo;
              </p>
            )}
            <p className="text-xs text-[#991B1B] mt-1">
              Data yang telah dihapus tidak dapat dipulihkan kembali.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 border-t border-[#E2E8F0]">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto justify-center">
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading} className="w-full sm:w-auto justify-center">
            Hapus Data
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
