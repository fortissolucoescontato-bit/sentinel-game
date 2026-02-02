# 🎨 Guia de Componentes Shadcn/UI

## Como Adicionar Componentes

Para adicionar componentes do Shadcn/UI ao projeto, use o comando:

```bash
npx shadcn@latest add [nome-do-componente]
```

## Componentes Recomendados para Começar

### Navegação e Layout
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add navigation-menu
npx shadcn@latest add separator
npx shadcn@latest add tabs
```

### Formulários
```bash
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add slider
```

### Feedback e Notificações
```bash
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add badge
npx shadcn@latest add progress
npx shadcn@latest add skeleton
```

### Overlays
```bash
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
npx shadcn@latest add tooltip
npx shadcn@latest add sheet
npx shadcn@latest add hover-card
```

### Dados e Visualização
```bash
npx shadcn@latest add table
npx shadcn@latest add avatar
npx shadcn@latest add accordion
npx shadcn@latest add collapsible
```

## Exemplo de Uso

Depois de adicionar um componente, você pode importá-lo assim:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
        <CardDescription>Descrição do card</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Clique aqui</Button>
      </CardContent>
    </Card>
  )
}
```

## Customização

Todos os componentes Shadcn/UI são totalmente customizáveis. Eles são adicionados diretamente ao seu projeto em `components/ui/`, então você pode modificá-los como quiser.

### Tema Atual
- **Base Color**: Slate
- **Mode**: Dark (forçado)
- **Style**: New York
- **Icon Library**: Lucide React

## Documentação Oficial

Para mais informações sobre cada componente, visite:
https://ui.shadcn.com/docs/components

## Dicas

1. **Componentes são copiados, não instalados**: Você tem controle total sobre o código
2. **Totalmente customizáveis**: Modifique os componentes em `components/ui/` como quiser
3. **Type-safe**: Todos os componentes são TypeScript
4. **Acessíveis**: Construídos com Radix UI para máxima acessibilidade
5. **Tema integrado**: Já configurados com o tema Slate dark mode
