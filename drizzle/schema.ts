import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  dob: varchar("dob", { length: 10 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).default("India"),
  ageVerified: int("ageVerified").default(0).notNull(),
  geoVerified: int("geoVerified").default(0).notNull(),
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// User Profiles
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fullName: text("fullName"),
  avatar: text("avatar"),
  bio: text("bio"),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  verifiedStatus: int("verifiedStatus").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Matches
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  apiMatchId: varchar("apiMatchId", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  matchType: varchar("matchType", { length: 50 }),
  status: text("status"),
  venue: text("venue"),
  date: varchar("date", { length: 50 }),
  dateTimeGMT: varchar("dateTimeGMT", { length: 50 }),
  team1: varchar("team1", { length: 255 }),
  team2: varchar("team2", { length: 255 }),
  team1Img: text("team1Img"),
  team2Img: text("team2Img"),
  seriesId: varchar("seriesId", { length: 255 }),
  matchState: varchar("matchState", { length: 50 }),
  fantasyEnabled: int("fantasyEnabled").default(0),
  matchStarted: int("matchStarted").default(0),
  matchEnded: int("matchEnded").default(0),
  tossWinner: varchar("tossWinner", { length: 255 }),
  tossChoice: varchar("tossChoice", { length: 50 }),
  matchWinner: varchar("matchWinner", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Contests
export const contests = mysqlTable("contests", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  entryFee: int("entryFee").default(0),
  prizePool: int("prizePool").default(0),
  maxTeams: int("maxTeams").notNull(),
  totalTeams: int("totalTeams").default(0),
  status: mysqlEnum("status", ["upcoming", "live", "completed", "cancelled"]).default("upcoming").notNull(),
  startTime: timestamp("startTime"),
  endTime: timestamp("endTime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// User Teams
export const userTeams = mysqlTable("user_teams", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contestId: int("contestId").notNull(),
  matchId: int("matchId").notNull(),
  teamName: varchar("teamName", { length: 255 }).notNull(),
  captain: varchar("captain", { length: 255 }),
  viceCaptain: varchar("viceCaptain", { length: 255 }),
  totalPoints: int("totalPoints").default(0),
  rank: int("rank").default(0),
  status: mysqlEnum("status", ["draft", "confirmed", "active", "completed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Team Players
export const teamPlayers = mysqlTable("team_players", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  playerId: varchar("playerId", { length: 255 }).notNull(),
  playerName: varchar("playerName", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }),
  teamName: varchar("teamName", { length: 255 }),
  credits: int("credits").default(0),
  points: int("points").default(0),
  isCaptain: int("isCaptain").default(0),
  isViceCaptain: int("isViceCaptain").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Match Results
export const matchResults = mysqlTable("match_results", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull().unique(),
  winner: varchar("winner", { length: 255 }),
  finalScore: text("finalScore"),
  manOfTheMatch: varchar("manOfTheMatch", { length: 255 }),
  resultStatus: varchar("resultStatus", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Leaderboards
export const leaderboards = mysqlTable("leaderboards", {
  id: int("id").autoincrement().primaryKey(),
  contestId: int("contestId").notNull(),
  userId: int("userId").notNull(),
  teamId: int("teamId").notNull(),
  rank: int("rank").notNull(),
  totalPoints: int("totalPoints").default(0),
  prizeAmount: int("prizeAmount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Transactions
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["entry", "prize", "refund", "bonus"]).notNull(),
  amount: int("amount").default(0),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  referenceId: varchar("referenceId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Compliance Logs
export const complianceLogs = mysqlTable("compliance_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  status: varchar("status", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Contact Form Submissions
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Contest = typeof contests.$inferSelect;
export type UserTeam = typeof userTeams.$inferSelect;
export type TeamPlayer = typeof teamPlayers.$inferSelect;
export type MatchResult = typeof matchResults.$inferSelect;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type ComplianceLog = typeof complianceLogs.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;