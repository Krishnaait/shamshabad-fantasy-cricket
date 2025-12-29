import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { contests, leaderboards, userTeams, users, type Contest } from "../drizzle/schema";

/**
 * Get all contests
 */
export async function getContests(): Promise<Contest[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contests);
}

/**
 * Get contest by ID
 */
export async function getContestById(contestId: number): Promise<Contest | null> {
  const db = await getDb();
  if (!db) return null;

  const [contest] = await db.select().from(contests).where(eq(contests.id, contestId));
  return contest || null;
}

/**
 * Get contests joined by a user
 */
export async function getUserContests(userId: number) {
  const db = await getDb();
  if (!db) return [];

  // Get all teams for this user
  const userTeamsList = await db
    .select()
    .from(userTeams)
    .where(eq(userTeams.userId, userId));

  // Get all contests that have these teams
  if (userTeamsList.length === 0) return [];

  const contestIds = userTeamsList
    .map((t) => t.contestId)
    .filter((id): id is number => id !== null);
  if (contestIds.length === 0) return [];

  // Use OR conditions instead of inArray
  const contestList: Contest[] = [];
  for (const cid of contestIds) {
    const contest = await getContestById(cid);
    if (contest) {
      contestList.push(contest);
    }
  }
  return contestList;
}

/**
 * Join a contest with a team
 */
export async function joinContest({
  userId,
  contestId,
  teamId,
}: {
  userId: number;
  contestId: number;
  teamId: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get the team
  const [team] = await db.select().from(userTeams).where(eq(userTeams.id, teamId));
  if (!team) {
    throw new Error("Team not found");
  }

  // Verify team belongs to user
  if (team.userId !== userId) {
    throw new Error("Unauthorized: Team does not belong to user");
  }

  // Get the contest
  const contest = await getContestById(contestId);
  if (!contest) {
    throw new Error("Contest not found");
  }

  // Check if contest is full
  const totalTeams = contest.totalTeams || 0;
  if (totalTeams >= contest.maxTeams) {
    throw new Error("Contest is full");
  }

  // Update team with contest ID
  await db
    .update(userTeams)
    .set({ contestId })
    .where(eq(userTeams.id, teamId));

  // Increment total teams in contest
  await db
    .update(contests)
    .set({ totalTeams: totalTeams + 1 })
    .where(eq(contests.id, contestId));

  return { success: true, message: "Successfully joined contest" };
}

/**
 * Get contest leaderboard with rankings
 */
export async function getContestLeaderboard(contestId: number) {
  const db = await getDb();
  if (!db) return [];

  const leaderboardData = await db
    .select({
      id: leaderboards.id,
      rank: leaderboards.rank,
      totalPoints: leaderboards.totalPoints,
      prizeAmount: leaderboards.prizeAmount,
      userName: users.name,
      userEmail: users.email,
      teamId: leaderboards.teamId,
    })
    .from(leaderboards)
    .leftJoin(users, eq(leaderboards.userId, users.id))
    .where(eq(leaderboards.contestId, contestId))
    .orderBy(leaderboards.rank);

  return leaderboardData;
}

/**
 * Create a new contest
 */
export async function createContest({
  matchId,
  name,
  description,
  entryFee,
  prizePool,
  maxTeams,
}: {
  matchId: string;
  name: string;
  description?: string;
  entryFee: number;
  prizePool: number;
  maxTeams: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(contests).values({
    matchId,
    name,
    description,
    entryFee,
    prizePool,
    maxTeams,
    totalTeams: 0,
    status: "upcoming",
  });

  return { success: true, contestId: result.insertId };
}

/**
 * Update contest status
 */
export async function updateContestStatus(
  contestId: number,
  status: "upcoming" | "live" | "completed" | "cancelled"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(contests)
    .set({ status })
    .where(eq(contests.id, contestId));

  return { success: true };
}

/**
 * Update leaderboard rankings for a contest
 */
export async function updateLeaderboardRankings(
  contestId: number,
  rankings: Array<{
    userId: number;
    teamId: number;
    totalPoints: number;
    rank: number;
    prizeAmount: number;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete existing leaderboard entries
  await db.delete(leaderboards).where(eq(leaderboards.contestId, contestId));

  // Insert new rankings
  const leaderboardEntries = rankings.map((r) => ({
    contestId,
    userId: r.userId,
    teamId: r.teamId,
    rank: r.rank,
    totalPoints: r.totalPoints,
    prizeAmount: r.prizeAmount,
  }));

  await db.insert(leaderboards).values(leaderboardEntries);

  return { success: true };
}
