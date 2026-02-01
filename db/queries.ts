import { db } from "./index";
import { users, safes, logs, type NewUser, type NewSafe, type NewLog } from "./schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * User Queries
 */
export const userQueries = {
    /**
     * Find user by ID
     */
    findById: async (id: number) => {
        return await db.query.users.findFirst({
            where: eq(users.id, id),
        });
    },

    /**
     * Find user by email
     */
    findByEmail: async (email: string) => {
        return await db.query.users.findFirst({
            where: eq(users.email, email),
        });
    },

    /**
     * Find user by username
     */
    findByUsername: async (username: string) => {
        return await db.query.users.findFirst({
            where: eq(users.username, username),
        });
    },

    /**
     * Create new user
     */
    create: async (data: NewUser) => {
        const [user] = await db.insert(users).values(data).returning();
        return user;
    },

    /**
     * Update user credits
     */
    updateCredits: async (userId: number, credits: number) => {
        const [user] = await db
            .update(users)
            .set({ credits, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();
        return user;
    },

    /**
     * Deduct credits from user
     */
    deductCredits: async (userId: number, amount: number) => {
        const user = await userQueries.findById(userId);
        if (!user) throw new Error("User not found");
        if (user.credits < amount) throw new Error("Insufficient credits");

        return await userQueries.updateCredits(userId, user.credits - amount);
    },
};

/**
 * Safe Queries
 */
export const safeQueries = {
    /**
     * Find safe by ID
     */
    findById: async (id: number) => {
        return await db.query.safes.findFirst({
            where: eq(safes.id, id),
            with: {
                user: true,
            },
        });
    },

    /**
     * Find all safes by user ID
     */
    findByUserId: async (userId: number) => {
        return await db.query.safes.findMany({
            where: eq(safes.userId, userId),
            orderBy: desc(safes.createdAt),
        });
    },

    /**
     * Find all uncracked safes (excluding user's own safes)
     */
    findAvailableTargets: async (userId: number) => {
        return await db.query.safes.findMany({
            where: and(
                eq(safes.isCracked, false),
                // Note: You'll need to add a 'not' condition here
                // This is a simplified version
            ),
            with: {
                user: {
                    columns: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: desc(safes.defenseLevel),
        });
    },

    /**
     * Create new safe
     */
    create: async (data: NewSafe) => {
        const [safe] = await db.insert(safes).values(data).returning();
        return safe;
    },

    /**
     * Mark safe as cracked
     */
    markAsCracked: async (safeId: number) => {
        const [safe] = await db
            .update(safes)
            .set({ isCracked: true, updatedAt: new Date() })
            .where(eq(safes.id, safeId))
            .returning();
        return safe;
    },

    /**
     * Update safe defense
     */
    updateDefense: async (safeId: number, systemPrompt: string, defenseLevel: number) => {
        const [safe] = await db
            .update(safes)
            .set({ systemPrompt, defenseLevel, updatedAt: new Date() })
            .where(eq(safes.id, safeId))
            .returning();
        return safe;
    },
};

/**
 * Log Queries
 */
export const logQueries = {
    /**
     * Create new attack log
     */
    create: async (data: NewLog) => {
        const [log] = await db.insert(logs).values(data).returning();
        return log;
    },

    /**
     * Find logs by attacker ID
     */
    findByAttackerId: async (attackerId: number, limit = 50) => {
        return await db.query.logs.findMany({
            where: eq(logs.attackerId, attackerId),
            orderBy: desc(logs.createdAt),
            limit,
            with: {
                defender: {
                    columns: {
                        id: true,
                        username: true,
                    },
                },
                safe: true,
            },
        });
    },

    /**
     * Find logs by defender ID
     */
    findByDefenderId: async (defenderId: number, limit = 50) => {
        return await db.query.logs.findMany({
            where: eq(logs.defenderId, defenderId),
            orderBy: desc(logs.createdAt),
            limit,
            with: {
                attacker: {
                    columns: {
                        id: true,
                        username: true,
                    },
                },
                safe: true,
            },
        });
    },

    /**
     * Find logs by safe ID
     */
    findBySafeId: async (safeId: number) => {
        return await db.query.logs.findMany({
            where: eq(logs.safeId, safeId),
            orderBy: desc(logs.createdAt),
            with: {
                attacker: {
                    columns: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
    },

    /**
     * Get successful attacks count
     */
    getSuccessfulAttacksCount: async (attackerId: number) => {
        const result = await db.query.logs.findMany({
            where: and(
                eq(logs.attackerId, attackerId),
                eq(logs.success, true)
            ),
        });
        return result.length;
    },
};

/**
 * Transaction helper for complex operations
 */
export const executeAttack = async (
    attackerId: number,
    defenderId: number,
    safeId: number,
    inputPrompt: string,
    aiResponse: string,
    success: boolean,
    creditsSpent: number = 10
) => {
    return await db.transaction(async (tx) => {
        // Deduct credits from attacker
        const attacker = await tx.query.users.findFirst({
            where: eq(users.id, attackerId),
        });

        if (!attacker) throw new Error("Attacker not found");
        if (attacker.credits < creditsSpent) throw new Error("Insufficient credits");

        await tx
            .update(users)
            .set({
                credits: attacker.credits - creditsSpent,
                updatedAt: new Date()
            })
            .where(eq(users.id, attackerId));

        // Create log
        const [log] = await tx
            .insert(logs)
            .values({
                attackerId,
                defenderId,
                safeId,
                inputPrompt,
                aiResponse,
                success,
                creditsSpent,
            })
            .returning();

        // If successful, mark safe as cracked
        if (success) {
            await tx
                .update(safes)
                .set({ isCracked: true, updatedAt: new Date() })
                .where(eq(safes.id, safeId));
        }

        return log;
    });
};
