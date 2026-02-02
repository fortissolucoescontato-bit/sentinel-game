# 🎮 Game Components

Componentes React para a interface do jogo SENTINEL.

## 📁 Componentes

### `HackTerminal.tsx`
Terminal de hacking principal com visual cyberpunk.

**Features:**
- ✅ **useActionState** (React 19) para gerenciar estado do formulário
- ✅ **Typewriter Effect** - Texto da IA aparece letra por letra
- ✅ **Cursor Piscando** - Cursor animado no input
- ✅ **Bordas Animadas** - Verde neon (sucesso) ou vermelho (falha)
- ✅ **Loading States** - Indicador visual durante ataque
- ✅ **Sound Support** - Preparado para use-sound (sons comentados)
- ✅ **Responsive** - Funciona em mobile e desktop

**Props:**
```typescript
{
  attackerId: number;
  safeId: number;
  safeName: string;
  defenseLevel: number;
  onSuccess?: () => void;
}
```

**Efeitos Visuais:**
- Typewriter: 30ms por caractere
- Cursor: Pisca a cada 500ms
- Borda: Pulsa quando sucesso/falha
- Loading: Barra animada durante ataque

### `SafeList.tsx`
Lista de safes disponíveis para atacar.

**Features:**
- ✅ Separação entre safes ativos e crackeados
- ✅ Indicadores de dificuldade (cores por nível)
- ✅ Badges de tier do usuário
- ✅ Seleção visual do target
- ✅ Grid responsivo

**Props:**
```typescript
{
  safes: Array<Safe & { user: { id, username, tier } }>;
  selectedSafeId: number | null;
  onSelectSafe: (safeId: number) => void;
}
```

### `UserStats.tsx`
Painel de estatísticas do usuário.

**Features:**
- ✅ Exibição de créditos
- ✅ Taxa de sucesso
- ✅ Total de ataques
- ✅ Breaches bem-sucedidos
- ✅ Barra de progresso de rank
- ✅ Badges de tier coloridos

**Props:**
```typescript
{
  user: User;
  successfulAttacks?: number;
  totalAttacks?: number;
}
```

## 🎨 Design System

### Cores por Tier:
- **Free**: Slate (cinza)
- **Pro**: Cyan (ciano)
- **Elite**: Purple (roxo)

### Cores por Dificuldade:
- **Level 1**: Verde
- **Level 2**: Amarelo
- **Level 3**: Laranja
- **Level 4**: Vermelho
- **Level 5**: Roxo

### Animações:
- `border-pulse-success`: Borda verde pulsante
- `border-pulse-error`: Borda vermelha pulsante
- `pulse`: Animação padrão do Tailwind
- `animate-pulse`: Fade in/out

## 🔊 Sons (Preparado)

O HackTerminal está preparado para usar `use-sound`. Basta descomentar as linhas e adicionar os arquivos de som em `/public/sounds/`:

```typescript
const [playKeypress] = useSound("/sounds/keypress.mp3", { volume: 0.3 });
const [playSuccess] = useSound("/sounds/success.mp3", { volume: 0.5 });
const [playError] = useSound("/sounds/error.mp3", { volume: 0.5 });
const [playTyping] = useSound("/sounds/typing.mp3", { volume: 0.2 });
```

**Sons Recomendados:**
- `keypress.mp3` - Som de tecla (curto, sutil)
- `success.mp3` - Som de vitória (triunfante)
- `error.mp3` - Som de erro (alerta)
- `typing.mp3` - Som de digitação (loop)

## 💡 Uso

### Exemplo Básico:

```typescript
import { HackTerminal } from "@/components/game/HackTerminal";

export default function GamePage() {
  return (
    <HackTerminal
      attackerId={1}
      safeId={2}
      safeName="Bob's Safe"
      defenseLevel={3}
      onSuccess={() => {
        console.log("Safe cracked!");
        // Refresh data, show celebration, etc.
      }}
    />
  );
}
```

### Exemplo Completo:

Veja `/app/game/page.tsx` para um exemplo completo integrando todos os componentes.

## 🚀 Próximas Melhorias

- [ ] Adicionar sons reais
- [ ] Animação de partículas no sucesso
- [ ] Chat entre jogadores
- [ ] Notificações em tempo real
- [ ] Modo espectador
- [ ] Replay de ataques
- [ ] Achievements visuais

## 📱 Responsividade

Todos os componentes são totalmente responsivos:
- **Mobile**: Layout em coluna única
- **Tablet**: Grid 2 colunas
- **Desktop**: Grid 3 colunas (game page)

## ⚡ Performance

- Server Components onde possível
- Client Components apenas quando necessário
- Lazy loading de sons
- Debounce em inputs (se necessário)
