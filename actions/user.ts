"use server";

import { supabase } from "@/lib/supabase";
import { GAME_CONFIG } from "@/lib/game-config";
import { db } from "@/db";
import { users, safes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Get user by ID with their safes
 */
export async function getUserProfile(userId: number) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                safes: {
                    orderBy: [desc(safes.createdAt)]
                }
            }
        });

        if (!user) return null;

        return user;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });
        return user || null;
    } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
    }
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.username, username)
        });
        return user || null;
    } catch (error) {
        console.error("Error getting user by username:", error);
        return null;
    }
}

/**
 * Update user credits
 */
export async function updateUserCredits(userId: number, credits: number) {
    try {
        const [updatedUser] = await db.update(users)
            .set({
                credits,
                updatedAt: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        return updatedUser || null;
    } catch (error) {
        console.error("Error updating user credits:", error);
        return null;
    }
}

/**
 * Create a new safe
 */
export async function createSafe(
    userId: number,
    secretWord: string,
    systemPrompt: string,
    defenseLevel: number = 1,
    theme: string = 'dracula',
    mode: string = 'classic'
) {
    try {
        // Validate inputs
        if (!secretWord || secretWord.trim().length === 0) {
            throw new Error("A senha secreta não pode estar vazia");
        }

        if (!systemPrompt || systemPrompt.trim().length === 0) {
            throw new Error("O System Prompt não pode estar vazio");
        }

        if (defenseLevel < 1 || defenseLevel > 5) {
            throw new Error("O nível de defesa deve estar entre 1 e 5");
        }

        const { data: result, error } = await (supabase as any).rpc('create_safe_transaction', {
            p_user_id: userId,
            p_secret_word: secretWord.trim(),
            p_system_prompt: systemPrompt.trim(),
            p_defense_level: defenseLevel,
            p_cost: GAME_CONFIG.SAFE_CREATION_COST,
            p_theme: theme,
            p_mode: mode
        });

        if (error) throw error;

        // Fetch the created safe to return full object as expected by caller
        // RPC returns { success: true, safe_id: 123 }
        if (result && (result as any).safe_id) {
            const { data: newSafe } = await (supabase
                .from('safes') as any)
                .select('*')
                .eq('id', (result as any).safe_id)
                .single();

            if (newSafe) {
                return {
                    ...newSafe,
                    userId: newSafe.user_id,
                    secretWord: newSafe.secret_word,
                    systemPrompt: newSafe.system_prompt,
                    defenseLevel: newSafe.defense_level
                };
            }
        }

        throw new Error("Failed to retrieve created safe");

    } catch (error) {
        console.error("Error creating safe:", error);
        throw error;
    }
}

/**
 * Update safe defense
 */
export async function updateSafeDefense(
    safeId: number,
    systemPrompt: string,
    defenseLevel: number
) {
    try {
        // Check if safe exists
        const { data: safe, error: checkError } = await (supabase
            .from('safes') as any)
            .select('id')
            .eq('id', safeId)
            .single();

        if (!safe) {
            throw new Error("Safe not found");
        }

        const { data: updatedSafe, error } = await (supabase
            .from('safes') as any)
            .update({
                system_prompt: systemPrompt,
                defense_level: defenseLevel,
                updated_at: new Date().toISOString(),
            })
            .eq('id', safeId)
            .select()
            .single();

        if (error) throw error;

        return {
            ...updatedSafe,
            userId: updatedSafe.user_id,
            secretWord: updatedSafe.secret_word,
            systemPrompt: updatedSafe.system_prompt,
            defenseLevel: updatedSafe.defense_level
        };
    } catch (error) {
        console.error("Error updating safe defense:", error);
        throw error;
    }
}

/**
 * Get safe by ID
 */
/**
 * Get safe by ID
 */
export async function getSafeById(safeId: number) {
    try {
        const safe = await db.query.safes.findFirst({
            where: eq(safes.id, safeId),
            with: {
                user: true
            }
        });

        if (!safe) return null;

        // Drizzle returns camelCase if configured or inferred, assuming schema matches.
        // If schema fields are camelCase keys mapped to snake_case cols, good.
        // My schema.ts: 
        // userId: integer("user_id"), 
        // secretWord: varchar("secret_word")...
        // So safe.userId is correct.

        return safe;
    } catch (error) {
        console.error("Error getting safe:", error);
        return null;
    }
}

/**
 * Get user's safes
 */
/**
 * Get user's safes
 */
export async function getUserSafes(userId: number) {
    try {
        const userSafes = await db.query.safes.findMany({
            where: eq(safes.userId, userId),
            orderBy: [desc(safes.createdAt)]
        });

        return userSafes;
    } catch (error) {
        console.error("Error getting user safes:", error);
        return [];
    }
}

/**
 * Get leaderboard (top hackers by successful attacks)
 */
export async function getLeaderboard(limit = 10) {
    const { getTopHackers } = await import("./leaderboard");
    return getTopHackers(limit);
}

/**
 * Claim Daily Reward
 */
export async function claimDailyReward(userId: number) {
    try {
        return await db.transaction(async (tx) => {
            const user = await tx.query.users.findFirst({
                where: eq(users.id, userId)
            });

            if (!user) {
                return { success: false, message: "Usuário não encontrado." };
            }

            const now = new Date();
            const lastReward = user.lastDailyReward ? new Date(user.lastDailyReward) : null;
            const ONE_DAY_MS = 24 * 60 * 60 * 1000;

            if (lastReward && (now.getTime() - lastReward.getTime() < ONE_DAY_MS)) {
                const hoursLeft = Math.ceil((ONE_DAY_MS - (now.getTime() - lastReward.getTime())) / (1000 * 60 * 60));
                return {
                    success: false,
                    message: `Recompensa já coletada. Volte em ${hoursLeft} horas.`
                };
            }

            // Grant Reward
            const bonus = GAME_CONFIG.DAILY_REWARD_AMOUNT || 50;
            const newCredits = user.credits + bonus;
            const { calculateTier } = await import("@/lib/game-config");
            const newTier = calculateTier(newCredits);

            await tx.update(users)
                .set({
                    credits: newCredits,
                    lastDailyReward: now,
                    tier: newTier,
                    updatedAt: now
                })
                .where(eq(users.id, userId));

            return {
                success: true,
                message: `Recebido ${bonus} créditos diários!`,
                newCredits
            };
        });
    } catch (error) {
        console.error("Error claiming daily reward:", error);
        return { success: false, message: "Erro ao processar recompensa." };
    }
}
