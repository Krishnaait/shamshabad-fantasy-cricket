import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  console.log('[Context] Creating context');
  console.log('[Context] Cookies:', opts.req.cookies);
  console.log('[Context] Cookie header:', opts.req.headers.cookie);

  try {
    user = await sdk.authenticateRequest(opts.req);
    console.log('[Context] Authenticated user:', user ? `${user.email} (${user.id})` : 'null');
  } catch (error) {
    console.log('[Context] Authentication error:', error);
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
