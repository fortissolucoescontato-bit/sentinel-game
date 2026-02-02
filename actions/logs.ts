"use server";

import { db } from "@/db";
import { logs } from "@/db/schema";
import { eq, desc, and, asc } from "drizzle-orm";
import { getServerSideUser } from "@/lib/auth";

export async function getSafeChatHistory(safeId: number) {
    const user = await getServerSideUser();
    if (!user) return [];

    try {
        const history = await db.query.logs.findMany({
            where: and(
                eq(logs.attackerId, user.id),
                eq(logs.safeId, safeId)
            ),
            orderBy: [asc(logs.createdAt)], // Oldest first for chat flow
            columns: {
                id: true,
                inputPrompt: true,
                aiResponse: true,
                createdAt: true,
                success: true,
            }
        });
        return history;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
}


export async function getDefenseLogs(userId: number, limit = 20) {
    try {
        const defenseLogs = await db.query.logs.findMany({
            where: eq(logs.defenderId, userId),
            orderBy: [desc(logs.createdAt)],
            limit: limit,
            with: {
                attacker: {
                    columns: {
                        username: true,
                        tier: true,
                    },
                },
                safe: {
                    columns: {
                        id: true,
                        defenseLevel: true
                    }
                }
            },
        });

        return defenseLogs;
    } catch (error) {
        console.error("Error fetching defense logs:", error);
        return [];
    }
}

export async function getUnreadLogsCount(userId: number, lastCheck: Date) {
    // Implementation for notification badge logic
    // For now, we returns strict calculation based on time, 
    // ideally we would save 'last_logs_viewed_at' in the user table.
    return 0;
}
