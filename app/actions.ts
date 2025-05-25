'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Category, Product } from '@/utils/supabase';

export async function getCategoryData(slug: string): Promise<{ category: Category; products: Product[] } | null> {
  const supabase = createServerComponentClient({ cookies });

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    return null;
  }

  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      product_images (url)
    `)
    .eq('category_id', category.id)
    .order('created_at', { ascending: true });

  return {
    category,
    products: products || []
  };
}
