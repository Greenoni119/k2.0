'use client';

import { useState, useEffect } from 'react';
import { supabase, retryWithBackoff } from '@/utils/supabase';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const PublicLayout = dynamic(() => import('../components/PublicLayout'), {
  ssr: false
});

type Category = {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  description: string;
  slug: string;
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await retryWithBackoff(async () => {
          return await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });
        });

        if (error) {
          console.error('Error fetching categories:', error);
          setError(error.message);
          return;
        }

        console.log('Fetched categories:', data);
        setCategories(data as Category[]); // Cast data to Category[]
      } catch (error) {
        console.error('Error in fetchCategories:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <PublicLayout>
      <main
        style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <Image
            src="/logo.png"
            alt="K2 Logo"
            width={220}
            height={120}
            priority
          />
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '48px',
          fontFamily: 'Courier Prime, monospace'
        }}>
          Discover unique items for your home that will make you (and even your house) feel special
        </p>

        {/* Hero Image */}
        <div className="w-full max-w-4xl mb-12">
          <Image
            src="/cactus.jpg"
            alt="Desert landscape with cacti"
            width={800}
            height={400}
            priority
            className="w-full h-auto grayscale"
          />
        </div>

        {/* Navigation */}
        <div style={{
          width: '100%',
          borderBottom: '1px solid #000',
          marginBottom: '48px'
        }}>
          <nav style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            marginBottom: '16px',
            width: '100%'
          }}>
            <Link 
              href="/about"
              style={{
                fontSize: '14px',
                color: 'black',
                textDecoration: 'none',
                fontFamily: 'Courier Prime, monospace'
              }}
            >
              About
            </Link>
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/${category.slug}`}
                style={{
                  fontSize: '14px',
                  color: 'black',
                  textDecoration: 'none',
                  fontFamily: 'Courier Prime, monospace'
                }}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Shop By Category Section */}
        <section style={{
          width: '100%',
          marginTop: '32px'
        }}>
          <h2 style={{
            fontSize: '25px',
            marginBottom: '32px',
            fontFamily: 'Courier Prime, monospace',
            textAlign: 'center',
            fontWeight: 'lighter'
          }}>
            Shop By Category
          </h2>
          
          {loading && (
            <p style={{ textAlign: 'center', fontFamily: 'Courier Prime, monospace' }}>
              Loading categories...
            </p>
          )}
          
          {error && (
            <p style={{ textAlign: 'center', color: 'red', fontFamily: 'Courier Prime, monospace' }}>
              {error}
            </p>
          )}
          
          {!loading && !error && categories.length === 0 && (
            <p style={{ textAlign: 'center', fontFamily: 'Courier Prime, monospace' }}>
              No categories found.
            </p>
          )}
          
          {!loading && !error && categories.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '32px',
              width: '100%',
              maxWidth: '1100px',
              margin: '0 auto'
            }}>
              {categories.map(category => (
                <Link 
                  key={category.id} 
                  href={`/${category.slug}`}
                  style={{
                    position: 'relative',
                    display: 'block',
                    aspectRatio: '4/5',
                    overflow: 'hidden'
                  }}
                >
                  <Image 
                    src={category.image_url}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))'
                  }}>
                    <h3 style={{
                      fontFamily: 'Courier Prime, monospace',
                      fontSize: '40px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#fff',
                      margin: 0
                    }}>
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </PublicLayout>
  );
}
