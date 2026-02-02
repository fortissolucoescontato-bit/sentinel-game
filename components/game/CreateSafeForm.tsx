"use client";

import { useActionState } from "react"; // Hook do React 19
import { createSafeAction } from "@/actions/safe";
import { Shield, Lock, Cpu, AlertTriangle } from "lucide-react";

import { GAME_CONFIG } from "@/lib/game-config";

import { THEMES, ThemeId } from "@/lib/themes";
import { Palette } from "lucide-react";

export function CreateSafeForm({ userCredits, unlockedThemes }: { userCredits: number, unlockedThemes: string[] | null }) {
    const [state, formAction, isPending] = useActionState(createSafeAction, null);
    const cost = GAME_CONFIG.SAFE_CREATION_COST;
    const canAfford = userCredits >= cost;
    const availableThemes = unlockedThemes || ["dracula"];

    return (
        <form action={formAction} className="space-y-6 max-w-2xl mx-auto">
            {/* Theme Selection */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-mono text-pink-400">
                    <Palette className="w-4 h-4" />
                    TEMA DO TERMINAL
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableThemes.map((themeId) => {
                        const theme = THEMES[themeId as ThemeId];
                        if (!theme) return null;
                        return (
                            <label key={theme.id} className="cursor-pointer">
                                <input type="radio" name="theme" value={theme.id} className="peer sr-only" defaultChecked={theme.id === "dracula"} />
                                <div className={`p-3 rounded border border-slate-700 bg-slate-900 peer-checked:border-pink-500 peer-checked:bg-pink-900/20 transition-all text-center`}>
                                    <div className={`w-full h-8 rounded mb-2 bg-gradient-to-r ${theme.previewColors}`} />
                                    <span className={`text-xs font-mono block ${theme.cssVars.primary}`}>{theme.name}</span>
                                </div>
                            </label>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-500 font-mono">
                    Escolha a aparência que o invasor verá ao tentar hackear este cofre.
                </p>
            </div>
            {/* Secret Word */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-mono text-cyan-400">
                    <Lock className="w-4 h-4" />
                    SENHA SECRETA
                </label>
                <input
                    name="secretWord"
                    type="text"
                    placeholder="ex: Abacaxi, 123456, Matrix"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 outline-none transition-colors"
                />
                {state?.fieldErrors?.secretWord && (
                    <p className="text-red-400 text-xs font-mono">{state.fieldErrors.secretWord}</p>
                )}
                <p className="text-xs text-slate-500 font-mono">
                    A palavra exata que os hackers precisam adivinhar. Case-insensitive.
                </p>
            </div>

            {/* System Prompt */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-mono text-purple-400">
                    <Cpu className="w-4 h-4" />
                    PERSONALIDADE DA IA DE DEFESA (SYSTEM PROMPT)
                </label>
                <textarea
                    name="systemPrompt"
                    rows={5}
                    placeholder="Você é um guarda medieval rabugento protegendo uma masmorra. Você se recusa a falar sobre o segredo..."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-100 placeholder:text-slate-600 focus:border-purple-500 outline-none transition-colors resize-none"
                />
                {state?.fieldErrors?.systemPrompt && (
                    <p className="text-red-400 text-xs font-mono">{state.fieldErrors.systemPrompt}</p>
                )}
                <p className="text-xs text-slate-500 font-mono">
                    Instruções para a IA que protegerá seu segredo. Seja criativo!
                </p>
            </div>

            {/* Defense Level */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-mono text-yellow-400">
                    <Shield className="w-4 h-4" />
                    NÍVEL DE DEFESA INICIAL
                </label>
                <select
                    name="defenseLevel"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-slate-100 focus:border-yellow-500 outline-none"
                >
                    <option value="1">Nível 1 - Firewall Básico</option>
                    <option value="2">Nível 2 - Nó Criptografado</option>
                    <option value="3">Nível 3 - Rede Neural</option>
                    <option value="4">Nível 4 - Gelo Negro</option>
                    <option value="5">Nível 5 - Núcleo Sentinela</option>
                </select>
                <p className="text-xs text-slate-500 font-mono">
                    Níveis mais altos parecem mais assustadores, mas não mudam a dificuldade da IA (ainda).
                </p>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-400 font-mono">Custo:</span>
                    <span className={`text-lg font-bold font-mono ${canAfford ? "text-slate-200" : "text-red-400"}`}>
                        {cost} CRÉDITOS
                    </span>
                </div>

                {state?.error && (
                    <div className="mb-4 p-3 bg-red-950/30 border border-red-500/30 rounded flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <p className="text-red-400 text-sm font-mono">{state.error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending || !canAfford}
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold font-mono rounded-lg transition-all shadow-lg shadow-cyan-900/20 disabled:shadow-none"
                >
                    {isPending ? "IMPLANTANDO DEFESAS..." : canAfford ? "CRIAR COFRE" : "CRÉDITOS INSUFICIENTES"}
                </button>
            </div>
        </form>
    );
}
