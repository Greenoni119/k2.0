import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', params.slug)
      .single();

    if (categoryError || !category) {
      return new NextResponse(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        product_images (url)
      `)
      .eq('category_id', category.id)
      .order('created_at', { ascending: true });

    if (productsError) {
      return new NextResponse(JSON.stringify({ error: 'Failed to load products' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify({ category, products }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
    });
  } catch (error) {
    console.error('Route error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
