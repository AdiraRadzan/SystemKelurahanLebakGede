import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { findUserById } from '@/data/users';
import { DashboardLayout } from '@/components/layout/dashboard-layout';


export default async function RoleDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  if (!session) {
    redirect('/login?pesan=sesi_berakhir');
  }

  const user = findUserById(session.userId) || {
    id: session.userId,
    username: session.username,
    name: session.name,
    role: session.role,
    roleTitle: session.roleTitle,
  };

  return (
    <DashboardLayout user={user}>
      {children}
    </DashboardLayout>
  );
}
