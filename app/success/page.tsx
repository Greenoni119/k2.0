'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRouter, useSearchParams } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';

export default function SuccessPage() {
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      clearCart();
    } else {
      router.push('/');
    }
  }, [sessionId, clearCart, router]);

  return (
    <PublicLayout>
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          marginBottom: '24px',
          fontFamily: 'var(--font-courier-prime), monospace'
        }}>
          Thank you for your order!
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '32px',
          maxWidth: '500px',
          lineHeight: 1.6,
          fontFamily: 'var(--font-courier-prime), monospace'
        }}>
          We have received your order and will process it shortly.
          You will receive an email confirmation with your order details.
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: '#C8B098',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-courier-prime), monospace',
            fontSize: '14px'
          }}
        >
          Continue Shopping
        </button>
      </div>
    </PublicLayout>
  );
}
