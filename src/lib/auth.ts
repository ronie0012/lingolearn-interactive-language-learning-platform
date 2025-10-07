import { betterAuth } from "better-auth";
import { db } from "@/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
import { NextRequest } from "next/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 attempts per minute
  },
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  advanced: {
    database: {
      generateId: () => {
        // Generate a secure random ID for users using crypto
        return crypto.randomUUID();
      },
    },
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
    },
  },
  trustedOrigins: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXT_PUBLIC_SITE_URL].filter(Boolean)
    : ["http://localhost:3000", "http://localhost:3001"],
});

// Helper function to get current user from request
export async function getCurrentUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie");
    
    let token = null;
    
    // Extract token from Authorization header (Bearer token)
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
    
    // Extract token from cookies if not in Authorization header
    if (!token && cookieHeader) {
      const cookies = cookieHeader.split(";").map(c => c.trim());
      const sessionCookie = cookies.find(c => c.startsWith("better-auth.session_token="));
      if (sessionCookie) {
        token = sessionCookie.split("=")[1];
      }
    }
    
    if (!token) {
      return null;
    }
    
    // Verify the session token
    const session = await db.query.session.findFirst({
      where: (sessions, { eq }) => eq(sessions.token, token),
      with: {
        user: true,
      },
    });
    
    if (!session || !session.user) {
      return null;
    }
    
    // Check if session is expired
    if (session.expiresAt < new Date()) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}