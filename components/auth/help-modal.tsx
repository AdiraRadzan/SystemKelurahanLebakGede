'use client';

import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Search, PlusCircle, FileText, Phone } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleTitle?: string;
}

export function HelpModal({ isOpen, onClose, roleTitle }: HelpModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Bantuan & Petunjuk Penggunaan"
      description={`Panduan ringkas penggunaan sistem untuk ${roleTitle || 'Staf Kelurahan'}`}
      maxWidth="lg"
    >
      <div className="space-y-5 text-sm text-[#0F172A]">
        {/* Langkah 1 */}
        <div className="flex gap-4 items-start p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            1
          </div>
          <div>
            <h4 className="font-bold text-base text-[#0F172A] mb-1">
              Pilih Menu di Sidebar Kiri
            </h4>
            <p className="text-[#475569] leading-relaxed">
              Klik menu tugas yang ingin Anda kelola pada panel sebelah kiri. Setiap menu telah disesuaikan khusus untuk bidang kerja dan tugas fungsi Anda di Kelurahan Lebakgede.
            </p>
          </div>
        </div>

        {/* Langkah 2 */}
        <div className="flex gap-4 items-start p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            2
          </div>
          <div>
            <h4 className="font-bold text-base text-[#0F172A] mb-1">
              Cari & Lihat Data Tabel
            </h4>
            <p className="text-[#475569] leading-relaxed">
              Gunakan kolom pencarian di atas tabel untuk mencari warga (NIK/Nama), kegiatan, atau dokumen. Klik tombol <strong>Lihat</strong> untuk detail, atau <strong>Ubah</strong> untuk memperbarui data.
            </p>
          </div>
        </div>

        {/* Langkah 3 */}
        <div className="flex gap-4 items-start p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            3
          </div>
          <div>
            <h4 className="font-bold text-base text-[#0F172A] mb-1">
              Tambah Data Baru
            </h4>
            <p className="text-[#475569] leading-relaxed">
              Klik tombol biru <strong>Tambah Data</strong> di kanan atas halaman. Isi formulir dengan teliti, periksa tanda bintang merah (*) untuk isian yang wajib, lalu klik <strong>Simpan</strong>.
            </p>
          </div>
        </div>

        {/* Kontak Bantuan Teknis */}
        <div className="p-4 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-3">
          <Phone className="w-6 h-6 text-[#1E3A8A] flex-shrink-0" />
          <div className="text-xs text-[#1E3A8A]">
            <p className="font-bold">Butuh Bantuan Lebih Lanjut?</p>
            <p className="text-[#475569]">
              Hubungi Tim TI Sekretariat Kelurahan Lebakgede (Kec. Coblong) atau hubungi No. Ext Kantor: 102.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={onClose} className="w-full sm:w-auto justify-center bg-[#1E3A8A]">
            Saya Mengerti
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
