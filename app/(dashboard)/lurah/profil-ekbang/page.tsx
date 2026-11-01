import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { ProfilEkbangLurahView } from '@/components/ekbang/profil-ekbang-lurah-view';

export const metadata = {
  title: 'Rekapitulasi Profil Ekbang Kelurahan | Sistem Satu Data Kelurahan Lebakgede',
  description: 'Rekapitulasi otomatis profil SDA, Ekonomi & Sarpras 16 RW serta Unduh Excel resmi oleh Lurah',
};

export default async function LurahProfilEkbangPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  if (session.role !== 'lurah') {
    redirect('/akses-ditolak');
  }

  return <ProfilEkbangLurahView />;
}
