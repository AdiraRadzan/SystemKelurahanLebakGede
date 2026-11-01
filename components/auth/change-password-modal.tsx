'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Semua bidang kata sandi wajib diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi baru tidak sesuai.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Kata sandi berhasil diperbarui', 'Gunakan kata sandi baru saat Anda masuk kembali.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }, 700);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Ubah Kata Sandi"
      description="Perbarui kata sandi untuk keamanan akun dinas Anda"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-sm text-[#B91C1C]">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1">
            Kata Sandi Lama <span className="text-[#B91C1C]">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan kata sandi saat ini"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
            />
          </div>
          <p className="text-xs text-[#64748B] mt-1">Masukkan kata sandi yang sedang aktif digunakan.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1">
            Kata Sandi Baru <span className="text-[#B91C1C]">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
            />
          </div>
          <p className="text-xs text-[#64748B] mt-1">Gunakan kombinasi huruf dan angka agar lebih aman.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1">
            Konfirmasi Kata Sandi Baru <span className="text-[#B91C1C]">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="show-pass-toggle"
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4 text-[#1E3A8A] rounded border-[#CBD5E1] focus:ring-[#1E3A8A]"
          />
          <label htmlFor="show-pass-toggle" className="text-sm text-[#475569] cursor-pointer">
            Tampilkan kata sandi
          </label>
        </div>

        {/* Tombol aksi sesuai aturan: Batal (outline) dan Simpan (biru) di kanan */}
        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto justify-center">
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full sm:w-auto justify-center">
            Simpan Kata Sandi
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
