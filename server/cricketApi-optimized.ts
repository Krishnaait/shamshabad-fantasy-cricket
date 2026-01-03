/**
 * Optimized Cricket API Client
 * Fetches matches with intelligent caching and timeout handling
 */

import * as cricketApi from "./cricketApi";

interface CachedData {
  data: any;
  timestamp: number;
}

// Cache for API responses
const cache = new Map<string, CachedData>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

/**
 * Get cached data if available and not expired
 */
function getCached(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

/**
 * Set cached data
 */
function setCached(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Get all matches with optimized fetching
 * Uses cached data and limits series processing
 */
export async function getAllMatchesOptimized() {
  const cacheKey = "all_matches_optimized";
  const cached = getCached(cacheKey);
  
  if (cached) {
    console.log("[Cricket API Optimized] Returning cached matches");
    return cached;
  }
  
  try {
    console.log("[Cricket API Optimized] Fetching all matches...");
    
    // Get current/live matches (fast)
    const currentMatches = await cricketApi.getCurrentMatches();
    console.log(`[Cricket API Optimized] Current matches: ${currentMatches.length}`);
    
    // Get upcoming series matches (already cached in cricketApi)
    const upcomingMatches = await cricketApi.getUpcomingSeriesMatches();
    console.log(`[Cricket API Optimized] Upcoming series matches: ${upcomingMatches.length}`);
    
    // Combine and deduplicate
    const allMatches = [...currentMatches, ...upcomingMatches];
    const uniqueMatches = Array.from(
      new Map(allMatches.map((m: any) => [m.id, m])).values()
    );
    
    // Sort by date with live matches first
    uniqueMatches.sort((a: any, b: any) => {
      const aIsLive = a.ms === "live" || (a.matchStarted && !a.matchEnded);
      const bIsLive = b.ms === "live" || (b.matchStarted && !b.matchEnded);
      
      if (aIsLive && !bIsLive) return -1;
      if (!aIsLive && bIsLive) return 1;
      
      const dateA = new Date(a.dateTimeGMT || a.date || 0).getTime();
      const dateB = new Date(b.dateTimeGMT || b.date || 0).getTime();
      return dateA - dateB;
    });
    
    console.log(`[Cricket API Optimized] Total unique matches: ${uniqueMatches.length}`);
    
    // Cache the results
    setCached(cacheKey, uniqueMatches);
    
    return uniqueMatches;
  } catch (error) {
    console.error("[Cricket API Optimized] Error fetching matches:", error);
    return [];
  }
}

/**
 * Get matches by status
 */
export async function getMatchesByStatus(status: "live" | "fixture" | "result") {
  const allMatches = await getAllMatchesOptimized();
  
  const statusMap = {
    live: "live",
    fixture: "fixture",
    result: "result",
  };
  
  return allMatches.filter((m: any) => m.ms === statusMap[status]);
}

/**
 * Get match statistics
 */
export async function getMatchStatistics() {
  const allMatches = await getAllMatchesOptimized();
  
  return {
    total: allMatches.length,
    live: allMatches.filter((m: any) => m.ms === "live").length,
    upcoming: allMatches.filter((m: any) => m.ms === "fixture").length,
    completed: allMatches.filter((m: any) => m.ms === "result").length,
  };
}

/**
 * Clear cache
 */
export function clearCache() {
  cache.clear();
  console.log("[Cricket API Optimized] Cache cleared");
}
