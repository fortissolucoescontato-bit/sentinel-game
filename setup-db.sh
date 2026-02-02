#!/bin/bash

# 🚀 SENTINEL - Database Setup Helper
# Este script ajuda a configurar o banco de dados Supabase

echo "🛡️  SENTINEL - Database Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Arquivo .env.local não encontrado!"
    echo ""
    echo "📝 Criando .env.local a partir do template..."
    cp .env.example .env.local
    echo "✅ Arquivo .env.local criado!"
    echo ""
fi

# Check if DATABASE_URL is configured
if grep -q "DATABASE_URL=\"postgresql://user:password@host:port/database\"" .env.local; then
    echo "⚠️  DATABASE_URL ainda não foi configurada!"
    echo ""
    echo "📋 Siga estes passos:"
    echo ""
    echo "1. Acesse: https://supabase.com/dashboard"
    echo "2. Vá em Settings → Database"
    echo "3. Copie a Connection String (URI)"
    echo "4. Cole no arquivo .env.local"
    echo ""
    echo "Depois execute este script novamente!"
    exit 1
fi

echo "✅ DATABASE_URL configurada!"
echo ""

# Ask if user wants to push schema
read -p "🔄 Deseja fazer push do schema para o Supabase? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "📤 Fazendo push do schema..."
    npm run db:push
    echo ""
fi

# Ask if user wants to seed
read -p "🌱 Deseja popular o banco com dados de teste? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🌱 Populando banco de dados..."
    npm run db:seed
    echo ""
fi

# Ask if user wants to open Drizzle Studio
read -p "🎨 Deseja abrir o Drizzle Studio? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🎨 Abrindo Drizzle Studio..."
    npm run db:studio
fi

echo ""
echo "✨ Setup concluído!"
echo ""
echo "📚 Próximos passos:"
echo "   - Verifique as tabelas no Supabase Dashboard"
echo "   - Teste as queries em db/examples.ts"
echo "   - Comece a desenvolver! 🚀"
