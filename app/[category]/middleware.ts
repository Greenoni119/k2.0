import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const categorySlug = pathname.split('/')[1];
  
  if (categorySlug) {
    const url = request.nextUrl.clone();
    url.searchParams.set('category', categorySlug);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:category*',
};
