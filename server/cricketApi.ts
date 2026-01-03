/**
 * Cricket Data API Client
 * API Provider: https://cricketdata.org
 * Base URL: https://api.cricapi.com/v1
 */

const API_KEY = "1a822521-d7e0-46ff-98d3-3e51020863f3";
const API_BASE_URL = "https://api.cricapi.com/v1";

interface ApiResponse<T> {
  apikey: string;
  data: T;
  status: string;
  info?: {
    hitsToday: number;
    hitsUsed: number;
    hitsLimit: number;
    credits: number;
    server: number;
    queryTime: number;
  };
}

/**
 * Generic API fetch helper
 */
async function fetchCricketData<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  url.searchParams.append("apikey", API_KEY);

  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }

  try {
    const response = await fetch(url.toString());
    const data: ApiResponse<T> = await response.json();

    if (data.status !== "success") {
      throw new Error(`API Error: ${data.status}`);
    }

    return data.data;
  } catch (error) {
    console.error(`[Cricket API] Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Match Data Types
 */
export interface MatchData {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
  score?: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
  }>;
  series_id: string;
  fantasyEnabled: boolean;
  bbbEnabled?: boolean;
  hasSquad?: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
  tossWinner?: string;
  tossChoice?: string;
  matchWinner?: string;
}

export interface CurrentMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
  score?: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
  }>;
  series_id: string;
  fantasyEnabled: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
  ms?: string; // Match state: fixture, live, result
  t1?: string;
  t2?: string;
  t1img?: string;
  t2img?: string;
}

export interface PlayerData {
  id: string;
  name: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  country?: string;
  playerImg?: string;
}

export interface SquadData {
  teamName: string;
  shortname: string;
  img: string;
  players: PlayerData[];
}

export interface BattingPerformance {
  batsman: {
    id: string;
    name: string;
  };
  dismissal?: string;
  bowler?: {
    id: string;
    name: string;
  };
  catcher?: {
    id: string;
    name: string;
  };
  "dismissal-text"?: string;
  r: number;
  b: number;
  "4s": number;
  "6s": number;
  sr: number;
}

export interface BowlingPerformance {
  bowler: {
    id: string;
    name: string;
  };
  o: number;
  m: number;
  r: number;
  w: number;
  nb?: number;
  wd?: number;
  eco: number;
}

export interface ScorecardInning {
  batting: BattingPerformance[];
  bowling: BowlingPerformance[];
  catching?: Array<{
    catcher: {
      id: string;
      name: string;
    };
    catches: number;
  }>;
  extras?: {
    total: number;
    byes?: number;
    legbyes?: number;
    wides?: number;
    noballs?: number;
  };
  totals?: {
    runs: number;
    wickets: number;
    overs: number;
  };
  inning: string;
}

export interface ScorecardData extends MatchData {
  scorecard: ScorecardInning[];
}

export interface PlayerPoints {
  id: string;
  name: string;
  altnames?: string[];
  points: number;
}

export interface PointsInning {
  inning: string;
  batting: PlayerPoints[];
  bowling: PlayerPoints[];
  catching?: PlayerPoints[];
}

export interface MatchPointsData {
  innings: PointsInning[];
  totals?: PlayerPoints[];
}

export interface PlayerInfo {
  id: string;
  name: string;
  country: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  playerImg?: string;
  stats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
  };
}

export interface SeriesInfo {
  id: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  odi?: number;
  t20?: number;
  test?: number;
  squads?: number;
  matches?: MatchData[];
  matchList?: MatchData[]; // API returns matchList instead of matches
  info?: any;
}

/**
 * 1. eCricScore - Current and upcoming matches
 * Returns matches with basic details and match state (fixture, live, result)
 */
export async function getCurrentMatches(): Promise<CurrentMatch[]> {
  try {
    const data = await fetchCricketData<CurrentMatch[]>("currentMatches");
    return data;
  } catch (error) {
    console.error("[Cricket API] Error fetching current matches:", error);
    return [];
  }
}

/**
 * 2. Matches - Comprehensive list of all matches
 */
export async function getAllMatches(): Promise<MatchData[]> {
  try {
    const data = await fetchCricketData<MatchData[]>("matches");
    return data;
  } catch (error) {
    console.error("[Cricket API] Error fetching all matches:", error);
    return [];
  }
}

/**
 * 3. Match Info - Detailed information for a specific match
 */
export async function getMatchInfo(matchId: string): Promise<MatchData | null> {
  try {
    const data = await fetchCricketData<MatchData>("match_info", { id: matchId });
    return data;
  } catch (error) {
    console.error(`[Cricket API] Error fetching match info for ${matchId}:`, error);
    return null;
  }
}

/**
 * 4. Match Squad - Player squads for both teams
 */
export async function getMatchSquad(matchId: string): Promise<SquadData[]> {
  try {
    const data = await fetchCricketData<SquadData[]>("match_squad", { id: matchId });
    return data;
  } catch (error) {
    console.error(`[Cricket API] Error fetching squad for ${matchId}:`, error);
    return [];
  }
}

/**
 * 5. Match Scorecard - Detailed scorecard with batting/bowling stats
 */
export async function getMatchScorecard(matchId: string): Promise<ScorecardData | null> {
  try {
    const data = await fetchCricketData<ScorecardData>("match_scorecard", { id: matchId });
    return data;
  } catch (error) {
    console.error(`[Cricket API] Error fetching scorecard for ${matchId}:`, error);
    return null;
  }
}

/**
 * 6. Match Points - Fantasy points for each player
 */
export async function getMatchPoints(matchId: string, ruleset: number = 0): Promise<MatchPointsData | null> {
  try {
    const data = await fetchCricketData<MatchPointsData>("match_points", {
      id: matchId,
      ruleset: ruleset.toString(),
    });
    return data;
  } catch (error) {
    console.error(`[Cricket API] Error fetching points for ${matchId}:`, error);
    return null;
  }
}

/**
 * 7. Player Info - Detailed player statistics
 */
export async function getPlayerInfo(playerId: string): Promise<PlayerInfo | null> {
  try {
    const data = await fetchCricketData<PlayerInfo>("players_info", { id: playerId });
    return data;
  } catch (error) {
    console.error(`[Cricket API] Error fetching player info for ${playerId}:`, error);
    return null;
  }
}

/**
 * 7. Get All Series - List of all cricket series
 */
export async function getAllSeries(): Promise<SeriesInfo[]> {
  try {
    const data = await fetchCricketData<SeriesInfo[]>("series");
    return data;
  } catch (error) {
    console.error("[Cricket API] Error fetching series list:", error);
    return [];
  }
}

/**
 * 8. Series Info - Information about a specific series including matches
 */
export async function getSeriesInfo(seriesId: string): Promise<SeriesInfo | null> {
  try {
    const data = await fetchCricketData<SeriesInfo>("series_info", { id: seriesId });
    return data;
  } catch (error) {
    console.error(`[Cricket API] Error fetching series info for ${seriesId}:`, error);
    return null;
  }
}

/**
 * 9. Get Upcoming Matches from Future Series
 * Fetches matches from series that haven't ended yet
 */
export async function getUpcomingSeriesMatches(): Promise<CurrentMatch[]> {
  try {
    const allSeries = await getAllSeries();
    const now = new Date();
    
    // Filter for series that haven't started or are ongoing (use startDate which has full date)
    const futureSeries = allSeries.filter(series => {
      try {
        if (!series.startDate) return false;
        const startDate = new Date(series.startDate);
        // Include series starting within next 12 months
        const oneYearFromNow = new Date(now);
        oneYearFromNow.setFullYear(now.getFullYear() + 1);
        return startDate >= now && startDate <= oneYearFromNow;
      } catch (e) {
        return false;
      }
    });
    
    console.log(`[Cricket API] Found ${futureSeries.length} future series`);
    
    // Fetch matches from first 50 future series sequentially to avoid overwhelming API
    const seriesInfos = [];
    for (const series of futureSeries.slice(0, 50)) {
      try {
        const info = await getSeriesInfo(series.id);
        if (info) seriesInfos.push(info);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`[Cricket API] Error fetching series ${series.id}:`, error);
        // Continue with next series
      }
    }
    
    // Extract matches from series
    const allMatches: CurrentMatch[] = [];
    for (const seriesInfo of seriesInfos) {
      if (seriesInfo) {
        // API returns matchList, not matches
        const matchList = seriesInfo.matchList || seriesInfo.matches || [];
        if (matchList.length > 0) {
          // Convert MatchData to CurrentMatch format
          const matches = matchList.map(match => ({
            ...match,
            ms: match.matchStarted ? (match.matchEnded ? 'result' : 'live') : 'fixture'
          } as CurrentMatch));
          allMatches.push(...matches);
        }
      }
    }
    
    console.log(`[Cricket API] Found ${allMatches.length} matches from future series`);
    return allMatches;
  } catch (error) {
    console.error("[Cricket API] Error fetching upcoming series matches:", error);
    return [];
  }
}

/**
 * Helper: Filter matches by state
 */
export function filterMatchesByState(matches: CurrentMatch[], state: "fixture" | "live" | "result"): CurrentMatch[] {
  return matches.filter((match) => match.ms === state);
}

/**
 * Helper: Get upcoming matches (today and future)
 */
export function getUpcomingMatches(matches: CurrentMatch[]): CurrentMatch[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return matches.filter((match) => {
    if (match.ms === "result") return false;
    
    const matchDate = new Date(match.dateTimeGMT);
    return matchDate >= today;
  });
}

/**
 * Helper: Get live matches
 */
export function getLiveMatches(matches: CurrentMatch[]): CurrentMatch[] {
  return filterMatchesByState(matches, "live");
}

/**
 * Helper: Get completed matches
 */
export function getCompletedMatches(matches: CurrentMatch[]): CurrentMatch[] {
  return filterMatchesByState(matches, "result");
}

/**
 * Helper: Check if match has fantasy data available
 */
export function isFantasyEnabled(match: MatchData | CurrentMatch): boolean {
  return match.fantasyEnabled === true;
}

/**
 * Cache management (simple in-memory cache)
 */
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minute for live data

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Cached version of getCurrentMatches
 */
export async function getCurrentMatchesCached(): Promise<CurrentMatch[]> {
  const cacheKey = "current_matches";
  const cached = getCachedData<CurrentMatch[]>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const matches = await getCurrentMatches();
  setCachedData(cacheKey, matches);
  return matches;
}
