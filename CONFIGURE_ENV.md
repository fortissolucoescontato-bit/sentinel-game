# 🔐 INSTRUÇÕES PARA CONFIGURAR O .ENV.LOCAL

## Passo 1: Encontre sua senha do Supabase

A senha foi definida quando você criou o projeto Supabase.

Se você esqueceu, pode resetar em:
Supabase Dashboard → Settings → Database → "Reset database password"

## Passo 2: Edite o arquivo .env.local

Substitua a linha DATABASE_URL com:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@db.cbelstpchxoumslfco.supabase.co:5432/postgres"
```

⚠️ Substitua `SUA_SENHA_AQUI` pela senha real do seu projeto!

## Passo 3: Salve o arquivo

Ctrl+S (ou Cmd+S no Mac)

## Passo 4: Execute os comandos

```bash
# 1. Push o schema para criar as tabelas
npm run db:push

# 2. Popular com dados de teste
npm run db:seed

# 3. (Opcional) Abrir Drizzle Studio
npm run db:studio
```

## ✅ Exemplo Completo

Se sua senha for "minhaSenha123", o .env.local ficaria assim:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:minhaSenha123@db.cbelstpchxoumslfco.supabase.co:5432/postgres"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚀 Ou use o script automático:

```bash
./setup-db.sh
```

Este script vai te guiar por todo o processo!
