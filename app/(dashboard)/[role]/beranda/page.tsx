import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { findUserById } from '@/data/users';
import { UserRole } from '@/types';
import { LurahBerandaView } from '@/components/lurah/lurah-beranda-view';
import { SectionBerandaView } from '@/components/dashboard/section-beranda-view';

const VALID_ROLES: UserRole[] = ['lurah', 'sekel', 'pemerintahan', 'ekbang', 'kesos'];

interface BerandaPageProps {
  params: Promise<{ role: string }>;
}

export default async function BerandaPage({ params }: BerandaPageProps) {
  const { role: rawRole } = await params;
  const role = rawRole as UserRole;

  if (!VALID_ROLES.includes(role)) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  if (session.role !== role) {
    redirect('/akses-ditolak');
  }

  const user = findUserById(session.userId) || {
    id: session.userId,
    username: session.username,
    name: session.name,
    role: session.role,
    roleTitle: session.roleTitle,
  };

  if (role === 'lurah') {
    return <LurahBerandaView />;
  }

  return <SectionBerandaView user={user} role={role} />;
}
