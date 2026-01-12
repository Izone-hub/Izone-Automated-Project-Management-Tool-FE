import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  const protectedPaths = ['/dashboard', '/workspace', '/boards', '/projects', '/settings', '/members'];

  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Debug logging
  console.log('[Middleware] Path:', request.nextUrl.pathname);
  console.log('[Middleware] Is Protected:', isProtected);
  console.log('[Middleware] Has Token:', !!token);

  if (isProtected && !token) {
    console.log('[Middleware] Redirecting to login - no token found');
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workspace/:path*',
    '/boards/:path*',
    '/projects/:path*',
    '/settings/:path*',
    '/members/:path*'
  ]
};
