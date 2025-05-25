'use client';

import { useState, useEffect } from 'react';
import ProductForm from '@/components/ProductForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Product } from '@/utils/supabase';



export default function AdminDashboard() {
  const supabase = createClientComponentClient();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;

      // Create a map of category IDs to names
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {} as {[key: string]: string});

      setProducts(products || []);
      setCategories(categoryMap);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{ 
        fontFamily: 'Courier Prime, monospace',
        fontSize: '24px'
      }}>
        Products
      </h1>
      
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products yet. Add your first product!</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {products.map(product => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ddd',
                padding: '16px',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
              )}
              <h3 style={{ margin: 0, fontSize: '18px' }}>{product.name}</h3>
              <p style={{ margin: 0, color: '#666' }}>
                Category: {categories[product.category_id] || 'Unknown'}
              </p>
              <p style={{ margin: 0 }}>${product.price.toFixed(2)}</p>
              {product.available_sizes.length > 0 && (
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Sizes: {product.available_sizes.join(', ')}
                </p>
              )}
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '8px'
              }}>
                <button
                  onClick={() => setEditingProduct(product)}
                  style={{ 
                    backgroundColor: '#C8B098',
                    color: 'white',
                    padding: '4px 12px',
                    fontFamily: 'Courier Prime, monospace',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    flex: 1
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this product?')) {
                      try {
                        const { error } = await supabase
                          .from('products')
                          .delete()
                          .eq('id', product.id);
                        
                        if (error) throw error;
                        fetchProducts();
                      } catch (error) {
                        console.error('Error deleting product:', error);
                        alert('Failed to delete product. Please try again.');
                      }
                    }
                  }}
                  style={{ 
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '4px 12px',
                    fontFamily: 'Courier Prime, monospace',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    flex: 1
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProduct ? (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setEditingProduct(null)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#dc3545',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
            <ProductForm
              initialData={editingProduct}
              onSuccess={() => {
                setEditingProduct(null);
                fetchProducts();
              }}
            />
          </div>
        </div>
      ) : !showProductForm ? (
        <button
          onClick={() => setShowProductForm(true)}
          style={{ 
            backgroundColor: '#C8B098',
            color: 'white',
            padding: '8px 16px',
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          Add New Product
        </button>
      ) : (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowProductForm(false)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#dc3545',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
            <ProductForm 
              onSuccess={() => {
                setShowProductForm(false);
                fetchProducts();
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
