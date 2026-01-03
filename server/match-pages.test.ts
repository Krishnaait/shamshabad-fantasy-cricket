import { describe, it, expect } from "vitest";

describe("Match Pages - Real Data Integration", () => {
  it("should fetch live matches correctly", async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    const liveMatches = data.data.filter((m: any) => m.ms === "live");
    expect(Array.isArray(liveMatches)).toBe(true);
  });

  it("should fetch upcoming matches and sort by date", { timeout: 15000 }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    const upcomingMatches = data.data
      .filter((m: any) => m.ms === "fixture")
      .sort((a: any, b: any) => {
        const dateA = new Date(a.dateTimeGMT || a.date).getTime();
        const dateB = new Date(b.dateTimeGMT || b.date).getTime();
        return dateA - dateB;
      });

    expect(Array.isArray(upcomingMatches)).toBe(true);

    // Verify sorting
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

  it("should fetch completed matches correctly", { timeout: 15000 }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    const completedMatches = data.data.filter((m: any) => m.ms === "result");
    expect(Array.isArray(completedMatches)).toBe(true);
  });

  it("should have team flags/badges for all matches", async () => {
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

  it("should have fantasy enabled for matches with squad", async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    const fantasyMatches = data.data.filter((m: any) => m.fantasyEnabled);
    expect(Array.isArray(fantasyMatches)).toBe(true);

    // Verify fantasy matches have required fields
    for (const match of fantasyMatches.slice(0, 3)) {
      expect(match.id).toBeDefined();
      expect(match.name).toBeDefined();
      expect(match.teams).toBeDefined();
      expect(match.teamInfo).toBeDefined();
    }
  });

  it("should have correct match status values", { timeout: 15000 }, async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    const validStatuses = ["fixture", "live", "result", undefined];

    for (const match of data.data) {
      expect(validStatuses).toContain(match.ms);
    }
  });
});
