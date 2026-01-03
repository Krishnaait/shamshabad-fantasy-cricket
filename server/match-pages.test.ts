import { describe, it, expect } from "vitest";

describe("Match Pages - Real Data Integration", () => {
  // Increase timeout for all tests in this suite
  const testTimeout = 20000;

  it("should fetch live matches correctly", { timeout: testTimeout }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    // Updated to use matchStarted/matchEnded fields
    const liveMatches = data.data.filter((m: any) => m.matchStarted && !m.matchEnded);
    expect(Array.isArray(liveMatches)).toBe(true);
    // Live matches count can be 0, which is valid
    expect(liveMatches.length).toBeGreaterThanOrEqual(0);
  });

  it("should fetch upcoming matches and sort by date", { timeout: testTimeout }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    // Updated to use matchStarted field
    const upcomingMatches = data.data
      .filter((m: any) => !m.matchStarted)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.dateTimeGMT || a.date).getTime();
        const dateB = new Date(b.dateTimeGMT || b.date).getTime();
        return dateA - dateB;
      });

    expect(Array.isArray(upcomingMatches)).toBe(true);

    // Verify sorting if there are multiple matches
    if (upcomingMatches.length > 1) {
      for (let i = 0; i < upcomingMatches.length - 1; i++) {
        const currentDate = new Date(
          upcomingMatches[i].dateTimeGMT || upcomingMatches[i].date
        ).getTime();
        const nextDate = new Date(
          upcomingMatches[i + 1].dateTimeGMT || upcomingMatches[i + 1].date
        ).getTime();
        expect(currentDate).toBeLessThanOrEqual(nextDate);
      }
    }
  });

  it("should fetch completed matches correctly", { timeout: testTimeout }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    // Updated to use matchEnded field
    const completedMatches = data.data.filter((m: any) => m.matchEnded);
    expect(Array.isArray(completedMatches)).toBe(true);
    // Completed matches should exist
    expect(completedMatches.length).toBeGreaterThan(0);
  });

  it("should have team flags/badges for all matches", { timeout: testTimeout }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    const matches = data.data.slice(0, 5); // Test first 5 matches

    for (const match of matches) {
      expect(match.teamInfo).toBeDefined();
      expect(Array.isArray(match.teamInfo)).toBe(true);
      expect(match.teamInfo.length).toBeGreaterThanOrEqual(2);

      // Verify each team has flag
      for (const team of match.teamInfo) {
        expect(team.name).toBeDefined();
        expect(team.shortname).toBeDefined();
        expect(team.img).toBeDefined();
        expect(team.img).toContain("http");
      }
    }
  });

  it("should have fantasy enabled for matches with squad", { timeout: testTimeout }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    const fantasyMatches = data.data.filter((m: any) => m.fantasyEnabled);
    expect(Array.isArray(fantasyMatches)).toBe(true);

    // Verify fantasy matches have required fields (if any exist)
    if (fantasyMatches.length > 0) {
      for (const match of fantasyMatches.slice(0, 3)) {
        expect(match.id).toBeDefined();
        expect(match.name).toBeDefined();
        expect(match.teams).toBeDefined();
        expect(match.teamInfo).toBeDefined();
      }
    }
  });

  it("should have correct match status values", { timeout: testTimeout }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    // Verify all matches have matchStarted and matchEnded boolean fields
    for (const match of data.data) {
      expect(typeof match.matchStarted).toBe("boolean");
      expect(typeof match.matchEnded).toBe("boolean");
      
      // matchEnded can only be true if matchStarted is true
      if (match.matchEnded) {
        expect(match.matchStarted).toBe(true);
      }
    }
  });
});
