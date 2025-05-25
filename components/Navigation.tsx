'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { usePathname, useRouter } from 'next/navigation';

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function Navigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('created_at', { ascending: true });
      
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  // Don't show navigation on home or admin pages
  if (pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }

  if (!mounted) return null;

  return (
    <div style={{
      width: '100%',
      borderBottom: '1px solid #000',
      marginBottom: '48px',
      paddingTop: '20px',
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.95)'
    }}>
      <nav style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '24px',
        marginBottom: '16px',
        width: '100%',
        padding: '0 20px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 20
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/logo.png" 
            alt="K2 Logo" 
            width={60} 
            height={40} 
            style={{ objectFit: 'contain' }}
          />
        </Link>
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <button 
          onClick={() => router.push('/about')}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = 'transparent';
          }}
          style={{
            fontSize: '14px',
            color: 'black',
            textDecoration: 'underline',
            fontFamily: 'Courier Prime, monospace',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            padding: '4px 8px',
            background: 'none',
            border: 'none',
            display: 'inline-block'
          }}
        >
          About
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => router.push(`/${category.slug}`)}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = 'transparent';
            }}
            style={{
              fontSize: '14px',
              color: 'black',
              textDecoration: 'underline',
              fontFamily: 'Courier Prime, monospace',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              padding: '4px 8px',
              background: 'none',
              border: 'none',
              display: 'inline-block'
            }}
          >
            {category.name}
          </button>
        ))}
        </div>
      </nav>
    </div>
  );
}
