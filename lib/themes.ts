export type ThemeId = 'dracula' | 'matrix' | 'synthwave' | 'amber' | 'crimson';

export interface ThemeConfig {
    id: ThemeId;
    name: string;
    description: string;
    priceCredits: number;
    priceStylePoints: number; // 0 means free/credits only
    cssVars: {
        primary: string;    // Main text color
        secondary: string;  // Accents
        bg: string;         // Terminal background
    };
    previewColors: string; // Tailwind classes for preview
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
    dracula: {
        id: "dracula",
        name: "Drácula",
        description: "Tema padrão do terminal. Confiável e limpo.",
        priceCredits: 0,
        priceStylePoints: 0,
        cssVars: {
            primary: "text-slate-200",
            secondary: "text-purple-400",
            bg: "bg-slate-950",
        },
        previewColors: "from-slate-800 to-purple-900",
    },
    matrix: {
        id: "matrix",
        name: "The Construct",
        description: "Fósforo verde clássico. Acorde, Neo.",
        priceCredits: 500,
        priceStylePoints: 0,
        cssVars: {
            primary: "text-green-400",
            secondary: "text-green-600",
            bg: "bg-black",
        },
        previewColors: "from-black via-green-900 to-black",
    },
    synthwave: {
        id: "synthwave",
        name: "Neon Nights",
        description: "Vibe retro-futurista com rosa choque e ciano.",
        priceCredits: 1000,
        priceStylePoints: 0,
        cssVars: {
            primary: "text-pink-400",
            secondary: "text-cyan-400",
            bg: "bg-indigo-950",
        },
        previewColors: "from-indigo-900 via-purple-900 to-pink-900",
    },
    amber: {
        id: "amber",
        name: "Fallout Retro",
        description: "Monitor âmbar monocromático da velha guarda.",
        priceCredits: 0,
        priceStylePoints: 500, // Requires Style Points!
        cssVars: {
            primary: "text-amber-500",
            secondary: "text-amber-700",
            bg: "bg-orange-950/20",
        },
        previewColors: "from-orange-900 to-amber-900",
    },
    crimson: {
        id: "crimson",
        name: "Red Alert",
        description: "Tema vermelho agressivo para hackers de elite.",
        priceCredits: 2000,
        priceStylePoints: 200,
        cssVars: {
            primary: "text-red-500",
            secondary: "text-red-700",
            bg: "bg-red-950/10",
        },
        previewColors: "from-red-900 to-black",
    }
};
