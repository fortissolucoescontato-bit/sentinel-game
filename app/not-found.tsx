import Link from "next/link";

import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            <div className="relative z-10 max-w-md w-full text-center">

                {/* Video Container (Cropped for watermark) */}
                <div className="relative w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden border-2 border-red-500/20 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                    <div className="absolute inset-0 bg-red-500/20 blur-3xl animate-pulse" />
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-150 transform-gpu" // Scale 150% to crop edges (watermark)
                    >
                        <source src="/404-glitch.mp4" type="video/mp4" />
                    </video>
                    {/* Glitch Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent mix-blend-overlay animate-pulse pointer-events-none" />
                </div>

                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 font-mono mb-2 animate-pulse tracking-tighter">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-red-400 font-mono mb-6 tracking-[0.5em] animate-[pulse_2s_ease-in-out_infinite]">
                    SINAL PERDIDO
                </h2>

                <div className="bg-slate-900/80 border border-red-900/50 rounded-lg p-6 mb-8 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-red-500/5 [mask-image:linear-gradient(0deg,white,transparent)]" />
                    <p className="text-red-400/80 font-mono text-sm leading-relaxed relative z-10">
                        <span className="animate-[pulse_1s_ease-in-out_infinite] mr-2">&gt;</span>
                        ERRO CRÍTICO: O nó de rede solicitado não pode ser localizado.
                        <br />
                        <span className="animate-[pulse_1s_ease-in-out_infinite] mr-2 delay-75">&gt;</span>
                        DIAGNÓSTICO: O recurso foi purgado pelos protocolos de segurança da Sentinela.
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="relative inline-flex items-center gap-2 px-8 py-3 bg-red-950/40 hover:bg-red-900/60 border border-red-500/50 text-red-400 hover:text-red-200 font-mono text-sm rounded transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:scale-105 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <Home className="w-4 h-4" />
                    RETORNAR À BASE
                </Link>
            </div>
        </div>
    );
}
