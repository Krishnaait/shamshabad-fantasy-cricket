import type { Request } from "express";
import { jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import { getUserById, updateUserLastSignIn } from "../db";
import { COOKIE_NAME } from "../../shared/const";

const JWT_SECRET = process.env.JWT_SECRET || "shamshabad-fantasy-cricket-secret-key-2025";
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * SDK for authentication and user management
 * Supports custom email/password authentication only
 */
export const sdk = {
  /**
   * Authenticate request by checking JWT token in cookies
   */
  async authenticateRequest(req: Request): Promise<User | null> {
    try {
      const token = req.cookies?.[COOKIE_NAME];

      if (!token) {
        console.log("[SDK Auth] No auth token found in cookies");
        return null;
      }

      // Verify JWT token
      const verified = await jwtVerify(token, secret);
      const payload = verified.payload as any;

      if (!payload.userId) {
        console.log("[SDK Auth] ⚠️ Token payload does not have userId");
        return null;
      }

      // Get user from database
      const user = await getUserById(payload.userId);

      if (!user) {
        console.log(`[SDK Auth] User not found: ${payload.userId}`);
        return null;
      }

      // Update last signed in timestamp
      try {
        await updateUserLastSignIn(user.id);
      } catch (error) {
        console.log("[SDK Auth] Could not update lastSignedIn:", error);
        // Continue anyway - this is not critical
      }

      console.log(`[SDK Auth] ✅ Authenticated user: ${user.email}`);
      return user;
    } catch (error) {
      console.log("[SDK Auth] Error authenticating request:", error);
      return null;
    }
  },

  /**
   * Create a session token for a user
   */
  async createSessionToken(userId: string): Promise<string> {
    const payload = {
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };

    const token = await new (await import("jose")).SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    return token;
  },
};
