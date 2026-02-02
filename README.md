# 🛡️ SENTINEL - Cyberpunk Clean Stack

Um projeto Next.js 15 moderno com T3 Stack, Tailwind CSS v4, e Shadcn/UI configurado com tema cyberpunk.

## 🚀 Stack Tecnológica

- **Next.js 15** - App Router com TypeScript
- **Tailwind CSS v4** - Nova sintaxe CSS-first
- **Shadcn/UI** - Componentes com tema Slate (Dark Mode)
- **Lucide React** - Ícones modernos
- **TypeScript** - Type safety completo
- **ESLint** - Linting configurado

## 📁 Estrutura de Pastas

```
sentinel-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout raiz (dark mode forçado)
│   ├── page.tsx           # Landing page principal
│   └── globals.css        # Estilos globais (Tailwind v4)
├── components/
│   └── ui/                # Componentes Shadcn/UI
│       └── glitch-text.tsx # Componente de texto com efeito glitch
├── lib/                   # Utilitários
│   └── utils.ts          # Funções helper (cn, etc)
├── db/                    # Database (futuro)
├── actions/               # Server Actions (futuro)
└── public/               # Assets estáticos
```

## 🎨 Visual Theme: Cyberpunk Clean

A landing page apresenta:

- ✨ **Efeito Glitch** no título "SENTINEL"
- 🌐 **Grid Animado** de fundo
- 💫 **Orbs Brilhantes** com blur e pulse
- 📺 **Scanline Effect** para estética retro-futurista
- 🎯 **Cards de Features** com hover effects
- 🔮 **Gradientes Neon** (cyan, purple, pink)
- 📊 **Status Bar** na parte inferior

## 🛠️ Comandos

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint
```

## 🌐 Desenvolvimento Local

O servidor de desenvolvimento roda em: `http://localhost:3000`

## 📦 Dependências Principais

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "tailwindcss": "^4",
  "lucide-react": "latest",
  "typescript": "^5"
}
```

## 🎯 Próximos Passos

1. Adicionar mais componentes Shadcn/UI conforme necessário
2. Configurar banco de dados (Prisma/Drizzle)
3. Implementar Server Actions na pasta `actions/`
4. Adicionar autenticação (NextAuth.js)
5. Configurar tRPC para type-safe APIs

## 📝 Notas

- **Dark Mode**: Forçado permanentemente via `className="dark"` no `<html>`
- **Tailwind v4**: Usando a nova sintaxe CSS-first com `@theme inline`
- **Shadcn/UI**: Tema Slate configurado
- **TypeScript**: Strict mode habilitado

---

**Desenvolvido com 💜 usando T3 Stack**
