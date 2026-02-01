"use server";

import { db } from "@/db";
import { users, safes } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get user by ID with their safes
 */
export async function getUserProfile(userId: number) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                safes: {
                    orderBy: (safes, { desc }) => [desc(safes.createdAt)],
                },
            },
        });

        return user;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        return user;
    } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
    }
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
        });

        return user;
    } catch (error) {
        console.error("Error getting user by username:", error);
        return null;
    }
}

/**
 * Update user credits
 */
export async function updateUserCredits(userId: number, credits: number) {
    try {
        const [updatedUser] = await db
            .update(users)
            .set({ credits, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        return updatedUser;
    } catch (error) {
        console.error("Error updating user credits:", error);
        return null;
    }
}

/**
 * Create a new safe
 */
export async function createSafe(
    userId: number,
    secretWord: string,
    systemPrompt: string,
    defenseLevel: number = 1
) {
    try {
        // Validate inputs
        if (!secretWord || secretWord.trim().length === 0) {
            throw new Error("Secret word cannot be empty");
        }

        if (!systemPrompt || systemPrompt.trim().length === 0) {
            throw new Error("System prompt cannot be empty");
        }

        if (defenseLevel < 1 || defenseLevel > 5) {
            throw new Error("Defense level must be between 1 and 5");
        }

        const [newSafe] = await db
            .insert(safes)
            .values({
                userId,
                secretWord: secretWord.trim(),
                systemPrompt: systemPrompt.trim(),
                defenseLevel,
                isCracked: false,
            })
            .returning();

        return newSafe;
    } catch (error) {
        console.error("Error creating safe:", error);
        throw error;
    }
}

/**
 * Update safe defense
 */
export async function updateSafeDefense(
    safeId: number,
    systemPrompt: string,
    defenseLevel: number
) {
    try {
        // Check if safe exists and is not cracked
        const safe = await db.query.safes.findFirst({
            where: eq(safes.id, safeId),
        });

        if (!safe) {
            throw new Error("Safe not found");
        }

        if (safe.isCracked) {
            throw new Error("Cannot update a cracked safe");
        }

        const [updatedSafe] = await db
            .update(safes)
            .set({
                systemPrompt,
                defenseLevel,
                updatedAt: new Date(),
            })
            .where(eq(safes.id, safeId))
            .returning();

        return updatedSafe;
    } catch (error) {
        console.error("Error updating safe defense:", error);
        throw error;
    }
}

/**
 * Get safe by ID
 */
export async function getSafeById(safeId: number) {
    try {
        const safe = await db.query.safes.findFirst({
            where: eq(safes.id, safeId),
            with: {
                user: {
                    columns: {
                        id: true,
                        username: true,
                        tier: true,
                    },
                },
            },
        });

        return safe;
    } catch (error) {
        console.error("Error getting safe:", error);
        return null;
    }
}

/**
 * Get user's safes
 */
export async function getUserSafes(userId: number) {
    try {
        const userSafes = await db.query.safes.findMany({
            where: eq(safes.userId, userId),
            orderBy: (safes, { desc }) => [desc(safes.createdAt)],
        });

        return userSafes;
    } catch (error) {
        console.error("Error getting user safes:", error);
        return [];
    }
}

/**
 * Get leaderboard (top hackers by successful attacks)
 */
export async function getLeaderboard(limit = 10) {
    try {
        // This is a simplified version - you might want to add a success_count column
        // or calculate it differently for better performance
        const allUsers = await db.query.users.findMany({
            with: {
                attackLogs: {
                    where: (logs, { eq }) => eq(logs.success, true),
                },
            },
            orderBy: (users, { desc }) => [desc(users.credits)],
            limit,
        });

        return allUsers.map((user) => ({
            id: user.id,
            username: user.username,
            credits: user.credits,
            tier: user.tier,
            successfulAttacks: user.attackLogs.length,
        }));
    } catch (error) {
        console.error("Error getting leaderboard:", error);
        return [];
    }
}
