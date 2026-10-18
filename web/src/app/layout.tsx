import { FCMInit } from '@/components/shared/fcm-init';
import { AuthProvider } from '@/providers/auth-provider';
import { SocketProvider } from '@/providers/socket-provider';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata: Metadata = {
  title: 'Omnidrop — Hyperlocal Marketplace',
  description:
    'Get groceries, essentials, and more delivered from local stores in minutes. Discover nearby shops, track your delivery live.',
  keywords: ['grocery delivery', 'hyperlocal', 'marketplace', 'quick commerce', 'local stores'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.png',
    apple: '/icon.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={manrope.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{const t=localStorage.getItem('omnidrop-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}",
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
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
