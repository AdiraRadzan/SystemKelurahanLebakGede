import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { ProfilKesosLurahView } from '@/components/kesos/profil-kesos-lurah-view';

export const metadata = {
  title: 'Rekapitulasi Profil Kesos Kelurahan | Sistem Satu Data Kelurahan Lebakgede',
  description: 'Rekapitulasi profil kelembagaan sosial, fasilitas kesehatan, pemantauan stunting 1000 HPK, PMKS dan bansos 16 RW oleh Lurah',
};

export default async function LurahProfilKesosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  if (session.role !== 'lurah') {
    redirect('/akses-ditolak');
  }

  return <ProfilKesosLurahView />;
}
