import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { inferProcedureInput } from "@trpc/server";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import bcrypt from "bcryptjs";

describe("Team Router Tests", () => {
  let testUserId: number;
  let testMatchId: string;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create a test user
    const hashedPassword = await bcrypt.hash("Test@1234", 10);
    const [result] = await db.insert(users).values({
      email: `teamtest${Date.now()}@test.com`,
      password: hashedPassword,
      name: "Team Test User",
      ageVerified: 1,
      geoVerified: 1,
      state: "Maharashtra",
      country: "India",
    });

    testUserId = result.insertId;
    testMatchId = "test-match-123"; // We'll use a test match ID
  });

  describe("getMatchSquad", () => {
    it("should fetch match squad from Cricket API", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      type Input = inferProcedureInput<typeof appRouter.team.getMatchSquad>;
      const input: Input = {
        matchId: "d4ec682e-fff1-4e6e-9cc7-8f81a1c824e8", // Use a real match ID from API
      };

      const result = await caller.team.getMatchSquad(input);

      // Should return an array of squad data
      expect(Array.isArray(result)).toBe(true);
      
      // If data is available, check structure
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("teamName");
        expect(result[0]).toHaveProperty("players");
        expect(Array.isArray(result[0].players)).toBe(true);
      }
    });

    it("should handle invalid match ID gracefully", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      type Input = inferProcedureInput<typeof appRouter.team.getMatchSquad>;
      const input: Input = {
        matchId: "invalid-match-id-12345",
      };

      const result = await caller.team.getMatchSquad(input);

      // Should return empty array for invalid match
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("createTeam", () => {
    it("should create a team with 11 players, captain, and vice-captain", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      type Input = inferProcedureInput<typeof appRouter.team.createTeam>;
      const input: Input = {
        matchId: testMatchId,
        teamName: "Test Dream Team",
        players: [
          { playerId: "p1", playerName: "Player 1", role: "Wicketkeeper", isCaptain: true, isViceCaptain: false },
          { playerId: "p2", playerName: "Player 2", role: "Batsman", isCaptain: false, isViceCaptain: true },
          { playerId: "p3", playerName: "Player 3", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p4", playerName: "Player 4", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p5", playerName: "Player 5", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "p6", playerName: "Player 6", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "p7", playerName: "Player 7", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p8", playerName: "Player 8", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p9", playerName: "Player 9", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p10", playerName: "Player 10", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p11", playerName: "Player 11", role: "Batsman", isCaptain: false, isViceCaptain: false },
        ],
      };

      const result = await caller.team.createTeam(input);

      expect(result.success).toBe(true);
      expect(result.teamId).toBeDefined();
      expect(typeof result.teamId).toBe("number");
    });

    it("should reject team with less than 11 players", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      type Input = inferProcedureInput<typeof appRouter.team.createTeam>;
      const input: Input = {
        matchId: testMatchId,
        teamName: "Incomplete Team",
        players: [
          { playerId: "p1", playerName: "Player 1", role: "Wicketkeeper", isCaptain: true, isViceCaptain: false },
          { playerId: "p2", playerName: "Player 2", role: "Batsman", isCaptain: false, isViceCaptain: true },
        ],
      };

      await expect(caller.team.createTeam(input)).rejects.toThrow();
    });

    it("should reject team without captain", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      type Input = inferProcedureInput<typeof appRouter.team.createTeam>;
      const input: Input = {
        matchId: testMatchId,
        teamName: "No Captain Team",
        players: [
          { playerId: "p1", playerName: "Player 1", role: "Wicketkeeper", isCaptain: false, isViceCaptain: true },
          { playerId: "p2", playerName: "Player 2", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p3", playerName: "Player 3", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p4", playerName: "Player 4", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p5", playerName: "Player 5", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "p6", playerName: "Player 6", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "p7", playerName: "Player 7", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p8", playerName: "Player 8", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p9", playerName: "Player 9", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p10", playerName: "Player 10", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p11", playerName: "Player 11", role: "Batsman", isCaptain: false, isViceCaptain: false },
        ],
      };

      await expect(caller.team.createTeam(input)).rejects.toThrow("Must have exactly 1 captain");
    });

    it("should reject team without vice-captain", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      type Input = inferProcedureInput<typeof appRouter.team.createTeam>;
      const input: Input = {
        matchId: testMatchId,
        teamName: "No Vice Captain Team",
        players: [
          { playerId: "p1", playerName: "Player 1", role: "Wicketkeeper", isCaptain: true, isViceCaptain: false },
          { playerId: "p2", playerName: "Player 2", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p3", playerName: "Player 3", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p4", playerName: "Player 4", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p5", playerName: "Player 5", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "p6", playerName: "Player 6", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "p7", playerName: "Player 7", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p8", playerName: "Player 8", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p9", playerName: "Player 9", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p10", playerName: "Player 10", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p11", playerName: "Player 11", role: "Batsman", isCaptain: false, isViceCaptain: false },
        ],
      };

      await expect(caller.team.createTeam(input)).rejects.toThrow("Must have exactly 1 vice-captain");
    });

    it("should reject team where captain and vice-captain are same player", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      type Input = inferProcedureInput<typeof appRouter.team.createTeam>;
      const input: Input = {
        matchId: testMatchId,
        teamName: "Same Captain VC Team",
        players: [
          { playerId: "p1", playerName: "Player 1", role: "Wicketkeeper", isCaptain: true, isViceCaptain: true },
          { playerId: "p2", playerName: "Player 2", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p3", playerName: "Player 3", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p4", playerName: "Player 4", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "p5", playerName: "Player 5", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "p6", playerName: "Player 6", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "p7", playerName: "Player 7", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p8", playerName: "Player 8", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p9", playerName: "Player 9", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p10", playerName: "Player 10", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "p11", playerName: "Player 11", role: "Batsman", isCaptain: false, isViceCaptain: false },
        ],
      };

      await expect(caller.team.createTeam(input)).rejects.toThrow("Captain and vice-captain must be different players");
    });
  });

  describe("getMyTeams", () => {
    it("should return all teams for current user", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      const result = await caller.team.getMyTeams();

      expect(Array.isArray(result)).toBe(true);
      // Should have at least one team from previous test
      expect(result.length).toBeGreaterThan(0);
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("teamName");
        expect(result[0]).toHaveProperty("matchId");
        expect(result[0].userId).toBe(testUserId);
      }
    });
  });

  describe("getMyTeamsForMatch", () => {
    it("should return teams for specific match", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      type Input = inferProcedureInput<typeof appRouter.team.getMyTeamsForMatch>;
      const input: Input = {
        matchId: testMatchId,
      };

      const result = await caller.team.getMyTeamsForMatch(input);

      expect(Array.isArray(result)).toBe(true);
      
      // All returned teams should be for the specified match
      result.forEach((team) => {
        expect(team.matchId).toBe(testMatchId);
        expect(team.userId).toBe(testUserId);
      });
    });
  });

  describe("getTeamDetails", () => {
    it("should return team with players", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      // First get all teams
      const teams = await caller.team.getMyTeams();
      expect(teams.length).toBeGreaterThan(0);

      const teamId = teams[0].id;

      type Input = inferProcedureInput<typeof appRouter.team.getTeamDetails>;
      const input: Input = { teamId };

      const result = await caller.team.getTeamDetails(input);

      expect(result.team).toBeDefined();
      expect(result.team.id).toBe(teamId);
      expect(result.players).toBeDefined();
      expect(Array.isArray(result.players)).toBe(true);
      expect(result.players.length).toBe(11);

      // Check captain and vice-captain
      const captain = result.players.find((p) => p.isCaptain === 1);
      const viceCaptain = result.players.find((p) => p.isViceCaptain === 1);
      
      expect(captain).toBeDefined();
      expect(viceCaptain).toBeDefined();
      expect(captain?.playerId).not.toBe(viceCaptain?.playerId);
    });

    it("should reject access to another user's team", async () => {
      const caller = appRouter.createCaller({
        user: { id: 99999, email: "other@test.com", role: "user" }, // Different user
      });

      // Get a team ID from the test user
      const callerOriginal = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });
      const teams = await callerOriginal.team.getMyTeams();
      expect(teams.length).toBeGreaterThan(0);

      const teamId = teams[0].id;

      type Input = inferProcedureInput<typeof appRouter.team.getTeamDetails>;
      const input: Input = { teamId };

      await expect(caller.team.getTeamDetails(input)).rejects.toThrow("Unauthorized");
    });
  });

  describe("updateTeamName", () => {
    it("should update team name successfully", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      // Get a team
      const teams = await caller.team.getMyTeams();
      expect(teams.length).toBeGreaterThan(0);

      const teamId = teams[0].id;
      const newName = `Updated Team ${Date.now()}`;

      type Input = inferProcedureInput<typeof appRouter.team.updateTeamName>;
      const input: Input = { teamId, teamName: newName };

      const result = await caller.team.updateTeamName(input);

      expect(result.success).toBe(true);

      // Verify the name was updated
      const updatedTeams = await caller.team.getMyTeams();
      const updatedTeam = updatedTeams.find((t) => t.id === teamId);
      expect(updatedTeam?.teamName).toBe(newName);
    });
  });

  describe("deleteTeam", () => {
    it("should delete team and its players", async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, email: "test@test.com", role: "user" },
      });

      // Create a team to delete
      type CreateInput = inferProcedureInput<typeof appRouter.team.createTeam>;
      const createInput: CreateInput = {
        matchId: testMatchId,
        teamName: "Team To Delete",
        players: [
          { playerId: "d1", playerName: "Delete 1", role: "Wicketkeeper", isCaptain: true, isViceCaptain: false },
          { playerId: "d2", playerName: "Delete 2", role: "Batsman", isCaptain: false, isViceCaptain: true },
          { playerId: "d3", playerName: "Delete 3", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "d4", playerName: "Delete 4", role: "Batsman", isCaptain: false, isViceCaptain: false },
          { playerId: "d5", playerName: "Delete 5", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "d6", playerName: "Delete 6", role: "All-Rounder", isCaptain: false, isViceCaptain: false },
          { playerId: "d7", playerName: "Delete 7", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "d8", playerName: "Delete 8", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "d9", playerName: "Delete 9", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "d10", playerName: "Delete 10", role: "Bowler", isCaptain: false, isViceCaptain: false },
          { playerId: "d11", playerName: "Delete 11", role: "Batsman", isCaptain: false, isViceCaptain: false },
        ],
      };

      const createResult = await caller.team.createTeam(createInput);
      const teamId = createResult.teamId;

      // Delete the team
      type DeleteInput = inferProcedureInput<typeof appRouter.team.deleteTeam>;
      const deleteInput: DeleteInput = { teamId };

      const deleteResult = await caller.team.deleteTeam(deleteInput);

      expect(deleteResult.success).toBe(true);

      // Verify team is deleted
      type DetailsInput = inferProcedureInput<typeof appRouter.team.getTeamDetails>;
      const detailsInput: DetailsInput = { teamId };

      await expect(caller.team.getTeamDetails(detailsInput)).rejects.toThrow("Team not found");
    });
  });
});
