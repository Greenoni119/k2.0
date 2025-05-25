'use client';

import { useCart } from '@/hooks/useCart';
import { getStripe } from '@/lib/stripe';
import { useState } from 'react';

export default function CheckoutButton() {
  const { items } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            images: item.images
          })),
          returnUrl: window.location.origin,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error in checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || items.length === 0}
      style={{
        backgroundColor: '#C8B098',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        width: '100%',
        fontFamily: 'var(--font-courier-prime), monospace',
        cursor: items.length > 0 ? 'pointer' : 'not-allowed',
        opacity: items.length > 0 ? 1 : 0.5,
      }}
    >
      {isLoading ? 'Processing...' : 'Checkout'}
    </button>
  );
}
