import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getMatchSquad } from "./cricketApi";
import {
  createUserTeam,
  getUserTeams,
  getTeamById,
  getUserTeamsForMatch,
  addTeamPlayers,
  getTeamPlayers,
  deleteTeam,
  updateTeamName,
} from "./dbTeams";

export const teamRouter = router({
  // Get squad for a match
  getMatchSquad: protectedProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ input }) => {
      const squad = await getMatchSquad(input.matchId);
      return squad;
    }),

  // Create a new team
  createTeam: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
        teamName: z.string().min(1).max(100),
        players: z.array(
          z.object({
            playerId: z.string(),
            playerName: z.string(),
            role: z.string(),
            isCaptain: z.boolean(),
            isViceCaptain: z.boolean(),
          })
        ).length(11), // Must have exactly 11 players
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate captain and vice-captain
      const captains = input.players.filter((p) => p.isCaptain);
      const viceCaptains = input.players.filter((p) => p.isViceCaptain);

      if (captains.length !== 1) {
        throw new Error("Must have exactly 1 captain");
      }
      if (viceCaptains.length !== 1) {
        throw new Error("Must have exactly 1 vice-captain");
      }
      if (captains[0]?.playerId === viceCaptains[0]?.playerId) {
        throw new Error("Captain and vice-captain must be different players");
      }

      // Create the team
      const team = await createUserTeam({
        userId: ctx.user.id,
        matchId: input.matchId,
        teamName: input.teamName,
        totalPoints: 0,
      });

      // Add players to the team
      const teamPlayers = input.players.map((player) => ({
        teamId: team.insertId,
        playerId: player.playerId,
        playerName: player.playerName,
        role: player.role,
        isCaptain: player.isCaptain ? 1 : 0,
        isViceCaptain: player.isViceCaptain ? 1 : 0,
        points: 0,
      }));

      await addTeamPlayers(teamPlayers);

      return { success: true, teamId: team.insertId };
    }),

  // Get all teams for current user
  getMyTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await getUserTeams(ctx.user.id);
    return teams;
  }),

  // Get teams for a specific match
  getMyTeamsForMatch: protectedProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const teams = await getUserTeamsForMatch(ctx.user.id, input.matchId);
      return teams;
    }),

  // Get team details with players
  getTeamDetails: protectedProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ ctx, input }) => {
      const team = await getTeamById(input.teamId);
      if (!team) {
        throw new Error("Team not found");
      }
      if (team.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const players = await getTeamPlayers(input.teamId);
      return { team, players };
    }),

  // Delete a team
  deleteTeam: protectedProcedure
    .input(z.object({ teamId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const team = await getTeamById(input.teamId);
      if (!team) {
        throw new Error("Team not found");
      }
      if (team.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await deleteTeam(input.teamId);
      return { success: true };
    }),

  // Update team name
  updateTeamName: protectedProcedure
    .input(z.object({ teamId: z.number(), teamName: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const team = await getTeamById(input.teamId);
      if (!team) {
        throw new Error("Team not found");
      }
      if (team.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await updateTeamName(input.teamId, input.teamName);
      return { success: true };
    }),
});
