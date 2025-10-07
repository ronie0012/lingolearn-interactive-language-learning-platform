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
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_SITE_URL || "",
  ],
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