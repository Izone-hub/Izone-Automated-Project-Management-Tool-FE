// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('auth_token')?.value || 
//                 request.headers.get('Authorization')?.replace('Bearer ', '');
  
//   // 🔥 Also check localStorage token (for client-side)
//   const protectedRoutes = ['/dashboard', '/workspace', '/workspace/create'];
  
//   if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
//     if (!token) {
//       // Clear any residual client-side tokens
//       const response = NextResponse.redirect(new URL('/login', request.url));
//       response.cookies.delete('auth_token');
//       return response;
//     }
//   }
  
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/workspace/:path*'],
// };










// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');
  
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/workspace', '/workspace/create'];
  
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/workspace/:path*'],
};