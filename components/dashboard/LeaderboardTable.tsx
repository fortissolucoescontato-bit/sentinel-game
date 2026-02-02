import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Target } from "lucide-react";

interface LeaderboardEntry {
    id: number;
    username: string;
    credits: number;
    tier: string;
    stylePoints?: number;
    totalAttacks?: number;
    successfulAttacks?: number;
    successRate?: number;
}

interface LeaderboardTableProps {
    hackers: LeaderboardEntry[];
}

export function LeaderboardTable({ hackers }: LeaderboardTableProps) {
    const getTierBadge = (tier: string) => {
        const colors = {
            free: "bg-slate-700 text-slate-300",
            pro: "bg-cyan-700 text-cyan-300",
            elite: "bg-purple-700 text-purple-300",
        };
        return colors[tier as keyof typeof colors] || colors.free;
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };

    // Check if we have attack stats
    const hasAttackStats = hackers.length > 0 && hackers[0].totalAttacks !== undefined;

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono">
                    <Trophy className="w-5 h-5" />
                    TOP 10 HACKERS MAIS RICOS
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-950 border-slate-800 hover:bg-slate-950">
                                <TableHead className="text-cyan-400 font-mono">RANK</TableHead>
                                <TableHead className="text-cyan-400 font-mono">OPERADOR</TableHead>
                                <TableHead className="text-cyan-400 font-mono">NÍVEL</TableHead>
                                <TableHead className="text-cyan-400 font-mono text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        CRÉDITOS
                                    </div>
                                </TableHead>
                                {hasAttackStats && (
                                    <>
                                        <TableHead className="text-cyan-400 font-mono text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Target className="w-3 h-3" />
                                                ATAQUES
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-cyan-400 font-mono text-right">
                                            SUCESSO
                                        </TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hackers.map((hacker, index) => (
                                <TableRow
                                    key={hacker.id}
                                    className="border-slate-800 hover:bg-slate-900/50 transition-colors"
                                >
                                    <TableCell className="font-mono font-bold text-lg">
                                        {getRankIcon(index)}
                                    </TableCell>
                                    <TableCell className="font-mono text-slate-200">
                                        {hacker.username}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`text-xs px-2 py-1 rounded font-mono ${getTierBadge(
                                                hacker.tier
                                            )}`}
                                        >
                                            {hacker.tier.toUpperCase()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-cyan-400">
                                        {hacker.credits.toLocaleString()}
                                    </TableCell>
                                    {hasAttackStats && (
                                        <>
                                            <TableCell className="text-right font-mono text-slate-400">
                                                {hacker.successfulAttacks}/{hacker.totalAttacks}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                <span
                                                    className={`${(hacker.successRate ?? 0) >= 70
                                                        ? "text-green-400"
                                                        : (hacker.successRate ?? 0) >= 40
                                                            ? "text-yellow-400"
                                                            : "text-red-400"
                                                        }`}
                                                >
                                                    {hacker.successRate}%
                                                </span>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {hackers.length === 0 && (
                    <div className="text-center py-12 text-slate-500 font-mono text-sm">
                        Nenhum hacker encontrado
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
