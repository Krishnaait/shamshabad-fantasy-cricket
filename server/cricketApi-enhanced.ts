/**
 * Enhanced Cricket API Client
 * Fetches ALL cricket matches including domestic leagues, local tournaments, and regional cricket
 * Not just major international matches
 */

import * as cricketApi from "./cricketApi";

interface EnhancedMatch extends cricketApi.CurrentMatch {
  category?: "international" | "domestic" | "regional" | "local";
  seriesName?: string;
}

/**
 * Get ALL matches from the API including:
 * - Current/live matches
 * - All upcoming matches from all series (domestic, regional, local)
 * - Completed matches
 * 
 * This is more comprehensive than just currentMatches which only shows major matches
 */
export async function getAllMatchesComprehensive(): Promise<EnhancedMatch[]> {
  try {
    console.log("[Cricket API Enhanced] Fetching comprehensive match list...");
    
    // Get current/live matches (major matches)
    const currentMatches = await cricketApi.getCurrentMatches();
    console.log(`[Cricket API Enhanced] Current matches: ${currentMatches.length}`);
    
    // Get all series (this includes domestic leagues, regional tournaments, etc.)
    const allSeries = await cricketApi.getAllSeries();
    console.log(`[Cricket API Enhanced] Total series available: ${allSeries.length}`);
    
    // Fetch matches from ALL series (not just future ones)
    const seriesMatches: EnhancedMatch[] = [];
    const now = new Date();
    
    // Process all series to get their matches
    // Limit to 100 series to avoid overwhelming the API
    const seriesToProcess = allSeries.slice(0, 100);
    
    for (let i = 0; i < seriesToProcess.length; i++) {
      const series = seriesToProcess[i];
      try {
        const seriesInfo = await cricketApi.getSeriesInfo(series.id);
        
        if (seriesInfo && (seriesInfo.matchList || seriesInfo.matches)) {
          const matchList = seriesInfo.matchList || seriesInfo.matches || [];
          
          // Convert matches and add series information
          const enhancedMatches = matchList.map((match: any) => ({
            ...match,
            ms: match.matchStarted ? (match.matchEnded ? 'result' : 'live') : 'fixture',
            seriesName: seriesInfo.name || series.name || 'Unknown Series',
            category: categorizeMatch(seriesInfo.name || series.name || ''),
          } as EnhancedMatch));
          
          seriesMatches.push(...enhancedMatches);
          console.log(`[Cricket API Enhanced] Series "${seriesInfo.name}": ${enhancedMatches.length} matches`);
        }
        
        // Small delay to avoid rate limiting (50ms between requests)
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`[Cricket API Enhanced] Error fetching series ${series.id}:`, error);
        // Continue with next series
      }
    }
    
    // Combine current matches with series matches
    const allMatches = [
      ...currentMatches.map(m => ({
        ...m,
        category: "international" as const,
      })),
      ...seriesMatches,
    ];
    
    // Remove duplicates (same match might appear in multiple places)
    const uniqueMatches = Array.from(
      new Map(allMatches.map(m => [m.id, m])).values()
    );
    
    // Sort by date
    uniqueMatches.sort((a, b) => {
      const dateA = new Date(a.dateTimeGMT || a.date || 0).getTime();
      const dateB = new Date(b.dateTimeGMT || b.date || 0).getTime();
      
      // Live matches first
      const aIsLive = a.ms === "live" || (a.matchStarted && !a.matchEnded);
      const bIsLive = b.ms === "live" || (b.matchStarted && !b.matchEnded);
      
      if (aIsLive && !bIsLive) return -1;
      if (!aIsLive && bIsLive) return 1;
      
      return dateA - dateB;
    });
    
    console.log(`[Cricket API Enhanced] Total unique matches: ${uniqueMatches.length}`);
    return uniqueMatches;
  } catch (error) {
    console.error("[Cricket API Enhanced] Error fetching comprehensive matches:", error);
    return [];
  }
}

/**
 * Categorize match by series name
 */
function categorizeMatch(seriesName: string): "international" | "domestic" | "regional" | "local" {
  const name = (seriesName || "").toLowerCase();
  
  // Domestic leagues
  if (name.includes("ipl") || name.includes("indian premier league")) return "domestic";
  if (name.includes("big bash") || name.includes("bbl")) return "domestic";
  if (name.includes("caribbean premier league") || name.includes("cpl")) return "domestic";
  if (name.includes("psl") || name.includes("pakistan super league")) return "domestic";
  if (name.includes("bbl") || name.includes("big bash")) return "domestic";
  if (name.includes("t20 blast") || name.includes("blast")) return "domestic";
  if (name.includes("domestic") || name.includes("state") || name.includes("provincial")) return "regional";
  
  // Regional tournaments
  if (name.includes("regional") || name.includes("state") || name.includes("provincial")) return "regional";
  if (name.includes("zone") || name.includes("district")) return "regional";
  
  // Local/club cricket
  if (name.includes("club") || name.includes("local") || name.includes("community")) return "local";
  
  // Default to international
  return "international";
}

/**
 * Get matches by category
 */
export async function getMatchesByCategory(
  category: "international" | "domestic" | "regional" | "local"
): Promise<EnhancedMatch[]> {
  const allMatches = await getAllMatchesComprehensive();
  return allMatches.filter(m => m.category === category);
}

/**
 * Get matches by status (live, upcoming, completed)
 */
export async function getMatchesByStatus(
  status: "live" | "fixture" | "result"
): Promise<EnhancedMatch[]> {
  const allMatches = await getAllMatchesComprehensive();
  return allMatches.filter(m => m.ms === status);
}

/**
 * Get statistics about available matches
 */
export async function getMatchStatistics() {
  const allMatches = await getAllMatchesComprehensive();
  
  const stats = {
    total: allMatches.length,
    live: allMatches.filter(m => m.ms === "live").length,
    upcoming: allMatches.filter(m => m.ms === "fixture").length,
    completed: allMatches.filter(m => m.ms === "result").length,
    byCategory: {
      international: allMatches.filter(m => m.category === "international").length,
      domestic: allMatches.filter(m => m.category === "domestic").length,
      regional: allMatches.filter(m => m.category === "regional").length,
      local: allMatches.filter(m => m.category === "local").length,
    },
  };
  
  return stats;
}


/**
 * Fetch detailed data for a match including squad, scorecard, and fantasy points
 */
export async function getMatchDetailedData(matchId: string) {
  try {
    const [squad, scorecard, points] = await Promise.all([
      cricketApi.getMatchSquad(matchId).catch(() => null),
      cricketApi.getMatchScorecard(matchId).catch(() => null),
      cricketApi.getMatchPoints(matchId).catch(() => null),
    ]);
    
    return {
      squad,
      scorecard,
      points,
    };
  } catch (error) {
    console.error(`[Cricket API Enhanced] Error fetching detailed data for match ${matchId}:`, error);
    return { squad: null, scorecard: null, points: null };
  }
}

/**
 * Get enriched match data with squad, scorecard, and fantasy points
 */
export async function getEnrichedMatches(limit: number = 100): Promise<Array<EnhancedMatch & { details?: any }>> {
  const allMatches = await getAllMatchesComprehensive();
  const limitedMatches = allMatches.slice(0, limit);
  
  // Fetch detailed data for each match in parallel (in batches to avoid overwhelming API)
  const enrichedMatches = [];
  const batchSize = 10;
  
  for (let i = 0; i < limitedMatches.length; i += batchSize) {
    const batch = limitedMatches.slice(i, i + batchSize);
    
    const enrichedBatch = await Promise.all(
      batch.map(async (match) => {
        const details = await getMatchDetailedData(match.id);
        return {
          ...match,
          details,
        };
      })
    );
    
    enrichedMatches.push(...enrichedBatch);
    
    // Small delay between batches
    if (i + batchSize < limitedMatches.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return enrichedMatches;
}
