import { getServerSideUser } from "@/lib/auth";
import { CreateSafeForm } from "@/components/game/CreateSafeForm";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";

export default async function CreateSafePage() {
    const user = await getServerSideUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-3xl">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-slate-800 mb-4 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                        <Shield className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-mono mb-2">
                        DEPLOY NEW DEFENSE
                    </h1>
                    <p className="text-slate-400 font-mono">
                        Configure your AI sentinel to protect your secrets.
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 backdrop-blur-sm">
                    <CreateSafeForm userCredits={user.credits} unlockedThemes={user.unlockedThemes} />
                </div>
            </div>
        </div>
    );
}
