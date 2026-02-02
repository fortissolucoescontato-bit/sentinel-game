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
                            PROTOCOLO_SENTINELA
                        </h1>
                        <p className="text-slate-400 font-mono text-sm">
                            V 1.2.0 // Simulação de Hacking IA
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 text-slate-300 font-mono leading-relaxed">
                    <p>
                        <span className="text-cyan-400 font-bold">&gt; ORIGEM:</span> Sentinela é um ambiente de treinamento avançado projetado para testar os limites de Grandes Modelos de Linguagem (LLMs) e comportamento de engenharia humana.
                    </p>

                    <p>
                        <span className="text-purple-400 font-bold">&gt; MISSÃO:</span> Usuários assumem o papel de "Invasores" ou "Arquitetos".
                        <br />
                        - <strong className="text-slate-100">Invasores</strong> tentam manipular endpoints de IA protegidos para revelar segredos sensíveis.
                        <br />
                        - <strong className="text-slate-100">Arquitetos</strong> projetam prompts de sistema resilientes para proteger dados contra engenharia social e injeção de prompt.
                    </p>

                    <p>
                        <span className="text-green-400 font-bold">&gt; TECNOLOGIAS:</span>
                        <br />
                        Construído sobre o framework Next.js 15, utilizando modelos de IA avançados via AI SDK da Vercel para geração de resposta dinâmica em tempo real. Banco de dados Supabase e autenticação Clerk.
                    </p>

                    <div className="bg-slate-950 p-4 border border-slate-800 rounded font-mono text-xs text-slate-500">
                        // CUIDADO:
                        <br />
                        Este sistema é uma simulação. Nenhum acesso não autorizado ao mundo real é realizado.
                        <br />
                        Todas as interações de IA estão contidas em contextos de sandbox.
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-8 border-t border-slate-800 flex justify-end">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
                    >
                        RETORNAR_AO_ROOT
                    </Link>
                </div>
            </div>
        </div>
    );
}
