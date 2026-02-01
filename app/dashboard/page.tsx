import { Suspense } from "react";
import { Terminal, Activity, ShieldAlert } from "lucide-react";
import { getAvailableSafes } from "@/actions/hack";
import { getTopHackers, getDashboardStats } from "@/actions/leaderboard";
import { getDefenseLogs } from "@/actions/logs";
import { getServerSideUser } from "@/lib/auth";
import { UserStats } from "@/components/game/UserStats";
import { LeaderboardTable } from "@/components/dashboard/LeaderboardTable";
import { AvailableTargets } from "@/components/dashboard/AvailableTargets";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { SecurityLogs } from "@/components/dashboard/SecurityLogs";
import {
    LeaderboardSkeleton,
    StatsSkeleton,
    SafeListSkeleton,
} from "@/components/dashboard/Skeletons";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// --- Server Components ---

async function LeaderboardSection() {
    const topHackers = await getTopHackers(10);
    return <LeaderboardTable hackers={topHackers} />;
}

async function StatsSection({ userId }: { userId: number }) {
    const stats = await getDashboardStats(userId);
    return <DashboardStats stats={stats} />;
}

// Updated to receive themeId
async function TargetsSection({ userId, themeId }: { userId: number, themeId: string }) {
    const safes = await getAvailableSafes(userId);
    return <AvailableTargets safes={safes} userThemeId={themeId} />;
}

async function LogsSection({ userId }: { userId: number }) {
    const logs = await getDefenseLogs(userId);
    return <SecurityLogs logs={logs} />;
}

function LogsSkeleton() {
    return <Skeleton className="w-full h-[300px] bg-slate-900/50 rounded-lg" />
}

// --- Main Page ---

export default async function DashboardPage() {
    const user = await getServerSideUser();

    if (!user) {
        redirect("/sign-in");
    }

    const userId = user.id;
    const stats = await getDashboardStats(userId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            {/* Animated Orbs */}
            <div className="fixed top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-8 h-8 text-cyan-400" />
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                            SENTINEL DASHBOARD
                        </h1>
                    </div>
                    <p className="text-slate-400 font-mono text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Real-time hacking statistics and leaderboard
                    </p>
                </div>

                {/* User Profile */}
                <div className="mb-8">
                    <UserStats
                        user={user}
                        successfulAttacks={stats.attacks.successful}
                        totalAttacks={stats.attacks.total}
                    />
                </div>

                {/* Stats & Quick Actions Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Main Stats */}
                    <div className="lg:col-span-2">
                        <DashboardStats stats={stats} />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-lg p-6 flex flex-col justify-center">
                        <h3 className="text-sm font-mono text-cyan-400 mb-4 text-center">COMMAND CENTER</h3>
                        <div className="space-y-3">
                            <Link
                                href="/create-safe"
                                className="block w-full p-4 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 hover:text-purple-200 font-mono text-sm rounded transition-all text-center group"
                            >
                                <ShieldAlert className="w-4 h-4 inline mr-2 mb-1" />
                                DEPLOY DEFENSE <span className="opacity-50 text-xs block group-hover:opacity-100 transition-opacity">(-500 Credits)</span>
                            </Link>
                            <Link
                                href="/shop" // Shop Link
                                className="block w-full p-4 bg-cyan-900/20 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 font-mono text-sm rounded transition-all text-center group"
                            >
                                BLACK MARKET <span className="opacity-50 text-xs block group-hover:opacity-100 transition-opacity">(Buy Skins)</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* SECURITY LOGS */}
                <div className="mb-8">
                    <Suspense fallback={<LogsSkeleton />}>
                        <LogsSection userId={userId} />
                    </Suspense>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Leaderboard - 2 columns */}
                    <div className="lg:col-span-2">
                        <Suspense fallback={<LeaderboardSkeleton />}>
                            <LeaderboardSection />
                        </Suspense>
                    </div>

                    {/* Rank Card */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-sm font-mono text-cyan-400 mb-4">YOUR RANK</h3>
                            <div className="text-center">
                                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                                    #{user.tier === 'elite' ? '1' : '?'}
                                </p>
                                <p className="text-xs text-slate-500 font-mono">
                                    Keep hacking to climb the ranks!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Targets with Suspense */}
                <Suspense fallback={<SafeListSkeleton />}>
                    <TargetsSection userId={userId} themeId={user.currentTheme} />
                </Suspense>
            </div>
        </div>
    );
}
