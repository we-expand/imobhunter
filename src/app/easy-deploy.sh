#!/bin/bash

# Script de Deploy Simplificado para Ethereal (ImobHunter)
# Basta rodar: sh easy-deploy.sh

echo "🚀 Iniciando Deploy Simplificado..."

# 1. Tentar Login (se não estiver logado)
echo "🔑 Verificando login..."
npx supabase login --no-browser || echo "⚠️  Se falhar, faça login manual"

# 2. Linkar Projeto
echo "🔗 Conectando ao projeto evdyqlrssgsktctjruuq..."
npx supabase link --project-ref evdyqlrssgsktctjruuq

# 3. Corrigir Pastas
if [ -d "supabase/functions/server" ]; then
    echo "📂 Renomeando pasta 'server' para 'make-server'..."
    mv supabase/functions/server supabase/functions/make-server
fi

# 4. Deploy
echo "☁️  Enviando para a nuvem..."
npx supabase functions deploy make-server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt

echo "✅ Concluído! Se viu 'Deploy complete' acima, deu tudo certo."
