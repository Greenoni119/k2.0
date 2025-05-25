'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Category } from '@/utils/supabase';

interface CategoryFormProps {
  onSuccess: () => void;
  initialData?: Category;
}

export default function CategoryForm({ onSuccess, initialData }: CategoryFormProps) {
  const supabase = createClientComponentClient();
  const [name, setName] = useState(initialData?.name || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialData?.image_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      let image_url = initialData?.image_url || '';

      if (file) {
        // Upload image first
        const fileExt = file.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('category-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('category-images')
          .getPublicUrl(fileName);

        image_url = publicUrl;
      }
      
      if (initialData) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({ name, slug, image_url })
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([{ name, slug, image_url }]);
        
        if (error) throw error;
      }

      setName('');
      setFile(null);
      setPreview('');
      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '400px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            htmlFor="name"
            style={{ 
              fontFamily: 'Courier Prime, monospace',
              fontSize: '14px'
            }}
          >
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ 
              padding: '8px 12px',
              border: '1px solid #eee',
              borderRadius: '4px',
              fontFamily: 'Courier Prime, monospace'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="image"
            style={{ 
              fontFamily: 'Courier Prime, monospace',
              fontSize: '14px'
            }}
          >
            Category Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            required={!initialData}
            style={{ 
              fontFamily: 'Courier Prime, monospace',
              fontSize: '14px'
            }}
          />
          {preview && (
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginTop: '8px'
              }} 
            />
          )}
        </div>

        {error && (
          <div style={{ 
            color: 'red',
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ 
            backgroundColor: '#C8B098',
            color: 'white',
            padding: '8px 16px',
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Saving...' : initialData ? 'Update Category' : 'Add New Category'}
        </button>
      </div>
    </form>
  );
}
