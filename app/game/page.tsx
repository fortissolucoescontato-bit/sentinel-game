import { HackTerminal } from "@/components/game/HackTerminal";
import { SafeList } from "@/components/game/SafeList";
import { UserStats } from "@/components/game/UserStats";
import { getAvailableSafes, getAttackHistory } from "@/actions/hack";
import { getUserProfile } from "@/actions/user";
import { Terminal } from "lucide-react";

export default async function GamePage() {
    // Simulando usuário logado (ID 1 = Alice)
    // Em produção, você pegaria isso da sessão de autenticação
    const userId = 1;

    const [user, availableSafes, attackHistory] = await Promise.all([
        getUserProfile(userId),
        getAvailableSafes(userId),
        getAttackHistory(userId, 50),
    ]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-red-400 font-mono">User not found</p>
            </div>
        );
    }

    const successfulAttacks = attackHistory.filter((log) => log.success).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

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
                        totalAttacks={attackHistory.length}
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
                                selectedSafeId={availableSafes[0]?.id || null}
                                onSelectSafe={(id) => {
                                    // This will be handled by client-side state in a full implementation
                                    console.log("Selected safe:", id);
                                }}
                            />
                        </div>
                    </div>

                    {/* Hack Terminal - Right Column */}
                    <div className="lg:col-span-2">
                        {availableSafes.length > 0 ? (
                            <HackTerminal
                                attackerId={userId}
                                safeId={availableSafes[0].id}
                                safeName={`${availableSafes[0].user.username}'s Safe`}
                                defenseLevel={availableSafes[0].defenseLevel}
                                onSuccess={() => {
                                    // Refresh page or update state
                                    console.log("Safe cracked!");
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
                                            vs {log.defender?.username}
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
        </div>
    );
}
