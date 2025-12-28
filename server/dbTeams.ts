import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { userTeams, teamPlayers, type InsertUserTeam, type InsertTeamPlayer } from "../drizzle/schema";

/**
 * Create a new fantasy team for a user
 */
export async function createUserTeam(team: InsertUserTeam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [newTeam] = await db.insert(userTeams).values(team);
  return newTeam;
}

/**
 * Get all teams for a user
 */
export async function getUserTeams(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userTeams).where(eq(userTeams.userId, userId));
}

/**
 * Get a specific team by ID
 */
export async function getTeamById(teamId: number) {
  const db = await getDb();
  if (!db) return null;

  const [team] = await db.select().from(userTeams).where(eq(userTeams.id, teamId));
  return team || null;
}

/**
 * Get teams for a specific match
 */
export async function getUserTeamsForMatch(userId: number, matchId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(userTeams)
    .where(and(eq(userTeams.userId, userId), eq(userTeams.matchId, matchId)));
}

/**
 * Add players to a team
 */
export async function addTeamPlayers(players: InsertTeamPlayer[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(teamPlayers).values(players);
}

/**
 * Get all players in a team
 */
export async function getTeamPlayers(teamId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(teamPlayers).where(eq(teamPlayers.teamId, teamId));
}

/**
 * Delete a team and its players
 */
export async function deleteTeam(teamId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete team players first
  await db.delete(teamPlayers).where(eq(teamPlayers.teamId, teamId));
  
  // Then delete the team
  await db.delete(userTeams).where(eq(userTeams.id, teamId));
}

/**
 * Update team name
 */
export async function updateTeamName(teamId: number, teamName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userTeams).set({ teamName }).where(eq(userTeams.id, teamId));
}

/**
 * Update team and player fantasy points
 */
export async function updateTeamPoints(
  teamId: number,
  totalPoints: number,
  playerPoints: Record<number, number>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update team total points
  await db.update(userTeams).set({ totalPoints }).where(eq(userTeams.id, teamId));

  // Update individual player points
  for (const [playerIdStr, points] of Object.entries(playerPoints)) {
    const playerId = parseInt(playerIdStr);
    await db
      .update(teamPlayers)
      .set({ points })
      .where(eq(teamPlayers.id, playerId));
  }
}

/**
 * Get user team with all players
 */
export async function getUserTeamWithPlayers(teamId: number) {
  const db = await getDb();
  if (!db) return null;

  const team = await db.select().from(userTeams).where(eq(userTeams.id, teamId)).limit(1);
  if (team.length === 0) return null;

  const players = await db.select().from(teamPlayers).where(eq(teamPlayers.teamId, teamId));

  return {
    ...team[0],
    players,
  };
}
