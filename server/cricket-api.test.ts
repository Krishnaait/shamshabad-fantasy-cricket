import { describe, it, expect, beforeAll } from "vitest";
import * as cricketApiOptimized from "./cricketApi-optimized";

describe("Cricket API Optimized", () => {
  it("should fetch all matches", async () => {
    const matches = await cricketApiOptimized.getAllMatchesOptimized();
    console.log(`[Test] Total matches fetched: ${matches.length}`);
    expect(Array.isArray(matches)).toBe(true);
  });

  it("should fetch live matches", async () => {
    const liveMatches = await cricketApiOptimized.getMatchesByStatus("live");
    console.log(`[Test] Live matches: ${liveMatches.length}`);
    expect(Array.isArray(liveMatches)).toBe(true);
  });

  it("should fetch upcoming matches", async () => {
    const upcomingMatches = await cricketApiOptimized.getMatchesByStatus("fixture");
    console.log(`[Test] Upcoming matches: ${upcomingMatches.length}`);
    expect(Array.isArray(upcomingMatches)).toBe(true);
  });

  it("should fetch completed matches", async () => {
    const completedMatches = await cricketApiOptimized.getMatchesByStatus("result");
    console.log(`[Test] Completed matches: ${completedMatches.length}`);
    expect(Array.isArray(completedMatches)).toBe(true);
  });

  it("should get match statistics", async () => {
    const stats = await cricketApiOptimized.getMatchStatistics();
    console.log(`[Test] Match statistics:`, stats);
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("live");
    expect(stats).toHaveProperty("upcoming");
    expect(stats).toHaveProperty("completed");
  });
});
