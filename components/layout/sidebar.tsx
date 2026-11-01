'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole, MenuGroup } from '@/types';
import { ROLE_NAVIGATION } from '@/config/navigation';
import { IconRenderer } from '@/components/ui/icon-renderer';
import { HelpModal } from '@/components/auth/help-modal';
import {
  HelpCircle,
  X,
  ChevronDown,
  Folder,
  LayoutDashboard,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  roleTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

const GROUP_ICONS: Record<string, string> = {
  'PERENCANAAN': 'Target',
  'ADMINISTRASI SURAT': 'Inbox',
  'UMUM & ASET': 'Package',
  'ADMINISTRASI': 'FileText',
  'DATA PENGURUS': 'Users',
  'PEMBANGUNAN': 'Building2',
  'EKONOMI & PEMBERDAYAAN': 'Store',
  'PETUGAS LAPANGAN': 'Trash2',
  'DATA UMUM': 'Sparkles',
  'DATA WARGA & KESEHATAN': 'Heart',
};

export function Sidebar({ role, roleTitle, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = useState(false);

  const menuGroups = ROLE_NAVIGATION[role] || [];

  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Auto-expand the group that contains the current active route
  useEffect(() => {
    const updated: Record<string, boolean> = { ...expandedGroups };
    menuGroups.forEach((group) => {
      const containsActive = group.items.some(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
      );
      if (containsActive) {
        updated[group.groupName] = true;
      }
    });
    setExpandedGroups(updated);
  }, [pathname, role]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: 260px */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[260px] bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header (Mobile close button & title) */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E2E8F0] md:hidden">
          <span className="font-bold text-sm text-[#0F172A]">Menu Navigasi</span>
          <button
            onClick={onClose}
            className="p-2 text-[#475569] hover:text-[#0F172A] rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Bar for desktop (consistent 64px align) */}
        <div className="hidden md:flex h-16 items-center px-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div>
            <p className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">
              {roleTitle || 'Sistem Kelurahan'}
            </p>
            <p className="text-xs text-[#64748B]">Satu Data Lebakgede</p>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {menuGroups.map((group) => {
            const isSingleBeranda =
              group.items.length === 1 && group.items[0].href.endsWith('/beranda');

            // Lurah role has flat top-level menus without nesting
            const isLurahGroup = role === 'lurah';

            if (isSingleBeranda || isLurahGroup) {
              return (
                <div key={group.groupName} className="space-y-1">
                  {isLurahGroup && (
                    <h3 className="px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                      {group.groupName}
                    </h3>
                  )}
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => onClose()}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors min-h-[44px] ${
                          isActive
                            ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
                            : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                        }`}
                      >
                        <IconRenderer
                          name={item.iconName}
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? 'text-white' : 'text-[#64748B]'
                          }`}
                        />
                        <span className="truncate leading-tight">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            }

            // Accordion group with collapsible submenus
            const isExpanded = Boolean(expandedGroups[group.groupName]);
            const containsActive = group.items.some(
              (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
            );
            const groupIcon = GROUP_ICONS[group.groupName] || 'Folder';

            return (
              <div key={group.groupName} className="space-y-1">
                {/* Collapsible Group Header Button */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.groupName)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-bold transition-all min-h-[44px] ${
                    containsActive
                      ? 'bg-blue-50/70 text-[#1E3A8A]'
                      : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconRenderer
                      name={groupIcon}
                      className={`w-5 h-5 flex-shrink-0 ${
                        containsActive ? 'text-[#1E3A8A]' : 'text-[#64748B]'
                      }`}
                    />
                    <span className="truncate tracking-tight uppercase text-xs">
                      {group.groupName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#475569]">
                      {group.items.length}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#1E3A8A]' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Submenu Items (Rendered only when expanded) */}
                {isExpanded && (
                  <div className="ml-4 pl-3 border-l-2 border-[#E2E8F0] space-y-1 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => onClose()}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors min-h-[40px] ${
                            isActive
                              ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs'
                              : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                          }`}
                        >
                          <IconRenderer
                            name={item.iconName}
                            className={`w-4 h-4 flex-shrink-0 ${
                              isActive ? 'text-white' : 'text-[#64748B]'
                            }`}
                          />
                          <span className="truncate leading-tight">
                            {item.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer with Bantuan Button */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            onClick={() => setHelpOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-sm font-semibold text-[#1E3A8A] hover:bg-[#F1F5F9] transition-colors min-h-[44px] shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-[#1E3A8A]" />
            Bantuan & Panduan
          </button>
        </div>
      </aside>

      {/* Modal Bantuan */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        roleTitle={roleTitle}
      />
    </>
  );
}
