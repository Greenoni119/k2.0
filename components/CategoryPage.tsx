'use client';

import { useEffect, useState } from 'react';
import type { Category, Product } from '@/utils/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function CategoryPageContent({
  slug
}: {
  slug: string;
}) {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const decodedSlug = decodeURIComponent(slug);
        const response = await fetch(`/api/categories/${decodedSlug}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          } else {
            setError(data.error || 'Failed to load data');
          }
          return;
        }

        setCategory(data.category);
        setProducts(data.products || []);
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '16px'
        }}>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '16px',
          color: 'red'
        }}>{error}</p>
      </main>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <main style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontFamily: 'Courier Prime, monospace',
        fontSize: '36px',
        marginBottom: '40px',
        textTransform: 'lowercase'
      }}>
        {category.name}
      </h1>

      {products.length === 0 ? (
        <p style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '16px'
        }}>No products in this category yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '40px',
          width: '100%'
        }}>
          {products.map((product) => (
            <div 
              key={product.id}
              style={{
                position: 'relative',
                aspectRatio: '1',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5'
              }}
            >
              {product.product_images?.[0] && (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={product.product_images[0].url}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: '#fff'
              }}>
                <h2 style={{
                  fontFamily: 'Courier Prime, monospace',
                  fontSize: '24px',
                  margin: '0 0 8px 0'
                }}>
                  {product.name}
                </h2>
                <p style={{
                  fontFamily: 'Courier Prime, monospace',
                  fontSize: '16px',
                  margin: 0
                }}>
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
