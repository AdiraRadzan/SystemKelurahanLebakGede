'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DEMO_USERS } from '@/data/users';
import {
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  Shield,
  CheckCircle2,
  AlertCircle,
  Info,
  Building2,
  Check,
  Sparkles,
  X,
} from 'lucide-react';
import { ToastContainer } from '@/components/ui/toast';
import { toast } from '@/lib/toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('sekel');
  const [password, setPassword] = useState('sekel123');
  const [selectedRole, setSelectedRole] = useState('sekel');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const pesan = searchParams.get('pesan');
    if (pesan === 'sesi_berakhir') {
      setInfoMessage('Sesi Anda telah berakhir. Silakan masuk kembali.');
    } else if (pesan === 'keluar') {
      setInfoMessage('Anda telah berhasil keluar dari sistem.');
    }
  }, [searchParams]);

  const handleSelectDemoUser = (demoUsername: string, demoPass: string, roleSlug: string) => {
    setUsername(demoUsername);
    setPassword(demoPass);
    setSelectedRole(roleSlug);
    setErrorMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Nama pengguna dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Username atau kata sandi salah. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      toast.success('Berhasil Masuk', `Selamat datang kembali, ${data.user.name}`);
      
      router.push(`/${data.user.role}/beranda`);
      router.refresh();
    } catch {
      setErrorMessage('Terjadi gangguan koneksi sistem. Silakan periksa jaringan Anda.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#F8FAFC]">
      {/* ========================================================= */}
      {/* KOLOM KIRI (DESKTOP): IDENTITAS KEDINASAN PEMERINTAH */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-[#1E3A8A] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden shadow-xl">
        {/* Latar Belakang Gradien Halus */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] via-[#1E3A8A] to-[#172554] pointer-events-none" />
        
        {/* Pola Dekorasi Lingkaran Halus */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Bagian Atas: Lambang & Wilayah Pemerintahan */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-white p-0.5 shadow-md border-2 border-blue-200">
            <img
              src="/logo-lebakgede.png"
              alt="Logo Kelurahan Lebakgede"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">
                Pemerintah Kota Bandung
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
              Kelurahan Lebakgede
            </h2>
            <p className="text-xs text-blue-300">Kecamatan Coblong</p>
          </div>
        </div>

        {/* 2. Bagian Tengah: Judul Aplikasi & Poin Keunggulan */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-6 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Satu Data Kelurahan Terpadu</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white mb-4 tracking-tight">
            Sistem Informasi Satu Data Kelurahan Lebakgede
          </h1>

          <p className="text-blue-100 text-sm xl:text-base leading-relaxed mb-8">
            Pusat pelayanan data kependudukan, pengawasan program kerja terpadu, administrasi persuratan, dan pemantauan kesejahteraan masyarakat.
          </p>

          {/* 4 Poin Kunci Modul */}
          <div className="space-y-3.5 border-t border-blue-800/80 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs xl:text-sm text-blue-100 font-medium">
                Persetujuan berjenjang Program Kerja & Rencana Giat ke Lurah
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs xl:text-sm text-blue-100 font-medium">
                Pencatatan Surat Masuk & Disposisi Instan ke Seksi Pelaksana
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs xl:text-sm text-blue-100 font-medium">
                Pencatatan Administrasi Kependudukan, RW/RT, & Sarpras Fisik
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs xl:text-sm text-blue-100 font-medium">
                Data Balita, Baduta (1000 HPK), Ibu Hamil, & Lansia Terintegrasi
              </p>
            </div>
          </div>
        </div>

        {/* 3. Bagian Bawah: Informasi Versi & Lokasi */}
        <div className="relative z-10 text-xs text-blue-300 border-t border-blue-800/60 pt-5 flex items-center justify-between">
          <span>Kelurahan Lebakgede, Kec. Coblong</span>
          <span className="font-medium bg-blue-900/60 px-2.5 py-1 rounded border border-blue-700/50">
            Versi Prototype 2026
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* KOLOM KANAN: KARTU FORMULIR MASUK SISTEM */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-10 lg:px-12 py-10">
        <div className="w-full max-w-[480px]">
          {/* Header Mobile Only */}
          <div className="lg:hidden flex items-center gap-3 mb-6 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-xs border border-[#E2E8F0] p-0.5">
              <img
                src="/logo-lebakgede.png"
                alt="Logo Kelurahan Lebakgede"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A] leading-tight">
                Kelurahan Lebakgede
              </h2>
              <p className="text-xs text-[#475569]">Satu Data Kelurahan • Kota Bandung</p>
            </div>
          </div>

          {/* Kotak Utama Formulir */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-md">
            {/* Judul Formulir */}
            <div className="mb-6 pb-4 border-b border-[#F1F5F9]">
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Masuk ke Akun
              </h2>
              <p className="text-sm text-[#475569] mt-1">
                Silakan pilih akun demo atau masukkan kredensial dinas Anda
              </p>
            </div>

            {/* Kotak Akun Demo: Segmented Pill Buttons (Rapi & Mudah Dipilih) */}
            <div className="mb-6 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  Pilih Cepat Akun Demo:
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Klik untuk mengisi
                </span>
              </div>

              {/* Grid 5 Akun Demo Berlabel Singkat */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {DEMO_USERS.map((demo) => {
                  const isSelected = selectedRole === demo.role && username === demo.username;
                  return (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => handleSelectDemoUser(demo.username, demo.password || '', demo.role)}
                      className={`px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all text-center flex flex-col items-center justify-center min-h-[46px] ${
                        isSelected
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-xs'
                          : 'border-[#CBD5E1] bg-white text-[#334155] hover:border-[#1E3A8A] hover:bg-blue-50/50'
                      }`}
                    >
                      <span className="leading-tight">{demo.roleTitle}</span>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-[#64748B]'}`}>
                        ({demo.username})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Info akun yang sedang terpilih */}
              <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#475569]">
                <span>Pejabat: <strong className="text-[#0F172A]">{DEMO_USERS.find(u => u.username === username)?.name || username}</strong></span>
                <span className="inline-flex items-center gap-1 text-[#15803D] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Siap Masuk
                </span>
              </div>
            </div>

            {/* Notifikasi Pesan Sistem (Sesi habis / Keluar) */}
            {infoMessage && (
              <div className="mb-4 p-3.5 bg-blue-50/80 border border-blue-200 border-l-4 border-l-[#1E3A8A] rounded-xl flex items-start justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#1E3A8A] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#0F172A] block font-bold text-xs">Pemberitahuan Sistem</strong>
                    <span className="text-[#334155] leading-relaxed mt-0.5 block">{infoMessage}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInfoMessage('')}
                  className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-md transition-colors flex-shrink-0"
                  aria-label="Tutup pesan"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Notifikasi Error */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-rose-50/80 border border-rose-200 border-l-4 border-l-[#B91C1C] rounded-xl flex items-start justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#B91C1C] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-[#991B1B] block font-bold text-xs">Gagal Masuk</strong>
                    <span className="text-[#B91C1C] leading-relaxed mt-0.5 block">{errorMessage}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="text-[#B91C1C] hover:text-[#7F1D1D] p-1 rounded-md transition-colors flex-shrink-0"
                  aria-label="Tutup pesan error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Formulir Input */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Nama Pengguna (Username) <span className="text-[#B91C1C]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setSelectedRole('');
                    }}
                    placeholder="Masukkan username"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Kata Sandi <span className="text-[#B91C1C]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition-all min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#0F172A] min-h-[44px] min-w-[44px] justify-center"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Ingat Saya & Lupa Kata Sandi */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#475569] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#1E3A8A] rounded border-[#CBD5E1] focus:ring-[#1E3A8A]"
                  />
                  <span>Ingat saya (7 hari)</span>
                </label>

                <Link
                  href="/lupa-sandi"
                  className="font-semibold text-[#1E3A8A] hover:text-[#2563EB] hover:underline"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>

              {/* Tombol Masuk Lebar Penuh (Tinggi 48px, Solid Biru Tua) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[42px] sm:min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 disabled:opacity-60 shadow-xs text-sm"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Masuk ke Sistem'
                )}
              </button>
            </form>
          </div>

          {/* Footer Bawah */}
          <p className="text-center text-xs text-[#64748B] mt-6">
            © 2026 Kelurahan Lebakgede, Kecamatan Coblong, Kota Bandung.
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#64748B]">Memuat halaman masuk...</div>}>
      <LoginForm />
    </Suspense>
  );
}
