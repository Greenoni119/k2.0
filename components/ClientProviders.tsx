'use client';

import { CartProvider } from '@/context/CartContext';
import CartWrapper from '@/components/CartWrapper';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartWrapper />
    </CartProvider>
  );
}
