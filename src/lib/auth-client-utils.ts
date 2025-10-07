"use client"

// User roles enum (client-safe)
export enum UserRole {
  USER = 'user',
  PREMIUM = 'premium', 
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}

// Permission definitions (client-safe)
export const PERMISSIONS = {
  // Course permissions
  COURSES_READ: [UserRole.USER, UserRole.PREMIUM, UserRole.INSTRUCTOR, UserRole.ADMIN],
  COURSES_WRITE: [UserRole.INSTRUCTOR, UserRole.ADMIN],
  COURSES_DELETE: [UserRole.ADMIN],
  
  // User management
  USERS_READ: [UserRole.ADMIN],
  USERS_WRITE: [UserRole.ADMIN],
  USERS_DELETE: [UserRole.ADMIN],
  
  // Premium features
  PREMIUM_FEATURES: [UserRole.PREMIUM, UserRole.INSTRUCTOR, UserRole.ADMIN],
  AI_CHATBOT: [UserRole.PREMIUM, UserRole.INSTRUCTOR, UserRole.ADMIN],
  
  // Admin features
  ADMIN_PANEL: [UserRole.ADMIN],
  ANALYTICS: [UserRole.INSTRUCTOR, UserRole.ADMIN],
} as const;

// Check if user has specific permission (client-safe)
export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

// Client-side role checking utility
export function canAccess(userRole: UserRole | undefined, permission: keyof typeof PERMISSIONS): boolean {
  if (!userRole) return false;
  return hasPermission(userRole, permission);
}