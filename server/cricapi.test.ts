import { describe, it, expect } from "vitest";

describe("CricAPI Integration", () => {
  it("should fetch current matches with paid API key", async () => {
    const apiKey = process.env.CRIC_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBe("1a822521-d7e0-46ff-98d3-3e51020863f3");

    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.status).toBe("success");
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);

    // Verify match structure
    const match = data.data[0];
    expect(match.id).toBeDefined();
    expect(match.name).toBeDefined();
    expect(match.teams).toBeDefined();
    expect(match.teamInfo).toBeDefined();
    expect(match.hasSquad).toBeDefined();
  });

  it("should have team flags/badges in match data", async () => {
    const apiKey = process.env.CRIC_API_KEY;
    const response = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`
    );
    const data = await response.json();

    const match = data.data[0];
    expect(match.teamInfo.length).toBeGreaterThan(0);

    // Verify each team has flag/badge
    for (const team of match.teamInfo) {
      expect(team.name).toBeDefined();
      expect(team.shortname).toBeDefined();
      expect(team.img).toBeDefined();
      expect(team.img).toContain("http");
    }
  });
});
