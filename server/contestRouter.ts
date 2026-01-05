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
      const allContests = await getContests();
      const matchContests = allContests.filter((c) => c.matchId === input.matchId);
      
      // If no contests exist for this match, automatically seed them
      // This ensures the user always sees contests for upcoming matches
      if (matchContests.length === 0) {
        const sampleContests = [
          { name: "Mega Contest", entryFee: 0, prizePool: 1000, maxTeams: 100 },
          { name: "Head to Head", entryFee: 0, prizePool: 100, maxTeams: 2 },
          { name: "Winner Takes All", entryFee: 0, prizePool: 500, maxTeams: 10 },
        ];
        
        for (const contest of sampleContests) {
          await createContest({
            matchId: input.matchId,
            name: contest.name,
            entryFee: contest.entryFee,
            prizePool: contest.prizePool,
            maxTeams: contest.maxTeams,
            description: `Join the ${contest.name} and win big!`,
          });
        }
        
        // Fetch again after seeding
        const updatedContests = await getContests();
        return updatedContests.filter((c) => c.matchId === input.matchId);
      }
      
      return matchContests;
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
