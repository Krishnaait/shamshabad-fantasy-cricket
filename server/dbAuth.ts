import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { users, userProfiles, complianceLogs, sessions } from "../drizzle/schema";
import { hashPassword } from "./auth";

/**
 * Create a new user with profile
 */
export async function createUser(data: {
  email: string;
  password: string;
  fullName: string;
  dob: string; // Format: YYYY-MM-DD
  phone: string;
  state: string;
  city: string;
  ipAddress: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const passwordHash = await hashPassword(data.password);

  // Insert user
  const [user] = await db.insert(users).values({
    email: data.email,
    password: passwordHash,
    phone: data.phone,
    dob: data.dob,
    state: data.state,
    ageVerified: 1,
    geoVerified: 1,
    isActive: 1,
  });

  const userId = user.insertId;

  // Insert user profile
  await db.insert(userProfiles).values({
    userId: Number(userId),
    fullName: data.fullName,
    city: data.city,
    verifiedStatus: 1,
  });

  // Log compliance
  await db.insert(complianceLogs).values({
    userId: Number(userId),
    action: "registration",
    ipAddress: data.ipAddress,
    details: JSON.stringify({
      email: data.email,
      state: data.state,
      city: data.city,
      dob: data.dob,
    }),
  });

  return userId;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user || null;
}

/**
 * Get user with profile by ID
 */
export async function getUserWithProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  return {
    ...user,
    profile: profile || null,
  };
}

/**
 * Get user by email and date of birth (for password reset)
 */
export async function getUserByEmailAndDOB(email: string, dob: string) {
  const db = await getDb();
  if (!db) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.email, email),
        eq(users.dob, dob)
      )
    )
    .limit(1);

  return user || null;
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: number, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const passwordHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ password: passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/**
 * Create a session
 */
export async function createSession(userId: number, token: string, ipAddress: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await db.insert(sessions).values({
    userId,
    token,
    ipAddress,
    expiresAt,
  });
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(sessions).where(eq(sessions.token, token));
}

/**
 * Get active session
 */
export async function getSession(token: string) {
  const db = await getDb();
  if (!db) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (!session) return null;

  // Check if expired
  if (new Date() > session.expiresAt) {
    await deleteSession(token);
    return null;
  }

  return session;
}

/**
 * Log compliance action
 */
export async function logCompliance(data: {
  userId?: number;
  action: string;
  ipAddress: string;
  details: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(complianceLogs).values({
    userId: data.userId || null,
    action: data.action,
    ipAddress: data.ipAddress,
    details: data.details,
  });
}

/**
 * Update user profile information
 */
export async function updateUser(
  userId: number,
  data: {
    name?: string;
    phone?: string;
    state?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.state !== undefined) updateData.state = data.state;

  await db.update(users).set(updateData).where(eq(users.id, userId));
}
