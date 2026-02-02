"use server";

import { supabase } from "@/lib/supabase";
import { GAME_CONFIG } from "@/lib/game-config";

/**
 * Get user by ID with their safes
 */
export async function getUserProfile(userId: number) {
    try {
        const { data: user, error } = await (supabase
            .from('users') as any)
            .select(`
                *,
                safes(*)
            `)
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error getting user profile:", error);
            return null;
        }

        // Map to camelCase
        return {
            ...user,
            safes: user.safes?.map((s: any) => ({
                ...s,
                userId: s.user_id,
                secretWord: s.secret_word,
                systemPrompt: s.system_prompt,
                defenseLevel: s.defense_level,
                mode: s.mode || 'classic',
                createdAt: s.created_at,
                updatedAt: s.updated_at
            })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        };

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
        const { data: user, error } = await (supabase
            .from('users') as any)
            .select('*')
            .eq('email', email)
            .single();

        return user;
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
        const { data: user, error } = await (supabase
            .from('users') as any)
            .select('*')
            .eq('username', username)
            .single();

        return user;
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
        const { data: updatedUser, error } = await (supabase
            .from('users') as any)
            .update({ credits, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return updatedUser;
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
export async function getSafeById(safeId: number) {
    try {
        const { data: safe, error } = await (supabase
            .from('safes') as any)
            .select(`
                *,
                user:users(id, username, tier)
            `)
            .eq('id', safeId)
            .single();

        if (error) return null;

        return {
            ...safe,
            userId: safe.user_id,
            secretWord: safe.secret_word,
            systemPrompt: safe.system_prompt,
            defenseLevel: safe.defense_level,
            user: safe.user
        };
    } catch (error) {
        console.error("Error getting safe:", error);
        return null;
    }
}

/**
 * Get user's safes
 */
export async function getUserSafes(userId: number) {
    try {
        const { data: userSafes, error } = await (supabase
            .from('safes') as any)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return userSafes.map((s: any) => ({
            ...s,
            userId: s.user_id,
            secretWord: s.secret_word,
            systemPrompt: s.system_prompt,
            defenseLevel: s.defense_level
        }));
    } catch (error) {
        console.error("Error getting user safes:", error);
        return [];
    }
}

/**
 * Get leaderboard (top hackers by successful attacks)
 */
export async function getLeaderboard(limit = 10) {
    try {
        // Redundant with interactions/leaderboard.ts but implementing for compatibility
        // Use RPC for consistency
        const { data: topDefenders, error } = await (supabase as any)
            .rpc('get_top_defenders', { p_limit: limit });

        if (error) throw error;

        // Map to match expected return type if necessary, or just return as is
        // The RPC returns { id, username, tier, blocks }
        // The previous version returned { id, username, credits, tier, successfulAttacks }

        // Warning: The previous version was "Top Credits" (Hackers), but the name 'getLeaderboard' is ambiguous.
        // In the actions/leaderboard.ts, we have split TopHackers (Credits) and TopDefenders (Blocks).
        // Let's assume this generic 'getLeaderboard' implies the main one, typically Hackers (Credits).

        // Reverting to fetch Top Hackers (Credits) via standard select, as there is no specific RPC needed for simple sorting.
        const { data: topUsers, error: usersError } = await (supabase
            .from('users') as any)
            .select('id, username, credits, tier')
            .order('credits', { ascending: false })
            .limit(limit);

        if (usersError) throw usersError;

        return topUsers.map((user: any) => ({
            id: user.id,
            username: user.username,
            credits: user.credits,
            tier: user.tier,
            successfulAttacks: 0, // Placeholder
        }));
    } catch (error) {
        console.error("Error getting leaderboard:", error);
        return [];
    }
}
