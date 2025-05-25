'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
  const { openCart, items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      padding: '20px',
      zIndex: 50
    }}>
      <button 
        onClick={() => openCart()}
        style={{
          fontSize: '14px',
          color: 'black',
          textDecoration: 'none',
          fontFamily: 'Courier Prime, monospace',
          background: 'none',
          border: 'none',
          paddingTop: '40px',
          cursor: 'pointer'
        }}
      >
        Cart {mounted && totalQuantity > 0 ? `(${totalQuantity})` : ''}
      </button>
    </div>
  );
}
