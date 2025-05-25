import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
  },
  global: {
    headers: {
      'x-my-custom-header': 'k2-ecommerce'
    }
  }
});

// Helper function to retry Supabase requests with exponential backoff
export async function retryWithBackoff<T>(operation: () => Promise<{ data: T | null; error: any }>, maxRetries = 3): Promise<{ data: T | null; error: any }> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // Check if it's a rate limit error
      if (error?.message?.includes('rate limit') || error?.code === 429) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000); // Max 10 second delay
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // If it's not a rate limit error, throw immediately
    }
  }
  throw lastError;
}

// Types for our database tables
export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  created_at: string;
};

export type ProductImage = {
  id: string;
  url: string;
  product_id: string;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  size_type: 'pants' | 'dresses' | 'shoes' | 'tops';
  available_sizes: string[];
  created_at: string;
  category?: Category;
  product_images?: ProductImage[];
};
