import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { spots } from "../db/schema";

export const spotsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(spots)),
  create: publicProcedure.input(z.object({ name: z.string().min(1) })).mutation(({ input }) => {
    return { id: Date.now(), name: input.name };
  }),
});
