'use client';

import React from 'react';
import { useToastStore } from '@/lib/toast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-3 sm:top-5 sm:right-6 left-3 sm:left-auto z-50 flex flex-col gap-2 max-w-sm w-auto sm:w-full pointer-events-none"
    >
      {toasts.map((item) => {
        let badgeStyle = 'bg-emerald-50 border-emerald-200 text-[#15803D]';
        let leftBar = 'border-l-[#15803D]';
        let Icon = CheckCircle2;

        if (item.type === 'error') {
          badgeStyle = 'bg-rose-50 border-rose-200 text-[#B91C1C]';
          leftBar = 'border-l-[#B91C1C]';
          Icon = AlertCircle;
        } else if (item.type === 'warning') {
          badgeStyle = 'bg-amber-50 border-amber-200 text-[#B45309]';
          leftBar = 'border-l-[#B45309]';
          Icon = AlertTriangle;
        } else if (item.type === 'info') {
          badgeStyle = 'bg-blue-50 border-blue-200 text-[#1E3A8A]';
          leftBar = 'border-l-[#1E3A8A]';
          Icon = Info;
        }

        return (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[#E2E8F0] border-l-4 ${leftBar} shadow-lg transition-all animate-in slide-in-from-top-2 fade-in duration-200`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${badgeStyle}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-sm font-bold text-[#0F172A] leading-tight">
                {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-md transition-colors flex-shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
