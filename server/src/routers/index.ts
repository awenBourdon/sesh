import { router } from "../trpc";
import { spotsRouter } from "./spots.router";
import { usersRouter } from "./users.router";
import { authRouter } from "./auth.router";
import { tricksRouter } from "./tricks.router";

export const appRouter = router({
  spots: spotsRouter,
  users: usersRouter,
  auth: authRouter,
  trick: tricksRouter,
});

export type AppRouter = typeof appRouter;
