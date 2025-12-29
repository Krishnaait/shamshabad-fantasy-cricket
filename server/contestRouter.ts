import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getContests,
  getContestById,
  joinContest,
  getUserContests,
  getContestLeaderboard,
  createContest,
  updateContestStatus,
} from "./dbContests";

export const contestRouter = router({
  // Get all available contests
  getAll: publicProcedure.query(async () => {
    return await getContests();
  }),

  // Get contests by match
  getByMatch: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      const contests = await getContests();
      return contests.filter((c) => c.matchId === input.matchId);
    }),

  // Get contest details
  getDetails: publicProcedure
    .input(z.object({ contestId: z.number() }))
    .query(async ({ input }) => {
      return await getContestById(input.contestId);
    }),

  // Get user's joined contests
  getMyContests: protectedProcedure.query(async ({ ctx }) => {
    return await getUserContests(ctx.user.id);
  }),

  // Join a contest
  joinContest: protectedProcedure
    .input(
      z.object({
        contestId: z.number(),
        teamId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await joinContest({
        userId: ctx.user.id,
        contestId: input.contestId,
        teamId: input.teamId,
      });
    }),

  // Get contest leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({ contestId: z.number() }))
    .query(async ({ input }) => {
      return await getContestLeaderboard(input.contestId);
    }),

  // Create a new contest (admin only)
  create: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        entryFee: z.number().min(0),
        prizePool: z.number().min(0),
        maxTeams: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only admins can create contests
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create contests");
      }

      return await createContest({
        matchId: input.matchId,
        name: input.name,
        description: input.description,
        entryFee: input.entryFee,
        prizePool: input.prizePool,
        maxTeams: input.maxTeams,
      });
    }),

  // Update contest status (admin only)
  updateStatus: protectedProcedure
    .input(
      z.object({
        contestId: z.number(),
        status: z.enum(["upcoming", "live", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can update contests");
      }

      return await updateContestStatus(input.contestId, input.status);
    }),
});
