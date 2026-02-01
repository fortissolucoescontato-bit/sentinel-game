"use server";

import { getServerSideUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { THEMES, ThemeId } from "@/lib/themes";

export async function buyTheme(themeId: string) {
    const user = await getServerSideUser();
    if (!user) return { error: "Not logged in" };

    const theme = THEMES[themeId as ThemeId];
    if (!theme) return { error: "Invalid theme" };

    // Check if already owned
    if (user.unlockedThemes.includes(themeId)) {
        return { error: "You already own this theme" };
    }

    // Check Funds
    if (user.credits < theme.priceCredits) {
        return { error: `Insufficient Credits. Need ${theme.priceCredits} cr.` };
    }
    if (user.stylePoints < theme.priceStylePoints) {
        return { error: `Insufficient Style Points. Need ${theme.priceStylePoints} SP.` };
    }

    try {
        await db.transaction(async (tx) => {
            // Deduct cost
            await tx
                .update(users)
                .set({
                    credits: user.credits - theme.priceCredits,
                    stylePoints: user.stylePoints - theme.priceStylePoints,
                    // Append to array using Postgres array_append or equivalent logic
                    // Since Drizzle array update can be tricky, we fetch first (already done) and push
                    unlockedThemes: [...user.unlockedThemes, themeId],
                    updatedAt: new Date(),
                })
                .where(eq(users.id, user.id));
        });

        revalidatePath("/shop");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Buy theme error:", error);
        return { error: "Transaction failed" };
    }
}

export async function equipTheme(themeId: string) {
    const user = await getServerSideUser();
    if (!user) return { error: "Not logged in" };

    if (!user.unlockedThemes.includes(themeId)) {
        return { error: "You do not own this theme" };
    }

    try {
        await db
            .update(users)
            .set({ currentTheme: themeId })
            .where(eq(users.id, user.id));

        revalidatePath("/shop");
        revalidatePath("/dashboard");
        revalidatePath("/game"); // Important for HackTerminal
        return { success: true };
    } catch (error) {
        console.error("Equip theme error:", error);
        return { error: "Update failed" };
    }
}
