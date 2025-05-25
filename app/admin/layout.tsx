'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname]);

  // If we're on the login page, only render the children without the admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/admin/login');
    } catch (err: any) {
      console.error('Error logging out:', err);
      alert('Error logging out: ' + err.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '200px', 
        borderRight: '1px solid #eee',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <Link 
            href="/admin" 
            style={{ 
              fontFamily: 'Courier Prime, monospace',
              fontSize: '16px',
              display: 'block',
              marginBottom: '40px',
              color: '#000',
              textDecoration: 'none'
            }}
          >
            K2 Admin
          </Link>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href="/admin"
              style={{ 
                fontFamily: 'Courier Prime, monospace',
                fontSize: '14px',
                color: pathname === '/admin' ? '#C8B098' : '#000',
                textDecoration: 'none'
              }}
            >
              Products
            </Link>
            <Link
              href="/admin/categories"
              style={{ 
                fontFamily: 'Courier Prime, monospace',
                fontSize: '14px',
                color: pathname === '/admin/categories' ? '#C8B098' : '#000',
                textDecoration: 'none'
              }}
            >
              Categories
            </Link>
            <Link
              href="/admin/settings"
              style={{ 
                fontFamily: 'Courier Prime, monospace',
                fontSize: '14px',
                color: pathname === '/admin/settings' ? '#C8B098' : '#000',
                textDecoration: 'none'
              }}
            >
              Settings
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{ 
            backgroundColor: '#C8B098',
            color: 'white',
            padding: '8px 16px',
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            border: 'none',
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            opacity: isLoggingOut ? 0.7 : 1
          }}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '40px' }}>
        {children}
      </div>
    </div>
  );
}
