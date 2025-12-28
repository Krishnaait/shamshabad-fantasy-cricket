import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authRouter } from "./authRouter.js";
import { cricketRouter } from "./cricketRouter.js";
import { teamRouter } from "./teamRouter.js";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  cricket: cricketRouter,
  team: teamRouter,
});

export type AppRouter = typeof appRouter;
