import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { ProfilEkbangCrudView } from '@/components/ekbang/profil-ekbang-crud';

export const metadata = {
  title: 'Kelola Profil Wilayah Ekbang | Sistem Satu Data Kelurahan Lebakgede',
  description: 'Input dan pemutakhiran data profil Sumber Daya Alam, Kelembagaan Ekonomi, dan Sarpras fisik tingkat RW',
};

export default async function EkbangProfilPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  if (session.role !== 'ekbang') {
    redirect('/akses-ditolak');
  }

  return <ProfilEkbangCrudView />;
}
