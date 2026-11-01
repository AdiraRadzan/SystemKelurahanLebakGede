import { User } from '@/types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-lurah-01',
    username: 'lurah',
    password: 'lurah123',
    name: 'Bapak Lurah',
    role: 'lurah',
    roleTitle: 'Lurah',
    nip: '19740512 199803 1 004',
    jabatan: 'Kepala Kelurahan Lebakgede',
    loginHistory: [
      { timestamp: '16 Okt 2026, 08:15 WIB', ip: '192.168.1.10', device: 'Chrome - PC Kantor Lurah' },
      { timestamp: '15 Okt 2026, 09:30 WIB', ip: '192.168.1.10', device: 'Chrome - PC Kantor Lurah' },
      { timestamp: '14 Okt 2026, 14:10 WIB', ip: '180.252.88.12', device: 'Safari - iPad Dinas' },
      { timestamp: '13 Okt 2026, 08:05 WIB', ip: '192.168.1.10', device: 'Chrome - PC Kantor Lurah' },
      { timestamp: '10 Okt 2026, 10:22 WIB', ip: '192.168.1.10', device: 'Chrome - PC Kantor Lurah' },
    ]
  },
  {
    id: 'user-sekel-01',
    username: 'sekel',
    password: 'sekel123',
    name: 'Ibu Sekretaris',
    role: 'sekel',
    roleTitle: 'Sekretaris Kelurahan',
    nip: '19790820 200501 2 008',
    jabatan: 'Sekretaris Kelurahan Lebakgede',
    loginHistory: [
      { timestamp: '16 Okt 2026, 07:45 WIB', ip: '192.168.1.15', device: 'Edge - PC Sekretariat' },
      { timestamp: '15 Okt 2026, 08:00 WIB', ip: '192.168.1.15', device: 'Edge - PC Sekretariat' },
      { timestamp: '14 Okt 2026, 07:50 WIB', ip: '192.168.1.15', device: 'Edge - PC Sekretariat' },
      { timestamp: '13 Okt 2026, 13:20 WIB', ip: '192.168.1.15', device: 'Edge - PC Sekretariat' },
      { timestamp: '12 Okt 2026, 08:02 WIB', ip: '192.168.1.15', device: 'Edge - PC Sekretariat' },
    ]
  },
  {
    id: 'user-pem-01',
    username: 'pemerintahan',
    password: 'pem123',
    name: 'Bapak Kasi Pemerintahan',
    role: 'pemerintahan',
    roleTitle: 'Sie Pemerintahan',
    nip: '19810315 200701 1 012',
    jabatan: 'Kepala Seksi Pemerintahan',
    loginHistory: [
      { timestamp: '16 Okt 2026, 08:05 WIB', ip: '192.168.1.22', device: 'Chrome - PC Sie Pemerintahan' },
      { timestamp: '15 Okt 2026, 08:12 WIB', ip: '192.168.1.22', device: 'Chrome - PC Sie Pemerintahan' },
      { timestamp: '14 Okt 2026, 09:00 WIB', ip: '192.168.1.22', device: 'Chrome - PC Sie Pemerintahan' },
      { timestamp: '11 Okt 2026, 11:15 WIB', ip: '192.168.1.22', device: 'Chrome - PC Sie Pemerintahan' },
      { timestamp: '10 Okt 2026, 08:30 WIB', ip: '192.168.1.22', device: 'Chrome - PC Sie Pemerintahan' },
    ]
  },
  {
    id: 'user-ekbang-01',
    username: 'ekbang',
    password: 'ekbang123',
    name: 'Bapak Kasi Ekbang',
    role: 'ekbang',
    roleTitle: 'Sie Ekonomi dan Pembangunan',
    nip: '19831110 200902 1 007',
    jabatan: 'Kepala Seksi Ekonomi dan Pembangunan',
    loginHistory: [
      { timestamp: '16 Okt 2026, 08:20 WIB', ip: '192.168.1.28', device: 'Chrome - PC Sie Ekbang' },
      { timestamp: '15 Okt 2026, 08:35 WIB', ip: '192.168.1.28', device: 'Chrome - PC Sie Ekbang' },
      { timestamp: '13 Okt 2026, 10:05 WIB', ip: '192.168.1.28', device: 'Chrome - PC Sie Ekbang' },
      { timestamp: '12 Okt 2026, 08:15 WIB', ip: '192.168.1.28', device: 'Chrome - PC Sie Ekbang' },
      { timestamp: '09 Okt 2026, 09:40 WIB', ip: '192.168.1.28', device: 'Chrome - PC Sie Ekbang' },
    ]
  },
  {
    id: 'user-kesos-01',
    username: 'kesos',
    password: 'kesos123',
    name: 'Ibu Kasi Kesos',
    role: 'kesos',
    roleTitle: 'Sie Kesejahteraan Sosial',
    nip: '19850614 201001 2 015',
    jabatan: 'Kepala Seksi Kesejahteraan Sosial',
    loginHistory: [
      { timestamp: '16 Okt 2026, 07:55 WIB', ip: '192.168.1.34', device: 'Firefox - PC Sie Kesos' },
      { timestamp: '15 Okt 2026, 08:10 WIB', ip: '192.168.1.34', device: 'Firefox - PC Sie Kesos' },
      { timestamp: '14 Okt 2026, 08:45 WIB', ip: '192.168.1.34', device: 'Firefox - PC Sie Kesos' },
      { timestamp: '13 Okt 2026, 09:12 WIB', ip: '192.168.1.34', device: 'Firefox - PC Sie Kesos' },
      { timestamp: '10 Okt 2026, 08:00 WIB', ip: '192.168.1.34', device: 'Firefox - PC Sie Kesos' },
    ]
  }
];

export function findUserByUsername(username: string): User | undefined {
  return DEMO_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return DEMO_USERS.find(u => u.id === id);
}

export function findUserByRole(role: string): User | undefined {
  return DEMO_USERS.find(u => u.role === role);
}
