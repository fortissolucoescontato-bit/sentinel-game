
import { db } from "@/db";
import { logs } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

/**
 * Rate Limit Configuration
 */
const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;   // 10 attacks per minute

/**
 * Check if the user has exceeded the rate limit for attacks.
 * Uses the logs table to count recent activities.
 * 
 * @param userId - The ID of the user attempting the action
 * @param actionType - Optional: Filter by specific action types if needed in future
 * @returns { success: boolean, retryAfter?: number }
 */
export async function checkRateLimit(userId: number): Promise<{ success: boolean; retryAfter?: number }> {
    try {
        // Calculate the timestamp for the start of the window
        const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000);

        // Count logs created by this user since the window start
        const recentLogs = await db
            .select({ count: sql<number>`count(*)` })
            .from(logs)
            .where(
                and(
                    eq(logs.attackerId, userId),
                    gte(logs.createdAt, windowStart)
                )
            );

        const count = Number(recentLogs[0]?.count || 0);

        if (count >= MAX_REQUESTS_PER_WINDOW) {
            // Calculate time remaining until the oldest log expires (approximate)
            // Ideally we would fetch the oldest log in the window, but static 60s is safer/easier
            return {
                success: false,
                retryAfter: Math.ceil(RATE_LIMIT_WINDOW_SECONDS)
            };
        }

        return { success: true };

    } catch (error) {
        console.error("Rate limit check failed:", error);
        // Fail open to avoid blocking users during DB errors, or fail closed for security?
        // Fail open is better for UX in games.
        return { success: true };
    }
}
