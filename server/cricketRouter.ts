import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import * as cricketApi from "./cricketApi";

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
      
      console.log(`[Cricket Router] Returning ${uniqueMatches.length} total matches (${currentMatches.length} current + ${upcomingMatches.length} upcoming)`);
      return uniqueMatches;
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
});
