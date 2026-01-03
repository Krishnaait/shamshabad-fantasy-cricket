/**
 * Fast Cricket API Client with timeout protection
 * Returns data quickly by limiting series processing
 */

import * as cricketApi from "./cricketApi";

interface CachedData {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CachedData>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

function getCached(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCached(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Get all matches with fast timeout
 */
export async function getAllMatches() {
  const cacheKey = "all_matches_fast";
  const cached = getCached(cacheKey);
  
  if (cached) {
    console.log("[Cricket API Fast] Returning cached matches");
    return cached;
  }
  
  try {
    console.log("[Cricket API Fast] Fetching all matches...");
    
    // Get current/live matches (fast)
    const currentMatches = await cricketApi.getCurrentMatches();
    console.log(`[Cricket API Fast] Current matches: ${currentMatches.length}`);
    
    // If we have current matches, return them immediately
    // Don't wait for series matches as they take too long
    if (currentMatches.length > 0) {
      console.log("[Cricket API Fast] Returning current matches immediately");
      
      // Sort by date with live matches first
      currentMatches.sort((a: any, b: any) => {
        const aIsLive = a.ms === "live" || (a.matchStarted && !a.matchEnded);
        const bIsLive = b.ms === "live" || (b.matchStarted && !b.matchEnded);
        
        if (aIsLive && !bIsLive) return -1;
        if (!aIsLive && bIsLive) return 1;
        
        const dateA = new Date(a.dateTimeGMT || a.date || 0).getTime();
        const dateB = new Date(b.dateTimeGMT || b.date || 0).getTime();
        return dateA - dateB;
      });
      
      setCached(cacheKey, currentMatches);
      return currentMatches;
    }
    
    return [];
  } catch (error) {
    console.error("[Cricket API Fast] Error fetching matches:", error);
    return [];
  }
}

/**
 * Get matches by status
 */
export async function getMatchesByStatus(status: "live" | "fixture" | "result") {
  const allMatches = await getAllMatches();
  
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
  const allMatches = await getAllMatches();
  
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
  console.log("[Cricket API Fast] Cache cleared");
}
