'use client';

import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { UserCheck, Shield, Clock, Monitor } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  if (!user) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Profil Pengguna"
      description="Informasi akun kedinasan dan catatan riwayat masuk"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Identitas Pengguna */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="w-14 h-14 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">{user.name}</h3>
            <p className="text-sm font-medium text-[#1E3A8A]">{user.roleTitle}</p>
            <p className="text-xs text-[#475569] mt-0.5">NIP: {user.nip || '-'}</p>
          </div>
        </div>

        {/* Detail Akun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
            <span className="text-[#475569] block text-xs">Nama Pengguna (Username)</span>
            <span className="font-semibold text-[#0F172A]">{user.username}</span>
          </div>
          <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
            <span className="text-[#475569] block text-xs">Jabatan Kedinasan</span>
            <span className="font-semibold text-[#0F172A]">{user.jabatan || user.roleTitle}</span>
          </div>
          <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
            <span className="text-[#475569] block text-xs">Wilayah Tugas</span>
            <span className="font-semibold text-[#0F172A]">Kelurahan Lebakgede, Kec. Coblong</span>
          </div>
          <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
            <span className="text-[#475569] block text-xs">Status Akun</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#15803D]">
              <Shield className="w-3.5 h-3.5" /> Terverifikasi Aktif
            </span>
          </div>
        </div>

        {/* 5 Riwayat Login Terakhir */}
        <div>
          <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1E3A8A]" />
            Riwayat 5 Sesi Masuk Terakhir
          </h4>
          <div className="border border-[#E2E8F0] rounded-lg divide-y divide-[#E2E8F0] overflow-hidden">
            {user.loginHistory && user.loginHistory.length > 0 ? (
              user.loginHistory.map((item, idx) => (
                <div key={idx} className="p-3 bg-[#F8FAFC] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#475569]" />
                    <span className="font-medium text-[#0F172A]">{item.device}</span>
                  </div>
                  <div className="text-right text-[#475569]">
                    <span className="font-semibold">{item.timestamp}</span>
                    <span className="block text-[11px] text-[#64748B]">IP: {item.ip}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-[#475569]">
                Belum ada riwayat tercatat.
              </div>
            )}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto justify-center">
            Tutup
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
