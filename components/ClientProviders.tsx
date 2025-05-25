'use client';

import CartButton from '@/components/CartButton';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartButton />
    </>
  );
}
