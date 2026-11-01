'use client';

import React, { useState } from 'react';
import { User, UserRole } from '@/types';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { ToastContainer } from '@/components/ui/toast';
import { WelcomeTour } from '@/components/layout/welcome-tour';

interface DashboardLayoutProps {
  user: User | null;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (user?.role || 'sekel') as UserRole;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Sidebar 260px */}
      <Sidebar
        role={role}
        roleTitle={user?.roleTitle}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Container offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col md:ml-[260px] transition-all">
        {/* Header 64px */}
        <Header
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Welcome Onboarding Tour */}
      <WelcomeTour userName={user?.name} roleTitle={user?.roleTitle} />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}
