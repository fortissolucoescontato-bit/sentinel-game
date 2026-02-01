# 🗄️ Database Setup - Drizzle ORM + Supabase/Neon

## 📋 Schema Overview

### Tables

#### **users**
Armazena informações dos usuários do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | serial | Primary key |
| email | varchar(255) | Email único do usuário |
| username | varchar(100) | Username único |
| credits | integer | Créditos disponíveis (default: 1000) |
| tier | varchar(50) | Nível da conta (free, pro, elite) |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### **safes**
Representa os "cofres" que os usuários criam para proteger suas palavras secretas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | serial | Primary key |
| user_id | integer | Foreign key para users |
| secret_word | varchar(255) | Palavra secreta a ser protegida |
| system_prompt | text | Prompt do sistema para defesa |
| defense_level | integer | Nível de defesa (1-5) |
| is_cracked | boolean | Se o cofre foi quebrado |
| created_at | timestamp | Data de criação |
| updated_at | timestamp | Data de atualização |

#### **logs**
Registra todas as tentativas de ataque aos cofres.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | serial | Primary key |
| attacker_id | integer | Foreign key para users (atacante) |
| defender_id | integer | Foreign key para users (defensor) |
| safe_id | integer | Foreign key para safes (nullable) |
| input_prompt | text | Prompt enviado pelo atacante |
| ai_response | text | Resposta da IA |
| success | boolean | Se o ataque foi bem-sucedido |
| credits_spent | integer | Créditos gastos (default: 10) |
| created_at | timestamp | Data do ataque |

## 🚀 Setup Instructions

### 1. Configure Database URL

Edite o arquivo `.env.local` e adicione sua connection string:

**Para Supabase:**
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

**Para Neon:**
```env
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require"
```

### 2. Generate Migrations

```bash
npm run db:generate
```

### 3. Push Schema to Database

```bash
npm run db:push
```

### 4. Seed Database with Test Data

```bash
npm run db:seed
```

## 📦 Test Data

O seed cria 2 usuários de teste:

### User 1: Alice (Hacker)
- **Email**: alice@sentinel.dev
- **Username**: alice_hacker
- **Credits**: 5000
- **Tier**: pro
- **Safe**: Defense Level 3, Secret: "CYBERPUNK2077"

### User 2: Bob (Defender)
- **Email**: bob@sentinel.dev
- **Username**: bob_defender
- **Credits**: 3000
- **Tier**: free
- **Safe**: Defense Level 2, Secret: "MATRIX1999"

## 🛠️ Available Scripts

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly to database (no migration files)
npm run db:push

# Open Drizzle Studio (visual database browser)
npm run db:studio

# Seed database with test data
npm run db:seed
```

## 🔍 Drizzle Studio

Para visualizar e editar dados no navegador:

```bash
npm run db:studio
```

Isso abrirá uma interface visual em `https://local.drizzle.studio`

## 📝 TypeScript Types

Todos os tipos são automaticamente inferidos do schema:

```typescript
import { User, NewUser, Safe, NewSafe, Log, NewLog } from "@/db/schema";

// Select types (dados do banco)
const user: User = await db.query.users.findFirst();

// Insert types (dados para inserir)
const newUser: NewUser = {
  email: "test@example.com",
  username: "testuser",
  // credits, tier, timestamps são opcionais (têm defaults)
};
```

## 🔗 Relations

O schema define relações entre as tabelas:

- **users** → **safes** (one-to-many)
- **users** → **logs** (one-to-many, como atacante e defensor)
- **safes** → **logs** (one-to-many)

Exemplo de query com relações:

```typescript
import { db } from "@/db";

// Buscar usuário com todos os seus safes
const userWithSafes = await db.query.users.findFirst({
  where: (users, { eq }) => eq(users.id, 1),
  with: {
    safes: true,
    attackLogs: true,
    defenseLogs: true,
  },
});
```

## 🔒 Security Notes

- Todas as senhas devem ser hasheadas antes de armazenar
- Use prepared statements (Drizzle faz isso automaticamente)
- Valide todos os inputs antes de inserir no banco
- Use transactions para operações críticas
- Implemente rate limiting para prevenir abuse

## 📚 Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Neon Database](https://neon.tech/docs)
- [Supabase Docs](https://supabase.com/docs)
