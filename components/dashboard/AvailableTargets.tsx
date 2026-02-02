"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HackTerminal } from "@/components/game/HackTerminal";
import { Shield, Lock, Zap, User, Target, Crown, Users } from "lucide-react";
import type { Safe } from "@/db/schema";

interface AvailableTarget extends Safe {
    user: {
        id: number;
        username: string;
        tier: string;
    };
    isUnlocked?: boolean;
}

interface AvailableTargetsProps {
    safes: AvailableTarget[];
    userThemeId: string; // Passed from server
}

export function AvailableTargets({ safes, userThemeId }: AvailableTargetsProps) {
    const [selectedSafe, setSelectedSafe] = useState<AvailableTarget | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Split safes
    const officialSafes = safes.filter(s => s.user.tier === 'system' || s.user.username === 'SENTINEL_CORE');
    const communitySafes = safes.filter(s => s.user.tier !== 'system' && s.user.username !== 'SENTINEL_CORE');

    // Default tab: If there are official safes, show them? Or show Community? 
    // Usually standard game progression starts with official.
    const [activeTab, setActiveTab] = useState("community");

    const handleAttack = (safe: AvailableTarget) => {
        setSelectedSafe(safe);
        setIsDialogOpen(true);
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        // Refresh page to update data
        window.location.reload();
    };

    const getDifficultyColor = (level: number, isUnlocked?: boolean) => {
        if (isUnlocked) return "text-green-400 border-green-500 bg-green-950/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]";

        if (level <= 1) return "text-green-400 border-green-500/30 bg-green-950/20";
        if (level <= 2) return "text-yellow-400 border-yellow-500/30 bg-yellow-950/20";
        if (level <= 3) return "text-orange-400 border-orange-500/30 bg-orange-950/20";
        if (level <= 4) return "text-red-400 border-red-500/30 bg-red-950/20";
        return "text-purple-400 border-purple-500/30 bg-purple-950/20";
    };

    const getTierBadge = (tier: string) => {
        const colors = {
            free: "bg-slate-700 text-slate-300",
            pro: "bg-cyan-700 text-cyan-300",
            elite: "bg-purple-700 text-purple-300",
            system: "bg-red-700/50 text-red-200 border border-red-500/50",
        };
        return colors[tier as keyof typeof colors] || colors.free;
    };

    const SafeGrid = ({ items, emptyMessage }: { items: AvailableTarget[], emptyMessage: string }) => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((safe) => (
                    <div
                        key={safe.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${getDifficultyColor(
                            safe.defenseLevel,
                            safe.isUnlocked
                        )}`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Lock className={`w-4 h-4 ${safe.isUnlocked ? "text-green-400" : ""}`} />
                                <span className={`font-mono text-sm font-bold ${safe.isUnlocked ? "line-through opacity-70" : ""}`}>
                                    Cofre #{safe.id}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {safe.isUnlocked ? (
                                    <span className="text-xs font-bold font-mono bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/50">
                                        VENCIDO
                                    </span>
                                ) : (
                                    <>
                                        <Shield className="w-3 h-3" />
                                        <span className="text-xs font-bold">{safe.defenseLevel}/5</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            {safe.user.tier === 'system' ? (
                                <Crown className="w-3 h-3 text-yellow-500" />
                            ) : (
                                <User className="w-3 h-3 opacity-70" />
                            )}
                            <span className="text-xs opacity-90">{safe.user.username}</span>
                            <span
                                className={`text-xs px-2 py-0.5 rounded ${getTierBadge(
                                    safe.user.tier
                                )}`}
                            >
                                {safe.user.tier.toUpperCase()}
                            </span>
                        </div>

                        <Button
                            onClick={() => handleAttack(safe)}
                            className={`w-full font-mono text-sm ${safe.isUnlocked
                                    ? "bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/50"
                                    : "bg-cyan-600 hover:bg-cyan-500 text-white"
                                }`}
                            size="sm"
                        >
                            <Zap className="w-3 h-3 mr-1" />
                            {safe.isUnlocked ? "ATACAR NOVAMENTE (10cr)" : "ATACAR (10 créditos)"}
                        </Button>
                    </div>
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center py-12 text-slate-500 font-mono text-sm">
                    {emptyMessage}
                </div>
            )}
        </>
    );

    return (
        <>
            <div className="w-full space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-cyan-400 font-mono">
                        <Target className="w-6 h-6" />
                        ALVOS DISPONÍVEIS
                    </h2>

                    <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("community")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all ${activeTab === "community"
                                ? "bg-cyan-950 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            COMUNIDADE
                        </button>
                        <button
                            onClick={() => setActiveTab("official")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all ${activeTab === "official"
                                ? "bg-purple-950 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Crown className="w-4 h-4" />
                            OFICIAIS
                        </button>
                    </div>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="pt-6">
                        {activeTab === "community" ? (
                            <SafeGrid
                                items={communitySafes}
                                emptyMessage="Nenhum alvo da comunidade disponível. Todos os cofres foram quebrados!"
                            />
                        ) : (
                            <SafeGrid
                                items={officialSafes}
                                emptyMessage="Nenhum desafio oficial disponível no momento."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Attack Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-5xl bg-slate-950 border-slate-800 p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle className="text-cyan-400 font-mono">
                            ATACANDO: Cofre de {selectedSafe?.user.username}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-mono text-xs">
                            Nível de Defesa: {selectedSafe?.defenseLevel}/5 | Custo: 10 créditos
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSafe && (
                        <HackTerminal
                            safeId={selectedSafe.id}
                            safeName={`${selectedSafe.user.username} (Cofre)`}
                            defenseLevel={selectedSafe.defenseLevel}
                            onSuccess={handleSuccess}
                            themeId={selectedSafe.theme || 'dracula'} // Use target's theme
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
