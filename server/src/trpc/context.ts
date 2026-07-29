import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import "@fastify/cookie";

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const token = req.cookies?.token;
  let user = null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      const result = await db.select().from(users).where(eq(users.id, payload.userId));
      user = result[0] ?? null;
    } catch {
      user = null;
    }
  }

  return { db, user, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
