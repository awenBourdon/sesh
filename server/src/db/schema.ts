import { pgTable, serial, text, timestamp, doublePrecision, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Spots
export const spots = pgTable("spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Spot = typeof spots.$inferSelect;
export type NewSpot = typeof spots.$inferInsert;

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  username: text("username").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;

// Tricks
export const tricks = pgTable("tricks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  spotId: integer("spot_id")
    .notNull()
    .references(() => spots.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Trick = typeof tricks.$inferSelect;
export type NewTrick = typeof tricks.$inferInsert;

export const tricksRelations = relations(tricks, ({ one }) => ({
  spot: one(spots, {
    fields: [tricks.spotId],
    references: [spots.id],
  }),
}));
