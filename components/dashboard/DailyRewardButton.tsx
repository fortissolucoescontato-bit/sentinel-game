
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Check, Clock } from "lucide-react";
import { claimDailyReward } from "@/actions/user";
import { useRouter } from "next/navigation";


interface DailyRewardButtonProps {
    userId: number;
    lastClaim: Date | null | string;
}

export function DailyRewardButton({ userId, lastClaim }: DailyRewardButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // Simplified alert if toast not available, but trying to be standard

    // Check eligibility
    const now = new Date();
    const last = lastClaim ? new Date(lastClaim) : null;
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    const isEligible = !last || (now.getTime() - last.getTime() >= ONE_DAY_MS);

    // Calculate hours left if not eligible
    const hoursLeft = last ? Math.ceil((ONE_DAY_MS - (now.getTime() - last.getTime())) / (1000 * 60 * 60)) : 0;

    const handleClaim = async () => {
        if (!isEligible) return;

        setLoading(true);
        try {
            const result = await claimDailyReward(userId);
            if (result.success) {
                alert(`🎉 SUCESSO! ${result.message}`);
                router.refresh(); // Refresh to update credits on UI
            } else {
                alert(`⚠️ ${result.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao tentar resgatar recompensa.");
        } finally {
            setLoading(false);
        }
    };

    if (!isEligible) {
        return (
            <div className="block w-full p-4 bg-slate-800/50 border border-slate-700 text-slate-500 font-mono text-sm rounded text-center cursor-not-allowed opacity-70">
                <Clock className="w-4 h-4 inline mr-2 mb-1" />
                RESGATADO ({hoursLeft}h)
            </div>
        );
    }

    return (
        <button
            onClick={handleClaim}
            disabled={loading}
            className="block w-full p-4 bg-green-900/20 hover:bg-green-900/40 border border-green-500/30 text-green-300 hover:text-green-200 font-mono text-sm rounded transition-all text-center group animate-pulse"
        >
            {loading ? (
                <span>PROCESSANDO...</span>
            ) : (
                <>
                    <Gift className="w-4 h-4 inline mr-2 mb-1" />
                    RESGATAR RECOMPENSA <span className="opacity-50 text-xs block group-hover:opacity-100 transition-opacity">(+50 Créditos)</span>
                </>
            )}
        </button>
    );
}
