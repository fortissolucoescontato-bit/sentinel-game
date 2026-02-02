"use server";

import { supabase } from "@/lib/supabase";
import { getServerSideUser } from "@/lib/auth";

export async function getSafeChatHistory(safeId: number) {
    const user = await getServerSideUser();
    if (!user) return [];

    try {
        const { data: history, error } = await supabase
            .from('logs')
            .select('id, input_prompt, ai_response, created_at, success')
            .eq('attacker_id', user.id)
            .eq('safe_id', safeId)
            .order('created_at', { ascending: true }); // Oldest first for chat flow

        if (error) {
            console.error("Error fetching chat history:", error);
            return [];
        }

        return history.map((log: any) => ({
            id: log.id,
            inputPrompt: log.input_prompt,
            aiResponse: log.ai_response,
            createdAt: log.created_at,
            success: log.success
        }));
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
}


export async function getDefenseLogs(userId: number, limit = 20) {
    try {
        const { data: defenseLogs, error } = await supabase
            .from('logs')
            .select(`
                *,
                attacker:users!attacker_id(username, tier),
                safe:safes(id, defense_level, theme)
            `)
            .eq('defender_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching defense logs:", error);
            return [];
        }

        return defenseLogs.map((log: any) => ({
            ...log,
            attackerId: log.attacker_id,
            defenderId: log.defender_id,
            safeId: log.safe_id,
            inputPrompt: log.input_prompt,
            aiResponse: log.ai_response,
            creditsSpent: log.credits_spent,
            styleScore: log.style_score,
            createdAt: log.created_at,
            attacker: log.attacker,
            safe: log.safe ? {
                id: log.safe.id,
                defenseLevel: log.safe.defense_level,
                theme: log.safe.theme || 'dracula'
            } : null
        }));
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
