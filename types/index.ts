export type UserRole = 'lurah' | 'sekel' | 'pemerintahan' | 'ekbang' | 'kesos';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  nip?: string;
  jabatan?: string;
  loginHistory?: {
    timestamp: string;
    ip: string;
    device: string;
  }[];
}

export interface MenuItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  description?: string;
}

export interface MenuGroup {
  groupName: string;
  items: MenuItem[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}
