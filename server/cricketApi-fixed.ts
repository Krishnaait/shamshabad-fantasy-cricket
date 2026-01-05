const CRIC_API_KEY = process.env.CRIC_API_KEY || "1a822521-d7e0-46ff-98d3-3e51020863f3";

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
  fantasyEnabled?: boolean;
  matchStarted?: boolean;
  matchEnded?: boolean;
}

/**
 * Get all matches from Cricket API with fast caching
 * Uses cricScore for comprehensive list and currentMatches for detailed info
 */
export async function getAllMatches(): Promise<Match[]> {
  try {
    // Check cache first
    if (matchesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log("[Cricket API] Using cached matches");
      return matchesCache;
    }

    console.log("[Cricket API] Fetching fresh matches...");

    // 1. Fetch from cricScore (more comprehensive list of matches)
    const cricScoreRes = await fetch(
      `https://api.cricapi.com/v1/cricScore?apikey=${CRIC_API_KEY}`,
      { signal: AbortSignal.timeout(10000) }
    );

    // 2. Fetch from currentMatches (more detailed info like teamInfo and fantasyEnabled)
    const currentRes = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${CRIC_API_KEY}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!cricScoreRes.ok || !currentRes.ok) {
      throw new Error(`Cricket API error: ${cricScoreRes.status} / ${currentRes.status}`);
    }

    const cricScoreData = await cricScoreRes.json();
    const currentData = await currentRes.json();
    
    const allMatchesMap = new Map<string, Match>();

    // Process currentMatches first (higher quality data)
    if (currentData.data && Array.isArray(currentData.data)) {
      for (const match of currentData.data) {
        const t1 = match.teams?.[0] || "";
        const t2 = match.teams?.[1] || "";
        const t1img = match.teamInfo?.[0]?.img || "";
        const t2img = match.teamInfo?.[1]?.img || "";

        let ms: "live" | "fixture" | "result" = "fixture";
        if (match.matchEnded) {
          ms = "result";
        } else if (match.matchStarted) {
          ms = "live";
        }

        allMatchesMap.set(match.id, {
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
          fantasyEnabled: match.fantasyEnabled,
          matchStarted: match.matchStarted,
          matchEnded: match.matchEnded
        });
      }
    }

    // Process cricScore matches (to fill in missing matches)
    if (cricScoreData.data && Array.isArray(cricScoreData.data)) {
      for (const match of cricScoreData.data) {
        if (!allMatchesMap.has(match.id)) {
          allMatchesMap.set(match.id, {
            id: match.id || "",
            name: match.name || `${match.t1} vs ${match.t2}`,
            matchType: match.matchType || "T20",
            status: match.status || "Not started",
            dateTimeGMT: match.dateTimeGMT || new Date().toISOString(),
            ms: match.ms || "fixture",
            t1: match.t1 || "",
            t2: match.t2 || "",
            t1img: match.t1img || "",
            t2img: match.t2img || "",
            s: match.t1s || match.t2s || "",
            ar: match.status || "",
            teams: [match.t1, match.t2],
            teamInfo: [
              { name: match.t1, shortname: match.t1, img: match.t1img },
              { name: match.t2, shortname: match.t2, img: match.t2img }
            ],
            fantasyEnabled: false, // cricScore doesn't provide this, assume false unless in currentMatches
            matchStarted: match.ms === "live" || match.ms === "result",
            matchEnded: match.ms === "result"
          });
        }
      }
    }

    const allMatches = Array.from(allMatchesMap.values());

    // Cache the results
    matchesCache = allMatches;
    cacheTimestamp = Date.now();

    console.log(`[Cricket API] Fetched ${allMatches.length} matches (Combined)`);
    return allMatches;
  } catch (error) {
    console.error("[Cricket API] Error fetching matches:", error);
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
 * Get matches for today and tomorrow only (limited to 5)
 */
export async function getTodayAndTomorrowMatches(): Promise<Match[]> {
  const allMatches = await getAllMatches();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  return allMatches
    .filter((match) => {
      const matchDate = new Date(match.dateTimeGMT);
      return matchDate >= today && matchDate < dayAfterTomorrow && match.ms === "fixture";
    })
    .sort((a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime())
    .slice(0, 5);
}

/**
 * Get recent completed matches (limited to 5)
 */
export async function getRecentCompletedMatches(): Promise<Match[]> {
  const allMatches = await getAllMatches();
  return allMatches
    .filter((match) => match.ms === "result")
    .sort((a, b) => new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime())
    .slice(0, 5);
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
 * Enhanced to provide better mapping and fallbacks
 */
export async function getLiveScore(matchId: string) {
  try {
    // 1. Try cricScore with matchId filter
    const res = await fetch(
      `https://api.cricapi.com/v1/cricScore?apikey=${CRIC_API_KEY}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) {
      throw new Error(`Cricket API error: ${res.status}`);
    }

    const data = await res.json();
    const match = data.data?.find((m: any) => m.id === matchId);
    
    if (match) {
      return {
        id: match.id,
        name: match.name,
        matchType: match.matchType,
        status: match.status,
        venue: match.venue || "Venue not specified",
        dateTimeGMT: match.dateTimeGMT,
        t1: match.t1,
        t2: match.t2,
        t1img: match.t1img,
        t2img: match.t2img,
        t1s: match.t1s || "0/0",
        t2s: match.t2s || "0/0",
        ms: match.ms
      };
    }

    // 2. Fallback: Check currentMatches for more detail
    const currentRes = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${CRIC_API_KEY}`,
      { signal: AbortSignal.timeout(10000) }
    );
    
    if (currentRes.ok) {
      const currentData = await currentRes.json();
      const currentMatch = currentData.data?.find((m: any) => m.id === matchId);
      if (currentMatch) {
        return {
          id: currentMatch.id,
          name: currentMatch.name,
          matchType: currentMatch.matchType,
          status: currentMatch.status,
          venue: currentMatch.venue || "Venue not specified",
          dateTimeGMT: currentMatch.dateTimeGMT,
          t1: currentMatch.teams?.[0] || "",
          t2: currentMatch.teams?.[1] || "",
          t1img: currentMatch.teamInfo?.[0]?.img || "",
          t2img: currentMatch.teamInfo?.[1]?.img || "",
          t1s: currentMatch.score?.[0]?.r ? `${currentMatch.score[0].r}/${currentMatch.score[0].w} (${currentMatch.score[0].o})` : "0/0",
          t2s: currentMatch.score?.[1]?.r ? `${currentMatch.score[1].r}/${currentMatch.score[1].w} (${currentMatch.score[1].o})` : "0/0",
          ms: currentMatch.matchEnded ? "result" : (currentMatch.matchStarted ? "live" : "fixture")
        };
      }
    }

    return null;
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
      `https://api.cricapi.com/v1/match_squad?apikey=${CRIC_API_KEY}&id=${matchId}`,
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
 * Enhanced to provide better mapping and fallbacks
 */
export async function getMatchScorecard(matchId: string) {
  try {
    const res = await fetch(
      `https://api.cricapi.com/v1/match_scorecard?apikey=${CRIC_API_KEY}&id=${matchId}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) {
      throw new Error(`Cricket API error: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.data) {
      return data.data;
    }

    // Fallback: Try to get basic info from getAllMatches if scorecard is not available yet
    const allMatches = await getAllMatches();
    const match = allMatches.find(m => m.id === matchId);
    if (match) {
      return {
        id: match.id,
        name: match.name,
        matchType: match.matchType,
        status: match.status,
        venue: "Venue not specified",
        dateTimeGMT: match.dateTimeGMT,
        score: [
          { inning: match.t1, r: 0, w: 0, o: 0 },
          { inning: match.t2, r: 0, w: 0, o: 0 }
        ],
        scorecard: []
      };
    }

    return null;
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
      `https://api.cricapi.com/v1/match_points?apikey=${CRIC_API_KEY}&id=${matchId}`,
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
