"use server";

import { db } from "@/db";
import { users, logs } from "@/db/schema";
import { desc, eq, sql, inArray, count, gt } from "drizzle-orm";

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
                stylePoints: true
            }
        });

        return topUsers.map(u => ({
            id: u.id,
            username: u.username,
            credits: u.credits,
            tier: u.tier,
            stylePoints: u.stylePoints
        }));
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
        // Group by defender_id and count failures
        const topDefenders = await db
            .select({
                defenderId: logs.defenderId,
                blocks: sql<number>`count(*)::int`,
            })
            .from(logs)
            .where(eq(logs.success, false))
            .groupBy(logs.defenderId)
            .orderBy(sql`count(*) desc`)
            .limit(limit);

        if (topDefenders.length === 0) return [];

        const defenderIds = topDefenders.map(d => d.defenderId);

        const defenders = await db.query.users.findMany({
            where: inArray(users.id, defenderIds),
            columns: {
                id: true,
                username: true,
                tier: true
            }
        });

        // Merge count with user data
        const result = defenders.map(u => {
            const stats = topDefenders.find(d => d.defenderId === u.id);
            return {
                id: u.id,
                username: u.username,
                tier: u.tier,
                blocks: stats ? stats.blocks : 0
            };
        });

        // Re-sort
        return result.sort((a, b) => b.blocks - a.blocks);

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
            columns: { success: true }
        });

        const defenseLogs = await db.query.logs.findMany({
            where: eq(logs.defenderId, userId),
            columns: { success: true }
        });

        const successfulAttacks = attackLogs?.filter(l => l.success).length || 0;
        const failedAttacks = attackLogs?.filter(l => !l.success).length || 0;
        const totalAttacks = attackLogs?.length || 0;

        const successfulDefenses = defenseLogs?.filter(l => !l.success).length || 0; // Success for defender means log.success is FALSE
        const failedDefenses = defenseLogs?.filter(l => l.success).length || 0;
        const totalDefense = defenseLogs?.length || 0;

        return {
            attacks: {
                total: totalAttacks,
                successful: successfulAttacks,
                failed: failedAttacks,
                successRate: totalAttacks > 0 ? (successfulAttacks / totalAttacks) * 100 : 0,
            },
            defense: {
                total: totalDefense,
                successful: successfulDefenses,
                failed: failedDefenses,
                defenseRate: totalDefense > 0 ? (successfulDefenses / totalDefense) * 100 : 0,
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

/**
 * Get user global rank
 */
export async function getUserRank(userId: number): Promise<number> {
    try {
        // Rank by Credits (Hackers)
        // Count how many users have MORE credits than this user
        // Using subquery or just counting
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { credits: true }
        });

        if (!user) return 0;

        // Let's use count
        const countResult = await db.select({ value: count() })
            .from(users)
            .where(gt(users.credits, user.credits));

        return countResult[0].value + 1; // Rank is 1 + number of people ahead

    } catch (error) {
        console.error('Error fetching user rank:', error);
        return 0;
    }
}
