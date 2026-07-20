import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { SocketProvider } from '@/providers/socket-provider';
import { FCMInit } from '@/components/shared/fcm-init';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Omnidrop — Hyperlocal Marketplace',
  description: 'Get groceries, essentials, and more delivered from local stores in minutes. Discover nearby shops, track your delivery live.',
  keywords: ['grocery delivery', 'hyperlocal', 'marketplace', 'quick commerce', 'local stores'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
            <FCMInit />
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
