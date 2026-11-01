'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ArrowLeft, Check, X, Shield, Layers, HelpCircle } from 'lucide-react';

interface WelcomeTourProps {
  userName?: string;
  roleTitle?: string;
}

export function WelcomeTour({ userName, roleTitle }: WelcomeTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('lebakgede_tour_dismissed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('lebakgede_tour_dismissed', 'true');
    setIsOpen(false);
  };

  const steps = [
    {
      title: 'Selamat Datang di Satu Data Kelurahan Lebakgede',
      description: `Halo ${userName || 'Bapak/Ibu'}, ini adalah platform resmi pencatatan dan pengelolaan satu data Kelurahan Lebakgede, Kecamatan Coblong, Kota Bandung.`,
      icon: Shield,
    },
    {
      title: 'Menu Khusus Sesuai Tugas Pokok Anda',
      description: `Sebagai ${roleTitle || 'Staf Kelurahan'}, sidebar kiri telah disesuaikan hanya menampilkan menu kerja bidang Anda agar mudah dipahami dan tidak membingungkan.`,
      icon: Layers,
    },
    {
      title: 'Kelola Data, Unduh Excel, & Tambah Data',
      description: 'Setiap modul memiliki tabel dengan pencarian cepat, filter status, fitur unduh file Excel (CSV), serta tombol biru "Tambah Data" di kanan atas.',
      icon: Sparkles,
    },
    {
      title: 'Bantuan & Panduan Kapan Saja',
      description: 'Jika membutuhkan petunjuk langkah penggunaan, cukup klik tombol "Bantuan & Panduan" di bagian paling bawah sidebar kiri.',
      icon: HelpCircle,
    },
  ];

  if (!isOpen) return null;

  const stepData = steps[currentStep];
  const StepIcon = stepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8F0] shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Tutup tur"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Header Step Counter */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-[#1E3A8A]">
              Langkah {currentStep + 1} dari {steps.length}
            </span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center mb-5">
            <StepIcon className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-[#0F172A] leading-snug mb-2">
            {stepData.title}
          </h3>
          <p className="text-sm text-[#475569] leading-relaxed">
            {stepData.description}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E2E8F0]">
          <button
            onClick={handleDismiss}
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] underline underline-offset-4"
          >
            Lewati Pengenalan
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep((prev) => prev - 1)}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Sebelumnya
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-[#1E3A8A] hover:bg-[#2563EB]"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleDismiss}
                className="bg-[#15803D] hover:bg-[#166534]"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                <span>Mulai Gunakan</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
