
export const GAME_CONFIG = {
    ATTACK_COST: 10,
    SAFE_CREATION_COST: 500,
    REWARD_FOR_SUCCESS: 100,
    STYLE_POINTS_MULTIPLIER: 5,
    TIERS: {
        FREE: {
            LIMIT: 5000,
            NAME: "free",
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
} as const;
