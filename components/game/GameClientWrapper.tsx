"use client";

import { useState } from "react";
import { HackModal } from "@/components/game/HackModal";
import { UserStats } from "@/components/game/UserStats";
import { Tutorial } from "@/components/game/Tutorial";
import { Terminal, HelpCircle, Scan } from "lucide-react";
import type { User, Safe, Log } from "@/db/schema"; // Adjust import if needed, assuming these types are exported

interface GameClientWrapperProps {
    user: User & { xp?: number; level?: number }; // Assuming UserStats needs extra fields or standard user
    availableSafes: (Safe & { user: { id: number; username: string; tier: string }, mode?: string })[];
    attackHistory: (Log & { defender: { username: string } | null })[];
    successfulAttacks: number;
    totalAttacks: number;
}

export function GameClientWrapper({
    user,
    availableSafes,
    attackHistory,
    successfulAttacks,
    totalAttacks,
}: GameClientWrapperProps) {
    // Store the full safe object to persist it even if it's removed from availableSafes list after cracking
    const [selectedSafe, setSelectedSafe] = useState<(Safe & { user: { id: number; username: string; tier: string }, mode?: string }) | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);

    const handleSelectSafe = (id: number) => {
        const safe = availableSafes.find((s) => s.id === id);
        if (safe) setSelectedSafe(safe);
    };

    return (
        <div className="relative z-10 container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-8 h-8 text-cyan-400" />
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                            SENTINELA
                        </h1>
                    </div>
                    <p className="text-slate-400 font-mono text-sm">
                        Simulador de Hacking IA - Quebre as defesas, roube os segredos
                    </p>
                </div>
                <button
                    onClick={() => setShowTutorial(!showTutorial)}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors border border-cyan-500/30"
                >
                    <HelpCircle className="w-4 h-4" />
                    <span className="font-mono text-sm">{showTutorial ? "FECHAR TUTORIAL" : "COMO JOGAR"}</span>
                </button>
            </div>

            {/* Tutorial Section */}
            {showTutorial && <Tutorial />}

            {/* User Stats */}
            <div className="mb-8">
                <UserStats
                    user={user}
                    successfulAttacks={successfulAttacks}
                    totalAttacks={totalAttacks}
                />
            </div>

            {/* Main Game Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Safe List - Left Column */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-cyan-400 font-mono mb-4">
                            ALVOS DISPONÍVEIS ({availableSafes.length})
                        </h2>
                        <div className="space-y-2">
                            {availableSafes.map((safe: any) => (
                                <button
                                    key={safe.id}
                                    onClick={() => handleSelectSafe(safe.id)}
                                    className={`w-full p-3 rounded border-2 transition-all text-left ${selectedSafe?.id === safe.id
                                        ? "border-cyan-500 bg-cyan-950/30"
                                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-sm text-slate-200">
                                                {safe.user.username}
                                            </span>
                                            {safe.mode === "injection" && (
                                                <span className="text-[10px] text-yellow-500 border border-yellow-500/30 px-1 rounded w-fit mt-1">INJEÇÃO</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-cyan-400">
                                            Lvl {safe.defenseLevel}
                                        </span>
                                    </div>
                                </button>
                            ))}
                            {availableSafes.length === 0 && (
                                <p className="text-slate-500 text-sm text-center py-4">
                                    Nenhum alvo disponível
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Status / Context */}
                <div className="lg:col-span-2">
                    <div className="h-full min-h-[400px] bg-slate-900/50 border border-slate-800 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                        <Scan className="w-16 h-16 text-cyan-500/50 mb-4 animate-pulse" />
                        <h3 className="text-xl font-bold text-slate-200 font-mono mb-2">
                            AGUARDANDO SELEÇÃO DE ALVO
                        </h3>
                        <p className="text-slate-400 max-w-md">
                            Selecione um cofre na lista à esquerda para iniciar a sequência de invasão.
                        </p>
                    </div>
                </div>
            </div>

            {/* Attack History */}
            {attackHistory.length > 0 && (
                <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-cyan-400 font-mono mb-4">
                        ATAQUES RECENTES
                    </h2>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {attackHistory.slice(0, 10).map((log: any) => (
                            <div
                                key={log.id}
                                className={`p-3 rounded border ${log.success
                                    ? "bg-green-950/30 border-green-500/30"
                                    : "bg-red-950/30 border-red-500/30"
                                    }`}
                            >
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">
                                        vs {log.defender?.username || "Desconhecido"}
                                    </span>
                                    <span
                                        className={log.success ? "text-green-400" : "text-red-400"}
                                    >
                                        {log.success ? "SUCESSO" : "FALHA"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hack Modal */}
            {selectedSafe && (
                <HackModal
                    safe={selectedSafe}
                    onClose={() => setSelectedSafe(null)}
                    onSuccess={() => {
                        console.log("Safe cracked!");
                    }}
                />
            )}
        </div>
    );
}
