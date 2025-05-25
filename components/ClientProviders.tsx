'use client';

import CartButton from '@/components/CartButton';
import { usePathname } from 'next/navigation';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {children}
      {!isAdminPage && <CartButton />}
    </>
  );
}
