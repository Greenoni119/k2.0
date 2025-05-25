import type { Metadata } from 'next';
import { Courier_Prime } from 'next/font/google';
import './globals.css';
import ClientProviders from '../components/ClientProviders';

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-courier-prime',
});

export const metadata = {
  title: 'K2',
  description: 'Discover unique items for your home',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${courierPrime.variable} ${courierPrime.className}`}>
        <div style={{ 
          width: '100%', 
          height: '20px', 
          backgroundColor: '#C8B098',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 5
        }} />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
