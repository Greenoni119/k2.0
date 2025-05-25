'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Category } from '@/utils/supabase';
import CategoryForm from '@/components/CategoryForm';

export default function CategoriesPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;
        if (!session) {
          router.push('/admin/login');
          return;
        }
        fetchCategories();
      } catch (err: any) {
        console.error('Auth error:', err);
        setError('Authentication error: ' + err.message);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched categories:', data); // Debug log
      setCategories(data || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Are you sure you want to delete ${category.name}?`)) {
      return;
    }

    try {
      // Delete the image from storage if it exists
      if (category.image_url) {
        const imagePath = category.image_url.split('/').pop();
        if (imagePath) {
          const { error: storageError } = await supabase.storage
            .from('category-images')
            .remove([imagePath]);
          
          if (storageError) throw storageError;
        }
      }

      // Delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      fetchCategories();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      alert('Error deleting category: ' + err.message);
    }
  };

  if (loading) {
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
          Categories
        </h1>
        <p style={{ 
          fontFamily: 'Courier Prime, monospace',
          fontSize: '14px'
        }}>
          Loading categories...
        </p>
      </div>
    );
  }

  if (error) {
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
          Categories
        </h1>
        <p style={{ 
          fontFamily: 'Courier Prime, monospace',
          fontSize: '14px',
          color: 'red'
        }}>
          Error: {error}
        </p>
        <button
          onClick={fetchCategories}
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
          Retry
        </button>
      </div>
    );
  }

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
        Categories
      </h1>
      
      {!showForm && !editingCategory && (
        <button
          onClick={() => setShowForm(true)}
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
          Add New Category
        </button>
      )}

      {(showForm || editingCategory) && (
        <div style={{ marginBottom: '40px' }}>
          <CategoryForm 
            initialData={editingCategory || undefined}
            onSuccess={() => {
              setShowForm(false);
              setEditingCategory(null);
              fetchCategories();
            }} 
          />
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {categories.length === 0 ? (
          <p style={{ 
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            gridColumn: '1 / -1',
            textAlign: 'center'
          }}>
            No categories yet. Click "Add New Category" to create one.
          </p>
        ) : (
          categories.map((category) => (
            <div 
              key={category.id}
              style={{
                border: '1px solid #eee',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <img 
                src={category.image_url}
                alt={category.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '16px' }}>
                <h3 style={{ 
                  fontFamily: 'Courier Prime, monospace',
                  fontSize: '16px',
                  marginBottom: '16px'
                }}>
                  {category.name}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px'
                }}>
                  <button
                    onClick={() => setEditingCategory(category)}
                    style={{ 
                      backgroundColor: '#C8B098',
                      color: 'white',
                      padding: '4px 12px',
                      fontFamily: 'Courier Prime, monospace',
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    style={{ 
                      backgroundColor: '#ff4444',
                      color: 'white',
                      padding: '4px 12px',
                      fontFamily: 'Courier Prime, monospace',
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
