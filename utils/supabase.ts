import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
