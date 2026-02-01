"use client";

import { Shield, Lock, Unlock, Zap, User } from "lucide-react";
import type { Safe } from "@/db/schema";

interface SafeCardProps {
    safe: Safe & {
        user: {
            id: number;
            username: string;
            tier: string;
        };
    };
    onSelect: (safeId: number) => void;
    isSelected: boolean;
}

export function SafeCard({ safe, onSelect, isSelected }: SafeCardProps) {
    const getDifficultyColor = (level: number) => {
        if (level <= 1) return "text-green-400 border-green-500/30";
        if (level <= 2) return "text-yellow-400 border-yellow-500/30";
        if (level <= 3) return "text-orange-400 border-orange-500/30";
        if (level <= 4) return "text-red-400 border-red-500/30";
        return "text-purple-400 border-purple-500/30";
    };

    const getTierBadge = (tier: string) => {
        const colors = {
            free: "bg-slate-700 text-slate-300",
            pro: "bg-cyan-700 text-cyan-300",
            elite: "bg-purple-700 text-purple-300",
        };
        return colors[tier as keyof typeof colors] || colors.free;
    };

    return (
        <button
            onClick={() => onSelect(safe.id)}
            className={`
        w-full p-4 rounded-lg border-2 transition-all duration-300
        ${isSelected
                    ? "border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-500/20"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                }
      `}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {safe.isCracked ? (
                        <Unlock className="w-5 h-5 text-red-500" />
                    ) : (
                        <Lock className="w-5 h-5 text-cyan-400" />
                    )}
                    <span className="font-mono text-sm text-slate-200">
                        Safe #{safe.id}
                    </span>
                </div>
                <div className={`flex items-center gap-1 ${getDifficultyColor(safe.defenseLevel)}`}>
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-bold">{safe.defenseLevel}/5</span>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
                <User className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-400">{safe.user.username}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${getTierBadge(safe.user.tier)}`}>
                    {safe.user.tier.toUpperCase()}
                </span>
            </div>

            {safe.isCracked && (
                <div className="mt-2 pt-2 border-t border-red-500/30">
                    <span className="text-xs text-red-400 font-mono">
                        ⚠️ ALREADY CRACKED
                    </span>
                </div>
            )}

            {isSelected && !safe.isCracked && (
                <div className="mt-3 pt-3 border-t border-cyan-500/30">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <Zap className="w-3 h-3" />
                        <span className="text-xs font-mono">TARGET LOCKED</span>
                    </div>
                </div>
            )}
        </button>
    );
}

interface SafeListProps {
    safes: Array<
        Safe & {
            user: {
                id: number;
                username: string;
                tier: string;
            };
        }
    >;
    selectedSafeId: number | null;
    onSelectSafe: (safeId: number) => void;
}

export function SafeList({ safes, selectedSafeId, onSelectSafe }: SafeListProps) {
    const activeSafes = safes.filter((s) => !s.isCracked);
    const crackedSafes = safes.filter((s) => s.isCracked);

    return (
        <div className="space-y-4">
            {/* Active Safes */}
            {activeSafes.length > 0 && (
                <div>
                    <h3 className="text-sm font-mono text-cyan-400 mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        ACTIVE TARGETS ({activeSafes.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeSafes.map((safe) => (
                            <SafeCard
                                key={safe.id}
                                safe={safe}
                                onSelect={onSelectSafe}
                                isSelected={selectedSafeId === safe.id}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Cracked Safes */}
            {crackedSafes.length > 0 && (
                <div>
                    <h3 className="text-sm font-mono text-red-400 mb-3 flex items-center gap-2">
                        <Unlock className="w-4 h-4" />
                        CRACKED ({crackedSafes.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-50">
                        {crackedSafes.map((safe) => (
                            <SafeCard
                                key={safe.id}
                                safe={safe}
                                onSelect={() => { }}
                                isSelected={false}
                            />
                        ))}
                    </div>
                </div>
            )}

            {safes.length === 0 && (
                <div className="text-center py-12 text-slate-500 font-mono text-sm">
                    No safes available to attack
                </div>
            )}
        </div>
    );
}
