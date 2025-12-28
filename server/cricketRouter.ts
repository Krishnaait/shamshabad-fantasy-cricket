import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import * as cricketApi from "./cricketApi";

export const cricketRouter = router({
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
