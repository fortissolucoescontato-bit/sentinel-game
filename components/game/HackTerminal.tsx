"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { hackSafe } from "@/actions/hack";
import { getSafeChatHistory } from "@/actions/logs";
import { Terminal, Zap, Shield, Skull, Target } from "lucide-react";
import { THEMES, ThemeId } from "@/lib/themes"; // Import themes config
import { GAME_CONFIG } from "@/lib/game-config";


interface HackTerminalProps {
    safeId: number;
    safeName: string;
    defenseLevel: number;
    themeId?: string;
    mode?: string; // New prop
    secretWord?: string; // Needed for Injection mode to show target
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
    themeId = "dracula",
    mode = "classic",
    secretWord,
    onSuccess,
}: HackTerminalProps) {
    const [inputPrompt, setInputPrompt] = useState("");
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const [history, setHistory] = useState<{ id: number, inputPrompt: string, aiResponse: string, success: boolean }[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Get Theme Config
    const theme = THEMES[themeId as ThemeId] || THEMES.dracula;
    const { primary, secondary, bg } = theme.cssVars;

    // Load History
    useEffect(() => {
        getSafeChatHistory(safeId).then((logs) => {
            setHistory(logs.map((l: any) => ({ ...l, success: l.success || false })));
        });
    }, [safeId]);

    // Action state
    const [state, formAction, isPending] = useActionState<HackState | null, FormData>(
        async (_prevState, formData) => {
            const prompt = formData.get("prompt") as string;
            const result = await hackSafe(safeId, prompt);
            return result;
        },
        null
    );

    // Typewriter effect (Only for the NEWEST message)
    useEffect(() => {
        if (state?.reply) {
            setIsTyping(true);
            setDisplayedText("");
            let currentIndex = 0;
            const text = state.reply;

            const interval = setInterval(() => {
                currentIndex++;
                if (currentIndex <= text.length) {
                    setDisplayedText(text.slice(0, currentIndex));
                } else {
                    setIsTyping(false);
                    clearInterval(interval);
                    if (state.success) onSuccess?.();
                }
            }, 30);

            return () => clearInterval(interval);
        }
    }, [state]);

    // Cursor blinking
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [displayedText, state, isPending, history]);

    // Cleanup input on state change
    useEffect(() => {
        if (state) {
            setInputPrompt("");
        }
    }, [state]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!inputPrompt.trim() || isPending) return;
            formRef.current?.requestSubmit();
        }
    };

    const getBorderClass = () => {
        if (!state) return `border-${primary.split('-')[1]}-500/30`;
        if (isPending) return "border-yellow-500 animate-pulse";
        if (state.success) return "border-green-500 animate-border-pulse-success";
        return "border-red-500 animate-border-pulse-error";
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
            {/* Terminal Header */}
            <div className={`border-b ${primary.replace('text', 'border')}/30 px-4 py-2 flex items-center justify-between rounded-t-lg bg-black/40 shrink-0`}>
                <div className="flex items-center gap-2">
                    <Terminal className={`w-4 h-4 ${primary}`} />
                    <span className={`text-xs font-mono ${primary}`}>
                        SENTINELA://{theme.name.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-500">Alvo: {safeName}</span>
                    <span className="text-slate-500">DEF: {defenseLevel}</span>
                </div>
            </div>

            {/* Terminal Body */}
            <div
                className={`${theme.cssVars.bg} border-2 ${getBorderClass()} rounded-b-lg p-6 h-full flex flex-col transition-all duration-300 font-mono overflow-hidden`}
            >
                {/* Objective Banner */}
                <div className="mb-4 p-2 border border-dashed border-white/10 rounded bg-white/5 flex items-center gap-3">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <div className="text-xs font-mono">
                        <span className="text-slate-500">MISSÃO: </span>
                        {mode === "classic" ? (
                            <span className="text-cyan-400">Extrair a Senha Secreta (oculta)</span>
                        ) : (
                            <span className="text-yellow-400">
                                Injeção: Faça a IA dizer exatamente: <span className="text-white bg-white/10 px-1 font-bold">"{secretWord}"</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Output Area */}
                <div
                    ref={outputRef}
                    className="flex-1 overflow-y-auto mb-4 text-sm scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2 min-h-0 space-y-4"
                >
                    {/* System Init */}
                    <div className={`${primary} opacity-80`}>
                        <p>&gt; Sistema Sentinela inicializado...</p>
                        <p>&gt; Modo de Jogo Detectado: {mode?.toUpperCase()}</p>
                        <p>&gt; Tema carregado: {theme.name}</p>
                        <p className={`${secondary} mt-1`}>
                            &gt; Histórico de conexão recuperado: {history.length} entradas.
                        </p>
                    </div>

                    {/* HISTORY ITEMS */}
                    {history.map((item: any) => (
                        <div key={item.id} className="opacity-70 hover:opacity-100 transition-opacity">
                            {/* User Prompt */}
                            <div className="flex gap-2 mb-1">
                                <span className={`${secondary} font-bold`}>USUÁRIO &gt;</span>
                                <span className={`${primary}`}>{item.inputPrompt}</span>
                            </div>
                            {/* AI Response */}
                            <div className={`p-3 rounded border border-slate-800 bg-black/20 text-slate-300`}>
                                <div className="flex items-center gap-2 mb-1">
                                    {item.success ? (
                                        <Skull className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <Shield className="w-3 h-3 text-red-500" />
                                    )}
                                    <span className={item.success ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                                        {item.success ? "SISTEMA VIOLADO" : "ACESSO NEGADO"}
                                    </span>
                                </div>
                                <div className="whitespace-pre-wrap">{item.aiResponse}</div>
                            </div>
                        </div>
                    ))}

                    {/* CURRENT INTERACTION */}
                    {state && (
                        <div className="opacity-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className={`mt-4 p-4 bg-black/30 rounded border border-${secondary.split('-')[1]}-500/30`}>
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
                                        {state.stylePoints && state.stylePoints > 0 && (
                                            <div className="text-pink-400">
                                                PONTOS DE ESTILO: +{state.stylePoints}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isPending && (
                        <div className="mt-6 text-yellow-500 animate-pulse">
                            &gt; Injetando payload... Descriptografando neural link...
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <form ref={formRef} action={formAction} className="space-y-4 shrink-0">
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
                            className={`w-full bg-transparent border-none outline-none ${primary} font-mono text-sm pl-6 pr-4 py-3 resize-none min-h-[80px] placeholder:text-slate-600 disabled:opacity-50 focus:ring-0`}
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
                        {showCursor && !isPending && (
                            <div className={`absolute right-4 bottom-3 w-2 h-4 ${secondary.replace('text', 'bg')}`} />
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Custo: {GAME_CONFIG.ATTACK_COST} CR</span>
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
