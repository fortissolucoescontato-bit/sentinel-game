import { pgTable, serial, text, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    clerkId: varchar("clerk_id", { length: 255 }).unique(), // Link to Clerk User
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    credits: integer("credits").notNull().default(1000),
    stylePoints: integer("style_points").notNull().default(0),
    tier: varchar("tier", { length: 50 }).notNull().default("free"),
    unlockedThemes: text("unlocked_themes").array().notNull().default(sql`ARRAY['dracula']::text[]`),
    currentTheme: varchar("current_theme", { length: 50 }).notNull().default("dracula"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Safes Table
export const safes = pgTable("safes", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    secretWord: varchar("secret_word", { length: 255 }).notNull(),
    systemPrompt: text("system_prompt").notNull(),
    theme: varchar("theme", { length: 50 }).notNull().default("dracula"), // Visual theme of the safe
    defenseLevel: integer("defense_level").notNull().default(1), // 1-5
    mode: varchar("mode", { length: 20 }).notNull().default("classic"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Logs Table
export const logs = pgTable("logs", {
    id: serial("id").primaryKey(),
    attackerId: integer("attacker_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    defenderId: integer("defender_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    safeId: integer("safe_id")
        .references(() => safes.id, { onDelete: "set null" }),
    inputPrompt: text("input_prompt").notNull(),
    aiResponse: text("ai_response").notNull(),
    success: boolean("success").notNull().default(false),
    creditsSpent: integer("credits_spent").notNull().default(10),
    styleScore: integer("style_score").notNull().default(0), // New field: 0-10 Judge Score
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Unlocked Safes (Join Table for Many-to-Many User-Safe relationship)
export const unlockedSafes = pgTable("unlocked_safes", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    safeId: integer("safe_id")
        .notNull()
        .references(() => safes.id, { onDelete: "cascade" }),
    unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    safes: many(safes),
    attackLogs: many(logs, { relationName: "attacker" }),
    defenseLogs: many(logs, { relationName: "defender" }),
    unlockedSafes: many(unlockedSafes),
}));

export const safesRelations = relations(safes, ({ one, many }) => ({
    user: one(users, {
        fields: [safes.userId],
        references: [users.id],
    }),
    logs: many(logs),
    unlockedBy: many(unlockedSafes),
}));

export const unlockedSafesRelations = relations(unlockedSafes, ({ one }) => ({
    user: one(users, {
        fields: [unlockedSafes.userId],
        references: [users.id],
    }),
    safe: one(safes, {
        fields: [unlockedSafes.safeId],
        references: [safes.id],
    }),
}));

export const logsRelations = relations(logs, ({ one }) => ({
    attacker: one(users, {
        fields: [logs.attackerId],
        references: [users.id],
        relationName: "attacker",
    }),
    defender: one(users, {
        fields: [logs.defenderId],
        references: [users.id],
        relationName: "defender",
    }),
    safe: one(safes, {
        fields: [logs.safeId],
        references: [safes.id],
    }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Safe = typeof safes.$inferSelect;
export type NewSafe = typeof safes.$inferInsert;

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;

export type UnlockedSafe = typeof unlockedSafes.$inferSelect;
export type NewUnlockedSafe = typeof unlockedSafes.$inferInsert;
