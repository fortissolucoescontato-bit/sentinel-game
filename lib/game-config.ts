
export const GAME_CONFIG = {
    ATTACK_COST: 10,
    SAFE_CREATION_COST: 500,
    REWARD_FOR_SUCCESS: 100,
    STYLE_POINTS_MULTIPLIER: 5,
    DAILY_REWARD_AMOUNT: 50,
    TIERS: {
        NOVATO: {
            LIMIT: 5000,
            NAME: "novato",
        },
        PRO: {
            LIMIT: 15000,
            NAME: "pro",
        },
        ELITE: {
            LIMIT: Infinity,
            NAME: "elite",
        },
    },
};

export function calculateTier(credits: number): string {
    if (credits >= GAME_CONFIG.TIERS.PRO.LIMIT) {
        return GAME_CONFIG.TIERS.ELITE.NAME;
    }
    if (credits >= GAME_CONFIG.TIERS.NOVATO.LIMIT) {
        return GAME_CONFIG.TIERS.PRO.NAME;
    }
    return GAME_CONFIG.TIERS.NOVATO.NAME;
}
