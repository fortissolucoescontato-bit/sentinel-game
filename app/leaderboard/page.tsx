import { getServerSideUser } from "@/lib/auth";
import { getTopHackers, getTopDefenders } from "@/actions/leaderboard";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Shield, Swords, Crown, Medal } from "lucide-react";

export default async function LeaderboardPage() {
    const user = await getServerSideUser(); // Optional auth check but good for logs

    const [topHackers, topDefenders] = await Promise.all([
        getTopHackers(10),
        getTopDefenders(10),
    ]);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />;
        if (index === 1) return <Medal className="w-5 h-5 text-slate-300" />;
        if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
        return <span className="text-slate-500 font-mono w-5 text-center">#{index + 1}</span>;
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8">
            {/* Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(30,41,59,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.2)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-mono mb-4 flex items-center justify-center gap-4">
                        <Trophy className="w-10 h-10 text-yellow-500" />
                        HALL DA FAMA GLOBAL
                    </h1>
                    <p className="text-slate-400 font-mono">
                        A elite da Rede Sentinela. Hackers e Arquitetos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* OFFENSIVE TABLE */}
                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-cyan-400 font-mono tracking-wider">
                                <Swords className="w-6 h-6" />
                                TOP HACKERS (RIQUEZA)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-950/50">
                                    <TableRow className="border-slate-800">
                                        <TableHead className="w-16 text-center text-slate-500">RANK</TableHead>
                                        <TableHead className="text-slate-400">OPERADOR</TableHead>
                                        <TableHead className="text-right text-slate-400">PATRIMÔNIO</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topHackers.map((hacker, i) => (
                                        <TableRow key={hacker.id} className="border-slate-800 hover:bg-cyan-950/10 transition-colors">
                                            <TableCell className="font-bold flex justify-center items-center py-4">
                                                {getRankIcon(i)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className={`font-mono font-bold ${i === 0 ? "text-yellow-200" : "text-slate-200"}`}>
                                                        {hacker.username}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                                                        {hacker.tier}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-cyan-400 text-lg">
                                                {hacker.credits.toLocaleString()} CR
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* DEFENSIVE TABLE */}
                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-purple-400 font-mono tracking-wider">
                                <Shield className="w-6 h-6" />
                                ARQUITETOS DE FERRO (BLOQUEIOS)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-950/50">
                                    <TableRow className="border-slate-800">
                                        <TableHead className="w-16 text-center text-slate-500">RANK</TableHead>
                                        <TableHead className="text-slate-400">ARQUITETO</TableHead>
                                        <TableHead className="text-right text-slate-400">ATAQUES BLOQUEADOS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topDefenders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-slate-500 py-8 font-mono">
                                                Sem dados defensivos. Seja o primeiro a defender!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        topDefenders.map((defender, i) => (
                                            <TableRow key={defender.id} className="border-slate-800 hover:bg-purple-950/10 transition-colors">
                                                <TableCell className="font-bold flex justify-center items-center py-4">
                                                    {getRankIcon(i)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className={`font-mono font-bold ${i === 0 ? "text-yellow-200" : "text-slate-200"}`}>
                                                            {defender.username}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                                                            {defender.tier}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-purple-400 text-lg">
                                                    {defender.blocks}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
