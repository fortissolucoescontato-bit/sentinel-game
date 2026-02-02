# 📁 Database Layer

Esta pasta contém toda a configuração e lógica do banco de dados usando **Drizzle ORM**.

## 📄 Arquivos

### `schema.ts`
Define o schema completo do banco de dados:
- **users**: Usuários do sistema
- **safes**: Cofres com palavras secretas
- **logs**: Histórico de ataques

Também exporta tipos TypeScript para cada tabela.

### `index.ts`
Configuração da conexão com o banco de dados usando Neon serverless.

### `queries.ts`
Helpers type-safe para operações comuns:
- `userQueries`: CRUD de usuários
- `safeQueries`: CRUD de safes
- `logQueries`: CRUD de logs
- `executeAttack`: Transação completa de ataque

### `seed.ts`
Script para popular o banco com dados de teste.

### `examples.ts`
Exemplos de uso das queries (para referência).

## 🚀 Quick Start

1. Configure o `.env.local` com sua `DATABASE_URL`
2. Push o schema: `npm run db:push`
3. Seed o banco: `npm run db:seed`
4. Abra o Drizzle Studio: `npm run db:studio`

## 💡 Usage

```typescript
import { userQueries, safeQueries } from "@/db/queries";

// Criar usuário
const user = await userQueries.create({
  email: "test@example.com",
  username: "testuser",
});

// Buscar safes do usuário
const safes = await safeQueries.findByUserId(user.id);
```

## 🔒 Type Safety

Todos os tipos são inferidos automaticamente:

```typescript
import type { User, Safe, Log } from "@/db/schema";

const user: User = await userQueries.findById(1);
// TypeScript sabe todas as propriedades!
```
