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
    <html lang="en" className="dark">
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
