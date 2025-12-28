import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getMatchPoints } from "./cricketApi";
import { getUserTeamWithPlayers, updateTeamPoints } from "./dbTeams";

export const pointsRouter = router({
  /**
   * Calculate and update fantasy points for a team
   * Fetches player performance from Cricket API and applies fantasy scoring rules
   */
  calculateTeamPoints: publicProcedure
    .input(z.object({ teamId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }

      // Get team with players
      const team = await getUserTeamWithPlayers(input.teamId);
      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
      }

      // Verify ownership
      if (team.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your team" });
      }

      // Fetch match points from Cricket API
      const matchPoints: any = await getMatchPoints(team.matchId);
      if (!matchPoints || !matchPoints.data) {
        throw new TRPCError({ 
          code: "NOT_FOUND", 
          message: "Match points not available yet. Points are calculated after the match is completed." 
        });
      }

      // Calculate total fantasy points
      let totalPoints = 0;
      const playerPoints: Record<number, number> = {};

      for (const player of team.players) {
        // Find player's performance in API response
        const playerData = matchPoints.data.find(
          (p: any) => p.pid === player.playerId || p.name === player.playerName
        );

        if (!playerData) {
          playerPoints[player.id] = 0;
          continue;
        }

        // Calculate base fantasy points
        let points = 0;
        
        // Batting points
        if (playerData.batting) {
          points += (playerData.batting.run || 0) * 1; // 1 point per run
          points += (playerData.batting.fours || 0) * 1; // 1 point per four
          points += (playerData.batting.sixes || 0) * 2; // 2 points per six
          
          // Strike rate bonus (if SR > 150)
          const sr = playerData.batting.sr || 0;
          if (sr > 150) points += 5;
        }

        // Bowling points
        if (playerData.bowling) {
          points += (playerData.bowling.wicket || 0) * 25; // 25 points per wicket
          points += (playerData.bowling.maidens || 0) * 10; // 10 points per maiden
          
          // Economy rate bonus (if ER < 6)
          const er = playerData.bowling.economy || 999;
          if (er < 6) points += 5;
        }

        // Fielding points
        if (playerData.fielding) {
          points += (playerData.fielding.catch || 0) * 8; // 8 points per catch
          points += (playerData.fielding.stumping || 0) * 12; // 12 points per stumping
          points += (playerData.fielding.runout || 0) * 6; // 6 points per runout
        }

        // Apply captain/vice-captain multipliers
        if (player.isCaptain) {
          points *= 2; // Captain gets 2x points
        } else if (player.isViceCaptain) {
          points *= 1.5; // Vice-captain gets 1.5x points
        }

        playerPoints[player.id] = Math.round(points);
        totalPoints += Math.round(points);
      }

      // Update team and player points in database
      await updateTeamPoints(input.teamId, totalPoints, playerPoints);

      return {
        success: true,
        totalPoints,
        playerPoints,
        message: "Fantasy points calculated successfully!",
      };
    }),

  /**
   * Get team points breakdown
   */
  getTeamPoints: publicProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }

      const team = await getUserTeamWithPlayers(input.teamId);
      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
      }

      // Verify ownership
      if (team.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your team" });
      }

      return {
        teamId: team.id,
        teamName: team.teamName,
        totalPoints: team.totalPoints || 0,
        players: team.players.map((p: any) => ({
          id: p.id,
          playerName: p.playerName,
          role: p.role,
          points: p.points || 0,
          isCaptain: p.isCaptain,
          isViceCaptain: p.isViceCaptain,
        })),
      };
    }),
});
