import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import * as cricketApi from "./cricketApi";
import * as cricketApiEnhanced from "./cricketApi-enhanced";

export const cricketRouter = router({
  getCurrentMatches: publicProcedure.query(async () => {
    try {
      // Fetch both current/recent matches and upcoming series matches
      const [currentMatches, upcomingMatches] = await Promise.all([
        cricketApi.getCurrentMatches(),
        cricketApi.getUpcomingSeriesMatches()
      ]);
      
      // Combine and deduplicate by match ID
      const allMatches = [...currentMatches, ...upcomingMatches];
      const uniqueMatches = Array.from(
        new Map(allMatches.map(match => [match.id, match])).values()
      );
      
      // Sort matches by date: Today first, then tomorrow, etc.
      const sortedMatches = uniqueMatches.sort((a, b) => {
        // First priority: Live matches (matchStarted but not matchEnded)
        const aIsLive = a.matchStarted && !a.matchEnded;
        const bIsLive = b.matchStarted && !b.matchEnded;
        if (aIsLive && !bIsLive) return -1;
        if (!aIsLive && bIsLive) return 1;
        
        // Second priority: Sort by date
        const dateA = new Date(a.dateTimeGMT || a.date).getTime();
        const dateB = new Date(b.dateTimeGMT || b.date).getTime();
        return dateA - dateB;
      });
      
      console.log(`[Cricket Router] Returning ${sortedMatches.length} total matches (${currentMatches.length} current + ${upcomingMatches.length} upcoming), sorted by date`);
      return sortedMatches;
    } catch (error) {
      console.error("[Cricket Router] Error fetching matches:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch current matches",
      });
    }
  }),
  
  getMatches: publicProcedure.query(async () => {
    try {
      const matches = await cricketApi.getAllMatches();
      return matches;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch matches",
      });
    }
  }),
  
  getMatchInfo: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const matchInfo = await cricketApi.getMatchInfo(input.matchId);
        return matchInfo;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch match info",
        });
      }
    }),
    
  getMatchSquad: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const squad = await cricketApi.getMatchSquad(input.matchId);
        return squad;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch squad",
        });
      }
    }),
    
  getMatchScorecard: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const scorecard = await cricketApi.getMatchScorecard(input.matchId);
        return scorecard;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch scorecard",
        });
      }
    }),
    
  getMatchPoints: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const points = await cricketApi.getMatchPoints(input.matchId);
        return points;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch points",
        });
      }
    }),
    
  getAllMatchesComprehensive: publicProcedure.query(async () => {
    try {
      const matches = await cricketApiEnhanced.getAllMatchesComprehensive();
      return matches;
    } catch (error) {
      console.error("[Cricket Router] Error fetching comprehensive matches:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch comprehensive matches",
      });
    }
  }),
  
  getMatchesByCategory: publicProcedure
    .input(z.object({ category: z.enum(["international", "domestic", "regional", "local"]) }))
    .query(async ({ input }) => {
      try {
        const matches = await cricketApiEnhanced.getMatchesByCategory(input.category);
        return matches;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch ${input.category} matches`,
        });
      }
    }),
    
  getMatchesByStatus: publicProcedure
    .input(z.object({ status: z.enum(["live", "fixture", "result"]) }))
    .query(async ({ input }) => {
      try {
        const matches = await cricketApiEnhanced.getMatchesByStatus(input.status);
        return matches;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch ${input.status} matches`,
        });
      }
    }),
    
  getMatchStatistics: publicProcedure.query(async () => {
    try {
      const stats = await cricketApiEnhanced.getMatchStatistics();
      return stats;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch match statistics",
      });
    }
  }),
    
  getMatchDetailedData: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const details = await cricketApiEnhanced.getMatchDetailedData(input.matchId);
        return details;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch match detailed data",
        });
      }
    }),
    
  getEnrichedMatches: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      try {
        const matches = await cricketApiEnhanced.getEnrichedMatches(input.limit || 100);
        return matches;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch enriched matches",
        });
      }
    }),
});
