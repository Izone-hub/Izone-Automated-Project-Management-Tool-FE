import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for the auth_token cookie
  const token = request.cookies.get('auth_token')?.value

  // Define paths that require authentication
  const protectedPaths = [
    '/dashboard',
    '/workspace',
    '/boards',
    '/projects',
    '/settings',
    '/members'
  ]

  // Check if current path starts with any protected path
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtected) {
    // If no token is found, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      // Optional: Add redirect param to return after login
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  // Run middleware on these paths
  matcher: [
    '/dashboard/:path*',
    '/workspace/:path*',
    '/boards/:path*',
    '/projects/:path*',
    '/settings/:path*',
    '/members/:path*'
  ]
}