'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Category, Product } from '@/utils/supabase';

type ProductFormProps = {
  onSuccess: () => void;
  initialData?: Product;
};

export default function ProductForm({ onSuccess, initialData }: ProductFormProps) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price?.toString() || '',
    category_id: initialData?.category_id || '',
    description: initialData?.description || '',
    size_type: initialData?.size_type || 'none',
    available_sizes: initialData?.available_sizes || [],
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Size options
  const sizeTypes = [
    { value: 'none', label: 'No Size' },
    { value: 'pants', label: 'Pants Sizes' },
    { value: 'dresses', label: 'Dress Sizes' },
    { value: 'shoes', label: 'Shoe Sizes' },
    { value: 'tops', label: 'Top Sizes' },
  ];

  const sizeOptions = {
    pants: ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28'],
    dresses: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    shoes: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
    tops: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);

      // Set default category if none selected
      if (!formData.category_id && data && data.length > 0) {
        setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Error loading categories: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let image_url = initialData?.image_url || null;

      // Handle image upload if a new image is selected
      if (selectedImage) {
        try {
          // First check if the bucket exists
          // Try to upload directly to the product-images bucket
          const fileExt = selectedImage.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          
          console.log('Attempting to upload to product-images bucket...');
          const { error: uploadError, data } = await supabase.storage
            .from('product-images')
            .upload(fileName, selectedImage);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(`Image upload failed: ${uploadError.message}`);
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          image_url = publicUrl;
          console.log('Successfully uploaded image:', image_url);
        } catch (uploadError: any) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      // Save product data
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        category_id: formData.category_id,
        description: formData.description,
        image_url,
        size_type: formData.size_type,
        available_sizes: formData.size_type === 'none' ? [] : formData.available_sizes,
      };

      if (initialData?.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError('Error saving product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.includes(size)
        ? prev.available_sizes.filter(s => s !== size)
        : [...prev.available_sizes, size]
    }));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      <h2 style={{ 
        fontFamily: 'Courier Prime, monospace',
        fontSize: '20px',
        marginBottom: '20px'
      }}>
        {initialData ? 'Edit Product' : 'Add New Product'}
      </h2>

      {error && (
        <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Product Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'Courier Prime, monospace'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Price
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.price}
          onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'Courier Prime, monospace'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Category
        </label>
        <select
          value={formData.category_id}
          onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'Courier Prime, monospace'
          }}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Size Type
        </label>
        <select
          value={formData.size_type}
          onChange={e => setFormData(prev => ({ 
            ...prev, 
            size_type: e.target.value,
            available_sizes: [] // Reset sizes when type changes
          }))}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'Courier Prime, monospace'
          }}
        >
          {sizeTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {formData.size_type !== 'none' && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Select Available Sizes
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
            gap: '8px'
          }}>
            {sizeOptions[formData.size_type as keyof typeof sizeOptions]?.map(size => (
              <label
                key={size}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: formData.available_sizes.includes(size) ? '#C8B098' : 'transparent',
                  color: formData.available_sizes.includes(size) ? 'white' : 'inherit'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.available_sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  style={{ display: 'none' }}
                />
                {size}
              </label>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '100px',
            fontFamily: 'Courier Prime, monospace'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Image
        </label>
        {initialData?.image_url && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{ marginBottom: '8px', fontSize: '14px' }}>Current image:</p>
            <img
              src={initialData.image_url}
              alt="Current product image"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '12px'
              }}
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'Courier Prime, monospace'
          }}
        />
        <p style={{ 
          marginTop: '8px', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          {initialData ? 'Upload a new image to replace the current one' : 'Choose an image for the product'}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: '#C8B098',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          fontFamily: 'Courier Prime, monospace'
        }}
      >
        {loading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  );
}
