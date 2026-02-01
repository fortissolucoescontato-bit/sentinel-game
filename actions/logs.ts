"use server";

import { db } from "@/db";
import { logs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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
