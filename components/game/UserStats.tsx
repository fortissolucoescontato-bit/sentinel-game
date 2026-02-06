"use client";

import { Coins, Trophy, Zap, Shield } from "lucide-react";
import type { User } from "@/db/schema";
import { GAME_CONFIG } from "@/lib/game-config";

interface UserStatsProps {
    user: User;
    successfulAttacks?: number;
    totalAttacks?: number;
}

export function UserStats({ user, successfulAttacks = 0, totalAttacks = 0 }: UserStatsProps) {
    const successRate = totalAttacks > 0 ? (successfulAttacks / totalAttacks) * 100 : 0;

    const getTierLimit = (tier: string) => {
        const t = tier.toLowerCase();
        if (t === GAME_CONFIG.TIERS.PRO.NAME) return GAME_CONFIG.TIERS.PRO.LIMIT;
        if (t === GAME_CONFIG.TIERS.ELITE.NAME) return GAME_CONFIG.TIERS.ELITE.LIMIT;
        return GAME_CONFIG.TIERS.NOVATO.LIMIT;
    };

    const tierLimit = getTierLimit(user.tier);

    const getTierColor = (tier: string) => {
        const t = tier.toLowerCase();
        const colors = {
            novato: "from-slate-600 to-slate-800",
            pro: "from-cyan-600 to-cyan-800",
            elite: "from-purple-600 to-purple-800",
        };
        return colors[t as keyof typeof colors] || colors.novato;
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 font-mono">
                        {user.username}
                    </h2>
                    <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <div
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getTierColor(
                        user.tier
                    )} text-white font-bold text-sm`}
                >
                    {user.tier.toUpperCase()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Credits */}
                <div className="bg-slate-950/50 border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-slate-400 font-mono">CRÉDITOS</span>
                    </div>
                    <p className="text-2xl font-bold text-cyan-400 font-mono">
                        {user.credits.toLocaleString()}
                    </p>
                </div>

                {/* Success Rate */}
                <div className="bg-slate-950/50 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-slate-400 font-mono">SUCESSO</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400 font-mono">
                        {successRate.toFixed(0)}%
                    </p>
                </div>

                {/* Total Attacks */}
                <div className="bg-slate-950/50 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-slate-400 font-mono">ATAQUES</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-400 font-mono">
                        {totalAttacks}
                    </p>
                </div>

                {/* Successful Hacks */}
                <div className="bg-slate-950/50 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-slate-400 font-mono">INVASÕES</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-400 font-mono">
                        {successfulAttacks}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-mono">PROGRESSO DE RANK</span>
                    <span className="text-xs text-cyan-400 font-mono">
                        {user.credits} / {tierLimit === Infinity ? "∞" : tierLimit}
                    </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                        style={{
                            width: `${Math.min(
                                (user.credits / (tierLimit === Infinity ? 15000 : tierLimit)) * 100,
                                100
                            )}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
