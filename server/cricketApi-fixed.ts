const CRIC_API_KEY = process.env.CRIC_API_KEY || "";

// Cache for matches with 5-minute TTL
let matchesCache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  dateTimeGMT: string;
  ms: "live" | "fixture" | "result"; // Match status
  t1: string; // Team 1
  t2: string; // Team 2
  t1img?: string;
  t2img?: string;
  s?: string; // Score
  ar?: string; // Result/Status
  teams?: string[];
  teamInfo?: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
}

/**
 * Get all matches from Cricket API with fast caching
 */
export async function getAllMatches(): Promise<Match[]> {
  try {
    // Check cache first
    if (matchesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log("[Cricket API] Using cached matches");
      return matchesCache;
    }

    console.log("[Cricket API] Fetching fresh matches...");

    // Fetch current matches
    const currentRes = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${CRIC_API_KEY}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!currentRes.ok) {
      throw new Error(`Cricket API error: ${currentRes.status}`);
    }

    const currentData = await currentRes.json();
    const allMatches: Match[] = [];

    // Process all matches from the API response
    if (currentData.data && Array.isArray(currentData.data)) {
      for (const match of currentData.data) {
        // Extract team names from teams array
        const t1 = match.teams?.[0] || "";
        const t2 = match.teams?.[1] || "";
        const t1img = match.teamInfo?.[0]?.img || "";
        const t2img = match.teamInfo?.[1]?.img || "";

        // Determine match status
        let ms: "live" | "fixture" | "result" = "fixture";
        if (match.matchEnded) {
          ms = "result";
        } else if (match.matchStarted) {
          ms = "live";
        }

        allMatches.push({
          id: match.id || "",
          name: match.name || `${t1} vs ${t2}`,
          matchType: match.matchType || "T20",
          status: match.status || "Not started",
          dateTimeGMT: match.dateTimeGMT || new Date().toISOString(),
          ms: ms,
          t1: t1,
          t2: t2,
          t1img: t1img,
          t2img: t2img,
          s: match.score?.[0]?.r?.toString() || "",
          ar: match.status || "",
          teams: [t1, t2],
          teamInfo: match.teamInfo || [],
        });
      }
    }

    // Cache the results
    matchesCache = allMatches;
    cacheTimestamp = Date.now();

    console.log(`[Cricket API] Fetched ${allMatches.length} matches`);
    return allMatches;
  } catch (error) {
    console.error("[Cricket API] Error fetching matches:", error);
    // Return cached data even if expired, or empty array
    return matchesCache || [];
  }
}

/**
 * Get matches filtered by status
 */
export async function getMatchesByStatus(
  status: "live" | "fixture" | "result"
): Promise<Match[]> {
  const allMatches = await getAllMatches();
  return allMatches.filter((match) => match.ms === status);
}

/**
 * Get match statistics
 */
export async function getMatchStatistics() {
  const allMatches = await getAllMatches();

  return {
    total: allMatches.length,
    live: allMatches.filter((m) => m.ms === "live").length,
    upcoming: allMatches.filter((m) => m.ms === "fixture").length,
    completed: allMatches.filter((m) => m.ms === "result").length,
  };
}

/**
 * Get live score for a specific match
 */
export async function getLiveScore(matchId: string) {
  try {
    const res = await fetch(
      `https://api.cricapi.com/v1/cricScore?apikey=${CRIC_API_KEY}&matchId=${matchId}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) {
      throw new Error(`Cricket API error: ${res.status}`);
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("[Cricket API] Error fetching live score:", error);
    return null;
  }
}

/**
 * Get match squad information
 */
export async function getMatchSquad(matchId: string) {
  try {
    const res = await fetch(
      `https://api.cricapi.com/v1/match_squad?apikey=${CRIC_API_KEY}&matchId=${matchId}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) {
      throw new Error(`Cricket API error: ${res.status}`);
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("[Cricket API] Error fetching squad:", error);
    return null;
  }
}

/**
 * Get match scorecard
 */
export async function getMatchScorecard(matchId: string) {
  try {
    const res = await fetch(
      `https://api.cricapi.com/v1/match_scorecard?apikey=${CRIC_API_KEY}&matchId=${matchId}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) {
      throw new Error(`Cricket API error: ${res.status}`);
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("[Cricket API] Error fetching scorecard:", error);
    return null;
  }
}

/**
 * Get fantasy points for a match
 */
export async function getFantasyPoints(matchId: string) {
  try {
    const res = await fetch(
      `https://api.cricapi.com/v1/match_points?apikey=${CRIC_API_KEY}&matchId=${matchId}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) {
      throw new Error(`Cricket API error: ${res.status}`);
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("[Cricket API] Error fetching fantasy points:", error);
    return null;
  }
}
