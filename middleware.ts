import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname === '/Login') {
    return NextResponse.next();
  }

  // Handle static files (_next/static, _next/image, favicon.ico)
  if (pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image') || pathname === '/favicon.ico') {
    const token = request.cookies.get('auth_token');
    if (!token) {
      // Allow if referer is login page (to load static files for login)
      const referer = request.headers.get('referer');
      if (referer && referer.includes('/Login')) {
        return NextResponse.next();
      } else {
        // Return 401 if no token and not from login page
        return new NextResponse('Unauthorized', { status: 401 });
      }
    } else {
      // Validate token
      try {
        const response = await fetch('https://apps.ekarigar.com/backend/admin/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) {
          // Token is invalid or expired, return 401
          return new NextResponse('Unauthorized', { status: 401 });
        }
      } catch (error) {
        // If validation fails (e.g., network error), return 401
        return new NextResponse('Unauthorized', { status: 401 });
      }
      // Allow if token is valid
      return NextResponse.next();
    }
  }

  // Check for auth_token cookie for other paths
  const token = request.cookies.get('auth_token');

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  // Validate token by making a request to a protected endpoint
  try {
    const response = await fetch('https://apps.ekarigar.com/backend/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token is invalid or expired, redirect to login
      return NextResponse.redirect(new URL('/Login', request.url));
    }
  } catch (error) {
    // If validation fails (e.g., network error), redirect to login
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  // Allow access if token is valid
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     */
    '/((?!api).*)',
  ],
};
