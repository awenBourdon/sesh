import { router } from '../trpc';
import { spotsRouter } from './spots.router';
import { usersRouter } from './users.router';

export const appRouter = router({
    spots: spotsRouter,
    users: usersRouter,
});

export type AppRouter = typeof appRouter;