'use client';

import CartButton from './CartButton';
import Navigation from './Navigation';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CartButton />
      <Navigation />
      {children}
    </>
  );
}
