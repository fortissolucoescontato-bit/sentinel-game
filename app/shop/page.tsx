import { getServerSideUser } from "@/lib/auth";
import { THEMES } from "@/lib/themes";
import { ThemeCard } from "@/components/shop/ThemeCard";
import { ShoppingBag, Coins, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ShopPage() {
    const user = await getServerSideUser();

    if (!user) {
        redirect("/sign-in");
    }

    const themesList = Object.values(THEMES);

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 font-mono mb-2 flex items-center gap-3">
                            <ShoppingBag className="w-8 h-8 text-cyan-400" />
                            BLACK MARKET // SKINS
                        </h1>
                        <p className="text-slate-400 font-mono text-sm">
                            Customize your neural interface. Warning: Style matters.
                        </p>
                    </div>

                    {/* Wallet */}
                    <div className="flex items-center gap-6 bg-slate-900 border border-slate-800 px-6 py-3 rounded-lg">
                        <div className="text-right">
                            <div className="text-xs text-slate-500 font-mono">AVAILABLE CREDITS</div>
                            <div className="text-xl font-bold font-mono text-slate-200 flex items-center justify-end gap-2">
                                {user.credits} <Coins className="w-4 h-4 text-yellow-500" />
                            </div>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className="text-right">
                            <div className="text-xs text-slate-500 font-mono">STYLE POINTS</div>
                            <div className="text-xl font-bold font-mono text-pink-400 flex items-center justify-end gap-2">
                                {user.stylePoints} <Zap className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {themesList.map((theme) => (
                        <ThemeCard
                            key={theme.id}
                            theme={theme}
                            isUnlocked={user.unlockedThemes.includes(theme.id)}
                            isEquipped={user.currentTheme === theme.id}
                            userCredits={user.credits}
                            userStylePoints={user.stylePoints}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
