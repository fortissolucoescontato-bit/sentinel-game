"use server";

import { getServerSideUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

import { GAME_CONFIG } from "@/lib/game-config";

// const SAFE_CREATION_COST = 500;


interface CreateSafeState {
    success?: boolean;
    error?: string;
    fieldErrors?: {
        secretWord?: string;
        systemPrompt?: string;
        defenseLevel?: string;
    };
}

export async function createSafeAction(
    prevState: CreateSafeState | null,
    formData: FormData
): Promise<CreateSafeState> {
    const user = await getServerSideUser();

    if (!user) {
        return { error: "Você precisa estar logado para criar um cofre." };
    }

    const secretWord = formData.get("secretWord") as string;
    const systemPrompt = formData.get("systemPrompt") as string;
    const defenseLevelStr = formData.get("defenseLevel") as string;
    const defenseLevel = parseInt(defenseLevelStr || "1");
    const theme = (formData.get("theme") as string) || "dracula";

    // Validate inputs
    const fieldErrors: CreateSafeState["fieldErrors"] = {};
    if (!secretWord || secretWord.trim().length < 3) {
        fieldErrors.secretWord = "A senha deve ter pelo menos 3 caracteres.";
    }
    if (!systemPrompt || systemPrompt.trim().length < 10) {
        fieldErrors.systemPrompt = "O prompt deve ser descritivo (mínimo 10 caracteres).";
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    const safeTheme = (user.unlockedThemes || ["dracula"]).includes(theme) ? theme : "dracula";

    // Check credits (redundant with RPC but good for fast feedback)
    if (user.credits < GAME_CONFIG.SAFE_CREATION_COST) {
        return { error: `Créditos insuficientes. Custa ${GAME_CONFIG.SAFE_CREATION_COST} créditos.` };
    }

    try {
        // Use the centralized atomic creation function which uses RPC
        const { createSafe } = await import("@/actions/user");
        await createSafe(
            user.id,
            secretWord,
            systemPrompt,
            defenseLevel,
            safeTheme
        );

    } catch (error) {
        console.error("Error creating safe:", error);
        return { error: error instanceof Error ? error.message : "Erro no banco de dados. Tente novamente." };
    }

    redirect("/dashboard");
}
