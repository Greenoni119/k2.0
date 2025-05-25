'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Product } from '@/utils/supabase';
import dynamic from 'next/dynamic';

const PublicLayout = dynamic(() => import('@/components/PublicLayout'), {
  ssr: false
});

type Props = {
  params: { id: string };
};

export default function ProductPage({ params }: Props) {
  const supabase = createClientComponentClient();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(data);
        if (data?.available_sizes?.length > 0) {
          setSelectedSize(data.available_sizes[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  if (loading) {
    return (
      <PublicLayout>
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
        }}>
          Loading...
        </main>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
        }}>
          Product not found
        </main>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Product Image */}
        <div style={{
          backgroundColor: '#f5f5f5',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
        </div>

        {/* Product Details */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontFamily: 'Courier Prime, monospace'
          }}>
            {product.name}
          </h1>

          <p style={{
            margin: 0,
            fontSize: '20px',
            fontFamily: 'Courier Prime, monospace'
          }}>
            ${product.price.toFixed(2)}
          </p>

          {product.available_sizes?.length > 0 && (
            <div>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontFamily: 'Courier Prime, monospace'
              }}>
                size:
              </p>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {product.available_sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #ddd',
                      backgroundColor: selectedSize === size ? '#C8B098' : 'transparent',
                      color: selectedSize === size ? 'white' : 'inherit',
                      cursor: 'pointer',
                      fontFamily: 'Courier Prime, monospace',
                      fontSize: '14px'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontFamily: 'Courier Prime, monospace'
            }}>
              quantity:
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button
                onClick={() => handleQuantityChange(-1)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #ddd',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                -
              </button>
              <span style={{
                fontFamily: 'Courier Prime, monospace',
                fontSize: '16px',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid #ddd',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              if (!selectedSize && product.available_sizes?.length > 0) {
                alert('Please select a size');
                return;
              }
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                size: selectedSize || 'one size',
                image_url: product.image_url || ''
              });
            }}
            style={{
              backgroundColor: '#C8B098',
              color: 'white',
              border: 'none',
              padding: '16px',
              width: '100%',
              cursor: 'pointer',
              fontFamily: 'Courier Prime, monospace',
              fontSize: '16px',
              marginTop: '8px'
            }}
          >
            add to cart
          </button>

          {product.description && (
            <div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontFamily: 'Courier Prime, monospace'
              }}>
                details
              </h2>
              <p style={{
                margin: 0,
                fontSize: '14px',
                fontFamily: 'Courier Prime, monospace',
                color: '#666',
                lineHeight: 1.5
              }}>
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
    </PublicLayout>
  );
}
