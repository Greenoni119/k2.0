import type { Metadata } from 'next';
import { Courier_Prime } from 'next/font/google';
import './globals.css';
import ClientProviders from '../components/ClientProviders';
import { headers } from 'next/headers';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current path to check if we're in admin section
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminPage = pathname.startsWith('/admin');

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
        {isAdminPage ? (
          children
        ) : (
          <ClientProviders>
            {children}
          </ClientProviders>
        )}
      </body>
    </html>
  );
}
