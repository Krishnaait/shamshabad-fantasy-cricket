/**
 * Cricket API Client Module
 * Handles all interactions with the Cricket Data API (cricapi.com)
 * Includes caching and error handling for real-time match data
 */

const CRIC_API_KEY = process.env.CRIC_API_KEY || "1a822521-d7e0-46ff-98d3-3e51020863f3";
const BASE_URL = "https://api.cricapi.com/v1";

interface CricketMatch {
  id: string;
  dateTimeGMT: string;
  matchType: string;
  status: string;
  ms: "fixture" | "live" | "result";
  t1: string;
  t2: string;
  t1img: string;
  t2img: string;
  series: string;
  r1?: number;
  r2?: number;
  score1?: string;
  score2?: string;
  [key: string]: any;
}

interface MatchScorecard {
  [key: string]: any;
}

interface MatchPoints {
  innings: Array<{
    inning: string;
    batting: Array<{
      id: string;
      name: string;
      points: number;
    }>;
    bowling: Array<{
      id: string;
      name: string;
      points: number;
    }>;
  }>;
}

interface MatchSquad {
  [key: string]: any;
}

// Cache for API responses to reduce API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15000; // 15 seconds cache for real-time updates

/**
 * Fetch data from Cricket API with caching
 * Auto-refreshes every 15 seconds for live matches
 */
async function fetchCricketData(endpoint: string, params: Record<string, string> = {}) {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);

  // Return cached data if still valid (15 second cache for live updates)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    url.searchParams.append("apikey", CRIC_API_KEY);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Cricket API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(`Cricket API failed: ${data.reason || "Unknown error"}`);
    }

    // Cache the successful response
    cache.set(cacheKey, {
      data: data.data,
      timestamp: Date.now(),
    });

    return data.data;
  } catch (error) {
    console.error(`[Cricket API] Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Get all current and upcoming matches
 * Returns matches categorized by status: live, upcoming, completed
 */
export async function getAllMatches() {
  try {
    const matches = await fetchCricketData("cricScore");

    if (!Array.isArray(matches)) {
      return { live: [], upcoming: [], completed: [] };
    }

    const live: CricketMatch[] = [];
    const upcoming: CricketMatch[] = [];
    const completed: CricketMatch[] = [];

    for (const match of matches) {
      if (match.ms === "live") {
        live.push(match);
      } else if (match.ms === "fixture") {
        upcoming.push(match);
      } else if (match.ms === "result") {
        completed.push(match);
      }
    }

    // Sort upcoming matches by date
    upcoming.sort((a, b) => new Date(a.dateTimeGMT).getTime() - new Date(b.dateTimeGMT).getTime());

    // Sort completed matches by date (newest first)
    completed.sort((a, b) => new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime());

    return { live, upcoming, completed };
  } catch (error) {
    console.error("[Cricket API] Failed to fetch all matches:", error);
    throw error;
  }
}

/**
 * Get detailed information for a specific match
 */
export async function getMatchInfo(matchId: string) {
  try {
    return await fetchCricketData("match_info", { id: matchId });
  } catch (error) {
    console.error(`[Cricket API] Failed to fetch match info for ${matchId}:`, error);
    throw error;
  }
}

/**
 * Get squad/players for a specific match
 */
export async function getMatchSquad(matchId: string): Promise<MatchSquad> {
  try {
    return await fetchCricketData("match_squad", { id: matchId });
  } catch (error) {
    console.error(`[Cricket API] Failed to fetch squad for ${matchId}:`, error);
    throw error;
  }
}

/**
 * Get live scorecard for a specific match
 */
export async function getMatchScorecard(matchId: string): Promise<MatchScorecard> {
  try {
    return await fetchCricketData("match_scorecard", { id: matchId });
  } catch (error) {
    console.error(`[Cricket API] Failed to fetch scorecard for ${matchId}:`, error);
    throw error;
  }
}

/**
 * Get fantasy points for players in a specific match
 */
export async function getMatchPoints(matchId: string, ruleset: number = 0): Promise<MatchPoints> {
  try {
    return await fetchCricketData("match_points", { id: matchId, ruleset: ruleset.toString() });
  } catch (error) {
    console.error(`[Cricket API] Failed to fetch points for ${matchId}:`, error);
    throw error;
  }
}

/**
 * Get series information
 */
export async function getSeriesInfo(seriesId: string) {
  try {
    return await fetchCricketData("series_info", { id: seriesId });
  } catch (error) {
    console.error(`[Cricket API] Failed to fetch series info for ${seriesId}:`, error);
    throw error;
  }
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
export function clearCache() {
  cache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
}
