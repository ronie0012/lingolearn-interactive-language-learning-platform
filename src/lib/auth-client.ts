
"use client"
import { createAuthClient } from "better-auth/react"
import { UserRole } from "./auth-client-utils"

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
});

// Extended user type with role information
export interface ExtendedUser {
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

export interface ExtendedSession {
  user: ExtendedUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

// Use the built-in better-auth hooks
export const useSession = authClient.useSession;
export const useSignUp = authClient.useSignUp;
export const useSignIn = authClient.useSignIn;
export const useSignOut = authClient.useSignOut;

// Export the auth client for other operations
export { authClient as auth };
