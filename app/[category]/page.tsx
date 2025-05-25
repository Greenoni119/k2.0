'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PublicLayout from '@/components/PublicLayout';
import { useEffect, useState } from 'react';

type Props = {
  params: { category: string };
};

type Product = {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image_url: string | null;
  size_type: string;
  available_sizes: string[];
  description: string;
  created_at: string;
};

export default function Page({ params }: Props) {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // First get the category ID
        const { data: categories, error: categoryError } = await supabase
          .from('categories')
          .select('id, name, slug')
          .eq('slug', params.category)
          .single();

        if (categoryError) throw categoryError;

        console.log('Category search:', {
          searchTerm: params.category,
          result: categories
        });

        // Get all products in this category
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categories.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        setProducts(products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.category, supabase]);

  return (
    <PublicLayout>
      <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <h1 style={{
        fontSize: '24px',
        marginBottom: '40px',
        fontFamily: 'Courier Prime, monospace'
      }}>
        {params.category.toLowerCase()}
      </h1>

      {loading ? (
        <div style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '14px'
        }}>
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '14px'
        }}>
          No products found in this category
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {products.map(product => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              {product.image_url && (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '100%',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              <div style={{ 
                padding: '0 4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '14px',
                  fontFamily: 'Courier Prime, monospace'
                }}>
                  {product.name.toLowerCase()}
                </h3>
                <p style={{ 
                  margin: 0,
                  fontSize: '14px',
                  fontFamily: 'Courier Prime, monospace',
                  color: '#666'
                }}>
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
    </PublicLayout>
  );
}
