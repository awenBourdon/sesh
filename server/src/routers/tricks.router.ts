import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { tricks, spots } from "../db/schema";
import { eq, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const newSpotInput = z.object({
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export const tricksRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        spot: z.union([
          z.object({ spotId: z.number() }),
          newSpotInput,
        ]),
      }),
    )
    .mutation(async ({ input }) => {
      return db.transaction(async (tx) => {
        let spotId: number;

        if ("spotId" in input.spot) {
          const [existing] = await tx
            .select()
            .from(spots)
            .where(eq(spots.id, input.spot.spotId));

          if (!existing) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Spot introuvable" });
          }
          spotId = existing.id;
        } else {
          const [created] = await tx.insert(spots).values(input.spot).returning();
          spotId = created.id;
        }

        const [trick] = await tx
          .insert(tricks)
          .values({ name: input.name, spotId })
          .returning();

        return trick;
      });
    }),

  listBySpot: publicProcedure
    .input(z.object({ spotId: z.number() }))
    .query(async ({ input }) => {
      return db.select().from(tricks).where(eq(tricks.spotId, input.spotId));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.transaction(async (tx) => {
        const [deleted] = await tx.delete(tricks).where(eq(tricks.id, input.id)).returning();

        if (!deleted) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Trick introuvable" });
        }

        const [{ value: remaining }] = await tx
          .select({ value: count() })
          .from(tricks)
          .where(eq(tricks.spotId, deleted.spotId));

        if (remaining === 0) {
          await tx.delete(spots).where(eq(spots.id, deleted.spotId));
        }

        return { success: true, spotDeleted: remaining === 0 };
      });
    }),
});