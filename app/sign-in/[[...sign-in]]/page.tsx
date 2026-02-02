import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 font-mono mb-2">
                        SENTINEL ACCESS
                    </h1>
                    <p className="text-slate-400 font-mono text-sm">
                        Identify yourself to enter the network
                    </p>
                </div>

                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-slate-900 border border-slate-800 shadow-xl w-full",
                                headerTitle: "text-slate-100",
                                headerSubtitle: "text-slate-400",
                                socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700",
                                dividerLine: "bg-slate-700",
                                dividerText: "text-slate-500",
                                formFieldLabel: "text-slate-300",
                                formFieldInput: "bg-slate-950 border-slate-700 text-slate-100",
                                footerActionText: "text-slate-400",
                                footerActionLink: "text-cyan-400 hover:text-cyan-300",
                                formButtonPrimary: "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border-none",
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
