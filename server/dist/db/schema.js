// server/src/db/schema.ts
import { pgTable, serial, text, timestamp, doublePrecision } from 'drizzle-orm/pg-core';
export const spots = pgTable('spots', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    latitude: doublePrecision('latitude').notNull(),
    longitude: doublePrecision('longitude').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
