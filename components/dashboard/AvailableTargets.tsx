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
import { Shield, Lock, Zap, User, Target } from "lucide-react";
import type { Safe } from "@/db/schema";

interface AvailableTarget extends Safe {
    user: {
        id: number;
        username: string;
        tier: string;
    };
}

interface AvailableTargetsProps {
    safes: AvailableTarget[];
    userThemeId: string; // Passed from server
}

export function AvailableTargets({ safes, userThemeId }: AvailableTargetsProps) {
    const [selectedSafe, setSelectedSafe] = useState<AvailableTarget | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAttack = (safe: AvailableTarget) => {
        setSelectedSafe(safe);
        setIsDialogOpen(true);
    };

    const handleSuccess = () => {
        setIsDialogOpen(false);
        // Refresh page to update data
        window.location.reload();
    };

    const getDifficultyColor = (level: number) => {
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
        };
        return colors[tier as keyof typeof colors] || colors.free;
    };

    return (
        <>
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono">
                        <Target className="w-5 h-5" />
                        AVAILABLE TARGETS
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {safes.map((safe) => (
                            <div
                                key={safe.id}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 ${getDifficultyColor(
                                    safe.defenseLevel
                                )}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        <span className="font-mono text-sm font-bold">
                                            Safe #{safe.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        <span className="text-xs font-bold">{safe.defenseLevel}/5</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-3 h-3 opacity-70" />
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
                                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm"
                                    size="sm"
                                >
                                    <Zap className="w-3 h-3 mr-1" />
                                    ATTACK (10 credits)
                                </Button>
                            </div>
                        ))}
                    </div>

                    {safes.length === 0 && (
                        <div className="text-center py-12 text-slate-500 font-mono text-sm">
                            No targets available. All safes have been cracked!
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Attack Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-5xl bg-slate-950 border-slate-800 p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle className="text-cyan-400 font-mono">
                            ATTACKING: {selectedSafe?.user.username}'s Safe
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-mono text-xs">
                            Defense Level: {selectedSafe?.defenseLevel}/5 | Cost: 10 credits
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSafe && (
                        <HackTerminal
                            safeId={selectedSafe.id}
                            safeName={`${selectedSafe.user.username}'s Safe`}
                            defenseLevel={selectedSafe.defenseLevel}
                            onSuccess={handleSuccess}
                            userThemeId={userThemeId} // Passed theme
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
