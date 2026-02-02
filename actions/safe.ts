"use server";

import { getServerSideUser } from "@/lib/auth";
import { db } from "@/db";
import { users, safes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const SAFE_CREATION_COST = 500;

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
        return { error: "You must be logged in to create a safe." };
    }

    const secretWord = formData.get("secretWord") as string;
    const systemPrompt = formData.get("systemPrompt") as string;
    const defenseLevelStr = formData.get("defenseLevel") as string;
    const defenseLevel = parseInt(defenseLevelStr || "1");

    // Validate inputs
    const fieldErrors: CreateSafeState["fieldErrors"] = {};
    if (!secretWord || secretWord.trim().length < 3) {
        fieldErrors.secretWord = "Secret word must be at least 3 characters.";
    }
    if (!systemPrompt || systemPrompt.trim().length < 10) {
        fieldErrors.systemPrompt = "System prompt must be descriptive (min 10 chars).";
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    // Check credits
    if (user.credits < SAFE_CREATION_COST) {
        return { error: `Insufficient credits. Costs ${SAFE_CREATION_COST} credits.` };
    }

    try {
        await db.transaction(async (tx) => {
            // Deduct credits
            await tx
                .update(users)
                .set({
                    credits: user.credits - SAFE_CREATION_COST,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, user.id));

            // Create Safe
            await tx.insert(safes).values({
                userId: user.id,
                secretWord: secretWord.trim(),
                systemPrompt: systemPrompt.trim(),
                defenseLevel,
            });
        });
    } catch (error) {
        console.error("Error creating safe:", error);
        return { error: "Database error. Please try again." };
    }

    redirect("/dashboard");
}
