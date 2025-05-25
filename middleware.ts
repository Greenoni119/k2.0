import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const categoryMatch = pathname.match(/^\/([^\/]+)/);
  
  if (categoryMatch && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const categorySlug = categoryMatch[1];
    const url = request.nextUrl.clone();
    url.searchParams.set('category', categorySlug);
    return NextResponse.rewrite(url);
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  // Allow access to login page
  if (request.nextUrl.pathname === '/admin/login') {
    return res;
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}
