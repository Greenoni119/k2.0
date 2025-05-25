'use client';

import Cart from '@/components/Cart';
import { useCart } from '@/context/CartContext';

export default function CartWrapper() {
  const { isOpen, closeCart, items, updateQuantity, removeItem } = useCart();
  return (
    <Cart
      isOpen={isOpen}
      onClose={closeCart}
      items={items}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
    />
  );
}
