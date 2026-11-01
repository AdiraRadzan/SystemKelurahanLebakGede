import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Sistem Aplikasi Satu Data Kelurahan Lebakgede - Kota Bandung',
  description: 'Aplikasi Satu Data Kelurahan Lebakgede, Kecamatan Coblong, Kota Bandung',
  icons: {
    icon: '/logo-lebakgede.png',
    shortcut: '/logo-lebakgede.png',
    apple: '/logo-lebakgede.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased text-[16px]">
        {children}
      </body>
    </html>
  );
}
