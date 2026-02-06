"use server";

import { db } from "@/db";
import { logs } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
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
            orderBy: [asc(logs.createdAt)] // Oldest first for chat flow
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
            with: {
                attacker: {
                    columns: {
                        username: true,
                        tier: true
                    }
                },
                safe: {
                    columns: {
                        id: true,
                        defenseLevel: true,
                        theme: true
                    }
                }
            },
            orderBy: [desc(logs.createdAt)],
            limit: limit
        });

        return defenseLogs;
    } catch (error) {
        console.error("Error fetching defense logs:", error);
        return [];
    }
}

export async function getUnreadLogsCount(userId: number, lastCheck: Date) {
    // Implementation for notification badge logic
    return 0;
}
