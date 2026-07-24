import { router } from '../trpc';
import { spotsRouter } from './spot.router';

export const appRouter = router({
    spots: spotsRouter,
});

export type AppRouter = typeof appRouter;