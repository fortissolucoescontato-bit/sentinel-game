"use server";

import { supabase } from "@/lib/supabase";

/**
 * Get top richest hackers (Offensive Leaderboard)
 * Ranked by current credits (Net Worth)
 */
export async function getTopHackers(limit = 10) {
    try {
        const { data: topUsers, error } = await (supabase
            .from('users') as any)
            .select('id, username, credits, tier, style_points')
            .order('credits', { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching top hackers:", error);
            return [];
        }

        return topUsers.map((u: any) => ({
            id: u.id,
            username: u.username,
            credits: u.credits,
            tier: u.tier,
            stylePoints: u.style_points
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
        // Fetch all failed logs to aggregate
        const { data: logs, error } = await (supabase
            .from('logs') as any)
            .select('defender_id')
            .eq('success', false);

        if (error) throw error;

        // Group by defender_id
        const counts: Record<number, number> = {};
        logs.forEach((log: any) => {
            const did = log.defender_id;
            counts[did] = (counts[did] || 0) + 1;
        });

        // Sort by count desc
        const sortedDefenders = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit);

        // Fetch user details for these IDs
        const topDefenderIds = sortedDefenders.map(([id]) => parseInt(id));

        if (topDefenderIds.length === 0) return [];

        const { data: users, error: usersError } = await (supabase
            .from('users') as any)
            .select('id, username, tier')
            .in('id', topDefenderIds);

        if (usersError) throw usersError;

        // Merge count with user data
        const result = users.map((u: any) => ({
            id: u.id,
            username: u.username,
            tier: u.tier,
            blocks: counts[u.id] || 0
        }));

        // Re-sort because database 'in' query doesn't guarantee order
        return result.sort((a: any, b: any) => b.blocks - a.blocks);

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
        const { data: attackLogs, error: attackError } = await (supabase
            .from('logs') as any)
            .select('success')
            .eq('attacker_id', userId);

        const { data: defenseLogs, error: defenseError } = await (supabase
            .from('logs') as any)
            .select('success')
            .eq('defender_id', userId);

        if (attackError || defenseError) throw new Error("Error fetching stats");

        const successfulAttacks = attackLogs?.filter((l: any) => l.success).length || 0;
        const failedAttacks = attackLogs?.filter((l: any) => !l.success).length || 0;
        const totalAttacks = attackLogs?.length || 0;

        const successfulDefenses = defenseLogs?.filter((l: any) => !l.success).length || 0; // Success for defender means log.success is FALSE
        const failedDefenses = defenseLogs?.filter((l: any) => l.success).length || 0;
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
export async function getUserRank(userId: number) {
    try {
        const { data, error } = await (supabase as any).rpc('get_user_rank', { p_user_id: userId });

        if (error) throw error;
        return data as number;
    } catch (error) {
        console.error('Error fetching user rank:', error);
        return 0;
    }
}
