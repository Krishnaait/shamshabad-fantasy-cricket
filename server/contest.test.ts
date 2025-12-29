import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as dbContests from "./dbContests";

describe("Contest System", () => {
  describe("getContests", () => {
    it("should return an array of contests", async () => {
      const contests = await dbContests.getContests();
      expect(Array.isArray(contests)).toBe(true);
    });
  });

  describe("getContestById", () => {
    it("should return null for non-existent contest", async () => {
      const contest = await dbContests.getContestById(99999);
      expect(contest).toBeNull();
    });
  });

  describe("getUserContests", () => {
    it("should return an array of contests for a user", async () => {
      const contests = await dbContests.getUserContests(1);
      expect(Array.isArray(contests)).toBe(true);
    });
  });

  describe("getContestLeaderboard", () => {
    it("should return an array of leaderboard entries", async () => {
      const leaderboard = await dbContests.getContestLeaderboard(1);
      expect(Array.isArray(leaderboard)).toBe(true);
    });
  });

  describe("createContest", () => {
    it("should create a new contest", async () => {
      const result = await dbContests.createContest({
        matchId: "test-match-123",
        name: "Test Contest",
        description: "A test contest",
        entryFee: 100,
        prizePool: 10000,
        maxTeams: 100,
      });
      
      expect(result.success).toBe(true);
      expect(result.contestId).toBeDefined();
    });
  });

  describe("updateContestStatus", () => {
    it("should update contest status", async () => {
      const result = await dbContests.updateContestStatus(1, "live");
      expect(result.success).toBe(true);
    });
  });
});
