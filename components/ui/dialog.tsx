'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let widthClass = 'max-w-md';
  if (maxWidth === 'sm') widthClass = 'max-w-sm';
  if (maxWidth === 'lg') widthClass = 'max-w-lg';
  if (maxWidth === 'xl') widthClass = 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`relative w-full ${widthClass} bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in fade-in sm:zoom-in-95 duration-200`}
      >
        {/* Mobile handle indicator */}
        <div className="sm:hidden flex justify-center pt-2 pb-1 bg-[#F8FAFC]">
          <div className="w-10 h-1 bg-[#CBD5E1] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="pr-2">
            <h2 id="dialog-title" className="text-lg sm:text-xl font-bold text-[#0F172A] leading-snug">
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-[#475569] mt-0.5 line-clamp-1 sm:line-clamp-none">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup dialog"
            className="p-2 text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
