import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Always allow static files / images / favicon
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Allow login page without auth
  if (pathname === '/Login') {
    return NextResponse.next();
  }

  // 3️⃣ From here, we are dealing with protected pages like /analytics

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // No token → redirect to login
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  // Optional: validate token with backend
  try {
    const response = await fetch('https://apps.ekarigar.com/backend/admin/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.status === 401) {
      // Invalid/expired token → redirect to login
      return NextResponse.redirect(new URL('/Login', request.url));
    }
  } catch (error) {
    // Backend unreachable → treat as unauthenticated
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  // Token valid → continue to page
  return NextResponse.next();
}

// Only run middleware for pages you want to protect
export const config = {
  matcher: [
    '/analytics/:path*', // protect analytics
    // add more protected routes here, e.g. '/dashboard/:path*'
  ],
};
