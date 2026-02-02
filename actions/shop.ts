"use server";

import { supabase } from "@/lib/supabase";
import { getServerSideUser } from "@/lib/auth";
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
        // Sequential update to replace transaction
        const updatedThemes = [...user.unlockedThemes, themeId];

        const { error: updateError } = await supabase
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
        const { error: updateError } = await supabase
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
        return { error: "Update failed" };
    }
}
