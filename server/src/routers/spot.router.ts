import { router, publicProcedure} from '../trpc';
import { z } from 'zod';

export const spotsRouter = router({
    getAll: publicProcedure.query(() => {
        return [{ id: 1, name: 'Hello Spot'}];
    }),
    create: publicProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(({ input}) => {
            return { id: Date.now(), name: input.name}
        }),
});