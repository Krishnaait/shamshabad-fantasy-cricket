import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import {
  createUser,
  getUserByEmail,
  getUserByEmailAndDOB,
  updateUserPassword,
  createSession,
  deleteSession,
  logCompliance,
  getUserWithProfile,
} from "./dbAuth";
import {
  verifyPassword,
  generateToken,
  calculateAge,
  isValidEmail,
  isValidPassword,
  isRestrictedState,
  getClientIP,
} from "./auth";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        fullName: z.string().min(2),
        phone: z.string().optional().default(""),
        dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        state: z.string().min(2),
        city: z.string().optional().default(""),
        agreeTerms: z.boolean().refine((val) => val === true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ipAddress = getClientIP(ctx.req);
      if (!isValidEmail(input.email)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid email" });
      }
      if (!isValidPassword(input.password)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Password too weak" });
      }
      const existingUser = await getUserByEmail(input.email);
      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already exists" });
      }
      const dobDate = new Date(input.dob);
      const age = calculateAge(dobDate);
      if (age < 18) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Must be 18+" });
      }
      if (isRestrictedState(input.state)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Restricted state" });
      }
      const userId = await createUser({ ...input, ipAddress });
      await logCompliance({ userId: Number(userId), action: "registration_success", ipAddress, details: JSON.stringify({ email: input.email }) });
      return { success: true, message: "Registration successful!" };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const ipAddress = getClientIP(ctx.req);
      const user = await getUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      const isPasswordValid = await verifyPassword(input.password, user.password);
      if (!isPasswordValid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      if (!user.isActive) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Account deactivated" });
      }
      const token = await generateToken(user.id, user.email);
      await createSession(user.id, token, ipAddress);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
      await logCompliance({ userId: user.id, action: "login_success", ipAddress, details: JSON.stringify({ email: input.email }) });
      const userWithProfile = await getUserWithProfile(user.id);
      return { success: true, message: "Login successful", user: { id: user.id, email: user.email, name: userWithProfile?.profile?.fullName || user.name } };
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    const token = ctx.req.cookies?.[COOKIE_NAME];
    const ipAddress = getClientIP(ctx.req);
    if (token) {
      await deleteSession(token);
      if (ctx.user) {
        await logCompliance({ userId: ctx.user.id, action: "logout", ipAddress, details: JSON.stringify({ email: ctx.user.email }) });
      }
    }
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true, message: "Logged out successfully" };
  }),

  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email(), dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), newPassword: z.string().min(8) }))
    .mutation(async ({ input, ctx }) => {
      const ipAddress = getClientIP(ctx.req);
      if (!isValidPassword(input.newPassword)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Password too weak" });
      }
      const user = await getUserByEmailAndDOB(input.email, input.dob);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      await updateUserPassword(user.id, input.newPassword);
      await logCompliance({ userId: user.id, action: "password_reset_success", ipAddress, details: JSON.stringify({ email: input.email }) });
      return { success: true, message: "Password reset successful!" };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const userWithProfile = await getUserWithProfile(ctx.user.id);
    if (!userWithProfile) return null;
    return { id: userWithProfile.id, email: userWithProfile.email, name: userWithProfile.profile?.fullName || userWithProfile.name, phone: userWithProfile.phone, state: userWithProfile.state, role: userWithProfile.role };
  }),

  updateProfile: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        phone: z.string().min(10).optional(),
        state: z.string().min(2).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }

      const ipAddress = getClientIP(ctx.req);

      // Update user in database
      const { updateUser } = await import("./dbAuth");
      await updateUser(ctx.user.id, {
        name: input.name,
        phone: input.phone,
        state: input.state,
      });

      await logCompliance({
        userId: ctx.user.id,
        action: "profile_update",
        ipAddress,
        details: JSON.stringify({ fields: Object.keys(input) }),
      });

      return { success: true, message: "Profile updated successfully" };
    }),
});
