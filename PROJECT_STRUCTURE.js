// Estrutura de Pastas do Projeto SENTINEL
// Organização limpa seguindo as melhores práticas do T3 Stack

/*
📁 sentinel-app/
│
├── 📁 app/                          # Next.js 15 App Router
│   ├── layout.tsx                   # Root layout (dark mode forçado)
│   ├── page.tsx                     # Landing page principal
│   ├── globals.css                  # Tailwind CSS v4 (CSS-first)
│   └── favicon.ico                  # Ícone do site
│
├── 📁 components/                   # Componentes React
│   └── 📁 ui/                       # Componentes Shadcn/UI
│       └── glitch-text.tsx          # Componente de texto glitch
│
├── 📁 lib/                          # Utilitários e helpers
│   └── utils.ts                     # Funções helper (cn, etc)
│
├── 📁 db/                           # Database (futuro)
│   └── (Prisma/Drizzle schemas)
│
├── 📁 actions/                      # Server Actions
│   └── (Server-side actions)
│
├── 📁 public/                       # Assets estáticos
│   └── (imagens, fonts, etc)
│
├── 📁 node_modules/                 # Dependências
│
├── .gitignore                       # Git ignore
├── package.json                     # Dependências do projeto
├── tsconfig.json                    # Configuração TypeScript
├── next.config.ts                   # Configuração Next.js
├── postcss.config.mjs               # PostCSS (Tailwind)
├── eslint.config.mjs                # ESLint config
└── README.md                        # Documentação

STACK TECNOLÓGICA:
==================
✅ Next.js 15 (App Router)
✅ TypeScript 5
✅ Tailwind CSS v4 (CSS-first syntax)
✅ Shadcn/UI (Slate theme, Dark mode)
✅ Lucide React (ícones)
✅ ESLint
✅ Turbopack (bundler)

PRÓXIMOS PASSOS:
================
1. Adicionar mais componentes Shadcn/UI conforme necessário
2. Configurar banco de dados (Prisma ou Drizzle ORM)
3. Implementar Server Actions na pasta actions/
4. Adicionar autenticação (NextAuth.js ou Clerk)
5. Configurar tRPC para APIs type-safe
6. Adicionar testes (Vitest + Testing Library)
7. Configurar CI/CD (GitHub Actions)
8. Deploy (Vercel recomendado)

COMANDOS ÚTEIS:
===============
npm run dev          # Desenvolvimento (localhost:3000)
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # Executar ESLint

npx shadcn@latest add [component]  # Adicionar componentes Shadcn/UI

NOTAS IMPORTANTES:
==================
- Dark mode está FORÇADO via className="dark" no <html>
- Tailwind v4 usa a nova sintaxe @theme inline
- Shadcn/UI configurado com tema Slate
- TypeScript em strict mode
- ESLint configurado com regras do Next.js
*/
