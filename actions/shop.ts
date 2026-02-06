"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSideUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { THEMES, ThemeId } from "@/lib/themes";

export async function buyTheme(themeId: string) {
    const user = await getServerSideUser();
    if (!user) return { error: "Não logado" };
    return buyThemeCore(user, themeId);
}

export async function buyThemeCore(user: any, themeId: string) {
    const theme = THEMES[themeId as ThemeId];
    if (!theme) return { error: "Tema inválido" };

    // Check if already owned
    if (user.unlockedThemes.includes(themeId)) {
        return { error: "Você já possui este tema" };
    }

    // Check Funds
    if (user.credits < theme.priceCredits) {
        return { error: `Créditos insuficientes. Necessário ${theme.priceCredits} cr.` };
    }
    if ((user.stylePoints || 0) < theme.priceStylePoints) {
        return { error: `Pontos de Estilo insuficientes. Necessário ${theme.priceStylePoints} PE.` };
    }

    try {
        const updatedThemes = [...user.unlockedThemes, themeId];

        await db.update(users)
            .set({
                credits: user.credits - theme.priceCredits,
                stylePoints: (user.stylePoints || 0) - theme.priceStylePoints,
                unlockedThemes: updatedThemes,
                updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

        // revalidatePath and other server-only calls should be guarded or in the main export
        try {
            revalidatePath("/shop");
            revalidatePath("/dashboard");
        } catch (e) { }

        return { success: true };
    } catch (error) {
        console.error("Buy theme error:", error);
        return { error: "Falha na transação" };
    }
}

export async function equipTheme(themeId: string) {
    const user = await getServerSideUser();
    if (!user) return { error: "Não logado" };
    return equipThemeCore(user, themeId);
}

export async function equipThemeCore(user: any, themeId: string) {
    if (!user.unlockedThemes.includes(themeId)) {
        return { error: "Você não possui este tema" };
    }

    try {
        await db.update(users)
            .set({
                currentTheme: themeId,
                updatedAt: new Date()
            })
            .where(eq(users.id, user.id));

        try {
            revalidatePath("/shop");
            revalidatePath("/dashboard");
            revalidatePath("/game");
        } catch (e) { }

        return { success: true };
    } catch (error) {
        console.error("Equip theme error:", error);
        return { error: "Falha na atualização" };
    }
}
