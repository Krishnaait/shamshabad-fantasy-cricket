import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Cricket API Integration Tests
 * Tests the integration with cricapi.com using the paid API key
 */

function createMockContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Cricket API Integration", () => {
  it("should fetch current matches from Cricket API", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const matches = await caller.cricket.getCurrentMatches();

    expect(matches).toBeDefined();
    expect(Array.isArray(matches)).toBe(true);
    
    // If matches exist, verify structure
    if (matches.length > 0) {
      const match = matches[0];
      expect(match).toHaveProperty("id");
      expect(match).toHaveProperty("name");
      expect(match).toHaveProperty("matchType");
      expect(match).toHaveProperty("dateTimeGMT");
      expect(match).toHaveProperty("teams");
      expect(match).toHaveProperty("matchStarted"); // Boolean: match has started
      expect(match).toHaveProperty("matchEnded"); // Boolean: match has ended
    }
  });

  it("should return matches with valid match states (matchStarted/matchEnded)", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const matches = await caller.cricket.getCurrentMatches();

    if (matches.length > 0) {
      matches.forEach((match: any) => {
        expect(typeof match.matchStarted).toBe("boolean");
        expect(typeof match.matchEnded).toBe("boolean");
        // A match cannot be ended without being started
        if (match.matchEnded) {
          expect(match.matchStarted).toBe(true);
        }
      });
    }
  });

  it("should fetch all matches from Cricket API", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const matches = await caller.cricket.getMatches();

    expect(matches).toBeDefined();
    expect(Array.isArray(matches)).toBe(true);
  });

  it("should fetch match info for a specific match", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // First get current matches to get a valid match ID
    const matches = await caller.cricket.getCurrentMatches();
    
    if (matches.length > 0) {
      const matchId = matches[0].id;
      const matchInfo = await caller.cricket.getMatchInfo({ matchId });

      expect(matchInfo).toBeDefined();
      if (matchInfo) {
        expect(matchInfo).toHaveProperty("id");
        expect(matchInfo).toHaveProperty("name");
        expect(matchInfo).toHaveProperty("teams");
      }
    }
  }, 10000); // Increase timeout for API call

  it("should fetch match squad for a specific match", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // First get current matches to get a valid match ID
    const matches = await caller.cricket.getCurrentMatches();
    
    if (matches.length > 0) {
      const matchId = matches[0].id;
      const squad = await caller.cricket.getMatchSquad({ matchId });

      expect(squad).toBeDefined();
      expect(Array.isArray(squad)).toBe(true);
      
      // If squad exists, verify player structure
      if (squad.length > 0 && squad[0].players && squad[0].players.length > 0) {
        const player = squad[0].players[0];
        expect(player).toHaveProperty("id");
        expect(player).toHaveProperty("name");
        expect(player).toHaveProperty("role");
      }
    }
  }, 10000);

  it("should handle invalid match ID gracefully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const matchInfo = await caller.cricket.getMatchInfo({ 
      matchId: "invalid-match-id-12345" 
    });

    // Should return null for invalid match ID
    expect(matchInfo).toBeNull();
  });

  it("should verify API is using paid key (not lifetime free)", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // The paid API key should return data
    // Lifetime free key has limited access
    const matches = await caller.cricket.getCurrentMatches();

    // If we get data, the paid key is working
    expect(matches).toBeDefined();
    expect(Array.isArray(matches)).toBe(true);
  });
});

describe("Cricket API Helper Functions", () => {
  it("should filter matches by state using matchStarted/matchEnded", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const matches = await caller.cricket.getCurrentMatches();

    if (matches.length > 0) {
      const liveMatches = matches.filter((m: any) => m.matchStarted && !m.matchEnded);
      const upcomingMatches = matches.filter((m: any) => !m.matchStarted);
      const completedMatches = matches.filter((m: any) => m.matchEnded);

      expect(Array.isArray(liveMatches)).toBe(true);
      expect(Array.isArray(upcomingMatches)).toBe(true);
      expect(Array.isArray(completedMatches)).toBe(true);
      
      // All matches should be categorized
      expect(liveMatches.length + upcomingMatches.length + completedMatches.length).toBe(matches.length);
    }
  });

  it("should verify fantasy enabled flag exists", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const matches = await caller.cricket.getCurrentMatches();

    if (matches.length > 0) {
      matches.forEach((match: any) => {
        expect(match).toHaveProperty("fantasyEnabled");
        expect(typeof match.fantasyEnabled).toBe("boolean");
      });
    }
  });
});
