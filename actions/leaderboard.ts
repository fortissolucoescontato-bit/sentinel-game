"use server";

import { db } from "@/db";
import { users, logs } from "@/db/schema";
import { desc, eq, sql, and } from "drizzle-orm";

/**
 * Get top richest hackers (Offensive Leaderboard)
 * Ranked by current credits (Net Worth)
 */
export async function getTopHackers(limit = 10) {
    try {
        const topUsers = await db.query.users.findMany({
            orderBy: [desc(users.credits)],
            limit: limit,
            columns: {
                id: true,
                username: true,
                credits: true,
                tier: true,
                stylePoints: true,
            },
        });
        return topUsers;
    } catch (error) {
        console.error("Error fetching top hackers:", error);
        return [];
    }
}

/**
 * Get top defenders (Iron Architects)
 * Ranked by number of BLOCKED attacks (logs where succeess = false)
 */
export async function getTopDefenders(limit = 10) {
    try {
        // We need to group logs by defenderId and count where success is false
        // Since Drizzle query builder is strictly typed, raw SQL or careful construction helps here.
        // Let's retrieve users and map their stats to keep it simple and safe for now,
        // or use a more advanced query.

        // Efficient Approach: Fetch users with their defense logs count
        // Note: In a real heavy app, this should be a materialized view or cached count column.

        const defenses = await db
            .select({
                defenderId: logs.defenderId,
                blocks: sql<number>`count(*)`.mapWith(Number),
            })
            .from(logs)
            .where(eq(logs.success, false))
            .groupBy(logs.defenderId)
            .orderBy(desc(sql`count(*)`))
            .limit(limit);

        // Now enrich with user details
        const result = await Promise.all(
            defenses.map(async (def) => {
                if (!def.defenderId) return null;
                const user = await db.query.users.findFirst({
                    where: eq(users.id, def.defenderId),
                    columns: {
                        id: true,
                        username: true,
                        tier: true,
                    }
                });
                return user ? { ...user, blocks: def.blocks } : null;
            })
        );

        return result.filter(Boolean) as {
            id: number;
            username: string;
            tier: string;
            blocks: number;
        }[];

    } catch (error) {
        console.error("Error fetching top defenders:", error);
        return [];
    }
}

/**
 * Get quick stats for dashboard
 */
export async function getDashboardStats(userId: number) {
    try {
        const attackLogs = await db.query.logs.findMany({
            where: eq(logs.attackerId, userId),
        });

        const defenseLogs = await db.query.logs.findMany({
            where: eq(logs.defenderId, userId),
        });

        const successfulAttacks = attackLogs.filter((l) => l.success).length;
        const failedAttacks = attackLogs.filter((l) => !l.success).length;

        const successfulDefenses = defenseLogs.filter((l) => !l.success).length;
        const failedDefenses = defenseLogs.filter((l) => l.success).length;

        return {
            attacks: {
                total: attackLogs.length,
                successful: successfulAttacks,
                failed: failedAttacks,
                successRate: attackLogs.length > 0 ? (successfulAttacks / attackLogs.length) * 100 : 0,
            },
            defense: {
                total: defenseLogs.length,
                successful: successfulDefenses,
                failed: failedDefenses,
                defenseRate: defenseLogs.length > 0 ? (successfulDefenses / defenseLogs.length) * 100 : 0,
            },
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            attacks: { total: 0, successful: 0, failed: 0, successRate: 0 },
            defense: { total: 0, successful: 0, failed: 0, defenseRate: 0 },
        };
    }
}
