import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Building2, Phone, Mail, MapPin } from 'lucide-react';

export default function LupaSandiPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-5 mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-center text-[#0F172A] mb-2">
          Lupa Kata Sandi?
        </h1>
        <p className="text-center text-sm text-[#475569] mb-6 leading-relaxed">
          Demi keamanan data kedinasan, silakan hubungi <strong>Sekretaris Kelurahan</strong> atau administrator TI untuk melakukan pengaturan ulang kata sandi Anda.
        </p>

        <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-xs text-[#0F172A] mb-6">
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
            <span>Kantor Kelurahan Lebakgede, Kec. Coblong, Kota Bandung</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
            <span>Telepon Kantor: (022) 2501234 (Ext. 102 - Sekretariat)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
            <span>Email Dinas: lebakgede@bandung.go.id</span>
          </div>
        </div>

        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F8FAFC] font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Halaman Masuk
        </Link>
      </div>
    </div>
  );
}
