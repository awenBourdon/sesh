import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      username: z.string().min(3),
      password: z.string().min(8),
    }))
    .mutation(async ({ input, ctx }) => {
      const passwordHash = await bcrypt.hash(input.password, 10);

      const [user] = await db.insert(users).values({
        email: input.email,
        username: input.username,
        passwordHash,
      }).returning();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      ctx.res.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'lax' });

      return { id: user.id, username: user.username };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [user] = await db.select().from(users).where(eq(users.email, input.email));

      if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Identifiants invalides' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      ctx.res.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'lax' });

      return { id: user.id, username: user.username };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return { id: ctx.user.id, username: ctx.user.username };
  }),
});