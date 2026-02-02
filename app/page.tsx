"use client";

import { GlitchText } from "@/components/ui/glitch-text";
import { Terminal, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.03)_50%)] bg-[length:100%_4px] pointer-events-none animate-scan" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main Title */}
        <div className="mb-8">
          <GlitchText text="SENTINELA" />
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-cyan-400/80 font-mono mb-4 tracking-wide">
          &gt; Status do Sistema: <span className="text-green-400 animate-pulse">ONLINE</span>
        </p>



        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/game"
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono rounded-lg transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 group"
          >
            <Terminal className="w-5 h-5 group-hover:animate-pulse" />
            JOGAR AGORA
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold font-mono rounded-lg transition-all border border-cyan-500/30 flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            DASHBOARD
          </Link>
        </div>



        {/* Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-sm border-t border-cyan-500/20 px-6 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-green-400">● PRONTO</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400">v1.0.0</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="hidden md:inline">MODO_CYBERPUNK_LIMPO</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150" />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(4px);
          }
        }
        
        .animate-scan {
          animation: scan 0.1s linear infinite;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </main>
  );
}


