import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, UserRole } from "@/lib/auth-utils";

// Define route permissions
const ROUTE_PERMISSIONS = {
  '/dashboard': { roles: [UserRole.USER, UserRole.PREMIUM, UserRole.INSTRUCTOR, UserRole.ADMIN] },
  '/profile': { roles: [UserRole.USER, UserRole.PREMIUM, UserRole.INSTRUCTOR, UserRole.ADMIN] },
  '/chatbot': { roles: [UserRole.PREMIUM, UserRole.INSTRUCTOR, UserRole.ADMIN] },
  '/admin': { roles: [UserRole.ADMIN] },
  '/instructor': { roles: [UserRole.INSTRUCTOR, UserRole.ADMIN] },
  '/api/admin': { roles: [UserRole.ADMIN] },
  '/api/instructor': { roles: [UserRole.INSTRUCTOR, UserRole.ADMIN] },
} as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route needs protection
  const routeConfig = Object.entries(ROUTE_PERMISSIONS).find(([route]) => 
    pathname.startsWith(route)
  );
  
  if (!routeConfig) {
    return NextResponse.next();
  }
  
  const [, config] = routeConfig;
  const user = await getCurrentUser(request);
  
  // Redirect to login if not authenticated
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Check role permissions
  if (!config.roles.includes(user.role)) {
    // For API routes, return JSON error
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        error: 'Insufficient permissions',
        code: 'FORBIDDEN',
        required: config.roles,
        current: user.role
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // For page routes, redirect to unauthorized page
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  // Add user info to headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.id);
  requestHeaders.set('x-user-role', user.role);
  requestHeaders.set('x-user-email', user.email);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Protect dashboard and profile
    '/dashboard/:path*',
    '/profile/:path*',
    // Premium features
    '/chatbot/:path*',
    // Admin areas
    '/admin/:path*',
    '/instructor/:path*',
    // API routes that need protection
    '/api/admin/:path*',
    '/api/instructor/:path*',
    '/api/user/:path*',
  ],
};
