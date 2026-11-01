'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ModuleConfig, FormField } from '@/types/module';

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ModuleConfig;
  initialData?: Record<string, any> | null;
  onSave: (data: Record<string, any>) => void;
}

export function ModuleFormModal({
  isOpen,
  onClose,
  config,
  initialData,
  onSave,
}: ModuleFormModalProps) {
  const isEditing = Boolean(initialData && initialData.id);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaultValues: Record<string, any> = {};
      config.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaultValues[field.name] = field.defaultValue;
        } else if (field.options && field.options.length > 0) {
          defaultValues[field.name] = field.options[0].value;
        } else {
          defaultValues[field.name] = '';
        }
      });
      setFormData(defaultValues);
    }
    setErrors({});
  }, [initialData, config, isOpen]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      const val = formData[field.name];
      if (field.required) {
        if (val === undefined || val === null || String(val).trim() === '') {
          newErrors[field.name] = `${field.label} wajib diisi.`;
        }
      }

      // Khusus validasi NIK jika ada field nik
      if (field.name.toLowerCase() === 'nik' && val) {
        const cleanVal = String(val).trim();
        if (cleanVal !== '-' && !/^\d{16}$/.test(cleanVal)) {
          newErrors[field.name] = 'NIK harus terdiri dari 16 angka.';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Process currency numbers
      const processed = { ...formData };
      config.fields.forEach((field) => {
        if (field.type === 'currency' || field.type === 'number') {
          if (processed[field.name] !== undefined && processed[field.name] !== '') {
            processed[field.name] = Number(String(processed[field.name]).replace(/[^\d.-]/g, ''));
          }
        }
      });

      onSave(processed);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Ubah Data: ${config.name}` : `Tambah Data: ${config.name}`}
      description={
        isEditing
          ? 'Perbarui formulir di bawah ini dengan data yang benar'
          : 'Lengkapi isian data di bawah ini dengan teliti'
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.map((field) => {
            const isFullWidth = field.type === 'textarea' || field.name === 'namaProgram' || field.name === 'usulan';
            const value = formData[field.name] ?? '';
            const error = errors[field.name];

            return (
              <div
                key={field.name}
                className={isFullWidth ? 'md:col-span-2' : 'col-span-1'}
              >
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">
                  {field.label} {field.required && <span className="text-[#B91C1C]">*</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] min-h-[44px]"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                ) : field.type === 'date' ? (
                  <input
                    type="date"
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] min-h-[44px]"
                  />
                ) : field.type === 'number' || field.type === 'currency' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] min-h-[44px]"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] min-h-[44px]"
                  />
                )}

                {field.helperText && (
                  <p className="text-xs text-[#64748B] mt-1">{field.helperText}</p>
                )}

                {error && (
                  <p className="text-xs text-[#B91C1C] font-semibold mt-1">{error}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Tombol di Bawah Rata Kanan: [Batal] outline dan [Simpan] biru */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full sm:w-auto bg-[#1E3A8A] hover:bg-[#2563EB]">
            {isEditing ? 'Simpan Perubahan' : 'Simpan Data'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
