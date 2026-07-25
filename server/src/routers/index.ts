import { router } from '../trpc';
import { spotsRouter } from './spots.router';
import { usersRouter } from './users.router';
import { authRouter } from './auth.router'; 

export const appRouter = router({
    spots: spotsRouter,
    users: usersRouter,
    auth: authRouter, 
});

export type AppRouter = typeof appRouter;