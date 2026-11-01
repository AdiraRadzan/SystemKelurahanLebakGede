import { UserRole } from './index';

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'currency' | 'file';

export interface FormOption {
  label: string;
  value: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: FormOption[];
  defaultValue?: any;
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'currency' | 'date' | 'number';
  sortable?: boolean;
}

export interface ModuleConfig {
  slug: string;
  name: string;
  description: string;
  role: UserRole;
  group: string;
  columns: TableColumn[];
  fields: FormField[];
  isApprovalFlow?: boolean; // For Rencana Program Kerja & Rencana Giat
  isSuratMasuk?: boolean; // For Surat Masuk
  hasCalendarView?: boolean; // For Rencana Giat
  initialData?: Record<string, any>[];
}
