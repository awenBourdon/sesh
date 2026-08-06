import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { SerializeOptions } from "@fastify/cookie";

const envSchema = z.object({
  JWT_SECRET: z.string().min(32, "JWT_SECRET doit faire au moins 32 caractères"),
});
const env = envSchema.parse(process.env);

const JWT_EXPIRES_IN = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

const AUTH_COOKIE_OPTIONS: SerializeOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: COOKIE_MAX_AGE,
  path: "/",
};

const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing-safety", 10);

function signToken(userId: number) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string().min(3),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const passwordHash = await bcrypt.hash(input.password, 10);

      const [user] = await db
        .insert(users)
        .values({
          email: input.email,
          username: input.username,
          passwordHash,
        })
        .returning();

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Échec de la création du compte",
        });
      }

      const token = signToken(user.id);
      ctx.res.setCookie("token", token, AUTH_COOKIE_OPTIONS);

      return { id: user.id, username: user.username };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [user] = await db.select().from(users).where(eq(users.email, input.email));

      const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
      const passwordValid = await bcrypt.compare(input.password, hashToCompare);

      if (!user || !passwordValid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Identifiants invalides" });
      }

      const token = signToken(user.id);
      ctx.res.setCookie("token", token, AUTH_COOKIE_OPTIONS);

      return { id: user.id, username: user.username };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return { id: ctx.user.id, username: ctx.user.username };
  }),

  logout: protectedProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("token", AUTH_COOKIE_OPTIONS);
    return { success: true };
  }),
});
