import { Terminal } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-slate-900/50 border border-slate-800 rounded-lg p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-cyan-900/20 rounded-full border border-cyan-500/30">
                        <Terminal className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            SENTINEL_PROTOCOL
                        </h1>
                        <p className="text-slate-400 font-mono text-sm">
                            V 1.0.0 // AI Hacking Simulation
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 text-slate-300 font-mono leading-relaxed">
                    <p>
                        <span className="text-cyan-400 font-bold">&gt; ORIGIN:</span> Sentinel is an advanced training environment designed to test the limits of Large Language Models (LLMs) and human engineering behavior.
                    </p>

                    <p>
                        <span className="text-purple-400 font-bold">&gt; MISSION:</span> Users assume the role of "Breachers" or "Architects".
                        <br />
                        - <strong className="text-slate-100">Breachers</strong> attempt to manipulate protected AI endpoints to reveal sensitive secrets.
                        <br />
                        - <strong className="text-slate-100">Architects</strong> design resilient system prompts to secure data against social engineering and prompt injection.
                    </p>

                    <p>
                        <span className="text-green-400 font-bold">&gt; TECHNOLOGIES:</span>
                        <br />
                        Built on the Next.js 16 frameworks, utilizing advanced AI models (Llama 3 via Groq) for real-time dynamic response generation. Authenticated via Clerk.
                    </p>

                    <div className="bg-slate-950 p-4 border border-slate-800 rounded font-mono text-xs text-slate-500">
                        // CAUTION:
                        <br />
                        This system is a simulation. No real-world unauthorized access is performed.
                        <br />
                        All AI interactions are contained within sandboxed contexts.
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-8 border-t border-slate-800 flex justify-end">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
                    >
                        RETURN_TO_ROOT
                    </Link>
                </div>
            </div>
        </div>
    );
}
