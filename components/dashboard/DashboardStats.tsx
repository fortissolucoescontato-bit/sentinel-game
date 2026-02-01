import { Card, CardContent } from "@/components/ui/card";
import { Sword, Shield, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStatsProps {
    stats: {
        attacks: {
            total: number;
            successful: number;
            failed: number;
            successRate: number;
        };
        defenses: {
            total: number;
            breached: number;
            held: number;
            holdRate: number;
        };
    };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Attacks */}
            <Card className="bg-gradient-to-br from-cyan-950/50 to-slate-900/50 border-cyan-500/30">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-cyan-400 font-mono">TOTAL ATTACKS</span>
                        <Sword className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-3xl font-bold text-cyan-400 font-mono">
                        {stats.attacks.total}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                        {stats.attacks.successful} successful
                    </p>
                </CardContent>
            </Card>

            {/* Attack Success Rate */}
            <Card className="bg-gradient-to-br from-green-950/50 to-slate-900/50 border-green-500/30">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-green-400 font-mono">SUCCESS RATE</span>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-400 font-mono">
                        {stats.attacks.successRate}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                        {stats.attacks.failed} failed
                    </p>
                </CardContent>
            </Card>

            {/* Total Defenses */}
            <Card className="bg-gradient-to-br from-purple-950/50 to-slate-900/50 border-purple-500/30">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-purple-400 font-mono">DEFENSES</span>
                        <Shield className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-purple-400 font-mono">
                        {stats.defenses.total}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                        {stats.defenses.held} held
                    </p>
                </CardContent>
            </Card>

            {/* Defense Hold Rate */}
            <Card className="bg-gradient-to-br from-yellow-950/50 to-slate-900/50 border-yellow-500/30">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-yellow-400 font-mono">HOLD RATE</span>
                        <TrendingDown className="w-4 h-4 text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-400 font-mono">
                        {stats.defenses.holdRate}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                        {stats.defenses.breached} breached
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
