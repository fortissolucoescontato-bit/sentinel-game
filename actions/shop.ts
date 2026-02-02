"use server";

import { supabase } from "@/lib/supabase";
import { getServerSideUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { THEMES, ThemeId } from "@/lib/themes";

export async function buyTheme(themeId: string) {
    const user = await getServerSideUser();
    if (!user) return { error: "Não logado" };

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
    if (user.stylePoints < theme.priceStylePoints) {
        return { error: `Pontos de Estilo insuficientes. Necessário ${theme.priceStylePoints} PE.` };
    }

    try {
        // Sequential update to replace transaction
        const updatedThemes = [...user.unlockedThemes, themeId];

        const { error: updateError } = await (supabase as any)
            .from('users')
            .update({
                credits: user.credits - theme.priceCredits,
                style_points: user.stylePoints - theme.priceStylePoints,
                unlocked_themes: updatedThemes,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (updateError) throw updateError;

        revalidatePath("/shop");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Buy theme error:", error);
        return { error: "Falha na transação" };
    }
}

export async function equipTheme(themeId: string) {
    const user = await getServerSideUser();
    if (!user) return { error: "Não logado" };

    if (!user.unlockedThemes.includes(themeId)) {
        return { error: "Você não possui este tema" };
    }

    try {
        const { error: updateError } = await (supabase as any)
            .from('users')
            .update({ current_theme: themeId })
            .eq('id', user.id);

        if (updateError) throw updateError;

        revalidatePath("/shop");
        revalidatePath("/dashboard");
        revalidatePath("/game"); // Important for HackTerminal
        return { success: true };
    } catch (error) {
        console.error("Equip theme error:", error);
        return { error: "Falha na atualização" };
    }
}
