import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { ProfilKesosCrudView } from '@/components/kesos/profil-kesos-crud';

export const metadata = {
  title: 'Kelola Profil Wilayah Kesos | Sistem Satu Data Kelurahan Lebakgede',
  description: 'Input dan pemutakhiran data profil Kelembagaan, Sarana Pendidikan, Sarana Kesehatan, Stunting, PMKS & Ibadah tingkat RW',
};

export default async function KesosProfilPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  if (session.role !== 'kesos') {
    redirect('/akses-ditolak');
  }

  return <ProfilKesosCrudView />;
}
