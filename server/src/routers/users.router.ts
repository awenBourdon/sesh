import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string().min(3).max(30),
        passwordHash: z.string(), // à hasher
      }),
    )
    .mutation(async ({ input }) => {
      const [user] = await db.insert(users).values(input).returning();
      return user;
    }),

  getAll: publicProcedure.query(async () => {
    return db.select().from(users);
  }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const [user] = await db.select().from(users).where(eq(users.id, input.id));

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Utilisateur introuvable" });
    }

    return user;
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        email: z.string().email().optional(),
        username: z.string().min(3).max(30).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Utilisateur introuvable" });
      }

      return updated;
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const [deleted] = await db.delete(users).where(eq(users.id, input.id)).returning();

    if (!deleted) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Utilisateur introuvable" });
    }

    return { success: true };
  }),
});
