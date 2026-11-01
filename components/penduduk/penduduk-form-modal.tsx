'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PendudukRecord } from '@/lib/penduduk-api';
import { RT_OPTIONS, RW_OPTIONS } from '@/config/modules';

// ============================================================================
// Formulir tambah / ubah data penduduk.
// Urutan & nama kolom mengikuti HEADERS_PENDUDUK di apps-script/Code.gs.
// ============================================================================

type FieldType = 'text' | 'select' | 'textarea' | 'date';

interface FieldDef {
  name: keyof PendudukRecord & string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  helperText?: string;
  full?: boolean;
}

const GENDER_OPTIONS = [
  { label: 'Laki-Laki', value: 'Laki-Laki' },
  { label: 'Perempuan', value: 'Perempuan' },
];

const STATUS_KAWIN_OPTIONS = [
  'Belum Kawin',
  'Kawin',
  'Cerai Hidup',
  'Cerai Mati',
].map((v) => ({ label: v, value: v }));

const AGAMA_OPTIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'].map(
  (v) => ({ label: v, value: v })
);

const PENDIDIKAN_OPTIONS = [
  'Tidak / Belum Sekolah',
  'SD / Sederajat',
  'SMP / Sederajat',
  'SMA / SMK / Sederajat',
  'D1 / D2 / D3',
  'D4 / S1',
  'S2',
  'S3',
].map((v) => ({ label: v, value: v }));

const KEDUDUKAN_OPTIONS = [
  'Kepala Keluarga',
  'Istri',
  'Anak',
  'Menantu',
  'Cucu',
  'Orang Tua',
  'Famili Lain',
  'Lainnya',
].map((v) => ({ label: v, value: v }));

const GOLDAR_OPTIONS = ['A', 'B', 'AB', 'O', '-'].map((v) => ({ label: v, value: v }));

const FIELDS: FieldDef[] = [
  { name: 'Nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Contoh: Asep Sunandar' },
  { name: 'NIK', label: 'NIK (16 Digit)', type: 'text', placeholder: '3273012345670001', helperText: '16 angka sesuai KTP/KK.' },
  { name: 'NoKK', label: 'Nomor Kartu Keluarga', type: 'text', placeholder: '3273012345670001' },
  { name: 'NoUrtKeluarga', label: 'No. Urut dalam Keluarga', type: 'text', placeholder: 'Contoh: 1' },
  { name: 'NamaKepalaKeluarga', label: 'Nama Kepala Keluarga', type: 'text', placeholder: 'Contoh: DEDI RAHMAT' },
  { name: 'TglKK', label: 'Tanggal Kartu Keluarga', type: 'date' },
  { name: 'JenisKelamin', label: 'Jenis Kelamin', type: 'select', options: GENDER_OPTIONS },
  { name: 'TempatLahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Contoh: Bandung' },
  { name: 'TanggalLahir', label: 'Tanggal Lahir', type: 'date' },
  { name: 'RT', label: 'RT', type: 'select', options: RT_OPTIONS },
  { name: 'RW', label: 'RW', type: 'select', options: RW_OPTIONS },
  { name: 'StatusPerkawinan', label: 'Status Perkawinan', type: 'select', options: STATUS_KAWIN_OPTIONS },
  { name: 'KedudukanKeluarga', label: 'Kedudukan dalam Keluarga', type: 'select', options: KEDUDUKAN_OPTIONS },
  { name: 'Agama', label: 'Agama', type: 'select', options: AGAMA_OPTIONS },
  { name: 'Pendidikan', label: 'Pendidikan Terakhir', type: 'select', options: PENDIDIKAN_OPTIONS },
  { name: 'Pekerjaan', label: 'Pekerjaan', type: 'text', placeholder: 'Contoh: Karyawan Swasta' },
  { name: 'GolonganDarah', label: 'Golongan Darah', type: 'select', options: GOLDAR_OPTIONS },
  { name: 'Kewarganegaraan', label: 'Kewarganegaraan', type: 'text', placeholder: 'WNI' },
  { name: 'Suku', label: 'Suku', type: 'text', placeholder: 'Contoh: Sunda' },
  { name: 'TglKawin', label: 'Tanggal Perkawinan', type: 'date' },
  { name: 'NamaAyah', label: 'Nama Ayah', type: 'text', placeholder: 'Nama ayah kandung' },
  { name: 'NamaIbu', label: 'Nama Ibu', type: 'text', placeholder: 'Nama ibu kandung' },
  { name: 'Alamat', label: 'Alamat Lengkap', type: 'textarea', placeholder: 'Jalan, nomor rumah, RT/RW', full: true },
  { name: 'CatatanImpor', label: 'Catatan / Keterangan', type: 'textarea', placeholder: 'Catatan tambahan (opsional)', full: true },
];

interface PendudukFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PendudukRecord | null;
  onSave: (data: PendudukRecord) => Promise<void> | void;
}

export function PendudukFormModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: PendudukFormModalProps) {
  const isEditing = Boolean(initialData && initialData.ID);

  // Nilai awal dihitung sekali saat komponen dipasang. Induk memberi `key`
  // yang berubah tiap kali modal dibuka / target ubah berganti, sehingga
  // formulir selalu mulai dari data yang benar tanpa useEffect.
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (initialData) {
      const seed: Record<string, string> = {};
      FIELDS.forEach((f) => {
        seed[f.name] = String(initialData[f.name] ?? '');
      });
      return seed;
    }
    return { Kewarganegaraan: 'WNI' };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    FIELDS.forEach((f) => {
      const val = (formData[f.name] ?? '').trim();
      if (f.name === 'NIK' && val) {
        const clean = val.replace(/\s/g, '');
        if (clean !== '-' && !/^\d{16}$/.test(clean)) {
          next[f.name] = 'NIK harus terdiri dari 16 angka.';
        }
      }
      if (f.name === 'NoKK' && val) {
        const clean = val.replace(/\s/g, '');
        if (clean !== '-' && !/^\d{16}$/.test(clean)) {
          next[f.name] = 'Nomor KK harus terdiri dari 16 angka.';
        }
      }
    });

    if (!(formData.Nama ?? '').trim() && !(formData.NIK ?? '').trim()) {
      next.Nama = 'Isi minimal Nama atau NIK.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Backend hanya menerima string; kosongkan yang tidak diisi.
      const payload: PendudukRecord = {};
      Object.entries(formData).forEach(([k, v]) => {
        const trimmed = String(v ?? '').trim();
        if (trimmed !== '') payload[k] = trimmed;
      });
      await onSave(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Ubah Data Penduduk' : 'Tambah Data Penduduk'}
      description={
        isEditing
          ? 'Perubahan akan langsung tersimpan ke Google Sheets.'
          : 'Data baru akan ditambahkan ke Google Sheets.'
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          {FIELDS.map((field) => (
            <div key={field.name} className={field.full ? 'sm:col-span-2' : ''}>
              <label
                htmlFor={`pd_${field.name}`}
                className="block text-sm font-semibold text-[#0F172A] mb-1.5"
              >
                {field.label}
              </label>

              {field.type === 'select' ? (
                <select
                  id={`pd_${field.name}`}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  className={`w-full min-h-[44px] px-3 rounded-lg border text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] ${
                    errors[field.name] ? 'border-[#DC2626]' : 'border-[#CBD5E1]'
                  }`}
                >
                  <option value="">— Pilih —</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={`pd_${field.name}`}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={2}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] ${
                    errors[field.name] ? 'border-[#DC2626]' : 'border-[#CBD5E1]'
                  }`}
                />
              ) : (
                <input
                  id={`pd_${field.name}`}
                  type={field.type === 'date' ? 'date' : 'text'}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => setValue(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full min-h-[44px] px-3 rounded-lg border text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] ${
                    errors[field.name] ? 'border-[#DC2626]' : 'border-[#CBD5E1]'
                  }`}
                />
              )}

              {errors[field.name] && (
                <p className="mt-1 text-xs text-[#DC2626] font-medium">{errors[field.name]}</p>
              )}
              {!errors[field.name] && field.helperText && (
                <p className="mt-1 text-xs text-[#64748B]">{field.helperText}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto justify-center">
            Batal
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting} className="w-full sm:w-auto justify-center bg-[#1E3A8A] hover:bg-[#2563EB]">
            {isEditing ? 'Simpan Perubahan' : 'Simpan Data'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
