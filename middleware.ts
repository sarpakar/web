import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/feed',
  '/fridge',
  '/profile',
  '/community',
  '/communities',
  '/notifications',
  '/settings',
  '/explore',
  '/search',
  '/meetups',
  '/challenges',
  '/log-meal',
  '/map',
];

// Routes that should redirect authenticated users to feed
const authRoutes = ['/landing', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Check for session cookie (set after Firebase sign-in)
  const sessionCookie = request.cookies.get('__session')?.value;
  const hasSession = !!sessionCookie;

  // Handle root path - redirect based on session
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = hasSession ? '/feed' : '/landing';
    return NextResponse.redirect(url);
  }

  // Check if trying to access a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if trying to access an auth route (landing/login)
  const isAuthRoute = authRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If accessing protected route without session, redirect to landing
  if (isProtectedRoute && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/landing';
    // Store the intended destination for redirect after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If accessing auth routes with session, redirect to feed
  if (isAuthRoute && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/feed';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (files in public folder)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
