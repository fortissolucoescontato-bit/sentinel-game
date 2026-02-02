# 🔗 Como Obter a Connection String do Supabase

## Opção 1: Via Dashboard (Recomendado)

### Passo a Passo Visual:

1. **Acesse o Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Selecione seu Projeto**
   - Se não tiver projeto, clique em "New Project"
   - Escolha um nome, senha e região

3. **Vá em Settings (Configurações)**
   - Clique no ícone de ⚙️ (engrenagem) no menu lateral
   - Ou acesse: `https://supabase.com/dashboard/project/SEU_PROJETO/settings/database`

4. **Encontre a Connection String**
   - Role até a seção **"Connection string"**
   - Você verá várias abas: **URI**, **JDBC**, **Pooler**, etc.

5. **Copie a URI Correta**
   
   **Para Drizzle ORM, use a aba "Connection Pooling" → "Transaction Mode":**
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

   ⚠️ **IMPORTANTE**: 
   - Substitua `[YOUR-PASSWORD]` pela senha do seu projeto
   - Use a porta **6543** (pooler) para melhor performance
   - Mantenha o `?sslmode=require` no final se aparecer

### Exemplo de Connection String:

```env
# Formato completo
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:SuaSenhaAqui123@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

## Opção 2: Via Supabase CLI (Avançado)

Se você tem o Supabase CLI instalado:

```bash
# Login
supabase login

# Listar projetos
supabase projects list

# Obter connection string
supabase db remote --project-ref SEU_PROJECT_REF
```

## 📝 Configurar no Projeto

1. **Abra o arquivo `.env.local`**
   ```bash
   code .env.local
   # ou
   nano .env.local
   ```

2. **Cole a connection string**
   ```env
   DATABASE_URL="postgresql://postgres.xxxxx:SUA_SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Salve o arquivo** (Ctrl+S ou Cmd+S)

## 🚀 Executar Setup

Agora você pode executar o setup de 3 formas:

### Forma 1: Script Interativo (Mais Fácil)
```bash
./setup-db.sh
```

### Forma 2: Comandos Manuais
```bash
# Push schema
npm run db:push

# Seed dados
npm run db:seed

# Abrir Studio
npm run db:studio
```

### Forma 3: Tudo de uma vez
```bash
npm run db:push && npm run db:seed && npm run db:studio
```

## ✅ Verificar se Funcionou

### No Terminal:
Você deve ver mensagens como:
```
✅ Created users:
   - alice_hacker (alice@sentinel.dev) - 5000 credits - pro
   - bob_defender (bob@sentinel.dev) - 3000 credits - free
```

### No Supabase Dashboard:
1. Vá em **Table Editor**
2. Você verá 3 tabelas:
   - `users` (2 rows)
   - `safes` (2 rows)
   - `logs` (0 rows)

### No Drizzle Studio:
1. Acesse `https://local.drizzle.studio`
2. Navegue pelas tabelas
3. Veja os dados inseridos

## 🆘 Troubleshooting

### Erro: "password authentication failed"
❌ **Problema**: Senha incorreta
✅ **Solução**: Verifique a senha no Supabase Dashboard → Settings → Database

### Erro: "connection refused"
❌ **Problema**: URL incorreta ou projeto pausado
✅ **Solução**: 
- Verifique se o projeto está ativo no Supabase
- Confirme se copiou a URL completa

### Erro: "SSL connection required"
❌ **Problema**: Falta SSL mode
✅ **Solução**: Adicione no final da URL:
```
?sslmode=require
```

### Erro: "relation does not exist"
❌ **Problema**: Schema não foi criado
✅ **Solução**: Execute `npm run db:push` primeiro

## 📞 Ainda com Problemas?

Me envie:
1. A mensagem de erro completa
2. O comando que você executou
3. (Opcional) Screenshot do erro

Vou te ajudar a resolver! 🚀
