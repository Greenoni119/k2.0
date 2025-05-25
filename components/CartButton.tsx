'use client';

import { useState, useEffect } from 'react';
import { useCart, CartItem } from '@/hooks/useCart';
import Cart from './Cart';

export default function CartButton() {

  const [mounted, setMounted] = useState(false);
  const { items, isOpen, setIsOpen, addItem } = useCart();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cart');
        if (stored) {
          const storedItems = JSON.parse(stored) as CartItem[];
          if (storedItems.length > 0 && items.length === 0) {
            // Only restore items if cart is empty
            storedItems.forEach((item: CartItem) => {
              addItem(item);
            });
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, [addItem, items.length]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        padding: '20px',
        zIndex: 50
      }}>
        <button 
          onClick={() => setIsOpen(true)}
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
          {items.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#C8B098',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontFamily: 'Courier Prime, monospace'
            }}>
              {items.length}
            </div>
          )}
        </button>
      </div>
      <Cart />
    </>
  );
}
