import { NextRequest } from 'next/server';
import { auth } from './auth';
import { eq } from 'drizzle-orm';

// Re-export client-safe utilities
export { UserRole, PERMISSIONS, hasPermission, canAccess } from './auth-client-utils';
import { UserRole, PERMISSIONS, hasPermission } from './auth-client-utils';

// Server-side only imports (conditional to prevent client-side issues)
let db: any;
let user: any;

if (typeof window === 'undefined') {
  const dbModule = require('@/db');
  const schemaModule = require('@/db/schema');
  db = dbModule.db;
  user = schemaModule.user;
}

// Enhanced user type with role information
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Get current user from request with role information
export async function getCurrentUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Use better-auth to verify session
    const session = await auth.api.getSession({ 
      headers: request.headers 
    });
    
    if (!session?.user) {
      return null;
    }
    
    // Get full user data including role
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });
    
    if (!userData || !userData.isActive) {
      return null;
    }
    
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role as UserRole,
      isActive: userData.isActive,
      emailVerified: userData.emailVerified,
      image: userData.image,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// hasPermission and canAccess are re-exported from auth-client-utils

// Middleware helper for route protection
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser | Response> {
  const user = await getCurrentUser(request);
  
  if (!user) {
    return new Response(JSON.stringify({ 
      error: 'Authentication required',
      code: 'UNAUTHORIZED' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return user;
}

// Middleware helper for role-based protection
export async function requireRole(
  request: NextRequest, 
  requiredRoles: UserRole[]
): Promise<AuthenticatedUser | Response> {
  const user = await getCurrentUser(request);
  
  if (!user) {
    return new Response(JSON.stringify({ 
      error: 'Authentication required',
      code: 'UNAUTHORIZED' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  if (!requiredRoles.includes(user.role)) {
    return new Response(JSON.stringify({ 
      error: 'Insufficient permissions',
      code: 'FORBIDDEN',
      required: requiredRoles,
      current: user.role
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return user;
}

// Middleware helper for permission-based protection
export async function requirePermission(
  request: NextRequest, 
  permission: keyof typeof PERMISSIONS
): Promise<AuthenticatedUser | Response> {
  const user = await getCurrentUser(request);
  
  if (!user) {
    return new Response(JSON.stringify({ 
      error: 'Authentication required',
      code: 'UNAUTHORIZED' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  if (!hasPermission(user.role, permission)) {
    return new Response(JSON.stringify({ 
      error: `Permission denied: ${permission}`,
      code: 'FORBIDDEN',
      userRole: user.role
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return user;
}

// Utility to create API response with proper error handling
export function createAuthError(message: string, code: string, status: number) {
  return new Response(JSON.stringify({ 
    error: message,
    code,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

