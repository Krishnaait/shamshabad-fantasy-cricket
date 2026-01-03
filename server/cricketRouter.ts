import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import * as cricketApiFixed from "./cricketApi-fixed";

export const cricketRouter = router({
  // Get all matches
  getAllMatches: publicProcedure.query(async () => {
    try {
      const matches = await cricketApiFixed.getAllMatches();
      return matches;
    } catch (error) {
      console.error("[Cricket Router] Error fetching all matches:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch matches",
      });
    }
  }),

  // Get matches by status
  getMatchesByStatus: publicProcedure
    .input(z.object({ status: z.enum(["live", "fixture", "result"]) }))
    .query(async ({ input }) => {
      try {
        const matches = await cricketApiFixed.getMatchesByStatus(input.status);
        return matches;
      } catch (error) {
        console.error("[Cricket Router] Error fetching matches by status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch ${input.status} matches`,
        });
      }
    }),

  // Get match statistics
  getMatchStatistics: publicProcedure.query(async () => {
    try {
      const stats = await cricketApiFixed.getMatchStatistics();
      return stats;
    } catch (error) {
      console.error("[Cricket Router] Error fetching statistics:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch match statistics",
      });
    }
  }),

  // Get live score for a match
  getLiveScore: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const score = await cricketApiFixed.getLiveScore(input.matchId);
        return score;
      } catch (error) {
        console.error("[Cricket Router] Error fetching live score:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch live score",
        });
      }
    }),

  // Get match squad
  getMatchSquad: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const squad = await cricketApiFixed.getMatchSquad(input.matchId);
        return squad;
      } catch (error) {
        console.error("[Cricket Router] Error fetching squad:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch match squad",
        });
      }
    }),

  // Get match scorecard
  getMatchScorecard: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const scorecard = await cricketApiFixed.getMatchScorecard(input.matchId);
        return scorecard;
      } catch (error) {
        console.error("[Cricket Router] Error fetching scorecard:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch match scorecard",
        });
      }
    }),

  // Get fantasy points
  getFantasyPoints: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      try {
        const points = await cricketApiFixed.getFantasyPoints(input.matchId);
        return points;
      } catch (error) {
        console.error("[Cricket Router] Error fetching fantasy points:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch fantasy points",
        });
      }
    }),
});
