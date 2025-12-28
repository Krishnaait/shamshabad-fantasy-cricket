import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(): { ctx: TrpcContext; clearedCookies: any[]; setCookies: any[] } {
  const clearedCookies: any[] = [];
  const setCookies: any[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
      connection: { remoteAddress: "127.0.0.1" },
    } as any,
    res: {
      clearCookie: (name: string, options: any) => {
        clearedCookies.push({ name, options });
      },
      cookie: (name: string, value: string, options: any) => {
        setCookies.push({ name, value, options });
      },
    } as any,
  };

  return { ctx, clearedCookies, setCookies };
}

describe("Authentication System", () => {
  describe("auth.register", () => {
    it("should reject registration for users under 18", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const underageDob = new Date();
      underageDob.setFullYear(underageDob.getFullYear() - 17);
      const dobString = underageDob.toISOString().split("T")[0];

      await expect(
        caller.auth.register({
          email: "underage@test.com",
          password: "Test@1234",
          fullName: "Test User",
          phone: "1234567890",
          dob: dobString,
          state: "Maharashtra",
          city: "Mumbai",
          agreeTerms: true,
        })
      ).rejects.toThrow();
    });

    it("should reject registration from restricted states", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const validDob = new Date();
      validDob.setFullYear(validDob.getFullYear() - 25);
      const dobString = validDob.toISOString().split("T")[0];

      await expect(
        caller.auth.register({
          email: "telangana@test.com",
          password: "Test@1234",
          fullName: "Test User",
          phone: "1234567890",
          dob: dobString,
          state: "Telangana",
          city: "Hyderabad",
          agreeTerms: true,
        })
      ).rejects.toThrow("Restricted state");
    });

    it("should reject weak passwords", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const validDob = new Date();
      validDob.setFullYear(validDob.getFullYear() - 25);
      const dobString = validDob.toISOString().split("T")[0];

      await expect(
        caller.auth.register({
          email: "weak@test.com",
          password: "weak",
          fullName: "Test User",
          phone: "1234567890",
          dob: dobString,
          state: "Maharashtra",
          city: "Mumbai",
          agreeTerms: true,
        })
      ).rejects.toThrow();
    });
  });

  describe("auth.login", () => {
    it("should reject login with invalid credentials", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.auth.login({
          email: "nonexistent@test.com",
          password: "WrongPassword123!",
        })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("auth.logout", () => {
    it("should clear session cookie on logout", async () => {
      const { ctx, clearedCookies } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();

      expect(result.success).toBe(true);
      expect(clearedCookies.length).toBeGreaterThan(0);
      expect(clearedCookies[0]?.options.maxAge).toBe(-1);
    });
  });

  describe("auth.me", () => {
    it("should return null for unauthenticated users", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toBeNull();
    });
  });

  describe("auth.forgotPassword", () => {
    it("should reject password reset with invalid DOB", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.auth.forgotPassword({
          email: "test@test.com",
          dob: "2000-01-01",
          newPassword: "NewPassword123!",
        })
      ).rejects.toThrow();
    });

    it("should reject weak new passwords", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.auth.forgotPassword({
          email: "test@test.com",
          dob: "2000-01-01",
          newPassword: "weak",
        })
      ).rejects.toThrow();
    });
  });
});
