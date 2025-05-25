'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Product = {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image_url: string | null;
  size_type: string;
  available_sizes: string[];
  description: string;
};

type Props = {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function EditProductForm({ product, onSuccess, onCancel }: Props) {
  const supabase = createClientComponentClient();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [sizeType, setSizeType] = useState(product.size_type);
  const [availableSizes, setAvailableSizes] = useState(product.available_sizes);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name,
          price,
          description,
          size_type: sizeType,
          available_sizes: availableSizes,
        })
        .eq('id', product.id);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      maxWidth: '500px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '100px'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="sizeType">Size Type</label>
        <select
          id="sizeType"
          value={sizeType}
          onChange={(e) => setSizeType(e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="none">None</option>
          <option value="letter">Letter (S/M/L)</option>
          <option value="number">Number</option>
        </select>
      </div>

      {sizeType !== 'none' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="sizes">Available Sizes (comma-separated)</label>
          <input
            id="sizes"
            type="text"
            value={availableSizes.join(', ')}
            onChange={(e) => setAvailableSizes(e.target.value.split(',').map(s => s.trim()))}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      )}

      {error && (
        <p style={{ color: 'red', margin: 0 }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          type="submit"
          style={{
            backgroundColor: '#C8B098',
            color: 'white',
            padding: '8px 16px',
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            backgroundColor: '#666',
            color: 'white',
            padding: '8px 16px',
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
