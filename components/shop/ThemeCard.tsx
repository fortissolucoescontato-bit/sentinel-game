"use client";

import { useState } from "react";
import { ThemeConfig } from "@/lib/themes";
import { buyTheme, equipTheme } from "@/actions/shop";
import { Loader2, Check, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // If you have sonner, otherwise console/alert

interface ThemeCardProps {
    theme: ThemeConfig;
    isUnlocked: boolean;
    isEquipped: boolean;
    userCredits: number;
    userStylePoints: number;
}

export function ThemeCard({ theme, isUnlocked, isEquipped, userCredits, userStylePoints }: ThemeCardProps) {
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
        setLoading(true);
        const res = await buyTheme(theme.id);
        setLoading(false);
        if (res.error) {
            alert(res.error);
        }
    };

    const handleEquip = async () => {
        setLoading(true);
        const res = await equipTheme(theme.id);
        setLoading(false);
        if (res.error) {
            alert(res.error);
        }
    };

    const canAfford = userCredits >= theme.priceCredits && userStylePoints >= theme.priceStylePoints;

    return (
        <div className={`relative overflow-hidden rounded-xl border ${isEquipped ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-slate-800'} bg-slate-900 flex flex-col transition-all hover:scale-[1.02]`}>

            {/* Preview Area */}
            <div className={`h-24 w-full bg-gradient-to-br ${theme.previewColors} relative`}>
                {isEquipped && (
                    <div className="absolute top-2 right-2 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> EQUIPPED
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold text-white/20 select-none">
                    &gt;_ TERMINAL
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className={`text-lg font-bold font-mono ${isEquipped ? 'text-cyan-400' : 'text-slate-200'}`}>
                    {theme.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mb-4 h-8">
                    {theme.description}
                </p>

                <div className="mt-auto space-y-3">
                    {/* Price Tags */}
                    {!isUnlocked && (
                        <div className="flex items-center gap-3 text-xs font-mono">
                            {theme.priceCredits > 0 && (
                                <span className={canAfford ? "text-slate-300" : "text-red-400"}>
                                    {theme.priceCredits} CR
                                </span>
                            )}
                            {theme.priceStylePoints > 0 && (
                                <span className="flex items-center gap-1 text-pink-400">
                                    <Zap className="w-3 h-3" /> {theme.priceStylePoints} SP
                                </span>
                            )}
                            {theme.priceCredits === 0 && theme.priceStylePoints === 0 && (
                                <span className="text-green-400">FREE</span>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    {isUnlocked ? (
                        <Button
                            onClick={handleEquip}
                            disabled={isEquipped || loading}
                            className={`w-full font-mono text-xs ${isEquipped ? 'bg-slate-800 text-slate-500' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isEquipped ? "ACTIVE" : "EQUIP"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleBuy}
                            disabled={!canAfford || loading}
                            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : (!canAfford ? "LOCKED" : "PURCHASE")}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
