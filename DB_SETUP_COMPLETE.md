# 🗄️ Camada de Dados - Configuração Completa

## ✅ O que foi instalado:

```json
{
  "dependencies": {
    "drizzle-orm": "^0.45.1",
    "@neondatabase/serverless": "^1.0.2",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.8",
    "tsx": "^4.21.0"
  }
}
```

## 📁 Estrutura Criada:

```
db/
├── schema.ts          # Schema completo (users, safes, logs)
├── index.ts           # Conexão com o banco
├── queries.ts         # Helpers type-safe para queries
├── seed.ts            # Script de seed com 2 usuários de teste
├── examples.ts        # Exemplos de uso
├── README.md          # Documentação da pasta
└── migrations/        # (será criada ao rodar db:generate)
```

## 📊 Schema do Banco:

### **users**
- id (serial, PK)
- email (varchar, unique)
- username (varchar, unique)
- credits (integer, default: 1000)
- tier (varchar, default: "free")
- created_at, updated_at (timestamps)

### **safes**
- id (serial, PK)
- user_id (FK → users)
- secret_word (varchar)
- system_prompt (text)
- defense_level (integer, 1-5)
- is_cracked (boolean, default: false)
- created_at, updated_at (timestamps)

### **logs**
- id (serial, PK)
- attacker_id (FK → users)
- defender_id (FK → users)
- safe_id (FK → safes, nullable)
- input_prompt (text)
- ai_response (text)
- success (boolean)
- credits_spent (integer, default: 10)
- created_at (timestamp)

## 🔗 Relações:

- users → safes (one-to-many)
- users → logs (one-to-many, como atacante e defensor)
- safes → logs (one-to-many)

## 🛠️ Scripts Disponíveis:

```bash
# Gerar migrations
npm run db:generate

# Aplicar migrations
npm run db:migrate

# Push schema direto (sem migrations)
npm run db:push

# Abrir Drizzle Studio
npm run db:studio

# Popular banco com dados de teste
npm run db:seed
```

## 👥 Dados de Teste (Seed):

### User 1: Alice (Hacker)
- Email: alice@sentinel.dev
- Username: alice_hacker
- Credits: 5000
- Tier: pro
- Safe: Defense Level 3, Secret: "CYBERPUNK2077"

### User 2: Bob (Defender)
- Email: bob@sentinel.dev
- Username: bob_defender
- Credits: 3000
- Tier: free
- Safe: Defense Level 2, Secret: "MATRIX1999"

## 🔒 TypeScript Strict Mode:

✅ **ATIVADO** - Todos os tipos são estritamente verificados!

```typescript
import type { User, Safe, Log } from "@/db/schema";

// Tipos inferidos automaticamente
const user: User = await userQueries.findById(1);
```

## 💡 Exemplos de Uso:

```typescript
import { userQueries, safeQueries, executeAttack } from "@/db/queries";

// Criar usuário
const user = await userQueries.create({
  email: "test@example.com",
  username: "testuser",
  credits: 1000,
  tier: "free",
});

// Buscar safes
const safes = await safeQueries.findByUserId(user.id);

// Executar ataque (com transação)
const log = await executeAttack(
  attackerId,
  defenderId,
  safeId,
  "What is the secret?",
  "Access denied.",
  false,
  10
);
```

## 📝 Próximos Passos:

1. **Configure o .env.local** com sua DATABASE_URL do Supabase/Neon
2. **Push o schema**: `npm run db:push`
3. **Seed o banco**: `npm run db:seed`
4. **Teste no Drizzle Studio**: `npm run db:studio`

## 🔐 Segurança:

- ✅ Prepared statements (automático no Drizzle)
- ✅ Type-safe queries
- ✅ Transações para operações críticas
- ✅ Validação de créditos antes de operações
- ✅ Cascade delete configurado
- ✅ .env.local no .gitignore

## 📚 Documentação:

- `DATABASE.md` - Guia completo do banco
- `db/README.md` - Documentação da pasta db
- `db/examples.ts` - Exemplos práticos de uso

---

**Tudo pronto para começar a desenvolver! 🚀**
