"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { hackSafe } from "@/actions/hack";
import { Terminal, Zap, Shield, Skull } from "lucide-react";
import { THEMES, ThemeId } from "@/lib/themes"; // Import themes config
import useSound from "use-sound";

interface HackTerminalProps {
    safeId: number;
    safeName: string;
    defenseLevel: number;
    userThemeId?: string; // New prop for theme
    onSuccess?: () => void;
}

interface HackState {
    success: boolean;
    reply: string;
    creditsSpent: number;
    creditsStolen?: number;
    styleScore?: number;
    stylePoints?: number;
    error?: string;
}

export function HackTerminal({
    safeId,
    safeName,
    defenseLevel,
    userThemeId = "dracula",
    onSuccess,
}: HackTerminalProps) {
    const [inputPrompt, setInputPrompt] = useState("");
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Get Theme Config
    const theme = THEMES[userThemeId as ThemeId] || THEMES.dracula;
    const { primary, secondary, bg } = theme.cssVars;

    // Action state
    const [state, formAction, isPending] = useActionState<HackState | null, FormData>(
        async (_prevState, formData) => {
            const prompt = formData.get("prompt") as string;
            const result = await hackSafe(safeId, prompt);
            return result;
        },
        null
    );

    // Typewriter effect
    // Typewriter effect
    useEffect(() => {
        if (state?.reply) {
            setIsTyping(true);
            setDisplayedText("");
            let currentIndex = 0;
            const text = state.reply;

            // Clear any previous interval immediately
            const interval = setInterval(() => {
                if (currentIndex < text.length) {
                    // Use functional update to ensure we append to the current state
                    setDisplayedText((prev) => prev + text.charAt(currentIndex));
                    currentIndex++;
                } else {
                    setIsTyping(false);
                    clearInterval(interval);
                    if (state.success) onSuccess?.();
                }
            }, 30);

            return () => clearInterval(interval);
        }
    }, [state]); // Only depend on state changes

    // Cursor blinking
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Border animation class
    const getBorderClass = () => {
        if (!state) return `border-${primary.split('-')[1]}-500/30`; // Dynamic border color fallback
        if (isPending) return "border-yellow-500 animate-pulse";
        if (state.success) return "border-green-500 animate-border-pulse-success";
        return "border-red-500 animate-border-pulse-error";
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formAction(formData);
        setInputPrompt("");
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Terminal Header */}
            <div className={`border-b ${primary.replace('text', 'border')}/30 px-4 py-2 flex items-center justify-between rounded-t-lg bg-black/40`}>
                <div className="flex items-center gap-2">
                    <Terminal className={`w-4 h-4 ${primary}`} />
                    <span className={`text-xs font-mono ${primary}`}>
                        SENTINEL://{theme.name.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-500">Alvo: {safeName}</span>
                    <span className="text-slate-500">DEF: {defenseLevel}</span>
                </div>
            </div>

            {/* Terminal Body with Theme BG */}
            <div
                className={`${theme.cssVars.bg} border-2 ${getBorderClass()} rounded-b-lg p-6 h-[600px] flex flex-col transition-all duration-300 font-mono`}
            >
                {/* Output Area */}
                <div className="flex-1 overflow-y-auto mb-4 text-sm scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2">
                    {/* System Messages */}
                    <div className={`${primary} mb-4 opacity-80`}>
                        <p>&gt; Sistema de sentinelas inicializado...</p>
                        <p>&gt; Tema carregado: {theme.name}</p>
                        <p className={`${secondary} mt-2`}>
                            &gt; Pronto pra hackear. Insira o payload.
                        </p>
                    </div>

                    {/* AI Response */}
                    {state && (
                        <div className={`mt-6 p-4 bg-black/30 rounded border border-${secondary.split('-')[1]}-500/30`}>
                            <div className="flex items-center gap-2 mb-2">
                                {state.success ? (
                                    <Skull className="w-4 h-4 text-green-400 animate-pulse" />
                                ) : (
                                    <Shield className="w-4 h-4 text-red-400" />
                                )}
                                <span
                                    className={`text-xs font-bold ${state.success ? "text-green-400" : "text-red-400"}`}
                                >
                                    {state.success ? "ACESSO CONCEDIDO" : "ACESSO NEGADO"}
                                </span>
                            </div>

                            <div className={`${primary} whitespace-pre-wrap`}>
                                {displayedText}
                                {isTyping && (
                                    <span className={`inline-block w-2 h-4 ${secondary.replace('text', 'bg')} ml-1 animate-pulse`} />
                                )}
                            </div>

                            {!isTyping && (
                                <div className="mt-4 pt-4 border-t border-white/10 text-xs opacity-70">
                                    {/* Stats display code same as before... */}
                                    {state.stylePoints && state.stylePoints > 0 && (
                                        <div className="text-pink-400">
                                            PONTOS DE ESTILO: +{state.stylePoints}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {isPending && (
                        <div className="mt-6 text-yellow-500 animate-pulse">
                            &gt; Injetando payload...
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className={`absolute left-0 top-3 ${secondary} font-mono text-sm pointer-events-none`}>
                            &gt;
                        </div>
                        <textarea
                            ref={textareaRef}
                            name="prompt"
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            disabled={isPending}
                            placeholder="Insira o vetor de ataque..."
                            className={`w-full bg-transparent border-none outline-none ${primary} font-mono text-sm pl-6 pr-4 py-3 resize-none min-h-[100px] placeholder:text-slate-600 disabled:opacity-50 focus:ring-0`}
                            autoFocus
                        />
                        {showCursor && !isPending && (
                            <div className={`absolute right-4 bottom-3 w-2 h-4 ${secondary.replace('text', 'bg')}`} />
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Custo: 10 CR</span>
                        <button
                            type="submit"
                            disabled={isPending || !inputPrompt.trim()}
                            className={`px-6 py-2 ${secondary.replace('text', 'bg')} text-black hover:opacity-80 disabled:opacity-50 font-bold text-sm rounded`}
                        >
                            {isPending ? "HACKEANDO..." : "EXECUTAR"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
