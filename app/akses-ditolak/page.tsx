import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifySession, COOKIE_NAME } from '@/lib/auth';
import { ShieldX, Home, LogOut } from 'lucide-react';


export default async function AksesDitolakPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  const homeHref = session ? `/${session.role}/beranda` : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center mb-6 mx-auto">
          <ShieldX className="w-9 h-9" />
        </div>

        <span className="inline-block px-3 py-1 bg-[#FEE2E2] text-[#B91C1C] text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
          Akses Dibatasi
        </span>

        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">
          Akses Halaman Ditolak
        </h1>

        <p className="text-sm text-[#475569] leading-relaxed mb-6">
          Mohon maaf, Anda tidak memiliki hak akses untuk membuka halaman atau modul bidang ini.
          Setiap akun staf kelurahan hanya diizinkan mengakses modul kerja yang sesuai dengan tugas dan fungsinya.
        </p>

        {session && (
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-left mb-6 space-y-1">
            <p className="text-[#64748B]">Akun yang sedang aktif:</p>
            <p className="text-sm font-bold text-[#0F172A]">{session.name} ({session.roleTitle})</p>
            <p className="text-[#64748B]">Silakan gunakan menu tugas yang tersedia pada bidang Anda.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={homeHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[#1E3A8A] text-white hover:bg-[#2563EB] font-semibold text-sm transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC] font-semibold text-sm transition-colors"
          >
            Ganti Akun Lain
          </Link>
        </div>
      </div>
    </div>
  );
}
