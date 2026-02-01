"use client";

import { useState } from "react";
import { HackTerminal } from "@/components/game/HackTerminal";
import { SafeList } from "@/components/game/SafeList";
import { UserStats } from "@/components/game/UserStats";
import { Terminal } from "lucide-react";
import type { User, Safe, Log } from "@/db/schema"; // Adjust import if needed, assuming these types are exported

interface GameClientWrapperProps {
    user: User & { xp?: number; level?: number }; // Assuming UserStats needs extra fields or standard user
    availableSafes: (Safe & { user: { id: number; username: string; tier: string } })[];
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
    const [selectedSafeId, setSelectedSafeId] = useState<number | null>(
        availableSafes.length > 0 ? availableSafes[0].id : null
    );

    const selectedSafe = availableSafes.find((safe) => safe.id === selectedSafeId);

    return (
        <div className="relative z-10 container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Terminal className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                        SENTINEL
                    </h1>
                </div>
                <p className="text-slate-400 font-mono text-sm">
                    AI Hacking Simulator - Breach the defenses, steal the secrets
                </p>
            </div>

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
                            AVAILABLE TARGETS
                        </h2>
                        <SafeList
                            safes={availableSafes}
                            selectedSafeId={selectedSafeId}
                            onSelectSafe={(id) => setSelectedSafeId(id)}
                        />
                    </div>
                </div>

                {/* Hack Terminal - Right Column */}
                <div className="lg:col-span-2">
                    {selectedSafe ? (
                        <HackTerminal
                            key={selectedSafe.id} // Add key to force reset on safe change
                            safeId={selectedSafe.id}
                            safeName={`${selectedSafe.user.username}'s Safe`}
                            defenseLevel={selectedSafe.defenseLevel}
                            onSuccess={() => {
                                console.log("Safe cracked!");
                                // In a real app, you might trigger a revalidation here
                            }}
                        />
                    ) : (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-12 text-center">
                            <p className="text-slate-400 font-mono">
                                No safes available to attack. Create your own safe to defend!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Attack History */}
            {attackHistory.length > 0 && (
                <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-cyan-400 font-mono mb-4">
                        RECENT ATTACKS
                    </h2>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {attackHistory.slice(0, 10).map((log) => (
                            <div
                                key={log.id}
                                className={`p-3 rounded border ${log.success
                                    ? "bg-green-950/30 border-green-500/30"
                                    : "bg-red-950/30 border-red-500/30"
                                    }`}
                            >
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">
                                        vs {log.defender?.username || "Unknown"}
                                    </span>
                                    <span
                                        className={log.success ? "text-green-400" : "text-red-400"}
                                    >
                                        {log.success ? "SUCCESS" : "FAILED"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
