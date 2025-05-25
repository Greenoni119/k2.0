'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      // On successful login, redirect to admin
      router.push('/admin');
      router.refresh();
    } catch (error: any) {
      console.error('Caught error:', error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
      <div 
        style={{ 
          width: '400px',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '32px'
        }}
      >
        <h2 
          style={{ 
            fontFamily: 'Courier Prime, monospace',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          K2 Admin
        </h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label 
              style={{ 
                display: 'block',
                marginBottom: '8px',
                fontFamily: 'Courier Prime, monospace',
                fontSize: '14px'
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#F5F7FB',
                fontFamily: 'Courier Prime, monospace',
                fontSize: '14px',
                border: 'none',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label 
              style={{ 
                display: 'block',
                marginBottom: '8px',
                fontFamily: 'Courier Prime, monospace',
                fontSize: '14px'
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#F5F7FB',
                fontFamily: 'Courier Prime, monospace',
                fontSize: '14px',
                border: 'none',
                outline: 'none'
              }}
            />
          </div>

          {message && (
            <div style={{ 
              textAlign: 'center', 
              fontSize: '12px', 
              color: '#dc2626',
              marginBottom: '16px'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '8px',
              backgroundColor: '#C8B098',
              fontFamily: 'Courier Prime, monospace',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
