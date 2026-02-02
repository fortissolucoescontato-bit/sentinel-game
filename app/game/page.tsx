import { GameClientWrapper } from "@/components/game/GameClientWrapper";
import { getAvailableSafes, getAttackHistory } from "@/actions/hack";
import { getUserProfile } from "@/actions/user";
import { getServerSideUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function GamePage() {
    // Get authenticated user
    const authenticatedUser = await getServerSideUser();

    if (!authenticatedUser) {
        redirect("/sign-in");
    }

    const userId = authenticatedUser.id;

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

    const successfulAttacks = attackHistory.filter((log: any) => log.success).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            <GameClientWrapper
                user={user}
                availableSafes={availableSafes}
                attackHistory={attackHistory}
                successfulAttacks={successfulAttacks}
                totalAttacks={attackHistory.length}
            />
        </div>
    );
}
