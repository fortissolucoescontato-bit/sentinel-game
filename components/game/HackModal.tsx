"use client";

import { useEffect, useRef } from "react";
import { X, Shield } from "lucide-react";
import { HackTerminal } from "./HackTerminal";
import type { Safe } from "@/db/schema";

interface HackModalProps {
    safe: Safe & { user: { username: string } };
    onClose: () => void;
    onSuccess: () => void;
}

export function HackModal({ safe, onClose, onSuccess }: HackModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="w-full max-w-5xl h-[90dvh] md:h-[80vh] bg-slate-950 border border-slate-800 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold font-mono text-cyan-400 flex items-center gap-2">
                            ATACANDO: Cofre de {safe.user.username}
                        </h2>
                        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Nível de Defesa: {safe.defenseLevel}/5
                            </span>
                            <span>|</span>
                            <span>Custo: 10 créditos</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-500/20 rounded-lg group transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400 group-hover:text-red-400" />
                    </button>
                </div>

                {/* Modal Content - Terminal */}
                <div className="flex-1 p-4 overflow-hidden bg-slate-950">
                    <HackTerminal
                        safeId={safe.id}
                        safeName={`Cofre de ${safe.user.username}`}
                        defenseLevel={safe.defenseLevel}
                        onSuccess={onSuccess}
                    />
                </div>
            </div>
        </div>
    );
}
