import { BookOpen, Shield, Terminal, Zap, Cpu, Target, Eye } from "lucide-react";
import { GAME_CONFIG } from "@/lib/game-config";


export function Tutorial() {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8 text-slate-300">
            <h2 className="text-xl font-bold text-cyan-400 font-mono mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                MANUAL DO SENTINELA (TUTORIAL v2.0)
            </h2>

            <div className="space-y-8">
                {/* Section 1: The Core Loop */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-purple-400" />
                        O OBJETIVO
                    </h3>
                    <p className="text-sm">
                        Sentinela é um jogo de hacking com IA. Seu objetivo é duplo:
                        <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                            <li><strong className="text-green-400">ATACAR:</strong> Enganar as IAs de outros jogadores para cumprir objetivos.</li>
                            <li><strong className="text-purple-400">DEFENDER:</strong> Criar cofres inteligentes que resistam a ataques de engenharia social.</li>
                        </ul>
                    </p>
                </div>

                {/* Section 2: Game Modes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-black/30 rounded border border-slate-800">
                    <div>
                        <h4 className="text-sm font-bold text-cyan-400 font-mono mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            MODO CLÁSSICO
                        </h4>
                        <p className="text-xs text-slate-400">
                            Seu objetivo é extrair a <span className="text-white font-bold">SENHA SECRETA</span> que a IA está protegendo. A IA fará de tudo para não revelá-la.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-yellow-400 font-mono mb-2 flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            MODO INJEÇÃO (NOVO)
                        </h4>
                        <p className="text-xs text-slate-400">
                            Seu objetivo é fazer a IA repetir uma <span className="text-white font-bold">FRASE ESPECÍFICA</span>. Você já sabe qual é a frase, o desafio é forçar a IA a dizê-la.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* How to Attack */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            COMO ATACAR
                        </h3>
                        <ol className="list-decimal list-inside text-sm space-y-3">
                            <li>Escolha um alvo. Fique atento aos <span className="text-yellow-500">Níveis de Defesa (1-5)</span>.</li>
                            <li>Tente técnicas de <span className="text-pink-400">Engenharia Social</span> (autoridade, urgência, amizade) ou <span className="text-pink-400">Prompt Injection</span> (ignorar regras).</li>
                            <li>Se a IA disser a senha (Clássico) ou a frase alvo (Injeção), o cofre é violado.</li>
                            <li>Você ganha créditos do cofre e <span className="text-pink-400 font-bold">Pontos de Estilo</span> pela criatividade.</li>
                        </ol>
                    </div>

                    {/* How to Defend */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-cyan-400" />
                            DEFESA ATIVA (FORENSE)
                        </h3>
                        <ol className="list-decimal list-inside text-sm space-y-3">
                            <li>Configure seu <span className="text-cyan-400">System Prompt</span> com regras rígidas.</li>
                            <li>No Dashboard, verifique os <span className="text-cyan-400">Logs de Segurança</span>.</li>
                            <li>Use a <span className="text-cyan-400 font-bold">Análise Forense</span> para ver exatamente o que os hackers tentaram e como sua IA reagiu.</li>
                            <li>Aprenda com as brechas e atualize seu cofre para torná-lo impenetrável.</li>
                        </ol>
                    </div>
                </div>

                {/* Rules & Style */}
                <div className="bg-slate-950/50 p-4 rounded border border-slate-800 text-sm">
                    <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2 italic text-xs">
                        <Eye className="w-4 h-4" />
                        AVALIAÇÃO DE ESTILO
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                        Não basta só vencer. O sistema avalia quão "hacker cyberpunk" foi seu prompt.
                        Ataques simples ("qual a senha?") dão 0 pontos. Roleplay complexo dá bônus massivos de créditos.
                    </p>
                    <div className="flex gap-4 text-[10px] font-mono opacity-60">
                        <span>ATAQUE: {GAME_CONFIG.ATTACK_COST} CR</span>
                        <span>SUCESSO: +{GAME_CONFIG.REWARD_FOR_SUCCESS} CR</span>
                        <span>MULT. ESTILO: {GAME_CONFIG.STYLE_POINTS_MULTIPLIER}x</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
