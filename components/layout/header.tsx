'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProfileModal } from '@/components/auth/profile-modal';
import { ChangePasswordModal } from '@/components/auth/change-password-modal';
import { toast } from '@/lib/toast';
import { Menu, ChevronDown, User as UserIcon, KeyRound, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onToggleSidebar?: () => void;
}

export function Header({ user, onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.info('Anda telah keluar', 'Terima kasih telah menggunakan Satu Data Kelurahan Lebakgede.');
      setLogoutDialogOpen(false);
      router.push('/login?pesan=keluar');
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Sisi Kiri: Tombol Menu (Mobile) & Logo/Identitas */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Buka menu navigasi"
            className="md:hidden p-2 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#E2E8F0] shadow-2xs bg-white">
              <img
                src="/logo-lebakgede.png"
                alt="Logo Kelurahan Lebakgede"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#0F172A] leading-tight">
                Kelurahan Lebakgede
              </h1>
              <p className="text-[11px] sm:text-xs text-[#475569] hidden xs:block sm:block">
                Kecamatan Coblong, Kota Bandung
              </p>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Akun Pengguna & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 md:px-3 md:py-2 rounded-lg hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all min-h-[44px]"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-[#0F172A] leading-tight">
                {user?.name || 'Pengguna'}
              </p>
              <p className="text-xs text-[#1E3A8A] font-medium">
                {user?.roleTitle || 'Staf'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-[#475569] hidden sm:block" />
          </button>

          {/* Dropdown Menu Pengguna */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-40 text-sm animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-[#E2E8F0] sm:hidden">
                <p className="font-bold text-[#0F172A]">{user?.name}</p>
                <p className="text-xs text-[#1E3A8A]">{user?.roleTitle}</p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setProfileModalOpen(true);
                }}
                className="w-full px-4 py-2.5 text-left text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 transition-colors font-medium"
              >
                <UserIcon className="w-4 h-4 text-[#1E3A8A]" />
                Profil Saya
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setChangePasswordModalOpen(true);
                }}
                className="w-full px-4 py-2.5 text-left text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 transition-colors font-medium"
              >
                <KeyRound className="w-4 h-4 text-[#1E3A8A]" />
                Ubah Kata Sandi
              </button>

              <div className="my-1 border-t border-[#E2E8F0]" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setLogoutDialogOpen(true);
                }}
                className="w-full px-4 py-2.5 text-left text-[#B91C1C] hover:bg-[#FEE2E2]/60 flex items-center gap-2.5 transition-colors font-semibold"
              >
                <LogOut className="w-4 h-4 text-[#B91C1C]" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Modal Profil Saya */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
      />

      {/* Modal Ubah Sandi */}
      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />

      {/* Dialog Konfirmasi Keluar */}
      <Dialog
        isOpen={logoutDialogOpen}
        onClose={() => !isLoggingOut && setLogoutDialogOpen(false)}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari sistem Satu Data Kelurahan Lebakgede?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-[#475569]">
            Pastikan seluruh data yang sedang Anda isi telah disimpan sebelum keluar.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleLogout}
              isLoading={isLoggingOut}
            >
              Ya, Keluar
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
